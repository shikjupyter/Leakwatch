"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DomainOverview } from "@/components/domain-overview"
import { RecentAlerts } from "@/components/recent-alerts"
import { SecurityScore } from "@/components/security-score"
import { MonitoringSources } from "@/components/monitoring-sources"
import { DashboardRefreshButton } from "@/components/dashboard-refresh-button"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { alerts, domains, metrics, sources, isLoading, lastUpdated, refreshData } = useDashboardData(60000) // Refresh every 60 seconds

  // Check if we have any data to display
  const hasData = domains.length > 0 || alerts.length > 0

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Monitor your domains and view real-time credential breach alerts.">
        <DashboardRefreshButton onRefresh={refreshData} lastUpdated={lastUpdated} />
      </DashboardHeader>

      {!hasData && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">No scan data available yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Your dashboard will display real-time information after you scan a repository, local project, or website.
          </p>
          <Button asChild>
            <Link href="/scan">
              Start scanning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SecurityScore className="md:col-span-2 lg:col-span-1" metrics={metrics} isLoading={isLoading} />
            <DomainOverview className="md:col-span-2" domains={domains} isLoading={isLoading} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RecentAlerts alerts={alerts} isLoading={isLoading} />
            <MonitoringSources sources={sources} isLoading={isLoading} />
          </div>
        </>
      )}
    </DashboardShell>
  )
}
