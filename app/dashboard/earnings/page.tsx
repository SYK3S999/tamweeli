"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, registerables } from "chart.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { ArrowUpRight, BarChart3, PieChart, TrendingUp, Wallet, Loader2, FileText, Download, Badge, ChevronDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

// Register Chart.js components
ChartJS.register(...registerables)

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

// Mock data
const mockUser = { id: "user1", userType: "investor" } // Toggle to "project_owner" for demo
const mockProjects = [
  { id: "proj1", name: "Green Energy Farm", ownerId: "user2", sector: "renewable_energy", totalInvested: 500000 },
  { id: "proj2", name: "Halal Food Startup", ownerId: "user1", sector: "food_and_beverage", totalInvested: 250000 },
  { id: "proj3", name: "Islamic Fintech App", ownerId: "user2", sector: "fintech", totalInvested: 750000 },
  { id: "proj4", name: "Eco-Friendly Housing", ownerId: "user1", sector: "real_estate", totalInvested: 400000 },
  { id: "proj5", name: "Organic Farm Co-op", ownerId: "user2", sector: "agriculture", totalInvested: 300000 },
  { id: "proj6", name: "Education Tech Platform", ownerId: "user1", sector: "education", totalInvested: 200000 },
]
const mockInvestments = [
  { id: "inv1", projectId: "proj1", investorId: "user1", amount: 50000, status: "accepted", createdAt: "2025-03-15" },
  { id: "inv2", projectId: "proj2", investorId: "user1", amount: 25000, status: "accepted", createdAt: "2025-04-20" },
  { id: "inv3", projectId: "proj3", investorId: "user1", amount: 75000, status: "completed", createdAt: "2024-12-10" },
  { id: "inv4", projectId: "proj4", investorId: "user1", amount: 40000, status: "accepted", createdAt: "2025-01-25" },
  { id: "inv5", projectId: "proj5", investorId: "user1", amount: 30000, status: "completed", createdAt: "2025-02-05" },
  { id: "inv6", projectId: "proj6", investorId: "user1", amount: 20000, status: "pending", createdAt: "2025-05-10" },
  { id: "inv7", projectId: "proj1", investorId: "user1", amount: 60000, status: "completed", createdAt: "2024-11-30" },
  { id: "inv8", projectId: "proj3", investorId: "user1", amount: 35000, status: "accepted", createdAt: "2025-03-01" },
  { id: "inv9", projectId: "proj4", investorId: "user1", amount: 45000, status: "completed", createdAt: "2025-04-05" },
  { id: "inv10", projectId: "proj5", investorId: "user1", amount: 25000, status: "accepted", createdAt: "2025-05-25" },
]
const mockWallet = {
  balance: 100000,
  withdrawals: [
    { id: "wd1", amount: 50000, date: "2025-04-15", status: "completed" },
    { id: "wd2", amount: 25000, date: "2025-05-10", status: "pending" },
  ],
}
const mockEarningsData = {
  investor: {
    totalEarnings: 1525000, // 1,525,000 DZD
    monthlyEarnings: 225000, // 225,000 DZD
    pendingEarnings: 75000, // 75,000 DZD
    projectedEarnings: 3000000, // 3,000,000 DZD
  },
  project_owner: {
    totalEarnings: 12500000, // 12,500,000 DZD
    monthlyEarnings: 1800000, // 1,800,000 DZD
    pendingEarnings: 500000, // 500,000 DZD
    projectedEarnings: 25000000, // 25,000,000 DZD
  },
  monthlyData: [
    { month: "Jan", investor: 150000, project_owner: 1200000 },
    { month: "Feb", investor: 175000, project_owner: 1350000 },
    { month: "Mar", investor: 200000, project_owner: 1500000 },
    { month: "Apr", investor: 225000, project_owner: 1650000 },
    { month: "May", investor: 250000, project_owner: 1800000 },
    { month: "Jun", investor: 225000, project_owner: 1700000 },
  ],
}
const mockTransactions = [
  { id: "tx1", projectId: "proj1", amount: 6000, type: "return", date: "2025-05-20", status: "completed" },
  { id: "tx2", projectId: "proj2", amount: 3000, type: "payout", date: "2025-05-15", status: "pending" },
  { id: "tx3", projectId: "proj3", amount: 9000, type: "return", date: "2025-04-30", status: "completed" },
  { id: "tx4", projectId: "proj4", amount: 4800, type: "payout", date: "2025-04-25", status: "completed" },
  { id: "tx5", projectId: "proj5", amount: 3600, type: "return", date: "2025-03-10", status: "completed" },
  { id: "tx6", projectId: "proj6", amount: 2400, type: "payout", date: "2025-02-15", status: "completed" },
  { id: "tx7", projectId: "proj1", amount: 7200, type: "return", date: "2025-01-20", status: "completed" },
]
const mockReports = [
  { id: "rpt1", name: "Q1 2025 Earnings", period: "quarter", date: "2025-04-01", downloadUrl: "#" },
  { id: "rpt2", name: "April 2025 Summary", period: "month", date: "2025-05-01", downloadUrl: "#" },
  { id: "rpt3", name: "Custom Report (Mar-Apr)", period: "custom", date: "2025-05-10", downloadUrl: "#" },
]

export default function EarningsPage() {
  const { t, direction } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (!user) {
    router.push("/auth/login")
    return null
  }

  // Use mock user for demo
  type UserType = "investor" | "project_owner"
  const demoUser = mockUser
  const projects = mockProjects
  const investments = mockInvestments
  const wallet = mockWallet
  const earningsData = mockEarningsData[demoUser.userType as UserType]
  const monthlyData = mockEarningsData.monthlyData.map((m) => ({
    month: m.month,
    amount: m[demoUser.userType as UserType],
  }))

  // Calculate earnings
  const userProjects = projects.filter((project) => project.ownerId === demoUser.id)
  const userInvestments = investments.filter((investment) => investment.investorId === demoUser.id)
  const totalProjectFunding = userProjects.reduce((sum, project) => {
    const projectInvestments = investments.filter((inv) => inv.projectId === project.id && inv.status === "accepted")
    return sum + projectInvestments.reduce((total, inv) => total + inv.amount, 0)
  }, 0)
  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturns = totalInvested * 0.12

  // Chart data
  const barChartData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: t("earnings.monthlyEarnings"),
        data: monthlyData.map((m) => m.amount),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  }
  const pieChartData = {
    labels: userProjects.map((p) => p.name),
    datasets: [
      {
        label: t("earnings.byProject"),
        data: userProjects.map((p) => p.totalInvested * (demoUser.userType === "investor" ? 0.12 : 0.08)),
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(234, 179, 8, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(168, 85, 247, 0.6)",
          "rgba(249, 115, 22, 0.6)",
        ],
      },
    ],
  }

  // Pagination for transactions
  const paginatedTransactions = mockTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage)

  const handleGenerateReport = () => {
    if (period === "custom" && (!startDate || !endDate)) {
      toast({
        title: t("earnings.error"),
        description: t("earnings.invalidDateRange"),
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: t("earnings.reportGenerated"),
        description: t("earnings.reportSuccess"),
      })
    }, 1500)
  }

  const handleWithdraw = () => {
    toast({
      title: t("earnings.withdrawRequested"),
      description: t("earnings.withdrawSuccess"),
    })
  }

  return (
    <div className="container py-6" dir={direction}>
      {/* Sticky Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 py-4 shadow-sm mb-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("earnings.title")}</h1>
          <Button asChild className="bg-green-500 hover:bg-green-600 hidden sm:flex">
            <Link href="/dashboard/projects">{t("earnings.viewProjects")}</Link>
          </Button>
        </div>
      </motion.header>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {[
            { title: t("earnings.totalEarnings"), value: earningsData.totalEarnings, desc: t("earnings.lifetime"), icon: TrendingUp },
            { title: t("earnings.monthlyEarnings"), value: earningsData.monthlyEarnings, desc: t("earnings.currentMonth"), icon: BarChart3 },
            { title: t("earnings.pendingEarnings"), value: earningsData.pendingEarnings, desc: t("earnings.awaitingPayout"), icon: Wallet, action: { label: t("earnings.withdraw"), onClick: handleWithdraw } },
            { title: t("earnings.projectedEarnings"), value: earningsData.projectedEarnings, desc: t("earnings.next30Days"), icon: ArrowUpRight, action: { label: t("earnings.viewForecast"), href: "/forecast" } },
          ].map((card, i) => (
            <motion.div key={i} variants={cardVariants}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <card.icon className="h-4 w-4 text-green-500" />
                          {card.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(card.value, t)}</div>
                        <p className="text-xs text-muted-foreground">{card.desc}</p>
                        {i < 2 && (
                          <div className="flex items-center mt-2 text-green-500 text-sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+{i === 0 ? "12.5" : "8.7"}%</span>
                            <span className="text-muted-foreground ml-1 text-xs">{i === 0 ? t("earnings.fromLastYear") : t("earnings.fromLastMonth")}</span>
                          </div>
                        )}
                        {card.action && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="mt-4 w-full"
                            onClick={card.action.onClick}
                            asChild={card.action.href ? true : false}
                          >
                            {card.action.href ? (
                              <Link href={card.action.href}>
                                {card.action.label}
                                <ArrowUpRight className="h-4 w-4 ml-2" />
                              </Link>
                            ) : (
                              <>
                                {card.action.label}
                                <Wallet className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{card.desc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger value="overview" className="rounded-md text-sm font-medium">
            {t("earnings.overview")} <Badge className="ml-2 bg-green-100 text-green-800">{mockTransactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-md text-sm font-medium">
            {t("earnings.reports")} <Badge className="ml-2 bg-blue-100 text-blue-800">{mockReports.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("earnings.earningsOverview")}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-[300px]"
                  >
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("earnings.recentTransactions")}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                ) : mockTransactions.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center flex-col text-muted-foreground">
                    <PieChart className="h-12 w-12 mb-4" />
                    <p>{t("earnings.noTransactions")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-[200px]"
                    >
                      <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </motion.div>
                    <div className="space-y-2">
                      {paginatedTransactions.map((tx) => {
                        const project = projects.find((p) => p.id === tx.projectId)
                        return (
                          <div key={tx.id} className="flex justify-between items-center text-sm border-b pb-2">
                            <div>
                              <p className="font-medium">{project?.name || "Unknown Project"}</p>
                              <p className="text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={cn("font-medium", tx.type === "return" ? "text-green-500" : "text-red-500")}>
                                {tx.type === "return" ? "+" : "-"}{formatCurrency(tx.amount, t)}
                              </p>
                              <p className="text-muted-foreground">{t(`earnings.${tx.status}`)}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                          aria-label={t("earnings.previousPage")}
                        >
                          {t("earnings.previous")}
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={currentPage === page ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => setCurrentPage(page)}
                            aria-label={t("earnings.page")}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => p + 1)}
                          aria-label={t("earnings.nextPage")}
                        >
                          {t("earnings.next")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold">{t("earnings.generateReports")}</h3>
                <p className="text-muted-foreground">{t("earnings.customizableReports")}</p>
              </div>
              <Button
                variant="outline"
                className="md:hidden w-full"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label={t("earnings.toggleFilters")}
              >
                {isFilterOpen ? t("earnings.hideFilters") : t("earnings.showFilters")}
                <ChevronDown className={cn("ml-2 h-4 w-4", isFilterOpen && "rotate-180")} />
              </Button>
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                >
                  <div className="space-y-4">
                    <Select onValueChange={setPeriod} value={period}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("earnings.selectPeriod")} />
                      </SelectTrigger>
                      <SelectContent dir={direction}>
                        <SelectItem value="day">{t("earnings.day")}</SelectItem>
                        <SelectItem value="week">{t("earnings.week")}</SelectItem>
                        <SelectItem value="month">{t("earnings.month")}</SelectItem>
                        <SelectItem value="year">{t("earnings.year")}</SelectItem>
                        <SelectItem value="custom">{t("earnings.custom")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {period === "custom" && (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="start">{t("earnings.start")}</Label>
                          <DatePicker date={startDate} setDate={setStartDate} />
                        </div>
                        <div>
                          <Label htmlFor="end">{t("earnings.end")}</Label>
                          <DatePicker date={endDate} setDate={setEndDate} />
                        </div>
                      </div>
                    )}
                    <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("earnings.generateReport")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden md:block space-y-4">
              <div className="flex items-center space-x-4">
                <Select onValueChange={setPeriod} value={period}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("earnings.selectPeriod")} />
                  </SelectTrigger>
                  <SelectContent dir={direction}>
                    <SelectItem value="day">{t("earnings.day")}</SelectItem>
                    <SelectItem value="week">{t("earnings.week")}</SelectItem>
                    <SelectItem value="month">{t("earnings.month")}</SelectItem>
                    <SelectItem value="year">{t("earnings.year")}</SelectItem>
                    <SelectItem value="custom">{t("earnings.custom")}</SelectItem>
                  </SelectContent>
                </Select>
                {period === "custom" && (
                  <div className="flex items-center space-x-4">
                    <div>
                      <Label htmlFor="start">{t("earnings.start")}</Label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div>
                      <Label htmlFor="end">{t("earnings.end")}</Label>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                )}
                <Button onClick={handleGenerateReport} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("earnings.generateReport")}
                </Button>
              </div>
            </div>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t("earnings.recentReports")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                ) : mockReports.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center flex-col text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>{t("earnings.noReports")}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mockReports.map((report) => (
                      <div key={report.id} className="flex justify-between items-center border-b py-2">
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t(`earnings.${report.period}`)} • {new Date(report.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={report.downloadUrl}>
                            <Download className="h-4 w-4 mr-2" />
                            {t("earnings.download")}
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}