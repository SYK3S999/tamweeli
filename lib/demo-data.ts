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
const demoUsers = [
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
]

// Demo wallets
const demoWallets = [
  {
    userId: "user-investor",
    balance: 500000, // 500,000 DZD
    pendingBalance: 25000, // 25,000 DZD
    createdAt: new Date(2023, 0, 15).toISOString(),
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
    userId: "user-admin",
    balance: 2500000, // 2,500,000 DZD
    pendingBalance: 0,
    createdAt: new Date(2022, 11, 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Demo projects
const demoProjects = [
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
  },
  {
    id: "project-2",
    ownerId: "user-project-owner",
    title: "AlgTech Mobile Payment Platform",
    description:
      "A Shariah-compliant mobile payment platform designed for the Algerian market, focusing on ease of use and security.",
    sector: "Technology",
    fundingGoal: 10000000, // 10,000,000 DZD
    fundingRaised: 7000000, // 7,000,000 DZD
    status: "pending",
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
  },
]

// Initialize demo accounts
export function initializeDemoAccounts() {
  // Check if demo accounts are already initialized
  if (!localStorage.getItem("demoAccountsInitialized")) {
    // Initialize users
    localStorage.setItem("users", JSON.stringify(demoUsers))

    // Initialize wallets
    localStorage.setItem("wallets", JSON.stringify(demoWallets))

    // Initialize projects
    localStorage.setItem("projects", JSON.stringify(demoProjects))

    // Mark as initialized
    localStorage.setItem("demoAccountsInitialized", "true")

    console.log("Demo accounts initialized")
  }
}

// Add this export to fix the error
export const initializeDemoData = initializeDemoAccounts

// Update project status
export function updateDemoProjectStatus(projectId: string, status: Project["status"]) {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]")
  const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

  if (projectIndex !== -1) {
    projects[projectIndex].status = status
    localStorage.setItem("projects", JSON.stringify(projects))
  }
}

// Update investment status
export function updateInvestmentStatus(investmentId: string, status: Investment["status"]) {
  const investments = JSON.parse(localStorage.getItem("investments") || "[]")
  const investmentIndex = investments.findIndex((i: Investment) => i.id === investmentId)

  if (investmentIndex !== -1) {
    investments[investmentIndex].status = status
    localStorage.setItem("investments", JSON.stringify(investments))
  }
}
