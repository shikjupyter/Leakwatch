"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AlertTriangle, BarChart3, Bell, Globe, Home, Lock, Settings, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile } = useSidebar()

  if (!isOpen && !isMobile) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r pt-16 md:pt-0 md:static md:block",
        isOpen ? "block" : "hidden",
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button
              variant={pathname === "/alerts" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/alerts">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Alerts
              </Link>
            </Button>
            <Button
              variant={pathname === "/domains" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/domains">
                <Globe className="mr-2 h-4 w-4" />
                Domains
              </Link>
            </Button>
            <Button
              variant={pathname === "/reports" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
            <Button
              variant={pathname === "/scan" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/scan">
                <Search className="mr-2 h-4 w-4" />
                Scan URL
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/settings/profile" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/profile">
                <Settings className="mr-2 h-4 w-4" />
                General
              </Link>
            </Button>
            <Button
              variant={pathname === "/settings/notifications" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </Button>
            <Button
              variant={pathname === "/settings/security" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/security">
                <Lock className="mr-2 h-4 w-4" />
                Security
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
