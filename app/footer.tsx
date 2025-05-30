import { useTranslation } from "react-i18next"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t">
      <div className="container py-10">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tamweeli. {t("common.rights")}
        </p>
      </div>
    </footer>
  )
}
