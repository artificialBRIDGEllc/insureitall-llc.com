import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { LICENSED_STATE_COUNT, LICENSED_STATES_LINE } from "@/lib/compliance";
import { HQ_CITY, HQ_LINE1, HQ_LINE2, HOURS, PHONE_DISPLAY, PHONE_HREF, TTY } from "@/lib/utils";

const footerHeading =
  "font-sans text-xs font-semibold tracking-widest text-blue/80 uppercase";

const footerLink =
  "text-sm leading-6 text-elevated/78 transition-colors hover:text-elevated";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-elevated">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-3">
          <Logo variant="primary" color="white" className="h-14 max-w-56" />
          <p className="max-w-xs text-sm leading-6 text-elevated/75">
            INSUREitALL LLC is a licensed Medicare insurance agency helping people
            understand their coverage options with clear, personal guidance.
          </p>
          <p className="text-xs leading-5 text-elevated/55">NPN: 20114179</p>
          <p className="max-w-xs text-xs leading-5 text-elevated/45">
            {LICENSED_STATES_LINE}
          </p>
        </div>

        <div className="lg:col-span-2">
          <h3 className={footerHeading}>Tampa · Florida</h3>
          <p className="mt-4 text-sm leading-6 text-elevated/70">
            Headquarters
            <br />
            {HQ_CITY}
          </p>
          <p className="mt-3 text-xs leading-5 text-elevated/50">
            Licensed in {LICENSED_STATE_COUNT} states
          </p>
        </div>

        <div className="lg:col-span-2">
          <h3 className={footerHeading}>Services</h3>
          <ul className="mt-4 space-y-1">
            <li>
              <Link to="/medicare-basics" className={footerLink}>
                Medicare Basics
              </Link>
            </li>
            <li>
              <Link to="/needs-analysis" className={footerLink}>
                Needs Analysis
              </Link>
            </li>
            <li>
              <Link to="/compare" className={footerLink}>
                Plan Choice Audit
              </Link>
            </li>
            <li>
              <Link to="/lead" className={footerLink}>
                Request a call back
              </Link>
            </li>
            <li>
              <Link to="/bridget" className={footerLink}>
                BRIDGEt
              </Link>
            </li>
            <li>
              <Link to="/portal" className={footerLink}>
                Client Portal
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className={footerHeading}>Company &amp; Legal</h3>
          <ul className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-1">
            <li>
              <Link to="/contact" className={footerLink}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className={footerLink}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/hipaa" className={footerLink}>
                HIPAA &amp; PHI
              </Link>
            </li>
            <li>
              <Link to="/glba" className={footerLink}>
                GLBA Privacy Notice
              </Link>
            </li>
            <li>
              <Link to="/security" className={footerLink}>
                Information Security
              </Link>
            </li>
            <li>
              <Link to="/terms" className={footerLink}>
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/ai-disclosure" className={footerLink}>
                AI Disclosure
              </Link>
            </li>
            <li>
              <Link to="/accessibility" className={footerLink}>
                Accessibility
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <h3 className={footerHeading}>Contact</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-elevated/45 uppercase">
                Call
              </p>
              <a
                href={PHONE_HREF}
                className="mt-1 block text-sm font-semibold text-elevated transition-colors hover:text-gold"
              >
                {PHONE_DISPLAY}
              </a>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-elevated/45 uppercase">
                Hours
              </p>
              <p className="mt-1 text-sm font-semibold text-elevated">{HOURS}</p>
              <p className="mt-1 text-xs text-elevated/55">{TTY}</p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-elevated/45 uppercase">
                Email
              </p>
              <a
                href="mailto:info@team-iia.com"
                className="mt-1 block break-words text-sm font-semibold text-elevated transition-colors hover:text-gold"
              >
                info@team-iia.com
              </a>
            </div>
            <p className="text-sm leading-6 text-elevated/70">
              {HQ_LINE1}
              <br />
              {HQ_LINE2}
              <br />
              {HQ_CITY}
            </p>
            <p className="text-xs leading-5 text-elevated/50">
              By calling, you will be connected to a licensed insurance agent.
              Calls are recorded and monitored for quality, training, and compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-y border-elevated/10 py-6">
          <TpmoDisclaimer
            withNonAffiliation
            className="max-w-none text-sm leading-6 text-elevated/70"
          />
        </div>

        <div className="flex flex-col gap-4 py-5 text-xs text-elevated/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>© 2026 INSUREitALL LLC. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-elevated">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-elevated">
              Legal
            </Link>
            <Link to="/hipaa" className="transition-colors hover:text-elevated">
              Health privacy
            </Link>
            <Link
              to="/medicare-basics"
              className="transition-colors hover:text-elevated"
            >
              Medicare
            </Link>
            <Link
              to="/team"
              className="inline-flex min-h-11 items-center font-semibold tracking-widest text-elevated/45 uppercase transition-colors hover:text-gold"
            >
              Team Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
