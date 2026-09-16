import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { verifyPin, saveSettings, type PrayerSettings } from "@/lib/masjid.functions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: PrayerSettings;
  onSaved: () => void;
};

type FormValues = {
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
  shurooq: string;
  default_theme: string;
  show_pattern: boolean;
};

function toForm(s: PrayerSettings): FormValues {
  const extra = s as unknown as { shurooq?: string; default_theme?: string; show_pattern?: boolean };
  return {
    shurooq: extra.shurooq ?? "06:30",
    default_theme: extra.default_theme ?? "emerald",
    show_pattern: extra.show_pattern ?? true,
    masjid_name: s.masjid_name,
    fajr_adhan: s.fajr_adhan,
    fajr_iqamah: s.fajr_iqamah,
    dhuhr_adhan: s.dhuhr_adhan,
    dhuhr_iqamah: s.dhuhr_iqamah,
    asr_adhan: s.asr_adhan,
    asr_iqamah: s.asr_iqamah,
    maghrib_adhan: s.maghrib_adhan,
    maghrib_iqamah: s.maghrib_iqamah,
    isha_adhan: s.isha_adhan,
    isha_iqamah: s.isha_iqamah,
    jummah_khutbah: s.jummah_khutbah,
    jummah_salah: s.jummah_salah,
    announcement: s.announcement,
    announcement_visible: s.announcement_visible,
  };
}

const PRAYERS = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
] as const;

export function AdminDialog({ open, onOpenChange, settings, onSaved }: Props) {
  const check = useServerFn(verifyPin);
  const save = useServerFn(saveSettings);

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [values, setValues] = useState<FormValues>(() => toForm(settings));

  useEffect(() => {
    if (open) setValues(toForm(settings));
  }, [open, settings]);

  useEffect(() => {
    if (!open) {
      setPin("");
      setNewPin("");
      setUnlocked(false);
    }
  }, [open]);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await check({ data: { pin } });
      if (res.ok) setUnlocked(true);
      else toast.error("Incorrect PIN");
    } catch {
      toast.error("Could not verify the PIN. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await save({ data: { pin, values, ...(newPin ? { newPin } : {}) } });
      if (res.ok) {
        toast.success("Saved — all screens updated");
        onSaved();
        onOpenChange(false);
      } else {
        toast.error(res.error ?? "Could not save");
      }
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof FormValues, v: string | boolean) =>
    setValues((prev) => ({ ...prev, [k]: v }) as FormValues);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {unlocked ? "Manage prayer times" : "Enter admin PIN"}
          </DialogTitle>
          <DialogDescription>
            {unlocked
              ? "Changes appear instantly on every screen."
              : "This area is for masjid administrators."}
          </DialogDescription>
        </DialogHeader>

        {!unlocked ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              autoFocus
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="text-center text-2xl tracking-[0.5em]"
            />
            <Button type="submit" className="w-full" disabled={checking || pin.length < 4}>
              {checking ? "Checking…" : "Unlock"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="masjid_name">Masjid name</Label>
              <Input
                id="masjid_name"
                value={values.masjid_name}
                onChange={(e) => set("masjid_name", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gold">Daily prayers</p>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs text-muted-foreground">
                <span />
                <span className="w-28 text-center">Adhan</span>
                <span className="w-28 text-center">Iqamah</span>
              </div>
              {PRAYERS.map((p) => (
                <div key={p.key} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <Label>{p.label}</Label>
                  <Input
                    type="time"
                    className="w-28"
                    value={values[`${p.key}_adhan` as keyof FormValues] as string}
                    onChange={(e) => set(`${p.key}_adhan` as keyof FormValues, e.target.value)}
                  />
                  <Input
                    type="time"
                    className="w-28"
                    value={values[`${p.key}_iqamah` as keyof FormValues] as string}
                    onChange={(e) => set(`${p.key}_iqamah` as keyof FormValues, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gold">Jummah</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="khutbah">Khutbah</Label>
                  <Input
                    id="khutbah"
                    type="time"
                    value={values.jummah_khutbah}
                    onChange={(e) => set("jummah_khutbah", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jsalah">Salah</Label>
                  <Input
                    id="jsalah"
                    type="time"
                    value={values.jummah_salah}
                    onChange={(e) => set("jummah_salah", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="announcement">Announcement</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Show on site</span>
                  <Switch
                    checked={values.announcement_visible}
                    onCheckedChange={(v) => set("announcement_visible", v)}
                  />
                </div>
              </div>
              <Textarea
                id="announcement"
                rows={3}
                value={values.announcement}
                onChange={(e) => set("announcement", e.target.value)}
                placeholder="Community notice…"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newpin">New PIN (optional)</Label>
              <Input
                id="newpin"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Leave blank to keep current PIN"
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
