# Masjid Serenity

Create a professional, serene prayer times web application for a local masjid with Lovable Cloud backend integration:

1. Design & UI:
- Elegant, premium Islamic aesthetic: deep emerald green, warm gold accents, soft slate backgrounds, subtle Islamic geometric motifs, clean typography.
- Fully responsive across mobile, tablet, desktop, and large TV displays (masjid digital sign/kiosk view).
- Shows live clock, Gregorian date, and calculated Hijri date.
- Prominent countdown timer to the upcoming prayer, with visual highlights on the current and next prayer.

2. Daily Prayer Times (Initial Seed Data):
- Fajr: 5:15 AM
- Dhuhr: 1:15 PM
- Asr: 4:45 PM
- Maghrib: 6:15 PM
- Isha: 8:15 PM
- Jummah: 1:15 PM / Khutbah 1:00 PM

3. Lovable Cloud Backend & Realtime Sync:
- Set up a Lovable Cloud database table for prayer schedules and masjid announcements so any edit syncs instantly across all devices and displays.

4. Hidden Admin Edit Feature:
- Secret trigger: tapping the masjid name or logo 5 times quickly (with subtle visual cue or discreet vibration on mobile) opens a secure PIN modal (default PIN e.g., 1234 or configurable).
- Admin dashboard allows editing Adhan and Iqamah times for all prayers, setting Jummah timings, and updating announcement banners.
- Changes save directly to the Lovable Cloud database so every visitor sees the updated times immediately.

5. Hadith & Spiritual Reminders:
- Rotating cards featuring authentic Hadith and Quranic verses about Salah, gratitude, and spiritual well-being.
- Include Arabic text, clear translation, and reference source.

6. Engaging Features:
- Next prayer countdown progress ring.
- Sound toggle for gentle Adhan or notification tone.
- Kiosk/Full-screen TV mode toggle for masjid wall displays.
- Quick share button to share today's prayer times via WhatsApp or link.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0324caef-02f6-41ce-91c6-a4e740b72e6c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
