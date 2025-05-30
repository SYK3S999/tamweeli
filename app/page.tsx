"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Lottie from "lottie-react";
import animationData from "@/public/heroimage.json";
import animationData1 from "@/public/securityimage.json";

import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  BarChart4, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  MessageCircle,
  Star,
  Shield,
  Play,
  ArrowUpRight,
  Zap,
  Target,
  Award,
  Globe,
  Clock,
  Lightbulb,
  Heart,
  Lock,
  Database,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageSquare,
  Rocket,
  Search,
  UserPlus
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { initializeDemoData } from "@/lib/demo-data"
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";

// Enhanced animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const slideIn = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Enhanced testimonials with more variety
const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Tech Entrepreneur",
    company: "EcoTech Solutions",
    avatar: "/avatars/sarah.jpg",
    content: "Tamweeli revolutionized how I approach funding. Within 3 months, I secured $150K from 12 different investors. The platform's AI-matching system connected me with investors who truly understood my vision.",
    rating: 5,
    verified: true,
    fundingAmount: 150000
  },
  {
    name: "Omar Khalid",
    role: "Angel Investor",
    company: "MENA Ventures",
    avatar: "/avatars/omar.jpg",
    content: "As an investor managing a $2M portfolio, Tamweeli's due diligence tools and project analytics have been game-changing. I've discovered 3 unicorn potentials through this platform.",
    rating: 5,
    verified: true,
    investmentCount: 24
  },
  {
    name: "Layla Mahmoud",
    role: "Business Consultant",
    company: "Growth Partners",
    avatar: "/avatars/layla.jpg",
    content: "The consultant marketplace on Tamweeli has tripled my client base. I've helped 40+ startups optimize their pitch decks and business models. It's a goldmine for experienced consultants.",
    rating: 5,
    verified: true,
    clientsHelped: 40
  },
  {
    name: "Ahmed Hassan",
    role: "Fintech Founder",
    company: "PayFlow",
    avatar: "/avatars/ahmed.jpg",
    content: "From idea to Series A in 18 months - Tamweeli was instrumental in every funding round. The community support and mentor network are unparalleled.",
    rating: 5,
    verified: true,
    fundingAmount: 3500000
  }
]

// Enhanced featured projects
const featuredProjects = [
  {
    id: "project-1",
    title: "EcoSolutions Water Purification",
    description: "Revolutionary nano-filtration technology bringing clean water to 10M+ people in rural areas across Africa and Asia.",
    image: "/water.jpg?height=280&width=400",
    category: "Sustainability",
    progress: 87,
    target: 500000,
    raised: 435000,
    backers: 1247,
    daysLeft: 15,
    trending: true,
    featured: true
  },
  {
    id: "project-2",
    title: "Tech4Education AI Platform",
    description: "Personalized AI-driven learning platform that adapts to individual student needs, improving learning outcomes by 300%.",
    image: "/education.jpg?height=280&width=400",
    category: "EdTech",
    progress: 72,
    target: 750000,
    raised: 540000,
    backers: 892,
    daysLeft: 23,
    trending: false,
    featured: true
  },
  {
    id: "project-3",
    title: "HealthConnect Telemedicine",
    description: "Comprehensive telemedicine platform connecting rural patients with specialists, reducing healthcare costs by 60%.",
    image: "/health.jpg?height=280&width=400",
    category: "Healthcare",
    progress: 94,
    target: 300000,
    raised: 282000,
    backers: 567,
    daysLeft: 8,
    trending: true,
    featured: true
  },
  {
    id: "project-4",
    title: "GreenEnergy Solar Grid",
    description: "Decentralized solar energy network providing clean electricity to remote communities while generating passive income.",
    image: "/solar.jpg?height=280&width=400",
    category: "CleanTech",
    progress: 68,
    target: 1200000,
    raised: 816000,
    backers: 2134,
    daysLeft: 31,
    trending: false,
    featured: true
  }
]

// Success metrics
const successMetrics = [
  { label: "Success Rate", value: "94%", icon: Target },
  { label: "Avg. ROI", value: "340%", icon: TrendingUp },
  { label: "Time to Fund", value: "45 days", icon: Clock },
  { label: "Global Reach", value: "127 countries", icon: Globe }
]

