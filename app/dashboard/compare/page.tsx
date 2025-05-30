"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useProjects } from "@/components/project-provider"
import { useInvestments } from "@/components/investment-provider"
import { ArrowRight, Building, Calendar, DollarSign, MapPin, X } from "lucide-react"
import { translateSector, translateContractType, formatCurrency } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

export default function ComparePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { projects } = useProjects()
  const { investments } = useInvestments()
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  if (!user) {
    return null
  }

  // Only show approved projects
  const approvedProjects = projects.filter((project) => project.status === "approved")

  // Get selected projects data
  const projectsToCompare = approvedProjects.filter((project) => selectedProjects.includes(project.id))

  // Calculate funding progress for each project
  const getProjectFundingProgress = (projectId: string) => {
    const projectInvestments = investments.filter((investment) => investment.projectId === projectId)
    const totalInvested = projectInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const project = approvedProjects.find((p) => p.id === projectId)

    if (!project) return 0
    return Math.min(Math.round((totalInvested / project.amount) * 100), 100)
  }

  const handleAddProject = (projectId: string) => {
    if (selectedProjects.length < 3 && !selectedProjects.includes(projectId)) {
      setSelectedProjects([...selectedProjects, projectId])
    }
  }

  const handleRemoveProject = (projectId: string) => {
    setSelectedProjects(selectedProjects.filter((id) => id !== projectId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("compare.title")}</h2>
        <p className="text-muted-foreground">{t("compare.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("compare.selectProjects")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select onValueChange={handleAddProject} disabled={selectedProjects.length >= 3} value="">
                <SelectTrigger>
                  <SelectValue placeholder={t("compare.selectProject")} />
                </SelectTrigger>
                <SelectContent>
                  {approvedProjects
                    .filter((project) => !selectedProjects.includes(project.id))
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" onClick={() => setSelectedProjects([])}>
                {t("compare.clearAll")}
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {selectedProjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{t("compare.noProjectsSelected")}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">{t("compare.feature")}</th>
                      {projectsToCompare.map((project) => (
                        <th key={project.id} className="text-left p-2 border-b min-w-[200px]">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">{project.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveProject(project.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.sector")}</td>
                      {projectsToCompare.map((project) => (
                        <td key={project.id} className="p-2 border-b">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{translateSector(project.sector, t)}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.amount")}</td>
                      {projectsToCompare.map((project) => (
                        <td key={project.id} className="p-2 border-b">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{formatCurrency(project.amount, t)}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.contractType")}</td>
                      {projectsToCompare.map((project) => (
                        <td key={project.id} className="p-2 border-b">
                          {translateContractType(project.contractType, t)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.location")}</td>
                      {projectsToCompare.map((project) => (
                        <td key={project.id} className="p-2 border-b">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{project.location}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.createdOn")}</td>
                      {projectsToCompare.map((project) => (
                        <td key={project.id} className="p-2 border-b">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.fundingProgress")}</td>
                      {projectsToCompare.map((project) => {
                        const progress = getProjectFundingProgress(project.id)
                        return (
                          <td key={project.id} className="p-2 border-b">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="p-2 border-b font-medium">{t("project.description")}</td>
                      {projectsToCompare.map((project) => (
                        <td key={project.id} className="p-2 border-b">
                          <p className="text-sm line-clamp-3">{project.description}</p>
                          <Button variant="link" className="p-0 h-auto text-sm" asChild>
                            <a href={`/projects/${project.id}`}>
                              {t("project.viewDetails")}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
