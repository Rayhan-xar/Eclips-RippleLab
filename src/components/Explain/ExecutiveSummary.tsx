import { FileText } from "lucide-react";
import { executiveSummary } from "@/utils/explanations";

export function ExecutiveSummary() {
  return (
    <section className="glass fade-up rounded-2xl p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-safe">
        <FileText className="size-4" /> Executive summary
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{executiveSummary()}</p>
    </section>
  );
}
