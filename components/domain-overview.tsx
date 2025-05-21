"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, ChevronRight, AlertCircle } from "lucide-react"
import { AddDomainDialog } from "@/components/add-domain-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { Domain } from "@/lib/api-service"
import { formatRelativeTime } from "@/lib/api-service"

interface DomainOverviewProps {
  className?: string
  domains: Domain[]
  isLoading: boolean
}

export function DomainOverview({ className, domains, isLoading }: DomainOverviewProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monitored Domains</CardTitle>
            <CardDescription>Domains being monitored for credential leaks</CardDescription>
          </div>
          <AddDomainDialog size="sm" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no domains are being monitored yet
  if (domains.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monitored Domains</CardTitle>
            <CardDescription>Domains being monitored for credential leaks</CardDescription>
          </div>
          <AddDomainDialog size="sm" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No domains monitored yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scan a repository or website to start monitoring domains
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monitored Domains</CardTitle>
          <CardDescription>Domains being monitored for credential leaks</CardDescription>
        </div>
        <AddDomainDialog size="sm" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {domains.map((domain) => (
            <div key={domain.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                {domain.status === "protected" ? (
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                ) : (
                  <ShieldAlert className="h-8 w-8 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{domain.name}</p>
                  <p className="text-sm text-muted-foreground">Last scan: {formatRelativeTime(domain.last_scan)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {domain.alerts > 0 ? (
                  <Badge variant="destructive">{domain.alerts} Alerts</Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  >
                    Protected
                  </Badge>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/domains?domain=${domain.name}`}>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
