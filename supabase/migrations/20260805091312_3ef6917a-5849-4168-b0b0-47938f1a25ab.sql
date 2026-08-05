create extension if not exists pgcrypto;

create table if not exists public.consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  consultation_type text not null check (consultation_type in ('online', 'home-visit')),
  source text not null check (source in ('contact', 'home-dna')),
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_email text not null check (char_length(customer_email) between 3 and 255),
  customer_phone text not null default '' check (char_length(customer_phone) <= 40),
  project_type text not null default '' check (char_length(project_type) <= 120),
  message text not null default '' check (char_length(message) <= 1500),
  status text not null default 'booked' check (status in ('booked', 'cancelled')),
  created_at timestamptz not null default now(),
  check (slot_end = slot_start + interval '1 hour')
);

create unique index if not exists consultation_bookings_active_slot_key
  on public.consultation_bookings (slot_start)
  where status = 'booked';

create index if not exists consultation_bookings_slot_start_idx
  on public.consultation_bookings (slot_start);

alter table public.consultation_bookings enable row level security;

revoke all on table public.consultation_bookings from anon, authenticated;
grant all on table public.consultation_bookings to service_role;

comment on table public.consultation_bookings is
  'Nuveli Studio consultation reservations. Access is limited to trusted server functions.';