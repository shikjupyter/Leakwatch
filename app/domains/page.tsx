"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShieldAlert, ShieldCheck, Trash, Loader2, AlertCircle } from "lucide-react"
import { AddDomainDialog } from "@/components/add-domain-dialog"
import { DashboardRefreshButton } from "@/components/dashboard-refresh-button"
import { formatRelativeTime } from "@/lib/api-service"
import type { Domain } from "@/lib/api-service"

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchDomains = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/domains")

      if (!response.ok) {
        throw new Error(`Failed to fetch domains: ${response.status}`)
      }

      const data = await response.json()
      setDomains(data)
      setFilteredDomains(data)
      setLastUpdated(new Date().toISOString())
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching domains:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [])

  // Filter domains based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDomains(domains)
      return
    }

    const filtered = domains.filter((domain) => domain.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredDomains(filtered)
  }, [searchQuery, domains])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The filtering is already handled by the useEffect
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Monitored Domains" text="Manage domains being monitored for credential leaks.">
        <div className="flex items-center gap-2">
          <AddDomainDialog />
          <DashboardRefreshButton onRefresh={fetchDomains} lastUpdated={lastUpdated} />
        </div>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>Domains registered for credential breach monitoring</CardDescription>
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Search domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8 text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>Error loading domains: {error}</p>
            </div>
          ) : filteredDomains.length === 0 ? (
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <p>No domains found{searchQuery ? ` matching "${searchQuery}"` : ""}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDomains.map((domain) => (
                <div key={domain.name} className="flex flex-col space-y-2 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {domain.status === "protected" ? (
                        <ShieldCheck className="h-8 w-8 text-green-500" />
                      ) : (
                        <ShieldAlert className="h-8 w-8 text-red-500" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{domain.name}</h3>
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
                        </div>
                        <p className="text-sm text-muted-foreground">Added on {domain.dateAdded}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="pl-12 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-sm font-medium">Last Scan</p>
                      <p className="text-sm text-muted-foreground">{formatRelativeTime(domain.lastScan)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Monitored Emails</p>
                      <p className="text-sm text-muted-foreground">{domain.monitoredEmails} addresses</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">API Keys</p>
                      <p className="text-sm text-muted-foreground">{domain.monitoredApis} keys monitored</p>
                    </div>
                  </div>
                  <div className="pl-12 pt-2">
                    <Button variant="link" className="h-auto p-0 text-sm">
                      View detailed report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
