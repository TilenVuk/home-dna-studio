create table if not exists public.home_dna_report_attempts (
  id bigint generated always as identity primary key,
  request_ip_hash text not null check (char_length(request_ip_hash) = 64),
  created_at timestamptz not null default now()
);

create index if not exists home_dna_report_attempts_ip_created_idx
  on public.home_dna_report_attempts (request_ip_hash, created_at desc);

create index if not exists home_dna_report_attempts_created_idx
  on public.home_dna_report_attempts (created_at);

alter table public.home_dna_report_attempts enable row level security;

revoke all on table public.home_dna_report_attempts from public, anon, authenticated;
grant all on table public.home_dna_report_attempts to service_role;

create or replace function public.consume_home_dna_report_quota(
  p_request_ip_hash text,
  p_window_seconds integer default 3600,
  p_max_requests integer default 5
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_requests bigint;
begin
  if char_length(p_request_ip_hash) <> 64
    or p_window_seconds < 60
    or p_window_seconds > 86400
    or p_max_requests < 1
    or p_max_requests > 100 then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_request_ip_hash, 0));

  delete from public.home_dna_report_attempts
  where created_at < now() - interval '24 hours';

  select count(*)
  into recent_requests
  from public.home_dna_report_attempts
  where request_ip_hash = p_request_ip_hash
    and created_at >= now() - make_interval(secs => p_window_seconds);

  if recent_requests >= p_max_requests then
    return false;
  end if;

  insert into public.home_dna_report_attempts (request_ip_hash)
  values (p_request_ip_hash);

  return true;
end;
$$;

revoke all on function public.consume_home_dna_report_quota(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_home_dna_report_quota(text, integer, integer)
  to service_role;

comment on table public.home_dna_report_attempts is
  'Privacy-preserving rate-limit records for Home DNA AI report generation.';
