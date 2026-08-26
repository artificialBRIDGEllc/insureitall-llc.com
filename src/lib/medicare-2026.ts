/** 2026 CMS dollar anchors. Source: cms-app trade-off ledger. Annual one-file bump. */
export const MEDICARE_2026 = {
  planYear: 2026,
  mapdInNetworkOopMaxDollars: 9350,
  partDTrueOopCapDollars: 2100,
  partDMaxStandardDeductibleDollars: 615,
  partBCoinsurancePercent: 20,
} as const;

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
