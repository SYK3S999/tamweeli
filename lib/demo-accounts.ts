// Demo accounts for the application

import type { UserType, InvestorType } from "@/components/auth-provider"

// User interfaces
export interface DemoUser {
  id: string
  name: string
  email: string
  password: string
  userType: UserType
  investorType?: InvestorType
  companyName?: string
  activityType?: string
  registrationNumber?: string
  isVerified: boolean
  createdAt: string
  avatar?: string
  bio?: string
  phone?: string
  address?: string
  website?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  preferences?: {
    language: "en" | "ar"
    theme: "light" | "dark"
    notifications: boolean
    twoFactorAuth: boolean
  }
}

export interface Wallet {
  userId: string
  balance: number
  pendingBalance: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "investment" | "return" | "funding" | "payment" | "service-fee"
  amount: number
  description: string
  status: "pending" | "completed" | "failed" | "in-progress"
  createdAt: string
  projectId?: string
  serviceId?: string
}

export interface Project {
  id: string
  ownerId: string
  title: string
  description: string
  sector: string
  fundingGoal: number
  fundingRaised: number
  status: "pending" | "approved" | "rejected" | "funded" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  endDate: string
  location: string
  image: string
  documents?: string[]
  contractType: string
  expectedReturn: number
  duration: number
  riskLevel: "low" | "medium" | "high"
  tags: string[]
  milestones?: {
    id: string
    title: string
    description: string
    dueDate: string
    status: "pending" | "completed" | "delayed"
  }[]
}

export interface Service {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  status: "available" | "unavailable"
  createdAt: string
  updatedAt: string
  image: string
  duration: string
  rating: number
  reviewCount: number
}

export interface ServiceRequest {
  id: string
  userId: string
  serviceId: string
  status: "pending" | "approved" | "rejected" | "completed"
  createdAt: string
  message: string
}

export interface Investment {
  id: string
  investorId: string
  projectId: string
  amount: number
  status: "pending" | "approved" | "rejected" | "completed"
  createdAt: string
  expectedReturn: number
  returnDate: string
  contractSigned: boolean
}

// Demo users
const demoUsers: DemoUser[] = [
  // Investors
  {
    id: "user-investor",
    name: "Ahmed Benali",
    email: "investor@tamweeli.dz",
    password: "password123",
    userType: "investor",
    investorType: "individual",
    isVerified: true,
    createdAt: new Date(2023, 0, 15).toISOString(),
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+213 555 123 456",
    address: "15 Rue Didouche Mourad, Algiers, Algeria",
    bio: "Experienced investor with a focus on sustainable agriculture and technology projects.",
    preferences: {
      language: "en",
      theme: "light",
      notifications: true,
      twoFactorAuth: false,
    },
  },
  {
    id: "user-investor-2",
    name: "Nadia Belkacem",
    email: "nadia.belkacem@example.com",
    password: "password123",
    userType: "investor",
    investorType: "institution",
    isVerified: true,
    createdAt: new Date(2023, 1, 20).toISOString(),
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+213 555 234 567",
    address: "27 Boulevard Mohamed V, Oran, Algeria",
    bio: "Angel investor specializing in education and healthcare innovations.",
    companyName: "Belkacem Investments",
    website: "www.belkaceminvestments.dz",
    socialMedia: {
      linkedin: "linkedin.com/in/nadiabelkacem",
      twitter: "twitter.com/nadiabelkacem",
    },
    preferences: {
      language: "ar",
      theme: "dark",
      notifications: true,
      twoFactorAuth: true,
    },
  },

  // Project Owners
  {
    id: "user-project-owner",
    name: "Karim Hadj",
    email: "entrepreneur@tamweeli.dz",
    password: "password123",
    userType: "project-owner",
    companyName: "Tech Algérie",
    activityType: "Technology",
    registrationNumber: "RC123456",
    isVerified: true,
    createdAt: new Date(2023, 1, 20).toISOString(),
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+213 555 456 789",
    address: "23 Rue Larbi Ben M'hidi, Tlemcen, Algeria",
    bio: "Tech entrepreneur with a passion for building the Algerian startup ecosystem.",
    website: "www.techalgerie.dz",
    socialMedia: {
      linkedin: "linkedin.com/in/karimhadj",
      twitter: "twitter.com/karimhadj",
    },
    preferences: {
      language: "ar",
      theme: "light",
      notifications: true,
      twoFactorAuth: false,
    },
  },
  {
    id: "user-project-owner-2",
    name: "Leila Mansouri",
    email: "leila.mansouri@example.com",
    password: "password123",
    userType: "project-owner",
    companyName: "AlgTech Ventures",
    activityType: "Software Development",
    registrationNumber: "RC789012",
    isVerified: true,
    createdAt: new Date(2023, 2, 15).toISOString(),
    avatar: "/placeholder.svg?height=200&width=200",
    preferences: {
      language: "en",
      theme: "dark",
      notifications: true,
      twoFactorAuth: true,
    },
  },

  // Admin/Consultant
  {
    id: "user-admin",
    name: "Fatima Zahra",
    email: "admin@tamweeli.dz",
    password: "password123",
    userType: "consultant", // Consultant and admin are the same
    isVerified: true,
    createdAt: new Date(2022, 11, 10).toISOString(),
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+213 555 678 901",
    address: "12 Rue Amir Abdelkader, Constantine, Algeria",
    bio: "Financial consultant with expertise in Islamic finance and Shariah-compliant investments.",
    preferences: {
      language: "ar",
      theme: "light",
      notifications: true,
      twoFactorAuth: true,
    },
  },
  {
    id: "user-consultant-2",
    name: "Rachid Meziane",
    email: "rachid.meziane@example.com",
    password: "password123",
    userType: "consultant",
    isVerified: true,
    createdAt: new Date(2023, 0, 5).toISOString(),
    avatar: "/placeholder.svg?height=200&width=200",
    preferences: {
      language: "en",
      theme: "dark",
      notifications: true,
      twoFactorAuth: false,
    },
  },
]

