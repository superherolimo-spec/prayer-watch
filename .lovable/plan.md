# Masjid Prayer Times App

A serene, premium prayer-times site for a local masjid, with a live clock, countdown to the next prayer, rotating spiritual reminders, a TV/kiosk display mode, and a hidden admin area for updating times and announcements.

## What visitors see (home page)

- Header with masjid name and crescent/geometric mark, live clock, Gregorian date and Hijri date.
- Big "next prayer" panel: prayer name, time, countdown, and a circular progress ring showing how much of the interval has elapsed.
- Prayer grid: Fajr, Dhuhr, Asr, Maghrib, Isha with Adhan and Iqamah columns. Current prayer glows emerald, next prayer is outlined in gold.
- Jummah card: Khutbah 1:00 PM, Salah 1:15 PM.
- Announcement banner when the admin has published one.
- Rotating Hadith / Quran cards: Arabic text, translation, reference.
- Toolbar: sound toggle (gentle notification tone at prayer time), kiosk/full-screen mode, share (WhatsApp or copy link).

Seed times: Fajr 5:15 AM, Dhuhr 1:15 PM, Asr 4:45 PM, Maghrib 6:15 PM, Isha 8:15 PM, Jummah 1:15 PM with Khutbah 1:00 PM.

## Look and feel

Deep emerald green, warm gold accents, soft slate backgrounds, faint Islamic geometric pattern behind the hero, elegant serif headings with a clean sans for numbers. Layout scales from phone up to wall-mounted TV; kiosk mode hides chrome and enlarges everything.

## Hidden admin

- Tap the masjid name 5 times within a few seconds. Each tap gives a subtle pulse; on mobile a short vibration. The 5th tap opens a PIN keypad.
- Correct PIN unlocks an admin panel to edit each prayer's Adhan and Iqamah time, Jummah khutbah/salah times, and the announcement text (with show/hide).
- Saving writes to the cloud database; every open device updates live without refreshing.
- Default PIN 1234, changeable from the admin panel.

## Backend

Lovable Cloud is enabled for this. Two tables:

- `prayer_settings` — one row holding masjid name, each prayer's adhan/iqamah time, Jummah times, announcement text and visibility, admin PIN hash.
- `reminders` — Arabic text, translation, reference, active flag (seeded with authentic verses and hadith about salah and gratitude).

Public visitors can read prayer times, announcements, and reminders; nobody can read the PIN hash from the browser. Saving edits goes through a server check that verifies the PIN before writing, so the panel cannot be bypassed by editing the page. Realtime updates are enabled on the settings table so changes appear instantly on every screen.

## Notes

- The countdown and current-prayer highlight use the device clock in the masjid's local timezone; times are stored exactly as the admin enters them (no automatic astronomical calculation).
- Hijri date is computed in the browser with the built-in Islamic calendar, which may differ by a day from local moon sighting; the admin can be given an offset control later if needed.
- The PIN gate protects casual access, not accounts — it is a shared code, so anyone who learns it can edit.
