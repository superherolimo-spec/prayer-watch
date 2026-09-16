ALTER TABLE public.prayer_settings
  ADD COLUMN IF NOT EXISTS default_theme text NOT NULL DEFAULT 'emerald',
  ADD COLUMN IF NOT EXISTS show_pattern boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS shurooq text NOT NULL DEFAULT '06:30';