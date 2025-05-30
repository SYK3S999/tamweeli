"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ProjectProvider, useProjects } from "@/components/project-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectCard } from "@/components/project-card"
import { Filter, Loader2, Search, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export default function SearchPage() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <SearchPageContent />
      </ProjectProvider>
    </AuthProvider>
  )
}

function SearchPageContent() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const searchParams = useSearchParams()
  const { projects = [] } = useProjects()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [selectedContractType, setSelectedContractType] = useState<string>("all")
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000000])
  const [isLoading, setIsLoading] = useState(true)
  const [filtersApplied, setFiltersApplied] = useState(0)

  // Get query from URL
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Get max amount for slider
  const maxProjectAmount = Math.max(
    ...projects.map((project) => project.amount || 0),
    1000000, // Fallback if no projects
  )

  // Only show approved projects
  const approvedProjects = projects.filter((project) => project.status === "approved")

  // Apply filters
  const filteredProjects = approvedProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === "all" || project.sector === selectedSector
    const matchesContractType = selectedContractType === "all" || project.contractType === selectedContractType
    const matchesAmount = (project.amount || 0) >= amountRange[0] && (project.amount || 0) <= amountRange[1]

    return matchesSearch && matchesSector && matchesContractType && matchesAmount
  })

  // Reset filters
  const resetFilters = () => {
    setSelectedSector("all")
    setSelectedContractType("all")
    setAmountRange([0, maxProjectAmount])
    setFiltersApplied(0)
  }

  // Count applied filters
  useEffect(() => {
    let count = 0
    if (selectedSector !== "all") count++
    if (selectedContractType !== "all") count++
    if (amountRange[0] > 0 || amountRange[1] < maxProjectAmount) count++
    setFiltersApplied(count)
  }, [selectedSector, selectedContractType, amountRange, maxProjectAmount])

  const sectors = [
    { value: "all", label: t("sectors.allSectors") },
    { value: "technology", label: t("sectors.technology") },
    { value: "agriculture", label: t("sectors.agriculture") },
    { value: "real-estate", label: t("sectors.realEstate") },
    { value: "education", label: t("sectors.education") },
    { value: "healthcare", label: t("sectors.healthcare") },
    { value: "retail", label: t("sectors.retail") },
    { value: "manufacturing", label: t("sectors.manufacturing") },
    { value: "other", label: t("sectors.other") },
  ]

  const contractTypes = [
    { value: "all", label: t("contractTypes.allTypes") },
    { value: "murabaha", label: t("contractTypes.murabaha") },
    { value: "musharaka", label: t("contractTypes.musharaka") },
    { value: "mudaraba", label: t("contractTypes.mudaraba") },
  ]

  const filterForm = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("filters.sector")}</label>
        <Select
          value={selectedSector}
          onValueChange={(value) => {
            setSelectedSector(value)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.sector")} />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector.value} value={sector.value}>
                {sector.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("filters.contractType")}</label>
        <Select value={selectedContractType} onValueChange={setSelectedContractType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.contractType")} />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">{t("filters.amount")}</label>
          <span className="text-xs text-muted-foreground">
            {amountRange[0].toLocaleString()} - {amountRange[1].toLocaleString()} {t("common.currency")}
          </span>
        </div>
        <Slider
          defaultValue={[0, maxProjectAmount]}
          min={0}
          max={maxProjectAmount}
          step={10000}
          value={amountRange}
          onValueChange={(value) => setAmountRange(value as [number, number])}
          className="my-6"
        />
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t("search.results")}</h1>
            <p className="text-muted-foreground">
              {searchTerm ? t("search.resultsFor") : t("search.browseAllProjects")}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search.searchProjects")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Mobile filters */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      {t("filters.filters")}
                    </div>
                    {filtersApplied > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {filtersApplied}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side={rtl ? "right" : "left"} className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>{t("filters.filters")}</SheetTitle>
                    <SheetDescription>{t("filters.description")}</SheetDescription>
                  </SheetHeader>
                  <div className="py-6">{filterForm}</div>
                  <SheetFooter>
                    <div className="flex justify-between w-full gap-2">
                      <Button variant="outline" onClick={resetFilters} className="flex-1">
                        {t("filters.reset")}
                      </Button>
                      <SheetClose asChild>
                        <Button className="flex-1">{t("filters.apply")}</Button>
                      </SheetClose>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop filters */}
            <div className="hidden lg:flex gap-4 flex-shrink-0">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("filters.sector")} />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedContractType} onValueChange={setSelectedContractType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("filters.contractType")} />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filtersApplied > 0 && (
                <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4 mr-2" />
                  {t("filters.reset")}
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="mt-6">
              <CardContent className="py-16 text-center">
                <div className="space-y-3">
                  <Search className="h-10 w-10 text-muted-foreground/60 mx-auto" />
                  <h3 className="text-lg font-medium">{t("search.noResults")}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{t("search.tryAdjusting")}</p>
                  <Button variant="outline" onClick={resetFilters} className="mt-2">
                    {t("filters.resetAll")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mt-6 mb-4">
                {t("search.showing")} {filteredProjects.length} {t("search.results")}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
