"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useProjects } from "@/components/project-provider"
import { Building, Calendar, Clock, DollarSign, Eye } from "lucide-react"
import { cn, translateSector, translateContractType, formatCurrency, formatDate } from "@/lib/utils"
import { useEffect, useState } from "react"

interface InvestmentCardProps {
  investment: any
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  const { t, language, direction } = useLanguage()
  const rtl = direction === "rtl"
  const { projects } = useProjects()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const relatedProject = projects.find((p) => p.id === investment.projectId)
    if (relatedProject) {
      setProject(relatedProject)
    }
  }, [investment, projects])

  if (!project) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "accepted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{project.name}</CardTitle>
          <Badge className={cn("ml-2", getStatusColor(investment.status))}>
            {t(`investment.${investment.status}`)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("investment.amount")}</p>
            <p className="text-lg font-semibold">{formatCurrency(investment.amount, t)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("investment.date")}</p>
            <p className="text-lg">{formatDate(investment.createdAt, language)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{translateSector(project.sector, t)}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{project.returnRate}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(project.createdAt, language)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{translateContractType(project.contractType, t)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/investments/${investment.id}`}>
            <Eye className={cn("h-4 w-4", rtl ? "ml-2" : "mr-2")} />
            {t("project.viewDetails")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
