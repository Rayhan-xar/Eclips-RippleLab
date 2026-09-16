import { Boxes, AppWindow, Share2, ShieldAlert } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { STATS } from "@/utils/graphAnalysis";

export function StatsBar() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total packages"
        value={STATS.totalPackages}
        sub="Across 3 dependency tiers"
        icon={Boxes}
        tone="safe"
        delay={0}
      />
      <MetricCard
        label="Applications"
        value={STATS.applications}
        sub="Top-level services"
        icon={AppWindow}
        tone="highlight"
        delay={60}
      />
      <MetricCard
        label="Dependency edges"
        value={STATS.edges}
        sub="Directed relationships"
        icon={Share2}
        tone="mitigated"
        delay={120}
      />
      <MetricCard
        label="Critical packages"
        value={STATS.critical}
        sub="Ripple Score above 0.70"
        icon={ShieldAlert}
        tone="critical"
        delay={180}
      />
    </div>
  );
}
