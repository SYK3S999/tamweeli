"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, FileText, Download, Calendar, DollarSign, ArrowRight, Link } from "lucide-react"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
}

// Mock report data
interface Report {
  id: string
  title: string
  description: string
  date: string
  amount: number
  contractType: "murabaha" | "musharaka" | "mudaraba"
  projectId: string
  projectName: string
  contractUrl?: string
}

const mockProjectOwnerReports: Report[] = [
  {
    id: "report-1",
    title: "Funding Progress Report",
    description: "Detailed report on the funding progress for 'Tamweeli Water Purification'.",
    date: "2025-06-10T00:00:00Z",
    amount: 435000,
    contractType: "murabaha",
    projectId: "proj-1",
    projectName: "Tamweeli Water Purification",
    contractUrl: "/contracts/project-1-murabaha.pdf",
  },
  {
    id: "report-2",
    title: "Investor Details Report",
    description: "List of investors and their contributions to 'EcoSmart Solar Farms'.",
    date: "2025-06-05T00:00:00Z",
    amount: 600000,
    contractType: "musharaka",
    projectId: "proj-2",
    projectName: "EcoSmart Solar Farms",
    contractUrl: "/contracts/project-2-musharaka.pdf",
  },
]

const mockInvestorReports: Report[] = [
  {
    id: "report-3",
    title: "Portfolio Performance Report",
    description: "Summary of your investment performance in 'Tamweeli Water Purification'.",
    date: "2025-06-10T00:00:00Z",
    amount: 500000,
    contractType: "murabaha",
    projectId: "proj-1",
    projectName: "Tamweeli Water Purification",
    contractUrl: "/contracts/investment-1-murabaha.pdf",
  },
  {
    id: "report-4",
    title: "Returns Report",
    description: "Expected returns for your investment in 'EcoSmart Solar Farms'.",
    date: "2025-06-05T00:00:00Z",
    amount: 75000,
    contractType: "musharaka",
    projectId: "proj-2",
    projectName: "EcoSmart Solar Farms",
    contractUrl: "/contracts/investment-2-musharaka.pdf",
  },
]

export default function ReportsPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { user } = useAuth()
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading reports
    setTimeout(() => {
      setReports(
        user?.userType === "project-owner"
          ? mockProjectOwnerReports
          : mockInvestorReports
      )
      setIsLoading(false)
    }, 1000)
  }, [user])

  const handleDownloadContract = async (report: Report) => {
    try {
      // Simulate PDF download
      toast({
        title: t("reports.downloadSuccess"),
        description: t("reports.downloadSuccessDesc"),
        className: "bg-background/95 border-primary",
      })
    } catch (error) {
      toast({
        title: t("reports.downloadError"),
        description: t("reports.downloadErrorDesc"),
        variant: "destructive",
        className: "bg-background/95 border-primary/20",
      })
    }
  }

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center h-[calc(100vh-4rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">{t("common.loading")}</p>
        </div>
      </motion.div>
    )
  }

  if (!user) {
    return (
      <motion.div
        className="text-center py-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="p-10 bg-primary/5 rounded-full w-fit mx-auto mb-5">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-3">{t("auth.unauthenticated")}</h3>
        <p className="text-sm text-muted-foreground">{t("auth.loginPrompt")}</p>
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/login">{t("auth.login")}</Link>
        </Button>
      </motion.div>
    )
  }

  const isProjectOwner = user.userType === "project-owner"
  const isInvestor = user.userType === "investor"

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

      <section className="py-12 md:py-16 relative z-10">
        <div className="container px-4 md:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge
                  variant="outline"
                  className="mb-3 px-4 py-2 text-base font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <span className="text-primary">{t("reports.title")}</span>
                </Badge>
                <h2 className="text-3xl md:text-4xl font-semibold text-primary">
                  {t("reports.title")}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {isProjectOwner && t("reports.projectOwnerDesc")}
                  {isInvestor && t("reports.investorDesc")}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/dashboard">
                    <span className="flex items-center gap-3">
                      {t("reports.backToDashboard")}
                      <ArrowRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Reports List */}
            <motion.div variants={staggerContainer} className="space-y-6">
              {reports.length === 0 ? (
                <motion.div variants={fadeInUp}>
                  <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                    <div className="py-16 text-center text-muted-foreground">
                      <p className="text-lg font-medium">{t("reports.noReports")}</p>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                reports.map((report) => (
                  <motion.div key={report.id} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover">
                    <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-primary">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2">{report.description}</p>
                          <div className="mt-4 space-y-2 text-sm text-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{formatDate(report.date, t("language"))}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span>{formatCurrency(report.amount, t)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{t(`contractTypes.${report.contractType}`)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-primary/20 hover:bg-primary/10"
                          >
                            <Link href={`/projects/${report.projectId}`}>
                              {t("reports.viewProject")}
                            </Link>
                          </Button>
                          <Button
                            onClick={() => handleDownloadContract(report)}
                            className="rounded-full bg-primary hover:bg-primary/90"
                            aria-label={t("reports.downloadContract")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t("reports.downloadContract")}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}