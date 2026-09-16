import { ListChecks } from "lucide-react";
import { mitigationPriorities } from "@/utils/explanations";

export function MitigationPriorities() {
  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-safe">
        <ListChecks className="size-4" /> Mitigation priorities
      </h2>
      <ol className="mt-4 space-y-3">
        {mitigationPriorities().map((p, i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground/90">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-safe/15 font-mono text-xs text-safe">
              {i + 1}
            </span>
            {p}
          </li>
        ))}
      </ol>
    </section>
  );
}
