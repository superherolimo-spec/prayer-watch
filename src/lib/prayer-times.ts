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

/* ---------- Iqamah alert ---------- */

export type IqamahAlert = { name: string; minutes: number; seconds: number };

/** Returns the upcoming iqamah within `windowMinutes`, if any. */
export function upcomingIqamah(
  prayers: PrayerEntry[],
  now: Date,
  windowMinutes = 10,
): IqamahAlert | null {
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  for (const p of prayers) {
    const at = toMinutes(p.iqamah) * 60;
    const diff = at - nowSec;
    if (diff > 0 && diff <= windowMinutes * 60) {
      return { name: p.name, minutes: Math.ceil(diff / 60), seconds: diff };
    }
  }
  return null;
}

/* ---------- Forbidden (makrooh) prayer times ---------- */

export type NaflStatus = {
  allowed: boolean;
  label: string;
  detail: string;
  endsIn?: number;
};

type Window = { start: number; end: number; label: string; detail: string };

export function naflWindows(s: PrayerSettings): Window[] {
  const shurooq = toMinutes((s as unknown as { shurooq?: string }).shurooq ?? "06:30");
  const dhuhr = toMinutes(s.dhuhr_adhan);
  const maghrib = toMinutes(s.maghrib_adhan);
  return [
    {
      start: shurooq,
      end: shurooq + 15,
      label: "Sunrise (Shurooq)",
      detail: "Nafl is withheld until the sun has fully risen.",
    },
    {
      start: dhuhr - 10,
      end: dhuhr,
      label: "Zenith (Istiwa)",
      detail: "The sun is at its peak — wait until Dhuhr enters.",
    },
    {
      start: maghrib - 12,
      end: maghrib,
      label: "Sunset (Ghurub)",
      detail: "Nafl is withheld as the sun sets, until Maghrib.",
    },
  ];
}

export function naflStatus(s: PrayerSettings, now: Date): NaflStatus {
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const w of naflWindows(s)) {
    if (mins >= w.start && mins < w.end) {
      return {
        allowed: false,
        label: w.label,
        detail: w.detail,
        endsIn: w.end - mins,
      };
    }
  }
  return {
    allowed: true,
    label: "Nafl permitted",
    detail: "Voluntary prayer may be offered at this time.",
  };
}
