"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Eye, FileText, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock client data
const clients = [
  {
    id: "client-1",
    name: "Ahmed Al-Farsi",
    company: "Eco-Friendly Agriculture Tech",
    status: "active",
    startDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
    lastActivity: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    totalRevenue: 120000,
    projectCount: 2,
  },
  {
    id: "client-2",
    name: "Sara Al-Mansouri",
    company: "Halal Food Delivery Service",
    status: "active",
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    lastActivity: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    totalRevenue: 80000,
    projectCount: 1,
  },
  {
    id: "client-3",
    name: "Mohammed Al-Qasimi",
    company: "Islamic Finance Platform",
    status: "active",
    startDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
    lastActivity: new Date().toISOString(),
    totalRevenue: 150000,
    projectCount: 3,
  },
  {
    id: "client-4",
    name: "Fatima Al-Zahra",
    company: "Sustainable Energy Solutions",
    status: "inactive",
    startDate: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
    lastActivity: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    totalRevenue: 75000,
    projectCount: 1,
  },
  {
    id: "client-5",
    name: "Youssef Al-Bakri",
    company: "Ethical Investment Fund",
    status: "active",
    startDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    lastActivity: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    totalRevenue: 50000,
    projectCount: 1,
  },
]

export default function ClientsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (!user || user.userType !== "consultant") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t("common.accessDenied")}</h1>
        <p className="text-muted-foreground mb-4">{t("common.consultantOnly")}</p>
        <Button asChild>
          <Link href="/dashboard">{t("common.backToDashboard")}</Link>
        </Button>
      </div>
    )
  }

  // Filter clients based on search term and active tab
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || client.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("consultant.clients")}</h2>
        <p className="text-muted-foreground">{t("consultant.clientsDesc")}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />
        <Button className="bg-green-600 hover:bg-green-700">
          <User className="mr-2 h-4 w-4" />
          {t("consultant.addClient")}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
          <TabsTrigger value="active">{t("common.active")}</TabsTrigger>
          <TabsTrigger value="inactive">{t("common.inactive")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">{t("consultant.noClientsFound")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <Card key={client.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{client.name}</CardTitle>
                        <CardDescription>{client.company}</CardDescription>
                      </div>
                      <Badge className={cn(getStatusColor(client.status))}>
                        {client.status === "active" ? t("common.active") : t("common.inactive")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.clientSince")}</h3>
                        <p className="text-sm">{new Date(client.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.lastActivity")}</h3>
                        <p className="text-sm">{new Date(client.lastActivity).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.totalRevenue")}</h3>
                        <p className="text-sm">
                          {client.totalRevenue.toLocaleString()} {t("common.currency")}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.projects")}</h3>
                        <p className="text-sm">{client.projectCount}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/clients/${client.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.viewDetails")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/messages?client=${client.id}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {t("common.message")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/reports/new?client=${client.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          {t("consultant.createReport")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
