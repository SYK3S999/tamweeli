"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building,
  FileText,
  Inbox,
  LogOut,
  MessageSquare,
  PlusCircle,
  Settings,
  ShoppingBag,
  Users,
  Wallet,
  LayoutDashboard,
  CreditCard,
  LineChart,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { useAuth, type UserType } from "@/components/auth-provider"

interface SidebarLinkProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}

function SidebarLink({ href, icon: Icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-muted font-medium text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}

export function DashboardSidebar({ userType }: { userType: UserType }) {
  const { t } = useLanguage()
  const { logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  // Project Owner Links
  const projectOwnerLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard.overview") },
    { href: "/dashboard/projects", icon: Building, label: t("dashboard.myProjects") },
    { href: "/dashboard/add-project", icon: PlusCircle, label: t("dashboard.addProject") },
    { href: "/dashboard/requests", icon: Inbox, label: t("dashboard.requests") },
    { href: "/dashboard/services", icon: ShoppingBag, label: t("dashboard.services") },
    { href: "/dashboard/messages", icon: MessageSquare, label: t("dashboard.messages") },
    { href: "/dashboard/wallet", icon: Wallet, label: t("dashboard.wallet") },
    { href: "/dashboard/settings", icon: Settings, label: t("dashboard.settings") },
  ]

  // Investor Links
  const investorLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard.overview") },
    { href: "/dashboard/projects", icon: Building, label: t("nav.projects") },
    { href: "/dashboard/investments", icon: CreditCard, label: t("dashboard.myInvestments") },
    { href: "/dashboard/earnings", icon: LineChart, label: t("dashboard.earnings") },
    { href: "/dashboard/services", icon: ShoppingBag, label: t("dashboard.services") },
    { href: "/dashboard/messages", icon: MessageSquare, label: t("dashboard.messages") },
    { href: "/dashboard/wallet", icon: Wallet, label: t("dashboard.wallet") },
    { href: "/dashboard/settings", icon: Settings, label: t("dashboard.settings") },
  ]

  // Consultant/Admin Links
  const adminLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard.overview") },
    { href: "/dashboard/projects", icon: Building, label: t("dashboard.allProjects") },
    { href: "/dashboard/clients", icon: Users, label: t("dashboard.clients") },
    { href: "/dashboard/requests", icon: Inbox, label: t("dashboard.requests") },
    { href: "/dashboard/reports", icon: FileText, label: t("dashboard.reports") },
    { href: "/dashboard/analytics", icon: BarChart3, label: t("dashboard.analytics") },
    { href: "/dashboard/services", icon: ShoppingBag, label: t("dashboard.services") },
    { href: "/dashboard/wallet", icon: Wallet, label: t("dashboard.wallet") },
    { href: "/dashboard/admin", icon: Shield, label: t("dashboard.adminPanel") },
    { href: "/dashboard/settings", icon: Settings, label: t("dashboard.settings") },
  ]

  let links = projectOwnerLinks
  if (userType === "investor") links = investorLinks
  if (userType === "consultant" || userType === "admin") links = adminLinks

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={isActive(link.href)}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            <span>{t("dashboard.logout")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
