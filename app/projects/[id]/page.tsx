"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
  FileUp,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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

// Investment form schema
const investmentSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Please enter a valid amount greater than 0",
  }),
  bankAccount: z.string().min(10, "Bank account number must be at least 10 characters"),
  transferCode: z.string().min(6, "Transfer code must be at least 6 characters"),
  receipt: z.instanceof(File, { message: "Please upload a PDF receipt" }),
})

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
  bankAccount?: string
  transferCode?: string
  receipt?: string
}

interface Investor {
  id: string
  name: string
  investorType: "individual" | "institution"
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
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(mockSavedProjects.includes(params.id as string))
  const [isLoading, setIsLoading] = useState(true)

  // Investment form setup
  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amount: "",
      bankAccount: "",
      transferCode: "",
    },
  })

  useEffect(() => {
    if (!params.id) {
      router.push("/dashboard/projects")
      return
    }

    // Simulate API fetch
    setTimeout(() => {
      setProject(mockProject)
      setInvestments(mockInvestments)
      setInvestors(mockInvestors)
      setIsLoading(false)
    }, 1000)
  }, [params.id, router])

  const handleInvest = async (values: z.infer<typeof investmentSchema>) => {
    if (!user || !project) {
      toast({
        title: t("error"),
        description: t("missingInfo"),
        variant: "destructive",
        className: "bg-background/95 border-primary/20",
      })
      return
    }

    const amount = Number.parseFloat(values.amount)
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
      bankAccount: values.bankAccount,
      transferCode: values.transferCode,
      receipt: values.receipt.name,
    }

    setInvestments((prev) => [...prev, newInvestment])
    setProject((prev) => prev ? { ...prev, fundingRaised: prev.fundingRaised + amount } : prev)

    toast({
      title: t("investmentSubmitted"),
      description: t("investmentPending"),
      className: "bg-background/95 border-primary",
    })

    setIsInvestDialogOpen(false)
    form.reset()
  }

  const handleApproveProject = () => {
    if (project) {
      setProject({ ...project, status: "approved" })
      toast({
        title: t("project-status-updated"),
        description: t("project-approved"),
        className: "bg-background/95 border-primary",
      })
    }
  }

  const handleRejectProject = () => {
    if (project) {
      setProject({ ...project, status: "rejected" })
      toast({
        title: t("project-status-updated"),
        description: t("project-rejected"),
        className: "bg-background/95 border-primary",
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
        action: <Link href="/auth/login" className="text-primary underline">{t("login")}</Link>,
        className: "bg-background/95 border-primary",
      })
      return
    }
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? t("projectUnsaved") : t("projectSaved"),
      description: isSaved ? t("projectUnsavedDesc") : t("projectSavedDesc"),
      className: "bg-background/95 border-primary",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: t("linkCopied"),
      description: t("linkCopiedDesc"),
      className: "bg-background/95 border-primary",
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
        return <Badge className="bg-primary/10 text-primary"><CheckCircle className="h-3 w-3 mr-1" /> {t("approved")}</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> {t("rejected")}</Badge>
      case "funded":
        return <Badge className="bg-blue-100 text-blue-800"><Landmark className="h-3 w-3 mr-1" /> {t("funded")}</Badge>
      case "completed":
        return <Badge className="bg-primary text-white"><CheckCircle className="h-3 w-3 mr-1" /> {t("completed")}</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{t(status)}</Badge>
    }
  }

  if (!project || isLoading) {
    return <SkeletonLoader />
  }

  const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100
  const isAdmin = user?.userType === "consultant" || user?.userType === "admin"
  const isProjectOwner = user?.id === project.ownerId
  const isInvestor = user?.userType === "investor"
  const canInvest = isInvestor && project.status === "approved"

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

        <section className="py-12 md:py-16 relative z-10">
          <div className="container px-4 md:px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Sticky Header */}
              <motion.div
                className="sticky top-0 z-10 backdrop-blur-xl bg-background/95 border border-primary/20 rounded-3xl p-6 shadow-2xl"
                variants={fadeInUp}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="p-2">
                      <Link href="/dashboard/projects"><ChevronLeft className="h-5 w-5 text-muted-foreground" /></Link>
                    </Button>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-semibold text-primary">{project.title}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-primary/10 text-primary">{project.sector}</Badge>
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
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleShare} aria-label={t("share")}>
                      <Share2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    {isAdmin && project.status === "pending" && (
                      <>
                        <Button variant="destructive" onClick={handleRejectProject}>{t("reject")}</Button>
                        <Button className="bg-primary hover:bg-primary/90 rounded-full px-6" onClick={handleApproveProject}>{t("approve")}</Button>
                      </>
                    )}
                    {canInvest && (
                      <>
                        <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">{t("investNow")}</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl text-primary">{t("investIn")} {project.title}</DialogTitle>
                              <DialogDescription className="text-muted-foreground">{t("investDescription")}</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(handleInvest)} className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="amount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-foreground">{t("investmentAmount")}</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder={t("investmentAmountPlaceholder")}
                                          className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="bankAccount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-foreground">{t("bankAccount")}</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={t("bankAccountPlaceholder")}
                                          className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="transferCode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-foreground">{t("transferCode")}</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={t("transferCodePlaceholder")}
                                          className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="receipt"
                                  render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-foreground">{t("receipt")}</FormLabel>
                                      <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-background/95 hover:bg-primary/10 border-primary/20 transition-all duration-300">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                              <FileUp className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary" />
                                              <p className="text-sm text-muted-foreground">
                                                {value ? value.name : t("uploadReceiptPlaceholder")}
                                              </p>
                                            </div>
                                            <Input
                                              type="file"
                                              className="hidden"
                                              accept=".pdf"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) onChange(file)
                                              }}
                                              {...field}
                                            />
                                          </label>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {form.watch("amount") && !isNaN(Number.parseFloat(form.watch("amount"))) && Number.parseFloat(form.watch("amount")) > 0 && (
                                  <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    className="bg-primary/5 p-4 rounded-xl border-primary/20"
                                  >
                                    <h4 className="font-medium mb-2 text-primary">{t("investmentSummary")}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-foreground">
                                      <span>{t("amount")}</span>
                                      <span className="font-medium">{formatCurrency(Number.parseFloat(form.watch("amount")))}</span>
                                      <span>{t("expectedReturn")}</span>
                                      <span className="font-medium">{formatCurrency((Number.parseFloat(form.watch("amount")) * project.expectedReturn) / 100)}</span>
                                      <span>{t("returnRate")}</span>
                                      <span className="font-medium">{project.expectedReturn}%</span>
                                      <span>{t("duration")}</span>
                                      <span className="font-medium">{project.duration} {t("months")}</span>
                                    </div>
                                  </motion.div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsInvestDialogOpen(false)} className="border-primary/20 hover:bg-primary/10 rounded-xl">
                                    {t("cancel")}
                                  </Button>
                                  <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 rounded-xl px-6"
                                    disabled={form.formState.isSubmitting}
                                  >
                                    {form.formState.isSubmitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {t("common.loading")}
                                      </>
                                    ) : (
                                      <span className="flex items-center gap-3">
                                        {t("submitInvestment")}
                                        <ArrowRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
                                      </span>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <Button asChild className="bg-background/95 hover:bg-primary/10 border-primary/20 rounded-full px-6">
                          <Link href="/dashboard/messages">{t("message")}</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Main Content */}
                <motion.div className="lg:col-span-2 space-y-6" variants={staggerContainer}>
                  {/* Project Overview */}
                  <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                    <motion.div variants={fadeInUp} className="p-6">
                      <h2 className="text-2xl font-semibold text-primary mb-4">{t("overview")}</h2>
                      <Carousel className="mb-6">
                        <CarouselContent>
                          {project.images?.map((img, i) => (
                            <CarouselItem key={i}>
                              <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-64 object-cover rounded-xl" />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-background/95 border-primary/20" />
                        <CarouselNext className="right-2 bg-background/95 border-primary/20" />
                      </Carousel>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">{t("description")}</h3>
                          <p className="text-muted-foreground">{project.description}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">{t("tags")}</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge key={tag} className="bg-primary/10 text-primary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        {project.milestones && (
                          <div>
                            <h3 className="text-lg font-medium text-foreground mb-4">{t("milestones")}</h3>
                            <div className="relative pl-6 space-y-6">
                              {project.milestones.map((milestone, i) => (
                                <motion.div key={milestone.id} variants={fadeInUp} className="relative">
                                  <div className={`absolute left-0 w-4 h-4 rounded-full ${milestone.status === "completed" ? "bg-primary" : milestone.status === "in-progress" ? "bg-yellow-500" : "bg-gray-300"}`} />
                                  {i < project.milestones!.length - 1 && <div className="absolute left-[7px] top-4 w-0.5 h-full bg-primary/20" />}
                                  <div className="ml-8">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium text-foreground">{milestone.title}</h4>
                                      <Badge
                                        className={
                                          milestone.status === "completed"
                                            ? "bg-primary/10 text-primary"
                                            : milestone.status === "in-progress"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {t(milestone.status)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                    <p className="text-sm text-muted-foreground">{t("dueDate")}: {formatDate(milestone.dueDate)}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Card>

                  {/* Tabs */}
                  <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                    <Tabs defaultValue="investments">
                      <TabsList className="bg-primary/5 rounded-t-xl border-b border-primary/20">
                        <TabsTrigger value="investments" className="flex items-center gap-2 text-foreground">
                          <Landmark className="h-4 w-4" /> {t("investments")} <Badge className="ml-2 bg-primary/10 text-primary">{investments.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="investors" className="flex items-center gap-2 text-foreground">
                          <Users className="h-4 w-4" /> {t("investors")} <Badge className="ml-2 bg-primary/10 text-primary">{investors.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2 text-foreground">
                          <FileText className="h-4 w-4" /> {t("documents")} <Badge className="ml-2 bg-primary/10 text-primary">{project.documents?.length || 0}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="updates" className="flex items-center gap-2 text-foreground">
                          <MessageSquare className="h-4 w-4" /> {t("updates")} <Badge className="ml-2 bg-primary/10 text-primary">{project.updates?.length || 0}</Badge>
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="investments" className="p-6">
                        {investments.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">{t("noInvestments")}</div>
                        ) : (
                          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                            {investments.map((investment) => (
                              <motion.div
                                key={investment.id}
                                variants={{ ...fadeInUp, ...cardHover }}
                                whileHover="hover"
                                className="border border-primary/20 rounded-xl p-4 bg-background/95"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-foreground">{formatCurrency(investment.amount)}</div>
                                    <div className="text-sm text-muted-foreground">{t("expectedReturn")}: {formatCurrency(investment.expectedReturn)}</div>
                                  </div>
                                  {getStatusBadge(investment.status)}
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <span>{t("date")}: {formatDate(investment.createdAt)}</span> | <span>{t("returnDate")}: {formatDate(investment.returnDate)}</span>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </TabsContent>
                      <TabsContent value="investors" className="p-6">
                        {investors.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">{t("noInvestors")}</div>
                        ) : (
                          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                            {investors.map((investor) => (
                              <motion.div
                                key={investor.id}
                                variants={{ ...fadeInUp, ...cardHover }}
                                whileHover="hover"
                                className="border border-primary/20 rounded-xl p-4 bg-background/95"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                                      {(investor.name || "").substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-medium text-foreground">{investor.name}</div>
                                      <div className="text-sm text-muted-foreground">{t(investor.investorType)}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-muted-foreground">{t("totalInvested")}</div>
                                    <div className="font-medium text-foreground">
                                      {formatCurrency(investments.filter((i) => i.investorId === investor.id && i.status === "approved").reduce((sum, i) => sum + i.amount, 0))}
                                    </div>
                                  </div>
                                </div>
                                <Progress
                                  value={(investments.filter((i) => i.investorId === investor.id && i.status === "approved").reduce((sum, i) => sum + i.amount, 0) / project.fundingGoal) * 100}
                                  className="h-1 mt-2 bg-primary/20"
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </TabsContent>
                      <TabsContent value="documents" className="p-6">
                        {project.documents?.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">{t("noDocuments")}</div>
                        ) : (
                          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                            {project.documents?.map((doc) => (
                              <motion.div
                                key={doc.id}
                                variants={{ ...fadeInUp, ...cardHover }}
                                whileHover="hover"
                                className="border border-primary/20 rounded-xl p-4 bg-white/95 backdrop-blur-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-foreground">{doc.title}</div>
                                    <div className="text-sm text-muted-foreground">{formatDate(doc.createdAt)}</div>
                                  </div>
                                  <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/10 rounded-xl">
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
                          <div className="text-center py-6 text-muted-foreground">{t("noUpdates")}</div>
                        ) : (
                          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                            {project.updates?.map((update) => (
                              <motion.div
                                key={update.id}
                                variants={{ ...fadeInUp, ...cardHover }}
                                whileHover="hover"
                                className="border border-primary/20 rounded-xl p-4 bg-white/95 backdrop-blur-sm"
                              >
                                <div className="font-medium text-foreground">{update.title}</div>
                                <div className="text-sm text-muted-foreground mt-1">{update.content}</div>
                                <div className="text-sm text-muted-foreground mt-2">{formatDate(update.createdAt)}</div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </Card>
                </motion.div>

                {/* Sidebar */}
                <motion.div className="space-y-6" variants={staggerContainer}>
                  {/* Funding Progress */}
                  <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                    <motion.div className="p-6" variants={fadeInUp}>
                      <h2 className="text-2xl font-semibold text-primary mb-4">{t("fundingProgress")}</h2>
                      <div className="space-y-4">
                        <Progress
                          value={fundingProgress}
                          className="h-3 bg-primary/20 [&_div]:bg-primary"
                        />
                        <div className="flex justify-between text-sm text-foreground">
                          <span>{formatCurrency(project.fundingRaised)}</span>
                          <span className="font-medium">{Math.round(fundingProgress)}%</span>
                          <span>{formatCurrency(project.fundingGoal)}</span>
                        </div>
                        <Separator className="bg-primary/20" />
                        <div className="space-y-3 text-sm text-foreground">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("contractType")}</span>
                            <span className="font-medium">{project.contractType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("expectedReturn")}</span>
                            <span className="font-medium">{project.expectedReturn}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("duration")}</span>
                            <span className="font-medium">{project.duration} {t("months")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("riskLevel")}</span>
                            <span className="font-medium">{t(project.riskLevel)}</span>
                          </div>
                        </div>
                        <Separator className="bg-primary/20" />
                        <div className="space-y-3 text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{t("created")}: {formatDate(project.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{t("endDate")}: {formatDate(project.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span>{t("investors")}: {investors.length}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {canInvest && (
                      <motion.div className="p-6 pt-0" variants={fadeInUp}>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-semibold"
                          onClick={() => setIsInvestDialogOpen(true)}
                        >
                          <span className="flex items-center gap-3">
                            {t("investNow")}
                            <ArrowRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
                          </span>
                        </Button>
                        <Button
                          asChild
                          className="w-full mt-2 bg-background/95 hover:bg-primary/10 border-primary/20 rounded-full px-8 py-6 text-lg font-semibold"
                        >
                          <Link href="/dashboard/messages">{t("message")}</Link>
                        </Button>
                      </motion.div>
                    )}
                  </Card>

                  {/* Location */}
                  <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                    <motion.div className="p-6" variants={fadeInUp}>
                      <h2 className="text-2xl font-semibold text-primary mb-4">{t("location")}</h2>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531676!3d-37.81720997975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDUwJzAxLjkiUyAxNDTC2JzEzLjUz!5e0!3m2!1sen!2sus!4v1635781263211!5m2!1sen!2sus"
                        className="w-full h-48 rounded-xl"
                        allowFullScreen
                        loading="lazy"
                        title={t("locationMap")}
                      />
                      <div className="mt-2 text-sm text-center flex items-center justify-center gap-2 text-foreground">
                        <MapPin className="h-4 w-4 text-primary" /> {project.location}
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              </div>

              {/* Sticky Mobile Footer */}
              {canInvest && (
                <motion.div
                  className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl bg-background/95 border-t border-primary/20 shadow-t lg:hidden"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-lg font-semibold"
                    onClick={() => setIsInvestDialogOpen(true)}
                  >
                    <span className="flex items-center gap-3">
                      {t("investNow")}
                      <ArrowRight className={cn("arrow-right", "h-5 w-5", isRtl && "rotate-180")} />
                    </span>
                  </Button>
                  <Button
                    asChild
                    className="w-full mt-6 bg-background/95 hover:bg-primary/10 border-primary/20 rounded-full py-6 text-lg font-semibold"
                  >
                    <Link href="/dashboard/messages">{t("message")}</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
        <div className="container px-4 md:px-6 py-12">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeInUp} className="flex justify-between items-center bg-background/95 p-6 rounded-3xl">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 bg-primary/20" />
                <Skeleton className="h-4 w-32 bg-primary/20" />
              </div>
              <Skeleton className="h-10 w-32 bg-primary/20" />
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-96 w-full bg-primary/20 rounded-3xl" />
                <Skeleton className="h-64 w-full bg-primary/20 rounded-3xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full bg-primary/20 rounded-3xl" />
                <Skeleton className="h-32 w-full bg-primary/20 rounded-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}