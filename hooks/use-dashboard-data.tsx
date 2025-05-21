"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { ScanResult, Domain, SecurityMetrics, MonitoringSource } from "@/lib/api-service"

interface DashboardData {
  alerts: ScanResult[]
  domains: Domain[]
  metrics: SecurityMetrics
  sources: MonitoringSource[]
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  refreshData: () => Promise<void>
}

export function useDashboardData(refreshInterval = 60000): DashboardData {
  const [alerts, setAlerts] = useState<ScanResult[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [sources, setSources] = useState<MonitoringSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard")

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const data = await response.json()

      setAlerts(data.alerts)
      setDomains(data.domains)
      setMetrics(data.metrics)
      setSources(data.sources)
      setLastUpdated(data.timestamp)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setIsLoading(false)

      toast({
        title: "Error fetching data",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return

    const intervalId = setInterval(() => {
      fetchDashboardData()
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [refreshInterval])

  return {
    alerts,
    domains,
    metrics: metrics || {
      score: 0,
      passwordSecurity: 0,
      apiKeyProtection: 0,
      emailSecurity: 0,
      totalAlerts: 0,
      criticalIssues: 0,
      resolvedIssues: 0,
      lastUpdated: "",
    },
    sources,
    isLoading,
    error,
    lastUpdated,
    refreshData: fetchDashboardData,
  }
}
