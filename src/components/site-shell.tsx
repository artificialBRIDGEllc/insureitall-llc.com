import type { ReactNode } from "react";
import { BrandSplash } from "@/components/brand-splash";
import { BridgetCopilot } from "@/components/bridget-copilot";
import { FeedbackBeacon } from "@/components/feedback-beacon";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ORG_JSON_LD } from "@/lib/seo";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-fg">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <JsonLd data={ORG_JSON_LD} />
      <BrandSplash />
      <FeedbackBeacon />
      <div id="site-chrome">
        <SiteHeader />
        <div id="main" className="flex-1" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter />
        <BridgetCopilot />
      </div>
    </div>
  );
}
