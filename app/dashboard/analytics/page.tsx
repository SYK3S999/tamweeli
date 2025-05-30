"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { BarChart3, Download, LineChart, PieChart } from "lucide-react"

// Mock analytics data
const monthlyRevenue = [
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 52000 },
  { month: "Mar", amount: 48000 },
  { month: "Apr", amount: 61000 },
  { month: "May", amount: 55000 },
  { month: "Jun", amount: 67000 },
  { month: "Jul", amount: 72000 },
  { month: "Aug", amount: 78000 },
  { month: "Sep", amount: 84000 },
  { month: "Oct", amount: 91000 },
  { month: "Nov", amount: 86000 },
  { month: "Dec", amount: 95000 },
]

const clientsByType = [
  { type: "Project Owners", count: 12 },
  { type: "Investors (Individual)", count: 8 },
  { type: "Investors (Institutional)", count: 5 },
]

const reportsByType = [
  { type: "Feasibility Studies", count: 15 },
  { type: "Islamic Finance Compliance", count: 10 },
  { type: "Market Analysis", count: 8 },
  { type: "Risk Assessment", count: 7 },
  { type: "Performance Reviews", count: 12 },
]

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

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

  // Calculate total revenue
  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.amount, 0)

  // Calculate total clients
  const totalClients = clientsByType.reduce((sum, type) => sum + type.count, 0)

  // Calculate total reports
  const totalReports = reportsByType.reduce((sum, type) => sum + type.count, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("consultant.analytics")}</h2>
        <p className="text-muted-foreground">{t("consultant.analyticsDesc")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("consultant.totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString()} {t("common.currency")}
            </div>
            <p className="text-xs text-muted-foreground">{t("consultant.yearToDate")}</p>
            <div className="mt-4 h-1 w-full bg-green-100 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-3/4" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% {t("consultant.fromLastYear")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("consultant.totalClients")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">{t("consultant.activeClients")}</p>
            <div className="mt-4 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-2/3" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+8% {t("consultant.fromLastMonth")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("consultant.totalReports")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">{t("consultant.completedReports")}</p>
            <div className="mt-4 h-1 w-full bg-purple-100 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-4/5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+15% {t("consultant.fromLastQuarter")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t("common.overview")}</TabsTrigger>
          <TabsTrigger value="revenue">{t("consultant.revenue")}</TabsTrigger>
          <TabsTrigger value="clients">{t("consultant.clients")}</TabsTrigger>
          <TabsTrigger value="reports">{t("consultant.reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.monthlyRevenue")}</CardTitle>
              <CardDescription>{t("consultant.monthlyRevenueDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-center h-full">
                <LineChart className="h-40 w-40 text-muted-foreground" />
                <p className="text-center text-muted-foreground">{t("consultant.chartPlaceholder")}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("consultant.clientDistribution")}</CardTitle>
                <CardDescription>{t("consultant.clientDistributionDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex items-center justify-center h-full">
                  <PieChart className="h-32 w-32 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">{t("consultant.chartPlaceholder")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("consultant.reportsByType")}</CardTitle>
                <CardDescription>{t("consultant.reportsByTypeDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="h-32 w-32 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">{t("consultant.chartPlaceholder")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.revenueAnalysis")}</CardTitle>
              <CardDescription>{t("consultant.revenueAnalysisDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("consultant.monthlyBreakdown")}</h3>
                  <div className="space-y-2">
                    {monthlyRevenue.map((month) => (
                      <div key={month.month} className="flex items-center">
                        <div className="w-12 text-sm">{month.month}</div>
                        <div className="flex-1 h-4 mx-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${(month.amount / 100000) * 100}%` }} />
                        </div>
                        <div className="w-24 text-sm text-right">
                          {month.amount.toLocaleString()} {t("common.currency")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.averageMonthly")}</h3>
                    <p className="text-xl font-bold mt-1">
                      {Math.round(totalRevenue / 12).toLocaleString()} {t("common.currency")}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.highestMonth")}</h3>
                    <p className="text-xl font-bold mt-1">
                      {Math.max(...monthlyRevenue.map((m) => m.amount)).toLocaleString()} {t("common.currency")}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.projectedAnnual")}</h3>
                    <p className="text-xl font-bold mt-1">
                      {(totalRevenue * 1.1).toLocaleString()} {t("common.currency")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("consultant.exportRevenueReport")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.clientAnalysis")}</CardTitle>
              <CardDescription>{t("consultant.clientAnalysisDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("consultant.clientsByType")}</h3>
                  <div className="space-y-2">
                    {clientsByType.map((clientType) => (
                      <div key={clientType.type} className="flex items-center">
                        <div className="w-48 text-sm">{clientType.type}</div>
                        <div className="flex-1 h-4 mx-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: `${(clientType.count / totalClients) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-right">{clientType.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t("consultant.averageRevenuePerClient")}
                    </h3>
                    <p className="text-xl font-bold mt-1">
                      {Math.round(totalRevenue / totalClients).toLocaleString()} {t("common.currency")}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.clientRetentionRate")}</h3>
                    <p className="text-xl font-bold mt-1">85%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.newClientsThisMonth")}</h3>
                    <p className="text-xl font-bold mt-1">3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("consultant.exportClientReport")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.reportAnalysis")}</CardTitle>
              <CardDescription>{t("consultant.reportAnalysisDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("consultant.reportsByType")}</h3>
                  <div className="space-y-2">
                    {reportsByType.map((reportType) => (
                      <div key={reportType.type} className="flex items-center">
                        <div className="w-48 text-sm">{reportType.type}</div>
                        <div className="flex-1 h-4 mx-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full"
                            style={{ width: `${(reportType.count / totalReports) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-right">{reportType.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t("consultant.averageReportsPerClient")}
                    </h3>
                    <p className="text-xl font-bold mt-1">{(totalReports / totalClients).toFixed(1)}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t("consultant.averageCompletionTime")}
                    </h3>
                    <p className="text-xl font-bold mt-1">5.2 {t("consultant.days")}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.reportsThisMonth")}</h3>
                    <p className="text-xl font-bold mt-1">8</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("consultant.exportReportAnalysis")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
