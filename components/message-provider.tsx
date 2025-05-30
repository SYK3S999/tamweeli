"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessageAt: string
  projectId?: string
  investmentId?: string
}

interface MessageContextType {
  messages: Message[]
  conversations: Conversation[]
  unreadCount: number
  isLoading: boolean
  sendMessage: (message: Omit<Message, "id" | "isRead" | "createdAt">) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  getConversationMessages: (conversationId: string) => Message[]
  getUserConversations: (userId: string) => Conversation[]
  getOrCreateConversation: (
    userId1: string,
    userId2: string,
    metadata?: { projectId?: string; investmentId?: string },
  ) => Promise<string>
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load messages and conversations from localStorage
    const loadData = () => {
      try {
        const storedMessages = localStorage.getItem("messages")
        const storedConversations = localStorage.getItem("conversations")

        if (storedMessages) {
          setMessages(JSON.parse(storedMessages))
        } else {
          // Initialize with sample messages if none exist
          const sampleMessages: Message[] = [
            {
              id: "message-1",
              conversationId: "conversation-1",
              senderId: "user-1",
              receiverId: "user-6",
              content: "Thank you for your interest in my project. When would you like to discuss the details?",
              isRead: true,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "message-2",
              conversationId: "conversation-1",
              senderId: "user-6",
              receiverId: "user-1",
              content: "I'm available tomorrow at 2 PM. Would that work for you?",
              isRead: false,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "message-3",
              conversationId: "conversation-2",
              senderId: "user-2",
              receiverId: "user-7",
              content: "I've reviewed your investment proposal and I'm interested in discussing further.",
              isRead: true,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          setMessages(sampleMessages)
          localStorage.setItem("messages", JSON.stringify(sampleMessages))
        }

        if (storedConversations) {
          setConversations(JSON.parse(storedConversations))
        } else {
          // Initialize with sample conversations if none exist
          const sampleConversations: Conversation[] = [
            {
              id: "conversation-1",
              participants: ["user-1", "user-6"],
              lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              projectId: "project-1",
              investmentId: "investment-1",
            },
            {
              id: "conversation-2",
              participants: ["user-2", "user-7"],
              lastMessageAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              projectId: "project-2",
              investmentId: "investment-2",
            },
          ]
          setConversations(sampleConversations)
          localStorage.setItem("conversations", JSON.stringify(sampleConversations))
        }
      } catch (error) {
        console.error("Failed to load messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Count unread messages for the current user
  const unreadCount = userId ? messages.filter((message) => message.receiverId === userId && !message.isRead).length : 0

  const sendMessage = async (messageData: Omit<Message, "id" | "isRead" | "createdAt">) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newMessage: Message = {
        ...messageData,
        id: `message-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      // Add new message
      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
      localStorage.setItem("messages", JSON.stringify(updatedMessages))

      // Update conversation's lastMessageAt
      const updatedConversations = conversations.map((conversation) =>
        conversation.id === messageData.conversationId
          ? {
              ...conversation,
              lastMessageAt: new Date().toISOString(),
            }
          : conversation,
      )
      setConversations(updatedConversations)
      localStorage.setItem("conversations", JSON.stringify(updatedConversations))

      return newMessage
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedMessages = messages.map((message) =>
        message.id === id
          ? {
              ...message,
              isRead: true,
            }
          : message,
      )

      setMessages(updatedMessages)
      localStorage.setItem("messages", JSON.stringify(updatedMessages))
    } catch (error) {
      console.error("Failed to mark message as read:", error)
    }
  }

  const getConversationMessages = (conversationId: string) => {
    return messages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  const getUserConversations = (userId: string) => {
    return conversations
      .filter((conversation) => conversation.participants.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  }

  const getOrCreateConversation = async (
    userId1: string,
    userId2: string,
    metadata?: { projectId?: string; investmentId?: string },
  ) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      (conversation) =>
        conversation.participants.includes(userId1) &&
        conversation.participants.includes(userId2) &&
        conversation.participants.length === 2,
    )

    if (existingConversation) {
      return existingConversation.id
    }

    // Create new conversation
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newConversation: Conversation = {
        id: `conversation-${Date.now()}`,
        participants: [userId1, userId2],
        lastMessageAt: new Date().toISOString(),
        projectId: metadata?.projectId,
        investmentId: metadata?.investmentId,
      }

      const updatedConversations = [...conversations, newConversation]
      setConversations(updatedConversations)
      localStorage.setItem("conversations", JSON.stringify(updatedConversations))

      return newConversation.id
    } catch (error) {
      console.error("Failed to create conversation:", error)
      throw error
    }
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        conversations,
        unreadCount,
        isLoading,
        sendMessage,
        markAsRead,
        getConversationMessages,
        getUserConversations,
        getOrCreateConversation,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}
