import { useEffect, useState } from "react";
import { RippleLogo } from "@/components/layout/Sidebar";

export function Splash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setFading(true), 1200);
    const b = setTimeout(() => setVisible(false), 1800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex size-32 items-center justify-center">
        <span className="ripple-ring absolute size-24 rounded-full border border-safe/50" />
        <span
          className="ripple-ring absolute size-24 rounded-full border border-safe/40"
          style={{ animationDelay: "0.6s" }}
        />
        <span
          className="ripple-ring absolute size-24 rounded-full border border-highlight/40"
          style={{ animationDelay: "1.2s" }}
        />
        <RippleLogo className="size-14 text-safe" />
      </div>
      <p className="mt-6 text-xl font-semibold tracking-tight">RippleLab</p>
      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Mapping the blast radius
      </p>
    </div>
  );
}
