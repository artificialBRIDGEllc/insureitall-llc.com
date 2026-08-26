import { createFileRoute, Link } from "@tanstack/react-router";
import { AB_PRODUCT } from "@/lib/ab";
import { AB_EFFECTIVE, AB_EMAIL, AB_ENTITY, AB_SUBPROCESSORS } from "@/lib/ab-legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ab/privacy")({
  component: AbPrivacyPage,
  head: () =>
    pageHead({
      title: "privacy — artificialBRIDGE LLC",
      description: "How artificialBRIDGE LLC handles fileBRIDGE accounts. Not INSUREitALL. Not Medicare.",
      path: "/ab/privacy",
    }),
});

function AbPrivacyPage() {
  return (
    <article className="space-y-8 text-sm leading-relaxed text-[var(--ab-ink-2)]">
      <p className="text-[0.7rem] tracking-[0.28em] text-[var(--ab-ink-3)]">privacy policy</p>
      <h1 className="text-4xl tracking-tight text-[var(--ab-ink)]">your file, our company</h1>
      <p>
        this policy is for {AB_PRODUCT}, owned and operated by {AB_ENTITY.legalName}.
        effective {AB_EFFECTIVE}. it is not the INSUREitALL LLC policy. it is not
        medicare.gov.
      </p>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">who is the controller</h2>
        <p className="mt-3">
          {AB_ENTITY.legalName}, a {AB_ENTITY.formation}, {AB_ENTITY.managed}.
          contact{" "}
          <a className="text-[var(--ab-accent)]" href={`mailto:${AB_EMAIL}`}>
            {AB_EMAIL}
          </a>
          . we decide why {AB_PRODUCT} exists and how the account is stored.
          INSUREitALL LLC is not the controller of your fileBRIDGE account. they
          become a <em>recipient</em> of specific fields only after you grant
          consent, and a business associate only if a BAA is in force for those
          fields.
        </p>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">what we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>account: email, password hash or a sign-in token from Google or X if you pick that</li>
          <li>file: zip, budget comfort, optional doctor names, optional medication names, notes you type</li>
          <li>consent log: which partner, which fields, when you granted or revoked</li>
          <li>share codes you create, and when a permitted viewer opens them</li>
          <li>technical: IP and user-agent as the host logs them, to keep the service up</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">what we never collect</h2>
        <p className="mt-3">
          social security numbers, medicare beneficiary identifiers, bank
          accounts, card images, uploaded medical records, or voice recordings
          of you. do not type those into {AB_PRODUCT}. if you paste one by
          mistake we delete it when we find it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">why we use it</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>to show you your file when you sign in</li>
          <li>to share only the fields you check with an agency you name, while that consent is on</li>
          <li>to keep a record that you granted or revoked that access</li>
          <li>to deidentify (HIPAA Safe Harbor identifiers stripped, or aggregated) and improve {AB_PRODUCT} and BRIDGEt — never to train on a named person plus a drug list</li>
          <li>to secure the service and stop abuse</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">who we share with</h2>
        <p className="mt-3">
          we do not sell personal information. we do not share it for cross-context
          advertising. we share:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            with INSUREitALL LLC or another partner you pick — and only the
            fields you checked — after express consent. revoke and the live
            access stops
          </li>
          <li>with subprocessors who host the app, under contracts that limit their use</li>
          <li>if the law requires it</li>
        </ul>
        <p className="mt-3">subprocessors today:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {AB_SUBPROCESSORS.map((s) => (
            <li key={s.name}>
              {s.name} — {s.role}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">your rights</h2>
        <p className="mt-3">
          you can access, correct, or delete your file from the account (download
          or type DELETE on My file), or email {AB_EMAIL}. you can revoke agency consent in one tap. california,
          texas, and similar state laws: we do not sell or share as those
          statutes define those words. we will honor a request to know or delete.
          we do not discriminate for exercising a right.
        </p>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">how long we keep it</h2>
        <p className="mt-3">
          the file stays until you delete the account. consent events stay up to
          three years so we can show what you granted. deidentified or aggregated
          data may remain because it is no longer personal. backups roll off on
          the host’s normal cycle.
        </p>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">cookies</h2>
        <p className="mt-3">
          we use a session cookie so you stay signed in. no ad network. no sale
          of browsing history.
        </p>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">children</h2>
        <p className="mt-3">
          {AB_PRODUCT} is for adults handling medicare coverage. it is not for
          children under 13, and we do not want accounts from anyone under 18.
        </p>
      </section>

      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">security</h2>
        <p className="mt-3">
          transport is TLS. staff at an agency cannot open your file without a
          live consent or share code. that is not a HIPAA certificate.
        </p>
      </section>

      <p>
        more about the company:{" "}
        <Link to="/ab" className="text-[var(--ab-accent)]">
          entity
        </Link>
        . rules of the product:{" "}
        <Link to="/ab/terms" className="text-[var(--ab-accent)]">
          terms
        </Link>
        .
      </p>
    </article>
  );
}
