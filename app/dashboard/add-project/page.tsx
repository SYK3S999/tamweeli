"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, X, PlusCircle } from "lucide-react"
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
  id: "user-123",
  name: "Ahmed Benali",
}

// Schema
const formSchema = z.object({
  name: z.string().min(2, { message: "project.nameError" }).max(100, { message: "project.nameMaxError" }),
  description: z.string().min(10, { message: "project.descriptionError" }).max(1000, { message: "project.descriptionMaxError" }),
  sector: z.string().nonempty({ message: "project.sectorError" }),
  amount: z.coerce
    .number()
    .positive({ message: "project.amountError" })
    .min(1000, { message: "project.amountMinError" })
    .max(10000000, { message: "project.amountMaxError" }),
  contractType: z.string().nonempty({ message: "project.contractTypeError" }),
  location: z.string().min(2, { message: "project.locationError" }).max(100, { message: "project.locationMaxError" }),
  files: z
    .array(
      z.instanceof(File).refine(
        (file) => file.size <= 5 * 1024 * 1024,
        { message: "project.fileSizeError" }
      ).refine(
        (file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
        { message: "project.fileTypeError" }
      )
    )
    .max(5, { message: "project.fileMaxError" })
    .optional(),
})

type Sector = "technology" | "agriculture" | "real-estate" | "education" | "healthcare" | "retail" | "manufacturing" | "other"
type ContractType = "murabaha" | "musharaka" | "mudaraba"

export default function AddProjectPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState(mockUser)
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Simulate user loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sector: "technology",
      amount: 1000,
      contractType: "murabaha",
      location: "",
      files: [],
    },
  })

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter(
        (file) =>
          file.size <= 5 * 1024 * 1024 &&
          ["application/pdf", "image/jpeg", "image/png"].includes(file.type)
      )
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: t("project.fileError"),
          description: t("project.fileValidationError"),
          variant: "destructive",
        })
      }
      setFiles((prev) => [...prev, ...validFiles].slice(0, 5))
      form.setValue("files", [...files, ...validFiles].slice(0, 5))
    }
  }, [files, form, toast, t])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files) {
      const selectedFiles = Array.from(e.dataTransfer.files)
      const validFiles = selectedFiles.filter(
        (file) =>
          file.size <= 5 * 1024 * 1024 &&
          ["application/pdf", "image/jpeg", "image/png"].includes(file.type)
      )
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: t("project.fileError"),
          description: t("project.fileValidationError"),
          variant: "destructive",
        })
      }
      setFiles((prev) => [...prev, ...validFiles].slice(0, 5))
      form.setValue("files", [...files, ...validFiles].slice(0, 5))
    }
  }, [files, form, toast, t])

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    form.setValue("files", files.filter((_, i) => i !== index))
  }, [files, form])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!user) {
        toast({
          title: t("common.error"),
          description: t("auth.unauthenticated"),
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)
      try {
        const fileUrls = await Promise.all(
          files.map(async (file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(file)
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
        toast({
          title: t("project.success"),
          description: t("project.successDescription"),
        })
        router.push("/dashboard")
      } catch (error: any) {
        toast({
          title: t("common.error"),
          description: error.message || t("project.error"),
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [user, files, form, toast, router, t]
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
          <PlusCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-medium mb-2 text-gray-600 dark:text-gray-400">{t("auth.unauthenticated")}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("auth.loginPrompt")}</p>
        <Button variant="link" className="mt-2 text-green-600">
          {t("auth.login")}
        </Button>
      </motion.div>
    )
  }

  function formatFileSize(size: number): React.ReactNode | Iterable<React.ReactNode> {
    throw new Error("Function not implemented.")
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
              <PlusCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {t("dashboard.addProject")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t("dashboard.addProjectDescription")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-gray-600 dark:text-gray-400">{t("project.createProject")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
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
                            className="focus:ring-green-600"
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
                            className="min-h-32 focus:ring-green-600"
                            aria-label={t("project.description")}
                            maxLength={1000}
                          />
                        </FormControl>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                          {field.value?.length || 0}/1000
                        </div>
                        <FormDescription>{t("project.descriptionDescription")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("project.sector")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger
                                className="focus:ring-green-600"
                                aria-label={t("project.sector")}
                              >
                                <SelectValue placeholder={t("project.sectorPlaceholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("project.amount")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="number"
                                min="1000"
                                max="10000000"
                                step="1000"
                                className="focus:ring-green-600 pr-16"
                                aria-label={t("project.amount")}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 font-medium">
                                DZD
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>{t("currency.dzd")}</FormDescription>
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
                                className="focus:ring-green-600"
                                aria-label={t("project.contractType")}
                              >
                                <SelectValue placeholder={t("project.contractTypePlaceholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("project.location")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("project.locationPlaceholder")}
                              className="focus:ring-green-600"
                              aria-label={t("project.location")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("project.files")}</FormLabel>
                        <FormControl>
                          <div
                            className={cn(
                              "relative border-2 border-dashed rounded-lg p-6 text-center",
                              dragActive ? "border-green-600 bg-green-50 dark:bg-green-900/20" : "border-gray-300"
                            )}
                            onDragEnter={() => setDragActive(true)}
                            onDragLeave={() => setDragActive(false)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                          >
                            <Input
                              type="file"
                              multiple
                              className="hidden"
                              id="file-upload"
                              aria-label={t("project.files")}
                              {...field}
                              onChange={handleFileChange}
                              value={undefined}
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex flex-col items-center justify-center"
                            >
                              <Upload className="h-8 w-8 text-green-600 mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t("project.dragDrop")} <span className="text-green-600">{t("project.browse")}</span>
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
                                className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                                variants={fadeInUp}
                              >
                                <div className="flex items-center gap-2">
                                  <Upload className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">{file.name} ({formatFileSize(file.size)})</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFile(index)}
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
                </motion.div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div className="space-y-6" variants={staggerContainer}>
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </motion.div>
  )
}
