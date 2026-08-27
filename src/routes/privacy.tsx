import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () =>
    pageHead({
      title: "Privacy Policy",
      description: "How INSUREitALL LLC handles the information you share with us.",
      path: "/privacy",
    }),
});

function PrivacyPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lede="How INSUREitALL LLC handles the information you share with us."
      />
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-12 text-sm leading-relaxed text-ink sm:px-6">
        <section>
          <h2 className="font-display text-2xl text-navy">Who we are</h2>
          <p className="mt-3">
            INSUREitALL LLC (NPN 20114179), 3550 Buschwood Park Dr, Ste 180, Tampa,
            FL 33618.
            Email{" "}
            <a className="text-blue" href="mailto:info@team-iia.com">
              info@team-iia.com
            </a>
            . Phone{" "}
            <a className="text-blue" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">What we collect</h2>
          <p className="mt-3">
            When you request a call back or send a needs analysis, we collect the
            name, phone number, email, zip, callback window, and any notes you
            type on <em>this</em> site. Optional doctor and medication names on
            those INSUREitALL forms stay with INSUREitALL LLC so a licensed agent
            can prepare.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">What we never collect on this site</h2>
          <p className="mt-3">
            We never ask for a Social Security number, a Medicare number (the
            number on your red, white, and blue card), bank accounts, or uploaded
            medical records. Do not type those into a form, the portal, or BRIDGEt.
            Optional doctor names and medication names you choose to share are
            used so a licensed INSUREitALL agent can prepare. They stay with
            INSUREitALL. They are not sold. They are not included in team alert
            emails. We may use de-identified or aggregated information (never
            SSN or Medicare numbers, never a row that still identifies you) to
            train and improve BRIDGEt or this site. The public control map is on{" "}
            <Link className="text-blue" to="/hipaa">
              HIPAA & PHI
            </Link>
            . The sharing rules are on the{" "}
            <Link className="text-blue" to="/glba">
              GLBA Privacy Notice
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Consent to contact</h2>
          <p className="mt-3">
            If you check the consent box on a form, you provide express written
            consent for a licensed INSUREitALL agent to contact you at the phone
            and email you provided, including by phone, email, and text, and
            including through automated technology, autodialed and prerecorded
            calls and texts. Consent is not a condition of purchase. Message and
            data rates may apply; message frequency varies. Reply STOP to opt out
            or HELP for help.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Call recording</h2>
          <p className="mt-3">
            Calls to and from INSUREitALL are recorded and monitored for quality,
            training, and compliance purposes.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Client portal</h2>
          <p className="mt-3">
            beneficiaryCONNECT is a separate client portal that will connect
            with your INSUREitALL coverage file. It is coming soon and is not
            live yet — no account, coverage file, or third-party redirect is
            active from this site today. This section will be updated with
            the portal operator's privacy details when it launches.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">How we use and share</h2>
          <p className="mt-3">
            We use your information to respond to your request, to discuss plan
            options we represent in your area, and to meet carrier, CMS, and
            state compliance requirements. We do not sell your personal
            information. Identifiable doctor and medication names stay with
            INSUREitALL. We may use de-identified or aggregated data to train
            and improve BRIDGEt or this site, as described in the design-partner
            license. We may share your information with contracted licensed
            agents, carriers when you ask us to, and vendors who process
            communications on our behalf, under agreements that limit their use.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">BRIDGEt and AI</h2>
          <p className="mt-3">
            The BRIDGEt widget is an educational advocate, not a licensed agent.
            Chat is not the place for Social Security numbers, Medicare numbers,
            medication lists, or medical records. If you want an agent to know
            your doctors or drugs, use the{" "}
            <Link className="text-blue" to="/needs-analysis">
              needs analysis
            </Link>{" "}
            or your portal file. See the{" "}
            <Link className="text-blue" to="/ai-disclosure">
              AI Disclosure
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Your choices</h2>
          <p className="mt-3">
            You may opt out of texts by replying STOP, and you may email{" "}
            <a className="text-blue" href="mailto:info@team-iia.com">
              info@team-iia.com
            </a>{" "}
            or call {PHONE_DISPLAY} to update or delete a request or portal
            account.
          </p>
        </section>
        <p className="text-xs text-muted">Last updated August 25, 2026.</p>
      </main>
    </SiteShell>
  );
}
