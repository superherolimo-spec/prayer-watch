import { VolumeX } from "lucide-react";
import type { IqamahAlert } from "@/lib/prayer-times";

export function SilentBanner({ alert }: { alert: IqamahAlert }) {
  return (
    <div
      role="status"
      className="ring-gold flex flex-col items-center gap-2 rounded-3xl border border-gold/50 bg-gold/10 px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-5 sm:text-left"
    >
      <VolumeX className="size-7 shrink-0 text-gold xl:size-9" />
      <div>
        <p className="font-display text-xl font-semibold text-gold-soft xl:text-3xl">
          Please turn phones to silent mode for prayer
        </p>
        <p className="text-sm text-muted-foreground xl:text-lg">
          {alert.name} Iqamah in {alert.minutes} {alert.minutes === 1 ? "minute" : "minutes"}
        </p>
      </div>
    </div>
  );
}
