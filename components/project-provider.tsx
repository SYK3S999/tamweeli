"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type ProjectStatus = "draft" | "under-review" | "approved" | "rejected"
export type ContractType = "murabaha" | "musharaka" | "mudaraba"
export type Sector =
  | "technology"
  | "agriculture"
  | "real-estate"
  | "education"
  | "healthcare"
  | "retail"
  | "manufacturing"
  | "other"

export interface Project {
  id: string
  ownerId: string
  ownerName: string
  name: string
  description: string
  sector: Sector
  amount: number // In DZD
  fundingRaised: number // In DZD
  returnRate: number // Percentage
  contractType: ContractType
  location: string
  images: string[] // Renamed from files
  duration: number // Changed from string to number (months)
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  trending: boolean
  isNew: boolean
}

interface ProjectContextType {
  projects: Project[]
  userProjects: Project[]
  isLoading: boolean
  addProject: (project: Omit<Project, "id" | "status" | "createdAt" | "updatedAt" | "fundingRaised" | "trending" | "isNew">) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProjectById: (id: string) => Project | undefined
  savedProjects: string[]
  saveProject: (userId: string, projectId: string) => void
  unsaveProject: (userId: string, projectId: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadProjects = () => {
      try {
        const storedProjects = localStorage.getItem("projects")
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects))
        } else {
          const sampleProjects: Project[] = [
            {
              id: "project-1",
              ownerId: "user-1",
              ownerName: "Ahmed Benali",
              name: "Eco-Friendly Agriculture Tech",
              description:
                "Developing sustainable agricultural technology using IoT and AI to optimize resource usage and increase crop yields.",
              sector: "agriculture",
              amount: 25000000, // 25M DZD
              fundingRaised: 10000000, // 10M DZD
              returnRate: 8,
              contractType: "musharaka",
              location: "Algiers, Algeria",
              images: ["/images/agri-tech.jpg"],
              duration: 24,
              status: "approved",
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
              trending: true,
              isNew: false,
            },
            {
              id: "project-2",
              ownerId: "user-2",
              ownerName: "Fatima Zahra",
              name: "Islamic FinTech Platform",
              description:
                "A Shariah-compliant financial technology platform offering various Islamic financial services.",
              sector: "technology",
              amount: 50000000, // 50M DZD
              fundingRaised: 20000000, // 20M DZD
              returnRate: 10,
              contractType: "mudaraba",
              location: "Oran, Algeria",
              images: ["/images/fintech.jpg"],
              duration: 36,
              status: "approved",
              createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
              trending: false,
              isNew: true,
            },
            {
              id: "project-3",
              ownerId: "user-3",
              ownerName: "Youssef Amrani",
              name: "Halal Food Delivery Service",
              description:
                "An online platform connecting customers with local halal food providers, offering convenient delivery services.",
              sector: "retail",
              amount: 15000000, // 15M DZD
              fundingRaised: 5000000, // 5M DZD
              returnRate: 7,
              contractType: "murabaha",
              location: "Constantine, Algeria",
              images: ["/images/food-delivery.jpg"],
              duration: 18,
              status: "under-review",
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              trending: false,
              isNew: true,
            },
            {
              id: "project-4",
              ownerId: "user-4",
              ownerName: "Amina Khelifi",
              name: "Islamic Education Platform",
              description:
                "An online learning platform focused on Islamic education, offering courses on various Islamic subjects.",
              sector: "education",
              amount: 20000000, // 20M DZD
              fundingRaised: 8000000, // 8M DZD
              returnRate: 6,
              contractType: "musharaka",
              location: "Annaba, Algeria",
              images: ["/images/education.jpg"],
              duration: 30,
              status: "approved",
              createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
              trending: true,
              isNew: false,
            },
            {
              id: "project-5",
              ownerId: "user-5",
              ownerName: "Karim Boudiaf",
              name: "Eco-Friendly Housing Development",
              description:
                "A sustainable housing project using environmentally friendly materials and renewable energy sources.",
              sector: "real-estate",
              amount: 100000000, // 100M DZD
              fundingRaised: 30000000, // 30M DZD
              returnRate: 9,
              contractType: "mudaraba",
              location: "Setif, Algeria",
              images: ["/images/housing.jpg"],
              duration: 48,
              status: "approved",
              createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
              trending: false,
              isNew: false,
            },
          ]
          setProjects(sampleProjects)
          localStorage.setItem("projects", JSON.stringify(sampleProjects))
        }
      } catch (error) {
        console.error("Failed to load projects:", error)
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [toast])

  const userProjects = userId ? projects.filter((project) => project.ownerId === userId) : []
  
  const addProject = async (
    projectData: Omit<Project, "id" | "status" | "createdAt" | "updatedAt" | "fundingRaised" | "trending" | "isNew">,
  ) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        status: "under-review",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fundingRaised: 0,
        trending: false,
        isNew: true,
      }
      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      localStorage.setItem("projects", JSON.stringify(updatedProjects))
      toast({
        title: "Project submitted",
        description: "Your project has been submitted for review",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const [savedProjects, setSavedProjects] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedProjects")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const saveProject = (userId: string, projectId: string) => {
    const newSaved = [...new Set([...savedProjects, projectId])]
    setSavedProjects(newSaved)
    localStorage.setItem("savedProjects", JSON.stringify(newSaved))
  }

  const unsaveProject = (userId: string, projectId: string) => {
    const newSaved = savedProjects.filter((id) => id !== projectId)
    setSavedProjects(newSaved)
    localStorage.setItem("savedProjects", JSON.stringify(newSaved))
  }

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedProjects = projects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...projectData,
              updatedAt: new Date().toISOString(),
            }
          : project,
      )
      setProjects(updatedProjects)
      localStorage.setItem("projects", JSON.stringify(updatedProjects))
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedProjects = projects.filter((project) => project.id !== id)
      setProjects(updatedProjects)
      localStorage.setItem("projects", JSON.stringify(updatedProjects))
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id)
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        userProjects: projects.filter((p) => p.ownerId === userId),
        savedProjects,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        saveProject,
        unsaveProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return {
    ...context,
    projects: context.projects || [],
    userProjects: context.userProjects || [],
  }
}