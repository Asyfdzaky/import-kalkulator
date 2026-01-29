import { ExchangeRate, TruckingOption, CalculationInput, CalculationResult } from "@/types";

export const EXCHANGE_RATES: ExchangeRate[] = [
  { code: "USD", rate: 16870, label: "USD - Dollar Amerika" },
  { code: "EUR", rate: 19622.89, label: "EUR - Euro" },
  { code: "JPY", rate: 10643.51, label: "JPY - Yen Jepang" },
  { code: "CNY", rate: 2420.85, label: "CNY - Yuan China" },
  { code: "SGD", rate: 13098.65, label: "SGD - Dollar Singapura" },
  { code: "KRW", rate: 11.47, label: "KRW - Won Korea" },
  { code: "LKR", rate: 54.57, label: "LKR - Rupee Sri Lanka" },
  { code: "PHP", rate: 284.12, label: "PHP - Peso Philipina" },
  { code: "SAR", rate: 4498.41, label: "SAR - Riyal Saudi Arabia" },
  { code: "INR", rate: 186.51, label: "INR - Rupee India" },
  { code: "PKR", rate: 58.89, label: "PKR - Rupee Pakistan" },
  { code: "MMK", rate: 8.02, label: "MMK - Kyat Myanmar" },
  { code: "CHF", rate: 21062.97, label: "CHF - Franc Swiss" },
  { code: "SEK", rate: 1832, label: "SEK - Kroner Swedia" },
  { code: "GBP", rate: 22636.17, label: "GBP - Poundsterling Inggris" },
  { code: "NOK", rate: 1672.85, label: "NOK - Kroner Norwegia" },
  { code: "NZD", rate: 9701.79, label: "NZD - Dollar Selandia Baru" },
  { code: "MYR", rate: 4158.49, label: "MYR - Ringgit Malaysia" },
  { code: "HKD", rate: 2163.37, label: "HKD - Dollar Hongkong" },
  { code: "DKK", rate: 2626.3, label: "DKK - Kroner Denmark" },
  { code: "CAD", rate: 12144.02, label: "CAD - Dollar Kanada" },
  { code: "AUD", rate: 11288.22, label: "AUD - Dollar Australia" },
];

export const TRUCKING_OPTIONS: TruckingOption[] = [
  { value: "none", label: "Tidak Ada", price: 0 },
  { value: "20ft", label: "20ft Container", price: 1500000 },
  { value: "40ft", label: "40ft Container", price: 1800000 },
  { value: "45ft", label: "45ft Container", price: 2300000 },
  { value: "FL", label: "Fuso / Long", price: 12500000 },
];

export const FREIGHT_RATES: Record<string, number> = {
  ASEAN: 0.05,
  Asia: 0.10,
  Europe: 0.15,
  Other: 0.20,
};

export const INSURANCE_RATE = 0.005;

export const STORAGE_RATE_PER_KG_DAY = 54400;

export function getExchangeRate(currencyCode: string): number {
  const currency = EXCHANGE_RATES.find((c) => c.code === currencyCode);
  return currency?.rate || 16870;
}

export function getCurrencyLabel(currencyCode: string): string {
  const currency = EXCHANGE_RATES.find((c) => c.code === currencyCode);
  return currency?.label || currencyCode;
}

export function getTruckingCost(truckingType: string): number {
  const option = TRUCKING_OPTIONS.find((t) => t.value === truckingType);
  return option?.price || 0;
}

export function calculateImportCosts(input: CalculationInput, storageWeight: number = 0): CalculationResult {
  const exchangeRate = getExchangeRate(input.currency);
  const goodsValueIDR = input.goodsValue * exchangeRate;

  let freight = 0;
  let insurance = 0;
  let customsValue = 0;

  if (input.incoterm === "CIF") {
    customsValue = goodsValueIDR;
  } else {
    // FOB calculation
    const freightRate = FREIGHT_RATES[input.region || "ASEAN"] || 0.05;
    freight = input.goodsValue * freightRate * exchangeRate;
    insurance = input.goodsValue * INSURANCE_RATE * exchangeRate;
    customsValue = goodsValueIDR + freight + insurance;
  }

  // Import duties calculation
  const beaMasuk = customsValue * (input.bmRate / 100);
  const importValue = customsValue + beaMasuk;
  const ppn = importValue * (input.ppnRate / 100);
  const pph = importValue * (input.pphRate / 100);
  const ppnbm = importValue * (input.ppnbmRate / 100);
  const totalDutiesTaxes = beaMasuk + ppn + pph + ppnbm;

  // Inland transport
  const truckingCost = getTruckingCost(input.truckingType);
  const storageCost = STORAGE_RATE_PER_KG_DAY * storageWeight * input.storageDays;
  const totalInlandTransport = truckingCost + storageCost;

  // Total DDP
  const totalDDP = totalDutiesTaxes + totalInlandTransport;

  return {
    exchangeRate,
    goodsValueIDR,
    freight,
    insurance,
    customsValue,
    beaMasuk,
    importValue,
    ppn,
    pph,
    ppnbm,
    totalDutiesTaxes,
    truckingCost,
    storageCost,
    totalInlandTransport,
    totalDDP,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatDecimal(value: number): string {
  return value.toLocaleString("id-ID", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
