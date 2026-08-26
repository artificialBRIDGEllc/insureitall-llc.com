import { createFileRoute } from "@tanstack/react-router";
import { AB_PRODUCT } from "@/lib/ab";
import { AB_EMAIL, AB_ENTITY } from "@/lib/ab-legal";
import { WY_LLC_STATUTE, WY_SOURCE, WY_TAX_TABLE } from "@/lib/wy-llc-tax";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ab/")({
  component: EntityPage,
  head: () =>
    pageHead({
      title: "entity — artificialBRIDGE LLC",
      description: "Wyoming single-member LLC. One member. Owns and operates fileBRIDGE.",
      path: "/ab",
    }),
});

function EntityPage() {
  return (
    <article className="space-y-6 text-sm leading-relaxed text-[var(--ab-ink-2)]">
      <p className="text-[0.7rem] tracking-[0.28em] text-[var(--ab-ink-3)]">entity</p>
      <h1 className="text-4xl tracking-tight text-[var(--ab-ink)]">{AB_ENTITY.legalName}</h1>
      <p>
        {AB_ENTITY.legalName} is a {AB_ENTITY.formation}. It is {AB_ENTITY.managed}.
        There is no board, no outside capital, and no other company behind it.
        It is one person operating through an LLC.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        {AB_ENTITY.not.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">what we operate</h2>
      <p>
        {AB_PRODUCT} — a beneficiary coverage file at {AB_ENTITY.productUrl}. You
        hold the account. An agency (including INSUREitALL LLC) sees a field only
        after you give express consent, and only until you revoke it.
      </p>
      <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">what we are not</h2>
      <p>
        We are not INSUREitALL. We do not take a book of business. We do not
        enroll anyone in a Medicare plan. A licensed agent still has to do that
        work. fileBRIDGE is software, not a sale of insurance.
      </p>
      <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">relationship to INSUREitALL</h2>
      <p>
        INSUREitALL LLC is a licensed Medicare agency and a design-partner
        licensee. They do not own {AB_PRODUCT}, BRIDGEt, or this company. They
        may integrate if a beneficiary consents. That consent is scoped and
        revocable. A signed BAA, if any, covers hosting and deidentification —
        not a sale of PHI and not identifiable model training.
      </p>
      <p>
        privacy questions:{" "}
        <a className="text-[var(--ab-accent)]" href={`mailto:${AB_EMAIL}`}>
          {AB_EMAIL}
        </a>
      </p>
      <h2 className="text-2xl tracking-tight text-[var(--ab-ink)]">wyoming license tax</h2>
      <p>
        {WY_LLC_STATUTE}. due the first day of the anniversary month. greater of
        $60 or wyoming-situs assets × 0.0002. schedule lives in neon{" "}
        <code>wy_llc_license_tax</code>.{" "}
        <a className="text-[var(--ab-accent)]" href={WY_SOURCE}>
          SOS annual report
        </a>
        .
      </p>
      <div className="overflow-x-auto">
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="text-[var(--ab-ink-3)]">
              <th className="py-2 pr-4">WY assets</th>
              <th className="py-2 pr-4">tax</th>
              <th className="py-2 pr-4">e-file</th>
              <th className="py-2">band</th>
            </tr>
          </thead>
          <tbody>
            {WY_TAX_TABLE.map((row) => (
              <tr key={row.wyAssetsUsd} className="border-t border-[var(--ab-border,#1f2c4a)]">
                <td className="py-2 pr-4 tabular-nums">
                  ${row.wyAssetsUsd.toLocaleString("en-US")}
                </td>
                <td className="py-2 pr-4 tabular-nums">${row.taxUsd.toLocaleString("en-US")}</td>
                <td className="py-2 pr-4">{row.efileOk ? "yes" : "mail"}</td>
                <td className="py-2">{row.band}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
