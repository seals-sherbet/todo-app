create table if not exists public.task_documents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  lists jsonb not null default '[]'::jsonb,
  tomorrow_queue jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  device_id text not null default ''
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.task_lists (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  collapsed boolean not null default false,
  type text not null default 'standard',
  show_details boolean not null default false,
  created_at timestamptz not null default now(),
  position integer not null default 0,
  updated_at timestamptz not null default now(),
  device_id text not null default ''
);

create table if not exists public.tasks (
  id text primary key,
  list_id text not null references public.task_lists(id) on delete cascade,
  title text not null,
  due date,
  priority text not null default 'normal',
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  position integer not null default 0,
  updated_at timestamptz not null default now(),
  device_id text not null default ''
);

create table if not exists public.list_members (
  list_id text not null references public.task_lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  primary key (list_id, user_id)
);

create table if not exists public.list_invites (
  list_id text not null references public.task_lists(id) on delete cascade,
  email text not null,
  role text not null default 'editor',
  invited_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  primary key (list_id, email)
);

create index if not exists tasks_list_id_position_idx on public.tasks(list_id, position);
create index if not exists task_lists_owner_position_idx on public.task_lists(owner_id, position);
create index if not exists list_invites_email_idx on public.list_invites(email);

alter table public.task_documents enable row level security;
alter table public.profiles enable row level security;
alter table public.task_lists enable row level security;
alter table public.tasks enable row level security;
alter table public.list_members enable row level security;
alter table public.list_invites enable row level security;

alter table public.task_documents replica identity full;
alter table public.task_lists replica identity full;
alter table public.tasks replica identity full;
alter table public.list_members replica identity full;
alter table public.list_invites replica identity full;

create or replace function public.is_task_list_owner(target_list_id text)
returns boolean
language sql
security definer
set search_path = public
return exists (
  select 1
  from public.task_lists
  where id = target_list_id
    and owner_id = auth.uid()
);

create or replace function public.can_access_task_list(target_list_id text)
returns boolean
language sql
security definer
set search_path = public
return exists (
  select 1
  from public.task_lists
  where id = target_list_id
    and owner_id = auth.uid()
)
or exists (
  select 1
  from public.list_members
  where list_id = target_list_id
    and user_id = auth.uid()
);

create or replace function public.can_edit_task_list(target_list_id text)
returns boolean
language sql
security definer
set search_path = public
return public.is_task_list_owner(target_list_id)
or exists (
  select 1
  from public.list_members
  where list_id = target_list_id
    and user_id = auth.uid()
    and role in ('editor', 'admin')
);

drop function if exists public.upsert_task_list(
  text,
  text,
  boolean,
  text,
  boolean,
  timestamptz,
  integer,
  timestamptz,
  text
);

create or replace function public.upsert_task_list(
  target_id text,
  target_name text,
  target_collapsed boolean,
  target_type text,
  target_show_details boolean,
  target_created_at timestamptz,
  target_position integer,
  target_updated_at timestamptz,
  target_device_id text
)
returns table(list_id text, list_owner_id uuid)
language plpgsql
security definer
set search_path = public
as '
begin
  if auth.uid() is null then
    raise exception ''Not signed in'';
  end if;

  return query
  insert into public.task_lists (
    id,
    owner_id,
    name,
    collapsed,
    type,
    show_details,
    created_at,
    position,
    updated_at,
    device_id
  )
  values (
    target_id,
    auth.uid(),
    target_name,
    target_collapsed,
    target_type,
    target_show_details,
    target_created_at,
    target_position,
    target_updated_at,
    target_device_id
  )
  on conflict on constraint task_lists_pkey do update
  set
    name = excluded.name,
    collapsed = excluded.collapsed,
    type = excluded.type,
    show_details = excluded.show_details,
    created_at = excluded.created_at,
    position = excluded.position,
    updated_at = excluded.updated_at,
    device_id = excluded.device_id
  where public.task_lists.owner_id = auth.uid()
    and public.task_lists.updated_at <= excluded.updated_at
  returning public.task_lists.id, public.task_lists.owner_id;
end;
';

grant execute on function public.upsert_task_list(
  text,
  text,
  boolean,
  text,
  boolean,
  timestamptz,
  integer,
  timestamptz,
  text
) to authenticated;

