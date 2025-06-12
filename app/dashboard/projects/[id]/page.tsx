"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Calendar,
  Landmark,
  BarChart3,
  FileText,
  MessageSquare,
  Bookmark,
  Share2,
  ChevronLeft,
  MapPin,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
}

// Mock data
const mockProject: Project = {
  id: "proj-1",
  title: "tamweeli Water Purification",
  description: "Revolutionary nano-filtration technology bringing clean water to 10M+ people in rural areas across Africa and Asia.",
  sector: "healthcare",
  status: "approved",
  fundingGoal: 500000,
  fundingRaised: 435000,
  contractType: "murabaha",
  expectedReturn: 10,
  duration: 12,
  riskLevel: "moderate",
  createdAt: "2025-05-15T00:00:00Z",
  endDate: "2025-06-14T00:00:00Z",
  ownerId: "owner-1",
  image: "/water.jpg",
  images: ["/water.jpg", "/water2.jpg", "/water3.jpg"],
  tags: ["clean-water", "sustainability", "healthcare"],
  milestones: [
    { id: "m1", title: "Prototype Development", status: "completed", description: "Completed initial prototype.", dueDate: "2025-04-01" },
    { id: "m2", title: "Pilot Deployment", status: "in-progress", description: "Deploying in 5 villages.", dueDate: "2025-05-30" },
    { id: "m3", title: "Scale-Up", status: "pending", description: "Expand to 50 villages.", dueDate: "2025-07-15" },
  ],
  location: "Africa, Asia",
  documents: [
    { id: "doc1", title: "Business Plan", url: "/docs/business-plan.pdf", createdAt: "2025-05-01" },
    { id: "doc2", title: "Financial Report", url: "/docs/financial-report.pdf", createdAt: "2025-05-10" },
  ],
  updates: [
    { id: "up1", title: "Pilot Success", content: "Pilot deployment successful in 3 villages!", createdAt: "2025-05-20" },
    { id: "up2", title: "Funding Milestone", content: "Reached 80% funding goal!", createdAt: "2025-05-25" },
  ],
}

const mockInvestments: Investment[] = [
  { id: "inv1", investorId: "inv-1", projectId: "proj-1", amount: 50000, status: "approved", expectedReturn: 5000, returnDate: "2026-05-15", createdAt: "2025-05-16", contractSigned: true },
  { id: "inv2", investorId: "inv-2", projectId: "proj-1", amount: 75000, status: "pending", expectedReturn: 7500, returnDate: "2026-05-15", createdAt: "2025-05-17", contractSigned: false },
  { id: "inv3", investorId: "inv-3", projectId: "proj-1", amount: 100000, status: "approved", expectedReturn: 10000, returnDate: "2026-05-15", createdAt: "2025-05-18", contractSigned: true },
  { id: "inv4", investorId: "inv-1", projectId: "proj-1", amount: 60000, status: "rejected", expectedReturn: 6000, returnDate: "2026-05-15", createdAt: "2025-05-19", contractSigned: false },
  { id: "inv5", investorId: "inv-2", projectId: "proj-1", amount: 80000, status: "approved", expectedReturn: 8000, returnDate: "2026-05-15", createdAt: "2025-05-20", contractSigned: true },
]

const mockInvestors: Investor[] = [
  { id: "inv-1", name: "Ahmed Benali", investorType: "individual" },
  { id: "inv-2", name: "Green Ventures Inc.", investorType: "institution" },
  { id: "inv-3", name: "Fatima Zahra", investorType: "individual" },
]

const mockSavedProjects = ["proj-1", "proj-3", "proj-5"]

interface Project extends Record<string, any> {
  id: string
  title: string
  description: string
  sector: string
  status: string
  fundingGoal: number
  fundingRaised: number
  contractType: string
  expectedReturn: number
  duration: number
  riskLevel: string
  createdAt: string
  endDate: string
  ownerId: string
  image?: string
  images?: string[]
  tags: string[]
  milestones?: { id: string; title: string; status: string; description: string; dueDate: string }[]
  location: string
  documents?: { id: string; title: string; url: string; createdAt: string }[]
  updates?: { id: string; title: string; content: string; createdAt: string }[]
}

