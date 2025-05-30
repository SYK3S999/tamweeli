"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"

export default function FAQPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  // FAQ categories and items
  const faqCategories = [
    {
      id: "general",
      title: t("faq.general"),
      items: [
        {
          question: t("faq.generalQuestion1"),
          answer: t("faq.generalAnswer1"),
        },
        {
          question: t("faq.generalQuestion2"),
          answer: t("faq.generalAnswer2"),
        },
        {
          question: t("faq.generalQuestion3"),
          answer: t("faq.generalAnswer3"),
        },
        {
          question: t("faq.generalQuestion4"),
          answer: t("faq.generalAnswer4"),
        },
      ],
    },
    {
      id: "projects",
      title: t("faq.projects"),
      items: [
        {
          question: t("faq.projectsQuestion1"),
          answer: t("faq.projectsAnswer1"),
        },
        {
          question: t("faq.projectsQuestion2"),
          answer: t("faq.projectsAnswer2"),
        },
        {
          question: t("faq.projectsQuestion3"),
          answer: t("faq.projectsAnswer3"),
        },
      ],
    },
    {
      id: "investments",
      title: t("faq.investments"),
      items: [
        {
          question: t("faq.investmentsQuestion1"),
          answer: t("faq.investmentsAnswer1"),
        },
        {
          question: t("faq.investmentsQuestion2"),
          answer: t("faq.investmentsAnswer2"),
        },
        {
          question: t("faq.investmentsQuestion3"),
          answer: t("faq.investmentsAnswer3"),
        },
        {
          question: t("faq.investmentsQuestion4"),
          answer: t("faq.investmentsAnswer4"),
        },
      ],
    },
    {
      id: "islamic",
      title: t("faq.islamic"),
      items: [
        {
          question: t("faq.islamicQuestion1"),
          answer: t("faq.islamicAnswer1"),
        },
        {
          question: t("faq.islamicQuestion2"),
          answer: t("faq.islamicAnswer2"),
        },
        {
          question: t("faq.islamicQuestion3"),
          answer: t("faq.islamicAnswer3"),
        },
      ],
    },
    {
      id: "account",
      title: t("faq.account"),
      items: [
        {
          question: t("faq.accountQuestion1"),
          answer: t("faq.accountAnswer1"),
        },
        {
          question: t("faq.accountQuestion2"),
          answer: t("faq.accountAnswer2"),
        },
        {
          question: t("faq.accountQuestion3"),
          answer: t("faq.accountAnswer3"),
        },
      ],
    },
  ]

  // Filter FAQ items based on search query
  const filteredFaqs = faqCategories.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  // Get current category
  const currentCategory = filteredFaqs.find((category) => category.id === activeTab) || filteredFaqs[0]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-green-50 py-16">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{t("faq.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{t("faq.subtitle")}</p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("faq.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container">
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start mb-8 overflow-auto">
                {faqCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="px-4">
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {filteredFaqs.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  {category.items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">{t("faq.noResults")}</p>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent>
                            <div className="prose max-w-none dark:prose-invert">
                              <p>{item.answer}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-green-50">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">{t("faq.stillHaveQuestions")}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t("faq.contactDesc")}</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/contact">{t("faq.contactUs")}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
