"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"

interface DashboardRefreshButtonProps {
  onRefresh: () => Promise<void>
  lastUpdated: string | null
}

export function DashboardRefreshButton({ onRefresh, lastUpdated }: DashboardRefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Format the last updated time
  const formattedTime = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "Never"

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Last updated: {formattedTime}</span>
      <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-8 gap-1">
        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  )
}
