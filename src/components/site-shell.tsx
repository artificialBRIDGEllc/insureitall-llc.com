import type { ReactNode } from "react";
import { BrandSplash } from "@/components/brand-splash";
import { BridgetCopilot } from "@/components/bridget-copilot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-fg">
      <BrandSplash />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <BridgetCopilot />
    </div>
  );
}
