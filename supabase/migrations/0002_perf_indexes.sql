-- Performance indexes for hot query paths
-- Run: supabase db push  (or apply via Supabase dashboard → SQL editor)

-- financial_transactions: filtered by investor_id + month_key on every accounting page load
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fin_tx_investor_month
  ON financial_transactions(investor_id, month_key);

-- financial_transactions: filtered by investor_id + sheet_type for overview grouping
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fin_tx_investor_sheet
  ON financial_transactions(investor_id, sheet_type);

-- cars: every investor cars query filters on investor_id + is_active
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_investor_active
  ON cars(investor_id, is_active);

-- bookings: car detail and status strip filter on car_id + is_currently_active
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_car_active
  ON bookings(car_id, is_currently_active);
