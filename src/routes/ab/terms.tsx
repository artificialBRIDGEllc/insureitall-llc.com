import { createFileRoute, Link } from "@tanstack/react-router";
import { AB_PRODUCT } from "@/lib/ab";
import { AB_EFFECTIVE, AB_EMAIL, AB_ENTITY } from "@/lib/ab-legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ab/terms")({
  component: AbTermsPage,
  head: () =>
    pageHead({
      title: "terms — artificialBRIDGE LLC",
      description: "Terms for fileBRIDGE. Software, not insurance. Wyoming LLC.",
      path: "/ab/terms",
    }),
});

function AbTermsPage() {
  return (
    <article className="space-y-8 text-sm leading-relaxed text-[var(--ab-ink-2)]">
      <p className="text-[0.7rem] tracking-[0.28em] text-[var(--ab-ink-3)]">terms of use</p>
      <h1 className="text-4xl tracking-tight text-[var(--ab-ink)]">{AB_PRODUCT}</h1>
      <p>
        by using {AB_PRODUCT} you agree to these terms with {AB_ENTITY.legalName}.
        effective {AB_EFFECTIVE}. if you do not agree, do not use it.
      </p>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">1. the product</h2>
        <p className="mt-3">
          {AB_PRODUCT} is software that holds a coverage story you type. it is
          not an insurance policy, not a quote, not a recommendation, and not an
          enrollment. licensed agents still have to talk to you. we are{" "}
          {AB_ENTITY.not[0]}.
        </p>
      </section>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">2. your account</h2>
        <p className="mt-3">
          you must be 18. you keep the file accurate. you do not enter a social
          security number or medicare number. you may grant an agency access to
          specific fields. you may revoke that access. sharing is not a transfer
          of a book of business.
        </p>
      </section>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">3. our license to you</h2>
        <p className="mt-3">
          we give you a personal, revocable, non-transferable right to use{" "}
          {AB_PRODUCT} for your own coverage story. we own the software, the
          name, and the marks. you own the words you type. we may deidentify
          those words as described in the{" "}
          <Link to="/ab/privacy" className="text-[var(--ab-accent)]">
            privacy policy
          </Link>
          .
        </p>
      </section>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">4. agencies</h2>
        <p className="mt-3">
          INSUREitALL LLC and any other shop you connect is a third party. their
          advice is theirs. we are not responsible for a plan they sell or fail
          to sell. they see only what you grant.
        </p>
      </section>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">5. no warranty</h2>
        <p className="mt-3">
          the service is provided as is. to the fullest extent the law allows,
          {AB_ENTITY.legalName} is not liable for indirect or consequential loss,
          or for an enrollment decision you or an agent make.
        </p>
      </section>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">6. law</h2>
        <p className="mt-3">
          wyoming law, without regard to conflict-of-law rules. you may have
          other rights in your state that these terms cannot take away.
        </p>
      </section>
      <section>
        <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">7. contact</h2>
        <p className="mt-3">
          <a className="text-[var(--ab-accent)]" href={`mailto:${AB_EMAIL}`}>
            {AB_EMAIL}
          </a>
        </p>
      </section>
    </article>
  );
}
