"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Download, Eye, FileText, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock reports data
const reports = [
  {
    id: "report-1",
    title: "Financial Feasibility Analysis",
    clientName: "Ahmed Al-Farsi",
    clientCompany: "Eco-Friendly Agriculture Tech",
    status: "completed",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    completedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    type: "feasibility",
  },
  {
    id: "report-2",
    title: "Islamic Finance Compliance Review",
    clientName: "Sara Al-Mansouri",
    clientCompany: "Halal Food Delivery Service",
    status: "completed",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
    completedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    type: "islamic",
  },
  {
    id: "report-3",
    title: "Market Analysis and Growth Strategy",
    clientName: "Mohammed Al-Qasimi",
    clientCompany: "Islamic Finance Platform",
    status: "in-progress",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    completedAt: null,
    type: "market",
  },
  {
    id: "report-4",
    title: "Investment Risk Assessment",
    clientName: "Fatima Al-Zahra",
    clientCompany: "Sustainable Energy Solutions",
    status: "draft",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    completedAt: null,
    type: "risk",
  },
  {
    id: "report-5",
    title: "Quarterly Performance Review",
    clientName: "Youssef Al-Bakri",
    clientCompany: "Ethical Investment Fund",
    status: "completed",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    completedAt: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString(),
    type: "performance",
  },
]

export default function ReportsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (!user || user.userType !== "consultant") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t("common.accessDenied")}</h1>
        <p className="text-muted-foreground mb-4">{t("common.consultantOnly")}</p>
        <Button asChild>
          <Link href="/dashboard">{t("common.backToDashboard")}</Link>
        </Button>
      </div>
    )
  }

  // Filter reports based on search term and active tab
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientCompany.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || report.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("consultant.reports")}</h2>
        <p className="text-muted-foreground">{t("consultant.reportsDesc")}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/dashboard/reports/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("consultant.createNewReport")}
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
          <TabsTrigger value="draft">{t("common.draft")}</TabsTrigger>
          <TabsTrigger value="in-progress">{t("common.inProgress")}</TabsTrigger>
          <TabsTrigger value="completed">{t("common.completed")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">{t("consultant.noReportsFound")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{report.title}</CardTitle>
                        <CardDescription>
                          {report.clientName} - {report.clientCompany}
                        </CardDescription>
                      </div>
                      <Badge className={cn(getStatusColor(report.status))}>
                        {report.status === "completed"
                          ? t("common.completed")
                          : report.status === "in-progress"
                            ? t("common.inProgress")
                            : t("common.draft")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.reportType")}</h3>
                        <p className="text-sm capitalize">{report.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.createdOn")}</h3>
                        <p className="text-sm">{new Date(report.createdAt).toLocaleDateString()}</p>
                      </div>
                      {report.completedAt && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.completedOn")}</h3>
                          <p className="text-sm">{new Date(report.completedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/reports/${report.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view")}
                        </Link>
                      </Button>
                      {report.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          {t("common.download")}
                        </Button>
                      )}
                      {report.status !== "completed" && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/reports/${report.id}/edit`}>
                            <FileText className="mr-2 h-4 w-4" />
                            {report.status === "draft" ? t("common.edit") : t("common.continue")}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
