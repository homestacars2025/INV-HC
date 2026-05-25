-- ============================================================
-- HC-INVESTORS: Row Level Security Policies
-- Project: edsyoxqsnsxfftnbsjgq
-- Review carefully before applying. Run manually via Supabase dashboard
-- or: supabase db push --db-url <connection-string>
-- ============================================================

-- ─── Helper: get current investor id ────────────────────────
CREATE OR REPLACE FUNCTION auth.investor_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id
  FROM public.investors
  WHERE profile_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- ─── profiles ───────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "profiles: self read"
  ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

-- ─── investors ──────────────────────────────────────────────
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

-- Investor sees only their own record
CREATE POLICY "investors: self read"
  ON public.investors
  FOR SELECT
  USING (profile_id = auth.uid());

-- Admin can see all investors
CREATE POLICY "investors: admin read all"
  ON public.investors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── cars ───────────────────────────────────────────────────
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Investor sees only cars linked to them
CREATE POLICY "cars: investor reads own cars"
  ON public.cars
  FOR SELECT
  USING (investor_id = auth.investor_id());

-- Admin sees all cars
CREATE POLICY "cars: admin reads all"
  ON public.cars
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── model_group ────────────────────────────────────────────
ALTER TABLE public.model_group ENABLE ROW LEVEL SECURITY;

-- Model groups are read-only reference data for all authenticated users
CREATE POLICY "model_group: authenticated read"
  ON public.model_group
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── financial_transactions ─────────────────────────────────
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Investor sees only their own transactions
CREATE POLICY "financial_transactions: investor reads own"
  ON public.financial_transactions
  FOR SELECT
  USING (investor_id = auth.investor_id());

-- Admin sees all
CREATE POLICY "financial_transactions: admin reads all"
  ON public.financial_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── bookings ───────────────────────────────────────────────
-- IMPORTANT: investors see booking-level data ONLY (no customer info)
-- Customer identity is fully protected by this policy + application layer

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Investor sees bookings for their cars (booking data only, not customer data)
CREATE POLICY "bookings: investor reads own car bookings"
  ON public.bookings
  FOR SELECT
  USING (
    car_id IN (
      SELECT id FROM public.cars
      WHERE investor_id = auth.investor_id()
    )
  );

-- Admin sees all bookings
CREATE POLICY "bookings: admin reads all"
  ON public.bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── car_photos ─────────────────────────────────────────────
ALTER TABLE public.car_photos ENABLE ROW LEVEL SECURITY;

-- Investor sees photos of their own cars
CREATE POLICY "car_photos: investor reads own"
  ON public.car_photos
  FOR SELECT
  USING (
    car_id IN (
      SELECT id FROM public.cars
      WHERE investor_id = auth.investor_id()
    )
  );

-- Admin sees all
CREATE POLICY "car_photos: admin reads all"
  ON public.car_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── cars_registration ──────────────────────────────────────
ALTER TABLE public.cars_registration ENABLE ROW LEVEL SECURITY;

-- Investor sees registration docs for their own cars
CREATE POLICY "cars_registration: investor reads own"
  ON public.cars_registration
  FOR SELECT
  USING (
    car_id IN (
      SELECT id FROM public.cars
      WHERE investor_id = auth.investor_id()
    )
  );

-- Admin sees all
CREATE POLICY "cars_registration: admin reads all"
  ON public.cars_registration
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── customers table: NO investor access ─────────────────────
-- The customers table (if RLS is not yet enabled) should have:
-- ZERO policies granting investor role any access.
-- Investors MUST NOT see any customer data through any table or view.
-- If a view joins customers data, ensure it does NOT expose customer PII
-- to the investor role.

-- ─── Verification query (run after applying) ─────────────────
-- SELECT schemaname, tablename, policyname, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
