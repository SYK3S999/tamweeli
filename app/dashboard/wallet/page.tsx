"use client"

import { useState } from "react"
import { useWallet, type TransactionType } from "@/components/wallet-provider"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  SearchIcon, 
  FilterIcon, 
  Loader2, 
  Wallet,
  TrendingUp,
  Eye,
  Plus,
  Minus,
  Calendar,
  X
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const depositSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().min(3, "Description must be at least 3 characters"),
})

const withdrawalSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().min(3, "Description must be at least 3 characters"),
})

export default function WalletPage() {
  const { t, direction } = useLanguage()
  const { wallet, transactions, isLoading, deposit, withdraw, getFilteredTransactions } = useWallet()

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter state
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")

  const depositForm = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  })

  const withdrawalForm = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  })

  const handleDeposit = async (values: z.infer<typeof depositSchema>) => {
    try {
      await deposit(Number(values.amount), values.description)
      depositForm.reset()
      setIsDepositDialogOpen(false)
    } catch (error) {
      console.error("Deposit failed:", error)
    }
  }

  const handleWithdraw = async (values: z.infer<typeof withdrawalSchema>) => {
    try {
      await withdraw(Number(values.amount), values.description)
      withdrawalForm.reset()
      setIsWithdrawDialogOpen(false)
    } catch (error) {
      console.error("Withdrawal failed:", error)
    }
  }

  const handleTypeChange = (value: string) => {
    if (value === "all") {
      setTransactionTypes([])
    } else {
      setTransactionTypes([value as TransactionType])
    }
  }

  const resetFilters = () => {
    setTransactionTypes([])
    setStartDate(undefined)
    setEndDate(undefined)
    setSearchTerm("")
  }

  const filteredTransactions = getFilteredTransactions(transactionTypes, startDate, endDate, searchTerm)

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "deposit":
        return t("wallet.deposit")
      case "withdrawal":
        return t("wallet.withdrawal")
      case "investment":
        return t("wallet.investment")
      case "return":
        return t("wallet.return")
      case "funding":
        return t("wallet.funding")
      case "payment":
        return t("wallet.payment")
      case "service-fee":
        return t("wallet.serviceFee")
      default:
        return type
    }
  }

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">{t("wallet.completed")}</Badge>
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
            {t("wallet.pending")}
          </Badge>
        )
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">{t("wallet.failed")}</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">{t("wallet.inProgress")}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "deposit":
      case "return":
      case "funding":
        return <ArrowDownIcon className="h-4 w-4 text-green-600" />
      case "withdrawal":
      case "investment":
      case "payment":
      case "service-fee":
        return <ArrowUpIcon className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getTransactionAmount = (transaction: any) => {
    const isPositive = ["deposit", "return", "funding"].includes(transaction.type)
    const amountClass = isPositive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
    const prefix = isPositive ? "+" : "-"

    return (
      <span className={amountClass}>
        {prefix} {formatCurrency(transaction.amount, t)}
      </span>
    )
  }

  const hasActiveFilters = transactionTypes.length > 0 || startDate || endDate || searchTerm

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{t("wallet.title")}</h1>
        </div>
        <p className="text-muted-foreground">Manage your funds and track your transactions</p>
      </div>

      {/* Balance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Balance Card */}
        <Card className="lg:col-span-5 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-muted-foreground">{t("wallet.balance")}</CardTitle>
                <div className="text-4xl font-bold mt-2">{formatCurrency(wallet?.balance || 0, t)}</div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="pt-4 border-t border-primary/10">
            <div className="flex gap-3 w-full">
              <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 h-11 font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("wallet.deposit")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="text-left pb-4">
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {t("wallet.depositFunds")}
                    </DialogTitle>
                    <DialogDescription>{t("wallet.depositDescription")}</DialogDescription>
                  </DialogHeader>
                  <Form {...depositForm}>
                    <form onSubmit={depositForm.handleSubmit(handleDeposit)} className="space-y-6">
                      <FormField
                        control={depositForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">{t("wallet.amount")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="number"
                                  min="1"
                                  step="1"
                                  placeholder="0"
                                  className="h-12 text-lg pr-16"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                  DZD
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={depositForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">{t("wallet.description")}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder={t("wallet.depositDescriptionPlaceholder")} 
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDepositDialogOpen(false)}
                          className="h-11"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="h-11">
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("common.loading")}
                            </>
                          ) : (
                            t("wallet.confirmDeposit")
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 h-11 font-medium">
                    <Minus className="mr-2 h-4 w-4" />
                    {t("wallet.withdraw")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="text-left pb-4">
                    <DialogTitle className="flex items-center gap-2">
                      <Minus className="h-5 w-5" />
                      {t("wallet.withdrawFunds")}
                    </DialogTitle>
                    <DialogDescription>{t("wallet.withdrawDescription")}</DialogDescription>
                  </DialogHeader>
                  <Form {...withdrawalForm}>
                    <form onSubmit={withdrawalForm.handleSubmit(handleWithdraw)} className="space-y-6">
                      <FormField
                        control={withdrawalForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">{t("wallet.amount")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="number"
                                  min="1"
                                  max={wallet?.balance || 0}
                                  step="1"
                                  placeholder="0"
                                  className="h-12 text-lg pr-16"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                  DZD
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={withdrawalForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">{t("wallet.description")}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder={t("wallet.withdrawDescriptionPlaceholder")} 
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsWithdrawDialogOpen(false)}
                          className="h-11"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="h-11">
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("common.loading")}
                            </>
                          ) : (
                            t("wallet.confirmWithdraw")
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>

        {/* Recent Transactions Preview */}
        <Card className="lg:col-span-7 shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t("wallet.recentTransactions")}
                </CardTitle>
                <CardDescription className="mt-1">{t("wallet.recentTransactionsDescription")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("transactions-tab")?.click()}
                className="text-primary hover:text-primary"
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-3 bg-muted/50 rounded-full w-fit mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">{t("wallet.noTransactions")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-muted/50">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">{getTransactionAmount(transaction)}</div>
                      {getTransactionStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-6 p-1 h-12 bg-muted/50">
          <TabsTrigger value="transactions" id="transactions-tab" className="h-10 px-6 font-medium">
            {t("wallet.transactions")}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-10 px-6 font-medium">
            {t("wallet.analytics")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">{t("wallet.transactionHistory")}</CardTitle>
                  <CardDescription className="mt-1">{t("wallet.transactionHistoryDescription")}</CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("wallet.search")}
                      className="pl-10 w-full sm:w-80 h-11"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-11 px-4 relative">
                        <FilterIcon className="mr-2 h-4 w-4" />
                        {t("wallet.filter")}
                        {hasActiveFilters && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FilterIcon className="h-5 w-5" />
                          {t("wallet.filterTransactions")}
                        </DialogTitle>
                        <DialogDescription>{t("wallet.filterDescription")}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        <div className="space-y-3">
                          <Label className="text-base font-medium">{t("wallet.transactionType")}</Label>
                          <Select
                            value={transactionTypes.length > 0 ? transactionTypes[0] : "all"}
                            onValueChange={handleTypeChange}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder={t("wallet.allTypes")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{t("wallet.allTypes")}</SelectItem>
                              <SelectItem value="deposit">{t("wallet.deposit")}</SelectItem>
                              <SelectItem value="withdrawal">{t("wallet.withdrawal")}</SelectItem>
                              <SelectItem value="investment">{t("wallet.investment")}</SelectItem>
                              <SelectItem value="return">{t("wallet.return")}</SelectItem>
                              <SelectItem value="funding">{t("wallet.funding")}</SelectItem>
                              <SelectItem value="payment">{t("wallet.payment")}</SelectItem>
                              <SelectItem value="service-fee">{t("wallet.serviceFee")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-medium">{t("wallet.dateRange")}</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm text-muted-foreground">{t("wallet.startDate")}</Label>
                              <DatePicker date={startDate} setDate={setStartDate} className="w-full mt-1" />
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">{t("wallet.endDate")}</Label>
                              <DatePicker date={endDate} setDate={setEndDate} className="w-full mt-1" />
                            </div>
                          </div>
                        </div>

                        {hasActiveFilters && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Active filters</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="h-auto p-1"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={resetFilters} className="h-11">
                          {t("wallet.resetFilters")}
                        </Button>
                        <Button type="button" onClick={() => setIsFilterOpen(false)} className="h-11">
                          {t("wallet.applyFilters")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                    <SearchIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">No transactions found</h3>
                  <p className="text-muted-foreground text-sm">{t("wallet.noTransactionsFound")}</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-muted/30">
                        <TableHead className="font-semibold">{t("wallet.date")}</TableHead>
                        <TableHead className="font-semibold">{t("wallet.description")}</TableHead>
                        <TableHead className="font-semibold">{t("wallet.type")}</TableHead>
                        <TableHead className="font-semibold">{t("wallet.status")}</TableHead>
                        <TableHead className="text-right font-semibold">{t("wallet.amount")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              <span>{getTransactionTypeLabel(transaction.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getTransactionStatusBadge(transaction.status)}</TableCell>
                          <TableCell className="text-right">{getTransactionAmount(transaction)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("wallet.analytics")}
              </CardTitle>
              <CardDescription>{t("wallet.analyticsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground text-sm">{t("wallet.analyticsComingSoon")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}