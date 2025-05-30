"use client"

interface NavbarProps {
  className?: string
}

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User, Settings, LogOut, Home, FolderOpen, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar({ className }: NavbarProps) {
  const { t, direction } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Enhanced scroll effect with throttling
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const isActive = useCallback((path: string) => {
    if (path === "/") return pathname === path
    return pathname.startsWith(path)
  }, [pathname])

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(prev => !prev)
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.projects"), href: "/projects", icon: FolderOpen },
    { name: t("nav.about"), href: "/about", icon: Info },
  ]

  const authItems = isAuthenticated
    ? []
    : [
        { name: t("nav.login"), href: "/auth/login" },
        { name: t("nav.register"), href: "/auth/register", primary: true },
      ]

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-500 ease-out",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-primary/5 border-border/50"
            : "bg-background/95 backdrop-blur-sm border-transparent",
          className
        )}
      >
        <div className="container flex h-16 md:h-20 items-center">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" aria-label="Tamweeli Home">
              <img
                src="/tamweeli.png"
                alt="Tamweeli Logo"
                style={{ height: 'auto', width: '300px', objectFit: 'contain' }}
                // or using tailwind utilities like h-20 w-20 but make sure the parent container doesn't scale unexpectedly
              />

            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group",
                      "hover:bg-accent/50 hover:text-primary",
                      isActive(item.href) 
                        ? "text-primary bg-primary/10 shadow-sm" 
                        : "text-muted-foreground hover:bg-accent-foreground"
                    )}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive(item.href) && "text-primary",
                      hoveredItem === item.href && "scale-110"
                    )} />
                    <span>{item.name}</span>
                    
                    {/* Enhanced active indicator */}
                    <span
                      className={cn(
                        "absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-300",
                        isActive(item.href) ? "w-8" : "group-hover:w-6"
                      )}
                    />
                  </Link>
                )
              })}

              {/* Enhanced Auth Section */}
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-border">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-3 hover:bg-accent/50 rounded-full px-3 py-2 transition-all duration-300 group"
                      >
                        <div className="relative">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                            {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                          </div>
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                        </div>
                        <div className="hidden lg:flex flex-col items-start">
                          <span className="text-sm font-medium">{user?.name || t("nav.account")}</span>
                          <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align={direction === "ltr" ? "end" : "start"} 
                      className="w-64 p-2 bg-background/95 backdrop-blur-xl border shadow-xl"
                      sideOffset={8}
                    >
                      <div className="px-3 py-3 border-b border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
                            {user?.name?.charAt(0) || <User className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user?.name || t("nav.account")}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md hover:bg-accent/50 transition-colors">
                            <User className="h-4 w-4" />
                            {t("nav.dashboard")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md hover:bg-accent/50 transition-colors">
                            <Settings className="h-4 w-4" />
                            {t("nav.settings")}
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        onClick={() => logout()}
                        className="text-destructive hover:text-destructive focus:text-destructive flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("nav.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    {authItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={item.primary ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "transition-all duration-300 font-medium",
                            item.primary 
                              ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:scale-105" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/50">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Menu"
                onClick={handleMobileMenuToggle}
                className={cn(
                  "hover:bg-accent/50 rounded-full transition-all duration-300 relative",
                  isMenuOpen && "bg-accent"
                )}
              >
                <div className="relative w-5 h-5">
                  <Menu className={cn(
                    "h-5 w-5 absolute inset-0 transition-all duration-300",
                    isMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  )} />
                  <X className={cn(
                    "h-5 w-5 absolute inset-0 transition-all duration-300",
                    isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                  )} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-40 md:hidden transition-all duration-300 ease-out",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeMobileMenu}
        />
        
        {/* Menu Content */}
        <div className={cn(
          "absolute top-16 md:top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b shadow-2xl transition-all duration-300 ease-out",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        )}>
          <div className="container py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Navigation Items */}
            <div className="space-y-2 mb-6">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center gap-4 text-sm font-medium transition-all duration-300 px-4 py-4 rounded-xl group",
                      "hover:bg-accent/50 hover:translate-x-1",
                      isActive(item.href) 
                        ? "text-primary bg-primary/10 shadow-sm border border-primary/20" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMenuOpen ? "slideInFromLeft 0.3s ease-out forwards" : undefined
                    }}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive(item.href) && "text-primary",
                      "group-hover:scale-110"
                    )} />
                    <span>{item.name}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto h-2 w-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="space-y-2">
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-accent/30 rounded-xl mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
                    {user?.name?.charAt(0) || <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name || t("nav.account")}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 text-sm font-medium px-4 py-4 rounded-xl hover:bg-accent/50 transition-all duration-300 group"
                >
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {t("nav.dashboard")}
                </Link>
                <Link
                  href="/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 text-sm font-medium px-4 py-4 rounded-xl hover:bg-accent/50 transition-all duration-300 group"
                >
                  <Settings className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {t("nav.settings")}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    closeMobileMenu()
                  }}
                  className="flex items-center gap-4 text-sm font-medium text-destructive px-4 py-4 rounded-xl hover:bg-destructive/10 transition-all duration-300 w-full text-start group"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {authItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "block text-sm font-medium px-4 py-4 rounded-xl text-center transition-all duration-300",
                      item.primary
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground border border-border/50"
                    )}
                    style={{
                      animationDelay: `${(navItems.length + index) * 50}ms`,
                      animation: isMenuOpen ? "slideInFromLeft 0.3s ease-out forwards" : undefined
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
