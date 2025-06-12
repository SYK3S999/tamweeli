"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Mail, MapPin, Phone, Loader2, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
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

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const formSchema = z.object({
  name: z.string().min(2, { message: "contact.nameError" }),
  email: z.string().email({ message: "contact.emailError" }),
  subject: z.string().min(5, { message: "contact.subjectError" }),
  message: z.string().min(10, { message: "contact.messageError" }),
})

export default function ContactPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast({
          title: t("contact.messageSent"),
          description: t("contact.messageSentDesc"),
        })
        form.reset()
        setIsSuccessDialogOpen(true)
      } catch (error) {
        toast({
          title: t("contact.error"),
          description: t("contact.errorDesc"),
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [form, toast, t]
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
                <Mail className="w-4 h-4 mr-2 text-primary animate-pulse" />
                <span className="text-primary">{t("contact.getInTouch")}</span>
              </Badge>
              <h1 className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight">
                {t("contact.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("contact.subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 relative z-10">
          <div className="container px-4 md:px-6">
            <motion.div
              className="grid gap-12 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Contact Information */}
              <div className="md:col-span-1 space-y-8">
                <motion.div variants={fadeInUp}>
                  <Card className="border border-primary/20 bg-background/95 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-primary">
                        {t("contact.contactInfo")}
                      </CardTitle>
                      <CardDescription>{t("contact.getInTouchDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <TooltipProvider>
                        {[
                          {
                            icon: MapPin,
                            label: t("contact.address"),
                            tooltip: t("contact.addressTooltip"),
                            content: ["123 Rue de la Révolution", "Guelma 24000", "Algeria"],
                          },
                          {
                            icon: Phone,
                            label: t("contact.phone"),
                            tooltip: t("contact.phoneTooltip"),
                            content: ["+213 37 12 34 56"],
                          },
                          {
                            icon: Mail,
                            label: t("contact.email"),
                            tooltip: t("contact.emailTooltip"),
                            content: ["contact@tamweeli.dz"],
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="group flex items-start p-4 rounded-xl hover:bg-primary/10 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 mr-4">
                                  <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{item.tooltip}</TooltipContent>
                            </Tooltip>
                            <div>
                              <h3 className="text-base font-semibold text-primary mb-1">{item.label}</h3>
                              {item.content.map((line, i) => (
                                <p key={i} className="text-sm text-muted-foreground">
                                  {line}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </TooltipProvider>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="border border-primary/20 bg-background/95 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-primary">
                        {t("contact.businessHours")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { day: t("contact.weekdays"), hours: "08:00 - 17:00" },
                        { day: t("contact.saturday"), hours: "09:00 - 13:00" },
                        { day: t("contact.sunday"), hours: t("contact.closed") },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="group flex justify-between items-center p-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">{item.day}</span>
                          <span className="text-sm font-semibold text-primary">{item.hours}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Contact Form */}
              <motion.div className="md:col-span-2" variants={fadeInUp}>
                <Card className="border border-primary/20 bg-background/95 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-primary">
                      {t("contact.sendMessage")}
                    </CardTitle>
                    <CardDescription>{t("contact.sendMessageDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          {[
                            { name: "name", placeholder: t("contact.namePlaceholder"), label: t("contact.name") },
                            { name: "email", placeholder: t("contact.emailPlaceholder"), label: t("contact.email") },
                          ].map((field) => (
                            <FormField
                              key={field.name}
                              control={form.control}
                              name={field.name as "name" | "email"}
                              render={({ field: formField }) => (
                                <FormItem>
                                  <FormLabel>{field.label}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={field.placeholder}
                                      {...formField}
                                      aria-label={field.label}
                                      className="border-primary/20 focus:border-primary hover:bg-primary/10 rounded-xl transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.subject")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("contact.subjectPlaceholder")}
                                  {...field}
                                  aria-label={t("contact.subject")}
                                  className="border-primary/20 focus:border-primary hover:bg-primary/10 rounded-xl transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.message")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t("contact.messagePlaceholder")}
                                  className="min-h-[120px] border-primary/20 focus:border-primary hover:bg-primary/10 rounded-xl transition-all duration-300"
                                  {...field}
                                  aria-label={t("contact.message")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-3" />
                              {t("contact.sending")}
                            </>
                          ) : (
                            <span className="flex items-center gap-3">
                              {t("contact.send")}
                              <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 relative z-10">
          <div className="container px-4 md:px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="border border-primary/20 bg-background/95 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-primary">{t("contact.findUs")}</CardTitle>
                  <CardDescription>{t("contact.findUsDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] rounded-xl overflow-hidden border border-primary/20">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3208.0717767372954!2d7.428164!3d36.462744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f01e9f9f9f9f9f%3A0x1234567890abcdef!2sRue%20de%20la%20R%C3%A9volution%2C%20Guelma%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1698765432109!5m2!1sen!2sdz"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={t("contact.mapTitle")}
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
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
                  <HelpCircle className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-primary">{t("contact.support")}</span>
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight">
                {t("contact.ctaTitle")}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                {t("contact.ctaDesc")}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <span className="flex items-center gap-3">
                    {t("contact.contactSupport")}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Success Dialog */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="bg-background/95 border border-primary/20 rounded-2xl shadow-sm">
            <motion.div
              variants={fadeInScale}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary">{t("contact.messageSent")}</DialogTitle>
                <DialogDescription>{t("contact.messageSentDesc", )}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6">
                <Button
                  onClick={() => setIsSuccessDialogOpen(false)}
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {t("contact.close")}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}

function SkeletonLoader() {
  return (
    <motion.div
      className="container px-4 md:px-6 py-12 max-w-4xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="h-8 w-64 bg-primary/20 rounded mb-4 mx-auto" />
      <motion.div variants={fadeInUp} className="h-4 w-96 bg-primary/20 rounded mb-6 mx-auto" />
      <motion.div variants={fadeInUp} className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="h-40 w-full bg-background/90 border border-primary/20 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="md:col-span-2">
          <motion.div className="h-96 w-full bg-background/90 border border-primary/20 rounded-2xl animate-pulse" />
        </div>
      </motion.div>
    </motion.div>
  )
}
