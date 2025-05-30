"use client"
import { Card, CardHeader } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

interface ServiceCardProps {
  service: any
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "financial":
        return "bg-blue-500"
      case "legal":
        return "bg-purple-500"
      case "islamic":
        return "bg-green-500"
      case "feasibility":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items\
