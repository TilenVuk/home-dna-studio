create table if not exists public.home_dna_analytics_events (
  id uuid primary key,
  session_id uuid not null,
  event_name text not null check (
    event_name in (
      'home_dna_view',
      'home_dna_start',
      'home_dna_step_view',
      'home_dna_step_complete',
      'home_dna_contact_view',
      'home_dna_report_generation_started',
      'home_dna_report_generated',
      'home_dna_pdf_generated',
      'home_dna_complete',
      'home_dna_error',
      'home_dna_pdf_download',
      'booking_view',
      'booking_slot_selected',
      'booking_submit',
      'consultation_booked',
      'booking_error'
    )
  ),
  locale text not null check (locale in ('sl', 'hr', 'en')),
  source text not null check (source in ('home-dna', 'contact')),
  device_type text not null check (device_type in ('mobile', 'tablet', 'desktop')),
  viewport_width smallint not null check (viewport_width between 240 and 10000),
  screen_key text check (screen_key is null or char_length(screen_key) between 1 and 100),
  step_index smallint check (step_index is null or step_index between 0 and 200),
  step_total smallint check (step_total is null or step_total between 1 and 200),
  submission_id uuid,
  booking_id uuid,
  utm_source text check (utm_source is null or char_length(utm_source) <= 120),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 120),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 160),
  utm_content text check (utm_content is null or char_length(utm_content) <= 160),
  utm_term text check (utm_term is null or char_length(utm_term) <= 160),
  referrer_host text check (referrer_host is null or char_length(referrer_host) <= 255),
  landing_path text not null check (char_length(landing_path) between 1 and 300),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists home_dna_analytics_events_session_created_idx
  on public.home_dna_analytics_events (session_id, created_at);

create index if not exists home_dna_analytics_events_name_created_idx
  on public.home_dna_analytics_events (event_name, created_at desc);

create index if not exists home_dna_analytics_events_campaign_created_idx
  on public.home_dna_analytics_events (utm_campaign, created_at desc)
  where utm_campaign is not null;

create index if not exists home_dna_analytics_events_screen_created_idx
  on public.home_dna_analytics_events (screen_key, created_at desc)
  where screen_key is not null;

alter table public.home_dna_analytics_events enable row level security;

revoke all on table public.home_dna_analytics_events from public, anon, authenticated;
grant select, insert on table public.home_dna_analytics_events to service_role;

comment on table public.home_dna_analytics_events is
  'Anonymous first-party funnel events for Home DNA and consultation booking. No names, email addresses, phone numbers, IP addresses or persistent browser identifiers.';

create or replace view public.home_dna_funnel_daily
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  locale,
  coalesce(utm_source, 'direct') as acquisition_source,
  coalesce(utm_medium, 'none') as acquisition_medium,
  coalesce(utm_campaign, 'none') as acquisition_campaign,
  count(distinct session_id) filter (where event_name = 'home_dna_view') as views,
  count(distinct session_id) filter (where event_name = 'home_dna_start') as starts,
  count(distinct session_id) filter (where event_name = 'home_dna_contact_view') as contact_views,
  count(distinct session_id) filter (where event_name = 'home_dna_complete') as completions,
  count(distinct session_id) filter (where event_name = 'booking_view') as booking_views,
  count(distinct session_id) filter (where event_name = 'consultation_booked') as consultations
from public.home_dna_analytics_events
group by 1, 2, 3, 4, 5;

create or replace view public.home_dna_step_funnel_daily
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  locale,
  screen_key,
  min(step_index) as step_index,
  count(distinct session_id) filter (where event_name = 'home_dna_step_view') as views,
  count(distinct session_id) filter (where event_name = 'home_dna_step_complete') as completions
from public.home_dna_analytics_events
where screen_key is not null
  and event_name in ('home_dna_step_view', 'home_dna_step_complete')
group by 1, 2, 3;

revoke all on table public.home_dna_funnel_daily from public, anon, authenticated;
revoke all on table public.home_dna_step_funnel_daily from public, anon, authenticated;
grant select on table public.home_dna_funnel_daily to service_role;
grant select on table public.home_dna_step_funnel_daily to service_role;
