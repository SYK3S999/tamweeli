import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to translate sector
export function translateSector(sector: string | undefined, t: (key: string) => string) {
  if (!sector) return t("sectors.undefined")

  const sectorKey = sector.toLowerCase().replace(/\s+/g, "")
  return t(`sectors.${sectorKey}`) || sector
}

// Helper function to translate contract type
export function translateContractType(contractType: string | undefined, t: (key: string) => string) {
  if (!contractType) return t("contractTypes.undefined")

  const contractTypeKey = contractType.toLowerCase().replace(/\s+/g, "")
  return t(`contractTypes.${contractTypeKey}`) || contractType
}

// Helper function to format currency
export function formatCurrency(amount: number | undefined, t?: (key: string) => string) {
  if (amount === undefined) return `0 ${t ? t("common.currency") : "DZD"}`
  return `${amount.toLocaleString()} ${t ? t("common.currency") : "DZD"}`
}

// Helper function to format date
export function formatDate(dateString: string | undefined, language: string) {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "ar" ? "ar-DZ" : "en-US")
  } catch (error) {
    console.error("Invalid date format:", error)
    return dateString
  }
}

// Helper function to get status color
export function getStatusColor(status: string) {
  switch (status) {
    case "pending":
    case "under-review":
      return "bg-yellow-500"
    case "approved":
    case "accepted":
    case "completed":
      return "bg-green-500"
    case "rejected":
    case "cancelled":
      return "bg-red-500"
    case "draft":
    case "in-progress":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

// Helper function to truncate text
export function truncateText(text: string, maxLength: number) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