drop function if exists public.upsert_task_if_newer(
  text,
  text,
  text,
  date,
  text,
  boolean,
  timestamptz,
  timestamptz,
  integer,
  timestamptz,
  text
);

create or replace function public.upsert_task_if_newer(
  target_id text,
  target_list_id text,
  target_title text,
  target_due date,
  target_priority text,
  target_completed boolean,
  target_completed_at timestamptz,
  target_created_at timestamptz,
  target_position integer,
  target_updated_at timestamptz,
  target_device_id text
)
returns table(task_id text)
language plpgsql
security definer
set search_path = public
as '
begin
  if auth.uid() is null then
    raise exception ''Not signed in'';
  end if;

  if not public.can_edit_task_list(target_list_id) then
    raise exception ''You do not have permission to edit this list'';
  end if;

  return query
  insert into public.tasks (
    id,
    list_id,
    title,
    due,
    priority,
    completed,
    completed_at,
    created_at,
    position,
    updated_at,
    device_id
  )
  values (
    target_id,
    target_list_id,
    target_title,
    target_due,
    target_priority,
    target_completed,
    target_completed_at,
    target_created_at,
    target_position,
    target_updated_at,
    target_device_id
  )
  on conflict on constraint tasks_pkey do update
  set
    list_id = excluded.list_id,
    title = excluded.title,
    due = excluded.due,
    priority = excluded.priority,
    completed = excluded.completed,
    completed_at = excluded.completed_at,
    created_at = excluded.created_at,
    position = excluded.position,
    updated_at = excluded.updated_at,
    device_id = excluded.device_id
  where public.can_edit_task_list(public.tasks.list_id)
    and public.tasks.updated_at <= excluded.updated_at
  returning public.tasks.id;
end;
';

grant execute on function public.upsert_task_if_newer(
  text,
  text,
  text,
  date,
  text,
  boolean,
  timestamptz,
  timestamptz,
  integer,
  timestamptz,
  text
) to authenticated;

drop function if exists public.claim_pending_list_invites();

create or replace function public.claim_pending_list_invites()
returns integer
language plpgsql
security definer
set search_path = public
as '
declare
  invitee_email text := lower(auth.jwt() ->> ''email'');
  claimed_count integer := 0;
begin
  if auth.uid() is null then
    raise exception ''Not signed in'';
  end if;

  if invitee_email is null or invitee_email = '''' then
    raise exception ''No email on auth token'';
  end if;

  insert into public.list_members (
    list_id,
    user_id,
    role
  )
  select
    list_id,
    auth.uid(),
    coalesce(role, ''editor'')
  from public.list_invites
  where email = invitee_email
    and accepted_at is null
  on conflict (list_id, user_id) do update
  set role = excluded.role
  where public.list_members.user_id = auth.uid();

  update public.list_invites
  set accepted_at = now()
  where email = invitee_email
    and accepted_at is null;

  get diagnostics claimed_count = row_count;
  return claimed_count;
end;
';

grant execute on function public.claim_pending_list_invites() to authenticated;

drop function if exists public.remove_list_member_by_email(text, text);

create or replace function public.remove_list_member_by_email(
  target_list_id text,
  target_email text
)
returns integer
language plpgsql
security definer
set search_path = public
as '
declare
  normalized_email text := lower(trim(coalesce(target_email, '''')));
  removed_member_count integer := 0;
  removed_invite_count integer := 0;
