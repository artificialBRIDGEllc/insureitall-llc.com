import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

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
            name, phone number, email, zip code, and any notes you choose to share
            (for example doctors or medications). We use this to have a licensed
            insurance agent contact you about Medicare Advantage, Medicare
            Supplement, and Prescription Drug Plans.
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
          <h2 className="font-display text-2xl text-navy">Portal accounts</h2>
          <p className="mt-3">
            Any consumer may create a no-cost portal account (email and
            password, or Google or X). The portal is not for agents or agencies.
            We store the coverage file you choose to save — zip, doctors,
            medications, budget notes — on your account so it stays with you if
            you change agents, agencies, or carriers. We do not collect Medicare
            numbers in the portal. You may create a share code; only INSUREitALL
            team members can open it inside the scoped operations workspace. You
            may revoke the code at any time. Sharing a code is not an enrollment
            and is not a transfer of a book of business. You may email
            info@team-iia.com to delete the account.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">How we use and share</h2>
          <p className="mt-3">
            We use your information to respond to your request, to discuss plan
            options we represent in your area, and to meet carrier, CMS, and
            state compliance requirements. We do not sell your personal
            information. We may share it with contracted licensed agents,
            carriers when you ask us to, and vendors who process communications
            on our behalf, under agreements that limit their use.
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
            account. This website does not collect Medicare numbers or other PHI
            on public forms.
          </p>
        </section>
        <p className="text-xs text-muted">Last updated August 20, 2026.</p>
      </main>
    </SiteShell>
  );
}
