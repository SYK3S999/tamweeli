"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { ProjectProvider, useProjects, type Sector, type ContractType } from "@/components/project-provider"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowRight, FileImage, Upload, Trash2, Loader2, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

// Zod schema without file validation
const formSchema = z.object({
  name: z.string().min(2, { message: "project.nameMinLength" }),
  description: z.string().min(10, { message: "project.descriptionMinLength" }),
  sector: z.string().nonempty("project.sectorRequired"),
  amount: z.coerce.number().min(1000000, { message: "project.amountMin" }),
  contractType: z.string().nonempty("project.contractTypeRequired"),
  location: z.string().min(2, { message: "project.locationMinLength" }),
  duration: z.coerce.number().int().min(1, { message: "project.durationMin" }).max(60, { message: "project.durationMax" }),
  returnRate: z.coerce.number().min(0, { message: "project.returnRateMin" }).max(100, { message: "project.returnRateMax" }),
})

// Mock user for testing
const mockUser = {
  id: "user-123",
  name: "Ahmed Benali",
  email: "ahmed@ecosolutions.dz",
}

// Dynamic import to disable SSR
const CreateProjectContent = dynamic(() => Promise.resolve(CreateProjectContentComponent), { ssr: false })

export default function CreateProjectPage() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <CreateProjectContent />
      </ProjectProvider>
    </AuthProvider>
  )
}

