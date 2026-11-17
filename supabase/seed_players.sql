-- Initial player pool (Nov 2026). Run once in the SQL editor.
-- Skips a name if it already exists (case-insensitive).

insert into public.players (name, position)
select v.name, v.position
from (
  values
    ('Richie', 'DEF'::public.player_position),
    ('Brymo', 'FWD'),
    ('Daddy Ray', 'DEF'),
    ('IBB', 'MID'),
    ('Logito', 'GK'),
    ('Adams', 'DEF'),
    ('Alisson', 'DEF'),
    ('Ayo', 'DEF'),
    ('Big 5', 'DEF'),
    ('Buniyamin', 'DEF'),
    ('Deo', 'DEF'),
    ('Fawaz', 'DEF'),
    ('Tosin', 'DEF'),
    ('Justin', 'DEF'),
    ('Mikey', 'DEF'),
    ('Ndibe', 'DEF'),
    ('Prince', 'DEF'),
    ('SK', 'DEF'),
    ('Bobby', 'DEF'),
    ('Elite', 'DEF'),
    ('Kanye', 'DEF'),
    ('Korede', 'DEF'),
    ('Emmy', 'MID'),
    ('Abbah', 'MID'),
    ('Wahab', 'MID'),
    ('Billy', 'MID'),
    ('Chisom', 'MID'),
    ('Juwon', 'MID'),
    ('Tobi', 'MID'),
    ('Frank', 'MID'),
    ('Ibrahim G', 'MID'),
    ('Ladipo', 'MID'),
    ('Mitong', 'MID'),
    ('Tucha', 'MID'),
    ('Ricky', 'MID'),
    ('Mike', 'MID'),
    ('Kylez', 'MID'),
    ('Tosan', 'MID'),
    ('Audu', 'FWD'),
    ('Charles', 'FWD'),
    ('Ekene', 'FWD'),
    ('Haaland', 'FWD'),
    ('Ibrahim D', 'FWD'),
    ('Kaka', 'FWD'),
    ('Lamba', 'FWD'),
    ('Pamzi', 'FWD'),
    ('Pharooq', 'FWD'),
    ('Ray', 'FWD'),
    ('Shemshak', 'FWD'),
    ('Sule', 'FWD'),
    ('Victor', 'FWD'),
    ('Japeth', 'FWD'),
    ('Swanky', 'FWD'),
    ('Jamal', 'FWD'),
    ('Čalēb', 'FWD'),
    ('Ocheni', 'FWD'),
    ('Samin', 'GK')
) as v(name, position)
where not exists (
  select 1 from public.players p where lower(p.name) = lower(v.name)
);

-- Opening-price list treats Emmy as MID (was DEF in an earlier seed).
update public.players
set position = 'MID'
where lower(name) = 'emmy' and position is distinct from 'MID';
