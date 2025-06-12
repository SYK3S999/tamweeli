"use client"

import { useState, useEffect, useCallback, useMemo, MouseEvent, SetStateAction } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { Search, Filter, X, Calendar, TrendingUp, Bookmark, Loader2, ArrowRight, ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { debounce } from "lodash"
import { Pagination, PaginationContent,  PaginationLink, PaginationNext, PaginationPrevious, PaginationItem, PaginationEllipsis } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import {  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"
import { Label } from "recharts"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
}

// Mock data
const mockProjects = [
  {
    id: "proj-1",
    name: "tamweeli Water Purification",
    description: "Revolutionary nano-filtration technology bringing clean water to 10M+ people in rural areas across Africa and Asia.",
    sector: "healthcare",
    contractType: "murabaha",
    amount: 500000,
    status: "approved",
    trending: true,
    isNew: true,
    createdAt: "2025-05-15T00:00:00Z",
    ownerId: "owner-1",
    images: ["/water.jpg"],
    fundingRaised: 435000,
    returnRate: 0.10,
    deadline: "2025-06-14T00:00:00Z",
    investorsCount: 1247,
    progress: 87,
    target: 500000,
    backers: 1247,
    daysLeft: 15,
    featured: true,
  },
  {
    id: "proj-2",
    name: "Tech4Education AI Platform",
    description: "Personalized AI-driven learning platform that adapts to individual student needs, improving learning outcomes by 300%.",
    sector: "education",
    contractType: "musharaka",
    amount: 750000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-10T00:00:00Z",
    ownerId: "owner-2",
    images: ["/education.jpg"],
    fundingRaised: 540000,
    returnRate: 0.12,
    deadline: "2025-06-22T00:00:00Z",
    investorsCount: 892,
    progress: 72,
    target: 750000,
    backers: 892,
    daysLeft: 23,
    featured: true,
  },
  {
    id: "proj-3",
    name: "HealthConnect Telemedicine",
    description: "Comprehensive telemedicine platform connecting rural patients with specialists, reducing healthcare costs by 60%.",
    sector: "healthcare",
    contractType: "mudaraba",
    amount: 300000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-05-01T00:00:00Z",
    ownerId: "owner-3",
    images: ["/health.jpg"],
    fundingRaised: 282000,
    returnRate: 0.08,
    deadline: "2025-06-07T00:00:00Z",
    investorsCount: 567,
    progress: 94,
    target: 300000,
    backers: 567,
    daysLeft: 8,
    featured: true,
  },
  {
    id: "proj-4",
    name: "GreenEnergy Solar Grid",
    description: "Decentralized solar energy network providing clean electricity to remote communities while generating passive income.",
    sector: "technology",
    contractType: "murabaha",
    amount: 1200000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-04-25T00:00:00Z",
    ownerId: "owner-4",
    images: ["/solar.jpg"],
    fundingRaised: 816000,
    returnRate: 0.09,
    deadline: "2025-06-30T00:00:00Z",
    investorsCount: 2134,
    progress: 68,
    target: 1200000,
    backers: 2134,
    daysLeft: 31,
    featured: true,
  },
  {
    id: "proj-5",
    name: "Halal Food Startup",
    description: "Expanding a chain of Sharia-compliant restaurants across urban centers.",
    sector: "retail",
    contractType: "musharaka",
    amount: 400000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-04-15T00:00:00Z",
    ownerId: "owner-5",
    images: ["/restaurant.jpg"],
    fundingRaised: 320000,
    returnRate: 0.11,
    deadline: "2025-07-15T00:00:00Z",
    investorsCount: 450,
    progress: 80,
    target: 400000,
    backers: 450,
    daysLeft: 46,
    featured: false,
  },
  {
    id: "proj-6",
    name: "Islamic Fintech App",
    description: "Mobile app for Sharia-compliant financial services and investments.",
    sector: "technology",
    contractType: "mudaraba",
    amount: 600000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-20T00:00:00Z",
    ownerId: "owner-6",
    images: ["/fintech.jpg"],
    fundingRaised: 420000,
    returnRate: 0.10,
    deadline: "2025-08-01T00:00:00Z",
    investorsCount: 780,
    progress: 70,
    target: 600000,
    backers: 780,
    daysLeft: 63,
    featured: false,
  },
  {
    id: "proj-7",
    name: "Organic Farm Co-op",
    description: "Supporting local farmers with organic produce markets and distribution.",
    sector: "agriculture",
    contractType: "murabaha",
    amount: 250000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-03-30T00:00:00Z",
    ownerId: "owner-7",
    images: ["/farm.jpg"],
    fundingRaised: 200000,
    returnRate: 0.07,
    deadline: "2025-06-30T00:00:00Z",
    investorsCount: 300,
    progress: 80,
    target: 250000,
    backers: 300,
    daysLeft: 31,
    featured: false,
  },
  {
    id: "proj-8",
    name: "Eco-Friendly Housing",
    description: "Sustainable housing for low-income families using recycled materials.",
    sector: "real-estate",
    contractType: "musharaka",
    amount: 800000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-05T00:00:00Z",
    ownerId: "owner-8",
    images: ["/housing.jpg"],
    fundingRaised: 560000,
    returnRate: 0.09,
    deadline: "2025-09-01T00:00:00Z",
    investorsCount: 650,
    progress: 70,
    target: 800000,
    backers: 650,
    daysLeft: 94,
    featured: false,
  },
  {
    id: "proj-9",
    name: "Healthcare Clinic",
    description: "Community clinic offering affordable healthcare in underserved areas.",
    sector: "healthcare",
    contractType: "mudaraba",
    amount: 350000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-04-10T00:00:00Z",
    ownerId: "owner-9",
    images: ["/clinic.jpg"],
    fundingRaised: 280000,
    returnRate: 0.08,
    deadline: "2025-07-10T00:00:00Z",
    investorsCount: 400,
    progress: 80,
    target: 350000,
    backers: 400,
    daysLeft: 41,
    featured: false,
  },
  {
    id: "proj-10",
    name: "Sustainable Fashion",
    description: "Ethical clothing line using eco-friendly materials and fair labor.",
    sector: "retail",
    contractType: "murabaha",
    amount: 200000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-25T00:00:00Z",
    ownerId: "owner-10",
    images: ["/fashion.jpg"],
    fundingRaised: 140000,
    returnRate: 0.10,
    deadline: "2025-08-25T00:00:00Z",
    investorsCount: 250,
    progress: 70,
    target: 200000,
    backers: 250,
    daysLeft: 87,
    featured: false,
  },
  {
    id: "proj-11",
    name: "WaterTech Irrigation",
    description: "Advanced irrigation systems for sustainable agriculture.",
    sector: "agriculture",
    contractType: "musharaka",
    amount: 450000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-03-20T00:00:00Z",
    ownerId: "owner-11",
    images: ["/irrigation.jpg"],
    fundingRaised: 360000,
    returnRate: 0.09,
    deadline: "2025-06-20T00:00:00Z",
    investorsCount: 500,
    progress: 80,
    target: 450000,
    backers: 500,
    daysLeft: 21,
    featured: false,
  },
  {
    id: "proj-12",
    name: "SmartCity Infrastructure",
    description: "IoT-based infrastructure for efficient urban management.",
    sector: "technology",
    contractType: "mudaraba",
    amount: 1500000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-25T00:00:00Z",
    ownerId: "owner-12",
    images: ["/smartcity.jpg"],
    fundingRaised: 900000,
    returnRate: 0.11,
    deadline: "2025-09-30T00:00:00Z",
    investorsCount: 1200,
    progress: 60,
    target: 1500000,
    backers: 1200,
    daysLeft: 123,
    featured: false,
  },
  {
    id: "proj-13",
    name: "EdTech Coding Bootcamp",
    description: "Online bootcamp teaching coding skills to youth.",
    sector: "education",
    contractType: "murabaha",
    amount: 300000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-03-15T00:00:00Z",
    ownerId: "owner-13",
    images: ["/coding.jpg"],
    fundingRaised: 240000,
    returnRate: 0.08,
    deadline: "2025-06:15T00:00:00Z",
    investorsCount: 350,
    progress: 80,
    target: 300000,
    backers: 350,
    daysLeft: 16,
    featured: false,
  },
  {
    id: "proj-14",
    name: "RetailTech POS System",
    description: "Point-of-sale system for small retail businesses.",
    sector: "retail",
    contractType: "musharaka",
    amount: 200000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-20T00:00:00Z",
    ownerId: "owner-14",
    images: ["/pos.jpg"],
    fundingRaised: 140000,
    returnRate: 0.10,
    deadline: "2025-08-20T00:00:00Z",
    investorsCount: 300,
    progress: 70,
    target: 200000,
    backers: 300,
    daysLeft: 82,
    featured: false,
  },
  {
    id: "proj-15",
    name: "Healthcare Diagnostics",
    description: "AI-powered diagnostic tool for early disease detection.",
    sector: "healthcare",
    contractType: "mudaraba",
    amount: 700000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-04-01T00:00:00Z",
    ownerId: "owner-15",
    images: ["/diagnostics.jpg"],
    fundingRaised: 490000,
    returnRate: 0.09,
    deadline: "2025-07-01T00:00:00Z",
    investorsCount: 800,
    progress: 70,
    target: 700000,
    backers: 800,
    daysLeft: 32,
    featured: false,
  },
  {
    id: "proj-16",
    name: "AgriTech Greenhouse",
    description: "Automated greenhouse for year-round crop production.",
    sector: "agriculture",
    contractType: "murabaha",
    amount: 500000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-15T00:00:00Z",
    ownerId: "owner-16",
    images: ["/greenhouse.jpg"],
    fundingRaised: 400000,
    returnRate: 0.08,
    deadline: "2025-08-15T00:00:00Z",
    investorsCount: 600,
    progress: 80,
    target: 500000,
    backers: 600,
    daysLeft: 77,
    featured: false,
  },
  {
    id: "proj-17",
    name: "RealEstate Co-housing",
    description: "Co-housing communities for sustainable urban living.",
    sector: "real-estate",
    contractType: "musharaka",
    amount: 900000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-03-10T00:00:00Z",
    ownerId: "owner-17",
    images: ["/cohousing.jpg"],
    fundingRaised: 630000,
    returnRate: 0.10,
    deadline: "2025-06-10T00:00:00Z",
    investorsCount: 950,
    progress: 70,
    target: 900000,
    backers: 10,
    daysLeft: 11,
    featured: false,
  },
  {
    id: "proj-18",
    name: "Tech Startup Incubator",
    description: "Incubator for tech startups with Sharia-compliant funding.",
    sector: "technology",
    contractType: "mudaraba",
    amount: 800000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-25T00:00:00Z",
    ownerId: "owner-18",
    images: ["/incubator.jpg"],
    fundingRaised: 560000,
    returnRate: 0.11,
    deadline: "2025-09-25T00:00:00Z",
    investorsCount: 1100,
    progress: 70,
    target: 800000,
    backers: 1100,
    daysLeft: 118,
    featured: true,
  },
  {
    id: "proj-19",
    name: "Education VR Lab",
    description: "Virtual reality labs for immersive STEM education.",
    sector: "education",
    contractType: "murabaha",
    amount: 400000,
    status: "approved",
    trending: true,
    isNew: false,
    createdAt: "2025-04-05T00:00:00Z",
    ownerId: "owner-19",
    images: ["/vr.jpg"],
    fundingRaised: 320000,
    returnRate: 0.09,
    deadline: "2025-07-05T00:00:00Z",
    investorsCount: 500,
    progress: 80,
    target: 400000,
    backers: 500,
    daysLeft: 36,
    featured: false,
  },
  {
    id: "proj-20",
    name: "Retail Eco-Store",
    description: "Eco-friendly retail store for sustainable products.",
    sector: "retail",
    contractType: "musharaka",
    amount: 300000,
    status: "approved",
    trending: false,
    isNew: true,
    createdAt: "2025-05-20T00:00:00Z",
    ownerId: "owner-20",
    images: ["/ecostore.jpg"],
    fundingRaised: 210000,
    returnRate: 0.10,
    deadline: "2025-08-20T00:00:00Z",
    investorsCount: 400,
    progress: 70,
    target: 300000,
    backers: 400,
    daysLeft: 82,
    featured: false,
  },
]
const mockSavedProjects = ["proj-1", "proj-3", "proj-5"]

export default function ProjectsPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex min-h-screen flex-col bg-gray-100">
        <Navbar />
        <ProjectsPageContent />
        <Footer />
      </div>
    </AuthProvider>
  )
}

