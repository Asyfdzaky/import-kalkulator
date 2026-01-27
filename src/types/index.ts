export interface ExchangeRate {
  code: string;
  rate: number;
  label: string;
}

export interface TruckingOption {
  value: string;
  label: string;
  price: number;
}

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
