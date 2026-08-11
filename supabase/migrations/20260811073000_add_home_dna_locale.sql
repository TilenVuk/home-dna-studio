alter table public.home_dna_submissions
  add column if not exists locale text not null default 'sl';

alter table public.home_dna_submissions
  drop constraint if exists home_dna_submissions_locale_check;

alter table public.home_dna_submissions
  add constraint home_dna_submissions_locale_check
  check (locale in ('sl', 'hr', 'en'));

create index if not exists home_dna_submissions_locale_created_at_idx
  on public.home_dna_submissions (locale, created_at desc);
