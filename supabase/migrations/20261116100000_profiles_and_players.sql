-- Accounts (profiles), football players, player claiming and player photos.

create type public.player_position as enum ('GK', 'DEF', 'MID', 'FWD');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles: one per login account. Admins are set by the developer with SQL, never from the app.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 40),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

create policy "Profiles are public"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Users may only change their display name; is_admin stays out of reach.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(
      coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
        nullif(split_part(new.email, '@', 1), ''),
        'Player'
      ),
      40
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

-- Players: football profiles created by admins. A login account can claim one player.

create table public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 40),
  position public.player_position not null,
  photo_path text,
  profile_id uuid unique references public.profiles (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

alter table public.players enable row level security;

create policy "Players are public"
on public.players for select
to anon, authenticated
using (true);

create policy "Admins manage players"
on public.players for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Claim tokens live in their own table so they are never exposed through the public players table.

create table public.player_claim_tokens (
  player_id uuid primary key references public.players (id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.player_claim_tokens enable row level security;

create policy "Admins manage claim tokens"
on public.player_claim_tokens for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create function public.create_claim_token_for_new_player()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.player_claim_tokens (player_id) values (new.id);
  return new;
end;
$$;

create trigger players_create_claim_token
after insert on public.players
for each row execute function public.create_claim_token_for_new_player();

create function public.claim_player(claim_token uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  claimed_player_id uuid;
begin
  if current_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if exists (select 1 from public.players p where p.profile_id = current_user_id) then
    raise exception 'already_linked';
  end if;

  -- Deleting the token makes each link single-use.
  delete from public.player_claim_tokens t
  where t.token = claim_token
    and exists (
      select 1 from public.players p where p.id = t.player_id and p.profile_id is null
    )
  returning t.player_id into claimed_player_id;

  if claimed_player_id is null then
    raise exception 'invalid_claim_token';
  end if;

  update public.players set profile_id = current_user_id where id = claimed_player_id;
  return claimed_player_id;
end;
$$;

revoke execute on function public.claim_player (uuid) from public, anon;
grant execute on function public.claim_player (uuid) to authenticated;

-- Player photos: public to view; uploaded by the linked player or an admin.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('player-photos', 'player-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create function public.can_manage_player_photo(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1
    from public.players p
    where p.profile_id = (select auth.uid())
      and p.id::text = (storage.foldername(object_name))[1]
  );
$$;

create function public.set_my_player_photo(new_photo_path text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.players p
  set photo_path = new_photo_path
  where p.profile_id = (select auth.uid())
    and new_photo_path like p.id::text || '/%';

  if not found then
    raise exception 'no_linked_player';
  end if;
end;
$$;

revoke execute on function public.set_my_player_photo (text) from public, anon;
grant execute on function public.set_my_player_photo (text) to authenticated;

create policy "Player photos: read"
on storage.objects for select
to authenticated
using (bucket_id = 'player-photos');

create policy "Player photos: upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'player-photos' and public.can_manage_player_photo(name));

create policy "Player photos: replace"
on storage.objects for update
to authenticated
using (bucket_id = 'player-photos' and public.can_manage_player_photo(name))
with check (bucket_id = 'player-photos' and public.can_manage_player_photo(name));

create policy "Player photos: delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'player-photos' and public.can_manage_player_photo(name));