type PaginationWrapperProps = {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

function PaginationWrapper({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationWrapperProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const maxVisiblePages = 5

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages = [];
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
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={`rounded-lg px-4 py-2 bg-white border-green-500/30 hover:bg-green-600/10 transition-all duration-200 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={index}>
              <PaginationEllipsis className="text-green-600" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${currentPage === page ? "bg-green-500 text-white hover:bg-green-600" : "bg-white border-gray-200 hover:bg-green-100"}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={`rounded-lg px-4 py-2 bg-white border-gray-200/30 hover:bg-green-100 transition-all duration-200 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function ProjectCardSkeleton() {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-40 w-full rounded-md bg-gray-100" />
        <Skeleton className="h-5 w-3/4 bg-gray-100" />
        <Skeleton className="h-3 w-full bg-gray-100" />
        <Skeleton className="h-3 w-5/6 bg-gray-100" />
        <div className="flex justify-between">
          <Skeleton className="h-7 w-20 bg-gray-100" />
          <Skeleton className="h-7 w-7 rounded-full bg-gray-100" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectsPageContent() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedSector, setSelectedSector] = useState(searchParams.get("sector") || "all")
  const [selectedContractType, setSelectedContractType] = useState(searchParams.get("contractType") || "all")
  const [amountRange, setAmountRange] = useState([
    parseInt(searchParams.get("minAmount") || "0"),
    parseInt(searchParams.get("maxAmount") || "2000000"),
  ])
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "date-desc")
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all")
  const [isLoading, setIsLoading] = useState(true)
  const [savedProjects, setSavedProjects] = useState(mockSavedProjects)
  const [filtersApplied, setFiltersApplied] = useState(0)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"))
  const projectsPerPage = 9

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedSector !== "all") params.set("sector", selectedSector)
    if (selectedContractType !== "all") params.set("contractType", selectedContractType)
    if (amountRange[0] > 0) params.set("minAmount", amountRange[0].toString())
    if (amountRange[1] < 2000000) params.set("maxAmount", amountRange[1].toString())
    if (sortBy !== "date-desc") params.set("sortBy", sortBy)
    if (activeTab !== "all") params.set("tab", activeTab)
    if (currentPage !== 1) params.set("page", currentPage.toString())
    router.replace(`/projects?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    updateUrl()
  }, [searchTerm, selectedSector, selectedContractType, amountRange, sortBy, activeTab, currentPage])

  const maxProjectAmount = Math.max(...mockProjects.map((p) => p.amount || 0), 2000000)

  const approvedProjects = mockProjects.filter((p) => p.status === "approved")

  const filteredProjects = approvedProjects
    .filter((p) => {
      const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSector = selectedSector === "all" || p.sector === selectedSector
      const matchesContractType = selectedContractType === "all" || p.contractType === selectedContractType
      const matchesAmount = p.amount >= amountRange[0] && p.amount <= amountRange[1]
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "saved" && savedProjects.includes(p.id)) ||
        (activeTab === "trending" && p.trending) ||
        (activeTab === "new" && p.isNew)
      return matchesSearch && matchesSector && matchesContractType && matchesAmount && matchesTab
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "amount-desc") return b.amount - a.amount
      if (sortBy === "amount-asc") return a.amount - b.amount
      return 0
    })

  const paginatedProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)

  const toggleSaveProject = (projectId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated) {
      toast({
        title: t("auth.required"),
        description: t("auth.loginToSave"),
        action: <Link href="/auth/login" className="text-green-600 underline">{t("auth.login")}</Link>,
      })
      return
    }
    const isSaved = savedProjects.includes(projectId)
    setSavedProjects((prev) => isSaved ? prev.filter((id) => id !== projectId) : [...prev, projectId])
    toast({
      title: isSaved ? t("projects.unsaved") : t("projects.saved"),
      description: isSaved ? t("projects.unsavedDesc") : t("projects.savedDesc"),
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedSector("all")
    setSelectedContractType("all")
    setAmountRange([0, maxProjectAmount])
    setSortBy("date-desc")
    setActiveTab("all")
    setCurrentPage(1)
    setFiltersApplied(0)
    toast({
      title: t("filters.resetSuccess"),
      description: t("filters.resetAll"),
    })
  }

  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedSector !== "all") count++
    if (selectedContractType !== "all") count++
    if (amountRange[0] > 0 || amountRange[1] < maxProjectAmount) count++
    if (sortBy !== "date-desc") count++
    setFiltersApplied(count)
  }, [searchTerm, selectedSector, selectedContractType, amountRange, sortBy, maxProjectAmount])

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  const sectors = [
    { value: "all", label: t("sectors.all") },
    { value: "technology", label: t("sectors.technology") },
    { value: "agriculture", label: t("sectors.agriculture") },
    { value: "real-estate", label: t("sectors.realEstate") },
    { value: "education", label: t("sectors.education") },
    { value: "healthcare", label: t("sectors.healthcare") },
    { value: "retail", label: t("sectors.retail") },
  ]

  const contractTypes = [
    { value: "all", label: t("contractTypes.all") },
    { value: "murabaha", label: t("contractTypes.murabaha") },
    { value: "musharaka", label: t("contractTypes.musharaka") },
    { value: "mudaraba", label: t("contractTypes.mudaraba") },
  ]

  const sortOptions = [
    { value: "date-desc", label: t("sort.dateDesc") },
    { value: "amount-desc", label: t("sort.amountDesc") },
    { value: "amount-asc", label: t("sort.amountAsc") },
  ]

  const featuredProjects = mockProjects.filter((p) => p.featured).slice(0, 4)

  const filterForm = (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-4 p-4 bg-white rounded-lg"
    >
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.sector.label")}</Label>
        <Select value={selectedSector} onValueChange={(value) => { setSelectedSector(value); setCurrentPage(1) }}>
          <SelectTrigger className="w-full border-gray-300 rounded-lg">
            <SelectValue placeholder={t("filters.sector.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.contractType")}</Label>
        <Select value={selectedContractType} onValueChange={(value) => { setSelectedContractType(value); setCurrentPage(1) }}>
          <SelectTrigger className="w-full border-gray-300 rounded-lg">
            <SelectValue placeholder={t("filters.contractType.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.amount.label")}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatCurrency(amountRange[0], t)}</span>
                <span>{formatCurrency(amountRange[1], t)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("filters.amountRange.tooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Slider
          min={0}
          max={maxProjectAmount}
          step={10000}
          value={amountRange}
          onValueChange={(value: number[]) => { setAmountRange(value); setCurrentPage(1) }}
          className="mt-2"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.sortBy.label")}</Label>
        <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1) }}>
          <SelectTrigger className="w-full border-gray-300 rounded-lg">
            <SelectValue placeholder={t("filters.sortBy.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="bg-gray-100 p-3 text-center">
        <p className="text-sm text-gray-600">{t("FiltersApplied")}</p>
      </Card>
    </motion.div>
  )

  return (
    <main className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("nav.projects")}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t("projects.browseDescription")}</p>
            {isAuthenticated && user?.userType === "project-owner" && (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/projects/create">{t("project.create")}</Link>
            </Button>
            )}
        </motion.div>

        {/* Featured Projects */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t("projects.featured")}</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                whileHover="hover"
                onClick={() => handleProjectClick(project.id)}
                className="cursor-pointer"
              >
                <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border-green-600/20">
                  <CardHeader className="p-0">
                    <div className="relative h-40">
                      <img src={project.images[0] || "/placeholder.jpg"} alt={project.name} className="h-full w-full object-cover rounded-t-lg" />
                      {project.featured && (
                        <Badge className="absolute top-2 right-2 bg-blue-500 text-white">{t("Featured")}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{formatCurrency(project.fundingRaised, t)}</span>
                        <span>{project.progress}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{project.daysLeft} {t("daysLeft")}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleSaveProject(project.id, e)}
                        aria-label={savedProjects.includes(project.id) ? t("projects.unsave") : t("projects.save")}
                      >
                        <Bookmark className={`h-4 text-green-600 ${savedProjects.includes(project.id) ? "fill-green-500" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Filter Bar */}
        <motion.div
          className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="pl-10 pr-2 w-full rounded-md border-gray-300"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => { setSearchTerm(""); setCurrentPage(1) }}
                  aria-label={t("clearSearch")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1) }}>
                <SelectTrigger className="w-full md:w-40 text-sm">
                  <SelectValue placeholder={t("Sort By")} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto text-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("Filters")} {filtersApplied > 0 && <Badge className="ml-2 bg-green-100 text-green-800">{filtersApplied}</Badge>}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={rtl ? "right" : "left"}
                  className="w-[90vw] sm:min-w-[400px] bg-white dark:bg-gray-800"
                >
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-white">{t("filters.title")}</SheetTitle>
                    <SheetDescription className="text-gray-600 dark:text-gray-400">{t("filters.description")}</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">{filterForm}</div>
                  <SheetFooter>
                    <Button variant="outline" onClick={resetFilters} className="w-full mr-2">
                      {t("filters.reset")}
                    </Button>
                    <SheetClose asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">{t("filters.apply")}</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentPage(1) }} className="mt-4">
            <TabsList className="bg-gray-100 dark:bg-gray-700 rounded-md">
              <TabsTrigger value="all" className="text-sm">
                {t("tabs.all")} <Badge className="ml-2 bg-green-100 text-green-800">{approvedProjects.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-sm">
                <TrendingUp className="h-4 w-4 mr-1" /> {t("tabs.trending")} <Badge className="ml-2 bg-green-100 text-green-800">{approvedProjects.filter(p => p.trending).length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="new" className="text-sm">
                <Calendar className="h-4 w-4 mr-1" /> {t("tabs.new")} <Badge className="ml-2 bg-green-100 text-green-800">{approvedProjects.filter(p => p.isNew).length}</Badge>
              </TabsTrigger>
              {isAuthenticated && (
                <TabsTrigger value="saved" className="text-sm">
                  <Bookmark className="h-4 w-4 mr-1" /> {t("tabs.saved")} <Badge className="ml-2 bg-green-100 text-green-800">{savedProjects.length}</Badge>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Project Grid */}
        {isLoading ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <ProjectCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : paginatedProjects.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center py-12"
          >
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("filters.noResults")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t("filters.tryAdjusting")}</p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  {t("filters.resetAll")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={{ ...fadeInUp, ...cardHover }}
                whileHover="hover"
                onClick={() => handleProjectClick(project.id)}
                className="cursor-pointer"
              >
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border-green-600/20">
                  <CardHeader className="p-0">
                    <div className="relative h-40">
                      <img src={project.images[0] || "/placeholder.jpg"} alt={project.name} className="h-full w-full object-cover rounded-t-md" />
                      {project.trending && <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">{t("Trending")}</Badge>}
                      {project.isNew && <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">{t("New")}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{formatCurrency(project.fundingRaised, t)}</span>
                        <span>{project.progress}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{project.daysLeft} {t("daysLeft")}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleSaveProject(project.id, e)}
                        aria-label={savedProjects.includes(project.id) ? t("projects.unsave") : t("projects.save")}
                      >
                        <Bookmark className={`h-4 text-green-600 ${savedProjects.includes(project.id) ? "fill-green-500" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredProjects.length > projectsPerPage && (
          <motion.div variants={fadeInUp} className="mt-8">
            <PaginationWrapper
              totalItems={filteredProjects.length}
              itemsPerPage={projectsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </div>
    </main>
  )
}