// Demo wallets
const demoWallets: Wallet[] = [
  {
    userId: "user-investor",
    balance: 500000, // 500,000 DZD
    pendingBalance: 25000, // 25,000 DZD
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "user-investor-2",
    balance: 1500000, // 1,500,000 DZD
    pendingBalance: 75000, // 75,000 DZD
    createdAt: new Date(2023, 1, 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "user-project-owner",
    balance: 1200000, // 1,200,000 DZD
    pendingBalance: 50000, // 50,000 DZD
    createdAt: new Date(2023, 1, 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "user-project-owner-2",
    balance: 800000, // 800,000 DZD
    pendingBalance: 100000, // 100,000 DZD
    createdAt: new Date(2023, 2, 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "user-admin",
    balance: 2500000, // 2,500,000 DZD
    pendingBalance: 0,
    createdAt: new Date(2022, 11, 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "user-consultant-2",
    balance: 1800000, // 1,800,000 DZD
    pendingBalance: 200000, // 200,000 DZD
    createdAt: new Date(2023, 0, 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Demo projects
const demoProjects: Project[] = [
  {
    id: "project-1",
    ownerId: "user-project-owner",
    title: "Eco-Friendly Olive Oil Production",
    description:
      "Modernizing traditional olive oil production with eco-friendly methods and expanding export capabilities to European markets.",
    sector: "Agriculture",
    fundingGoal: 5000000, // 5,000,000 DZD
    fundingRaised: 3500000, // 3,500,000 DZD
    status: "approved",
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 15).toISOString(),
    endDate: new Date(2023, 8, 10).toISOString(),
    location: "Tlemcen, Algeria",
    image: "/placeholder.svg?height=400&width=600",
    contractType: "Mudarabah",
    expectedReturn: 15, // 15%
    duration: 24, // 24 months
    riskLevel: "medium",
    tags: ["agriculture", "export", "eco-friendly", "organic"],
    milestones: [
      {
        id: "milestone-1-1",
        title: "Equipment Purchase",
        description: "Purchase and install modern olive oil extraction equipment",
        dueDate: new Date(2023, 5, 15).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-1-2",
        title: "Organic Certification",
        description: "Obtain organic certification for export markets",
        dueDate: new Date(2023, 7, 30).toISOString(),
        status: "pending",
      },
    ],
  },
  {
    id: "project-2",
    ownerId: "user-project-owner-2",
    title: "AlgTech Mobile Payment Platform",
    description:
      "A Shariah-compliant mobile payment platform designed for the Algerian market, focusing on ease of use and security.",
    sector: "Technology",
    fundingGoal: 10000000, // 10,000,000 DZD
    fundingRaised: 7000000, // 7,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 1, 5).toISOString(),
    updatedAt: new Date(2023, 1, 10).toISOString(),
    endDate: new Date(2023, 7, 5).toISOString(),
    location: "Algiers, Algeria",
    image: "/placeholder.svg?height=400&width=600",
    contractType: "Musharakah",
    expectedReturn: 20, // 20%
    duration: 36, // 36 months
    riskLevel: "high",
    tags: ["fintech", "mobile", "payments", "technology"],
    milestones: [
      {
        id: "milestone-2-1",
        title: "Beta Launch",
        description: "Launch beta version to 1,000 test users",
        dueDate: new Date(2023, 4, 1).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-2-2",
        title: "Bank Integration",
        description: "Complete integration with major Algerian banks",
        dueDate: new Date(2023, 6, 15).toISOString(),
        status: "pending",
      },
    ],
  },
  {
    id: "project-3",
    ownerId: "user-project-owner",
    title: "Halal Pharmaceutical Research",
    description:
      "Research and development of halal pharmaceuticals using natural ingredients sourced from Algeria's biodiversity.",
    sector: "Healthcare",
    fundingGoal: 8000000, // 8,000,000 DZD
    fundingRaised: 2000000, // 2,000,000 DZD
    status: "pending",
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 3, 20).toISOString(),
    endDate: new Date(2023, 9, 20).toISOString(),
    location: "Constantine, Algeria",
    image: "/placeholder.svg?height=400&width=600",
    contractType: "Murabaha",
    expectedReturn: 12, // 12%
    duration: 48, // 48 months
    riskLevel: "medium",
    tags: ["healthcare", "pharmaceutical", "halal", "research"],
    milestones: [
      {
        id: "milestone-3-1",
        title: "Research Lab Setup",
        description: "Establish research laboratory and hire key personnel",
        dueDate: new Date(2023, 6, 1).toISOString(),
        status: "pending",
      },
    ],
  },
  {
    id: "project-4",
    ownerId: "user-project-owner-2",
    title: "Renewable Energy for Rural Communities",
    description:
      "Installing solar panels in rural communities to provide clean, reliable electricity and create local maintenance jobs.",
    sector: "Energy",
    fundingGoal: 15000000, // 15,000,000 DZD
    fundingRaised: 5000000, // 5,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 20).toISOString(),
    endDate: new Date(2023, 6, 15).toISOString(),
    location: "Adrar, Algeria",
    image: "/placeholder.svg?height=400&width=600",
    contractType: "Istisna'a",
    expectedReturn: 10, // 10%
    duration: 60, // 60 months
    riskLevel: "low",
    tags: ["energy", "solar", "rural", "sustainable"],
    milestones: [
      {
        id: "milestone-4-1",
        title: "First Village Installation",
        description: "Complete installation in the first target village",
        dueDate: new Date(2023, 3, 30).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-4-2",
        title: "Training Program",
        description: "Train local technicians for maintenance and support",
        dueDate: new Date(2023, 5, 15).toISOString(),
        status: "completed",
      },
    ],
  },
  {
    id: "project-5",
    ownerId: "user-project-owner",
    title: "Traditional Crafts E-Commerce Platform",
    description:
      "An online marketplace connecting Algerian artisans with global customers, preserving traditional crafts while providing sustainable income.",
    sector: "E-Commerce",
    fundingGoal: 3000000, // 3,000,000 DZD
    fundingRaised: 1500000, // 1,500,000 DZD
    status: "pending",
    createdAt: new Date(2023, 4, 5).toISOString(),
    updatedAt: new Date(2023, 4, 5).toISOString(),
    endDate: new Date(2023, 10, 5).toISOString(),
    location: "Ghardaïa, Algeria",
    image: "/placeholder.svg?height=400&width=600",
    contractType: "Mudarabah",
    expectedReturn: 18, // 18%
    duration: 24, // 24 months
    riskLevel: "medium",
    tags: ["e-commerce", "crafts", "cultural", "export"],
    milestones: [
      {
        id: "milestone-5-1",
        title: "Platform Development",
        description: "Complete development of the e-commerce platform",
        dueDate: new Date(2023, 7, 1).toISOString(),
        status: "pending",
      },
    ],
  },
]

// Demo services
const demoServices: Service[] = [
  {
    id: "service-1",
    providerId: "user-admin",
    title: "Islamic Finance Compliance Audit",
    description: "Comprehensive audit of business operations and financial structures to ensure Shariah compliance.",
    category: "Financial Consulting",
    price: 150000, // 150,000 DZD
    status: "available",
    createdAt: new Date(2023, 0, 10).toISOString(),
    updatedAt: new Date(2023, 0, 10).toISOString(),
    image: "/placeholder.svg?height=300&width=400",
    duration: "2 weeks",
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "service-2",
    providerId: "user-consultant-2",
    title: "Business Plan Development",
    description: "Creation of comprehensive business plans tailored for Islamic finance funding applications.",
    category: "Business Planning",
    price: 100000, // 100,000 DZD
    status: "available",
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString(),
    image: "/placeholder.svg?height=300&width=400",
    duration: "3 weeks",
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: "service-3",
    providerId: "user-admin",
    title: "Investor Pitch Preparation",
    description: "Preparation and coaching for presenting to Islamic investors, including pitch deck creation.",
    category: "Investment Readiness",
    price: 80000, // 80,000 DZD
    status: "available",
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString(),
    image: "/placeholder.svg?height=300&width=400",
    duration: "1 week",
    rating: 4.9,
    reviewCount: 32,
  },
  {
    id: "service-4",
    providerId: "user-consultant-2",
    title: "Market Research and Analysis",
    description: "In-depth market research and competitive analysis for the Algerian and MENA markets.",
    category: "Market Research",
    price: 120000, // 120,000 DZD
    status: "available",
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 3, 10).toISOString(),
    image: "/placeholder.svg?height=300&width=400",
    duration: "4 weeks",
    rating: 4.7,
    reviewCount: 15,
  },
  {
    id: "service-5",
    providerId: "user-admin",
    title: "Halal Certification Guidance",
    description: "Guidance through the process of obtaining halal certification for products and services.",
    category: "Compliance",
    price: 90000, // 90,000 DZD
    status: "available",
    createdAt: new Date(2023, 4, 20).toISOString(),
    updatedAt: new Date(2023, 4, 20).toISOString(),
    image: "/placeholder.svg?height=300&width=400",
    duration: "6 weeks",
    rating: 4.5,
    reviewCount: 12,
  },
]

// Demo service requests
const demoServiceRequests: ServiceRequest[] = [
  {
    id: "request-1",
    userId: "user-project-owner",
    serviceId: "service-1",
    status: "approved",
    createdAt: new Date(2023, 2, 15).toISOString(),
    message: "We need a comprehensive Shariah compliance audit for our new olive oil export business.",
  },
  {
    id: "request-2",
    userId: "user-project-owner-2",
    serviceId: "service-3",
    status: "pending",
    createdAt: new Date(2023, 4, 10).toISOString(),
    message: "We're preparing to pitch to a group of Islamic investors and need help with our presentation.",
  },
  {
    id: "request-3",
    userId: "user-project-owner",
    serviceId: "service-5",
    status: "completed",
    createdAt: new Date(2023, 1, 5).toISOString(),
    message: "We need guidance on obtaining halal certification for our pharmaceutical products.",
  },
  {
    id: "request-4",
    userId: "user-project-owner-2",
    serviceId: "service-2",
    status: "pending",
    createdAt: new Date(2023, 4, 25).toISOString(),
    message: "We need a comprehensive business plan for our renewable energy project.",
  },
]

// Demo investments
const demoInvestments: Investment[] = [
  {
    id: "investment-1",
    investorId: "user-investor",
    projectId: "project-1",
    amount: 1000000, // 1,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 2, 20).toISOString(),
    expectedReturn: 150000, // 150,000 DZD
    returnDate: new Date(2025, 2, 20).toISOString(),
    contractSigned: true,
  },
  {
    id: "investment-2",
    investorId: "user-investor-2",
    projectId: "project-1",
    amount: 2500000, // 2,500,000 DZD
    status: "approved",
    createdAt: new Date(2023, 3, 5).toISOString(),
    expectedReturn: 375000, // 375,000 DZD
    returnDate: new Date(2025, 3, 5).toISOString(),
    contractSigned: true,
  },
  {
    id: "investment-3",
    investorId: "user-investor",
    projectId: "project-2",
    amount: 2000000, // 2,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 2, 10).toISOString(),
    expectedReturn: 400000, // 400,000 DZD
    returnDate: new Date(2026, 2, 10).toISOString(),
    contractSigned: true,
  },
  {
    id: "investment-4",
    investorId: "user-investor-2",
    projectId: "project-2",
    amount: 5000000, // 5,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 2, 15).toISOString(),
    expectedReturn: 1000000, // 1,000,000 DZD
    returnDate: new Date(2026, 2, 15).toISOString(),
    contractSigned: true,
  },
  {
    id: "investment-5",
    investorId: "user-investor",
    projectId: "project-4",
    amount: 3000000, // 3,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 1, 25).toISOString(),
    expectedReturn: 300000, // 300,000 DZD
    returnDate: new Date(2028, 1, 25).toISOString(),
    contractSigned: true,
  },
  {
    id: "investment-6",
    investorId: "user-investor-2",
    projectId: "project-4",
    amount: 2000000, // 2,000,000 DZD
    status: "approved",
    createdAt: new Date(2023, 2, 1).toISOString(),
    expectedReturn: 200000, // 200,000 DZD
    returnDate: new Date(2028, 2, 1).toISOString(),
    contractSigned: true,
  },
  {
    id: "investment-7",
    investorId: "user-investor",
    projectId: "project-3",
    amount: 1000000, // 1,000,000 DZD
    status: "pending",
    createdAt: new Date(2023, 4, 5).toISOString(),
    expectedReturn: 120000, // 120,000 DZD
    returnDate: new Date(2027, 4, 5).toISOString(),
    contractSigned: false,
  },
  {
    id: "investment-8",
    investorId: "user-investor-2",
    projectId: "project-5",
    amount: 1500000, // 1,500,000 DZD
    status: "pending",
    createdAt: new Date(2023, 4, 15).toISOString(),
    expectedReturn: 270000, // 270,000 DZD
    returnDate: new Date(2025, 4, 15).toISOString(),
    contractSigned: false,
  },
]

// Generate transactions
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = []

  // Generate transactions for each user
  demoUsers.forEach((user) => {
    // Deposits
    for (let i = 0; i < 5; i++) {
      transactions.push({
        id: `transaction-deposit-${user.id}-${i}`,
        userId: user.id,
        type: "deposit",
        amount: Math.floor(Math.random() * 100000) + 50000, // Random amount between 50,000 and 150,000 DZD
        description: `Deposit to wallet`,
        status: "completed",
        createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))).toISOString(),
      })
    }

    // Withdrawals
    for (let i = 0; i < 3; i++) {
      transactions.push({
        id: `transaction-withdrawal-${user.id}-${i}`,
        userId: user.id,
        type: "withdrawal",
        amount: Math.floor(Math.random() * 50000) + 10000, // Random amount between 10,000 and 60,000 DZD
        description: `Withdrawal from wallet`,
        status: "completed",
        createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 20))).toISOString(),
      })
    }

    // Add specific transactions based on user type
    if (user.userType === "investor") {
      // Investments
      demoInvestments
        .filter((inv) => inv.investorId === user.id && inv.status === "approved")
        .forEach((inv) => {
          transactions.push({
            id: `transaction-investment-${inv.id}`,
            userId: user.id,
            type: "investment",
            amount: inv.amount,
            description: `Investment in ${demoProjects.find((p) => p.id === inv.projectId)?.title || "Project"}`,
            status: "completed",
            createdAt: inv.createdAt,
            projectId: inv.projectId,
          })
        })

      // Returns (simulated)
      for (let i = 0; i < 3; i++) {
        const randomProject = demoProjects[Math.floor(Math.random() * demoProjects.length)]
        transactions.push({
          id: `transaction-return-${user.id}-${i}`,
          userId: user.id,
          type: "return",
          amount: Math.floor(Math.random() * 30000) + 5000, // Random amount between 5,000 and 35,000 DZD
          description: `Return from ${randomProject.title}`,
          status: "completed",
          createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 15))).toISOString(),
          projectId: randomProject.id,
        })
      }
    } else if (user.userType === "project-owner") {
      // Funding
      demoProjects
        .filter((proj) => proj.ownerId === user.id && proj.status === "approved")
        .forEach((proj) => {
          transactions.push({
            id: `transaction-funding-${proj.id}`,
            userId: user.id,
            type: "funding",
            amount: proj.fundingRaised,
            description: `Funding received for ${proj.title}`,
            status: "completed",
            createdAt: new Date(new Date(proj.createdAt).setDate(new Date(proj.createdAt).getDate() + 5)).toISOString(),
            projectId: proj.id,
          })
        })

      // Service payments
      demoServiceRequests
        .filter((req) => req.userId === user.id && req.status === "completed")
        .forEach((req) => {
          const service = demoServices.find((s) => s.id === req.serviceId)
          if (service) {
            transactions.push({
              id: `transaction-payment-${req.id}`,
              userId: user.id,
              type: "payment",
              amount: service.price,
              description: `Payment for ${service.title}`,
              status: "completed",
              createdAt: new Date(new Date(req.createdAt).setDate(new Date(req.createdAt).getDate() + 2)).toISOString(),
              serviceId: service.id,
            })
          }
        })
    } else if (user.userType === "consultant") {
      // Service fees
      demoServices
        .filter((service) => service.providerId === user.id)
        .forEach((service, index) => {
          transactions.push({
            id: `transaction-service-fee-${service.id}-${index}`,
            userId: user.id,
            type: "service-fee",
            amount: service.price,
            description: `Service fee for ${service.title}`,
            status: "completed",
            createdAt: new Date(
              new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 60)),
            ).toISOString(),
            serviceId: service.id,
          })
        })
    }

    // Add a pending transaction for each user
    transactions.push({
      id: `transaction-pending-${user.id}`,
      userId: user.id,
      type: "deposit",
      amount: Math.floor(Math.random() * 50000) + 25000, // Random amount between 25,000 and 75,000 DZD
      description: `Pending deposit to wallet`,
      status: "pending",
      createdAt: new Date(new Date().setHours(new Date().getHours() - Math.floor(Math.random() * 12))).toISOString(),
    })
  })

  return transactions
}

