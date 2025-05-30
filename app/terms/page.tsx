"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="flex items-center mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back")}
              </Link>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t("terms.title")}</h1>
            <p className="text-muted-foreground mb-8">{t("terms.lastUpdated")}: 2023-12-01</p>

            <div className="prose max-w-none dark:prose-invert">
              <h2>{t("terms.section1")}</h2>
              <p>{t("terms.section1Text1")}</p>
              <p>{t("terms.section1Text2")}</p>

              <h2>{t("terms.section2")}</h2>
              <p>{t("terms.section2Text1")}</p>
              <p>{t("terms.section2Text2")}</p>
              <ul>
                <li>{t("terms.section2List1")}</li>
                <li>{t("terms.section2List2")}</li>
                <li>{t("terms.section2List3")}</li>
                <li>{t("terms.section2List4")}</li>
              </ul>

              <h2>{t("terms.section3")}</h2>
              <p>{t("terms.section3Text1")}</p>
              <p>{t("terms.section3Text2")}</p>

              <h2>{t("terms.section4")}</h2>
              <p>{t("terms.section4Text1")}</p>
              <p>{t("terms.section4Text2")}</p>

              <h2>{t("terms.section5")}</h2>
              <p>{t("terms.section5Text1")}</p>
              <p>{t("terms.section5Text2")}</p>

              <h2>{t("terms.section6")}</h2>
              <p>{t("terms.section6Text1")}</p>
              <p>{t("terms.section6Text2")}</p>

              <h2>{t("terms.section7")}</h2>
              <p>{t("terms.section7Text1")}</p>
              <p>{t("terms.section7Text2")}</p>

              <h2>{t("terms.section8")}</h2>
              <p>{t("terms.section8Text1")}</p>
              <p>{t("terms.section8Text2")}</p>
              <p>{t("terms.contactEmail")}: legal@tamweeli.dz</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
