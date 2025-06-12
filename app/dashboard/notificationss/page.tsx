"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Bell, CheckCircle, AlertCircle, DollarSign, Clock, ArrowRight, Link } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
}

// Mock notification data
interface Notification {
  id: string
  type: "status" | "investment" | "review" | "opportunity"
  title: string
  message: string
  createdAt: string
  read: boolean
}

const mockProjectOwnerNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "status",
    title: "Project Approved",
    message: "Your project 'Tamweeli Water Purification' has been approved and is now live for investment.",
    createdAt: "2025-06-10T14:00:00Z",
    read: false,
  },
  {
    id: "notif-2",
    type: "investment",
    title: "New Investment Received",
    message: "An investor has pledged 500,000 DZD to your project 'EcoSmart Solar Farms'.",
    createdAt: "2025-06-09T09:30:00Z",
    read: true,
  },
  {
    id: "notif-3",
    type: "review",
    title: "Review Comments",
    message: "Your project 'GreenHarvest Agrotech' has received comments from the review team. Please address them.",
    createdAt: "2025-06-08T16:45:00Z",
    read: false,
  },
]

const mockInvestorNotifications: Notification[] = [
  {
    id: "notif-4",
    type: "status",
    title: "Investment Accepted",
    message: "Your investment of 500,000 DZD in 'Tamweeli Water Purification' has been accepted.",
    createdAt: "2025-06-10T15:00:00Z",
    read: false,
  },
  {
    id: "notif-5",
    type: "opportunity",
    title: "New Investment Opportunity",
    message: "A new project 'EcoSmart Solar Farms' is now open for investment. Check it out!",
    createdAt: "2025-06-09T10:00:00Z",
    read: true,
  },
  {
    id: "notif-6",
    type: "status",
    title: "Project Update",
    message: "The project 'GreenHarvest Agrotech' you invested in has reached 50% funding.",
    createdAt: "2025-06-08T12:00:00Z",
    read: false,
  },
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "status":
      return <CheckCircle className="h-5 w-5 text-primary" />
    case "investment":
      return <DollarSign className="h-5 w-5 text-primary" />
    case "review":
      return <AlertCircle className="h-5 w-5 text-primary" />
    case "opportunity":
      return <Bell className="h-5 w-5 text-primary" />
    default:
      return <Bell className="h-5 w-5 text-primary" />
  }
}

export default function NotificationsPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(
        user?.userType === "project-owner"
          ? mockProjectOwnerNotifications
          : mockInvestorNotifications
      )
      setIsLoading(false)
    }, 1000)
  }, [user])

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
    toast({
      title: t("notifications.markedAsRead"),
      description: t("notifications.markedAsReadDesc"),
      className: "bg-background/95 border-primary",
    })
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    toast({
      title: t("notifications.allMarkedAsRead"),
      description: t("notifications.allMarkedAsReadDesc"),
      className: "bg-background/95 border-primary",
    })
  }

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notif) => !notif.read)

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center h-[calc(100vh-4rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">{t("common.loading")}</p>
        </div>
      </motion.div>
    )
  }

  if (!user) {
    return (
      <motion.div
        className="text-center py-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="p-10 bg-primary/5 rounded-full w-fit mx-auto mb-5">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-3">{t("auth.unauthenticated")}</h3>
        <p className="text-sm text-muted-foreground">{t("auth.loginPrompt")}</p>
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/login">{t("auth.login")}</Link>
        </Button>
      </motion.div>
    )
  }

  const isProjectOwner = user.userType === "project-owner"
  const isInvestor = user.userType === "investor"

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

      <section className="py-12 md:py-16 relative z-10">
        <div className="container px-4 md:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge
                  variant="outline"
                  className="mb-3 px-4 py-2 text-base font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <span className="text-primary">{t("notifications.title")}</span>
                </Badge>
                <h2 className="text-3xl md:text-4xl font-semibold text-primary">
                  {t("notifications.title")}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {isProjectOwner && t("notifications.projectOwnerDesc")}
                  {isInvestor && t("notifications.investorDesc")}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleMarkAllAsRead}
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={notifications.every((notif) => notif.read)}
                >
                  <span className="flex items-center gap-3">
                    {t("notifications.markAllAsRead")}
                    <CheckCircle className={cn("h-5 w-5", isRtl && "rotate-180")} />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start bg-primary/5 rounded-full p-2 border-primary/20">
                  <TabsTrigger
                    value="all"
                    className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                  >
                    {t("common.all")}                    <Badge className="ml-2 bg-primary/10 text-primary">{notifications.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="rounded-full px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10"
                  >
                    {t("unread")}
                    <Badge className="ml-2 bg-primary/10 text-primary">
                      {notifications.filter((notif) => !notif.read).length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                  {filteredNotifications.length === 0 ? (
                    <motion.div variants={fadeInUp}>
                      <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
                        <div className="py-16 text-center text-muted-foreground">
                          <p className="text-lg font-medium">{t("notifications.noNotifications")}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      className="space-y-4"
                    >
                      {filteredNotifications.map((notification) => (
                        <motion.div key={notification.id} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover">
                          <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl flex items-start p-4">
                            <div className="mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-primary">{notification.title}</h3>
                                {!notification.read && (
                                  <Badge className="bg-primary/10 text-primary">
                                    {t("notifications.new")}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(notification.createdAt, t("language"))}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-primary/20 hover:bg-primary/10 ml-4"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={notification.read}
                              aria-label={t("notifications.markAsRead")}
                            >
                              {t("notifications.markAsRead")}
                            </Button>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}