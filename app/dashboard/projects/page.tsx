// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useLanguage } from "@/components/language-provider"
// import { useAuth } from "@/components/auth-provider"
// import { Building, DollarSign, Eye, MapPin, ArrowRight } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { cn, formatCurrency } from "@/lib/utils"

// // Framer Motion variants
// const fadeInUp = {
//   hidden: { opacity: 0, y: 60 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
// }
// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
// }
// const cardHover = {
//   hover: { scale: 1.02, transition: { duration: 0.3 } },
// }

// // Mock project data
// const mockProjects: Project[] = [
//   {
//     id: "proj-1",
//     name: "Tamweeli Water Purification",
//     description: "Nano-filtration technology to provide clean water in rural Africa and Asia.",
//     sector: "healthcare",
//     status: "approved",
//     amount: 500000,
//     contractType: "murabaha",
//     location: "Africa, Asia",
//     fundingGoal: 500000,
//     fundingRaised: 435000,
//     expectedReturn: 10,
//     duration: 12,
//     riskLevel: "moderate",
//   },
//   {
//     id: "proj-2",
//     name: "EcoSmart Solar Farms",
//     description: "Sustainable solar energy solutions for urban and rural communities.",
//     sector: "technology",
//     status: "approved",
//     amount: 750000,
//     contractType: "musharaka",
//     location: "Middle East",
//     fundingGoal: 750000,
//     fundingRaised: 600000,
//     expectedReturn: 12,
//     duration: 18,
//     riskLevel: "low",
//   },
//   {
//     id: "proj-3",
//     name: "GreenHarvest Agrotech",
//     description: "Smart farming solutions to boost agricultural productivity.",
//     sector: "agriculture",
//     status: "approved",
//     amount: 300000,
//     contractType: "mudaraba",
//     location: "North Africa",
//     fundingGoal: 300000,
//     fundingRaised: 150000,
//     expectedReturn: 8,
//     duration: 24,
//     riskLevel: "moderate",
//   },
//   {
//     id: "proj-4",
//     name: "EduFuture E-Learning",
//     description: "Online platform for accessible education in underserved regions.",
//     sector: "education",
//     status: "approved",
//     amount: 200000,
//     contractType: "murabaha",
//     location: "South Asia",
//     fundingGoal: 200000,
//     fundingRaised: 180000,
//     expectedReturn: 7,
//     duration: 12,
//     riskLevel: "low",
//   },
// ]

// interface Project {
//   id: string
//   name: string
//   description: string
//   sector: string
//   status: string
//   amount: number
//   contractType: string
//   location: string
//   fundingGoal: number
//   fundingRaised: number
//   expectedReturn: number
//   duration: number
//   riskLevel: string
// }

// export default function ProjectsPage() {
//   const { t, direction } = useLanguage()
//   const { isAuthenticated } = useAuth()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedSector, setSelectedSector] = useState<string>("all")
//   const [selectedContractType, setSelectedContractType] = useState<string>("all")
//   const isRtl = direction === "rtl"

//   // Use mock projects
//   const projects = mockProjects

//   // Only show approved projects
//   const approvedProjects = projects.filter((project) => project.status === "approved")

//   // Apply filters
//   const filteredProjects = approvedProjects.filter((project) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       (project.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//       (project.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
//     const matchesSector = selectedSector === "all" || project.sector === selectedSector
//     const matchesContractType = selectedContractType === "all" || project.contractType === selectedContractType

//     return matchesSearch && matchesSector && matchesContractType
//   })

//   const sectors = [
//     { value: "all", label: t("allSectors") },
//     { value: "technology", label: t("technology") },
//     { value: "agriculture", label: t("agriculture") },
//     { value: "real-estate", label: t("realEstate") },
//     { value: "education", label: t("education") },
//     { value: "healthcare", label: t("healthcare") },
//     { value: "retail", label: t("retail") },
//     { value: "manufacturing", label: t("manufacturing") },
//     { value: "other", label: t("other") },
//   ]

//   const contractTypes = [
//     { value: "all", label: t("allContractTypes") },
//     { value: "murabaha", label: t("murabaha") },
//     { value: "musharaka", label: t("musharaka") },
//     { value: "mudaraba", label: t("mudaraba") },
//   ]

