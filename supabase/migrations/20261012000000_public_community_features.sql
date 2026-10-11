-- NOVA Tools public community features (no authentication required).
-- Apply this file in Supabase SQL Editor before enabling the Cloudflare environment variables.
-- Do not add a service-role/secret key to the frontend.

create table if not exists public.tool_ratings (
  id bigint generated always as identity primary key,
  tool_slug text not null check (tool_slug ~ '^[a-z0-9-]{1,100}$'),
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists public.community_feedback (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('bug', 'suggestion', 'feature')),
  tool_slug text not null check (tool_slug ~ '^[a-z0-9-]{1,100}$'),
  title text not null check (char_length(btrim(title)) between 3 and 80),
  message text not null check (char_length(btrim(message)) between 8 and 1000),
  created_at timestamptz not null default now()
);

alter table public.tool_ratings enable row level security;
alter table public.community_feedback enable row level security;

drop policy if exists "Anyone can read tool ratings" on public.tool_ratings;
create policy "Anyone can read tool ratings"
  on public.tool_ratings for select to anon using (true);

drop policy if exists "Anyone can submit a tool rating" on public.tool_ratings;
create policy "Anyone can submit a tool rating"
  on public.tool_ratings for insert to anon
  with check (rating between 1 and 5 and tool_slug ~ '^[a-z0-9-]{1,100}$');

drop policy if exists "Anyone can submit community feedback" on public.community_feedback;
create policy "Anyone can submit community feedback"
  on public.community_feedback for insert to anon
  with check (
    kind in ('bug', 'suggestion', 'feature')
    and tool_slug ~ '^[a-z0-9-]{1,100}$'
    and char_length(btrim(title)) between 3 and 80
    and char_length(btrim(message)) between 8 and 1000
  );

-- Intentionally no public SELECT/UPDATE/DELETE policy for feedback.
-- Review and moderate submissions in the Supabase dashboard.
grant select, insert on public.tool_ratings to anon;
grant insert on public.community_feedback to anon;
grant usage, select on sequence public.tool_ratings_id_seq to anon;
grant usage, select on sequence public.community_feedback_id_seq to anon;

create index if not exists tool_ratings_slug_idx on public.tool_ratings (tool_slug);
create index if not exists community_feedback_created_at_idx on public.community_feedback (created_at desc);
