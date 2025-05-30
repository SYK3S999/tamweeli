"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { 
  ArrowRight, 
  Building, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Scale,
  Award,
  Heart,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

const cardHover = {
  hover: { scale: 1.03, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
}

const buttonHover = {
  hover: { scale: 1.05, boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)", transition: { duration: 0.2 } },
}

export default function AboutPage() {
  const { t, direction } = useLanguage()
  const rtl = direction === "rtl"
  const [isVisible, setIsVisible] = useState(false)

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: t("about.teamMember1Name"),
      title: t("about.teamMember1Title"),
      image: "/team-member-1.jpg",
      socials: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      id: 2,
      name: t("about.teamMember2Name"),
      title: t("about.teamMember2Title"),
      image: "/team-member-2.jpg",
      socials: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      id: 3,
      name: t("about.teamMember3Name"),
      title: t("about.teamMember3Title"),
      image: "/team-member-3.jpg",
      socials: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      id: 4,
      name: t("about.teamMember4Name"),
      title: t("about.teamMember4Title"),
      image: "/team-member-4.jpg",
      socials: { twitter: "#", linkedin: "#", github: "#" },
    },
  ]

  // Stats data
  const stats = [
    { value: "100+", label: t("about.projects"), end: 100 },
    { value: "50K+", label: t("about.investors"), end: 50000 },
    { value: "$25M+", label: t("about.fundedAmount"), end: 25000000 },
    { value: "15+", label: t("about.countries"), end: 15 },
  ]

  // Simulate loading for skeleton
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  // Parallax effect for hero image
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])

  return (
    <div className="flex min-h-screen flex-col" dir={rtl ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 dark:from-green-600/20 dark:to-blue-600/20 animate-gradient-x" />
          <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-cover" />
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="container relative z-10"
          >
            <div className="grid gap-12 md:grid-cols-[3fr_2fr] md:gap-16 items-center">
              <div className="space-y-6">
                <motion.div
                  variants={item}
                  className="inline-block rounded-full bg-green-100 dark:bg-green-800/50 px-5 py-2 text-sm font-semibold text-green-800 dark:text-green-300"
                >
                  {t("about.companyTag")}
                </motion.div>
                <motion.h1
                  variants={item}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-blue-500 dark:from-green-500 dark:to-blue-400 bg-clip-text text-transparent"
                >
                  {t("about.heroTitle")}
                </motion.h1>
                <motion.p
                  variants={item}
                  className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed"
                >
                  {t("about.heroSubtitle")}
                </motion.p>
                <motion.p
                  variants={item}
                  className="text-base text-gray-600 dark:text-gray-400 max-w-lg"
                >
                  {t("about.heroDescription")}
                </motion.p>
                <motion.div variants={item} className="flex flex-wrap gap-4">
                  <motion.div whileHover="hover" variants={buttonHover}>
                    <Button
                      asChild
                      size="lg"
                      className="rounded-lg bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 px-8 py-6 text-base font-semibold text-white"
                      aria-label={t("about.exploreProjects")}
                    >
                      <Link href="/projects">
                        {t("about.exploreProjects")}
                        <ChevronRight className={`h-5 w-5 ${rtl ? "mr-2" : "ml-2"}`} />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover="hover" variants={buttonHover}>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-6 text-base font-semibold"
                      aria-label={t("about.watchStory")}
                    >
                      <Link href="/video">
                        {t("about.watchStory")}
                        <ArrowRight className={`h-5 w-5 ${rtl ? "mr-2" : "ml-2"}`} />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
                {/* Stats Preview */}
                <motion.div
                  variants={container}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="text-center"
                    >
                      <motion.p
                        className="text-2xl font-extrabold text-green-600 dark:text-green-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="inline-block">
                          {stat.value}
                        </span>
                      </motion.p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                style={{ y }}
                variants={item}
                className="relative h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <img
                  src="/hero-illustration.jpg"
                  alt={t("about.heroImageAlt")}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/api/placeholder/600/450")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-lg font-semibold">{t("about.heroImageCaption")}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                >
                  <p className="text-4xl font-extrabold text-green-600 dark:text-green-500">{stat.value}</p>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{t("about.ourStory")}</h2>
              <div className="h-1 w-24 bg-green-500 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">{t("about.storyDescription")}</p>
            </motion.div>

            <Tabs defaultValue="mission" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <TabsTrigger
                  value="mission"
                  className="rounded-lg py-3 text-base font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("about.ourMission")}
                </TabsTrigger>
                <TabsTrigger
                  value="vision"
                  className="rounded-lg py-3 text-base font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("about.ourVision")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="mission">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="pt-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                        <Scale className="h-7 w-7 text-green-600 dark:text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("about.ourMission")}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{t("about.missionText")}</p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t("about.missionPoint1")}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t("about.missionPoint2")}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t("about.missionPoint3")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="vision">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="pt-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                        <Award className="h-7 w-7 text-green-600 dark:text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("about.ourVision")}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{t("about.visionText")}</p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t("about.visionPoint1")}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t("about.visionPoint2")}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t("about.visionPoint3")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{t("about.ourValues")}</h2>
              <div className="h-1 w-24 bg-green-500 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">{t("about.valuesDescription")}</p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-3"
            >
              {[
                { icon: Heart, title: t("about.value1Title"), text: t("about.value1Text") },
                { icon: Users, title: t("about.value2Title"), text: t("about.value2Text") },
                { icon: DollarSign, title: t("about.value3Title"), text: t("about.value3Text") },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={{ ...item, ...cardHover }}
                  whileHover="hover"
                  className="group bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-700 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-green-600 dark:text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{t("about.ourTeam")}</h2>
              <div className="h-1 w-24 bg-green-500 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">{t("about.teamDescription")}</p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {isVisible ? (
                teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={{ ...item, ...cardHover }}
                    whileHover="hover"
                    className="group bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative mb-6 mx-auto">
                      <div className="h-48 w-48 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/api/placeholder/200/200")}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:-translate-y-2">
                        <Link href={member.socials.twitter} className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Twitter className="h-5 w-5 text-green-600 dark:text-green-500" />
                        </Link>
                        <Link href={member.socials.linkedin} className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Linkedin className="h-5 w-5 text-green-600 dark:text-green-500" />
                        </Link>
                        <Link href={member.socials.github} className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Github className="h-5 w-5 text-green-600 dark:text-green-500" />
                        </Link>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
                    <p className="text-green-600 dark:text-green-500 mb-3">{member.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t(`about.teamMember${member.id}Bio`)}</p>
                  </motion.div>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, index) => (
                  <motion.div key={index} variants={item}>
                    <Skeleton className="h-80 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        {/* Islamic Finance */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{t("about.islamicFinance")}</h2>
                <div className="h-1 w-24 bg-green-500 mb-8"></div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{t("about.islamicFinanceText1")}</p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t("about.islamicFinanceText2")}</p>
                <Button
                  asChild
                  className="rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 px-8 py-6 text-base font-semibold text-white"
                  aria-label={t("about.learnMore")}
                >
                  <Link href="/faq">
                    {t("about.learnMore")}
                    <ArrowRight className={`h-5 w-5 ${rtl ? "mr-2" : "ml-2"} transition-transform group-hover:translate-x-1`} />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Accordion type="single" collapsible className="w-full">
                  {[
                    { value: "item-1", title: t("about.principle1"), text: t("about.principle1Text") },
                    { value: "item-2", title: t("about.principle2"), text: t("about.principle2Text") },
                    { value: "item-3", title: t("about.principle3"), text: t("about.principle3Text") },
                  ].map((principle) => (
                    <AccordionItem
                      key={principle.value}
                      value={principle.value}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg font-semibold text-gray-900 dark:text-gray-100">
                        {principle.title}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {principle.text}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{t("about.ourJourney")}</h2>
              <div className="h-1 w-24 bg-green-500 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">{t("about.journeyDescription")}</p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
              {[2025].map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-start mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">{year}</h3>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t(`about.milestone${index + 1}Title`)}</p>
                    <p className="text-base text-gray-600 dark:text-gray-400">{t(`about.milestone${index + 1}Text`)}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 w-5 h-5 rounded-full bg-green-500 shadow-sm transform -translate-x-1/2 mt-1"></div>
                  </div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{t("about.joinUs")}</h2>
              <div className="h-1 w-24 bg-white/50 mx-auto mb-8"></div>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-green-100">{t("about.joinUsText")}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl bg-white text-green-600 dark:bg-gray-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-700 px-8 py-6 text-base font-semibold"
                  aria-label={t("about.getStarted")}
                >
                  <Link href="/auth/register">{t("about.getStarted")}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-white text-white hover:bg-green-500 dark:hover:bg-green-600 px-8 py-6 text-base font-semibold"
                  aria-label={t("about.contactUs")}
                >
                  <Link href="/contact">{t("about.contactUs")}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}