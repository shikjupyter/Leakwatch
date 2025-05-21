"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink, Key, Mail, MoreHorizontal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { ScanResult } from "@/lib/api-service"
import { formatRelativeTime } from "@/lib/api-service"

interface RecentAlertsProps {
  alerts: ScanResult[]
  isLoading: boolean
}

export function RecentAlerts({ alerts, isLoading }: RecentAlertsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest credential breach alerts across your domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-3 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All Alerts
          </Button>
        </CardContent>
      </Card>
    )
  }

  // If no alerts yet
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest credential breach alerts across your domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No alerts detected yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scan a repository or website to detect potential credential leaks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort alerts by timestamp (newest first) and take the first 3
  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Latest credential breach alerts across your domains</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-start space-x-4">
                <div className="mt-0.5">
                  {alert.type === "password" && <Key className="h-5 w-5 text-amber-500" />}
                  {alert.type === "api_key" && <AlertCircle className="h-5 w-5 text-red-500" />}
                  {alert.type === "email" && <Mail className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{alert.domain}</p>
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
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.type === "password" && "Password leaked"}
                    {alert.type === "api_key" && "API key exposed"}
                    {alert.type === "email" && "Email credentials found"}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span>Source: {alert.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatRelativeTime(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" asChild>
          <a href="/alerts">
            View All Alerts
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
