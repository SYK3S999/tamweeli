"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export type TransactionType = "deposit" | "withdrawal" | "investment" | "return" | "funding" | "payment" | "service-fee"
export type TransactionStatus = "pending" | "completed" | "failed" | "in-progress"

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  description: string
  projectId?: string
  investmentId?: string
  serviceId?: string
  requestId?: string
  createdAt: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

interface WalletContextType {
  wallet: Wallet | null
  transactions: Transaction[]
  isLoading: boolean
  deposit: (amount: number, description: string) => Promise<void>
  withdraw: (amount: number, description: string) => Promise<void>
  getFilteredTransactions: (
    types?: TransactionType[],
    startDate?: Date,
    endDate?: Date,
    search?: string,
  ) => Transaction[]
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadWallet()
      loadTransactions()
    } else {
      setWallet(null)
      setTransactions([])
    }
  }, [user])

  const loadWallet = () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Get wallet from localStorage
      const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
      const userWallet = wallets.find((w: Wallet) => w.userId === user.id)

      if (userWallet) {
        setWallet(userWallet)
      } else {
        // Create a new wallet if one doesn't exist
        const newWallet: Wallet = {
          id: `wallet-${Date.now()}`,
          userId: user.id,
          balance: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        wallets.push(newWallet)
        localStorage.setItem("wallets", JSON.stringify(wallets))
        setWallet(newWallet)
      }
    } catch (error) {
      console.error("Failed to load wallet:", error)
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadTransactions = () => {
    if (!user) return

    try {
      // Get transactions from localStorage
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      const userTransactions = allTransactions.filter((t: Transaction) => t.userId === user.id)

      // Sort by date (newest first)
      userTransactions.sort((a: Transaction, b: Transaction) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      setTransactions(userTransactions)
    } catch (error) {
      console.error("Failed to load transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transaction data",
        variant: "destructive",
      })
    }
  }

  const updateWalletBalance = (amount: number) => {
    if (!wallet || !user) return

    try {
      const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
      const walletIndex = wallets.findIndex((w: Wallet) => w.id === wallet.id)

      if (walletIndex !== -1) {
        const updatedWallet = {
          ...wallets[walletIndex],
          balance: wallets[walletIndex].balance + amount,
          updatedAt: new Date().toISOString(),
        }

        wallets[walletIndex] = updatedWallet
        localStorage.setItem("wallets", JSON.stringify(wallets))
        setWallet(updatedWallet)
      }
    } catch (error) {
      console.error("Failed to update wallet balance:", error)
      throw new Error("Failed to update wallet balance")
    }
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => {
    if (!user) return

    try {
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")

      const newTransaction: Transaction = {
        id: `transaction-${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
        ...transaction,
      }

      allTransactions.push(newTransaction)
      localStorage.setItem("transactions", JSON.stringify(allTransactions))

      // Update local state
      setTransactions([newTransaction, ...transactions])

      return newTransaction
    } catch (error) {
      console.error("Failed to add transaction:", error)
      throw new Error("Failed to add transaction")
    }
  }

  const deposit = async (amount: number, description: string) => {
    if (!user || !wallet) {
      toast({
        title: "Error",
        description: "User or wallet not found",
        variant: "destructive",
      })
      return
    }

    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than zero",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add transaction
      addTransaction({
        type: "deposit",
        amount,
        status: "completed",
        description,
      })

      // Update wallet balance
      updateWalletBalance(amount)

      toast({
        title: "Deposit successful",
        description: `${amount.toLocaleString()} DZD has been added to your wallet`,
      })
    } catch (error) {
      console.error("Deposit failed:", error)
      toast({
        title: "Deposit failed",
        description: "An error occurred while processing your deposit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const withdraw = async (amount: number, description: string) => {
    if (!user || !wallet) {
      toast({
        title: "Error",
        description: "User or wallet not found",
        variant: "destructive",
      })
      return
    }

    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than zero",
        variant: "destructive",
      })
      return
    }

    if (wallet.balance < amount) {
      toast({
        title: "Error",
        description: "Insufficient funds in your wallet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add transaction
      addTransaction({
        type: "withdrawal",
        amount,
        status: "completed",
        description,
      })

      // Update wallet balance
      updateWalletBalance(-amount)

      toast({
        title: "Withdrawal successful",
        description: `${amount.toLocaleString()} DZD has been withdrawn from your wallet`,
      })
    } catch (error) {
      console.error("Withdrawal failed:", error)
      toast({
        title: "Withdrawal failed",
        description: "An error occurred while processing your withdrawal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredTransactions = (types?: TransactionType[], startDate?: Date, endDate?: Date, search?: string) => {
    return transactions.filter((transaction) => {
      // Filter by type
      if (types && types.length > 0 && !types.includes(transaction.type)) {
        return false
      }

      // Filter by date range
      if (startDate && new Date(transaction.createdAt) < startDate) {
        return false
      }
      if (endDate) {
        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)
        if (new Date(transaction.createdAt) > endOfDay) {
          return false
        }
      }

      // Filter by search term
      if (search && search.trim() !== "") {
        const searchLower = search.toLowerCase()
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.type.toLowerCase().includes(searchLower) ||
          transaction.status.toLowerCase().includes(searchLower) ||
          transaction.id.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        isLoading,
        deposit,
        withdraw,
        getFilteredTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
