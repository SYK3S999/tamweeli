"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageSwitcher() {
  const { language, setLanguage, direction } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="rounded-full w-8 h-8 hover:bg-accent"
      aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <span className="text-sm font-medium">{language === "en" ? "ع" : "EN"}</span>
    </Button>
  )
}
