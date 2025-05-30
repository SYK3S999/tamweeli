"use client"

import { useState, useCallback, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Settings, User, Lock, Bell, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
}

// Mock user data
const mockUser = {
  name: "Ahmed Benali",
  email: "ahmed@example.com",
  bio: "Passionate about sustainable investments.",
  phone: "+213555123456",
  website: "https://ahmedbenali.com",
}

// Schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string().max(200, { message: "Bio must be 200 characters or less." }).optional(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Invalid phone number format." })
    .optional()
    .or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
})

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  projectUpdates: z.boolean(),
  investmentUpdates: z.boolean(),
  serviceUpdates: z.boolean(),
})

export default function SettingsPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { toast } = useToast()
  const [user, setUser] = useState(mockUser)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Simulate user loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      website: user?.website || "",
    },
  })

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
      projectUpdates: true,
      investmentUpdates: true,
      serviceUpdates: true,
    },
  })

  const onProfileSubmit = useCallback(
    async (values: z.infer<typeof profileFormSchema>) => {
      setIsUpdating(true)
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (values.email === "taken@example.com") {
              reject(new Error("Email already in use"))
            } else {
              resolve(null)
            }
          }, 1000)
        })
        setUser({
          name: values.name,
          email: values.email,
          bio: values.bio || '',
          phone: values.phone || '',
          website: values.website || '',
        })
        profileForm.reset(values)
        toast({
          title: t("settings.updateSuccess"),
          description: t("settings.profileUpdated"),
        })
      } catch (error: any) {
        toast({
          title: t("settings.updateFailed"),
          description: error.message || t("settings.profileUpdateError"),
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    },
    [profileForm, toast, t]
  )

  const onSecuritySubmit = useCallback(
    async (values: z.infer<typeof securityFormSchema>) => {
      setIsUpdating(true)
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (values.currentPassword === "wrong") {
              reject(new Error("Incorrect current password"))
            } else {
              resolve(null)
            }
          }, 1000)
        })
        securityForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        toast({
          title: t("settings.updateSuccess"),
          description: t("settings.passwordUpdated"),
        })
      } catch (error: any) {
        toast({
          title: t("settings.updateFailed"),
          description: error.message || t("settings.passwordUpdateError"),
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    },
    [securityForm, toast, t]
  )

  const onNotificationSubmit = useCallback(
    async (values: z.infer<typeof notificationFormSchema>) => {
      setIsUpdating(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        notificationForm.reset(values)
        toast({
          title: t("settings.updateSuccess"),
          description: t("settings.notificationsUpdated"),
        })
      } catch (error) {
        toast({
          title: t("settings.updateFailed"),
          description: t("settings.notificationsUpdateError"),
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    },
    [notificationForm, toast, t]
  )

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center h-[calc(100vh-4rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
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
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
          <User className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-medium mb-2 text-gray-600 dark:text-gray-400">{t("settings.noUser")}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("settings.loginPrompt")}</p>
        <Button variant="link" className="mt-2 text-green-600">
          {t("auth.login")}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className={`container py-8 max-w-4xl ${isRtl ? "rtl" : "ltr"}`}>
      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {t("dashboard.settings")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t("settings.stayConnected")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-green-50 dark:bg-green-900/20 p-1 h-12 sticky top-16 z-10">
          <TabsTrigger
            value="profile"
            className="h-10 px-6 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white"
            aria-label={t("settings.profileTab")}
          >
            <User className="h-4 w-4 mr-2" />
            {t("settings.profile")}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="h-10 px-6 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white"
            aria-label={t("settings.securityTab")}
          >
            <Lock className="h-4 w-4 mr-2" />
            {t("settings.security")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="h-10 px-6 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white"
            aria-label={t("settings.notificationsTab")}
          >
            <Bell className="h-4 w-4 mr-2" />
            {t("settings.notifications")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-600 dark:text-gray-400">{t("settings.profile")}</CardTitle>
                <CardDescription>{t("settings.profileDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.name")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("settings.namePlaceholder")}
                              className="focus:ring-green-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder={t("settings.emailPlaceholder")}
                              className="focus:ring-green-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.bio")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("settings.bioPlaceholder")}
                              className="focus:ring-green-600"
                              maxLength={200}
                            />
                          </FormControl>
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                            {field.value?.length || 0}/200
                          </div>
                          <FormDescription>{t("settings.bioDescription")}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("settings.phone")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("settings.phonePlaceholder")}
                                className="focus:ring-green-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("settings.website")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("settings.websitePlaceholder")}
                                className="focus:ring-green-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("common.loading")}
                        </>
                      ) : (
                        t("settings.updateProfileBtn")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-600 dark:text-gray-400">{t("settings.security")}</CardTitle>
                <CardDescription>{t("settings.securityDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.currentPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showCurrentPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="focus:ring-green-600 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                aria-label={t("settings.togglePasswordVisibility")}
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.newPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showNewPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className="focus:ring-green-600 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label={t("settings.togglePasswordVisibility")}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.confirmNewPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className="focus:ring-green-600 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={t("settings.togglePasswordVisibility")}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("common.loading")}
                        </>
                      ) : (
                        t("settings.updatePassword")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-600 dark:text-gray-400">{t("settings.notifications")}</CardTitle>
                <CardDescription>{t("settings.notificationsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-green-50 dark:hover:bg-green-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{t("settings.emailNotifications")}</FormLabel>
                              <FormDescription>{t("settings.emailNotificationsDesc")}</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-green-50 dark:hover:bg-green-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{t("settings.marketingEmails")}</FormLabel>
                              <FormDescription>{t("settings.marketingEmailsDesc")}</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="projectUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-green-50 dark:hover:bg-green-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{t("settings.projectUpdates")}</FormLabel>
                              <FormDescription>{t("settings.projectUpdatesDesc")}</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="investmentUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-green-50 dark:hover:bg-green-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{t("settings.investmentUpdates")}</FormLabel>
                              <FormDescription>{t("settings.investmentUpdatesDesc")}</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="serviceUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-green-50 dark:hover:bg-green-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{t("settings.serviceUpdates")}</FormLabel>
                              <FormDescription>{t("settings.serviceUpdatesDesc")}</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("common.loading")}
                        </>
                      ) : (
                        t("settings.savePreferences")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div className="space-y-6" variants={staggerContainer}>
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </motion.div>
  )
}
