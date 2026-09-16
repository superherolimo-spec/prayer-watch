import { useEffect, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";

const DHIKR = [
  { key: "subhanallah", label: "SubhanAllah", arabic: "سُبْحَانَ اللَّه", target: 33 },
  { key: "alhamdulillah", label: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّه", target: 33 },
  { key: "allahuakbar", label: "Allahu Akbar", arabic: "اللَّهُ أَكْبَر", target: 34 },
] as const;

const STORAGE_KEY = "masjid-tasbih";

type Counts = Record<string, number>;

export function TasbihWidget() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(DHIKR[0].key);
  const [counts, setCounts] = useState<Counts>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCounts(JSON.parse(raw) as Counts);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    } catch {
      /* ignore */
    }
  }, [counts]);

  const current = DHIKR.find((d) => d.key === active)!;
  const count = counts[active] ?? 0;
  const progress = Math.min(1, count / current.target);

  function tap() {
    const next = count + 1;
    setCounts((c) => ({ ...c, [active]: next }));
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(next % current.target === 0 ? [20, 40, 20] : 10);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card/70 shadow-elegant backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span>
          <span className="block text-xs uppercase tracking-[0.35em] text-muted-foreground">Tasbih</span>
          <span className="font-display block text-2xl font-semibold text-foreground xl:text-3xl">
            Post-prayer dhikr
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-2xl font-light tabular-nums text-gold xl:text-3xl">{count}</span>
          <ChevronDown className={`size-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="space-y-5 border-t border-border/60 px-6 py-6">
          <div className="flex flex-wrap gap-2">
            {DHIKR.map((d) => (
              <button
                key={d.key}
                onClick={() => setActive(d.key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active === d.key
                    ? "border-gold/60 bg-gold/15 text-gold"
                    : "border-border text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <button
            onClick={tap}
            className="ring-gold flex w-full flex-col items-center gap-2 rounded-3xl bg-primary/15 px-6 py-10 transition-transform active:scale-[0.98]"
          >
            <span className="text-arabic text-3xl text-gold xl:text-4xl">{current.arabic}</span>
            <span className="text-6xl font-light tabular-nums text-foreground xl:text-7xl">{count}</span>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Tap to count · target {current.target}
            </span>
          </button>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress * 100}%` }} />
          </div>

          <button
            onClick={() => setCounts((c) => ({ ...c, [active]: 0 }))}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" /> Reset {current.label}
          </button>
        </div>
      )}
    </div>
  );
}
