"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Users, Briefcase, FileText, Clock, ArrowUpRight, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  updateDemoProjectStatus,
  updateDemoInvestmentStatus,
  updateDemoServiceRequestStatus,
} from "@/lib/demo-accounts"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface Project {
  id: string
  title: string
  sector: string
  fundingGoal: number
  contractType: string
  expectedReturn: number
  duration: number
  description: string
  tags: string[]
  status: string
}

interface Investment {
  id: string
  projectId: string
  investorId: string
  amount: number
  expectedReturn: number
  createdAt: string
  returnDate: string
  status: string
  project?: { title: string; description: string }
  investor?: { name: string }
}

interface ServiceRequest {
  id: string
  serviceId: string
  userId: string
  message: string
  createdAt: string
  status: string
  service?: { id: string; title: string; category: string; price: number; duration: string; description: string }
  user?: { name: string }
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  userType: string
  isVerified: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  const [pendingProjects, setPendingProjects] = useState<Project[]>([])
  const [pendingInvestments, setPendingInvestments] = useState<Investment[]>([])
  const [pendingServiceRequests, setPendingServiceRequests] = useState<ServiceRequest[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pending-projects")

  useEffect(() => {
    if (user && user.userType !== "consultant" && user.userType !== "admin") {
      router.push("/dashboard")
    } else {
      loadData()
    }
  }, [user, router])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const projects: Project[] = JSON.parse(localStorage.getItem("projects") || "[]")
      const investments: Investment[] = JSON.parse(localStorage.getItem("investments") || "[]")
      const serviceRequests: ServiceRequest[] = JSON.parse(localStorage.getItem("serviceRequests") || "[]")
      const services = JSON.parse(localStorage.getItem("services") || "[]")
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")

      setPendingProjects(projects.filter((p) => p.status === "pending"))

      const projectsMap = projects.reduce((acc, project) => {
        acc[project.id] = project
        return acc
      }, {} as Record<string, Project>)

      const usersMap = users.reduce((acc, user) => {
        acc[user.id] = user
        return acc
      }, {} as Record<string, User>)

      const enrichedInvestments = investments
        .filter((i) => i.status === "pending")
        .map((inv) => ({
          ...inv,
          project: projectsMap[inv.projectId],
          investor: usersMap[inv.investorId],
        }))
      setPendingInvestments(enrichedInvestments)

      const servicesMap = services.reduce((acc: { [x: string]: any }, service: { id: string | number }) => {
        acc[service.id] = service
        return acc
      }, {} as Record<string, any>)

      const enrichedRequests = serviceRequests
        .filter((r) => r.status === "pending")
        .map((req) => ({
          ...req,
          service: servicesMap[req.serviceId],
          user: usersMap[req.userId],
        }))
      setPendingServiceRequests(enrichedRequests)

      setRecentUsers(users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5))
    } catch (err) {
      setError(t("admin.errorLoading"))
      toast({
        title: t("common.error"),
        description: t("admin.errorLoading"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [t, toast])

  const handleApproveProject = async (projectId: string) => {
    try {
      await updateDemoProjectStatus(projectId, "approved")
      toast({
        title: t("admin.projectApproved"),
        description: t("admin.projectApprovedDesc"),
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.actionFailed"),
        variant: "destructive",
      })
    }
  }

  const handleRejectProject = async (projectId: string) => {
    try {
      await updateDemoProjectStatus(projectId, "rejected")
      toast({
        title: t("admin.projectRejected"),
        description: t("admin.projectRejectedDesc"),
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.actionFailed"),
        variant: "destructive",
      })
    }
  }

  const handleApproveInvestment = async (investmentId: string) => {
    try {
      await updateDemoInvestmentStatus(investmentId, "approved")
      toast({
        title: t("admin.investmentApproved"),
        description: t("admin.investmentApprovedDesc"),
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.actionFailed"),
        variant: "destructive",
      })
    }
  }

  const handleRejectInvestment = async (investmentId: string) => {
    try {
      await updateDemoInvestmentStatus(investmentId, "rejected")
      toast({
        title: t("admin.investmentRejected"),
        description: t("admin.investmentRejectedDesc"),
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.actionFailed"),
        variant: "destructive",
      })
    }
  }

  const handleApproveServiceRequest = async (requestId: string) => {
    try {
      await updateDemoServiceRequestStatus(requestId, "approved")
      toast({
        title: t("admin.serviceApproved"),
        description: t("admin.serviceApprovedDesc"),
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.actionFailed"),
        variant: "destructive",
      })
    }
  }

  const handleRejectServiceRequest = async (requestId: string) => {
    try {
      await updateDemoServiceRequestStatus(requestId, "rejected")
      toast({
        title: t("admin.serviceRejected"),
        description: t("admin.serviceRejectedDesc"),
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.actionFailed"),
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        {t("common.loading")}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <CardContent className="text-center text-red-600">{error}</CardContent>
          <CardFooter className="justify-center">
            <Button onClick={loadData} variant="outline">
              {t("admin.retry")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 ltr">
      <h1 className="text-4xl font-bold text-green-700 mb-8">{t("admin.dashboard")}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-700">{t("admin.pendingProjects")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingProjects.length}</div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-green-600 hover:text-green-700"
                onClick={() => setActiveTab("pending-projects")}
                aria-label={t("admin.viewPendingProjects")}
              >
                {t("admin.viewAll")} <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-700">{t("admin.pendingInvestments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingInvestments.length}</div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-green-600 hover:text-green-700"
                onClick={() => setActiveTab("pending-investments")}
                aria-label={t("admin.viewPendingInvestments")}
              >
                {t("admin.viewAll")} <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-700">{t("admin.serviceRequests")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingServiceRequests.length}</div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-green-600 hover:text-green-700"
                onClick={() => setActiveTab("pending-services")}
                aria-label={t("admin.viewServiceRequests")}
              >
                {t("admin.viewAll")} <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-2 rounded-lg">
          <TabsTrigger
            value="pending-projects"
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
            aria-label={t("admin.pendingProjects")}
          >
            <Briefcase className="h-4 w-4" />
            {t("admin.pendingProjects")}
          </TabsTrigger>
          <TabsTrigger
            value="pending-investments"
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
            aria-label={t("admin.pendingInvestments")}
          >
            <FileText className="h-4 w-4" />
            {t("admin.pendingInvestments")}
          </TabsTrigger>
          <TabsTrigger
            value="pending-services"
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
            aria-label={t("admin.serviceRequests")}
          >
            <Clock className="h-4 w-4" />
            {t("admin.serviceRequests")}
          </TabsTrigger>
          <TabsTrigger
            value="recent-users"
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
            aria-label={t("admin.recentUsers")}
          >
            <Users className="h-4 w-4" />
            {t("admin.recentUsers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending-projects">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-1/4 mr-2" />
                    <Skeleton className="h-8 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : pendingProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t("admin.noPendingProjects")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingProjects.map((project) => (
                <Card key={project.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-green-700">{project.title}</CardTitle>
                        <CardDescription>{t("admin.sector")}: {project.sector}</CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
                        <AlertCircle className="h-3 w-3" />
                        {t("admin.pending")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.fundingGoal")}</div>
                        <div className="font-medium">{formatCurrency(project.fundingGoal)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.contractType")}</div>
                        <div className="font-medium">{project.contractType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.expectedReturn")}</div>
                        <div className="font-medium">{project.expectedReturn}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.duration")}</div>
                        <div className="font-medium">
                          {project.duration} {t("admin.months")}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{t("admin.description")}</div>
                    <div className="text-sm mb-4 line-clamp-3">{project.description}</div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      aria-label={t("admin.viewDetails")}
                    >
                      {t("admin.viewDetails")}
                    </Button>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" aria-label={t("admin.rejectProject")}>
                            {t("admin.reject")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.rejectConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.rejectConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRejectProject(project.id)}>
                              {t("admin.reject")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" className="bg-green-600 hover:bg-green-700" aria-label={t("admin.approveProject")}>
                            {t("admin.approve")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.approveConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.approveConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproveProject(project.id)}>
                              {t("admin.approve")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending-investments">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-1/4 mr-2" />
                    <Skeleton className="h-8 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : pendingInvestments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t("admin.noPendingInvestments")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingInvestments.map((investment) => (
                <Card key={investment.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-green-700">
                          {t("admin.investmentIn")} {investment.project?.title}
                        </CardTitle>
                        <CardDescription>
                          {t("admin.fromInvestor")}: {investment.investor?.name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
                        <AlertCircle className="h-3 w-3" />
                        {t("admin.pending")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.investmentAmount")}</div>
                        <div className="font-medium">{formatCurrency(investment.amount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.expectedReturn")}</div>
                        <div className="font-medium">{formatCurrency(investment.expectedReturn)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.investmentDate")}</div>
                        <div className="font-medium">{formatDate(investment.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.returnDate")}</div>
                        <div className="font-medium">{formatDate(investment.returnDate)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{t("admin.projectDescription")}</div>
                    <div className="text-sm mb-4 line-clamp-3">{investment.project?.description}</div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/investments/${investment.id}`)}
                      aria-label={t("admin.viewDetails")}
                    >
                      {t("admin.viewDetails")}
                    </Button>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" aria-label={t("admin.rejectInvestment")}>
                            {t("admin.reject")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.rejectConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.rejectConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRejectInvestment(investment.id)}>
                              {t("admin.reject")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" className="bg-green-600 hover:bg-green-700" aria-label={t("admin.approveInvestment")}>
                            {t("admin.approve")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.approveConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.approveConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproveInvestment(investment.id)}>
                              {t("admin.approve")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending-services">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-1/4 mr-2" />
                    <Skeleton className="h-8 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : pendingServiceRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t("admin.noPendingServices")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingServiceRequests.map((request) => (
                <Card key={request.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-green-700">
                          {t("admin.requestFor")} {request.service?.title}
                        </CardTitle>
                        <CardDescription>
                          {t("admin.from")}: {request.user?.name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
                        <AlertCircle className="h-3 w-3" />
                        {t("admin.pending")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.serviceCategory")}</div>
                        <div className="font-medium">{request.service?.category}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.servicePrice")}</div>
                        <div className="font-medium">{formatCurrency(request.service?.price ?? 0)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.requestDate")}</div>
                        <div className="font-medium">{formatDate(request.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("admin.duration")}</div>
                        <div className="font-medium">{request.service?.duration}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{t("admin.message")}</div>
                    <div className="text-sm p-3 bg-gray-100 rounded-md mb-4">{request.message}</div>
                    <div className="text-sm text-muted-foreground mb-2">{t("admin.serviceDescription")}</div>
                    <div className="text-sm mb-4 line-clamp-3">{request.service?.description}</div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/services/${request.service?.id}`)}
                      aria-label={t("admin.viewService")}
                    >
                      {t("admin.viewService")}
                    </Button>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" aria-label={t("admin.rejectService")}>
                            {t("admin.reject")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.rejectConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.rejectConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRejectServiceRequest(request.id)}>
                              {t("admin.reject")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" className="bg-green-600 hover:bg-green-700" aria-label={t("admin.approveService")}>
                            {t("admin.approve")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.approveConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.approveConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproveServiceRequest(request.id)}>
                              {t("admin.approve")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent-users">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : recentUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t("admin.noRecentUsers")}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">{t("admin.recentUsers")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user, index) => (
                    <div key={user.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={user.isVerified ? "bg-green-600 text-white" : ""}>
                            {user.isVerified ? t("admin.verified") : t("admin.unverified")}
                          </Badge>
                          <Badge variant="outline">{t(`admin.userType.${user.userType}`)}</Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">{t("admin.joined")}:</span> {formatDate(user.createdAt)}
                      </div>
                      {index < recentUsers.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}