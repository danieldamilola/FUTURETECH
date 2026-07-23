-- ============================================================
-- FutureTech Schema Patch: Auth & Profile Fields
-- Apply after 001_podcast_ecosystem_and_follows.sql
-- ============================================================

-- Add location to profiles if not already there
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
