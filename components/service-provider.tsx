"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type ServiceType = "financial" | "legal" | "islamic" | "feasibility"
export type ServiceStatus = "pending" | "in-progress" | "completed" | "cancelled"

export interface Service {
  id: string
  name: string
  description: string
  type: ServiceType
  price: number
  consultantId?: string
  isActive: boolean
}

export interface ServiceRequest {
  id: string
  userId: string
  serviceId: string
  projectId?: string
  description: string
  status: ServiceStatus
  consultantId?: string
  files: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

interface ServiceContextType {
  services: Service[]
  userServiceRequests: ServiceRequest[]
  isLoading: boolean
  addServiceRequest: (request: Omit<ServiceRequest, "id" | "status" | "createdAt" | "updatedAt">) => Promise<void>
  updateServiceRequest: (id: string, request: Partial<ServiceRequest>) => Promise<void>
  getServiceById: (id: string) => Service | undefined
  getServiceRequestById: (id: string) => ServiceRequest | undefined
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export function ServiceProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const [services, setServices] = useState<Service[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load services and service requests from localStorage
    const loadData = () => {
      try {
        const storedServices = localStorage.getItem("services")
        const storedServiceRequests = localStorage.getItem("serviceRequests")

        if (storedServices) {
          setServices(JSON.parse(storedServices))
        } else {
          // Initialize with sample services if none exist
          const sampleServices: Service[] = [
            {
              id: "service-1",
              name: "Financial Consulting",
              description: "Expert financial consulting for your Islamic business or project.",
              type: "financial",
              price: 50000, // Changed from 500 USD to 50000 DZD
              consultantId: "user-10",
              isActive: true,
            },
            {
              id: "service-2",
              name: "Legal Consulting",
              description: "Legal advice and documentation for Islamic business practices.",
              type: "legal",
              price: 75000, // Changed from 750 USD to 75000 DZD
              consultantId: "user-11",
              isActive: true,
            },
            {
              id: "service-3",
              name: "Islamic Finance Consulting",
              description: "Guidance on Shariah-compliant financial structures and products.",
              type: "islamic",
              price: 60000, // Changed from 600 USD to 60000 DZD
              consultantId: "user-12",
              isActive: true,
            },
            {
              id: "service-4",
              name: "Feasibility Study",
              description: "Comprehensive feasibility analysis for your project or business idea.",
              type: "feasibility",
              price: 120000, // Changed from 1200 USD to 120000 DZD
              consultantId: "user-13",
              isActive: true,
            },
          ]
          setServices(sampleServices)
          localStorage.setItem("services", JSON.stringify(sampleServices))
        }

        if (storedServiceRequests) {
          setServiceRequests(JSON.parse(storedServiceRequests))
        } else {
          // Initialize with sample service requests if none exist
          const sampleServiceRequests: ServiceRequest[] = [
            {
              id: "request-1",
              userId: "user-1",
              serviceId: "service-1",
              projectId: "project-1",
              description: "I need financial consulting for my agriculture technology project.",
              status: "in-progress",
              consultantId: "user-10",
              files: [],
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "request-2",
              userId: "user-2",
              serviceId: "service-3",
              projectId: "project-2",
              description: "I need advice on structuring my FinTech platform in a Shariah-compliant way.",
              status: "completed",
              consultantId: "user-12",
              files: [],
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "request-3",
              userId: "user-3",
              serviceId: "service-4",
              projectId: "project-3",
              description: "I need a feasibility study for my Halal Food Delivery Service.",
              status: "pending",
              files: [],
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          setServiceRequests(sampleServiceRequests)
          localStorage.setItem("serviceRequests", JSON.stringify(sampleServiceRequests))
        }
      } catch (error) {
        console.error("Failed to load services:", error)
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Filter service requests by user ID
  const userServiceRequests = userId ? serviceRequests.filter((request) => request.userId === userId) : []

  const addServiceRequest = async (requestData: Omit<ServiceRequest, "id" | "status" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newRequest: ServiceRequest = {
        ...requestData,
        id: `request-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedRequests = [...serviceRequests, newRequest]
      setServiceRequests(updatedRequests)
      localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests))

      toast({
        title: "Service request submitted",
        description: "Your service request has been submitted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit service request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateServiceRequest = async (id: string, requestData: Partial<ServiceRequest>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedRequests = serviceRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              ...requestData,
              updatedAt: new Date().toISOString(),
            }
          : request,
      )

      setServiceRequests(updatedRequests)
      localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests))

      toast({
        title: "Service request updated",
        description: "Your service request has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getServiceById = (id: string) => {
    return services.find((service) => service.id === id)
  }

  const getServiceRequestById = (id: string) => {
    return serviceRequests.find((request) => request.id === id)
  }

  return (
    <ServiceContext.Provider
      value={{
        services,
        userServiceRequests,
        isLoading,
        addServiceRequest,
        updateServiceRequest,
        getServiceById,
        getServiceRequestById,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider")
  }
  return context
}
