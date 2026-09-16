CREATE TABLE public.prayer_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  masjid_name text NOT NULL DEFAULT 'Masjid Al-Noor',
  fajr_adhan text NOT NULL DEFAULT '05:00',
  fajr_iqamah text NOT NULL DEFAULT '05:15',
  dhuhr_adhan text NOT NULL DEFAULT '13:00',
  dhuhr_iqamah text NOT NULL DEFAULT '13:15',
  asr_adhan text NOT NULL DEFAULT '16:30',
  asr_iqamah text NOT NULL DEFAULT '16:45',
  maghrib_adhan text NOT NULL DEFAULT '18:15',
  maghrib_iqamah text NOT NULL DEFAULT '18:15',
  isha_adhan text NOT NULL DEFAULT '20:00',
  isha_iqamah text NOT NULL DEFAULT '20:15',
  jummah_khutbah text NOT NULL DEFAULT '13:00',
  jummah_salah text NOT NULL DEFAULT '13:15',
  announcement text NOT NULL DEFAULT '',
  announcement_visible boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.prayer_settings TO anon, authenticated;
GRANT ALL ON public.prayer_settings TO service_role;
ALTER TABLE public.prayer_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prayer times are public" ON public.prayer_settings FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.prayer_settings (
  masjid_name, fajr_adhan, fajr_iqamah, dhuhr_adhan, dhuhr_iqamah,
  asr_adhan, asr_iqamah, maghrib_adhan, maghrib_iqamah, isha_adhan, isha_iqamah,
  jummah_khutbah, jummah_salah, announcement, announcement_visible
) VALUES (
  'Masjid Al-Noor', '05:15', '05:30', '13:15', '13:30',
  '16:45', '17:00', '18:15', '18:20', '20:15', '20:30',
  '13:00', '13:15', 'Jummah khutbah begins at 1:00 PM. Please arrive early.', true
);

CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arabic text NOT NULL,
  translation text NOT NULL,
  reference text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reminders TO anon, authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reminders are public" ON public.reminders FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.reminders (arabic, translation, reference, sort_order) VALUES
('إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا', 'Indeed, prayer has been decreed upon the believers a decree of specified times.', 'Qur''an 4:103', 1),
('وَأَقِمِ الصَّلَاةَ لِذِكْرِي', 'And establish prayer for My remembrance.', 'Qur''an 20:14', 2),
('لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', 'If you are grateful, I will surely increase you [in favour].', 'Qur''an 14:7', 3),
('أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', 'Verily, in the remembrance of Allah do hearts find rest.', 'Qur''an 13:28', 4),
('أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلَاةُ', 'The first matter the servant will be brought to account for on the Day of Judgement is the prayer.', 'Sunan an-Nasa''i 465', 5),
('الصَّلَوَاتُ الْخَمْسُ كَفَّارَةٌ لِمَا بَيْنَهُنَّ', 'The five daily prayers are an expiation for whatever sins are committed between them.', 'Sahih Muslim 233', 6),
('صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً', 'Prayer in congregation is twenty-seven times superior to prayer offered alone.', 'Sahih al-Bukhari 645', 7),
('مَنْ لَا يَشْكُرِ النَّاسَ لَا يَشْكُرِ اللَّهَ', 'Whoever is not grateful to people is not grateful to Allah.', 'Sunan Abi Dawud 4811', 8);

CREATE TABLE public.admin_secret (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_secret TO service_role;
ALTER TABLE public.admin_secret ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_secret (pin) VALUES ('1234');

ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_settings;