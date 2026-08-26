import { MEDICARE_2026, usd } from "@/lib/medicare-2026";

export type CoverageNow = "original" | "advantage" | "medigap" | "unsure";
export type Drugs = "light" | "moderate" | "heavy";
export type CostStyle = "premium" | "predictable" | "unsure";
export type Yn = "yes" | "no" | "unsure";

export type PlanAuditInput = {
  coverageNow: CoverageNow;
  keepDoctors: Yn;
  travel: Yn;
  drugs: Drugs;
  extras: Yn;
  cost: CostStyle;
  medicaid: Yn;
  facility: Yn;
};

export type ArchitectureId =
  | "om_pdp"
  | "om_medigap_pdp"
  | "mapd"
  | "dsnp"
  | "pace";

export type LedgerRow = {
  id: ArchitectureId;
  title: string;
  when: string;
  gained: string[];
  sacrificed: string[];
  watch: string[];
};

const C = MEDICARE_2026;
const moop = usd(C.mapdInNetworkOopMaxDollars);
const partD = usd(C.partDTrueOopCapDollars);
const pdpDed = usd(C.partDMaxStandardDeductibleDollars);

export function runPlanAudit(input: PlanAuditInput): LedgerRow[] {
  const keep = input.keepDoctors === "yes" || input.travel === "yes";
  const extras = input.extras === "yes";
  const heavyRx = input.drugs === "heavy" || input.drugs === "moderate";
  const wantPredictable = input.cost === "predictable";
  const wantLowPremium = input.cost === "premium";

  const rows: LedgerRow[] = [
    {
      id: "om_pdp",
      title: "Original Medicare + Part D",
      when: "Hospital and medical through Original Medicare. Drugs through a stand-alone Part D plan.",
      gained: [
        `Any provider that accepts Medicare — useful if you travel or keep specialists.`,
        `Drug spending still hits the ${C.planYear} Part D cap of ${partD}.`,
      ],
      sacrificed: [
        `No annual out-of-pocket cap on medical. Part B coinsurance is ${C.partBCoinsurancePercent}%.`,
        extras ? "Original Medicare does not add dental, vision, or hearing extras." : "No bundled extras.",
      ],
      watch: [
        heavyRx
          ? `Part D plans may still charge up to ${pdpDed} deductible before the ${partD} cap.`
          : `Formulary and pharmacy networks still vary by Part D plan.`,
      ],
    },
    {
      id: "om_medigap_pdp",
      title: "Original Medicare + Supplement + Part D",
      when: "Medigap pays much of the Original Medicare cost-sharing. Drugs stay on Part D.",
      gained: [
        wantPredictable || keep
          ? "More predictable medical costs and nationwide Medicare doctors in most cases."
          : "Cost-sharing help on top of Original Medicare.",
        `Same ${partD} Part D cap as other drug coverage.`,
      ],
      sacrificed: [
        "Higher monthly premium than most Advantage plans.",
        extras ? "Still no dental/vision extras from the Supplement itself." : "No extra-benefit card.",
      ],
      watch: [
        "Medigap is guaranteed-issue in limited windows. An agent checks whether you can still buy it.",
      ],
    },
    {
      id: "mapd",
      title: "Medicare Advantage (Part C)",
      when: "One plan that usually bundles hospital, medical, and often drugs.",
      gained: [
        `In-network medical costs are capped. CMS allows up to ${moop} in ${C.planYear}; many plans set less.`,
        extras || wantLowPremium
          ? "Often a lower premium, and sometimes dental, vision, hearing, or fitness."
          : "One card instead of stacking policies.",
        `If the plan includes Part D, the ${partD} drug cap still applies.`,
      ],
      sacrificed: [
        keep
          ? "Networks and referrals can block a doctor you want to keep. Prior auth is common."
          : "You work inside that plan’s network and rules.",
        "Leaving later may mean a Medigap plan is no longer guaranteed-issue.",
      ],
      watch: [
        "This is a plan type, not a list of every Advantage plan in your zip.",
      ],
    },
  ];

  if (input.medicaid === "yes") {
    rows.push({
      id: "dsnp",
      title: "Dual-eligible Special Needs (D-SNP)",
      when: "Only if you have Medicare and full Medicaid. A licensed agent confirms eligibility.",
      gained: ["Coordination between Medicare and Medicaid. Cost-sharing can be very low when eligible."],
      sacrificed: ["Still a network plan. Not available in every county."],
      watch: ["Eligibility is not decided on this page. Bring your Medicaid card to a licensed agent."],
    });
  }

  if (input.facility === "yes") {
    rows.push({
      id: "pace",
      title: "PACE / institutional options",
      when: "Only with a qualifying level of care and a service-area zip.",
      gained: ["Medical, drugs, and long-term services can sit in one program when you qualify."],
      sacrificed: ["You generally use the PACE network for care."],
      watch: ["This page cannot qualify you. Ask a licensed agent or your SHIP."],
    });
  }

  return rows;
}

export const AUDIT_DISCLAIMER =
  "This is an educational trade-off ledger for plan types — not a recommendation, not a quote, and not every plan in your zip. A licensed INSUREitALL agent compares what is actually offered where you live. artificialBRIDGE LLC owns this audit; INSUREitALL runs it under a design-partner license.";