// Initialize demo accounts
export function initializeDemoAccounts() {
  // Check if demo accounts are initialized or users list is empty/corrupted
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  if (!localStorage.getItem("demoAccountsInitialized") || users.length === 0) {
    // Reset localStorage
    localStorage.removeItem("users")
    localStorage.removeItem("wallets")
    localStorage.removeItem("projects")
    localStorage.removeItem("services")
    localStorage.removeItem("serviceRequests")
    localStorage.removeItem("investments")
    localStorage.removeItem("transactions")
    localStorage.removeItem("demoAccountsInitialized")

    // Initialize users
    localStorage.setItem("users", JSON.stringify(demoUsers))

    // Initialize wallets
    localStorage.setItem("wallets", JSON.stringify(demoWallets))

    // Initialize projects
    localStorage.setItem("projects", JSON.stringify(demoProjects))

    // Initialize services
    localStorage.setItem("services", JSON.stringify(demoServices))

    // Initialize service requests
    localStorage.setItem("serviceRequests", JSON.stringify(demoServiceRequests))

    // Initialize investments
    localStorage.setItem("investments", JSON.stringify(demoInvestments))

    // Initialize transactions
    const transactions = generateTransactions()
    localStorage.setItem("transactions", JSON.stringify(transactions))

    // Mark as initialized
    localStorage.setItem("demoAccountsInitialized", "true")

    console.log("Demo accounts initialized")
  }
}

