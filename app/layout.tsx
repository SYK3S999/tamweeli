import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ProjectProvider } from "@/components/project-provider"
import { InvestmentProvider } from "@/components/investment-provider"
import { ServiceProvider } from "@/components/service-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { MessageProvider } from "@/components/message-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { initializeDemoAccounts } from "@/lib/demo-accounts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tamweeli - Islamic Crowdfunding Platform",
  description: "Islamic crowdfunding platform connecting investors and entrepreneurs",
  generator: "v0.dev",
}

// Initialize demo accounts on the client side
if (typeof window !== "undefined") {
  initializeDemoAccounts()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div suppressHydrationWarning>
            <LanguageProvider>
              <AuthProvider>
                <ProjectProvider>
                  <InvestmentProvider>
                    <ServiceProvider>
                      <WalletProvider>
                        <NotificationProvider>
                          <MessageProvider>
                            {children}
                            <Toaster />
                          </MessageProvider>
                        </NotificationProvider>
                      </WalletProvider>
                    </ServiceProvider>
                  </InvestmentProvider>
                </ProjectProvider>
              </AuthProvider>
            </LanguageProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}