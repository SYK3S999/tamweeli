"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight, BookOpen, FileText, HelpCircle, MessageSquare, Search } from "lucide-react"

export default function HelpPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const [searchQuery, setSearchQuery] = useState("")

  // Popular help topics
  const popularTopics = [
    {
      id: "getting-started",
      title: t("help.gettingStarted"),
      description: t("help.gettingStartedDesc"),
      icon: BookOpen,
    },
    {
      id: "creating-project",
      title: t("help.creatingProject"),
      description: t("help.creatingProjectDesc"),
      icon: FileText,
    },
    {
      id: "investing",
      title: t("help.investing"),
      description: t("help.investingDesc"),
      icon: MessageSquare,
    },
  ]

  // Help categories
  const helpCategories = [
    {
      id: "account",
      title: t("help.account"),
      articles: [
        { id: "create-account", title: t("help.createAccount") },
        { id: "verify-account", title: t("help.verifyAccount") },
        { id: "reset-password", title: t("help.resetPassword") },
        { id: "account-settings", title: t("help.accountSettings") },
      ],
    },
    {
      id: "projects",
      title: t("help.projects"),
      articles: [
        { id: "create-project", title: t("help.createProject") },
        { id: "project-requirements", title: t("help.projectRequirements") },
        { id: "project-approval", title: t("help.projectApproval") },
        { id: "edit-project", title: t("help.editProject") },
      ],
    },
    {
      id: "investments",
      title: t("help.investments"),
      articles: [
        { id: "how-to-invest", title: t("help.howToInvest") },
        { id: "investment-process", title: t("help.investmentProcess") },
        { id: "investment-status", title: t("help.investmentStatus") },
        { id: "returns-distribution", title: t("help.returnsDistribution") },
      ],
    },
    {
      id: "islamic-finance",
      title: t("help.islamicFinance"),
      articles: [
        { id: "islamic-principles", title: t("help.islamicPrinciples") },
        { id: "contract-types", title: t("help.contractTypes") },
        { id: "shariah-compliance", title: t("help.shariahCompliance") },
        { id: "riba-free", title: t("help.ribaFree") },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-green-50 py-16">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{t("help.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{t("help.subtitle")}</p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("help.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">{t("help.popularTopics")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {popularTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-green-100">
                        <topic.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{topic.description}</p>
                    <Button asChild variant="link" className="p-0">
                      <Link href={`/help/${topic.id}`}>
                        {t("help.readMore")}
                        <ArrowRight className={`h-4 w-4 ${rtl ? "mr-2" : "ml-2"}`} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16 bg-slate-50">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">{t("help.helpCenter")}</h2>

            <Tabs defaultValue="account">
              <TabsList className="w-full justify-start mb-8 overflow-auto">
                {helpCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="px-4">
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {helpCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {category.articles.map((article) => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button asChild variant="link" className="p-0">
                            <Link href={`/help/${category.id}/${article.id}`}>
                              {t("help.readArticle")}
                              <ArrowRight className={`h-4 w-4 ${rtl ? "mr-2" : "ml-2"}`} />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container">
            <div className="bg-green-50 rounded-lg p-8 text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-4">{t("help.needMoreHelp")}</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t("help.contactSupportDesc")}</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/contact">{t("help.contactSupport")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
