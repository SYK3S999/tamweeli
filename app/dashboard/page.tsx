"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useProjects, type Project, type ProjectStatus } from "@/components/project-provider"
import { useInvestments } from "@/components/investment-provider"
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.03, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "draft":
      return "bg-gray-500"
    case "under-review":
      return "bg-yellow-500"
    case "approved":
      return "bg-green-500"
    case "rejected":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function DashboardPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const { user } = useAuth()
  const { userProjects, isLoading: projectsLoading, updateProject, deleteProject } = useProjects()
  const { userInvestments } = useInvestments()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(projectsLoading)
  }, [projectsLoading])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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
      await deleteProject(projectId)
      toast({
        title: t("project.deleted"),
        description: t("project.deletedDesc"),
      })
    } catch (error) {
      toast({
        title: t("project.error"),
        description: t("project.errorDelete"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 dark:opacity-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container relative z-10 space-y-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                {isProjectOwner && t("dashboard.myProjects")}
                {isInvestor && t("dashboard.myInvestments")}
                {isConsultant && t("dashboard.consultingDashboard")}
              </h2>
              <p className="text-lg text-muted-foreground font-medium mt-2">
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
                  className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-secondary shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href={isProjectOwner ? "/projects/create" : "/projects"}>
                    <span className="flex items-center gap-3">
                      {isProjectOwner ? t("dashboard.addProject") : t("dashboard.browseProjects")}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
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
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start bg-background/90 backdrop-blur-sm border-primary/30 rounded-full p-2">
                      <TabsTrigger
                        value="all"
                        className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
                      >
                        {t("common.all")}
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-gradient-to-r from-primary/80 to-secondary/80 text-white"
                        >
                          {userProjects.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="draft"
                        className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
                      >
                        {t("project.draft")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="under-review"
                        className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
                      >
                        {t("project.underReview")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="approved"
                        className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
                      >
                        {t("project.approved")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejected"
                        className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
                      >
                        {t("project.rejected")}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-4">
                      {filteredProjects.length === 0 ? (
                        <motion.div variants={fadeInUp}>
                          <Card className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="py-16 text-center">
                              <p className="text-lg text-muted-foreground font-medium">
                                {t("dashboard.noProjects")}
                              </p>
                              <Button
                                asChild
                                className="mt-4 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-secondary"
                              >
                                <Link href="/projects/create">{t("dashboard.addProject")}</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={staggerContainer}
                          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                        >
                          {filteredProjects.map((project) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              onDelete={handleDeleteProject}
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
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {userInvestments.length === 0 ? (
                    <motion.div variants={fadeInUp} className="col-span-full">
                      <Card className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="py-16 text-center">
                          <p className="text-lg text-muted-foreground font-medium">
                            {t("dashboard.noInvestments")}
                          </p>
                          <Button
                            asChild
                            className="mt-4 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-secondary"
                          >
                            <Link href="/projects">{t("dashboard.browseProjects")}</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    userInvestments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))
                  )}
                </motion.div>
              )}

              {isConsultant && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  <motion.div variants={fadeInUp}>
                    <Card className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {t("dashboard.pendingRequests")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.requestsAwaiting")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">3</div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          <Link href="/dashboard/requests">{t("dashboard.viewAllRequests")}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Card className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {t("dashboard.activeClients")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.clientsOngoing")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">7</div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          <Link href="/dashboard/clients">{t("dashboard.viewAllClients")}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Card className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {t("dashboard.completedReports")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.reportsDelivered")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">12</div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          <Link href="/dashboard/reports">{t("dashboard.viewAllReports")}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (projectId: string) => void }) {
  const { t, language } = useLanguage()
  const { updateProject, isLoading } = useProjects()
  const { toast } = useToast()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleEditProject = async () => {
    try {
      // Placeholder for edit functionality; redirect to edit page or open modal
      toast({
        title: t("project.editNotImplemented"),
        description: t("project.editNotImplementedDesc"),
      })
    } catch (error) {
      toast({
        title: t("project.error"),
        description: t("project.errorEdit"),
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div variants={cardVariants} whileHover="hover">
      <Card className="relative overflow-hidden bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        <div className="absolute inset-[1px] bg-background/95 rounded-2xl" />

        <div className="relative z-10">
          <div className="h-48 bg-muted/20">
            {project.images && project.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.images[0]}
                alt={project.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-t-2xl">
                <span className="text-muted-foreground">{t("project.noImage")}</span>
              </div>
            )}
          </div>
        </div>

        <CardHeader className="relative z-10 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {project.name}
            </CardTitle>
            <Badge className={cn("ml-2 capitalize", getStatusColor(project.status))}>
              {t(`project.${project.status}`)}
            </Badge>
          </div>
          <CardDescription className="text-base line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-primary" />
              <span>{t(`sectors.${project.sector}`)}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{formatCurrency(project.amount, t)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(project.createdAt, language)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {project.duration} {t("project.months")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{project.fundingRaised ? formatCurrency(project.fundingRaised, t) : "0 DZD"} raised</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{project.returnRate}% return</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative z-10 flex justify-between">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-primary/30 hover:bg-primary/10"
          >
            <Link href={`/projects/${project.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              {t("project.view")}
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/30 hover:bg-primary/10"
              onClick={handleEditProject}
              disabled={isLoading}
              aria-label={t("project.edit")}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-primary/30 hover:bg-primary/10"
                  disabled={isLoading}
                  aria-label={t("project.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/90 backdrop-blur-sm border-primary/30">
                <DialogHeader>
                  <DialogTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t("project.confirmDelete")}
                  </DialogTitle>
                  <DialogDescription>{t("project.confirmDeleteDesc")}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenDeleteDialog(false)}
                    className="rounded-full border-primary/30 hover:bg-primary/10"
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    onClick={() => {
                      onDelete(project.id)
                      setOpenDeleteDialog(false)
                    }}
                    className="rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    disabled={isLoading}
                  >
                    {t("project.delete")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function InvestmentCard({ investment }: { investment: any }) {
  const { t, language } = useLanguage()
  const { projects } = useProjects()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const relatedProject = projects.find((p) => p.id === investment.projectId)
    if (relatedProject) {
      setProject(relatedProject)
    }
  }, [investment, projects])

  if (!project) return null

  const getSectorTranslation = (sector: string | undefined) => {
    return sector ? t(`sectors.${sector}`) : t("sectors.undefined")
  }

  const getContractTypeTranslation = (contractType: string | undefined) => {
    return contractType ? t(`contractTypes.${contractType}`) : t("contractTypes.undefined")
  }

  return (
    <motion.div variants={cardVariants} whileHover="hover">
      <Card className="relative overflow-hidden bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        <div className="absolute inset-[1px] bg-background/95 rounded-2xl" />

        <div className="relative z-10">
          <div className="h-48 bg-muted/20">
            {project.images && project.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.images[0]}
                alt={project.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-t-2xl">
                <span className="text-muted-foreground">{t("project.noImage")}</span>
              </div>
            )}
          </div>
        </div>

        <CardHeader className="relative z-10 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {project.name}
            </CardTitle>
            <Badge
              className={cn(
                investment.status === "pending"
                  ? "bg-yellow-500"
                  : investment.status === "accepted"
                    ? "bg-green-500"
                    : investment.status === "rejected"
                      ? "bg-red-500"
                      : "bg-blue-500",
                "capitalize",
              )}
            >
              {t(`investment.${investment.status}`)}
            </Badge>
          </div>
          <CardDescription className="text-base line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-primary" />
              <span>{getSectorTranslation(project.sector)}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{formatCurrency(investment.amount, t)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(investment.createdAt, language)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {project.duration} {t("project.months")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{project.fundingRaised ? formatCurrency(project.fundingRaised, t) : "0 DZD"} raised</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{project.returnRate}% return</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative z-10">
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-primary/30 hover:bg-primary/10"
          >
            <Link href={`/investments/${investment.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              {t("project.viewDetails")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}