"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  relatedId?: string
  relatedType?: string
  createdAt: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  addNotification: (notification: Omit<Notification, "id" | "isRead" | "createdAt">) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      try {
        const storedNotifications = localStorage.getItem("notifications")
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications))
        } else {
          // Initialize with sample notifications if none exist
          const sampleNotifications: Notification[] = [
            {
              id: "notification-1",
              userId: "user-1",
              title: "Project Approved",
              message: "Your project 'Eco-Friendly Agriculture Tech' has been approved.",
              type: "success",
              isRead: false,
              relatedId: "project-1",
              relatedType: "project",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "notification-2",
              userId: "user-2",
              title: "New Investment Proposal",
              message: "You have received a new investment proposal for your project.",
              type: "info",
              isRead: true,
              relatedId: "investment-1",
              relatedType: "investment",
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "notification-3",
              userId: "user-3",
              title: "Project Under Review",
              message: "Your project 'Halal Food Delivery Service' is now under review.",
              type: "info",
              isRead: false,
              relatedId: "project-3",
              relatedType: "project",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          setNotifications(sampleNotifications)
          localStorage.setItem("notifications", JSON.stringify(sampleNotifications))
        }
      } catch (error) {
        console.error("Failed to load notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [toast])

  // Filter notifications by user ID
  const userNotifications = userId ? notifications.filter((notification) => notification.userId === userId) : []

  // Count unread notifications
  const unreadCount = userNotifications.filter((notification) => !notification.isRead).length

  const addNotification = async (notificationData: Omit<Notification, "id" | "isRead" | "createdAt">) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newNotification: Notification = {
        ...notificationData,
        id: `notification-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      const updatedNotifications = [...notifications, newNotification]
      setNotifications(updatedNotifications)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

      // Show toast for new notification
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant: newNotification.type === "error" ? "destructive" : "default",
      })
    } catch (error) {
      console.error("Failed to add notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedNotifications = notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      )

      setNotifications(updatedNotifications)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedNotifications = notifications.map((notification) =>
        notification.userId === userId
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      )

      setNotifications(updatedNotifications)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

      toast({
        title: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedNotifications = notifications.filter((notification) => notification.id !== id)
      setNotifications(updatedNotifications)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        isLoading,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
