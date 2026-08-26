/** Mirror of Neon table wy_llc_tax_rule / wy_llc_license_tax. Not tax advice. */

export const WY_LLC_STATUTE = "W.S. 17-29-209";
export const WY_TAX_FLOOR = 60;
export const WY_TAX_RATE = 0.0002;
export const WY_ASSET_BREAK = 300_000;
export const WY_EFILE_MAX = 500;
export const WY_SOURCE = "https://wyobiz.wyo.gov/Business/AnnualReport.aspx";

export type WyTaxRow = {
  wyAssetsUsd: number;
  taxUsd: number;
  efileOk: boolean;
  band: string;
};

export const WY_TAX_TABLE: WyTaxRow[] = [
  { wyAssetsUsd: 0, taxUsd: 60, efileOk: true, band: "floor" },
  { wyAssetsUsd: 100_000, taxUsd: 60, efileOk: true, band: "floor" },
  { wyAssetsUsd: 300_000, taxUsd: 60, efileOk: true, band: "break even" },
  { wyAssetsUsd: 500_000, taxUsd: 100, efileOk: true, band: "rate" },
  { wyAssetsUsd: 1_000_000, taxUsd: 200, efileOk: true, band: "rate" },
  { wyAssetsUsd: 1_210_000, taxUsd: 242, efileOk: true, band: "rate" },
  { wyAssetsUsd: 2_500_000, taxUsd: 500, efileOk: true, band: "efile max" },
  { wyAssetsUsd: 5_000_000, taxUsd: 1_000, efileOk: false, band: "mail only" },
];

export function wyLicenseTax(wyomingSitusAssets: number): number {
  if (!Number.isFinite(wyomingSitusAssets) || wyomingSitusAssets <= 0) return WY_TAX_FLOOR;
  const raw = Math.round(wyomingSitusAssets * WY_TAX_RATE * 100) / 100;
  return Math.max(WY_TAX_FLOOR, raw);
}

export function wyOnlineTotal(taxUsd: number): number {
  const card = Math.max(1, Math.round(taxUsd * 0.024 * 100) / 100);
  return taxUsd >= 500 ? taxUsd : Math.round((taxUsd + card) * 100) / 100;
}