function CreateProjectContentComponent() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { user, isAuthenticated } = useAuth()
  const { addProject, isLoading } = useProjects()
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sector: "technology",
      amount: 1000000,
      contractType: "murabaha",
      location: "",
      duration: 12,
      returnRate: 5,
    },
  })

  const validateFiles = useCallback((files: File[]): boolean => {
    if (files.length > 5) {
      toast({
        title: t("project.maxFiles"),
        description: t("project.maxFilesDesc"),
        variant: "destructive",
      })
      return false
    }
    const valid = files.every(
      (file) => ["image/jpeg", "image/png"].includes(file.type) && file.size <= 5 * 1024 * 1024
    )
    if (!valid) {
      toast({
        title: t("project.invalidFiles"),
        description: t("project.invalidFilesDesc"),
        variant: "destructive",
      })
    }
    return valid
  }, [toast, t])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selectedFiles = Array.from(e.target.files)
    if (!validateFiles(selectedFiles)) return
    setFiles(selectedFiles)

    const newPreviews: string[] = []
    selectedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === selectedFiles.length) {
            setPreviewImages(newPreviews)
          }
        }
      }
      reader.onerror = () => {
        toast({
          title: t("project.fileReadError"),
          description: t("project.fileReadErrorDesc"),
          variant: "destructive",
        })
      }
      reader.readAsDataURL(file)
    })
  }, [validateFiles, toast, t])

  const handleRemoveFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviewImages(newPreviews)
  }, [files, previewImages])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!e.dataTransfer.files) return
    const selectedFiles = Array.from(e.dataTransfer.files)
    if (!validateFiles(selectedFiles)) return
    setFiles(selectedFiles)

    const newPreviews: string[] = []
    selectedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === selectedFiles.length) {
            setPreviewImages(newPreviews)
          }
        }
      }
      reader.onerror = () => {
        toast({
          title: t("project.fileReadError"),
          description: t("project.fileReadErrorDesc"),
          variant: "destructive",
        })
      }
      reader.readAsDataURL(file)
    })
  }, [validateFiles, toast, t])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!isAuthenticated || !user) {
        toast({
          title: t("auth.loginRequired"),
          description: t("auth.loginToCreateProject"),
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      try {
        const fileUrls = await Promise.all(
          files.map(
            (file) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.readAsDataURL(file)
              })
          )
        )

        await addProject({
          ownerId: user.id,
          ownerName: user.name || user.email || "Anonymous",
          name: values.name,
          description: values.description,
          sector: values.sector as Sector,
          amount: values.amount,
          returnRate: values.returnRate,
          contractType: values.contractType as ContractType,
          location: values.location,
          images: fileUrls,
          duration: values.duration,
        })

        toast({
          title: t("project.created"),
          description: t("project.createdDesc"),
        })
        router.push("/dashboard")
      } catch (error) {
        console.error("Failed to add project:", error)
        toast({
          title: t("project.error"),
          description: t("project.errorDesc"),
          variant: "destructive",
        })
      }
    },
    [isAuthenticated, user, addProject, toast, router, files, t]
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

  if (!isClient) {
    return <SkeletonLoader />
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        className="container py-12 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-medium mb-2 text-gray-600 dark:text-gray-400">{t("auth.unauthenticated")}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("auth.loginToCreateProject")}</p>
        <Button
          variant="link"
          onClick={() => router.push("/auth/login")}
          className="mt-2 text-green-600 dark:text-green-500"
        >
          {t("auth.login")}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar className="sticky top-0 z-50" />
      <main className="flex-1 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-green-900/20"></div>
        <div className="container relative z-10 max-w-3xl">
          <motion.div
            className="sticky top-16 z-20 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileImage className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {t("project.createNew")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{t("project.createNewDesc")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{t("project.projectDetails")}</CardTitle>
                <CardDescription>{t("project.projectDetailsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(() => setOpenConfirmDialog(true))} className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("project.name")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("project.namePlaceholder")}
                                {...field}
                                aria-label={t("project.name")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("project.description")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("project.descriptionPlaceholder")}
                                className="min-h-[120px]"
                                {...field}
                                aria-label={t("project.description")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="sector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.sector")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger aria-label={t("project.sector")}>
                                    <SelectValue placeholder={t("project.sectorPlaceholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-800 border-green-300 dark:border-gray-700">
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
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.amount")}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1000000"
                                  step="100000"
                                  placeholder="1000000"
                                  {...field}
                                  aria-label={t("project.amount")}
                                />
                              </FormControl>
                              <FormDescription>{t("common.currency")}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="contractType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.contractType")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger aria-label={t("project.contractType")}>
                                    <SelectValue placeholder={t("project.contractTypePlaceholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-800 border-green-300 dark:border-gray-700">
                                  {contractTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.location")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("project.locationPlaceholder")}
                                  {...field}
                                  aria-label={t("project.location")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.duration")}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="60"
                                  placeholder="12"
                                  {...field}
                                  aria-label={t("project.duration")}
                                />
                              </FormControl>
                              <FormDescription>{t("project.durationMonths")}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="returnRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.returnRate")}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  placeholder="5"
                                  {...field}
                                  aria-label={t("project.returnRate")}
                                />
                              </FormControl>
                              <FormDescription>{t("project.returnRateDesc")}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={fadeInUp}>
                      <Separator className="my-6 bg-green-200 dark:bg-gray-700" />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <FormItem>
                        <FormLabel>{t("project.images")}</FormLabel>
                        <FormControl>
                          <div className="grid gap-4">
                            <div
                              className={cn(
                                "flex items-center justify-center w-full border-2 border-dashed rounded-lg",
                                isDragging ? "border-green-600 bg-green-100" : "border-gray-300 dark:border-gray-600"
                              )}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <label
                                htmlFor="file-upload"
                                className={cn(
                                  "flex flex-col items-center justify-center w-full h-32 cursor-pointer",
                                  isDragging ? "bg-green-200 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800/50"
                                )}
                              >
                                <div className="flex flex-col items-center justify-center py-4">
                                  <Upload className="w-6 h-6 mb-2 text-green-600 dark:text-green-400" />
                                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                    {isDragging ? t("project.dropFiles") : t("project.dragAndDrop")}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {t("project.fileTypes")}
                                  </p>
                                </div>
                                <Input
                                  id="file-upload"
                                  type="file"
                                  multiple
                                  accept="image/jpeg,image/png"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>

                            {previewImages.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {previewImages.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                                  >
                                    <img
                                      src={preview}
                                      alt={t("project.preview")}
                                      className="w-full h-full object-cover"
                                      onError={() =>
                                        toast({
                                          title: t("project.imageLoadError"),
                                          description: t("project.imageLoadErrorDesc"),
                                          variant: "destructive",
                                        })
                                      }
                                    />
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                      onClick={() => handleRemoveFile(index)}
                                      aria-label={t("project.removeImage")}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>{t("project.imagesDescription")}</FormDescription>
                      </FormItem>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.push("/projects")}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        {t("common.cancel")}
                      </Button>
                      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
                        <DialogTrigger asChild>
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isLoading || !isAuthenticated}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <>
                                {t("project.submitForReview")}
                                <ArrowRight
                                  className={cn("h-4 w-4", isRtl ? "mr-2" : "ml-2")}
                                />
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-800 border-none">
                          <motion.div
                            variants={dialogVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <DialogHeader>
                              <DialogTitle className="text-lg text-green-600 dark:text-green-400">{t("project.confirmSubmission")}</DialogTitle>
                              <DialogDescription>{t("project.confirmSubmissionDesc")}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setOpenConfirmDialog(false)}
                                className="border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                {t("common.cancel")}
                              </Button>
                              <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  t("project.confirm")
                                )}
                              </Button>
                            </DialogFooter>
                          </motion.div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div
      className="container py-12 max-w-3xl"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </motion.div>
  )
}
