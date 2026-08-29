import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { LICENSED_STATES_LINE } from "@/lib/compliance";
import { HQ_CITY, HQ_LINE1, HQ_LINE2, HOURS, PHONE_DISPLAY, PHONE_HREF, TTY } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <Logo variant="primary" color="white" className="h-16 max-w-[220px]" />
          <p className="max-w-xs text-sm leading-relaxed text-elevated/75">
            INSUREitALL LLC is a licensed Medicare insurance agency helping people
            understand their coverage options.
          </p>
          <p className="text-xs text-elevated/55">NPN: 20114179</p>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold tracking-wide">Contact</h3>
          <a href={PHONE_HREF} className="mt-3 block text-lg font-medium text-elevated">
            {PHONE_DISPLAY}
          </a>
          <p className="mt-1 text-sm text-elevated/70">
            {HOURS} · {TTY}
          </p>
          <p className="mt-2 text-sm text-elevated/70">
            By calling, you will be connected to a licensed insurance agent. Calls
            are recorded and monitored for quality, training, and compliance.
          </p>
          <a href="mailto:info@team-iia.com" className="mt-3 block text-sm text-elevated/85">
            info@team-iia.com
          </a>
          <p className="mt-2 text-sm text-elevated/70">
            {HQ_LINE1}
            <br />
            {HQ_LINE2}
            <br />
            {HQ_CITY}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wide">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm text-elevated/80">
              <li>
                <Link to="/needs-analysis">Needs Analysis</Link>
              </li>
              <li>
                <Link to="/compare">Plan Choice Audit</Link>
              </li>
              <li>
                <Link to="/medicare-basics">Medicare Basics</Link>
              </li>
              <li>
                <Link to="/bridget">BRIDGEt</Link>
              </li>
              <li>
                <Link to="/lead">Request a call back</Link>
              </li>
              <li>
                <Link to="/portal">Client Portal (coming soon)</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wide">Legal</h3>
            <TpmoDisclaimer
              withNonAffiliation
              className="mt-3 text-elevated/60"
            />
            <p className="mt-3 flex flex-col gap-2 text-xs text-elevated/70">
              <Link to="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              <Link to="/hipaa" className="underline underline-offset-2">
                HIPAA & PHI
              </Link>
              <Link to="/glba" className="underline underline-offset-2">
                GLBA Privacy Notice
              </Link>
              <Link to="/security" className="underline underline-offset-2">
                Information Security
              </Link>
              <Link to="/terms" className="underline underline-offset-2">
                Terms of Use
              </Link>
              <Link to="/ai-disclosure" className="underline underline-offset-2">
                AI Disclosure
              </Link>
              <Link to="/accessibility" className="underline underline-offset-2">
                Accessibility
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-elevated/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-elevated/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
          <div className="flex flex-col gap-2">
            <p>{LICENSED_STATES_LINE}</p>
            <p>© 2026 INSUREitALL LLC. All rights reserved.</p>
          </div>
          <Link
            to="/team"
            className="inline-flex min-h-11 shrink-0 items-center text-[0.7rem] font-semibold tracking-[0.18em] text-elevated/45 uppercase underline underline-offset-4 transition-colors hover:text-gold"
          >
            Team Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