interface Investment {
  id: string
  investorId: string
  projectId: string
  amount: number
  status: string
  expectedReturn: number
  returnDate: string
  createdAt: string
  contractSigned: boolean
  note?: string
}

interface Investor {
  id: string
  name: string
  investorType: "individual" | "institution"
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [investors, setInvestors] = useState<Investor[]>([])
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [investmentNote, setInvestmentNote] = useState("")
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(mockSavedProjects.includes(params.id as string))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!params.id) {
      router.push("/dashboard/projects")
      return
    }

    // Simulate API fetch with mock data
    setTimeout(() => {
      setProject(mockProject)
      setInvestments(mockInvestments)
      setInvestors(mockInvestors)
      setIsLoading(false)
    }, 1000)
  }, [params.id, router])

  const handleInvest = () => {
    if (!investmentAmount || isNaN(Number.parseFloat(investmentAmount)) || Number.parseFloat(investmentAmount) <= 0) {
      toast({
        title: t("invalidAmount"),
        description: t("validAmount"),
        variant: "destructive",
      })
      return
    }

    if (!user || !project) {
      toast({
        title: t("error"),
        description: t("missingInfo"),
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(investmentAmount)
    const newInvestment: Investment = {
      id: `inv-${Date.now()}`,
      investorId: user.id,
      projectId: project.id,
      amount,
      status: "pending",
      expectedReturn: (amount * project.expectedReturn) / 100,
      returnDate: new Date(new Date().setMonth(new Date().getMonth() + project.duration)).toISOString(),
      createdAt: new Date().toISOString(),
      contractSigned: false,
      note: investmentNote || undefined,
    }

    setInvestments((prev) => [...prev, newInvestment])
    setProject((prev) => prev ? { ...prev, fundingRaised: prev.fundingRaised + amount } : prev)

    toast({
      title: t("investmentSubmitted"),
      description: t("investmentPending"),
    })

    setIsInvestDialogOpen(false)
    setInvestmentAmount("")
    setInvestmentNote("")
  }

  const handleApproveProject = () => {
    if (project) {
      setProject({ ...project, status: "approved" })
      toast({
        title: t("projectApproved"),
        description: t("projectApprovedDesc"),
      })
    }
  }

  const handleRejectProject = () => {
    if (project) {
      setProject({ ...project, status: "rejected" })
      toast({
        title: t("projectRejected"),
        description: t("projectRejectedDesc"),
      })
    }
  }

  const toggleSaveProject = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!user) {
      toast({
        title: t("authRequired"),
        description: t("loginToSave"),
        action: <Link href="/auth/login" className="text-green-600 underline">{t("login")}</Link>,
      })
      return
    }
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? t("projectUnsaved") : t("projectSaved"),
      description: isSaved ? t("projectUnsavedDesc") : t("projectSavedDesc"),
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: t("linkCopied"),
      description: t("linkCopiedDesc"),
    })
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRtl ? "ar-DZ" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" /> {t("pending")}</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> {t("approved")}</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> {t("rejected")}</Badge>
      case "funded":
        return <Badge className="bg-blue-100 text-blue-800"><Landmark className="h-3 w-3 mr-1" /> {t("funded")}</Badge>
      case "completed":
        return <Badge className="bg-green-600 text-white"><CheckCircle className="h-3 w-3 mr-1" /> {t("completed")}</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{t(status)}</Badge>
    }
  }

  if (!project || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <SkeletonLoader />
      </div>
    )
  }

  const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100
  const isAdmin = user?.userType === "consultant" || user?.userType === "admin"
  const isProjectOwner = user?.id === project.ownerId
  const isInvestor = user?.userType === "investor"
  const canInvest = isInvestor && project.status === "approved"

  return (
    <div className={`container mx-auto p-6 ${isRtl ? "rtl" : "ltr"}`}>
      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="p-2">
              <Link href="/dashboard/projects"><ChevronLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800">{project.sector}</Badge>
                {getStatusBadge(project.status)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSaveProject}
              aria-label={isSaved ? t("unsave") : t("save")}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? "fill-green-600 text-green-600" : "text-gray-600 dark:text-gray-400"}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} aria-label={t("share")}>
              <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            {isAdmin && project.status === "pending" && (
              <>
                <Button variant="destructive" onClick={handleRejectProject}>{t("reject")}</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveProject}>{t("approve")}</Button>
              </>
            )}
            {canInvest && (
              <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">{t("investNow")}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{t("investIn")} {project.title}</DialogTitle>
                    <DialogDescription>{t("investDescription")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">{t("investmentAmount")}</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder="100000"
                        min="1000"
                        className="border-green-600/30 focus:ring-green-600"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="note">{t("noteOptional")}</Label>
                      <Textarea
                        id="note"
                        value={investmentNote}
                        onChange={(e) => setInvestmentNote(e.target.value)}
                        placeholder={t("notePlaceholder")}
                        className="border-green-600/30 focus:ring-green-600"
                      />
                    </div>
                    {investmentAmount && !isNaN(Number.parseFloat(investmentAmount)) && Number.parseFloat(investmentAmount) > 0 && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md"
                      >
                        <h4 className="font-medium mb-2">{t("investmentSummary")}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span>{t("amount")}</span>
                          <span className="font-medium">{formatCurrency(Number.parseFloat(investmentAmount))}</span>
                          <span>{t("expectedReturn")}</span>
                          <span className="font-medium">{formatCurrency((Number.parseFloat(investmentAmount) * project.expectedReturn) / 100)}</span>
                          <span>{t("returnRate")}</span>
                          <span className="font-medium">{project.expectedReturn}%</span>
                          <span>{t("duration")}</span>
                          <span className="font-medium">{project.duration} {t("months")}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInvestDialogOpen(false)}>{t("cancel")}</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleInvest}>{t("submitInvestment")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div className="lg:col-span-2 space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
          {/* Project Overview */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>{t("overview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="mb-6">
                <CarouselContent>
                  {project.images?.map((img, i) => (
                    <CarouselItem key={i}>
                      <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-64 object-cover rounded-md" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("description")}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("tags")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} className="bg-green-100 text-green-800">{tag}</Badge>
                    ))}
                  </div>
                </div>
                {project.milestones && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("milestones")}</h3>
                    <div className="relative pl-6 space-y-6">
                      {project.milestones.map((milestone, i) => (
                        <div key={milestone.id} className="relative">
                          <div className={`absolute left-0 w-4 h-4 rounded-full ${milestone.status === "completed" ? "bg-green-600" : milestone.status === "in-progress" ? "bg-yellow-500" : "bg-gray-300"}`} />
                          {i < project.milestones!.length - 1 && <div className="absolute left-[7px] top-4 w-0.5 h-full bg-gray-200" />}
                          <div className="ml-8">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <Badge
                                className={
                                  milestone.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : milestone.status === "in-progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }
                              >
                                {t(milestone.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                            <p className="text-sm text-gray-500">{t("dueDate")}: {formatDate(milestone.dueDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="investments" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <TabsList className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
              <TabsTrigger value="investments" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" /> {t("investments")} <Badge className="ml-2 bg-green-100 text-green-800">{investments.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="investors" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> {t("investors")} <Badge className="ml-2 bg-green-100 text-green-800">{investors.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> {t("documents")} <Badge className="ml-2 bg-green-100 text-green-800">{project.documents?.length || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> {t("updates")} <Badge className="ml-2 bg-green-100 text-green-800">{project.updates?.length || 0}</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="investments" className="p-6">
              {investments.length === 0 ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-400">{t("noInvestments")}</div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {investments.map((investment) => (
                    <motion.div key={investment.id} variants={fadeInUp} className="border rounded-md p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{formatCurrency(investment.amount)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{t("expectedReturn")}: {formatCurrency(investment.expectedReturn)}</div>
                        </div>
                        {getStatusBadge(investment.status)}
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{t("date")}: {formatDate(investment.createdAt)}</span> | <span>{t("returnDate")}: {formatDate(investment.returnDate)}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            <TabsContent value="investors" className="p-6">
              {investors.length === 0 ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-400">{t("noInvestors")}</div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {investors.map((investor) => (
                    <motion.div key={investor.id} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover" className="border rounded-md p-4 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                            {(investor.name || "").substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{investor.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t(investor.investorType)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{t("totalInvested")}</div>
                          <div className="font-medium">{formatCurrency(investments.filter((i) => i.investorId === investor.id && i.status === "approved").reduce((sum, i) => sum + i.amount, 0))}</div>
                        </div>
                      </div>
                      <Progress
                        value={(investments.filter((i) => i.investorId === investor.id && i.status === "approved").reduce((sum, i) => sum + i.amount, 0) / project.fundingGoal) * 100}
                        className="h-1 mt-2"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            <TabsContent value="documents" className="p-6">
              {project.documents?.length === 0 ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-400">{t("noDocuments")}</div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {project.documents?.map((doc) => (
                    <motion.div key={doc.id} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover" className="border rounded-md p-4 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(doc.createdAt)}</div>
                        </div>
                        <Button variant="outline" asChild className="border-green-600/30 hover:bg-green-100">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">{t("view")}</a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            <TabsContent value="updates" className="p-6">
              {project.updates?.length === 0 ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-400">{t("noUpdates")}</div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {project.updates?.map((update) => (
                    <motion.div key={update.id} variants={fadeInUp} className="border rounded-md p-4 bg-white dark:bg-gray-800">
                      <div className="font-medium">{update.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{update.content}</div>
                      <div className="text-sm text-gray-500 mt-2">{formatDate(update.createdAt)}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Sidebar */}
        <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
          {/* Funding Progress */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>{t("fundingProgress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={fundingProgress}
                  className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-green-600 [&>div]:to-green-700"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(project.fundingRaised)}</span>
                  <span className="font-medium">{Math.round(fundingProgress)}%</span>
                  <span>{formatCurrency(project.fundingGoal)}</span>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t("contractType")}</span>
                    <span className="font-medium">{project.contractType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t("expectedReturn")}</span>
                    <span className="font-medium">{project.expectedReturn}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t("duration")}</span>
                    <span className="font-medium">{project.duration} {t("months")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t("riskLevel")}</span>
                    <span className="font-medium">{t(project.riskLevel)}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t("created")}: {formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t("endDate")}: {formatDate(project.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t("investors")}: {investors.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            {canInvest && (
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setIsInvestDialogOpen(true)}>
                  {t("investNow")}
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Location */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>{t("location")}</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531676!3d-37.81720997975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDUwJzAxLjkiUyAxNDTCsDU3JzEzLjUiRQ!5e0!3m2!1sen!2sus!4v1635781263211!5m2!1sen!2sus"
                className="w-full h-48 rounded-md"
                allowFullScreen
                loading="lazy"
                title={t("locationMap")}
              />
              <div className="mt-2 text-sm text-center flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" /> {project.location}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sticky Mobile Footer */}
      {canInvest && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-t-md lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setIsInvestDialogOpen(true)}>
            {t("investNow")}
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-gray-100 dark:bg-gray-700" />
          <Skeleton className="h-4 w-32 bg-gray-100 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-10 w-32 bg-gray-100 dark:bg-gray-700" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full bg-gray-100 dark:bg-gray-700" />
          <Skeleton className="h-64 w-full bg-gray-100 dark:bg-gray-700" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full bg-gray-100 dark:bg-gray-700" />
          <Skeleton className="h-32 w-full bg-gray-100 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}
