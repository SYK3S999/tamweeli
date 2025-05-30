"use client"

import { useState } from "react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, MapPin, Phone } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "contact.nameError",
  }),
  email: z.string().email({
    message: "contact.emailError",
  }),
  subject: z.string().min(5, {
    message: "contact.subjectError",
  }),
  message: z.string().min(10, {
    message: "contact.messageError",
  }),
})

export default function ContactPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: t("contact.messageSent"),
        description: t("contact.messageSentDesc"),
      })

      form.reset()
    } catch (error) {
      toast({
        title: t("contact.error"),
        description: t("contact.errorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-green-50 py-16">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{t("contact.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("contact.subtitle")}</p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Contact Information */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("contact.getInTouch")}</CardTitle>
                    <CardDescription>{t("contact.getInTouchDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">{t("contact.address")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("contact.addressLine1")}
                          <br />
                          {t("contact.addressLine2")}
                          <br />
                          {t("contact.addressLine3")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">{t("contact.phone")}</h3>
                        <p className="text-sm text-muted-foreground">{t("contact.phoneNumber")}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">{t("contact.email")}</h3>
                        <p className="text-sm text-muted-foreground">{t("contact.emailAddress")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("contact.businessHours")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t("contact.weekdays")}</span>
                      <span>{t("contact.weekdaysHours")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("contact.saturday")}</span>
                      <span>{t("contact.saturdayHours")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("contact.sunday")}</span>
                      <span>{t("contact.sundayHours")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("contact.sendMessage")}</CardTitle>
                    <CardDescription>{t("contact.sendMessageDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("contact.name")}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t("contact.namePlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("contact.email")}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t("contact.emailPlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.subject")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("contact.subjectPlaceholder")} {...field} />
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
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? t("contact.sending") : t("contact.send")}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-8">
          <div className="container">
            <div className="h-[400px] bg-slate-200 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">{t("contact.mapPlaceholder")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}