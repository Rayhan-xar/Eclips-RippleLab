import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Network, Waves, MousePointerClick } from "lucide-react";
import { PageHeader } from "@/components/layout/Header";
import { RippleLogo } from "@/components/layout/Sidebar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RippleLab — Team ECLIPSE" },
      {
        name: "description",
        content:
          "Why dependency chokepoints matter, how RippleLab computes Ripple Scores, and the team behind it at Manipal Hackathon 2026.",
      },
      { property: "og:title", content: "About RippleLab — Team ECLIPSE" },
      {
        property: "og:description",
        content: "The problem, the method, the Ripple Score formula and Team ECLIPSE.",
      },
    ],
  }),
  component: AboutPage,
});

const STEPS = [
  {
    icon: FileSearch,
    title: "Dependency extraction",
    text: "Parse manifests and lockfiles into a normalised list of packages, versions and tiers.",
  },
  {
    icon: Network,
    title: "Graph construction",
    text: "Build a directed graph where every edge records “A depends on B”, plus its reverse index.",
  },
  {
    icon: Waves,
    title: "Propagation simulation",
    text: "Reverse breadth-first search from a compromised node reveals the true blast radius, wave by wave.",
  },
  {
    icon: MousePointerClick,
    title: "Interactive analysis",
    text: "Centrality metrics, mitigation comparison and a plain-language report for responders.",
  },
];

const TEAM = [
  "Mohammed Rayhan",
  "Mukund S Belawadi",
  "Poorvashree S",
  "Aisiri Rajesh",
  "Maahi Sachin Nale",
];

const STACK = ["React", "TypeScript", "Tailwind CSS", "Force Graph", "Graph Theory", "Deterministic NLG"];

function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        eyebrow="About"
        title="RippleLab"
        description="An open-source supply chain risk lab: find the packages that would hurt most, before an attacker does."
      />

      <section className="glass fade-up rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-safe">
          The problem
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          Modern applications import a handful of packages directly and inherit hundreds
          indirectly. The dangerous packages are rarely the ones teams chose — they are tiny,
          unglamorous utilities buried three layers down that every library happens to share.
          When one of those is hijacked, the compromise travels upward silently: event-stream,
          ua-parser-js and colors each broke thousands of applications that had never heard of
          them. Teams have inventories of what they depend on, but almost no way to answer the
          question that matters during an incident: <em>if this package falls, what falls with it?</em>
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          How RippleLab works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="glass fade-up rounded-2xl p-5" style={{ animationDelay: `${i * 70}ms` }}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-safe/15 text-safe">
                <s.icon className="size-5" />
              </span>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-semibold">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-safe">
          The Ripple Score
        </h2>
        <p className="mt-3 rounded-xl bg-background/50 p-4 text-center font-mono text-sm">
          Ripple = 0.3 · degree + 0.4 · betweenness + 0.3 · downstream reach
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            [
              "Degree centrality",
              "How many packages touch this one directly, relative to the busiest node in the graph.",
            ],
            [
              "Betweenness centrality",
              "How often this package sits on the shortest propagation path between two others (Brandes' algorithm).",
            ],
            [
              "Downstream reach",
              "The fraction of end-user applications a compromise here would eventually reach.",
            ],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-border bg-background/40 p-4">
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-highlight/15 text-highlight">
            <RippleLogo className="size-6" />
          </span>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-highlight">
              Team ECLIPSE
            </h2>
            <p className="text-xs text-muted-foreground">Manipal Institute of Technology</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((name) => (
            <div key={name} className="rounded-xl border border-border bg-background/40 px-4 py-3">
              <p className="text-sm font-medium">{name}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          Built for Manipal Hackathon 2026 · Cybersecurity Track
        </p>
      </section>
    </div>
  );
}
