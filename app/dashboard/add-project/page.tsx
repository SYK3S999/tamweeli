"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, X, PlusCircle, ArrowRight, Image, Link } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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

// Mock user data
const mockUser = {
  id: "user-123",
  name: "Ahmed Benali",
  email: "ahmed.benali@tamweeli.dz",
  wilaya: "Alger",
}

// Algerian wilayas
const algerianWilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane",
]

// Schema
const formSchema = z.object({
  name: z.string().min(2, { message: "project.nameError" }).max(100, { message: "project.nameMaxError" }),
  description: z.string().min(10, { message: "project.descriptionError" }).max(1000, { message: "project.descriptionMaxError" }),
  sector: z.string().nonempty({ message: "project.sectorError" }),
  amount: z.coerce
    .number()
    .positive({ message: "project.amountError" })
    .min(100000, { message: "project.amountMinError" })
    .max(1000000000, { message: "project.amountMaxError" }),
  fundingGoal: z.coerce
    .number()
    .positive({ message: "project.fundingGoalError" })
    .min(100000, { message: "project.fundingGoalMinError" })
    .max(1000000000, { message: "project.fundingGoalMaxError" }),
  duration: z.coerce
    .number()
    .positive({ message: "project.durationError" })
    .min(6, { message: "project.durationMinError" })
    .max(60, { message: "project.durationMaxError" }),
  expectedReturn: z.coerce
    .number()
    .positive({ message: "project.expectedReturnError" })
    .min(1, { message: "project.expectedReturnMinError" })
    .max(50, { message: "project.expectedReturnMaxError" }),
  riskLevel: z.enum(["low", "moderate", "high"], { message: "project.riskLevelError" }),
  contractType: z.string().nonempty({ message: "project.contractTypeError" }),
  location: z.string().nonempty({ message: "project.locationError" }),
  files: z
    .array(
      z.instanceof(File).refine(
        (file) => file.size <= 5 * 1024 * 1024,
        { message: "project.fileSizeError" }
      ).refine(
        (file) => ["application/pdf"].includes(file.type),
        { message: "project.fileTypeError" }
      )
    )
    .max(5, { message: "project.fileMaxError" })
    .optional(),
  images: z
    .array(
      z.instanceof(File).refine(
        (file) => file.size <= 2 * 1024 * 1024,
        { message: "project.imageSizeError" }
      ).refine(
        (file) => ["image/jpeg", "image/png"].includes(file.type),
        { message: "project.imageTypeError" }
      )
    )
    .max(3, { message: "project.imageMaxError" })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>
type Sector = "technology" | "agriculture" | "real-estate" | "education" | "healthcare" | "retail" | "manufacturing" | "other"
type ContractType = "murabaha" | "musharaka" | "mudaraba"

export default function AddProjectPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState(mockUser)
  const [files, setFiles] = useState<File[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState({ files: false, images: false })
  const [currentStep, setCurrentStep] = useState(1)

  // Simulate user loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sector: "technology",
      amount: 100000,
      fundingGoal: 100000,
      duration: 12,
      expectedReturn: 5,
      riskLevel: "low",
      contractType: "murabaha",
      location: user.wilaya || "Alger",
      files: [],
      images: [],
    },
  })

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "files" | "images") => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter((file) => {
        const maxSize = type === "files" ? 5 * 1024 * 1024 : 2 * 1024 * 1024
        const validTypes = type === "files" ? ["application/pdf"] : ["image/jpeg", "image/png"]
        return file.size <= maxSize && validTypes.includes(file.type)
      })
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: t("project.fileError"),
          description: t(type === "files" ? "project.fileValidationError" : "project.imageValidationError"),
          variant: "destructive",
          className: "bg-background/95 border-primary/20",
        })
      }
      if (type === "files") {
        setFiles((prev) => [...prev, ...validFiles].slice(0, 5))
        form.setValue("files", [...files, ...validFiles].slice(0, 5))
      } else {
        const newImages = [...images, ...validFiles].slice(0, 3)
        setImages(newImages)
        form.setValue("images", newImages)
        // Generate previews
        const previews = newImages.map((file) => URL.createObjectURL(file))
        setImagePreviews(previews)
      }
    }
  }, [files, images, form, toast, t])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, type: "files" | "images") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))
    if (e.dataTransfer.files) {
      const selectedFiles = Array.from(e.dataTransfer.files)
      const validFiles = selectedFiles.filter((file) => {
        const maxSize = type === "files" ? 5 * 1024 * 1024 : 2 * 1024 * 1024
        const validTypes = type === "files" ? ["application/pdf"] : ["image/jpeg", "image/png"]
        return file.size <= maxSize && validTypes.includes(file.type)
      })
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: t("project.fileError"),
          description: t(type === "files" ? "project.fileValidationError" : "project.imageValidationError"),
          variant: "destructive",
          className: "bg-background/95 border-primary/20",
        })
      }
      if (type === "files") {
        setFiles((prev) => [...prev, ...validFiles].slice(0, 5))
        form.setValue("files", [...files, ...validFiles].slice(0, 5))
      } else {
        const newImages = [...images, ...validFiles].slice(0, 3)
        setImages(newImages)
        form.setValue("images", newImages)
        const previews = newImages.map((file) => URL.createObjectURL(file))
        setImagePreviews(previews)
      }
    }
  }, [files, images, form, toast, t])

  const handleRemoveFile = useCallback((index: number, type: "files" | "images") => {
    if (type === "files") {
      setFiles((prev) => prev.filter((_, i) => i !== index))
      form.setValue("files", files.filter((_, i) => i !== index))
    } else {
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
      form.setValue("images", newImages)
      setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }
  }, [files, images, form])

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (!user) {
        toast({
          title: t("common.error"),
          description: t("auth.unauthenticated"),
          variant: "destructive",
          className: "bg-background/95 border-primary/20",
        })
        return
      }

      setIsSubmitting(true)
      try {
        // Simulate file/image upload
        const fileUrls = await Promise.all(
          files.map(async (file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(file)
            })
          })
        )
        const imageUrls = await Promise.all(
          images.map(async (image) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(image)
            })
          })
        )

        // Mock addProject
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (values.name === "error") {
              reject(new Error("Invalid project name"))
            } else {
              resolve(null)
            }
          }, 1000)
        })

        form.reset()
        setFiles([])
        setImages([])
        setImagePreviews([])
        toast({
          title: t("project.success"),
          description: t("project.successDescription"),
          className: "bg-background/95 border-primary",
        })
        router.push("/dashboard")
      } catch (error: any) {
        toast({
          title: t("common.error"),
          description: error.message || t("project.error"),
          variant: "destructive",
          className: "bg-background/95 border-primary/20",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [user, files, images, form, toast, router, t]
  )

  const sectors = [
    { value: "technology", label: t("sectors.technology") },
    { value: "agriculture", label: t("sectors.agriculture") },
    { value: "real-estate", label: t("sectors.realEstate") },
    { value: "education", label: t("sectors.education") },
    { value: "healthcare", label: t("sectors.healthcare") },
    { value: "retail", label: t("sectors.retail") },
    { value: "manufacturing", label: t("sectors.manufacturing") },
    { value: "other", label: t("sectors.other") },
  ]

  const contractTypes = [
    { value: "murabaha", label: t("contractTypes.murabaha") },
    { value: "musharaka", label: t("contractTypes.musharaka") },
    { value: "mudaraba", label: t("contractTypes.mudaraba") },
  ]

  const riskLevels = [
    { value: "low", label: t("project.riskLevelLow") },
    { value: "moderate", label: t("project.riskLevelModerate") },
    { value: "high", label: t("project.riskLevelHigh") },
  ]

  const steps = [
    { id: 1, label: t("project.stepBasicInfo") },
    { id: 2, label: t("project.stepFinancialDetails") },
    { id: 3, label: t("project.stepDocuments") },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

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
          <PlusCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-3">{t("auth.unauthenticated")}</h3>
        <p className="text-sm text-muted-foreground">{t("auth.loginPrompt")}</p>
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/login">{t("auth.login")}</Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

      <section className="container mx-auto py-12 max-w-3xl relative z-10">
        <motion.div variants={staggerContainer} initial="visible" animate="visible" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <Badge
              variant="outline"
              className="mb-3 px-4 py-2 text-base font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
            >
              <span className="text-primary">{t("dashboard.addProject")}</span>
            </Badge>
            <h1 className="text-3xl md:text-4xl font-semibold text-primary-800">{t("dashboard.addProject")}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {t("dashboard.add-project-description")}
            </p>
          </motion.div>

          {/* Progress Tracker */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-col">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                      currentStep >= step.id ? "bg-primary text-white" : "bg-primary/5 text-primary border-primary/20 border"
                    )}
                  >
                    {step.id}
                  </div>
                  <span className="text-sm text-muted-foreground mt-2">{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardHover}>
            <Card className="backdrop-blur-lg bg-background/75 border-primary/20 rounded-3xl shadow-2xl">
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      {currentStep === 1 && (
                        <>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.name")}</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder={t("project.namePlaceholder")}
                                    className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                                    aria-label={t("project.name")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.description")}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder={t("project.descriptionPlaceholder")}
                                    className="min-h-32 rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                                    aria-label={t("project.description")}
                                    maxLength={1000}
                                  />
                                </FormControl>
                                <div className="text-xs text-muted-foreground text-right">
                                  {field.value?.length || 0}/1000
                                </div>
                                <FormDescription>{t("project.descriptionDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.sector")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                                      aria-label={t("project.sector")}
                                    >
                                      <SelectValue placeholder={t("project.sectorPlaceholder")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-background/95 border-primary/20 rounded-xl">
                                    {sectors.map((sector) => (
                                      <SelectItem key={sector.value} value={sector.value}>
                                        {sector.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.location")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                                      aria-label={t("project.location")}
                                    >
                                      <SelectValue placeholder={t("project.locationPlaceholder")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-background/95 border-primary/20 rounded-xl max-h-60">
                                    {algerianWilayas.map((wilaya) => (
                                      <SelectItem key={wilaya} value={wilaya}>
                                        {wilaya}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>{t("project.locationDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {currentStep === 2 && (
                        <>
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.amount")}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="100000"
                                      max="1000000000"
                                      step="1000"
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10 pr-16"
                                      aria-label={t("project.amount")}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                      DZD
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>{t("project.amountDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fundingGoal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.fundingGoal")}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="100000"
                                      max="1000000000"
                                      step="1000"
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10 pr-16"
                                      aria-label={t("project.fundingGoal")}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                      DZD
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>{t("project.fundingGoalDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.duration")}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="6"
                                      max="60"
                                      step="1"
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10 pr-16"
                                      aria-label={t("project.duration")}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                      {t("project.months")}
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>{t("project.durationDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expectedReturn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.expectedReturn")}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="1"
                                      max="50"
                                      step="0.1"
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10 pr-16"
                                      aria-label={t("project.expectedReturn")}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                      %
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>{t("project.expectedReturnDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="riskLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.riskLevel")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                                      aria-label={t("project.riskLevel")}
                                    >
                                      <SelectValue placeholder={t("project.riskLevelPlaceholder")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-background/95 border-primary/20 rounded-xl">
                                    {riskLevels.map((level) => (
                                      <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>{t("project.riskLevelDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contractType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.contractType")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger
                                      className="rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                                      aria-label={t("project.contractType")}
                                    >
                                      <SelectValue placeholder={t("project.contractTypePlaceholder")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-background/95 border-primary/20 rounded-xl">
                                    {contractTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>{t("project.contractTypeDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {currentStep === 3 && (
                        <>
                          <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.files")}</FormLabel>
                                <FormControl>
                                  <div
                                    className={cn(
                                      "relative border-2 border-dashed rounded-xl p-6 text-center",
                                      dragActive.files ? "border-primary bg-primary/5" : "border-primary/20"
                                    )}
                                    onDragEnter={() => setDragActive((prev) => ({ ...prev, files: true }))}
                                    onDragLeave={() => setDragActive((prev) => ({ ...prev, files: false }))}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, "files")}
                                  >
                                    <Input
                                      type="file"
                                      multiple
                                      className="hidden"
                                      id="file-upload"
                                      accept=".pdf"
                                      aria-label={t("project.files")}
                                      onChange={(e) => handleFileChange(e, "files")}
                                      value={undefined}
                                    />
                                    <label
                                      htmlFor="file-upload"
                                      className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                      <Upload className="h-8 w-8 text-primary mb-2" />
                                      <p className="text-sm text-muted-foreground">
                                        {t("project.dragDrop")} <span className="text-primary">{t("project.browse")}</span>
                                      </p>
                                    </label>
                                  </div>
                                </FormControl>
                                {files.length > 0 && (
                                  <motion.div
                                    className="mt-4 space-y-2"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {files.map((file, index) => (
                                      <motion.div
                                        key={file.name}
                                        className="flex items-center justify-between p-2 bg-primary/5 rounded-xl"
                                        variants={fadeInUp}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Upload className="h-4 w-4 text-primary" />
                                          <span className="text-sm">{file.name} ({formatFileSize(file.size)})</span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveFile(index, "files")}
                                          aria-label={t("project.fileRemove")}
                                        >
                                          <X className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                )}
                                <FormDescription>{t("project.filesDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("project.images")}</FormLabel>
                                <FormControl>
                                  <div
                                    className={cn(
                                      "relative border-2 border-dashed rounded-xl p-6 text-center",
                                      dragActive.images ? "border-primary bg-primary/5" : "border-primary/20"
                                    )}
                                    onDragEnter={() => setDragActive((prev) => ({ ...prev, images: true }))}
                                    onDragLeave={() => setDragActive((prev) => ({ ...prev, images: false }))}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, "images")}
                                  >
                                    <Input
                                      type="file"
                                      multiple
                                      className="hidden"
                                      id="image-upload"
                                      accept="image/jpeg,image/png"
                                      aria-label={t("project.images")}
                                      onChange={(e) => handleFileChange(e, "images")}
                                      value={undefined}
                                    />
                                    <label
                                      htmlFor="image-upload"
                                      className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                      <Image className="h-8 w-8 text-primary mb-2" />
                                      <p className="text-sm text-muted-foreground">
                                        {t("project.dragDrop")} <span className="text-primary">{t("project.browse")}</span>
                                      </p>
                                    </label>
                                  </div>
                                </FormControl>
                                {imagePreviews.length > 0 && (
                                  <motion.div
                                    className="mt-4 grid grid-cols-3 gap-2"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {imagePreviews.map((preview, index) => (
                                      <motion.div
                                        key={index}
                                        className="relative"
                                        variants={fadeInUp}
                                      >
                                        <img
                                          src={preview}
                                          alt={`Preview ${index + 1}`}
                                          className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="absolute top-1 right-1 bg-background/50 rounded-full p-1"
                                          onClick={() => handleRemoveFile(index, "images")}
                                          aria-label={t("project.imageRemove")}
                                        >
                                          <X className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                )}
                                <FormDescription>{t("project.imagesDescription")}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </motion.div>

                    <div className="flex justify-between">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-primary/20 hover:bg-primary/10"
                          onClick={handlePreviousStep}
                        >
                          {t("common.previous")}
                        </Button>
                      )}
                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          className="ml-auto rounded-full bg-primary hover:bg-primary/90 group"
                          onClick={handleNextStep}
                        >
                          <span className="flex items-center gap-2">
                            {t("common.next")}
                            <ArrowRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
                          </span>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto rounded-full bg-primary hover:bg-primary/90 w-full max-w-xs"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("common.submitting")}
                            </>
                          ) : (
                            t("common.submit")
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div className="space-y-6" variants={staggerContainer}>
      <div className="h-8 w-64 bg-primary/20 rounded" />
      <div className="h-4 w-96 bg-primary/20 rounded" />
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-primary/20 rounded" />
        ))}
      </div>
    </motion.div>
  )
}