"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, Chrome, Github, ArrowRight } from "lucide-react"
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

export default function ModernLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"

  useEffect(() => {
    setIsClient(true)
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const success = await login(email, password)
        if (success) {
          toast({
            title: t("login.success"),
            description: t("login.successDesc"),
            className: "bg-background/95 border-primary/20",
          })
          router.push("/dashboard")
        } else {
          setError(t("login.invalidCredentials"))
          toast({
            title: t("login.error"),
            description: t("login.invalidCredentials"),
            variant: "destructive",
            className: "bg-background/95 border-primary/20",
          })
        }
      } catch (error) {
        setError(t("login.errorDesc"))
        toast({
          title: t("login.error"),
          description: t("login.errorDesc"),
          variant: "destructive",
          className: "bg-background/95 border-primary/20",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [email, password, login, router, toast, t]
  )

  const handleSocialLogin = useCallback(
    (provider: string) => {
      toast({
        title: t("login.socialLogin"),
        description: t("login.socialLoginDesc"),
        className: "bg-background/95 border-primary/20",
      })
    },
    [toast, t]
  )

  if (!isClient) {
    return <SkeletonLoader />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar className="sticky top-0 z-50 bg-background/80 shadow-sm border-b border-primary/20" />
      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

        {/* Login Section */}
        <section className="py-24 md:py-32 relative z-10">
          <div className="container px-4 md:px-6 flex items-center justify-center">
            <motion.div
              className="w-full max-w-md"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <Card className="backdrop-blur-xl bg-background/95 border border-primary/20 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <motion.div variants={fadeInUp} className="text-center mb-8">
                  <Badge
                    variant="outline"
                    className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
                    <span className="text-primary">{t("login.welcome")}</span>
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-2">
                    {t("login.title")}
                  </h1>
                  <p className="text-muted-foreground">{t("login.subtitle")}</p>
                </motion.div>

                {/* Social Login */}
                <motion.div variants={fadeInUp} className="space-y-3 mb-6">
                  {[
                    { provider: "Google", icon: Chrome },
                    { provider: "GitHub", icon: Github },
                  ].map(({ provider, icon: Icon }) => (
                    <Button
                      key={provider}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-3 bg-background/95 hover:bg-primary/10 border-primary/20 rounded-xl py-6 text-foreground transition-all duration-300 hover:scale-105 group"
                      onClick={() => handleSocialLogin(provider)}
                    >
                      <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      {t("login.social")}
                    </Button>
                  ))}
                </motion.div>

                {/* Divider */}
                <motion.div variants={fadeInUp} className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background/95 text-muted-foreground">
                      {t("login.orEmail")}
                    </span>
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    variants={fadeInUp}
                    className="mb-6"
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="p-4 bg-background/90 border-primary/20 text-primary">
                      {error}
                    </Card>
                  </motion.div>
                )}

                {/* Login Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={staggerContainer}
                >
                  {/* Email Field */}
                  <motion.div variants={fadeInUp} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t("login.email")}
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("login.emailPlaceholder")}
                        required
                        className="pl-12 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                        aria-label={t("login.email")}
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div variants={fadeInUp} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t("login.password")}
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("login.passwordPlaceholder")}
                        required
                        className="pl-12 pr-12 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                        aria-label={t("login.password")}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={t(showPassword ? "login.hidePassword" : "login.showPassword")}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t(showPassword ? "login.hidePassword" : "login.showPassword")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>

                  {/* Remember Me and Forgot Password */}
                  <motion.div
                    variants={fadeInUp}
                    className={cn("flex items-center justify-between", isRtl && "flex-row-reverse")}
                  >
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded border-2 transition-all duration-200",
                            rememberMe
                              ? "bg-primary border-primary"
                              : "border-primary/20 group-hover:border-primary/30"
                          )}
                        >
                          {rememberMe && (
                            <svg
                              className="w-3 h-3 text-background absolute top-0.5 left-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {t("login.rememberMe")}
                      </span>
                    </label>
                    <Button
                      variant="link"
                      className="text-sm text-primary hover:text-primary/90 p-0"
                      onClick={() => toast({
                        title: t("login.forgotPassword"),
                        description: t("login.forgotPasswordDesc"),
                        className: "bg-background/95 border-primary/20",
                      })}
                    >
                      {t("login.forgotPassword")}
                    </Button>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={fadeInUp}>
                    <Button
                      type="submit"
                      className="w-full rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t("login.signingIn")}
                        </>
                      ) : (
                        <span className="flex items-center gap-3">
                          {t("login.signIn")}
                          <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                {/* Footer Links */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 text-center space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {t("login.noAccount")}{" "}
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/90 p-0"
                      onClick={() => router.push("/auth/register")}
                    >
                      {t("login.signUp")}
                    </Button>
                  </p>
                  <Button
                    variant="link"
                    className="text-sm text-primary hover:text-primary/90"
                    onClick={() => router.push("/demo-login")}
                  >
                    {t("login.demoLogin")}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t("login.demoCredentials")}
                  </p>
                </motion.div>
              </Card>
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
      className="container px-4 md:px-6 py-12 max-w-md mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="h-8 w-64 bg-primary/20 rounded mb-4 mx-auto" />
      <motion.div variants={fadeInUp} className="h-4 w-96 bg-primary/20 rounded mb-6 mx-auto" />
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="h-12 w-full bg-primary/20 rounded-xl" />
        <div className="h-12 w-full bg-primary/20 rounded-xl" />
        <div className="h-12 w-full bg-primary/20 rounded-xl" />
        <div className="h-12 w-full bg-primary/20 rounded-xl" />
      </motion.div>
    </motion.div>
  )
}
