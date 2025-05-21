"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { SecurityMetrics } from "@/lib/api-service"
import { AlertCircle } from "lucide-react"

interface SecurityScoreProps {
  className?: string
  metrics: SecurityMetrics | null
  isLoading: boolean
}

export function SecurityScore({ className, metrics, isLoading }: SecurityScoreProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Security Score</CardTitle>
          <CardDescription>Overall security posture based on monitored domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />

              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />

              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const score = metrics?.score || 0

  // If no scans have been performed yet
  if (score === 0 && metrics?.totalAlerts === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Security Score</CardTitle>
          <CardDescription>Overall security posture based on monitored domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No security data available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scan a repository or website to generate a security score
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Security Score</CardTitle>
        <CardDescription>Overall security posture based on monitored domains</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary/20">
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{score}</span>
              <span className="text-sm text-muted-foreground">out of 100</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Password Security</span>
              <span className="font-medium">
                {metrics.passwordSecurity >= 80 ? "Good" : metrics.passwordSecurity >= 50 ? "Fair" : "At Risk"}
              </span>
            </div>
            <Progress value={metrics.passwordSecurity} className="h-2" />

            <div className="flex justify-between text-sm">
              <span>API Key Protection</span>
              <span className="font-medium">
                {metrics.apiKeyProtection >= 80 ? "Good" : metrics.apiKeyProtection >= 50 ? "Fair" : "At Risk"}
              </span>
            </div>
            <Progress value={metrics.apiKeyProtection} className="h-2" />

            <div className="flex justify-between text-sm">
              <span>Email Security</span>
              <span className="font-medium">
                {metrics.emailSecurity >= 80 ? "Excellent" : metrics.emailSecurity >= 50 ? "Good" : "At Risk"}
              </span>
            </div>
            <Progress value={metrics.emailSecurity} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
