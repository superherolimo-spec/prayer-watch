import { Sunrise, ShieldCheck } from "lucide-react";
import type { NaflStatus } from "@/lib/prayer-times";

export function NaflBadge({ status }: { status: NaflStatus }) {
  return (
    <div
      className={`flex items-start gap-4 rounded-3xl border px-6 py-5 backdrop-blur ${
        status.allowed ? "border-border bg-card/70" : "border-gold/50 bg-gold/10"
      }`}
    >
      {status.allowed ? (
        <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary xl:size-8" />
      ) : (
        <Sunrise className="mt-0.5 size-6 shrink-0 text-gold xl:size-8" />
      )}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Nafl prayer</p>
        <p
          className={`font-display text-xl font-semibold xl:text-2xl ${
            status.allowed ? "text-foreground" : "text-gold"
          }`}
        >
          {status.allowed ? "Permitted now" : `Makrooh — ${status.label}`}
        </p>
        <p className="text-sm text-muted-foreground xl:text-base">
          {status.detail}
          {!status.allowed && status.endsIn != null ? ` Ends in ~${status.endsIn} min.` : ""}
        </p>
      </div>
    </div>
  );
}
