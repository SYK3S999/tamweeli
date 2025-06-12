"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Send, User, Search, MessageCircle, Clock, CheckCheck, Check, X, Phone, Video, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const cardHover = {
  hover: { scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
}

// Mock data
const mockUsers = [
  { id: "user-1", name: "Amina Belkacem", investorType: "individual" },
  { id: "user-2", name: "Karim Hadj", investorType: "individual" },
  { id: "user-3", name: "Green Ventures Inc.", investorType: "institution" },
  { id: "user-4", name: "Fatima Zahra", investorType: "individual" },
  { id: "user-5", name: "Oasis Capital", investorType: "institution" },
  { id: "user-6", name: "Sami Noureddine", investorType: "individual" },
]

const mockConversations = [
  { id: "conv-1", participants: ["user-1", "user-2"], lastMessageAt: "2025-05-30T18:07:00Z" },
  { id: "conv-2", participants: ["user-1", "user-3"], lastMessageAt: "2025-05-30T17:12:00Z" },
  { id: "conv-3", participants: ["user-1", "user-4"], lastMessageAt: "2025-05-29T14:30:00Z" },
  { id: "conv-4", participants: ["user-1", "user-5"], lastMessageAt: "2025-05-27T09:15:00Z" },
  { id: "conv-5", participants: ["user-1", "user-6"], lastMessageAt: "2025-05-25T16:45:00Z" },
]

const mockMessages = [
  { id: "msg-1", conversationId: "conv-1", senderId: "user-2", receiverId: "user-1", content: "Hi Amina, interested in the tamweeli project?", createdAt: "2025-05-30T17:50:00Z", isRead: false },
  { id: "msg-2", conversationId: "conv-1", senderId: "user-1", receiverId: "user-2", content: "Hey Karim, yes, it looks promising!", createdAt: "2025-05-30T17:55:00Z", isRead: true },
  { id: "msg-3", conversationId: "conv-1", senderId: "user-2", receiverId: "user-1", content: "Great! Want to discuss investment details?", createdAt: "2025-05-30T18:00:00Z", isRead: false },
  { id: "msg-4", conversationId: "conv-1", senderId: "user-1", receiverId: "user-2", content: "Sure, let's set up a call.", createdAt: "2025-05-30T18:05:00Z", isRead: true },
  { id: "msg-5", conversationId: "conv-1", senderId: "user-2", receiverId: "user-1", content: "Perfect, how about tomorrow at 10 AM?", createdAt: "2025-05-30T18:07:00Z", isRead: false },
  { id: "msg-6", conversationId: "conv-2", senderId: "user-3", receiverId: "user-1", content: "Amina, we're considering a large investment in tamweeli.", createdAt: "2025-05-30T16:50:00Z", isRead: false },
  { id: "msg-7", conversationId: "conv-2", senderId: "user-1", receiverId: "user-3", content: "That's exciting! What's the proposed amount?", createdAt: "2025-05-30T16:55:00Z", isRead: true },
  { id: "msg-8", conversationId: "conv-2", senderId: "user-3", receiverId: "user-1", content: "Around 100,000 DZD. Thoughts?", createdAt: "2025-05-30T17:12:00Z", isRead: false },
  { id: "msg-9", conversationId: "conv-3", senderId: "user-1", receiverId: "user-4", content: "Hi Fatima, any updates on your investment?", createdAt: "2025-05-29T14:20:00Z", isRead: true },
  { id: "msg-10", conversationId: "conv-3", senderId: "user-4", receiverId: "user-1", content: "Just finalized it! 50,000 DZD committed.", createdAt: "2025-05-29T14:30:00Z", isRead: true },
  { id: "msg-11", conversationId: "conv-4", senderId: "user-5", receiverId: "user-1", content: "We reviewed tamweeli. Need more data.", createdAt: "2025-05-27T09:00:00Z", isRead: true },
  { id: "msg-12", conversationId: "conv-4", senderId: "user-1", receiverId: "user-5", content: "I'll send the financial report.", createdAt: "2025-05-27T09:15:00Z", isRead: true },
  { id: "msg-13", conversationId: "conv-5", senderId: "user-6", receiverId: "user-1", content: "Amina, is tamweeli still open for investment?", createdAt: "2025-05-25T16:30:00Z", isRead: true },
  { id: "msg-14", conversationId: "conv-5", senderId: "user-1", receiverId: "user-6", content: "Yes, Sami, we’re at 87% funding!", createdAt: "2025-05-25T16:45:00Z", isRead: true },
  { id: "msg-15", conversationId: "conv-5", senderId: "user-6", receiverId: "user-1", content: "Awesome, I’ll review the docs.", createdAt: "2025-05-25T16:50:00Z", isRead: true },
]

