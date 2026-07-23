-- Migration: Add location column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
