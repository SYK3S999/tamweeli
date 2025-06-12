
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { initializeDemoAccounts } from "@/lib/demo-accounts"
import { Building, User, Shield, Loader2, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Animation variants from landing page
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

export default function DemoLoginPage() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    initializeDemoAccounts()
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleDemoLogin = useCallback(
    async (email: string, password: string, accountType: string) => {
      setLoadingAccount(accountType)
      setIsLoading(true)
      try {
        const success = await login(email, password)
        if (success) {
          toast({
            title: t("demo.loginSuccess"),
            description: t("demo.loginSuccessDesc"),
            className: "bg-background/95 border-primary/20",
          })
          router.push("/dashboard")
        } else {
          toast({
            title: t("demo.loginFailed"),
            description: t("demo.loginFailedDesc"),
            variant: "destructive",
            className: "bg-background/95 border-primary/20",
          })
        }
      } catch (error) {
        console.error("Login error:", error)
        toast({
          title: t("demo.loginError"),
          description: t("demo.loginErrorDesc"),
          variant: "destructive",
          className: "bg-background/95 border-primary/20",
        })
      } finally {
        setIsLoading(false)
        setLoadingAccount(null)
      }
    },
    [login, router, toast, t]
  )

  if (!isClient) {
    return <SkeletonLoader />
  }

  const demoAccounts = [
    {
      type: "investor",
      icon: User,
      title: t("demo.investor"),
      description: t("demo.investorDesc"),
      email: "investor@tamweeli.dz",
      password: "password123",
    },
    {
      type: "entrepreneur",
      icon: Building,
      title: t("demo.entrepreneur"),
      description: t("demo.entrepreneurDesc"),
      email: "entrepreneur@tamweeli.dz",
      password: "password123",
    },
    {
      type: "admin",
      icon: Shield,
      title: t("demo.admin"),
      description: t("demo.adminDesc"),
      email: "admin@tamweeli.dz",
      password: "password123",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar className="sticky top-0 z-50 bg-background/80 shadow-sm border-b border-primary/20" />
      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

        {/* Hero Section */}
        <section className="py-24 md:py-32 relative z-10">
          <div className="container px-4 md:px-6 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-12"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
                <span className="text-primary">{t("demo.explorePlatform")}</span>
              </Badge>
              <h1 className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight">
                {t("demo.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("demo.subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Demo Accounts Section */}
        <section className="py-16 relative z-10">
          <div className="container px-4 md:px-6">
            <motion.div
              className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {demoAccounts.map((account, index) => (
                <motion.div key={account.type} variants={fadeInUp}>
                  <Card className="h-full border border-primary/20 bg-background/95 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl group">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <account.icon className="h-5 w-5 text-primary" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{t(`demo.${account.type}Tooltip`)}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {account.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {account.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className={cn("flex justify-between", isRtl && "flex-row-reverse")}>
                          <span className="text-muted-foreground">{t("demo.email")}</span>
                          <span className="font-medium">{account.email}</span>
                        </div>
                        <div className={cn("flex justify-between", isRtl && "flex-row-reverse")}>
                          <span className="text-muted-foreground">{t("demo.password")}</span>
                          <span className="font-medium">{account.password}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                        onClick={() => handleDemoLogin(account.email, account.password, account.type)}
                        disabled={isLoading}
                        aria-label={t(`demo.loginAs`)}
                      >
                        {loadingAccount === account.type ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("demo.loading")}
                          </>
                        ) : (
                          <span className="flex items-center gap-3">
                            {t("demo.loginAs")}
                            <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Note Section */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 text-center max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="border border-primary/20 bg-background/90 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    {t("demo.note")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center mb-6">
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
                  <span className="text-primary">{t("demo.joinNow")}</span>
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight">
                {t("demo.ctaTitle")}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                {t("demo.ctaDesc")}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm group-hover:shadow-md transition-all duration-300 group"
                  onClick={() => router.push("/auth/register")}
                >
                  <span className="flex items-center gap-3">
                    {t("demo.register")}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div
      className="container px-4 md:px-6 py-12 max-w-5xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="h-8 w-64 bg-primary/20 rounded mb-4 mx-auto" />
      <motion.div variants={fadeInUp} className="h-4 w-96 bg-primary/20 rounded mb-12 mx-auto" />
      <motion.div
        className="grid gap-8 md:grid-cols-3"
        variants={staggerContainer}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="h-64 w-full bg-background/90 border border-primary/20 rounded-2xl animate-pulse"
            variants={fadeInUp}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
