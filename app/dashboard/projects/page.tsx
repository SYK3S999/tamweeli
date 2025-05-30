"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useProjects, type Project } from "@/components/project-provider"
import { Building, DollarSign, Eye, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProjectsPage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { projects } = useProjects()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [selectedContractType, setSelectedContractType] = useState<string>("all")

  // Only show approved projects
  const approvedProjects = projects.filter((project) => project.status === "approved")

  // Apply filters
  const filteredProjects = approvedProjects.filter((project) => {
    const matchesSearch =
      searchTerm === "" ||
      (project.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === "all" || project.sector === selectedSector
    const matchesContractType = selectedContractType === "all" || project.contractType === selectedContractType

    return matchesSearch && matchesSector && matchesContractType
  })

  const sectors = [
    { value: "all", label: "All Sectors" },
    { value: "technology", label: "Technology" },
    { value: "agriculture", label: "Agriculture" },
    { value: "real-estate", label: "Real Estate" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "other", label: "Other" },
  ]

  const contractTypes = [
    { value: "all", label: "All Contract Types" },
    { value: "murabaha", label: "Murabaha" },
    { value: "musharaka", label: "Musharaka" },
    { value: "mudaraba", label: "Mudaraba" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("nav.projects")}</h2>
        <p className="text-muted-foreground">Browse through Shariah-compliant investment opportunities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger>
              <SelectValue placeholder="Sector" />
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
            <SelectTrigger>
              <SelectValue placeholder="Contract Type" />
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
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No projects found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{project.sector}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{(project.amount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="capitalize">
              {project.contractType}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{project.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link href={`/projects/${project.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
