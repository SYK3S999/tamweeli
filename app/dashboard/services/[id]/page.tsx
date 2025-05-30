"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { User, Star } from "lucide-react"
import { addDemoServiceRequest } from "@/lib/demo-accounts"

interface Service {
  id: string
  title: string
  description: string
  category: string
  status: "available" | "unavailable"
  price: number
  duration: string
  providerId: string
  rating: number
  reviewCount: number
  createdAt: string
  image?: string
}

interface Provider {
  id: string
  name: string
  createdAt: string
  bio?: string
}

interface ServiceRequest {
  id: string
  userId: string
  serviceId: string
  status: string
  message: string
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  // If RTL is needed, set a fallback or implement your own logic:
  const isRtl = false // TODO: Replace with actual RTL detection if needed
  const { toast } = useToast()

  const [service, setService] = useState<Service | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")

  useEffect(() => {
    if (!params.id) return

    // Load service data
    const services = JSON.parse(localStorage.getItem("services") || "[]")
    const foundService = services.find((s: Service) => s.id === params.id)

    if (!foundService) {
      router.push("/dashboard/services")
      return
    }

    setService(foundService)

    // Load provider data
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundProvider = users.find((u: Provider) => u.id === foundService.providerId)

    if (foundProvider) {
      setProvider(foundProvider)
    }
  }, [params.id, router, user])

  const handleRequestService = () => {
    if (!requestMessage.trim()) {
      toast({
        title: t("Message required"),
        description: t("Please provide a message describing your needs"),
        variant: "destructive",
      })
      return
    }

    if (!user || !service) {
      toast({
        title: t("Error"),
        description: t("User or service information is missing"),
        variant: "destructive",
      })
      return
    }

    // Create new service request
    const newRequest: Omit<ServiceRequest, "id" | "createdAt"> = {
      userId: user.id,
      serviceId: service.id,
      status: "pending", // Explicitly matches the allowed type
      message: requestMessage,
    }


    toast({
      title: t("Request submitted"),
      description: t("Your service request has been submitted"),
    })

    setIsRequestDialogOpen(false)
    setRequestMessage("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(isRtl ? "ar-DZ" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRtl ? "ar-DZ" : "en-US", {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!service) {
    return <div className="flex items-center justify-center min-h-screen">{t("Loading...")}</div>
  }

  const canRequestService = user?.userType === "project-owner" && service.status === "available"

  return (
    <div className={`p-6 ${isRtl ? "rtl" : "ltr"}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{service.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{service.category}</Badge>
            <Badge
              variant="outline"
              className={
                service.status === "available"
                  ? "text-green-500 border-green-500"
                  : "text-red-500 border-red-500"
              }
            >
              {service.status === "available" ? t("Available") : t("Unavailable")}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {canRequestService && (
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">{t("Request Service")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t("Request")} {service.title}
                  </DialogTitle>
                  <DialogDescription>{t("Describe your specific needs for this service.")}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder={t("Describe your project and specific requirements...")}
                      rows={5}
                    />
                  </div>

                  <div className="bg-muted p-3 rounded-md text-sm">
                    <div className="font-medium mb-1">{t("Service Details")}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>{t("Price")}:</div>
                      <div className="font-medium">{formatCurrency(service.price)}</div>

                      <div>{t("Duration")}:</div>
                      <div className="font-medium">{service.duration}</div>

                      <div>{t("Provider")}:</div>
                      <div className="font-medium">{provider?.name || t("Unknown")}</div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                    {t("Cancel")}
                  </Button>
                  <Button onClick={handleRequestService}>{t("Submit Request")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Service Overview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md overflow-hidden mb-6">
                <img
                  src={service.image || "/placeholder.jpg"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("Description")}</h3>
                  <p>{service.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">{t("Price")}</div>
                    <div className="font-medium">{formatCurrency(service.price)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{t("Duration")}</div>
                    <div className="font-medium">{service.duration}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{t("Rating")}</div>
                    <div className="font-medium flex items-center gap-1">
                      {service.rating || 0} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        ({service.reviewCount || 0} {t("reviews")})
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{t("Created")}</div>
                    <div className="font-medium">{formatDate(service.createdAt)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Reviews")}</CardTitle>
              <CardDescription>{t("What clients say about this service")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">{t("No reviews available yet")}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Service Provider")}</CardTitle>
            </CardHeader>
            <CardContent>
              {provider ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      {(provider.name || "").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-lg">{provider.name || t("Unknown")}</div>
                      <div className="text-sm text-muted-foreground">{t("Consultant")}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="text-muted-foreground">{t("Member Since")}:</span>{" "}
                        {formatDate(provider.createdAt)}
                      </div>
                    </div>

                    {provider.bio && (
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">{t("Bio")}:</div>
                        <div>{provider.bio}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">{t("Provider information not available")}</div>
              )}
            </CardContent>
            {canRequestService && (
              <CardFooter>
                <Button className="w-full" onClick={() => setIsRequestDialogOpen(true)}>
                  {t("Request Service")}
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Similar Services")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">{t("No similar services found")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}