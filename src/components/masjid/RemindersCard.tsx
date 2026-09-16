import { useEffect, useState } from "react";
import type { Reminder } from "@/lib/masjid.functions";

export function RemindersCard({ reminders }: { reminders: Reminder[] }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (reminders.length < 2) return;
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % reminders.length);
        setFade(true);
      }, 400);
    }, 12000);
    return () => clearInterval(id);
  }, [reminders.length]);

  const item = reminders[index];
  if (!item) return null;

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 shadow-elegant backdrop-blur sm:p-8">
      <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">Reflection</p>
      <div
        className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
        aria-live="polite"
      >
        <p className="text-arabic text-2xl text-gold-soft sm:text-3xl xl:text-4xl">{item.arabic}</p>
        <p className="mt-5 font-display text-xl leading-relaxed text-foreground sm:text-2xl xl:text-3xl">
          &ldquo;{item.translation}&rdquo;
        </p>
        <p className="mt-3 text-sm text-muted-foreground xl:text-base">{item.reference}</p>
      </div>
      <div className="mt-6 flex gap-2">
        {reminders.map((r, i) => (
          <button
            key={r.id}
            aria-label={`Show reflection ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-gold" : "w-3 bg-secondary hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
