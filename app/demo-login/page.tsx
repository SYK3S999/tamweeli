"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { initializeDemoAccounts } from "@/lib/demo-accounts"
import { Building, User, Shield, Loader2 } from "lucide-react"

export default function DemoLoginPage() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null)

  useEffect(() => {
    // Initialize demo accounts
    initializeDemoAccounts()

    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleDemoLogin = async (email: string, password: string, accountType: string) => {
    setLoadingAccount(accountType)
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        toast({
          title: "Login successful",
          description: `You are now logged in as a demo ${accountType}`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLoadingAccount(null)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Tamweeli - تمويلي</h1>
          <p className="text-muted-foreground mt-2">Choose a demo account to explore the platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Investor Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Investor
              </CardTitle>
              <CardDescription>Browse and invest in Shariah-compliant projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">investor@tamweeli.dz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-medium">password123</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleDemoLogin("investor@tamweeli.dz", "password123", "investor")}
                disabled={isLoading}
              >
                {loadingAccount === "investor" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Investor"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Project Owner Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Entrepreneur
              </CardTitle>
              <CardDescription>Create and manage Shariah-compliant projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">entrepreneur@tamweeli.dz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-medium">password123</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleDemoLogin("entrepreneur@tamweeli.dz", "password123", "entrepreneur")}
                disabled={isLoading}
              >
                {loadingAccount === "entrepreneur" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Entrepreneur"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Admin/Consultant Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin/Consultant
              </CardTitle>
              <CardDescription>Manage platform, users, and provide consulting services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">admin@tamweeli.dz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-medium">password123</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleDemoLogin("admin@tamweeli.dz", "password123", "admin")}
                disabled={isLoading}
              >
                {loadingAccount === "admin" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Admin"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Note: This is a demo application. All data is reset when you refresh the page.
          </p>
        </div>
      </div>
    </div>
  )
}