// Get demo user by email
export function getDemoUserByEmail(email: string): DemoUser | undefined {
  return demoUsers.find((user) => user.email === email)
}

// Get demo wallet by user ID
export function getDemoWalletByUserId(userId: string): Wallet | undefined {
  return demoWallets.find((wallet) => wallet.userId === userId)
}

// Get demo transactions by user ID
export function getDemoTransactionsByUserId(userId: string): Transaction[] {
  return generateTransactions().filter((transaction) => transaction.userId === userId)
}

// Get demo projects by owner ID
export function getDemoProjectsByOwnerId(ownerId: string): Project[] {
  return demoProjects.filter((project) => project.ownerId === ownerId)
}

// Get demo investments by investor ID
export function getDemoInvestmentsByInvestorId(investorId: string): Investment[] {
  return demoInvestments.filter((investment) => investment.investorId === investorId)
}

// Get demo services by provider ID
export function getDemoServicesByProviderId(providerId: string): Service[] {
  return demoServices.filter((service) => service.providerId === providerId)
}

// Get demo service requests by user ID
export function getDemoServiceRequestsByUserId(userId: string): ServiceRequest[] {
  return demoServiceRequests.filter((request) => request.userId === userId)
}

// Add a new project
export function addDemoProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const newProject: Project = {
    ...project,
    id: `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const projects = JSON.parse(localStorage.getItem("projects") || "[]")
  projects.push(newProject)
  localStorage.setItem("projects", JSON.stringify(projects))

  return newProject
}

// Update project status
export function updateDemoProjectStatus(projectId: string, status: Project["status"]): Project | null {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]")
  const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

  if (projectIndex === -1) return null

  projects[projectIndex].status = status
  projects[projectIndex].updatedAt = new Date().toISOString()

  localStorage.setItem("projects", JSON.stringify(projects))

  return projects[projectIndex]
}

// Add a new investment
export function addDemoInvestment(investment: Omit<Investment, "id" | "createdAt">): Investment {
  const newInvestment: Investment = {
    ...investment,
    id: `investment-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const investments = JSON.parse(localStorage.getItem("investments") || "[]")
  investments.push(newInvestment)
  localStorage.setItem("investments", JSON.stringify(investments))

  return newInvestment
}

