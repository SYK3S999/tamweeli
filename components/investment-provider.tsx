"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type InvestmentStatus = "pending" | "accepted" | "rejected" | "completed"

export interface Investment {
  id: string
  investorId: string
  projectId: string
  amount: number
  message: string
  status: InvestmentStatus
  createdAt: string
  updatedAt: string
}

interface InvestmentContextType {
  investments: Investment[]
  userInvestments: Investment[]
  isLoading: boolean
  addInvestment: (investment: Omit<Investment, "id" | "status" | "createdAt" | "updatedAt">) => Promise<void>
  updateInvestment: (id: string, investment: Partial<Investment>) => Promise<void>
  deleteInvestment: (id: string) => Promise<void>
  getInvestmentById: (id: string) => Investment | undefined
  getInvestmentsForProject: (projectId: string) => Investment[]
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined)

export function InvestmentProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load investments from localStorage
    const loadInvestments = () => {
      try {
        const storedInvestments = localStorage.getItem("investments")
        if (storedInvestments) {
          setInvestments(JSON.parse(storedInvestments))
        } else {
          // Initialize with sample investments if none exist
          const sampleInvestments: Investment[] = [
            {
              id: "investment-1",
              investorId: "user-6",
              projectId: "project-1",
              amount: 5000000, // Changed from 50000 USD to 5000000 DZD
              message: "I'm interested in investing in your sustainable agriculture technology.",
              status: "accepted",
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "investment-2",
              investorId: "user-7",
              projectId: "project-2",
              amount: 10000000, // Changed from 100000 USD to 10000000 DZD
              message: "Your FinTech platform aligns with my investment goals in Islamic finance.",
              status: "pending",
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "investment-3",
              investorId: "user-8",
              projectId: "project-4",
              amount: 7500000, // Changed from 75000 USD to 7500000 DZD
              message: "I believe in the potential of Islamic education platforms and would like to invest.",
              status: "accepted",
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          setInvestments(sampleInvestments)
          localStorage.setItem("investments", JSON.stringify(sampleInvestments))
        }
      } catch (error) {
        console.error("Failed to load investments:", error)
        toast({
          title: "Error",
          description: "Failed to load investments",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadInvestments()
  }, [toast])

  // Filter investments by user ID
  const userInvestments = userId ? investments.filter((investment) => investment.investorId === userId) : []

  const addInvestment = async (investmentData: Omit<Investment, "id" | "status" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newInvestment: Investment = {
        ...investmentData,
        id: `investment-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedInvestments = [...investments, newInvestment]
      setInvestments(updatedInvestments)
      localStorage.setItem("investments", JSON.stringify(updatedInvestments))

      toast({
        title: "Investment proposal submitted",
        description: "Your investment proposal has been sent to the project owner",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit investment proposal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateInvestment = async (id: string, investmentData: Partial<Investment>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedInvestments = investments.map((investment) =>
        investment.id === id
          ? {
              ...investment,
              ...investmentData,
              updatedAt: new Date().toISOString(),
            }
          : investment,
      )

      setInvestments(updatedInvestments)
      localStorage.setItem("investments", JSON.stringify(updatedInvestments))

      toast({
        title: "Investment updated",
        description: "Your investment has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update investment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteInvestment = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedInvestments = investments.filter((investment) => investment.id !== id)
      setInvestments(updatedInvestments)
      localStorage.setItem("investments", JSON.stringify(updatedInvestments))

      toast({
        title: "Investment deleted",
        description: "Your investment has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete investment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInvestmentById = (id: string) => {
    return investments.find((investment) => investment.id === id)
  }

  const getInvestmentsForProject = (projectId: string) => {
    return investments.filter((investment) => investment.projectId === projectId)
  }

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        userInvestments,
        isLoading,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        getInvestmentById,
        getInvestmentsForProject,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  )
}

export function useInvestments() {
  const context = useContext(InvestmentContext)
  if (context === undefined) {
    throw new Error("useInvestments must be used within an InvestmentProvider")
  }
  return context
}
