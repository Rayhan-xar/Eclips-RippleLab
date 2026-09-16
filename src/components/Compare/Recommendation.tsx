import { Lightbulb } from "lucide-react";

export function Recommendation({ text }: { text: string }) {
  return (
    <div className="glass fade-up flex gap-4 rounded-2xl border-mitigated/30 p-6 ring-1 ring-mitigated/20">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mitigated/15 text-mitigated">
        <Lightbulb className="size-5" />
      </span>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-mitigated">
          RippleLab recommendation
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{text}</p>
      </div>
    </div>
  );
}
