"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider, useAuth, type UserType, type InvestorType } from "@/components/auth-provider"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  userType: z.enum(["project-owner", "investor", "consultant"]),
  investorType: z.enum(["individual", "institution"]).optional(),
  companyName: z.string().optional(),
  activityType: z.string().optional(),
  registrationNumber: z.string().optional(),
})

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "project-owner",
    },
  })

  const userType = form.watch("userType") as UserType
  const investorType = form.watch("investorType") as InvestorType

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    try {
      await register(values)
      router.push("/auth/verify")
    } catch (error: any) {
      setError(error.message || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("auth.register")}</CardTitle>
              <CardDescription>Create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>{t("auth.email")}</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t("auth.userType")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value="project-owner" />
                              </FormControl>
                              <FormLabel className="font-normal">{t("auth.projectOwner")}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value="investor" />
                              </FormControl>
                              <FormLabel className="font-normal">{t("auth.investor")}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value="consultant" />
                              </FormControl>
                              <FormLabel className="font-normal">{t("auth.consultant")}</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {userType === "investor" && (
                    <FormField
                      control={form.control}
                      name="investorType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Investor Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                                <FormControl>
                                  <RadioGroupItem value="individual" />
                                </FormControl>
                                <FormLabel className="font-normal">{t("auth.individual")}</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                                <FormControl>
                                  <RadioGroupItem value="institution" />
                                </FormControl>
                                <FormLabel className="font-normal">{t("auth.institution")}</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {userType === "investor" && investorType === "institution" && (
                    <>
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.companyName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="activityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.activityType")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.registrationNumber")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {error && <div className="text-sm text-red-500">{error}</div>}
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? t("common.loading") : t("auth.register")}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-green-600 hover:underline">
                  {t("auth.login")}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
