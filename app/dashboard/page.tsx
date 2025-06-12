"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  Building,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  FileEdit,
  Trash2,
  Loader2,
  ArrowRight,
} from "lucide-react"
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

// Mock data
interface Project {
  id: string
  name: string
  description: string
  sector: string
  status: ProjectStatus
  amount: number
  fundingRaised: number
  createdAt: string
  duration: number
  returnRate: number
  images?: string[]
}

interface Investment {
  id: string
  projectId: string
  amount: number
  status: string
  createdAt: string
}

type ProjectStatus = "draft" | "under-review" | "approved" | "rejected"

const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Tamweeli Water Purification",
    description: "Nano-filtration technology for clean water in rural areas.",
    sector: "healthcare",
    status: "approved",
    amount: 500000,
    fundingRaised: 435000,
    createdAt: "2025-05-15T00:00:00Z",
    duration: 12,
    returnRate: 10,
    images: ["https://images.unsplash.com/photo-1518152006812-edab29b069ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "proj-2",
    name: "EcoSmart Solar Farms",
    description: "Sustainable solar energy for urban and rural communities.",
    sector: "technology",
    status: "under-review",
    amount: 750000,
    fundingRaised: 600000,
    createdAt: "2025-04-20T00:00:00Z",
    duration: 18,
    returnRate: 12,
    images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "proj-3",
    name: "GreenHarvest Agrotech",
    description: "Smart farming solutions to boost agricultural productivity.",
    sector: "agriculture",
    status: "draft",
    amount: 300000,
    fundingRaised: 150000,
    createdAt: "2025-03-10T00:00:00Z",
    duration: 24,
    returnRate: 8,
    images: ["https://images.unsplash.com/photo-1500595046743-dd26eb752fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "proj-4",
    name: "EduFuture E-Learning",
    description: "Online platform for accessible education.",
    sector: "education",
    status: "rejected",
    amount: 200000,
    fundingRaised: 180000,
    createdAt: "2025-02-15T00:00:00Z",
    duration: 12,
    returnRate: 7,
    images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
  },
]

const mockInvestments: Investment[] = [
  {
    id: "inv-1",
    projectId: "proj-1",
    amount: 50000,
    status: "accepted",
    createdAt: "2025-05-16T00:00:00Z",
  },
  {
    id: "inv-2",
    projectId: "proj-2",
    amount: 75000,
    status: "pending",
    createdAt: "2025-04-25T00:00:00Z",
  },
]

