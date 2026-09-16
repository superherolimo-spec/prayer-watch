import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PrayerSettings = Database["public"]["Tables"]["prayer_settings"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getMasjidData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [settingsRes, remindersRes] = await Promise.all([
    supabase.from("prayer_settings").select("*").limit(1).maybeSingle(),
    supabase.from("reminders").select("*").eq("active", true).order("sort_order"),
  ]);
  return {
    settings: (settingsRes.data ?? null) as PrayerSettings | null,
    reminders: (remindersRes.data ?? []) as Reminder[],
  };
});

export const verifyPin = createServerFn({ method: "POST" })
  .inputValidator((data: { pin: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("admin_secret")
      .select("pin")
      .limit(1)
      .maybeSingle();
    return { ok: !!row && row.pin === data.pin.trim() };
  });

type SettingsUpdate = {
  masjid_name: string;
  fajr_adhan: string;
  fajr_iqamah: string;
  dhuhr_adhan: string;
  dhuhr_iqamah: string;
  asr_adhan: string;
  asr_iqamah: string;
  maghrib_adhan: string;
  maghrib_iqamah: string;
  isha_adhan: string;
  isha_iqamah: string;
  jummah_khutbah: string;
  jummah_salah: string;
  announcement: string;
  announcement_visible: boolean;
};

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: { pin: string; values: SettingsUpdate; newPin?: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: secret } = await supabaseAdmin
      .from("admin_secret")
      .select("id, pin")
      .limit(1)
      .maybeSingle();
    if (!secret || secret.pin !== data.pin.trim()) {
      return { ok: false as const, error: "Incorrect PIN" };
    }

    const { data: existing } = await supabaseAdmin
      .from("prayer_settings")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (!existing) return { ok: false as const, error: "No prayer schedule found" };

    const { error } = await supabaseAdmin
      .from("prayer_settings")
      .update({ ...data.values, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return { ok: false as const, error: error.message };

    const newPin = data.newPin?.trim();
    if (newPin && /^\d{4,8}$/.test(newPin)) {
      await supabaseAdmin
        .from("admin_secret")
        .update({ pin: newPin, updated_at: new Date().toISOString() })
        .eq("id", secret.id);
    }

    return { ok: true as const };
  });
