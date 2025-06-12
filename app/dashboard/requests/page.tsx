"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Check, DollarSign, Eye, X, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

// Types
interface User {
  id: string
  userType: "project-owner" | "investor" | "consultant"
  name: string
}

interface Project {
  id: string
  ownerId: string
  name: string
}

interface Investment {
  id: string
  projectId: string
  investorId: string
  amount: number
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
  message: string
}

interface ConsultingRequest {
  id: string
  clientName: string
  projectId: string
  projectName: string
  type: string
  status: "pending" | "in-progress" | "completed"
  startedAt?: string
}

// Mock data
const mockUser: User = {
  id: "user-123",
  userType: "project-owner", // Toggle: "investor", "consultant"
  name: "Ahmed Benali",
}

const mockProjects: Project[] = [
  { id: "proj-1", ownerId: "user-123", name: "tamweeli Solar Farm" },
  { id: "proj-2", ownerId: "user-456", name: "Halal Food Delivery" },
]

const mockInvestments: Investment[] = [
  {
    id: "inv-1",
    projectId: "proj-1",
    investorId: "user-789",
    amount: 500000,
    status: "pending",
    createdAt: "2025-05-20",
    message: "Interested in funding your solar project.",
  },
  {
    id: "inv-2",
    projectId: "proj-2",
    investorId: "user-123",
    amount: 250000,
    status: "accepted",
    createdAt: "2025-05-15",
    message: "Excited to support this food delivery venture.",
  },
]

const mockConsultingRequests: ConsultingRequest[] = [
  {
    id: "cons-1",
    clientName: "Ahmed Al-Farsi",
    projectId: "proj-1",
    projectName: "tamweeli Solar Farm",
    type: "Financial Consulting",
    status: "pending",
  },
  {
    id: "cons-2",
    clientName: "Sara Al-Mansouri",
    projectId: "proj-2",
    projectName: "Halal Food Delivery",
    type: "Feasibility Study",
    status: "pending",
  },
  {
    id: "cons-3",
    clientName: "Mohammed Al-Qasimi",
    projectId: "proj-1",
    projectName: "tamweeli Solar Farm",
    type: "Islamic Finance Consulting",
    status: "in-progress",
    startedAt: "2025-05-20",
  },
]

