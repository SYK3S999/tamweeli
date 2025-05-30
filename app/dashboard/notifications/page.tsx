"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useNotifications, type Notification } from "@/components/notification-provider"
import { Bell, Check, Clock, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState("all")

  if (!user) {
    return null
  }

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((notification) => !notification.isRead)
        : notifications.filter((notification) => notification.type === activeTab)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return t("notifications.today")
    } else if (diffInDays === 1) {
      return t("notifications.yesterday")
    } else if (diffInDays < 7) {
      return t("notifications.daysAgo")
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("notifications.title")}</h2>
          <p className="text-muted-foreground">{t("notifications.description")}</p>
        </div>
        <Button variant="outline" onClick={() => markAllAsRead()}>
          {t("notifications.markAllAsRead")}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t("notifications.all")}</TabsTrigger>
          <TabsTrigger value="unread">{t("notifications.unread")}</TabsTrigger>
          <TabsTrigger value="info">{t("notifications.info")}</TabsTrigger>
          <TabsTrigger value="success">{t("notifications.success")}</TabsTrigger>
          <TabsTrigger value="warning">{t("notifications.warning")}</TabsTrigger>
          <TabsTrigger value="error">{t("notifications.error")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("notifications.recent")}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t("notifications.noNotifications")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      formatDate={formatDate}
                      getIcon={getNotificationIcon}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  formatDate: (date: string) => string
  getIcon: (type: string) => React.ReactNode
}

function NotificationItem({ notification, onMarkAsRead, onDelete, formatDate, getIcon }: NotificationItemProps) {
  const { t } = useLanguage()

  return (
    <div
      className={cn(
        "flex items-start p-4 rounded-lg border transition-colors",
        notification.isRead ? "bg-background" : "bg-muted/30",
      )}
    >
      <div className="flex-shrink-0 mr-4">{getIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={cn("font-medium", !notification.isRead && "font-semibold")}>{notification.title}</h4>
          <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
      </div>
      <div className="flex-shrink-0 ml-4 flex gap-2">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMarkAsRead(notification.id)}
            title={t("notifications.markAsRead")}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">{t("notifications.markAsRead")}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(notification.id)}
          title={t("notifications.delete")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("notifications.delete")}</span>
        </Button>
      </div>
    </div>
  )
}
