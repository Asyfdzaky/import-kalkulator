import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "./CurrencyInput";
import { PercentageInput } from "./PercentageInput";
import { ResultRow } from "./ResultRow";
import {
  EXCHANGE_RATES,
  FREIGHT_RATES,
  TRUCKING_OPTIONS,
  calculateImportCosts,
  formatCurrency,
  formatDecimal,
  getExchangeRate,
  getCurrencyLabel,
} from "@/lib/importCalculations";
import headerImage from "@/assets/header.png";
import { STORAGE_RATE_PER_KG_DAY } from "@/lib/importCalculations";
import { CalculationInput, CalculationResult } from "@/types";
import { Calculator, RotateCcw, DollarSign, Ship, FileText, Truck, Package } from "lucide-react";

const initialState: CalculationInput = {
  currency: "USD",
  goodsValue: 0,
  incoterm: "CIF",
  region: "ASEAN",
  bmRate: 0,
  ppnRate: 11,
  pphRate: 2.5,
  ppnbmRate: 0,
  truckingType: "20ft",
  storageWeight: 0,
  storageDays: 0,
};

export function ImportCalculator() {
  const [input, setInput] = useState<CalculationInput>(initialState);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const updateInput = <K extends keyof CalculationInput>(
    key: K,
    value: CalculationInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    const calculationResult = calculateImportCosts(input);
    setResult(calculationResult);
  };

  const handleReset = () => {
    setInput(initialState);
    setResult(null);
  };

  const exchangeRate = getExchangeRate(input.currency);
  const currencyLabel = getCurrencyLabel(input.currency);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="w-full">
        <img 
          src={headerImage} 
          alt="PAL Indonesia - Calculate EXIM" 
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-primary rounded-xl">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Import Simulation Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Simulasi biaya impor Indonesia - Kalkulasi Total DDP
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Currency & Goods Value */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Mata Uang & Nilai Barang
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="input-wrapper">
                  <Label>Mata Uang</Label>
                  <Select
                    value={input.currency}
                    onValueChange={(value) => updateInput("currency", value)}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {EXCHANGE_RATES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-sm text-secondary-foreground">
                    Kurs: <span className="font-semibold">1 {input.currency} = Rp {formatDecimal(exchangeRate)}</span>
                  </p>
                </div>

                <CurrencyInput
                  id="goodsValue"
                  label={`Nilai Barang (${input.currency})`}
                  value={input.goodsValue}
                  onChange={(value) => updateInput("goodsValue", value)}
                  prefix={`${input.currency} `}
                />

                {input.goodsValue > 0 && (
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">
                      Setara: <span className="font-semibold">Rp {formatCurrency(input.goodsValue * exchangeRate)}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Incoterm & Freight */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ship className="h-5 w-5 text-primary" />
                  Incoterm & Freight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="input-wrapper">
                  <Label>Incoterm</Label>
                  <Select
                    value={input.incoterm}
                    onValueChange={(value: "CIF" | "FOB") =>
                      updateInput("incoterm", value)
                    }
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                      <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {input.incoterm === "FOB" && (
                  <div className="input-wrapper">
                    <Label>Region Asal</Label>
                    <Select
                      value={input.region}
                      onValueChange={(value) => updateInput("region", value)}
                    >
                      <SelectTrigger className="bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FREIGHT_RATES).map(([region, rate]) => (
                          <SelectItem key={region} value={region}>
                            {region} ({(rate * 100).toFixed(0)}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Freight rate + Insurance 0.5%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import Duties & Taxes */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Bea Masuk & Pajak Impor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <PercentageInput
                    id="bmRate"
                    label="Bea Masuk (BM)"
                    value={input.bmRate}
                    onChange={(value) => updateInput("bmRate", value)}
                  />
                  <PercentageInput
                    id="ppnRate"
                    label="PPN"
                    value={input.ppnRate}
                    onChange={(value) => updateInput("ppnRate", value)}
                  />
                  <PercentageInput
                    id="pphRate"
                    label="PPh"
                    value={input.pphRate}
                    onChange={(value) => updateInput("pphRate", value)}
                  />
                  <PercentageInput
                    id="ppnbmRate"
                    label="PPnBM"
                    value={input.ppnbmRate}
                    onChange={(value) => updateInput("ppnbmRate", value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trucking & Storage */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  Trucking & Timbun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="input-wrapper">
                  <Label>Jenis Container</Label>
                  <Select
                    value={input.truckingType}
                    onValueChange={(value) => updateInput("truckingType", value)}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRUCKING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - Rp {formatCurrency(option.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CurrencyInput
                    id="storageWeight"
                    label="Berat (kg)"
                    value={input.storageWeight}
                    onChange={(value) => updateInput("storageWeight", value)}
                    suffix=" kg"
                  />
                  <CurrencyInput
                    id="storageDays"
                    label="Lama Timbun (hari)"
                    value={input.storageDays}
                    onChange={(value) => updateInput("storageDays", value)}
                    suffix=" hari"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Biaya timbun: Rp {formatCurrency(STORAGE_RATE_PER_KG_DAY)}/kg/hari
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleCalculate}
                className="flex-1 h-12 text-base font-semibold"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Hitung
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 px-6"
                size="lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-4 bg-secondary/30 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Hasil Kalkulasi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {result ? (
                  <div className="space-y-6">
                    {/* Customs Value Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Nilai Pabean
                      </h4>
                      <div className="space-y-1">
                        <ResultRow
                          label="Nilai Barang (IDR)"
                          value={result.goodsValueIDR}
                        />
                        {input.incoterm === "FOB" && (
                          <>
                            <ResultRow label="Freight" value={result.freight} />
                            <ResultRow label="Insurance" value={result.insurance} />
                          </>
                        )}
                        <ResultRow
                          label="Nilai Pabean (CIF)"
                          value={result.customsValue}
                          isHighlight
                        />
                      </div>
                    </div>

                    {/* Duties & Taxes Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Bea & Pajak
                      </h4>
                      <div className="space-y-1">
                        <ResultRow label="Bea Masuk (BM)" value={result.beaMasuk} />
                        <ResultRow
                          label="Nilai Impor"
                          value={result.importValue}
                          isHighlight
                        />
                        <ResultRow label="PPN" value={result.ppn} />
                        <ResultRow label="PPh" value={result.pph} />
                        <ResultRow label="PPnBM" value={result.ppnbm} />
                        <ResultRow
                          label="Total Bea & Pajak"
                          value={result.totalDutiesTaxes}
                          isHighlight
                        />
                      </div>
                    </div>

                    {/* Inland Transport Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Biaya Inland
                      </h4>
                      <div className="space-y-1">
                        <ResultRow label="Trucking" value={result.truckingCost} />
                        <ResultRow label="Timbun" value={result.storageCost} />
                        <ResultRow
                          label="Total Biaya Inland"
                          value={result.totalInlandTransport}
                          isHighlight
                        />
                      </div>
                    </div>

                    {/* Total DDP */}
                    <div className="pt-2">
                      <ResultRow
                        label="TOTAL DDP"
                        value={result.totalDDP}
                        isTotal
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                      <Calculator className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Masukkan data dan klik <strong>Hitung</strong> untuk melihat hasil
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Import Simulation Calculator © 2024</p>
          <p className="mt-1">Simulasi ini hanya untuk estimasi, bukan perhitungan resmi.</p>
        </div>
        </div>
      </div>
    </div>
  );
}