export default function RequestsPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [consultingRequests, setConsultingRequests] = useState<ConsultingRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "received")

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(mockUser)
      setInvestments(mockInvestments)
      setProjects(mockProjects)
      setConsultingRequests(mockConsultingRequests)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["received", "sent"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value)
      router.push(`/dashboard/requests?tab=${value}`, { scroll: false })
    },
    [router]
  )

  const handleInvestmentAction = useCallback(
    async (investmentId: string, action: "accept" | "decline") => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setInvestments((prev) =>
          prev.map((inv) =>
            inv.id === investmentId
              ? { ...inv, status: action === "accept" ? "accepted" : "rejected" }
              : inv
          )
        )
        toast({
          title: t("requests.success"),
          description: t(`requests.${action}Success`),
        })
      } catch (error) {
        toast({
          title: t("common.error"),
          description: t(`requests.${action}Error`),
          variant: "destructive",
        })
      }
    },
    [toast, t]
  )

  const handleConsultingAction = useCallback(
    async (requestId: string, action: "accept" | "decline" | "complete") => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setConsultingRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status:
                    action === "accept" ? "in-progress" : action === "complete" ? "completed" : "pending",
                  startedAt: action === "accept" ? new Date().toISOString().split("T")[0] : req.startedAt,
                }
              : req
          )
        )
        toast({
          title: t("requests.success"),
          description: t(`requests.${action}ConsultingSuccess`),
        })
      } catch (error) {
        toast({
          title: t("common.error"),
          description: t(`requests.${action}ConsultingError`),
          variant: "destructive",
        })
      }
    },
    [toast, t]
  )

  if (isLoading) {
    return <SkeletonLoader />
  }

  if (!user) {
    return (
      <motion.div
        className="text-center py-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-medium mb-2 text-gray-600 dark:text-gray-400">{t("auth.unauthenticated")}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("auth.loginPrompt")}</p>
        <Button variant="link" className="mt-2 text-green-600">
          {t("auth.login")}
        </Button>
      </motion.div>
    )
  }

  const isProjectOwner = user.userType === "project-owner"
  const isInvestor = user.userType === "investor"
  const isConsultant = user.userType === "consultant"

  const userProjects = projects.filter((project) => project.ownerId === user.id)
  const projectIds = userProjects.map((project) => project.id)
  const receivedInvestments = investments.filter((investment) => projectIds.includes(investment.projectId))
  const sentInvestments = investments.filter((investment) => investment.investorId === user.id)

  return (
    <div className={`container py-8 max-w-4xl ${isRtl ? "rtl" : "ltr"}`}>
      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {t("dashboard.requests")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isProjectOwner && t("requests.ownerDescription")}
              {isInvestor && t("requests.investorDescription")}
              {isConsultant && t("requests.consultantDescription")}
            </p>
          </div>
        </div>
      </motion.div>

      {(isProjectOwner || isInvestor) && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-green-50 dark:bg-green-900/20 p-1 sticky top-16 z-10">
            {isProjectOwner && (
              <TabsTrigger
                value="received"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                aria-label={t("requests.receivedTab")}
              >
                {t("requests.received")}
              </TabsTrigger>
            )}
            {isInvestor && (
              <TabsTrigger
                value="sent"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                aria-label={t("requests.sentTab")}
              >
                {t("requests.sent")}
              </TabsTrigger>
            )}
          </TabsList>

          {isProjectOwner && (
            <TabsContent value="received">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                {receivedInvestments.length === 0 ? (
                  <motion.div variants={fadeInUp}>
                    <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mb-4">
                          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{t("requests.noReceivedRequests")}</p>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                          <Link href="/projects">{t("requests.browseProjects")}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {receivedInvestments.map((investment) => (
                      <InvestmentRequestCard
                        key={investment.id}
                        investment={investment}
                        project={projects.find((p) => p.id === investment.projectId)}
                        type="received"
                        onAction={handleInvestmentAction}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          )}

          {isInvestor && (
            <TabsContent value="sent">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                {sentInvestments.length === 0 ? (
                  <motion.div variants={fadeInUp}>
                    <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mb-4">
                          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{t("requests.noSentRequests")}</p>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                          <Link href="/projects">{t("requests.browseProjects")}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {sentInvestments.map((investment) => (
                      <InvestmentRequestCard
                        key={investment.id}
                        investment={investment}
                        project={projects.find((p) => p.id === investment.projectId)}
                        type="sent"
                        onAction={handleInvestmentAction}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          )}
        </Tabs>
      )}

      {isConsultant && (
        <motion.div className="grid gap-8" variants={staggerContainer} initial="hidden" animate="visible">
          <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-600 dark:text-gray-400">
                {t("requests.pendingConsulting")}
              </CardTitle>
              <CardDescription>{t("requests.pendingConsultingDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultingRequests
                  .filter((req) => req.status === "pending")
                  .map((request) => (
                    <motion.div
                      key={request.id}
                      variants={fadeInUp}
                      className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{request.type}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("requests.from")} {request.clientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("requests.project")} {request.projectName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/consulting/${request.id}`)}
                          aria-label={t("requests.viewConsultingDetails")}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("requests.view")}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleConsultingAction(request.id, "accept")}
                          aria-label={t("requests.acceptLabel")}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {t("requests.accept")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleConsultingAction(request.id, "decline")}
                          aria-label={t("requests.declineLabel")}
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t("requests.decline")}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                {consultingRequests.filter((req) => req.status === "pending").length === 0 && (
                  <motion.div variants={fadeInUp} className="text-center py-8">
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
                      <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{t("requests.noPendingConsulting")}</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-600 dark:text-gray-400">
                {t("requests.inProgressConsulting")}
              </CardTitle>
              <CardDescription>{t("requests.inProgressConsultingDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultingRequests
                  .filter((req) => req.status === "in-progress")
                  .map((request) => (
                    <motion.div
                      key={request.id}
                      variants={fadeInUp}
                      className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{request.type}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("requests.for")} {request.clientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("requests.startedAt")} {request.startedAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/consulting/${request.id}`)}
                          aria-label={t("requests.viewConsultingDetails")}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("requests.viewDetails")}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleConsultingAction(request.id, "complete")}
                          aria-label={t("requests.completeLabel")}
                        >
                          {t("requests.complete")}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                {consultingRequests.filter((req) => req.status === "in-progress").length === 0 && (
                  <motion.div variants={fadeInUp} className="text-center py-8">
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
                      <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{t("requests.noInProgressConsulting")}</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function InvestmentRequestCard({
  investment,
  project,
  type,
  onAction,
}: {
  investment: Investment
  project?: Project
  type: "sent" | "received"
  onAction: (investmentId: string, action: "accept" | "decline") => void
}) {
  const { t } = useLanguage()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-700 text-white"
      case "accepted":
        return "bg-green-600 hover:bg-green-700 text-white"
      case "rejected":
        return "bg-red-600 hover:bg-red-700 text-white"
      case "completed":
        return "bg-blue-600 hover:bg-blue-700 text-white"
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white"
    }
  }

  if (!project) {
    return (
      <motion.div variants={fadeInUp}>
        <Card className="border-none shadow-lg bg-gray-100 dark:bg-gray-800">
          <CardContent className="py-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">{t("requests.projectNotFound")}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div variants={fadeInUp}>
      <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg line-clamp-1 text-gray-900 dark:text-gray-100">
                {project.name}
              </CardTitle>
              <CardDescription>
                {type === "received" ? t("requests.receivedDescription") : t("requests.sentDescription")}
              </CardDescription>
            </div>
            <Badge
              className={cn(getStatusColor(investment.status))}
              aria-label={`${t("requests.status")}: ${investment.status}`}
            >
              {investment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>
                {t("investment.amount")}: {investment.amount.toLocaleString()} {t("common.currency")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>
                {t("requests.date")}: {new Date(investment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{t("requests.message")}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{investment.message}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              aria-label={t("requests.viewInvestmentDetails")}
            >
              <Link href={`/dashboard/investments/${investment.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                {t("requests.viewDetails")}
              </Link>
            </Button>
            {type === "received" && investment.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onAction(investment.id, "accept")}
                  aria-label={t("requests.acceptLabel")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t("requests.accept")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => onAction(investment.id, "decline")}
                  aria-label={t("requests.declineLabel")}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t("requests.decline")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div
      className="container py-8 max-w-4xl"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </motion.div>
  )
}