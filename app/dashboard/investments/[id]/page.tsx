"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useProjects } from "@/components/project-provider"
import { useInvestments } from "@/components/investment-provider"
import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Download,
  FileText,
  MessageSquare,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { initializeDemoData, updateInvestmentStatus } from "@/lib/demo-data"

export default function InvestmentDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { projects } = useProjects()
  const { getInvestmentById, updateInvestment } = useInvestments()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [isUpdating, setIsUpdating] = useState(false)

  // Initialize demo data
  if (typeof window !== "undefined") {
    initializeDemoData()
  }

  const investment = getInvestmentById(id as string)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (!investment) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t("investment.notFound")}</h1>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.backToDashboard")}
          </Link>
        </Button>
      </div>
    )
  }

  const project = projects.find((p) => p.id === investment.projectId)
  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t("project.notFound")}</h1>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.backToDashboard")}
          </Link>
        </Button>
      </div>
    )
  }

  const isInvestor = investment.investorId === user.id
  const isProjectOwner = project.ownerId === user.id
  const isAdmin = user.userType === "consultant" || user.userType === "admin"

  // Safely get the sector and contract type translations
  const getSectorTranslation = (sector: string | undefined) => {
    return sector ? t(`sectors.${sector}`) : t("sectors.undefined")
  }

  const getContractTypeTranslation = (contractType: string | undefined) => {
    return contractType ? t(`contractTypes.${contractType}`) : t("contractTypes.undefined")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "accepted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleUpdateStatus = async (status: "accepted" | "rejected") => {
    if (!isProjectOwner && !isAdmin) return

    setIsUpdating(true)
    try {
      // Update investment status in localStorage
      updateInvestmentStatus(investment.id, status === "accepted" ? "approved" : status)

      // Update investment status in state
      await updateInvestment(investment.id, { status })

      toast({
        title: `Investment ${status === "accepted" ? "accepted" : "rejected"}`,
        description: `The investment has been successfully ${status}.`,
        variant: status === "accepted" ? "default" : "destructive",
      })
    } catch (error) {
      console.error(`Failed to ${status} investment:`, error)
      toast({
        title: "Error",
        description: `Failed to ${status} the investment. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/requests"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isInvestor ? t("investment.yourInvestment") : t("investment.investmentRequest")}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn(getStatusColor(investment.status))}>{t(`investment.${investment.status}`)}</Badge>
            <span className="text-sm text-muted-foreground">
              {t("investment.submittedOn")} {new Date(investment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {(isProjectOwner || isAdmin) && investment.status === "pending" && (
          <div className="flex gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleUpdateStatus("accepted")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("common.accept")}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleUpdateStatus("rejected")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  {t("common.decline")}
                </>
              )}
            </Button>
          </div>
        )}
        {isInvestor && investment.status === "accepted" && (
          <Button asChild>
            <Link href={`/dashboard/messages?project=${project.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              {t("investment.contactProjectOwner")}
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">{t("investment.details")}</TabsTrigger>
          <TabsTrigger value="project">{t("investment.projectDetails")}</TabsTrigger>
          <TabsTrigger value="documents">{t("investment.documents")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("investment.investmentDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("investment.amount")}</h3>
                  <p className="text-xl font-bold">
                    {investment.amount.toLocaleString()} {t("common.currency")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("investment.status")}</h3>
                  <p className="text-xl font-bold capitalize">{t(`investment.${investment.status}`)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("investment.submittedOn")}</h3>
                  <p className="text-base">{new Date(investment.createdAt).toLocaleDateString()}</p>
                </div>
                {investment.status !== "pending" && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("investment.updatedOn")}</h3>
                    <p className="text-base">
                      {new Date(investment.updatedAt || new Date().toISOString()).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("investment.message")}</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{investment.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {(isProjectOwner || isAdmin) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("investment.investorInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {t("investment.investor")} {investment.investorId.split("-")[1]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("investment.joinedOn")}{" "}
                      {new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isInvestor && investment.status === "accepted" && (
            <Card>
              <CardHeader>
                <CardTitle>{t("investment.nextSteps")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t("investment.proposalAccepted")}</h3>
                      <p className="text-sm text-muted-foreground">{t("investment.proposalAcceptedDesc")}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <MessageSquare className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t("investment.contactOwner")}</h3>
                      <p className="text-sm text-muted-foreground">{t("investment.contactOwnerDesc")}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t("investment.signAgreement")}</h3>
                      <p className="text-sm text-muted-foreground">{t("investment.signAgreementDesc")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="project" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{getSectorTranslation(project.sector)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {project.amount.toLocaleString()} {t("common.currency")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{getContractTypeTranslation(project.contractType)}</span>
                </div>
              </div>

              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/projects/${project.id}`}>{t("project.viewDetails")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("investment.documents")}</CardTitle>
              <CardDescription>{t("investment.documentsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {investment.status === "accepted" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-3">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t("investment.investmentAgreement")}</h3>
                        <p className="text-sm text-muted-foreground">PDF, 1.2 MB</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Document downloaded",
                          description: "The investment agreement has been downloaded.",
                        })
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t("common.download")}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-3">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t("investment.paymentInstructions")}</h3>
                        <p className="text-sm text-muted-foreground">PDF, 0.8 MB</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Document downloaded",
                          description: "The payment instructions have been downloaded.",
                        })
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t("common.download")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    {investment.status === "pending"
                      ? t("investment.documentsAvailableAfterAcceptance")
                      : t("investment.noDocumentsAvailable")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
