-- Migration: 00000000000004_add_checked_states.sql
-- Add checked_states column to public.daily_cards table

alter table public.daily_cards add column if not exists checked_states jsonb default '[]';
