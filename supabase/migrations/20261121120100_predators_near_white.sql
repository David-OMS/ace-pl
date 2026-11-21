-- Near-white kit that still reads on the light canvas (not flat #ffffff).
update public.teams
set color = '#ebe8e0'
where lower(name) like '%predator%';