// Update investment status
export function updateDemoInvestmentStatus(investmentId: string, status: Investment["status"]): Investment | null {
  const investments = JSON.parse(localStorage.getItem("investments") || "[]")
  const investmentIndex = investments.findIndex((i: Investment) => i.id === investmentId)

  if (investmentIndex === -1) return null

  investments[investmentIndex].status = status

  localStorage.setItem("investments", JSON.stringify(investments))

  return investments[investmentIndex]
}

// Add a new service request
export function addDemoServiceRequest(request: Omit<ServiceRequest, "id" | "createdAt">): ServiceRequest {
  const newRequest: ServiceRequest = {
    ...request,
    id: `request-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const requests = JSON.parse(localStorage.getItem("serviceRequests") || "[]")
  requests.push(newRequest)
  localStorage.setItem("serviceRequests", JSON.stringify(requests))

  return newRequest
}

// Update service request status
export function updateDemoServiceRequestStatus(
  requestId: string,
  status: ServiceRequest["status"],
): ServiceRequest | null {
  const requests = JSON.parse(localStorage.getItem("serviceRequests") || "[]")
  const requestIndex = requests.findIndex((r: ServiceRequest) => r.id === requestId)

  if (requestIndex === -1) return null

  requests[requestIndex].status = status

  localStorage.setItem("serviceRequests", JSON.stringify(requests))

  return requests[requestIndex]
}

// Add a new transaction
export function addDemoTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Transaction {
  const newTransaction: Transaction = {
    ...transaction,
    id: `transaction-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
  transactions.push(newTransaction)
  localStorage.setItem("transactions", JSON.stringify(transactions))

  return newTransaction
}

// Update wallet balance
export function updateDemoWalletBalance(userId: string, amount: number, isPending = false): Wallet | null {
  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
  const walletIndex = wallets.findIndex((w: Wallet) => w.userId === userId)

  if (walletIndex === -1) return null

  if (isPending) {
    wallets[walletIndex].pendingBalance += amount
  } else {
    wallets[walletIndex].balance += amount
  }

  wallets[walletIndex].updatedAt = new Date().toISOString()

  localStorage.setItem("wallets", JSON.stringify(wallets))

  return wallets[walletIndex]
}

// Add a new user
export function addDemoUser(user: Omit<DemoUser, "id" | "createdAt">): DemoUser {
  const newUser: DemoUser = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]")
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  // Create a wallet for the new user
  const newWallet: Wallet = {
    userId: newUser.id,
    balance: 0,
    pendingBalance: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
  wallets.push(newWallet)
  localStorage.setItem("wallets", JSON.stringify(wallets))

  return newUser
}