interface Conversation {
  id: string
  participants: string[]
  lastMessageAt: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isRead: boolean
}

export default function MessagesPage() {
  const { t, direction } = useLanguage()
  const isRtl = direction === "rtl"
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newConversationUserId, setNewConversationUserId] = useState("")
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoized conversation messages
  const conversationMessages = useMemo(() => {
    if (!selectedConversation) return []
    return messages.filter((msg) => msg.conversationId === selectedConversation.id)
  }, [messages, selectedConversation])

  // Memoized filtered conversations
  const filteredConversations = useMemo(() => {
    const userConversations = conversations.filter((c) => c.participants.includes(user?.id || ""))
    if (!searchQuery) return userConversations
    return userConversations.filter((conversation) => {
      const otherParticipant = mockUsers.find((u) => u.id === conversation.participants.find((id) => id !== user?.id))
      const lastMessage = messages
        .filter((msg) => msg.conversationId === conversation.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      return (
        otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [conversations, messages, searchQuery, user])

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && conversations.length > 0 && !selectedConversation) {
        setSelectedConversation(conversations[0])
      }
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [user, conversations])

  // Mark messages as read
  useEffect(() => {
    if (selectedConversation && user) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === selectedConversation.id && msg.receiverId === user.id && !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      )
    }
  }, [selectedConversation, user])

  // Scroll to bottom with debounce
  useEffect(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [conversationMessages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [messageText])

  // Simulate typing
  useEffect(() => {
    if (!selectedConversation || conversationMessages.length === 0) return
    const interval = setInterval(() => {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
    }, Math.random() * 5000 + 3000)
    return () => clearInterval(interval)
  }, [selectedConversation, conversationMessages.length])

  if (!user) return null

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !selectedConversation || !user) {
      toast({
        title: t("invalidMessage"),
        description: t("messageCannotBeEmpty"),
        variant: "destructive",
      })
      return
    }

    if (messageText.length > 1000) {
      toast({
        title: t("messageTooLong"),
        description: t("messageMaxLength"),
        variant: "destructive",
      })
      return
    }

    const receiverId = selectedConversation.participants.find((id) => id !== user.id)!
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      receiverId,
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    }

    setMessages((prev) => [...prev, newMessage])
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id ? { ...c, lastMessageAt: newMessage.createdAt } : c
      )
    )
    setMessageText("")
    toast({
      title: t("messageSent"),
      description: t("messageSentSuccess"),
    })
  }, [messageText, selectedConversation, user, toast, t])

  const handleStartNewConversation = useCallback(() => {
    if (!newConversationUserId) {
      toast({
        title: t("invalidSelection"),
        description: t("pleaseSelectUser"),
        variant: "destructive",
      })
      return
    }

    const existingConversation = conversations.find(
      (c) => c.participants.includes(user.id) && c.participants.includes(newConversationUserId)
    )

    if (existingConversation) {
      setSelectedConversation(existingConversation)
      toast({
        title: t("conversationSelected"),
        description: `${t("existingConversation")} ${mockUsers.find((u) => u.id === newConversationUserId)?.name}`,
      })
    } else {
      const newConversation = {
        id: `conv-${Date.now()}`,
        participants: [user.id, newConversationUserId],
        lastMessageAt: new Date().toISOString(),
      }
      setConversations((prev) => [newConversation, ...prev])
      setSelectedConversation(newConversation)
      toast({
        title: t("conversationStarted"),
        description: `${t("newConversationCreated")} ${mockUsers.find((u) => u.id === newConversationUserId)?.name}`,
      })
    }

    setIsNewConversationOpen(false)
    setNewConversationUserId("")
  }, [newConversationUserId, conversations, user, toast, t])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)
    const diffInHours = diffInMinutes / 60

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} ${t("minAgo")}`
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }, [t])

  const formatMessageTime = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }, [])

  const getMessageStatus = useCallback((msg: Message) => {
    if (msg.senderId !== user.id) return null
    return msg.isRead ? <CheckCheck className="h-3 w-3 text-green-100" /> : <Check className="h-3 w-3 text-green-200" />
  }, [user])

  const getDateGroup = useCallback((msg: Message, prevMsg?: Message) => {
    const date = new Date(msg.createdAt)
    const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null
    const isNewDay = !prevMsg || date.toDateString() !== prevDate?.toDateString()
    if (isNewDay) {
      return (
        <motion.div
          key={`date-${msg.createdAt}`}
          className="text-center my-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-300">
            {date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </motion.div>
      )
    }
    return null
  }, [])

  return (
    <div className={`h-[calc(100vh-4rem)] max-w-7xl mx-auto p-6 ${isRtl ? "rtl" : "ltr"}`}>
      {/* Sticky Mobile Sidebar Toggle */}
      <motion.div
        className="lg:hidden fixed top-4 right-4 z-50"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? t("closeSidebar") : t("openSidebar")}
          className="bg-green-100 text-green-800 hover:bg-green-600 hover:text-white"
        >
          <Users className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {t("messages")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t("stayConnected")}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {filteredConversations.length} {t("conversations")}
            </span>
            <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">{t("newConversation")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("startNewConversation")}</DialogTitle>
                  <DialogDescription>{t("selectUser")}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Select
                    value={newConversationUserId}
                    onValueChange={setNewConversationUserId}
                  >
                    <SelectTrigger className="border-green-600/30 focus:ring-green-600">
                      <SelectValue placeholder={t("selectUser")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers
                        .filter((u) => u.id !== user.id)
                        .map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name} ({t(u.investorType)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewConversationOpen(false)}>{t("cancel")}</Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleStartNewConversation}>
                    {t("startConversation")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        {/* Conversations Sidebar */}
        <motion.div
          className={cn(
            "lg:col-span-1 h-full transition-transform duration-300",
            isSidebarOpen ? "block absolute inset-0 z-40 bg-white dark:bg-gray-900" : "hidden lg:block"
          )}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("conversations")}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-green-800">
                  <MessageCircle className="h-4 w-4" />
                  <span>{filteredConversations.length}</span>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder={t("searchConversations")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-green-600"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                    aria-label={t("clearSearch")}
                  >
                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-18rem)]">
                {isLoading ? (
                  <SkeletonLoader />
                ) : filteredConversations.length === 0 ? (
                  <motion.div className="p-6 text-center" variants={fadeInUp}>
                    <MessageCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {searchQuery ? t("noConversations") : t("noConversationsYet")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {searchQuery ? t("tryAdjustingSearch") : t("startNewConversation")}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div className="space-y-1 p-2" variants={staggerContainer}>
                    {filteredConversations.map((conversation, index) => {
                      const isSelected = selectedConversation?.id === conversation.id
                      const otherParticipant = mockUsers.find(
                        (u) => u.id === conversation.participants.find((id) => id !== user.id)
                      )
                      const lastMessage = messages
                        .filter((msg) => msg.conversationId === conversation.id)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                      const unreadCount = messages.filter(
                        (msg) => msg.conversationId === conversation.id && msg.receiverId === user.id && !msg.isRead
                      ).length
                      return (
                        <motion.div
                          key={conversation.id}
                          variants={{ ...fadeInUp, ...cardHover }}
                          whileHover="hover"
                          className="animate-in slide-in-from-top-2 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <button
                            className={cn(
                              "w-full flex items-start p-3 text-left rounded-lg transition-all duration-200",
                              isSelected ? "bg-green-100 dark:bg-green-900/30 ring-1 ring-green-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={() => {
                              setSelectedConversation(conversation)
                              setIsSidebarOpen(false)
                            }}
                          >
                            <div className="relative">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                isSelected ? "bg-green-600 text-white" : "bg-green-100 text-green-800"
                              )}>
                                {(otherParticipant?.name || "").substring(0, 2).toUpperCase()}
                              </div>
                              {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                                  {unreadCount > 9 ? "9+" : unreadCount}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 ml-3 overflow-hidden">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium truncate">{otherParticipant?.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(conversation.lastMessageAt)}</span>
                              </div>
                              {lastMessage && (
                                <div className="flex items-center text-sm truncate">
                                  {lastMessage.senderId === user.id && <span className="text-green-600 mr-1">{t("you")}:</span>}
                                  <span className={unreadCount > 0 && lastMessage.senderId !== user.id ? "font-semibold" : "text-gray-500 dark:text-gray-400"}>
                                    {lastMessage.content}
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages Section */}
        <motion.div className="lg:col-span-2 h-full flex flex-col" variants={staggerContainer} initial="hidden" animate="visible">
          <Card className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-sm">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b bg-gray-50 dark:bg-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                        {(mockUsers.find((u) => u.id === selectedConversation.participants.find((id) => id !== user.id))?.name || "").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium">
                          {mockUsers.find((u) => u.id === selectedConversation.participants.find((id) => id !== user.id))?.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
                            {t("online")}
                          </div>
                          <Separator orientation="vertical" className="h-4 mx-2" />
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedConversation.lastMessageAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span className="sr-only">{t("call")}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                        <Video className="h-4 w-4" />
                        <span className="sr-only">{t("videoCall")}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900">
                    {isLoading ? (
                      <SkeletonLoaderMessages />
                    ) : conversationMessages.length === 0 ? (
                      <motion.div className="flex flex-col items-center justify-center py-16" variants={fadeInUp}>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">{t("noMessages")}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t("startConversation")}</p>
                      </motion.div>
                    ) : (
                      <motion.div className="space-y-2" variants={staggerContainer}>
                        {conversationMessages.map((msg, index) => {
                          const isCurrentUser = msg.senderId === user.id
                          const prevMsg = index > 0 ? conversationMessages[index - 1] : undefined
                          return (
                            <div key={msg.id}>
                              {getDateGroup(msg, prevMsg)}
                              <motion.div
                                className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <div
                                  className={cn(
                                    "max-w-[70%] p-3 rounded-lg",
                                    isCurrentUser
                                      ? "bg-green-600 text-white rounded-br-none"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-bl-none"
                                  )}
                                >
                                  <div className="text-sm">{msg.content}</div>
                                  <div className={cn(
                                    "flex items-center justify-end gap-1 text-xs mt-1",
                                    isCurrentUser ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                                  )}>
                                    <span>{formatMessageTime(msg.createdAt)}</span>
                                    {getMessageStatus(msg)}
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          )
                        })}
                        <AnimatePresence>
                          {isTyping && (
                            <motion.div
                              className="flex justify-start"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg rounded-bl-none max-w-[50%]">
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </motion.div>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={textareaRef}
                        placeholder={t("typeMessage")}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="flex-1 resize-none rounded-lg border border-green-600/30 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 min-h-[48px] max-h-[200px]"
                        rows={1}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || isTyping}
                        className="bg-green-600 hover:bg-green-700 h-12 w-12 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200"
                        aria-label={t("sendMessage")}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{t("pressEnter")}</span>
                      <span>{messageText.length}/1000</span>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <motion.div className="flex flex-col items-center justify-center h-full p-8 text-center" variants={fadeInUp}>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <MessageCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">{t("welcomeToMessages")}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">{t("selectConversation")}</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Sticky Mobile Input */}
      {selectedConversation && (
        <motion.div
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-t-md"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2 items-end">
            <textarea
              placeholder={t("typeMessage")}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 resize-none rounded-lg border border-green-600/30 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 min-h-[40px] max-h-[120px]"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isTyping}
              className="bg-green-600 hover:bg-green-700 h-10 w-10 rounded-full flex items-center justify-center"
              aria-label={t("sendMessage")}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="space-y-2 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center p-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="ml-3 flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonLoaderMessages() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
          <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
