"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Github, Globe, MessageSquare, Settings, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { MonitoringSource } from "@/lib/api-service"
import { formatRelativeTime } from "@/lib/api-service"

interface MonitoringSourcesProps {
  sources: MonitoringSource[]
  isLoading: boolean
}

export function MonitoringSources({ sources, isLoading }: MonitoringSourcesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monitoring Sources</CardTitle>
            <CardDescription>Active sources being monitored for leaks</CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if any sources are active
  const hasActiveSources = sources.some((source) => source.status === "active")

  // If no active sources
  if (!hasActiveSources) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monitoring Sources</CardTitle>
            <CardDescription>Active sources being monitored for leaks</CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No active monitoring sources</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scan a repository or website to activate monitoring sources
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Map icon names to components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return <Github className="h-5 w-5 text-muted-foreground" />
      case "MessageSquare":
        return <MessageSquare className="h-5 w-5 text-muted-foreground" />
      default:
        return <Globe className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monitoring Sources</CardTitle>
          <CardDescription>Active sources being monitored for leaks</CardDescription>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getIcon(source.icon)}
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Last check: {source.status === "active" ? formatRelativeTime(source.last_check) : "Not enabled"}
                  </p>
                </div>
              </div>
              {source.status === "active" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Inactive
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
