import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";

const rows = [
  {
    label: "How coverage works",
    advantage: "One plan that usually bundles hospital, medical, and often drugs",
    supplement: "Original Medicare (A+B) plus a Medigap policy for cost-sharing",
    pdp: "Stand-alone drug coverage that pairs with Original Medicare",
  },
  {
    label: "Doctors",
    advantage: "Typically a network (HMO/PPO). Referrals may apply.",
    supplement: "Any provider that accepts Medicare — nationwide in most cases",
    pdp: "Pharmacies and formularies vary by plan",
  },
  {
    label: "Monthly cost pattern",
    advantage: "Often lower premium; copays at the point of care",
    supplement: "Higher premium; more predictable when you use care",
    pdp: "Premium + deductible + copays/coinsurance for drugs",
  },
  {
    label: "Extra benefits",
    advantage: "Sometimes dental, vision, hearing, fitness",
    supplement: "Generally does not add extras beyond cost help",
    pdp: "Focused on prescriptions, not extras",
  },
  {
    label: "Best to discuss if",
    advantage: "You want one card and can work within a network",
    supplement: "You travel or want to keep specific specialists",
    pdp: "You stay on Original Medicare and need drug coverage",
  },
];

export function PlanTypeTable() {
  return (
    <div>
      <div className="overflow-x-auto rounded-3xl bg-elevated shadow-card">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-navy text-elevated">
            <tr>
              <th className="px-4 py-3 font-medium"> </th>
              <th className="px-4 py-3 font-medium">Medicare Advantage</th>
              <th className="px-4 py-3 font-medium">Medicare Supplement</th>
              <th className="px-4 py-3 font-medium">Part D (drugs)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border align-top">
                <th className="px-4 py-3 font-medium text-navy">{r.label}</th>
                <td className="px-4 py-3 text-ink">{r.advantage}</td>
                <td className="px-4 py-3 text-ink">{r.supplement}</td>
                <td className="px-4 py-3 text-ink">{r.pdp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TpmoDisclaimer withNonAffiliation className="mt-4 text-muted" />
    </div>
  );
}
