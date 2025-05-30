
"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useProjects } from "@/components/project-provider"
import { useServices, type ServiceType } from "@/components/service-provider"
import { Check, Clock, DollarSign, Eye, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: {},
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const formSchema = z.object({
  serviceId: z.string().nonempty({ message: "services.errors.serviceRequired" }),
  projectId: z.string().optional(),
  description: z.string().min(255, { message: "services.errors.descriptionMin" }),
  files: z.array(z.instanceof(File)).optional(),
})

// Mock API service (replace with real API)
// Mock API service (replace with real API)
const mockApi = {
  fetchServices: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: "srv-fin-001",
        type: "financial",
        price: 75000,
        description: "Comprehensive financial analysis, including cash flow projections and ROI calculations for investment opportunities.",
        consultantId: "consultant-001",
      },
      {
        id: "srv-fin-002",
        type: "financial",
        price: 50000,
        description: "Budget planning and cost optimization for small to medium-sized investment projects.",
        consultantId: "consultant-002",
      },
      {
        id: "srv-leg-001",
        type: "legal",
        price: 90000,
        description: "Legal review of investment contracts, ensuring compliance with Algerian commercial law.",
        consultantId: "consultant-003",
      },
      {
        id: "srv-leg-002",
        type: "legal",
        price: 65000,
        description: "Drafting and vetting partnership agreements for joint ventures.",
        consultantId: "consultant-004",
      },
      {
        id: "srv-isl-001",
        type: "islamic",
        price: 80000,
        description: "Sharia-compliant investment structuring, including Murabaha and Musharaka contracts.",
        consultantId: "consultant-005",
      },
      {
        id: "srv-isl-002",
        type: "islamic",
        price: 60000,
        description: "Audit of financial products to ensure adherence to Islamic finance principles.",
        consultantId: "consultant-006",
      },
      {
        id: "srv-fea-001",
        type: "feasibility",
        price: 70000,
        description: "Detailed feasibility study for real estate and infrastructure projects, including market analysis.",
        consultantId: "consultant-007",
      },
      {
        id: "srv-fea-002",
        type: "feasibility",
        price: 55000,
        description: "Technical feasibility assessment for technology-driven startups.",
        consultantId: "consultant-008",
      },
      {
        id: "srv-fin-003",
        type: "financial",
        price: 85000,
        description: "Risk assessment and mitigation strategies for high-value investments.",
        consultantId: "consultant-009",
      },
      {
        id: "srv-leg-003",
        type: "legal",
        price: 70000,
        description: "Regulatory compliance consultation for foreign investors in Algeria.",
        consultantId: "consultant-010",
      },
      {
        id: "srv-isl-003",
        type: "islamic",
        price: 65000,
        description: "Advisory on Sukuk issuance and Islamic bond structuring.",
        consultantId: "consultant-011",
      },
      {
        id: "srv-fea-003",
        type: "feasibility",
        price: 60000,
        description: "Environmental impact and sustainability analysis for agricultural projects.",
        consultantId: "consultant-012",
      },
    ]
  },
  fetchUserRequests: async (userId: string, page: number) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const requestsPerPage = 5
    const requests = [
      {
        id: "req-001",
        userId,
        serviceId: "srv-fin-001",
        projectId: "proj-001",
        description: "Need detailed financial analysis for a tech startup investment, focusing on ROI and cash flow projections.",
        status: "pending",
        createdAt: "2025-05-25T10:00:00Z",
      },
      {
        id: "req-002",
        userId,
        serviceId: "srv-leg-001",
        projectId: null,
        description: "Require legal review of a Murabaha contract for a real estate investment.",
        status: "in-progress",
        createdAt: "2025-05-24T14:30:00Z",
      },
      {
        id: "req-003",
        userId,
        serviceId: "srv-isl-001",
        projectId: "proj-002",
        description: "Seeking Sharia-compliant structuring for a Musharaka-based agricultural project.",
        status: "completed",
        createdAt: "2025-05-23T09:15:00Z",
      },
      {
        id: "req-004",
        userId,
        serviceId: "srv-fea-001",
        projectId: "proj-003",
        description: "Feasibility study for a commercial real estate development in Algiers.",
        status: "rejected",
        createdAt: "2025-05-22T16:45:00Z",
      },
      {
        id: "req-005",
        userId,
        serviceId: "srv-fin-002",
        projectId: null,
        description: "Budget optimization for a planned investment in renewable energy.",
        status: "pending",
        createdAt: "2025-05-21T11:20:00Z",
      },
      {
        id: "req-006",
        userId,
        serviceId: "srv-leg-002",
        projectId: "proj-004",
        description: "Draft partnership agreement for a joint venture in manufacturing.",
        status: "in-progress",
        createdAt: "2025-05-20T13:50:00Z",
      },
      {
        id: "req-007",
        userId,
        serviceId: "srv-isl-002",
        projectId: null,
        description: "Audit of financial products for a retail investment portfolio.",
        status: "completed",
        createdAt: "2025-05-19T08:30:00Z",
      },
      {
        id: "req-008",
        userId,
        serviceId: "srv-fea-002",
        projectId: "proj-005",
        description: "Technical feasibility for a SaaS startup in healthcare.",
        status: "pending",
        createdAt: "2025-05-18T15:10:00Z",
      },
      {
        id: "req-009",
        userId,
        serviceId: "srv-fin-003",
        projectId: "proj-006",
        description: "Risk assessment for a high-value investment in logistics.",
        status: "in-progress",
        createdAt: "2025-05-17T12:00:00Z",
      },
      {
        id: "req-010",
        userId,
        serviceId: "srv-leg-003",
        projectId: null,
        description: "Compliance consultation for foreign investment in Algeria’s energy sector.",
        status: "rejected",
        createdAt: "2025-05-16T17:25:00Z",
      },
      {
        id: "req-011",
        userId,
        serviceId: "srv-isl-003",
        projectId: "proj-007",
        description: "Advisory on Sukuk issuance for a real estate project.",
        status: "completed",
        createdAt: "2025-05-15T10:40:00Z",
      },
      {
        id: "req-012",
        userId,
        serviceId: "srv-fea-003",
        projectId: "proj-008",
        description: "Sustainability analysis for an agricultural expansion project.",
        status: "pending",
        createdAt: "2025-05-14T14:55:00Z",
      },
      {
        id: "req-013",
        userId,
        serviceId: "srv-fin-001",
        projectId: null,
        description: "Financial projections for a retail chain expansion.",
        status: "in-progress",
        createdAt: "2025-05-13T09:05:00Z",
      },
      {
        id: "req-014",
        userId,
        serviceId: "srv-leg-001",
        projectId: "proj-009",
        description: "Legal review for a commercial property lease agreement.",
        status: "completed",
        createdAt: "2025-05-12T16:30:00Z",
      },
      {
        id: "req-015",
        userId,
        serviceId: "srv-isl-001",
        projectId: "proj-010",
        description: "Sharia-compliant investment advice for a tech venture.",
        status: "pending",
        createdAt: "2025-05-11T11:15:00Z",
      },
      {
        id: "req-016",
        userId,
        serviceId: "srv-fea-001",
        projectId: null,
        description: "Market analysis for a new hospitality project.",
        status: "rejected",
        createdAt: "2025-05-10T13:45:00Z",
      },
      {
        id: "req-017",
        userId,
        serviceId: "srv-fin-002",
        projectId: "proj-011",
        description: "Cost optimization for a manufacturing plant upgrade.",
        status: "in-progress",
        createdAt: "2025-05-09T08:20:00Z",
      },
      {
        id: "req-018",
        userId,
        serviceId: "srv-leg-002",
        projectId: "proj-012",
        description: "Partnership agreement for a renewable energy project.",
        status: "completed",
        createdAt: "2025-05-08T15:00:00Z",
      },
      {
        id: "req-019",
        userId,
        serviceId: "srv-isl-002",
        projectId: null,
        description: "Islamic finance audit for a personal investment portfolio.",
        status: "pending",
        createdAt: "2025-05-07T10:35:00Z",
      },
      {
        id: "req-020",
        userId,
        serviceId: "srv-fea-002",
        projectId: "proj-013",
        description: "Technical feasibility for an e-commerce platform.",
        status: "in-progress",
        createdAt: "2025-05-06T12:50:00Z",
      },
      {
        id: "req-021",
        userId,
        serviceId: "srv-fin-003",
        projectId: "proj-014",
        description: "Risk assessment for an infrastructure investment.",
        status: "completed",
        createdAt: "2025-05-05T14:10:00Z",
      },
      {
        id: "req-022",
        userId,
        serviceId: "srv-leg-003",
        projectId: null,
        description: "Regulatory advice for a foreign investment in tourism.",
        status: "rejected",
        createdAt: "2025-05-04T09:25:00Z",
      },
      {
        id: "req-023",
        userId,
        serviceId: "srv-isl-003",
        projectId: "proj-015",
        description: "Sukuk structuring for a commercial development.",
        status: "pending",
        createdAt: "2025-05-03T16:40:00Z",
      },
      {
        id: "req-024",
        userId,
        serviceId: "srv-fea-003",
        projectId: "proj-016",
        description: "Environmental analysis for a solar energy project.",
        status: "in-progress",
        createdAt: "2025-05-02T11:55:00Z",
      },
      {
        id: "req-025",
        userId,
        serviceId: "srv-fin-001",
        projectId: null,
        description: "Financial planning for a diversified investment portfolio.",
        status: "completed",
        createdAt: "2025-05-01T13:30:00Z",
      },
    ]
    return {
      data: requests.slice((page - 1) * requestsPerPage, page * requestsPerPage),
      total: requests.length,
    }
  },
  addServiceRequest: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true, id: `req-${Date.now()}` }
  },
}

