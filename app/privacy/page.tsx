"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold mb-6">{t("privacy.title")}</h1>
            <p className="text-muted-foreground mb-8">{t("privacy.lastUpdated")}: 2023-12-01</p>

            <div className="prose max-w-none dark:prose-invert">
              <h2>{t("privacy.section1")}</h2>
              <p>{t("privacy.section1Text1")}</p>
              <p>{t("privacy.section1Text2")}</p>

              <h2>{t("privacy.section2")}</h2>
              <p>{t("privacy.section2Text1")}</p>
              <ul>
                <li>{t("privacy.section2List1")}</li>
                <li>{t("privacy.section2List2")}</li>
                <li>{t("privacy.section2List3")}</li>
                <li>{t("privacy.section2List4")}</li>
                <li>{t("privacy.section2List5")}</li>
              </ul>

              <h2>{t("privacy.section3")}</h2>
              <p>{t("privacy.section3Text1")}</p>
              <p>{t("privacy.section3Text2")}</p>

              <h2>{t("privacy.section4")}</h2>
              <p>{t("privacy.section4Text1")}</p>
              <ul>
                <li>{t("privacy.section4List1")}</li>
                <li>{t("privacy.section4List2")}</li>
                <li>{t("privacy.section4List3")}</li>
                <li>{t("privacy.section4List4")}</li>
              </ul>

              <h2>{t("privacy.section5")}</h2>
              <p>{t("privacy.section5Text1")}</p>
              <p>{t("privacy.section5Text2")}</p>

              <h2>{t("privacy.section6")}</h2>
              <p>{t("privacy.section6Text1")}</p>
              <p>{t("privacy.section6Text2")}</p>

              <h2>{t("privacy.section7")}</h2>
              <p>{t("privacy.section7Text1")}</p>
              <p>{t("privacy.section7Text2")}</p>
              <p>{t("privacy.contactEmail")}: privacy@tamweeli.dz</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
