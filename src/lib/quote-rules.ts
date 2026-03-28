import type { ApplicationPayload } from "./schema";

export type IndicativeQuote = {
  processingRatePercent: number;
  transactionFeeDollars: number;
  reservePercent: number;
  summary: string;
};

const BASE_RATE = 2.65;
const BASE_TX_FEE = 0.25;

function volumeMultiplier(band: ApplicationPayload["monthlyVolumeBand"]): number {
  switch (band) {
    case "under_50k":
      return 1.0;
    case "50k_250k":
      return 0.95;
    case "250k_1m":
      return 0.9;
    case "over_1m":
      return 0.85;
    default:
      return 1.05;
  }
}

function chargebackAdd(cb: ApplicationPayload["chargebackBand"]): number {
  switch (cb) {
    case "under_50bp":
      return 0;
    case "50_100bp":
      return 0.35;
    case "over_100bp":
      return 0.85;
    case "unknown":
      return 0.5;
    default:
      return 0.4;
  }
}

function industryAdd(industry: string): number {
  const high = ["nutra", "cbd", "gaming", "adult", "travel", "subscription"];
  const lower = industry.toLowerCase();
  if (high.some((k) => lower.includes(k))) return 0.9;
  return 0.15;
}

function countriesAdd(c: ApplicationPayload["countriesSold"]): number {
  if (c === "international") return 0.45;
  if (c === "us_ca") return 0.15;
  return 0;
}

function priorProcessingAdd(p: ApplicationPayload["priorProcessing"]): number {
  if (p === "first_time") return 0.25;
  if (p === "no") return 0.15;
  return 0;
}

export function computeIndicativeQuote(data: ApplicationPayload): IndicativeQuote {
  let rate =
    BASE_RATE +
    industryAdd(data.industry) +
    chargebackAdd(data.chargebackBand) +
    countriesAdd(data.countriesSold) +
    priorProcessingAdd(data.priorProcessing);
  rate *= volumeMultiplier(data.monthlyVolumeBand);

  const txFee = BASE_TX_FEE + (data.avgTicketDollars > 100 ? 0.05 : 0);

  let reserve = 5;
  if (data.chargebackBand === "over_100bp") reserve += 5;
  if (data.chargebackBand === "unknown") reserve += 3;
  if (data.countriesSold === "international") reserve += 3;
  reserve = Math.min(reserve, 20);

  const summary = `Indicative range: ~${rate.toFixed(2)}% + $${txFee.toFixed(2)} per txn; rolling reserve up to ~${reserve}% (underwriting may differ).`;

  return {
    processingRatePercent: Math.round(rate * 100) / 100,
    transactionFeeDollars: Math.round(txFee * 100) / 100,
    reservePercent: reserve,
    summary,
  };
}