const getStatusColor = (status: ProjectStatus | string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800"
    case "under-review":
      return "bg-yellow-100 text-yellow-800"
    case "approved":
    case "accepted":
      return "bg-primary/10 text-primary"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DashboardPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Use mock data
  const userProjects = mockProjects
  const userInvestments = mockInvestments

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const isProjectOwner = user.userType === "project-owner"
  const isInvestor = user.userType === "investor"
  const isConsultant = user.userType === "consultant"

  const filteredProjects =
    activeTab === "all" ? userProjects : userProjects.filter((project) => project.status === activeTab)

  const handleDeleteProject = async (projectId: string) => {
    try {
      // Simulate deletion
      toast({
        title: t("project.deleted"),
        description: t("project.deletedDesc"),
        className: "bg-background/95 border-primary",
      })
    } catch (error) {
      toast({
        title: t("project.error"),
        description: t("project.errorDelete"),
        variant: "destructive",
        className: "bg-background/95 border-primary/20",
      })
    }
  }

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
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
              {/* Header */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <Badge
                    variant="outline"
                    className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                  >
                    <span className="text-primary">
                      
                      {isInvestor && t("dashboard.myInvestments")}
                      {isConsultant && t("dashboard.consultingDashboard")}
                    </span>
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-semibold text-primary">
                    
                    {isInvestor && t("dashboard.myInvestments")}
                    {isConsultant && t("dashboard.consultingDashboard")}
                  </h2>
                  <p className="text-lg text-muted-foreground mt-2">
                    {isProjectOwner && t("dashboard.manageProjects")}
                    {isInvestor && t("dashboard.trackInvestments")}
                    {isConsultant && t("dashboard.manageConsulting")}
                  </p>
                </div>
                {(isProjectOwner || isInvestor) && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Link href={isProjectOwner ? "/projects/create" : "/projects"}>
                        <span className="flex items-center gap-3">
                          {isProjectOwner ? t("dashboard.addProject") : t("dashboard.browseProjects")}
                          <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
                        </span>
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </motion.div>
              ) : (
                <>
                  {isProjectOwner && (
                    <motion.div variants={staggerContainer}>
                      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start bg-primary/5 rounded-full p-2 border-primary/20">
                          <TabsTrigger
                            value="all"
                            className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                          >
                            {t("common.all")}
                            <Badge className="ml-2 bg-primary/10 text-primary">{userProjects.length}</Badge>
                          </TabsTrigger>
                          <TabsTrigger
                            value="draft"
                            className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                          >
                            {t("project.draft")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="under-review"
                            className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                          >
                            {t("project.underReview")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="approved"
                            className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                          >
                            {t("project.approved")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="rejected"
                            className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                          >
                            {t("project.rejected")}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-4">
                          {filteredProjects.length === 0 ? (
                            <motion.div variants={fadeInUp}>
                              <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                                <div className="py-16 text-center text-muted-foreground">
                                  <p className="text-lg font-medium">{t("dashboard.noProjects")}</p>
                                  <Button
                                    asChild
                                    className="mt-4 rounded-full bg-primary hover:bg-primary/90 px-6"
                                  >
                                    <Link href="/projects/create">{t("dashboard.addProject")}</Link>
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ) : (
                            <motion.div
                              variants={staggerContainer}
                              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            >
                              {filteredProjects.map((project) => (
                                <ProjectCard
                                  key={project.id}
                                  project={project}
                                  onDelete={handleDeleteProject}
                                  isRtl={isRtl}
                                />
                              ))}
                            </motion.div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  )}

                  {isInvestor && (
                    <motion.div
                      variants={staggerContainer}
                      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {userInvestments.length === 0 ? (
                        <motion.div variants={fadeInUp} className="col-span-full">
                          <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                            <div className="py-16 text-center text-muted-foreground">
                              <p className="text-lg font-medium">{t("dashboard.noInvestments")}</p>
                              <Button
                                asChild
                                className="mt-4 rounded-full bg-primary hover:bg-primary/90 px-6"
                              >
                                <Link href="/projects">{t("dashboard.browseProjects")}</Link>
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ) : (
                        userInvestments.map((investment) => (
                          <InvestmentCard
                            key={investment.id}
                            investment={investment}
                            projects={userProjects}
                            isRtl={isRtl}
                          />
                        ))
                      )}
                    </motion.div>
                  )}

                  {isConsultant && (
                    <motion.div
                      variants={staggerContainer}
                      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                      <motion.div variants={fadeInUp}>
                        <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-primary">{t("dashboard.pendingRequests")}</h3>
                            <p className="text-muted-foreground mt-2">{t("dashboard.requestsAwaiting")}</p>
                            <div className="text-3xl font-bold text-primary mt-4">3</div>
                          </div>
                          <div className="p-6 pt-0">
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full text-primary hover:bg-primary/10 rounded-xl"
                            >
                              <Link href="/dashboard/requests">{t("dashboard.viewAllRequests")}</Link>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeInUp}>
                        <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-primary">{t("dashboard.activeClients")}</h3>
                            <p className="text-muted-foreground mt-2">{t("dashboard.clientsOngoing")}</p>
                            <div className="text-3xl font-bold text-primary mt-4">7</div>
                          </div>
                          <div className="p-6 pt-0">
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full text-primary hover:bg-primary/10 rounded-xl"
                            >
                              <Link href="/dashboard/clients">{t("dashboard.viewAllClients")}</Link>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeInUp}>
                        <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-primary">{t("dashboard.completedReports")}</h3>
                            <p className="text-muted-foreground mt-2">{t("dashboard.reportsDelivered")}</p>
                            <div className="text-3xl font-bold text-primary mt-4">12</div>
                          </div>
                          <div className="p-6 pt-0">
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full text-primary hover:bg-primary/10 rounded-xl"
                            >
                              <Link href="/dashboard/reports">{t("dashboard.viewAllReports")}</Link>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

function ProjectCard({ project, onDelete, isRtl }: { project: Project; onDelete: (projectId: string) => void; isRtl: boolean }) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const fundingProgress = project.fundingRaised / project.amount * 100

  const handleEditProject = async () => {
    toast({
      title: t("project.editNotImplemented"),
      description: t("project.editNotImplementedDesc"),
      className: "bg-background/95 border-primary",
    })
  }

  return (
    <motion.div variants={{ ...fadeInUp, ...cardHover }} whileHover="hover">
      <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
        <div className="relative h-48">
          {project.images && project.images[0] ? (
            <img
              src={project.images[0]}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <span className="text-muted-foreground">{t("project.noImage")}</span>
            </div>
          )}
          <Badge className={cn("absolute top-4 right-4 capitalize", getStatusColor(project.status))}>
            {t(`project.${project.status}`)}
          </Badge>
        </div>
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-semibold text-primary line-clamp-1">{project.name}</h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{project.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-foreground mt-4">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-primary" />
              <span>{t(`sectors.${project.sector}`)}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{formatCurrency(project.amount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(project.createdAt, language)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{project.duration} {t("project.months")}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{formatCurrency(project.fundingRaised)} {t("project.raised")}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{project.returnRate}% {t("project.return")}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>{t("fundingProgress")}</span>
              <span>{Math.round(fundingProgress)}%</span>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-between">
          <Button
            asChild
            className="rounded-full bg-primary hover:bg-primary/90 px-4 group"
          >
            <Link href={`/projects/${project.id}`}>
              <span className="flex items-center gap-2">
                {t("project.view")}
                <ArrowRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
              </span>
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/10"
              onClick={handleEditProject}
              aria-label={t("project.edit")}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-primary/20 hover:bg-primary/10"
                  aria-label={t("project.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl text-primary">{t("project.confirmDelete")}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">{t("project.confirmDeleteDesc")}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenDeleteDialog(false)}
                    className="rounded-full border-primary/20 hover:bg-primary/10"
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    onClick={() => {
                      onDelete(project.id)
                      setOpenDeleteDialog(false)
                    }}
                    className="rounded-full bg-red-600 hover:bg-red-700"
                  >
                    {t("project.delete")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function InvestmentCard({ investment, projects, isRtl }: { investment: Investment; projects: Project[]; isRtl: boolean }) {
  const { t, language } = useLanguage()
  const project = projects.find((p) => p.id === investment.projectId)
  const fundingProgress = project ? project.fundingRaised / project.amount * 100 : 0

  if (!project) return null

  return (
    <motion.div variants={{ ...fadeInUp, ...cardHover }} whileHover="hover">
      <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
        <div className="relative h-48">
          {project.images && project.images[0] ? (
            <img
              src={project.images[0]}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <span className="text-muted-foreground">{t("project.noImage")}</span>
            </div>
          )}
          <Badge className={cn("absolute top-4 right-4 capitalize", getStatusColor(investment.status))}>
            {t(`investment.${investment.status}`)}
          </Badge>
        </div>
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-semibold text-primary line-clamp-1">{project.name}</h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{project.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-foreground mt-4">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-primary" />
              <span>{t(`sectors.${project.sector}`)}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{formatCurrency(investment.amount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(investment.createdAt, language)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{project.duration} {t("project.months")}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{formatCurrency(project.fundingRaised)} {t("project.raised")}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{project.returnRate}% {t("project.return")}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>{t("fundingProgress")}</span>
              <span>{Math.round(fundingProgress)}%</span>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <Button
            asChild
            className="w-full rounded-full bg-primary hover:bg-primary/90 py-6 text-lg font-semibold group"
          >
            <Link href={`/investments/${investment.id}`}>
              <span className="flex items-center gap-3">
                {t("project.viewDetails")}
                <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
              </span>
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}