import { Palette, Check, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { THEMES, type ThemeId } from "@/lib/themes";

type Props = {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  pattern: boolean;
  onPatternChange: (value: boolean) => void;
};

export function ThemePicker({ theme, onThemeChange, pattern, onPatternChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Choose a theme"
          className="rounded-full border border-border/70 bg-card/60 backdrop-blur"
        >
          <Palette className="size-5 text-gold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onSelect={() => onThemeChange(t.id)}
            className="flex items-center gap-3 py-2.5"
          >
            <span className="flex shrink-0 items-center -space-x-1.5">
              {t.swatch.map((c) => (
                <span
                  key={c}
                  className="size-4 rounded-full border border-border/60"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{t.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{t.hint}</span>
            </span>
            {theme === t.id && <Check className="size-4 shrink-0 text-gold" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onPatternChange(!pattern); }} className="gap-3 py-2.5">
          <Sparkles className="size-4 text-gold" />
          <span className="flex-1 text-sm">Geometric overlay</span>
          <span className="text-xs text-muted-foreground">{pattern ? "On" : "Off"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