function PaginationWrapper({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const maxVisiblePages = 5

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | "ellipsis")[] = []
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push("ellipsis")
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("ellipsis")
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page as number)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function ServiceCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4 mt-4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

function RequestCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export default function ServicesPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { services, userServiceRequests, addServiceRequest, isLoading } = useServices()
  const { userProjects } = useProjects()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "available")
  const [selectedService, setSelectedService] = useState<string | null>(searchParams.get("serviceId") || null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"))
  const [totalRequests, setTotalRequests] = useState(0)
  const requestsPerPage = 5

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: searchParams.get("serviceId") || "",
      projectId: searchParams.get("projectId") || "",
      description: searchParams.get("description") || "",
      files: [],
    },
  })

  // Update URL with state
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (activeTab !== "available") params.set("tab", activeTab)
    if (selectedService) params.set("serviceId", selectedService)
    const projectId = form.getValues("projectId")
    if (projectId !== undefined) params.set("projectId", projectId)
    if (form.getValues("description")) params.set("description", form.getValues("description"))
    if (currentPage !== 1) params.set("page", currentPage.toString())
    router.replace(`/dashboard/services?${params.toString()}`, { scroll: false })
  }, [activeTab, selectedService, form, currentPage, router])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  // Fetch service requests with pagination
  const fetchRequests = useCallback(
    async (page: number) => {
      if (!user) return
      try {
        const response = await mockApi.fetchUserRequests(user.id, page)
        setTotalRequests(response.total)
        // Assuming useServices updates userServiceRequests
      } catch (error) {
        console.error("Error fetching requests:", error)
        toast({
          title: t("errors.fetchFailed"),
          description: t("errors.tryAgain"),
          variant: "destructive",
        })
      }
    },
    [user, t],
  )

  useEffect(() => {
    if (activeTab === "my-requests") {
      fetchRequests(currentPage)
    }
  }, [activeTab, currentPage, fetchRequests])

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const isProjectOwner = user.userType === "project-owner"
  const isInvestor = user.userType === "investor"
  const isConsultant = user.userType === "consultant"

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    form.setValue("serviceId", serviceId)
    setActiveTab("request")
    updateUrl()
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await mockApi.addServiceRequest({
        userId: user!.id,
        serviceId: values.serviceId,
        projectId: values.projectId || undefined,
        description: values.description,
        files: values.files || [],
      })

      if (response.success) {
        setSubmitSuccess(true)
        form.reset()
        setSelectedService(null)
        toast({
          title: t("services.requestSubmitted"),
          description: t("services.requestSuccess"),
        })
      }
    } catch (error) {
      console.error("Failed to submit service request:", error)
      toast({
        title: t("errors.submitFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getServiceTypeIcon = (type: ServiceType) => {
    switch (type) {
      case "financial":
        return <DollarSign className="h-10 w-10 text-green-600" />
      case "legal":
        return <FileText className="h-10 w-10 text-green-600" />
      case "islamic":
        return <FileText className="h-10 w-10 text-green-600" />
      case "feasibility":
        return <Check className="h-10 w-10 text-green-600" />
      default:
        return <FileText className="h-10 w-10 text-green-600" />
    }
  }

  return (
    <div className="space-y-6 container py-12" dir={rtl ? "rtl" : "ltr"}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("dashboard.services")}
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          {isProjectOwner && t("services.projectOwnerDesc")}
          {isInvestor && t("services.investorDesc")}
          {isConsultant && t("services.consultantDesc")}
        </p>
      </motion.div>

      {(isProjectOwner || isInvestor) && (
        <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-background/90 backdrop-blur-sm border-primary/30 rounded-full p-2">
            <TabsTrigger
              value="available"
              className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
            >
              {t("services.availableServices")}
            </TabsTrigger>
            <TabsTrigger
              value="request"
              className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
            >
              {t("services.requestService")}
            </TabsTrigger>
            <TabsTrigger
              value="my-requests"
              className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground hover:bg-primary/10"
            >
              {t("services.myRequests")}
              {userServiceRequests.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-gradient-to-r from-primary/80 to-secondary/80 text-white"
                >
                  {userServiceRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-4">
            {isLoading ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <ServiceCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : services.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">{t("services.noServices")}</p>
                  <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                    <Link href="/contact">{t("services.contactSupport")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {services.map((service) => (
                  <motion.div key={service.id} variants={fadeInUp}>
                    <Card className="flex flex-col bg-background/90 backdrop-blur-sm border-primary/30 hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-shrink-0">{getServiceTypeIcon(service.type)}</div>
                          <div className="text-right">
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {service.price.toLocaleString()} {t("common.currency")}
                            </span>
                          </div>
                        </div>
                        <CardTitle className="mt-4">{t(`services.${service.type}`)}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <Badge variant="outline" className="capitalize bg-primary/10 text-primary">
                          {t(`services.${service.type}`)}
                        </Badge>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 rounded-full"
                          onClick={() => handleServiceSelect(service.id)}
                          aria-label={t("services.requestService")}
                        >
                          {t("services.requestService")}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="request" className="mt-4">
            <Card className="bg-background/90 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t("services.requestConsulting")}
                </CardTitle>
                <CardDescription>{t("services.requestDetails")}</CardDescription>
              </CardHeader>
              <CardContent>
                {submitSuccess ? (
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center py-6"
                  >
                    <h3 className="text-xl font-bold text-green-600 mb-2">{t("services.requestSubmitted")}</h3>
                    <p className="mb-4 text-muted-foreground">{t("services.requestSuccess")}</p>
                    <Button
                      onClick={() => {
                        setSubmitSuccess(false)
                        setActiveTab("my-requests")
                        updateUrl()
                      }}
                      className="bg-green-600 hover:bg-green-700 rounded-full"
                      aria-label={t("services.viewRequests")}
                    >
                      {t("services.viewRequests")}
                    </Button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("services.serviceType")}</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                setSelectedService(value)
                                updateUrl()
                              }}
                              value={field.value || selectedService || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-background/90 border-primary/30 hover:bg-primary/10 rounded-full">
                                  <SelectValue placeholder={t("services.selectService")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background/90 backdrop-blur-sm border-primary/30">
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {t(`services.${service.type}`)} - {service.price.toLocaleString()} {t("common.currency")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(isProjectOwner || isInvestor) && userProjects.length > 0 && (
                        <FormField
                          control={form.control}
                          name="projectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("services.relatedProject")}</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  updateUrl()
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-background/90 border-primary/30 hover:bg-primary/10 rounded-full">
                                    <SelectValue placeholder={t("services.selectProject")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background/90 backdrop-blur-sm border-primary/30">
                                  <SelectItem value="none">{t("common.none")}</SelectItem>
                                  {userProjects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                      {project.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("services.description")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("services.descriptionPlaceholder")}
                                className="min-h-32 bg-background/90 border-primary/30"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  updateUrl()
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("services.attachments")}</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                multiple
                                className="cursor-pointer bg-background/90 border-primary/30"
                                onChange={(e) => field.onChange(e.target.files ? Array.from(e.target.files) : [])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 rounded-full"
                        disabled={isLoading}
                        aria-label={t("services.submitRequest")}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("common.submitting")}
                          </>
                        ) : (
                          t("services.submitRequest")
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-requests" className="mt-4">
            {isLoading ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid gap-4"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <RequestCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : userServiceRequests.length === 0 ? (
              <Card className="bg-background/90 backdrop-blur-sm border-primary/30">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">{t("services.noRequests")}</p>
                  <Button
                    onClick={() => {
                      setActiveTab("available")
                      updateUrl()
                    }}
                    className="mt-4 bg-green-600 hover:bg-green-700 rounded-full"
                    aria-label={t("services.browseServices")}
                  >
                    {t("services.browseServices")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-4"
              >
                {userServiceRequests.map((request) => {
                  const service = services.find((s) => s.id === request.serviceId)
                  if (!service) return null

                  return (
                    <motion.div key={request.id} variants={fadeInUp}>
                      <Card className="bg-background/90 backdrop-blur-sm border-primary/30 hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{t(`services.${service.type}`)}</CardTitle>
                              <CardDescription>
                                {t("services.requestedOn")} {new Date(request.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className={cn(getStatusColor(request.status))}>
                              {t(`services.${request.status}`)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {t("services.price")}: {service.price.toLocaleString()} {t("common.currency")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {t("services.status")}: {t(`services.${request.status}`)}
                              </span>
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <h4 className="text-sm font-medium mb-1">{t("services.description")}:</h4>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full rounded-full border-primary/30 hover:bg-primary/10"
                            aria-label={t("project.viewDetails")}
                          >
                            <Link href={`/dashboard/services/${request.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("project.viewDetails")}
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )
                })}
                <PaginationWrapper
                  totalItems={totalRequests}
                  itemsPerPage={requestsPerPage}
                  currentPage={currentPage}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    updateUrl()
                  }}
                />
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {isConsultant && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("services.myServices")}
              </CardTitle>
              <CardDescription>{t("services.manageServices")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services
                  .filter((s) => s.consultantId === user.id)
                  .map((service) => (
                    <motion.div
                      key={service.id}
                      variants={fadeInUp}
                      className="flex items-center justify-between p-4 border rounded-lg bg-background/90"
                    >
                      <div>
                        <h3 className="font-medium">{t(`services.${service.type}`)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.price.toLocaleString()} {t("common.currency")} {t("services.price")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          aria-label={t("common.edit")}
                          onClick={() => router.push(`/dashboard/services/edit/${service.id}`)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Badge className="bg-green-600">{t("common.active")}</Badge>
                      </div>
                    </motion.div>
                  ))}
              </div>

              <Button
                className="mt-6 bg-green-600 hover:bg-green-700 rounded-full"
                onClick={() => router.push("/dashboard/services/create")}
                aria-label={t("services.addNewService")}
              >
                {t("services.addNewService")}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-background/90 backdrop-blur-sm border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("services.serviceStatistics")}
              </CardTitle>
              <CardDescription>{t("services.serviceOverview")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div variants={fadeInUp} className="p-4 border rounded-lg text-center bg-background/90">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("services.completed")}</h3>
                  <p className="text-3xl font-bold mt-1">12</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 border rounded-lg text-center bg-background/90">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("services.inProgress")}</h3>
                  <p className="text-3xl font-bold mt-1">3</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 border rounded-lg text-center bg-background/90">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("services.totalEarnings")}</h3>
                  <p className="text-3xl font-bold mt-1">720,000 {t("common.currency")}</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}