begin
  if auth.uid() is null then
    raise exception ''Not signed in'';
  end if;

  if normalized_email = '''' then
    raise exception ''Email is required'';
  end if;

  if not public.is_task_list_owner(target_list_id) then
    raise exception ''Only the list owner can remove invites'';
  end if;

  delete from public.list_members
  using public.profiles
  where list_members.list_id = target_list_id
    and profiles.id = list_members.user_id
    and profiles.email = normalized_email;

  get diagnostics removed_member_count = row_count;

  delete from public.list_invites
  where list_id = target_list_id
    and email = normalized_email;

  get diagnostics removed_invite_count = row_count;

  return removed_member_count + removed_invite_count;
end;
';

grant execute on function public.remove_list_member_by_email(text, text) to authenticated;

drop policy if exists "Task documents are readable by owner" on public.task_documents;
drop policy if exists "Task documents are insertable by owner" on public.task_documents;
drop policy if exists "Task documents are updateable by owner" on public.task_documents;
drop policy if exists "Task documents are deletable by owner" on public.task_documents;
drop policy if exists "Profiles are readable by owner" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are updateable by owner" on public.profiles;
drop policy if exists "Task lists are readable by members" on public.task_lists;
drop policy if exists "Task lists are insertable by owner" on public.task_lists;
drop policy if exists "Task lists are updateable by editors" on public.task_lists;
drop policy if exists "Task lists are deletable by owner" on public.task_lists;
drop policy if exists "Tasks are readable by list members" on public.tasks;
drop policy if exists "Tasks are insertable by list editors" on public.tasks;
drop policy if exists "Tasks are updateable by list editors" on public.tasks;
drop policy if exists "Tasks are deletable by list editors" on public.tasks;
drop policy if exists "List members are readable by list members" on public.list_members;
drop policy if exists "List members are insertable by owner or invitee" on public.list_members;
drop policy if exists "List members are updateable by owner" on public.list_members;
drop policy if exists "List members are deletable by owner" on public.list_members;
drop policy if exists "List invites are readable by owner or invitee" on public.list_invites;
drop policy if exists "List invites are insertable by owner" on public.list_invites;
drop policy if exists "List invites are updateable by owner or invitee" on public.list_invites;
drop policy if exists "List invites are deletable by owner" on public.list_invites;

create policy "Task documents are readable by owner"
on public.task_documents
for select
using (auth.uid() = user_id);

create policy "Task documents are insertable by owner"
on public.task_documents
for insert
with check (auth.uid() = user_id);

create policy "Task documents are updateable by owner"
on public.task_documents
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Task documents are deletable by owner"
on public.task_documents
for delete
using (auth.uid() = user_id);

create policy "Profiles are readable by owner"
on public.profiles
for select
using (auth.uid() = id);

create policy "Profiles are insertable by owner"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Profiles are updateable by owner"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Task lists are readable by members"
on public.task_lists
for select
using (public.can_access_task_list(id));

create policy "Task lists are insertable by owner"
on public.task_lists
for insert
with check (auth.uid() = owner_id);

create policy "Task lists are updateable by editors"
on public.task_lists
for update
using (public.can_edit_task_list(id))
with check (public.can_edit_task_list(id));

create policy "Task lists are deletable by owner"
on public.task_lists
for delete
using (public.is_task_list_owner(id));

create policy "Tasks are readable by list members"
on public.tasks
for select
using (public.can_access_task_list(list_id));

create policy "Tasks are insertable by list editors"
on public.tasks
for insert
with check (public.can_edit_task_list(list_id));

create policy "Tasks are updateable by list editors"
on public.tasks
for update
using (public.can_edit_task_list(list_id))
with check (public.can_edit_task_list(list_id));

create policy "Tasks are deletable by list editors"
on public.tasks
for delete
using (public.can_edit_task_list(list_id));

create policy "List members are readable by list members"
on public.list_members
for select
using (public.can_access_task_list(list_id));

create policy "List members are insertable by owner or invitee"
on public.list_members
for insert
with check (
  public.is_task_list_owner(list_id)
  or (
    auth.uid() = user_id
    and exists (
      select 1
      from public.list_invites
      where list_invites.list_id = list_members.list_id
        and list_invites.email = lower(auth.jwt() ->> 'email')
        and list_invites.accepted_at is null
    )
  )
);

create policy "List members are updateable by owner"
on public.list_members
for update
using (public.is_task_list_owner(list_id))
with check (public.is_task_list_owner(list_id));

create policy "List members are deletable by owner"
on public.list_members
for delete
using (public.is_task_list_owner(list_id));

create policy "List invites are readable by owner or invitee"
on public.list_invites
for select
using (
  public.is_task_list_owner(list_id)
  or email = lower(auth.jwt() ->> 'email')
);

create policy "List invites are insertable by owner"
on public.list_invites
for insert
with check (public.is_task_list_owner(list_id));

create policy "List invites are updateable by owner or invitee"
on public.list_invites
for update
using (
  public.is_task_list_owner(list_id)
  or email = lower(auth.jwt() ->> 'email')
)
with check (
  public.is_task_list_owner(list_id)
  or email = lower(auth.jwt() ->> 'email')
);

create policy "List invites are deletable by owner"
on public.list_invites
for delete
using (public.is_task_list_owner(list_id));

notify pgrst, 'reload schema';
