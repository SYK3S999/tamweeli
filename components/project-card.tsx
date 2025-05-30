"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Building, Calendar, Clock, DollarSign, Eye, Bookmark, ArrowRight } from "lucide-react"
import { cn, translateSector, translateContractType, formatCurrency, formatDate } from "@/lib/utils"

// Framer Motion variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.03, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
}

interface ProjectCardProps {
  project: any
  isSaved?: boolean
  onToggleSave?: (id: string, event: React.MouseEvent) => void
}

export function ProjectCard({ project, isSaved, onToggleSave }: ProjectCardProps) {
  const { t, language, direction } = useLanguage()
  const rtl = direction === "rtl"

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <Card className="relative overflow-hidden bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        <div className="absolute inset-[1px] bg-background/95 rounded-2xl" />

        <div className="relative z-10">
          <div className="h-48 bg-muted/20">
            {project.images && project.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.images[0] || "/placeholder.svg"}
                alt={project.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            )}
          </div>
          {onToggleSave && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm border border-primary/30 hover:bg-primary/10 rounded-full h-9 w-9 shadow-md group-hover:shadow-lg transition-all duration-300"
              onClick={(e) => onToggleSave(project.id, e)}
            >
              <Bookmark
                className={cn(
                  "h-5 w-5",
                  isSaved ? "fill-primary text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span className="sr-only">{isSaved ? t("project.saved") : t("project.save")}</span>
            </Button>
          )}
          {project.trending && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full px-3 py-1">
              {t("tabs.trending")}
            </Badge>
          )}
          {project.isNew && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full px-3 py-1">
              {t("tabs.new")}
            </Badge>
          )}
        </div>

        <CardHeader className="relative z-10 pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {project.name}
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 text-sm font-medium capitalize"
            >
              {translateSector(project.sector, t)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <p className="text-base text-muted-foreground font-medium line-clamp-2 mb-4">{project.description}</p>
          <div className="space-y-3">
            <div className="w-full bg-muted/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-primary/90 h-3 rounded-full"
                style={{
                  width: `${Math.min(Math.round(((project.fundingRaised || 0) / project.amount) * 100), 100)}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground font-medium">
              <span>{formatCurrency(project.fundingRaised || 0, t)}</span>
              <span>{formatCurrency(project.amount, t)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span className="truncate text-foreground font-medium">
                {translateContractType(project.contractType, t)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">{project.returnRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">{formatDate(project.createdAt, language)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">
                {project.duration} {t("project.months")}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative z-10">
          <Button
            asChild
            className="w-full rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-secondary text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link href={`/projects/${project.id}`}>
              <span className="flex items-center justify-center gap-3">
                <Eye className={cn("h-5 w-5", rtl ? "ml-2" : "mr-2")} />
                {t("project.viewDetails")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}