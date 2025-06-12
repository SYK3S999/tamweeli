"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, BookOpen, Clock, ArrowRight } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
}

// Mock blog data
interface Blog {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  category: "islamic-finance" | "investment" | "entrepreneurship" | "project-management"
  readTime: number // in minutes
}

const mockBlogs: Blog[] = [
  {
    id: "blog-1",
    title: "Understanding Murabaha Financing in Algeria",
    excerpt: "Learn how Murabaha, a Shariah-compliant financing model, can help fund your projects with transparent pricing, ideal for Algerian entrepreneurs.",
    author: "Fatima Zahra",
    date: "2025-06-10T00:00:00Z",
    category: "islamic-finance",
    readTime: 5,
  },
  {
    id: "blog-2",
    title: "Top 5 Investment Opportunities in Algeria for 2025",
    excerpt: "Explore high-potential sectors like renewable energy and agrotech, with insights on maximizing returns up to 10% annually in DZD.",
    author: "Mohamed Amine",
    date: "2025-06-08T00:00:00Z",
    category: "investment",
    readTime: 7,
  },
  {
    id: "blog-3",
    title: "How to Create a Winning Project Proposal",
    excerpt: "Tips for Algerian project owners to craft compelling proposals that attract investors on TamweeliNet, with examples from successful projects.",
    author: "Amina Boudiaf",
    date: "2025-06-05T00:00:00Z",
    category: "project-management",
    readTime: 6,
  },
  {
    id: "blog-4",
    title: "Starting a Business in Algiers: A Step-by-Step Guide",
    excerpt: "From registration to funding, learn how to launch a Shariah-compliant startup in Algeria with as little as 100,000 DZD.",
    author: "Karim Saidi",
    date: "2025-06-03T00:00:00Z",
    category: "entrepreneurship",
    readTime: 8,
  },
]

export default function BlogsPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { user } = useAuth()
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    // Simulate loading blogs
    setTimeout(() => {
      setBlogs(mockBlogs)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: t("common.all") },
    { value: "islamic-finance", label: t("categories.islamicFinance") },
    { value: "investment", label: t("categories.investment") },
    { value: "entrepreneurship", label: t("categories.entrepreneurship") },
    { value: "project-management", label: t("categories.projectManagement") },
  ]

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center h-[calc(100vh-4rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">{t("common.loading")}</p>
        </div>
      </motion.div>
    )
  }

  return (
    /*/ adding the custom nav bar */
    <div className={cn("bg-background text-foreground", isRtl && "rtl")}>
      <Navbar />
      <main className="pt-16">

   


    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

      <section className="py-12 md:py-16 relative z-10">
        <div className="container px-4 md:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge
                  variant="outline"
                  className="mb-3 px-4 py-2 text-base font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <span className="text-primary">{t("blogs.title")}</span>
                </Badge>
                <h2 className="text-3xl md:text-4xl font-semibold text-primary">
                  {t("blogs.title")}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {t("blogs.description")}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/dashboard">
                    <span className="flex items-center gap-3">
                      {t("blogs.backToDashboard")}
                      <ArrowRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("blogs.searchPlaceholder")}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10"
                  aria-label={t("blogs.searchPlaceholder")}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 rounded-xl border-primary/20 focus:border-primary hover:bg-primary/10">
                  <SelectValue placeholder={t("blogs.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border-primary/20 rounded-xl">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Blog Posts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.length === 0 ? (
                <motion.div variants={fadeInUp}>
                  <Card className="backdrop-blur bg-background/95 border-primary/20 rounded-3xl shadow-xl text-center py-16">
                    <p className="text-lg text-muted-foreground">{t("blogs.noBlogs")}</p>
                  </Card>
                </motion.div>
              ) : (
                filteredBlogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    variants={{ ...fadeInUp, ...cardHover }}
                    whileHover="hover"
                  >
                    <Card className="backdrop-blur bg-background/95 border-primary/20 rounded-3xl shadow-xl p-6 h-full flex flex-col">
                      <Badge className="mb-4 bg-primary/10 text-primary w-fit">
                        {t(`categories.${blog.category}`)}
                      </Badge>
                      <h3 className="text-xl font-semibold text-primary line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{blog.excerpt}</p>
                      <div className="mt-4 text-sm text-muted-foreground space-y-1">
                        <p>{t("blogs.by")}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(blog.date, t("language"))}</span>
                          <span>•</span>
                          <span>{t("blogs.readTime")}</span>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-auto rounded-full border-primary/20 hover:bg-primary/10"
                      >
                        <Link href={`/blogs/${blog.id}`} aria-label={t("blogs.readMore")}>
                          {t("blogs.readMore")}
                        </Link>
                      </Button>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
       </main>
    </div>
  )
}