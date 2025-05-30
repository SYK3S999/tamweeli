"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CheckCircle } from "lucide-react"

export default function VerifyPage() {
  return (
    <AuthProvider>
      <Verify />
    </AuthProvider>
  )
}

function Verify() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-center">{t("auth.verifyEmail")}</CardTitle>
              <CardDescription className="text-center">{t("auth.verificationSent")}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">{t("auth.checkSpam")}</p>
              <Button variant="link" className="mt-2 text-green-600">
                {t("auth.resendVerification")}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/auth/login">{t("auth.returnToLogin")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
