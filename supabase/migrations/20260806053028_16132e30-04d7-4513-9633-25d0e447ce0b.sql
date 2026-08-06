ALTER TABLE public.consultation_bookings
  ADD COLUMN IF NOT EXISTS customer_email_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS internal_email_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS customer_resend_id text,
  ADD COLUMN IF NOT EXISTS internal_resend_id text,
  ADD COLUMN IF NOT EXISTS email_attempt_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS email_last_error text,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'consultation_bookings_customer_email_status_check'
  ) THEN
    ALTER TABLE public.consultation_bookings
      ADD CONSTRAINT consultation_bookings_customer_email_status_check
      CHECK (customer_email_status IN ('pending', 'sent', 'failed'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'consultation_bookings_internal_email_status_check'
  ) THEN
    ALTER TABLE public.consultation_bookings
      ADD CONSTRAINT consultation_bookings_internal_email_status_check
      CHECK (internal_email_status IN ('pending', 'sent', 'failed'));
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_consultation_bookings_updated_at ON public.consultation_bookings;
CREATE TRIGGER update_consultation_bookings_updated_at
BEFORE UPDATE ON public.consultation_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();