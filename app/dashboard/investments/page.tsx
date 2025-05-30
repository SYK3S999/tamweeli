"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Building, Calendar, DollarSign, Eye, Filter, Search, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { mockProjects, mockInvestments } from "./mock-data"

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function InvestmentsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const projects = mockProjects // Mock data for demo
  const userInvestments = mockInvestments // Mock data for demo
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [activeTab, setActiveTab] = useState("active")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // Check if user is investor
  if (!user || user.userType !== "investor") {
    router.push("/dashboard")
    return null
  }

  // Filter and sort investments
  const filteredInvestments = userInvestments.filter((investment) => {
    const project = projects.find((p) => p.id === investment.projectId)
    const matchesSearch = project
      ? project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : false
    const matchesStatus = statusFilter === "all" || investment.status === statusFilter
    const matchesTab =
      (activeTab === "active" && ["pending", "accepted"].includes(investment.status)) ||
      (activeTab === "completed" && investment.status === "completed") ||
      (activeTab === "rejected" && investment.status === "rejected")
    return matchesSearch && matchesStatus && matchesTab
  }).sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "date-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortBy === "amount-desc") return (b.amount || 0) - (a.amount || 0)
    if (sortBy === "amount-asc") return (a.amount || 0) - (b.amount || 0)
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(filteredInvestments.length / itemsPerPage)
  const paginatedInvestments = filteredInvestments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Tab counts
  const tabCounts = {
    active: userInvestments.filter((i) => ["pending", "accepted"].includes(i.status)).length,
    completed: userInvestments.filter((i) => i.status === "completed").length,
    rejected: userInvestments.filter((i) => i.status === "rejected").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/30 dark:text-yellow-300"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-200/30 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-200/30 dark:text-red-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-200/30 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-200/30 dark:text-gray-300"
    }
  }

  const statusDescriptions = {
    pending: t("investments.statusPendingDescription"),
    accepted: t("investments.statusAcceptedDescription"),
    rejected: t("investments.statusRejectedDescription"),
    completed: t("investments.statusCompletedDescription"),
  }

  const handleFilterChange = () => {
    toast({
      title: t("investments.filterApplied"),
      description: t("investments.filterResults"),
      duration: 3000,
    })
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 py-4 shadow-sm"
      >
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("investments.title")}</h1>
          <Button asChild className="bg-green-600 hover:bg-green-700 hidden sm:flex">
            <Link href="/dashboard/projects">{t("investments.browseProjects")}</Link>
          </Button>
        </div>
      </motion.header>

      {/* Filter Bar */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("investments.search")}
                className="pl-10 pr-8 w-full rounded-lg"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange() }}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => { setSearchTerm(""); handleFilterChange() }}
                  aria-label={t("investments.clearSearch")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); handleFilterChange() }}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder={t("investments.filterByStatus")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("investments.allStatuses")}</SelectItem>
                  <SelectItem value="pending">{t("investments.pending")}</SelectItem>
                  <SelectItem value="accepted">{t("investments.accepted")}</SelectItem>
                  <SelectItem value="rejected">{t("investments.rejected")}</SelectItem>
                  <SelectItem value="completed">{t("investments.completed")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); handleFilterChange() }}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    <SelectValue placeholder={t("investments.sortBy")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">{t("investments.sortDateDesc")}</SelectItem>
                  <SelectItem value="date-asc">{t("investments.sortDateAsc")}</SelectItem>
                  <SelectItem value="amount-desc">{t("investments.sortAmountDesc")}</SelectItem>
                  <SelectItem value="amount-asc">{t("investments.sortAmountAsc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="outline"
            className="md:hidden w-full"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label={t("investments.toggleFilters")}
          >
            {isFilterOpen ? t("investments.hideFilters") : t("investments.showFilters")}
            <ChevronDown className={cn("ml-2 h-4 w-4", isFilterOpen && "rotate-180")} />
          </Button>
        </div>
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <Input
                  placeholder={t("investments.search")}
                  className="pl-10 w-full rounded-lg"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange() }}
                />
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); handleFilterChange() }}>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder={t("investments.filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("investments.allStatuses")}</SelectItem>
                    <SelectItem value="pending">{t("investments.pending")}</SelectItem>
                    <SelectItem value="accepted">{t("investments.accepted")}</SelectItem>
                    <SelectItem value="rejected">{t("investments.rejected")}</SelectItem>
                    <SelectItem value="completed">{t("investments.completed")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => { setSortBy(value); handleFilterChange() }}>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder={t("investments.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">{t("investments.sortDateDesc")}</SelectItem>
                    <SelectItem value="date-asc">{t("investments.sortDateAsc")}</SelectItem>
                    <SelectItem value="amount-desc">{t("investments.sortAmountDesc")}</SelectItem>
                    <SelectItem value="amount-asc">{t("investments.sortAmountAsc")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="container mx-auto">
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="active" className="rounded-md text-sm font-medium">
              {t("investments.active")} <Badge className="ml-2 bg-green-100 text-green-800">{tabCounts.active}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-md text-sm font-medium">
              {t("investments.completed")} <Badge className="ml-2 bg-blue-100 text-blue-800">{tabCounts.completed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-md text-sm font-medium">
              {t("investments.rejected")} <Badge className="ml-2 bg-red-100 text-red-800">{tabCounts.rejected}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : paginatedInvestments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("investments.noInvestmentsFound")}</h3>
                  <p className="text-muted-foreground mb-6">{t("investments.emptyStateDescription")}</p>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/dashboard/projects">{t("investments.browseProjects")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {paginatedInvestments.map((investment) => {
                  const project = projects.find((p) => p.id === investment.projectId)
                  if (!project) return null

                  return (
                    <motion.div key={investment.id} variants={cardVariants}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Card className="hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                            <CardHeader className="pb-2">
                              <div className="relative h-32 w-full rounded-t-lg overflow-hidden mb-4">
                                <img
                                  src={project.image || "/api/placeholder/400/200"}
                                  alt={project.name}
                                  className="h-full w-full object-cover"
                                />
                                <Badge
                                  className={cn(
                                    "absolute top-2 right-2",
                                    getStatusColor(investment.status)
                                  )}
                                >
                                  {t(`investments.${investment.status}`)}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg font-semibold line-clamp-1">{project.name}</CardTitle>
                              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            </CardHeader>
                            <CardContent className="flex-1">
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    {t(`sectors.${project.sector}`)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    {(investment.amount || 0).toLocaleString()} {t("common.currency")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {new Date(investment.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    {((investment.amount || 0) * 0.12).toLocaleString()} {t("common.currency")}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                            <div className="p-4">
                              <Button asChild variant="outline" className="w-full rounded-lg">
                                <Link href={`/dashboard/investments/${investment.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t("investments.viewDetails")}
                                </Link>
                              </Button>
                            </div>
                          </Card>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <h4 className="text-sm font-semibold mb-2">{project.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{t("investments.status")}: {t(`investments.${investment.status}`)}</p>
                          <p className="text-sm text-muted-foreground">{statusDescriptions[investment.status as keyof typeof statusDescriptions]}</p>
                        </PopoverContent>
                      </Popover>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="container mx-auto flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label={t("investments.previousPage")}
            >
              {t("investments.previous")}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setCurrentPage(page)}
                aria-label={t("investments.page")}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label={t("investments.nextPage")}
            >
              {t("investments.next")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}