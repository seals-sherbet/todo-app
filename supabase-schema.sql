create table if not exists public.task_documents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  lists jsonb not null default '[]'::jsonb,
  tomorrow_queue jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  device_id text not null default ''
);

alter table public.task_documents enable row level security;
alter table public.task_documents replica identity full;

drop policy if exists "Task documents are readable by owner" on public.task_documents;
drop policy if exists "Task documents are insertable by owner" on public.task_documents;
drop policy if exists "Task documents are updateable by owner" on public.task_documents;
drop policy if exists "Task documents are deletable by owner" on public.task_documents;

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

do $$
begin
  alter publication supabase_realtime add table public.task_documents;
exception
  when duplicate_object then null;
end $$;

notify pgrst, 'reload schema';
