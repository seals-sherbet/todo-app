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
