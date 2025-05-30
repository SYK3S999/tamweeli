"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { ProjectProvider, useProjects, type Sector, type ContractType } from "@/components/project-provider"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowRight, FileImage, Upload, Trash2, Loader2 } from "lucide-react"
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "project.nameMinLength",
  }),
  description: z.string().min(10, {
    message: "project.descriptionMinLength",
  }),
  sector: z.string().nonempty("project.sectorRequired"),
  amount: z.coerce.number().min(1000000, {
    message: "project.amountMin",
  }),
  contractType: z.string().nonempty("project.contractTypeRequired"),
  location: z.string().min(2, {
    message: "project.locationMinLength",
  }),
  duration: z.coerce.number().int().min(1, {
    message: "project.durationMin",
  }).max(60, {
    message: "project.durationMax",
  }),
  returnRate: z.coerce.number().min(0, {
    message: "project.returnRateMin",
  }).max(100, {
    message: "project.returnRateMax",
  }),
  files: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length <= 5, {
      message: "project.maxFiles",
    })
    .refine((files) => !files || Array.from(files).every((file) => file.size <= 5 * 1024 * 1024), {
      message: "project.maxFileSize",
    })
    .refine((files) => !files || Array.from(files).every((file) => ["image/jpeg", "image/png"].includes(file.type)), {
      message: "project.invalidFileType",
    }),
})

export default function CreateProjectPage() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <CreateProjectContent />
      </ProjectProvider>
    </AuthProvider>
  )
}

function CreateProjectContent() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const { user, isAuthenticated } = useAuth()
  const { addProject, isLoading } = useProjects()
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

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
      files: undefined,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter(
        (file) => ["image/jpeg", "image/png"].includes(file.type) && file.size <= 5 * 1024 * 1024,
      )
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: t("project.invalidFiles"),
          description: t("project.invalidFilesDesc"),
          variant: "destructive",
        })
      }
      if (validFiles.length > 5) {
        toast({
          title: t("project.maxFiles"),
          description: t("project.maxFilesDesc"),
          variant: "destructive",
        })
        validFiles.splice(5)
      }
      setFiles(validFiles)
      form.setValue("files", e.target.files)

      const newPreviewImages: string[] = []
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string)
          if (newPreviewImages.length === validFiles.length) {
            setPreviewImages(newPreviewImages)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviewImages(newPreviews)
    form.setValue("files", newFiles.length > 0 ? new DataTransfer().files : undefined)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      const selectedFiles = Array.from(e.dataTransfer.files)
      const validFiles = selectedFiles.filter(
        (file) => ["image/jpeg", "image/png"].includes(file.type) && file.size <= 5 * 1024 * 1024,
      )
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: t("project.invalidFiles"),
          description: t("project.invalidFilesDesc"),
          variant: "destructive",
        })
      }
      if (validFiles.length > 5) {
        toast({
          title: t("project.maxFiles"),
          description: t("project.maxFilesDesc"),
          variant: "destructive",
        })
        validFiles.splice(5)
      }
      setFiles(validFiles)
      form.setValue("files", e.dataTransfer.files)

      const newPreviewImages: string[] = []
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string)
          if (newPreviewImages.length === validFiles.length) {
            setPreviewImages(newPreviewImages)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        files.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        }),
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
  }

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 dark:opacity-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                {t("project.createNew")}
              </h1>
              <p className="text-lg text-muted-foreground font-medium mt-2">
                {t("project.createNewDesc")}
              </p>
            </motion.div>

            {!isAuthenticated && (
              <motion.div variants={fadeInUp}>
                <Alert variant="destructive" className="mb-6 bg-background/90 backdrop-blur-sm border-primary/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("auth.loginRequired")}</AlertTitle>
                  <AlertDescription>{t("auth.loginToCreateProject")}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <Card className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t("project.projectDetails")}
                  </CardTitle>
                  <CardDescription className="text-base">{t("project.projectDetailsDesc")}</CardDescription>
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
                                  className="min-h-32"
                                  {...field}
                                  aria-label={t("project.description")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                  <SelectContent className="bg-background/90 backdrop-blur-sm border-primary/30">
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
                                  <SelectContent className="bg-background/90 backdrop-blur-sm border-primary/30">
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
                        <Separator className="my-6 bg-primary/30" />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <FormField
                          control={form.control}
                          name="files"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("project.images")}</FormLabel>
                              <FormControl>
                                <div className="grid gap-4">
                                  <div
                                    className={cn(
                                      "flex items-center justify-center w-full",
                                      isDragging ? "border-primary/50 bg-primary/10" : "border-muted-foreground/30",
                                    )}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                  >
                                    <label
                                      htmlFor="file-upload"
                                      className={cn(
                                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
                                        isDragging ? "bg-primary/20" : "bg-muted/30 hover:bg-muted/50",
                                      )}
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                          {isDragging ? t("project.dropFiles") : t("project.dragAndDrop")}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{t("project.fileTypes")}</p>
                                      </div>
                                      <Input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                      />
                                    </label>
                                  </div>

                                  {previewImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {previewImages.map((preview, index) => (
                                        <div
                                          key={index}
                                          className="relative aspect-square rounded-md overflow-hidden border"
                                        >
                                          <img
                                            src={preview || "/placeholder.svg"}
                                            alt={`${t("project.preview")} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} className="flex justify-between">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => router.push("/projects")}
                          className="rounded-full border-primary/30 hover:bg-primary/10"
                        >
                          {t("common.cancel")}
                        </Button>
                        <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
                          <DialogTrigger asChild>
                            <Button
                              type="submit"
                              className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                              disabled={isLoading || !isAuthenticated}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <>
                                  {t("project.submitForReview")}
                                  <ArrowRight
                                    className={cn(
                                      "h-4 w-4 transition-transform group-hover:translate-x-2",
                                      rtl ? "mr-2" : "ml-2",
                                    )}
                                  />
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-background/90 backdrop-blur-sm border-primary/30">
                            <DialogHeader>
                              <DialogTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {t("project.confirmSubmission")}
                              </DialogTitle>
                              <DialogDescription>{t("project.confirmSubmissionDesc")}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setOpenConfirmDialog(false)}
                                className="rounded-full border-primary/30 hover:bg-primary/10"
                              >
                                {t("common.cancel")}
                              </Button>
                              <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-secondary"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  t("project.confirm")
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}