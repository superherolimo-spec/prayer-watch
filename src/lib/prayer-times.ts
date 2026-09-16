import type { PrayerSettings } from "./masjid.functions";

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerEntry = {
  key: PrayerKey;
  name: string;
  arabic: string;
  adhan: string;
  iqamah: string;
  adhanMinutes: number;
};

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((v) => parseInt(v, 10));
  return (h || 0) * 60 + (m || 0);
}

export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm);
  const h24 = Math.floor(total / 60) % 24;
  const m = total % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const META: { key: PrayerKey; name: string; arabic: string }[] = [
  { key: "fajr", name: "Fajr", arabic: "الفجر" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر" },
  { key: "asr", name: "Asr", arabic: "العصر" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب" },
  { key: "isha", name: "Isha", arabic: "العشاء" },
];

export function buildPrayers(s: PrayerSettings): PrayerEntry[] {
  return META.map((m) => {
    const adhan = s[`${m.key}_adhan` as keyof PrayerSettings] as string;
    const iqamah = s[`${m.key}_iqamah` as keyof PrayerSettings] as string;
    return { ...m, adhan, iqamah, adhanMinutes: toMinutes(adhan) };
  });
}

export type PrayerStatus = {
  currentIndex: number;
  nextIndex: number;
  secondsToNext: number;
  progress: number;
  nextIsTomorrow: boolean;
};

export function computeStatus(prayers: PrayerEntry[], now: Date): PrayerStatus {
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const secs = prayers.map((p) => p.adhanMinutes * 60);
  const day = 24 * 3600;

  let nextIndex = secs.findIndex((s) => s > nowSec);
  const nextIsTomorrow = nextIndex === -1;
  if (nextIsTomorrow) nextIndex = 0;
  const currentIndex = nextIsTomorrow ? prayers.length - 1 : (nextIndex + prayers.length - 1) % prayers.length;

  const nextAt = nextIsTomorrow ? secs[0]! + day : secs[nextIndex]!;
  const prevAt = nextIsTomorrow
    ? secs[prayers.length - 1]!
    : nextIndex === 0
      ? secs[prayers.length - 1]! - day
      : secs[currentIndex]!;

  const secondsToNext = Math.max(0, nextAt - nowSec);
  const span = Math.max(1, nextAt - prevAt);
  const progress = Math.min(1, Math.max(0, (nowSec - prevAt) / span));

  return { currentIndex, nextIndex, secondsToNext, progress, nextIsTomorrow };
}

export function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function hijriDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}
