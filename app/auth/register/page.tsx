"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider, useAuth, type UserType } from "@/components/auth-provider"
import { FileUp, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Animation variants from login page
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  idNumber: z.string().min(8, "ID number must be at least 8 characters"),
  idDocument: z.instanceof(File, { message: "Please upload ID document" }),
  address: z.string().min(10, "Address must be at least 10 characters"),
  utilityBill: z.instanceof(File, { message: "Please upload utility bill" }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  birthPlace: z.string().min(2, "Birth place is required"),
  phone: z.string().regex(/^\+?\d{10,}$/, "Invalid phone number"),
  userType: z.enum(["project-owner", "investor"]),
  incomeSource: z.string().optional(),
  incomeProof: z.instanceof(File).optional(),
  hasInvestedBefore: z.boolean().optional(),
  investmentAmount: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms of use" }),
  }),
}).refine(
  (data) => {
    if (data.userType === "investor") {
      return data.incomeSource && data.incomeProof && data.hasInvestedBefore !== undefined && data.investmentAmount;
    }
    return true;
  },
  {
    message: "All investor fields are required",
    path: ["userType"],
  }
);

export default function RegisterPage() {
  return (
    <AuthProvider>
      <Register />
    </AuthProvider>
  )
}

function Register() {
  const { t, direction } = useLanguage()
  const { register, isLoading } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [formProgress, setFormProgress] = useState(0)
  const isRtl = direction === "rtl"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      address: "",
      birthDate: "",
      birthPlace: "",
      phone: "",
      userType: "project-owner",
      hasInvestedBefore: false,
      termsAccepted: true,
    },
  })

  const userType = form.watch("userType") as UserType

  const calculateProgress = (values: Partial<z.infer<typeof formSchema>>) => {
    const totalFields = userType === "investor" ? 14 : 10
    const filledFields = Object.values(values).filter(v => v !== "" && v !== undefined && v !== null).length
    setFormProgress((filledFields / totalFields) * 100)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    try {
      await register({
        ...values,
        idDocument: values.idDocument.name,
        utilityBill: values.utilityBill.name,
        incomeProof: values.incomeProof?.name,
      })
      router.push("/auth/verify")
    } catch (error: any) {
      setError(error.message || t("auth.registrationFailed"))
    }
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

        {/* Register Section */}
        <section className="py-24 md:py-32 relative z-10">
          <div className="container px-4 md:px-6 flex items-center justify-center">
            <motion.div
              className="w-full max-w-2xl"
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
                    <span className="text-primary">{t("auth.register")}</span>
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-2">
                    {t("auth.register")}
                  </h1>
                  <p className="text-muted-foreground">{t("auth.createAccountDescription")}</p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div variants={fadeInUp} className="mb-6">
                  <Progress value={formProgress} className="h-2 bg-primary/20" />
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

                {/* Register Form */}
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    variants={staggerContainer}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <motion.div variants={fadeInUp} className="space-y-2">
                              <FormLabel className="text-sm font-medium text-foreground">{t("auth.firstName")}</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input
                                    placeholder={t("auth.firstNamePlaceholder")}
                                    {...field}
                                    className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                    onChange={(e) => {
                                      field.onChange(e)
                                      calculateProgress(form.getValues())
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </motion.div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <motion.div variants={fadeInUp} className="space-y-2">
                              <FormLabel className="text-sm font-medium text-foreground">{t("auth.lastName")}</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input
                                    placeholder={t("auth.lastNamePlaceholder")}
                                    {...field}
                                    className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                    onChange={(e) => {
                                      field.onChange(e)
                                      calculateProgress(form.getValues())
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </motion.div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className="space-y-2">
                            <FormLabel className="text-sm font-medium text-foreground">{t("auth.idNumber")}</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  placeholder={t("auth.idNumberPlaceholder")}
                                  {...field}
                                  className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                  onChange={(e) => {
                                    field.onChange(e)
                                    calculateProgress(form.getValues())
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </motion.div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idDocument"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className="space-y-2">
                            <FormLabel className="text-sm font-medium text-foreground">{t("auth.idDocument")}</FormLabel>
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-background/95 hover:bg-primary/10 border-primary/20 transition-all duration-300">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                      {value ? value.name : t("auth.uploadIdPlaceholder")}
                                    </p>
                                  </div>
                                  <Input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        onChange(file)
                                        calculateProgress(form.getValues())
                                      }
                                    }}
                                    {...field}
                                  />
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </motion.div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className="space-y-2">
                            <FormLabel className="text-sm font-medium text-foreground">{t("auth.address")}</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  placeholder={t("auth.addressPlaceholder")}
                                  {...field}
                                  className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                  onChange={(e) => {
                                    field.onChange(e)
                                    calculateProgress(form.getValues())
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </motion.div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utilityBill"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className="space-y-2">
                            <FormLabel className="text-sm font-medium text-foreground">{t("auth.utilityBill")}</FormLabel>
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-background/95 hover:bg-primary/10 border-primary/20 transition-all duration-300">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                      {value ? value.name : t("auth.uploadBillPlaceholder")}
                                    </p>
                                  </div>
                                  <Input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        onChange(file)
                                        calculateProgress(form.getValues())
                                      }
                                    }}
                                    {...field}
                                  />
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </motion.div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <motion.div variants={fadeInUp} className="space-y-2">
                              <FormLabel className="text-sm font-medium text-foreground">{t("auth.birthDate")}</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input
                                    type="date"
                                    {...field}
                                    className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                    onChange={(e) => {
                                      field.onChange(e)
                                      calculateProgress(form.getValues())
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </motion.div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({ field }) => (
                          <FormItem>
                            <motion.div variants={fadeInUp} className="space-y-2">
                              <FormLabel className="text-sm font-medium text-foreground">{t("auth.birthPlace")}</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input
                                    placeholder={t("auth.birthPlacePlaceholder")}
                                    {...field}
                                    className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                    onChange={(e) => {
                                      field.onChange(e)
                                      calculateProgress(form.getValues())
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </motion.div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className="space-y-2">
                            <FormLabel className="text-sm font-medium text-foreground">{t("auth.phone")}</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  placeholder={t("auth.phonePlaceholder")}
                                  {...field}
                                  className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                  onChange={(e) => {
                                    field.onChange(e)
                                    calculateProgress(form.getValues())
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </motion.div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className="space-y-2">
                            <FormLabel className="text-sm font-medium text-foreground">{t("auth.userType")}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  calculateProgress(form.getValues())
                                }}
                                defaultValue={field.value}
                                className="flex flex-row space-x-4"
                              >
                                <FormItem className={cn("flex items-center space-x-2 space-y-0", isRtl && "flex-row-reverse")}>
                                  <FormControl>
                                    <RadioGroupItem value="project-owner" />
                                  </FormControl>
                                  <FormLabel className="font-normal text-muted-foreground hover:text-foreground transition-colors">
                                    {t("auth.projectOwner")}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className={cn("flex items-center space-x-2 space-y-0", isRtl && "flex-row-reverse")}>
                                  <FormControl>
                                    <RadioGroupItem value="investor" />
                                  </FormControl>
                                  <FormLabel className="font-normal text-muted-foreground hover:text-foreground transition-colors">
                                    {t("auth.investor")}
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </motion.div>
                        </FormItem>
                      )}
                    />

                    {userType === "investor" && (
                      <motion.div variants={fadeInUp} className="space-y-4 border-t border-primary/20 pt-4">
                        <FormField
                          control={form.control}
                          name="incomeSource"
                          render={({ field }) => (
                            <FormItem>
                              <motion.div variants={fadeInUp} className="space-y-2">
                                <FormLabel className="text-sm font-medium text-foreground">{t("auth.incomeSource")}</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      placeholder={t("auth.incomeSourcePlaceholder")}
                                      {...field}
                                      className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                      onChange={(e) => {
                                        field.onChange(e)
                                        calculateProgress(form.getValues())
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </motion.div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="incomeProof"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <motion.div variants={fadeInUp} className="space-y-2">
                                <FormLabel className="text-sm font-medium text-foreground">{t("auth.incomeProof")}</FormLabel>
                                <FormControl>
                                  <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-background/95 hover:bg-primary/10 border-primary/20 transition-all duration-300">
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUp className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary" />
                                        <p className="text-sm text-muted-foreground">
                                          {value ? value.name : t("auth.uploadIncomeProofPlaceholder")}
                                        </p>
                                      </div>
                                      <Input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0]
                                          if (file) {
                                            onChange(file)
                                            calculateProgress(form.getValues())
                                          }
                                        }}
                                        {...field}
                                      />
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </motion.div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hasInvestedBefore"
                          render={({ field }) => (
                            <FormItem>
                              <motion.div variants={fadeInUp} className={cn("flex items-center space-x-3 space-y-0", isRtl && "flex-row-reverse")}>
                                <FormControl>
                                  <div className="relative">
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked)
                                        calculateProgress(form.getValues())
                                      }}
                                      className="sr-only"
                                    />
                                    <div
                                      className={cn(
                                        "w-5 h-5 rounded border-2 transition-all duration-200",
                                        field.value
                                          ? "bg-primary border-primary"
                                          : "border-primary/20 group-hover:border-primary/30"
                                      )}
                                    >
                                      {field.value && (
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
                                </FormControl>
                                <FormLabel className="font-normal text-muted-foreground group-hover:text-foreground transition-colors">
                                  {t("auth.hasInvestedBefore")}
                                </FormLabel>
                              </motion.div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="investmentAmount"
                          render={({ field }) => (
                            <FormItem>
                              <motion.div variants={fadeInUp} className="space-y-2">
                                <FormLabel className="text-sm font-medium text-foreground">{t("auth.investmentAmount")}</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      type="number"
                                      placeholder={t("auth.investmentAmountPlaceholder")}
                                      {...field}
                                      className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
                                      onChange={(e) => {
                                        field.onChange(e)
                                        calculateProgress(form.getValues())
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </motion.div>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem>
                          <motion.div variants={fadeInUp} className={cn("flex items-center space-x-3 space-y-0", isRtl && "flex-row-reverse")}>
                            <FormControl>
                              <div className="relative">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    calculateProgress(form.getValues())
                                  }}
                                  className="sr-only"
                                />
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded border-2 transition-all duration-200",
                                    field.value
                                      ? "bg-primary border-primary"
                                      : "border-primary/20 group-hover:border-primary/30"
                                  )}
                                >
                                  {field.value && (
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
                            </FormControl>
                            <FormLabel className="font-normal text-muted-foreground group-hover:text-foreground transition-colors">
                              {t("auth.acceptTerms")}{" "}
                              <Link href="/terms" className="text-primary hover:text-primary/90">
                                {t("auth.termsLink")}
                              </Link>
                            </FormLabel>
                          </motion.div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.div variants={fadeInUp}>
                      <Button
                        type="submit"
                        className="w-full rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("common.loading")}
                          </>
                        ) : (
                          <span className="flex items-center gap-3">
                            {t("auth.register")}
                            <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </Form>

                {/* Footer Links */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 text-center space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {t("auth.alreadyAccount")}{" "}
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/90 p-0"
                      onClick={() => router.push("/auth/login")}
                    >
                      {t("auth.login")}
                    </Button>
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