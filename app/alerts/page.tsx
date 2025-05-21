"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Download, Filter, Key, Mail, MoreHorizontal, Loader2 } from "lucide-react"
import { DashboardRefreshButton } from "@/components/dashboard-refresh-button"
import { formatRelativeTime } from "@/lib/api-service"
import type { ScanResult } from "@/lib/api-service"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ScanResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const fetchAlerts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/alerts")

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.status}`)
      }

      const data = await response.json()
      setAlerts(data)
      setLastUpdated(new Date().toISOString())
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching alerts:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  // Filter alerts based on active tab
  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true
    return alert.severity === activeTab
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Security Alerts"
        text="Monitor and respond to credential breach alerts across your domains."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DashboardRefreshButton onRefresh={fetchAlerts} lastUpdated={lastUpdated} />
        </div>
      </DashboardHeader>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="low">Low</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Security Alerts"
                  : activeTab === "critical"
                    ? "Critical Alerts"
                    : activeTab === "high"
                      ? "High Priority Alerts"
                      : activeTab === "medium"
                        ? "Medium Priority Alerts"
                        : "Low Priority Alerts"}
              </CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "View and manage all credential breach alerts"
                  : activeTab === "critical"
                    ? "High priority alerts requiring immediate attention"
                    : activeTab === "high"
                      ? "Important alerts requiring prompt attention"
                      : activeTab === "medium"
                        ? "Alerts requiring attention soon"
                        : "Alerts requiring eventual attention"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex justify-center items-center py-8 text-destructive">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <p>Error loading alerts: {error}</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="flex justify-center items-center py-8 text-muted-foreground">
                  <p>No {activeTab !== "all" ? activeTab : ""} alerts found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="mt-0.5">
                            {alert.type === "password" && <Key className="h-5 w-5 text-amber-500" />}
                            {alert.type === "api_key" && <AlertCircle className="h-5 w-5 text-red-500" />}
                            {alert.type === "email" && <Mail className="h-5 w-5 text-blue-500" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{alert.domain}</h3>
                              <Badge
                                variant={
                                  alert.severity === "critical"
                                    ? "destructive"
                                    : alert.severity === "high"
                                      ? "destructive"
                                      : alert.severity === "medium"
                                        ? "default"
                                        : "outline"
                                }
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-sm">
                              {alert.type === "password" && "Password leaked"}
                              {alert.type === "api_key" && "API key exposed"}
                              {alert.type === "email" && "Email credentials found"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="pl-9">
                        <p className="text-sm text-muted-foreground">{alert.details}</p>
                        <p className="text-sm text-muted-foreground">Affected: {alert.affected}</p>
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatRelativeTime(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="pl-9 pt-2 flex gap-2">
                        <Button size="sm">Investigate</Button>
                        <Button variant="outline" size="sm">
                          Mark as Resolved
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
