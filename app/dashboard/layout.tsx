"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { ProjectProvider } from "@/components/project-provider"
import { InvestmentProvider } from "@/components/investment-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { MessageProvider } from "@/components/message-provider"
import { ServiceProvider } from "@/components/service-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {({ user }) => (
        <ProjectProvider userId={user?.id}>
          <InvestmentProvider userId={user?.id}>
            <NotificationProvider userId={user?.id}>
              <MessageProvider userId={user?.id}>
                <ServiceProvider userId={user?.id}>
                  <WalletProvider>
                    <DashboardLayoutContent>{children}</DashboardLayoutContent>
                  </WalletProvider>
                </ServiceProvider>
              </MessageProvider>
            </NotificationProvider>
          </InvestmentProvider>
        </ProjectProvider>
      )}
    </AuthProvider>
  )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, isLoggingOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if not authenticated, not loading, and not in the process of logging out
    if (!isLoading && !isAuthenticated && !isLoggingOut) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, isLoggingOut, router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // Don't render anything during logout to prevent flashing
  if (isLoggingOut) {
    return <div className="flex min-h-screen items-center justify-center">Logging out...</div>
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar userType={user.userType} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
