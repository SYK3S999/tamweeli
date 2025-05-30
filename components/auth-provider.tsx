"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { initializeDemoAccounts } from "@/lib/demo-accounts"

// Define user types
export type UserType = "investor" | "project-owner" | "consultant" | "admin"
export type InvestorType = "individual" | "institution" | null

export interface User {
  id: string
  name: string
  email: string
  userType: UserType
  investorType?: InvestorType
  companyName?: string
  activityType?: string
  registrationNumber?: string
  isVerified: boolean
  createdAt: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  register: (data: any) => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isLoggingOut: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({
  children,
}: {
  children: React.ReactNode | ((props: { user: User | null }) => React.ReactNode)
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const initialLoadComplete = useRef(false)

  // Initialize demo accounts
  useEffect(() => {
    if (initialLoadComplete.current) return

    initializeDemoAccounts()

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
    initialLoadComplete.current = true
  }, [])

  const register = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser = {
        id: `user-${Date.now()}`,
        ...data,
        isVerified: false,
        createdAt: new Date().toISOString(),
      }

      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(newUser))

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      })
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = foundUser

        setUser(userWithoutPassword)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))

        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        return true
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Set logging out state to prevent redirection loops
    setIsLoggingOut(true)

    // Clear user data
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")

    // Show toast notification
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })

    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(() => {
      router.push("/")
      // Reset logging out state after navigation
      setTimeout(() => {
        setIsLoggingOut(false)
      }, 500)
    }, 100)
  }

  const value = {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    isLoading,
    isLoggingOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === "function" ? children({ user }) : children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
