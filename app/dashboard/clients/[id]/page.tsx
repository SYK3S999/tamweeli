"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Calendar, Download, Edit, FileText, MessageSquare } from "lucide-react"
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
    email: "ahmed@eco-agritech.dz",
    phone: "+213 555 123 456",
    address: "123 Green Street, Algiers, Algeria",
    projects: [
      {
        id: "project-1",
        name: "Sustainable Farming Initiative",
        status: "active",
        startDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(),
      },
      {
        id: "project-2",
        name: "Organic Certification Program",
        status: "planning",
        startDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      },
    ],
    reports: [
      {
        id: "report-1",
        title: "Financial Feasibility Analysis",
        status: "completed",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
      },
      {
        id: "report-2",
        title: "Market Expansion Strategy",
        status: "in-progress",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
        completedAt: null,
      },
    ],
    invoices: [
      {
        id: "invoice-1",
        amount: 50000,
        status: "paid",
        date: new Date(new Date().setDate(new Date().getDate() - 35)).toISOString(),
      },
      {
        id: "invoice-2",
        amount: 70000,
        status: "paid",
        date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      },
    ],
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
    email: "sara@halalfood.dz",
    phone: "+213 555 789 012",
    address: "456 Food Avenue, Oran, Algeria",
    projects: [
      {
        id: "project-3",
        name: "Halal Certification Process",
        status: "active",
        startDate: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
      },
    ],
    reports: [
      {
        id: "report-3",
        title: "Islamic Finance Compliance Review",
        status: "completed",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      },
    ],
    invoices: [
      {
        id: "invoice-3",
        amount: 80000,
        status: "paid",
        date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      },
    ],
  },
]

export default function ClientDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

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

  const client = clients.find((c) => c.id === id)

  if (!client) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t("consultant.clientNotFound")}</h1>
        <Button asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.backToClients")}
          </Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "planning":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/clients"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.backToClients")}
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">{client.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn(getStatusColor(client.status))}>
              {client.status === "active" ? t("common.active") : t("common.inactive")}
            </Badge>
            <span className="text-sm text-muted-foreground">{client.company}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/messages?client=${client.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              {t("common.message")}
            </Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href={`/dashboard/reports/new?client=${client.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              {t("consultant.createReport")}
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t("common.overview")}</TabsTrigger>
          <TabsTrigger value="projects">{t("consultant.projects")}</TabsTrigger>
          <TabsTrigger value="reports">{t("consultant.reports")}</TabsTrigger>
          <TabsTrigger value="invoices">{t("consultant.invoices")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("consultant.clientInformation")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("common.email")}</h3>
                    <p className="text-base">{client.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("common.phone")}</h3>
                    <p className="text-base">{client.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("common.address")}</h3>
                    <p className="text-base">{client.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.clientSince")}</h3>
                    <p className="text-base">{new Date(client.startDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.editInformation")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("consultant.clientSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.totalRevenue")}</h3>
                    <p className="text-xl font-bold">
                      {client.totalRevenue.toLocaleString()} {t("common.currency")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.projects")}</h3>
                    <p className="text-xl font-bold">{client.projectCount}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.reports")}</h3>
                    <p className="text-xl font-bold">{client.reports.length}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("consultant.lastActivity")}</h3>
                    <p className="text-base">{new Date(client.lastActivity).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("consultant.activityTimeline")}</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t("consultant.clientJoined")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(client.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t("consultant.firstReportCompleted")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(client.reports[0].completedAt || client.reports[0].createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t("consultant.lastInvoicePaid")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(client.invoices[client.invoices.length - 1].date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.clientProjects")}</CardTitle>
              <CardDescription>{t("consultant.clientProjectsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {client.projects.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">{t("consultant.noProjects")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {client.projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("consultant.startedOn")} {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(getStatusColor(project.status))}>
                          {project.status === "active"
                            ? t("common.active")
                            : project.status === "planning"
                              ? t("common.planning")
                              : t("common.completed")}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {t("common.view")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Button className="bg-green-600 hover:bg-green-700">{t("consultant.addNewProject")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.clientReports")}</CardTitle>
              <CardDescription>{t("consultant.clientReportsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {client.reports.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">{t("consultant.noReports")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {client.reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("consultant.createdOn")} {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(getStatusColor(report.status))}>
                          {report.status === "completed" ? t("common.completed") : t("common.inProgress")}
                        </Badge>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/reports/${report.id}`}>{t("common.view")}</Link>
                        </Button>
                        {report.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">{t("common.download")}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href={`/dashboard/reports/new?client=${client.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    {t("consultant.createNewReport")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultant.clientInvoices")}</CardTitle>
              <CardDescription>{t("consultant.clientInvoicesDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {client.invoices.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">{t("consultant.noInvoices")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {client.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          {t("consultant.invoice")} #{invoice.id.split("-")[1]}
                        </h3>
                        <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">
                          {invoice.amount.toLocaleString()} {t("common.currency")}
                        </p>
                        <Badge className={cn(getStatusColor(invoice.status))}>
                          {invoice.status === "paid" ? t("common.paid") : t("common.pending")}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          {t("common.download")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Button className="bg-green-600 hover:bg-green-700">{t("consultant.createNewInvoice")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