//   return (
//     <div className="flex min-h-screen flex-col">
//       <main className="flex-1 relative overflow-hidden">
//         {/* Background Effects */}
//         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/30 dark:via-background dark:to-secondary/30"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20"></div>
//         <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full animate-pulse"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>

//         <section className="py-12 md:py-16 relative z-10">
//           <div className="container px-4 md:px-6">
//             <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
//               {/* Header */}
//               <motion.div variants={fadeInUp}>
//                 <Badge
//                   variant="outline"
//                   className="mb-6 px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-full"
//                 >
//                   <span className="text-primary">{t("nav.projects")}</span>
//                 </Badge>
//                 <h2 className="text-3xl md:text-4xl font-semibold text-primary">{t("nav.projects")}</h2>
//                 <p className="text-muted-foreground mt-2">{t("projects.description")}</p>
//               </motion.div>

//               {/* Filters */}
//               <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-3">
//                 <div className="md:col-span-2">
//                   <Input
//                     placeholder={t("projects.searchPlaceholder")}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <Select value={selectedSector} onValueChange={setSelectedSector}>
//                     <SelectTrigger className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300">
//                       <SelectValue placeholder={t("sector")} />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background/95 border-primary/20 rounded-xl">
//                       {sectors.map((sector) => (
//                         <SelectItem key={sector.value} value={sector.value} className="hover:bg-primary/10">
//                           {sector.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Select value={selectedContractType} onValueChange={setSelectedContractType}>
//                     <SelectTrigger className="pl-4 pr-4 py-4 border-primary/20 rounded-xl focus:border-primary hover:bg-primary/10 transition-all duration-300">
//                       <SelectValue placeholder={t("contractType")} />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background/95 border-primary/20 rounded-xl">
//                       {contractTypes.map((type) => (
//                         <SelectItem key={type.value} value={type.value} className="hover:bg-primary/10">
//                           {type.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </motion.div>

//               {/* Projects Grid */}
//               {filteredProjects.length === 0 ? (
//                 <motion.div variants={fadeInUp}>
//                   <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl">
//                     <div className="py-10 text-center text-muted-foreground">{t("projects.noProjects")}</div>
//                   </Card>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   variants={staggerContainer}
//                   className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6"
//                 >
//                   {filteredProjects.map((project) => (
//                     <ProjectCard key={project.id} project={project} isRtl={isRtl} />
//                   ))}
//                 </motion.div>
//               )}
//             </motion.div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// function ProjectCard({ project, isRtl }: { project: Project; isRtl: boolean }) {
//   const { t } = useLanguage()
//   const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100

//   return (
//     <motion.div variants={{ ...fadeInUp, ...cardHover }} whileHover="hover">
//       <Card className="backdrop-blur-xl bg-background/95 border-primary/20 rounded-3xl shadow-2xl h-full flex flex-col">
//         <div className="p-6 flex-grow">
//           <div className="mb-4">
//             <h3 className="text-xl font-semibold text-primary line-clamp-1">{project.name}</h3>
//             <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{project.description}</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 text-sm text-foreground">
//             <div className="flex items-center gap-1">
//               <Building className="h-4 w-4 text-muted-foreground" />
//               <span className="capitalize">{project.sector}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//               <span>{formatCurrency(project.amount)}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Badge variant="outline" className="capitalize bg-primary/5 border-primary/20 text-primary">
//                 {project.contractType}
//               </Badge>
//             </div>
//             <div className="flex items-center gap-1">
//               <MapPin className="h-4 w-4 text-muted-foreground" />
//               <span className="truncate">{project.location}</span>
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="flex justify-between text-sm text-muted-foreground mb-1">
//               <span>{t("fundingProgress")}</span>
//               <span>{Math.round(fundingProgress)}%</span>
//             </div>
//             <div className="w-full bg-primary/20 rounded-full h-2">
//               <div
//                 className="bg-primary h-2 rounded-full"
//                 style={{ width: `${Math.min(fundingProgress, 100)}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//         <div className="p-6 pt-0">
//           <Button
//             asChild
//             className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-lg font-semibold group"
//           >
//             <Link href={`/projects/${project.id}`}>
//               <span className="flex items-center gap-3">
//                 {t("viewProject")}
//                 <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-2", isRtl && "rotate-180")} />
//               </span>
//             </Link>
//           </Button>
//         </div>
//       </Card>
//     </motion.div>
//   )
// }