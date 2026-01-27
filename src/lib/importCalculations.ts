// Exchange rates (hardcoded)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 16870,
};

// Freight rates by region for FOB
export const FREIGHT_RATES: Record<string, number> = {
  ASEAN: 0.05,
  Asia: 0.10,
  Europe: 0.15,
};

// Insurance rate for FOB
export const INSURANCE_RATE = 0.005;

// Trucking costs by container type
export const TRUCKING_COSTS: Record<string, number> = {
  "20 ft": 1500000,
  "40 ft": 1800000,
  "45 ft": 2300000,
  "FL": 12500000,
};

// Storage cost per kg per day
export const STORAGE_RATE_PER_KG_PER_DAY = 54400;

export interface CalculationInput {
  currency: string;
  goodsValue: number;
  incoterm: "CIF" | "FOB";
  region?: string;
  bmRate: number;
  ppnRate: number;
  pphRate: number;
  ppnbmRate: number;
  truckingType: string;
  storageWeight: number;
  storageDays: number;
}

export interface CalculationResult {
  exchangeRate: number;
  goodsValueIDR: number;
  freight: number;
  insurance: number;
  customsValue: number;
  beaMasuk: number;
  importValue: number;
  ppn: number;
  pph: number;
  ppnbm: number;
  totalDutiesTaxes: number;
  truckingCost: number;
  storageCost: number;
  totalInlandTransport: number;
  totalDDP: number;
}

export function calculateImportCosts(input: CalculationInput): CalculationResult {
  const exchangeRate = EXCHANGE_RATES[input.currency] || 16870;
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
  const truckingCost = TRUCKING_COSTS[input.truckingType] || 0;
  const storageCost = STORAGE_RATE_PER_KG_PER_DAY * input.storageWeight * input.storageDays;
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
