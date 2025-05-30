"use client"

import Link from "next/link"
import { Facebook, X, Instagram, Linkedin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface LanguageContext {
  t: (key: string) => string
  direction: "ltr" | "rtl"
}

export function Footer() {
  const { t, direction }: LanguageContext = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`border-t bg-background ${direction === "rtl" ? "rtl" : "ltr"}`}>
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-md flex items-center justify-center h-8 w-8">
                {t("footer.logoInitial")}
              </div>
              <span className="text-xl font-bold text-primary">
                {t("footer.platformName")}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {t("footer.description")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">{t("footer.facebook")}</span>
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{t("footer.x")}</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">{t("footer.instagram")}</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">{t("footer.linkedin")}</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("footer.company")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  {t("footer.faq")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("footer.resources")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  {t("footer.helpCenter")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t("footer.termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("footer.contactUs")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="mailto:support@tamweeli.com" className="text-muted-foreground hover:text-foreground">
                  {t("footer.email")}
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-foreground">
                  {t("footer.phone")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          © {currentYear} {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}