type CountUpProps = {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

const CountUp = ({ end, duration = 2000, prefix = "", suffix = "" }: CountUpProps) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          let start = 0
          const step = end / (duration / 16)
          const timer = setInterval(() => {
            start += step
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          
          if (observerRef.current && countRef.current) observerRef.current.unobserve(countRef.current)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observerRef.current.observe(countRef.current)
    }

    return () => {
      if (observerRef.current && countRef.current) {
        observerRef.current.unobserve(countRef.current)
      }
    }
  }, [end, duration])

  return <span ref={countRef}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const { t, direction } = useLanguage()
  const [stats, setStats] = useState({
    projectsFunded: 0,
    investors: 0,
    totalInvestments: 0,
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])

  useEffect(() => {
    try {
      initializeDemoData()
    } catch (error) {
      console.error("Failed to initialize demo data:", error)
    }

    try {
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const investments = JSON.parse(localStorage.getItem("investments") || "[]")
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      const fundedProjects = projects.filter((p: { raisedAmount: number }) => p.raisedAmount > 0).length
      const investorCount = users.filter((u: { userType: string }) => u.userType === "investor").length
      const totalInvestmentAmount = investments.reduce((sum: any, inv: { amount: any }) => sum + inv.amount, 0)

      setStats({
        projectsFunded: fundedProjects,
        investors: investorCount,
        totalInvestments: totalInvestmentAmount,
      })
    } catch (error) {
      console.error("Failed to calculate stats:", error)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isScrolled && "bg-background/80 shadow-sm border-b border-primary/20"
      )} />
      <main className="overflow-hidden">
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 overflow-hidden">
          {/* Animated particle background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 dark:opacity-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
          </div>

          {/* Optional video background */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <video
              className="w-full h-full object-cover opacity-20"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            >
              <source src="/videos/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="container px-4 md:px-6 relative z-10 py-12 md:py-16"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid gap-8 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px] items-center"
            >
              {/* Left Content */}
              <motion.div variants={fadeInUp} className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <motion.div
                    variants={fadeInScale}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-medium hover:bg-primary/10 hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className={cn("h-4 w-4 text-primary animate-pulse", direction === "rtl" ? "ml-2" : "mr-2")} />
                    <span className="text-primary font-semibold">
                      {t("home.newPlatform")} • {t("home.awardWinner")}
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={fadeInUp}
                    className={cn(
                      "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-6xl text-primary",
                      direction === "rtl" && "leading-tight text-right"
                    )}
                    lang={direction === "rtl" ? "ar" : "en"}
                  >
                    {t("common.platformName")}
                  </motion.h1>
                </div>

                <motion.p
                  variants={fadeInUp}
                  className={cn(
                    "max-w-[600px] text-base text-muted-foreground leading-relaxed sm:text-lg",
                    direction === "rtl" && "text-right"
                  )}
                  lang={direction === "rtl" ? "ar" : "en"}
                >
                  {t("home.heroDescription")}
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                  <Link href="/projects">
                    <Button
                      size="lg"
                      className={cn(
                        "rounded-full gap-2 px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300",
                        direction === "rtl" && "flex-row-reverse"
                      )}
                      aria-label={t("home.browseProjectsAria")}
                    >
                      {t("home.browseProjects")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                      aria-label={t("home.joinTamweeliAria")}
                    >
                      {t("home.joinTamweeli")}
                    </Button>
                  </Link>
                  <Link href="/demo-login">
                    <Button
                      size="lg"
                      variant="outline"
                      className={cn(
                        "rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300",
                        direction === "rtl" && "flex-row-reverse"
                      )}
                      aria-label={t("home.tryDemoAria")}
                    >
                      <Play className={cn("h-5 w-5", direction === "rtl" ? "ml-2" : "mr-2")} />
                      {t("home.tryDemo")}
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp} className={cn("flex items-center pt-6", direction === "rtl" && "flex-row-reverse")}>
                  <div className={cn("flex -space-x-3", direction === "rtl" && "-space-x-3")}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Link href="/community" key={i}>
                        <Avatar
                          className="border-3 border-background shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300"
                          tabIndex={0}
                          aria-label={t("home.userAvatarAria")}
                        >
                          <AvatarImage src={`/avatars/avatar-${i}.jpg`} alt={t("home.userAvatarAlt")} />
                          <AvatarFallback className="bg-primary/10 border-primary/20 font-semibold">
                            {i}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    ))}
                  </div>
                  <div className={cn("ml-6", direction === "rtl" && "mr-6 ml-0 text-right")}>
                    <p className="text-sm text-muted-foreground" lang={direction === "rtl" ? "ar" : "en"}>
                      <span className="font-bold text-foreground text-lg">{t("home.usersCount")}</span> {t("home.usersJoined")}
                    </p>
                    <div className={cn("flex items-center mt-1", direction === "rtl" && "justify-end")}>
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className={cn("text-sm font-medium", direction === "rtl" ? "mr-2" : "ml-2")}>
                        {t("home.rating")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content */}
              <motion.div
                variants={fadeInScale}
                className="flex items-center justify-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-[600px]"
                >
                  {/* Floating success metrics with tooltips */}
                  <div className="absolute -top-12 -left-12 z-20 group">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300 hover:bg-green-500/20 hover:scale-105 transition-all duration-300">
                      <TrendingUp className={cn("inline h-4 w-4", direction === "rtl" ? "ml-1" : "mr-1")} />
                      {t("home.roiValue")}
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-background/90 border border-primary/20 rounded-md p-2 text-xs text-muted-foreground shadow-sm">
                      {t("home.roiTooltip")}
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 z-20 group">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 hover:scale-105 transition-all duration-300">
                      <Clock className={cn("inline h-4 w-4", direction === "rtl" ? "ml-1" : "mr-1")} />
                      {t("home.timeToFundValue")}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-background/90 border border-primary/20 rounded-md p-2 text-xs text-muted-foreground shadow-sm">
                      {t("home.timeToFundTooltip")}
                    </div>
                  </div>
                  <div className="absolute top-1/2 -right-12 -translate-y-1/2 z-20 group">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 hover:scale-105 transition-all duration-300">
                      <Target className={cn("inline h-4 w-4", direction === "rtl" ? "ml-1" : "mr-1")} />
                      {t("home.successRateValue")}
                    </div>
                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 hidden group-hover:block bg-background/90 border border-primary/20 rounded-md p-2 text-xs text-muted-foreground shadow-sm">
                      {t("home.successRateTooltip")}
                    </div>
                  </div>

                  <Lottie
                    animationData={animationData}
                    loop
                    className="w-full h-[450px] lg:h-[550px] object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                </motion.div>

                {/* Mobile Stats Carousel */}
                <motion.div
                  variants={fadeInUp}
                  className="lg:hidden mt-8 w-full"
                >
                  <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                      <CarouselItem className="basis-full">
                        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 shadow-sm">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                            <TrendingUp className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              <CountUp end={stats.projectsFunded} />
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {t("home.projectsFunded")}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-full">
                        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 shadow-sm">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              <CountUp end={stats.investors} />
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {t("home.investors")}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-full">
                        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 shadow-sm">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                            <BarChart4 className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(stats.totalInvestments, t)}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {t("home.totalInvestments")}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="hidden" />
                    <CarouselNext className="hidden" />
                  </Carousel>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Success Metrics Strip */}
        <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 border-y-4 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 dark:opacity-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full animate-pulse delay-500"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
            >
              {successMetrics.map((metric, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="text-center group cursor-pointer"
                >
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300">
                      <metric.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-primary mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {typeof metric.value === 'string' && metric.value.includes('$') ? 
                      metric.value : 
                      <CountUp end={parseInt(metric.value.toString().replace(/[^0-9]/g, ''))} />
                    }
                    {metric.value.includes('+') && '+'}
                    {metric.value.includes('%') && '%'}
                  </motion.div>
                  <div className="text-base text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">
                    {metric.label}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-background/90 border border-primary/20 rounded-md p-2 text-xs text-muted-foreground shadow-sm">
                    {`learn more about ${metric.label}`}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced How It Works Section */}
        <section className="relative py-24 md:py-32 overflow-hidden" id="how-it-works">
  {/* Background Elements */}
  <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-0.2"></div>

  <div className="container relative px-4 md:px-6 z-10">
    {/* Header Section */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="text-center mb-20"
    >
      <div className="inline-flex items-center mb-6">
        <Badge
          variant="outline"
          className="px-4 py-2 text-sm font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
        >
          <span className="text-primary">{t("home.processFlow")}</span>
        </Badge>
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary mb-4">
        {t("home.howItWorks")}
      </h2>

      <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        {t("home.howItWorksDesc")}
      </p>
    </motion.div>

    {/* Process Steps */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="max-w-7xl mx-auto relative"
    >
      {/* Enhanced Connecting Lines */}
      <div className="absolute top-0 left-0 right-0 hidden lg:block">
        <div className="relative h-0.5 mx-32 top-32">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent animate-pulse"></div>
        </div>
      </div>
      {/* Vertical connector for mobile */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 lg:hidden"></div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
        {[1, 2, 3].map((step, index) => (
          <motion.div
            key={step}
            variants={fadeInUp}
            custom={index}
            className="relative group"
          >
            {/* Card Container */}
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-background/90 border border-primary/20 rounded-2xl p-8 lg:p-10 shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-500">
                {/* Step Number Circle */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Number Circle */}
                    <div className="relative flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary text-primary-foreground text-2xl lg:text-3xl font-bold group-hover:scale-105 transition-all duration-300">
                      <span className="relative z-10">{step}</span>
                    </div>

                    {/* Floating Dots */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/60 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary/60 rounded-full animate-pulse delay-500"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold leading-tight text-primary">
                    {t(`home.step${step}Title`)}
                  </h3>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t(`home.step${step}Desc`)}
                  </p>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-primary font-semibold border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 rounded-full px-8 py-3 transition-all duration-300 group/btn"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t("home.learnMore")}
                        <ArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 duration-300" />
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Directional Arrow for LTR/RTL */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-8 rtl:-left-8 rtl:right-auto -translate-y-1/2">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary/60 to-transparent rtl:from-transparent rtl:to-primary/60 relative">
                      <div className="absolute right-0 rtl:left-0 rtl:right-auto top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 rtl:border-r-4 rtl:border-l-0 border-l-primary/60 rtl:border-r-primary/60 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile connector dot */}
            <div>
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 -bottom-4 w-3 h-3 bg-primary/60 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0 }}
        className="text-center mt-20">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-primary/5 border-2 border-primary/20 rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
          <span className="text-sm text-muted-foreground font-semibold text-primary">
            {t("home.readyToStart")}
          </span>
          <Button
            size="lg"
            className="rounded-full px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {t("home.startNow")}
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  </div>
</section>


        {/* Who Is It For Section */}
        <section className="relative py-24 md:py-32 overflow-hidden" id="who-is-it-for">
          {/* Simplified Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>

          <div className="container relative px-4 md:px-6 z-10">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-20"
            >
              {/* Badge Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-primary">{t("home.audienceTarget")}</span>
                </Badge>
              </motion.div>

              {/* Main Title */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary mb-4">
                  {t("home.whoIsItFor")}
                </h2>
              </motion.div>

              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {t("home.whoIsItForDesc")}
                </p>
              </motion.div>
            </motion.div>

            {/* Enhanced Tabs System */}
            <Tabs defaultValue="entrepreneurs" className="w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center mb-16"
              >
                <TabsList className="inline-flex h-auto p-1 bg-background/80 border border-primary/20 rounded-2xl shadow-sm">
                  {[
                    { value: "entrepreneurs", icon: "🚀", label: t("home.entrepreneurs") },
                    { value: "investors", icon: "💼", label: t("home.investors") },
                    { value: "consultants", icon: "🎯", label: t("home.consultants") },
                  ].map((item, index) => (
                    <motion.div
                      key={item.value}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      <TabsTrigger
                        value={item.value}
                        className="group relative flex items-center gap-3 rounded-xl py-4 px-6 text-base font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:scale-105 hover:bg-primary/5 hover:scale-102 whitespace-nowrap"
                      >
                        <motion.span 
                          className="text-xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span className="hidden sm:inline">{item.label}</span>
                        <span className="sm:hidden text-sm font-medium">{item.label.split(" ")[0]}</span>
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </motion.div>

              {/* Cleaner Tab Content */}
              <AnimatePresence mode="wait">
                {[
                  {
                    key: "entrepreneurs",
                    icon: "🚀",
                    title: t("home.entrepreneursTitle"),
                    description: t("home.entrepreneursDesc"),
                    benefits: [
                      t("home.entrepreneursBenefit1"),
                      t("home.entrepreneursBenefit2"),
                      t("home.entrepreneursBenefit3"),
                      t("home.entrepreneursBenefit4"),
                    ],
                    ctaText: t("home.entrepreneursCTAText"),
                    ctaLink: "/projects/create",
                  },
                  {
                    key: "investors",
                    icon: "💼",
                    title: t("home.investorsTitle"),
                    description: t("home.investorsDesc"),
                    benefits: [
                      t("home.investorsBenefit1"),
                      t("home.investorsBenefit2"),
                      t("home.investorsBenefit3"),
                      t("home.investorsBenefit4"),
                    ],
                    ctaText: t("home.investorsCTAText"),
                    ctaLink: "/projects",
                  },
                  {
                    key: "consultants",
                    icon: "🎯",
                    title: t("home.consultantsTitle"),
                    description: t("home.consultantsDesc"),
                    benefits: [
                      t("home.consultantsBenefit1"),
                      t("home.consultantsBenefit2"),
                      t("home.consultantsBenefit3"),
                      t("home.consultantsBenefit4"),
                    ],
                    ctaText: t("home.consultantsCTAText"),
                    ctaLink: "/auth/register",
                  },
                ].map((tab) => (
                  <TabsContent
                    key={tab.key}
                    value={tab.key}
                    forceMount={true}
                    className="mt-0 data-[state=inactive]:hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                      className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                    >
                      {/* Enhanced Image Section */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative group order-2 lg:order-1"
                      >
                        <motion.div 
                          className="relative bg-background/80 rounded-2xl border border-primary/20 shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-500 overflow-hidden"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div className="relative w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
                            <motion.div 
                              className="text-8xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                              whileHover={{ 
                                scale: 1.1, 
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.5 }
                              }}
                            >
                              {tab.icon}
                            </motion.div>
                          </div>

                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="absolute top-4 left-4 px-3 py-1.5 bg-background/90 rounded-full border border-primary/20 text-xs font-medium text-primary"
                          >
                            {tab.title.split(" ")[1]}
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      {/* Enhanced Content Section */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-8 order-1 lg:order-2"
                      >
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="flex items-center gap-4 mb-6"
                        >
                          <motion.div 
                            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border-primary/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <span className="text-2xl">{tab.icon}</span>
                          </motion.div>
                          <h3 className="text-3xl lg:text-4xl font-bold text-primary">
                            {tab.title}
                          </h3>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="p-6 bg-background/50 rounded-xl border border-primary/20 hover:border-primary/30 hover:bg-background/60 transition-all duration-300"
                        >
                          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                            {tab.description}
                          </p>
                        </motion.div>

                        <div className="space-y-3">
                          {tab.benefits.map((benefit, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -30 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                              whileHover={{ x: 5 }}
                              className="group flex items-start p-4 rounded-xl bg-background/30 border border-primary/15 hover:border-primary/20 hover:bg-background/40 transition-all duration-300 cursor-pointer"
                            >
                              <motion.div 
                                className="flex-shrink-0 mr-4 mt-0.5"
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-100 transition-transform duration-300" />
                              </motion.div>
                              <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                                {benefit}
                              </span>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="pt-6"
                        >
                          <Link href={tab.ctaLink}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Button
                                size="lg"
                                className="group rounded-xl px-8 py-4 text-base font-medium bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                              >
                                <motion.span 
                                  className="flex items-center gap-2"
                                  whileHover={{ x: 2 }}
                                >
                                  {tab.ctaText}
                                  <motion.div
                                    whileHover={{ x: 3 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                  </motion.div>
                                </motion.span>
                              </Button>
                            </motion.div>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </Tabs>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="relative py-24 md:py-32 overflow-hidden" id="featured-projects">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-0.1 dark:opacity-0.2 animate-pulse"></div>

          <div className="container relative px-4 md:px-6 z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Badge
                  variant="outline"
                  className="mb-6 px-4 py-2 text-base font-sm bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
                  <span className="text-primary">{t("home.showcase")}</span>
                </Badge>
              </motion.div>

              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight"
              >
                {t("home.featuredProjects")}
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              >
                {t("home.featuredProjectsDesc")}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="max-w-7xl mx-auto"
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-6 pb-4">
                  {featuredProjects.map((project, index) => (
                    <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                      <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Card className="h-full overflow-hidden border border-primary/20 bg-background/90 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-500 group relative">
                          <div className="relative z-10">
                            <CardHeader className="p-0 relative">
                              <div className="h-64 w-full overflow-hidden rounded-t-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                              </div>

                              <div className="absolute top-4 left-4 flex gap-2 z-20">
                                <Badge className="bg-background/90 text-foreground font-semibold border border-primary/20 hover:bg-background/80 hover:scale-105 transition-all duration-300">
                                  {project.category}
                                </Badge>
                                {project.trending && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-primary text-white border-primary/20 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                                  >
                                    <Zap className="h-3 w-3 mr-1" />
                                    {t("project.trending")}
                                  </Badge>
                                )}
                              </div>

                              <motion.div
                                className="absolute top-4 right-4 z-20"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="bg-background/90 border border-primary/20 hover:bg-primary/10 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                  <Heart className="h-4 w-4 text-primary" />
                                </Button>
                              </motion.div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-5">
                              <div className="space-y-3">
                                <h3 className="text-xl font-bold line-clamp-2 text-primary group-hover:text-primary transition-colors duration-300">
                                  {project.title}
                                </h3>
                                <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
                                  {project.description}
                                </p>
                              </div>

                              <div className="space-y-4 p-4 bg-background/90 rounded-xl border border-primary/20">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-muted-foreground">
                                    {t("project.progress")}
                                  </span>
                                  <span className="text-sm font-bold text-primary">
                                    {project.progress}%
                                  </span>
                                </div>

                                <div className="relative">
                                  <Progress
                                    value={project.progress}
                                    className="h-3 bg-secondary/20 [&>div]:bg-primary"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                  <div className="space-y-1">
                                    <div className="text-lg font-bold text-primary">
                                      {formatCurrency(project.raised, t)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {t("project.raised")}
                                    </div>
                                  </div>
                                  <div className="space-y-1 text-right">
                                    <div className="text-sm font-semibold text-muted-foreground">
                                      {formatCurrency(project.target, t)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {t("project.target")}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                                  <div className="flex items-center gap-1 text-sm">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-foreground">{project.backers.toLocaleString()}</span>
                                    <span className="text-muted-foreground text-xs">{t("project.backers")}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-foreground">{project.daysLeft}</span>
                                    <span className="text-muted-foreground text-xs">{t("project.daysLeft")}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0">
                              <Link href={`/projects/${project.id}`} className="w-full">
                                <Button
                                  variant="outline"
                                  className="w-full rounded-full border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm group/btn transition-all duration-300 font-semibold"
                                >
                                  <span className="relative flex items-center gap-2">
                                    {t("project.viewDetails")}
                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                  </span>
                                </Button>
                              </Link>
                            </CardFooter>
                          </div>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="relative left-0 bg-background/90 border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 rounded-full" />
                  <CarouselNext className="relative right-0 bg-background/90 border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 rounded-full" />
                </div>
              </Carousel>

              <motion.div
                variants={fadeInUp}
                className="flex justify-center mt-16"
                whileHover={{ scale: 1.02 }}
              >
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="rounded-full px-12 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <span className="relative flex items-center gap-3">
                      {t("home.viewAllProjects")}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 md:py-32 relative overflow-hidden" id="testimonials">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-0.1 dark:opacity-0.2 animate-pulse"></div>

          <div className="container relative px-4 md:px-6 z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Badge
                  variant="outline"
                  className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
                  <span className="text-primary">{t("home.testimonials")}</span>
                </Badge>
              </motion.div>

              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight"
              >
                {t("home.successStories")}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              >
                {t("home.successStoriesDesc")}
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-8xl mx-auto"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -10, 
                    transition: { duration: 0.3, type: "spring", stiffness: 300 } 
                  }}
                  className="relative group h-full"
                >
                  <div className="absolute -left-2 -top-2 text-primary/30 text-8xl font-serif leading-none pointer-events-none z-0 transition-all duration-500 group-hover:text-primary/50 group-hover:scale-110">
                    "
                  </div>
                  
                  <Card className="h-full border-0 bg-background/95 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl">
                    <CardContent className="p-8 pt-12 space-y-6 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-1">
                          {Array(testimonial.rating).fill(0).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ))}
                        </div>
                        {testimonial.verified && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 rounded-full px-3 py-1">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            <span className="text-xs font-medium">{t("home.verified")}</span>
                          </Badge>
                        )}
                      </div>
                      
                      <blockquote className="text-muted-foreground leading-relaxed text-base line-clamp-6 italic">
                        {testimonial.content}
                      </blockquote>
                      
                      <div className="flex items-center space-x-4 pt-4 border-t border-primary/20">
                        <div className="relative">
                          <Avatar className="h-14 w-14 border-2 border-primary/20">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-foreground font-semibold text-lg">
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {testimonial.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">{testimonial.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {testimonial.role} • {testimonial.company}
                          </p>
                        </div>
                      </div>
                      
                      {(testimonial.fundingAmount || testimonial.investmentCount || testimonial.clientsHelped) && (
                        <div className="pt-4 border-t border-primary/20">
                          <div className="flex items-center justify-between text-xs">
                            {testimonial.fundingAmount && (
                              <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="h-3 w-3" />
                                <span className="font-medium">{formatCurrency(testimonial.fundingAmount, t)}</span>
                              </div>
                            )}
                            {testimonial.investmentCount && (
                              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                                <Target className="h-3 w-3" />
                                <span className="font-medium">{testimonial.investmentCount}</span>
                              </div>
                            )}
                            {testimonial.clientsHelped && (
                              <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                                <Users className="h-3 w-3" />
                                <span className="font-medium">{testimonial.clientsHelped}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-16"
            >
              <p className="text-lg text-muted-foreground mb-6">
                Ready to join our success stories?
              </p>
              <Button 
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                Start Your Journey
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 md:py-32 relative overflow-hidden" id="security">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-0.1 dark:opacity-0.2 animate-pulse"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-16 lg:gap-20 lg:grid-cols-2 items-center max-w-8xl mx-auto"
            >
              <motion.div variants={slideIn} className="space-y-10 lg:pr-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                >
                  <Badge
                    variant="outline"
                    className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
                    <span className="text-primary">{t("home.securityPromise")}</span>
                  </Badge>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight"
                >
                  {t("home.yourSecurity")}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
                >
                  {t("home.securityDesc")}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="space-y-6"
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="group flex items-start p-6 rounded-2xl bg-background/80 border border-primary/20 hover:border-primary/30 hover:bg-background/90 transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mr-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2 text-primary group-hover:text-primary transition-colors">
                          {t(`home.securityFeature${i}Title`)}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {t(`home.securityFeature${i}Desc`)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link href="/security">
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      {t("home.learnMoreSecurity")}
                      <ArrowUpRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div variants={fadeInScale} className="relative lg:pl-8">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                  className="relative bg-background/95 border-2 border-primary/20 rounded-3xl shadow-sm overflow-hidden group"
                >
                  <div className="absolute top-6 left-6 z-20 flex space-x-2">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <Lock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                                    <div className="absolute bottom-6 right-6 z-20">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg"
                    >
                      <Database className="h-5 w-5 text-purple-600" />
                    </motion.div>
                  </div>

                  <Lottie
                    animationData={animationData1}
                    loop
                    className="w-full h-[450px] lg:h-[550px] object-cover transition-all duration-700 group-hover:scale-105"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="absolute -top-6 -left-6 w-20 h-20 bg-emerald-500/20 rounded-full animate-pulse"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse delay-500"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-32 relative overflow-hidden" id="faq">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-0.1 dark:opacity-0.2 animate-pulse"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge
                  variant="outline"
                  className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <HelpCircle className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-primary">{t("home.faq")}</span>
                </Badge>
              </motion.div>

              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight"
              >
                {t("home.faqTitle")}
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                {t("home.faqDesc")}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <AccordionItem
                      value={`item-${i}`}
                      className="border border-primary/20 rounded-2xl overflow-hidden bg-background/90 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <AccordionTrigger className="px-6 py-5 text-left text-lg font-semibold text-primary hover:bg-primary/5 transition-all duration-300">
                        <span className="flex items-center gap-3">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          {t(`home.faqQuestion${i}`)}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-muted-foreground leading-relaxed">
                        {t(`home.faqAnswer${i}`)}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center mt-16"
              >
                <p className="text-lg text-muted-foreground mb-6">
                  {t("home.faqMoreQuestions")}
                </p>
                <Link href="/support">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    {t("home.contactSupport")}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center mb-6"
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Rocket className="w-4 h-4 mr-2 text-primary animate-pulse" />
                  <span className="text-primary">{t("home.getStarted")}</span>
                </Badge>
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight"
              >
                {t("home.ctaTitle")}
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
              >
                {t("home.ctaDesc")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="rounded-full px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      {t("home.exploreOpportunities")}
                      <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-7 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      {t("home.joinNow")}
                      <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )}