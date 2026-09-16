import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Waves,
  GitCompareArrows,
  FileText,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function RippleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <circle cx="16" cy="16" r="7.5" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.4" />
    </svg>
  );
}

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/simulate", label: "Simulate", icon: Waves },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/explain", label: "Explain", icon: FileText },
  { to: "/about", label: "About", icon: Info },
] as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl transition-[width] duration-300",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="relative flex size-9 items-center justify-center rounded-xl bg-safe/15 text-safe">
          <RippleLogo className="size-6" />
        </span>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight">RippleLab</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Supply chain risk
            </p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            activeProps={{
              className: "bg-safe/12 text-safe ring-1 ring-safe/25",
            }}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="size-[18px]" /> Collapse
            </>
          )}
        </button>
        {!collapsed && (
          <div className="rounded-xl border border-border bg-background/40 p-3">
            <p className="text-xs font-semibold">Team ECLIPSE</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              MIT Manipal
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
