"use client"

import { useLanguage } from "@/components/language-provider"
import { translateSector, translateContractType, formatCurrency } from "@/lib/utils"

// Helper component to translate sector
export function SectorTranslation({ sector }: { sector: string }) {
  const { t } = useLanguage()
  return <>{translateSector(sector, t)}</>
}

// Helper component to translate contract type
export function ContractTypeTranslation({ contractType }: { contractType: string }) {
  const { t } = useLanguage()
  return <>{translateContractType(contractType, t)}</>
}

// Helper component to format currency
export function CurrencyDisplay({ amount }: { amount: number }) {
  const { t } = useLanguage()
  return <>{formatCurrency(amount, t)}</>
}

// Helper component to format date
export function DateDisplay({ date }: { date: string }) {
  const { language } = useLanguage()
  return <>{new Date(date).toLocaleDateString(language === "ar" ? "ar-DZ" : "en-US")}</>
}
