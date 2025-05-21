"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Filter, Loader2 } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")

  // Filter states
  const [filterOptions, setFilterOptions] = useState({
    severity: "all",
    domains: {
      "safaricom.co.ke": true,
      "kenyapower.co.ke": true,
      "equity.co.ke": true,
    },
    sources: {
      Pastebin: true,
      GitHub: true,
      Telegram: true,
    },
  })

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Report exported",
      description: `Your ${activeTab} report has been exported successfully.`,
    })

    setIsExporting(false)

    // In a real implementation, this would trigger a file download
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(`Leakwatch ${activeTab} Report`))
    element.setAttribute("download", `leakwatch-${activeTab}-report.csv`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleFilterChange = (section: string, key: string, value: any) => {
    setFilterOptions((prev) => ({
      ...prev,
      [section]:
        section === "severity"
          ? value
          : {
              ...prev[section as "domains" | "sources"],
              [key]: value,
            },
    }))
  }

  const applyFilters = () => {
    toast({
      title: "Filters applied",
      description: "Your report filters have been applied successfully.",
    })
    setFilterDialogOpen(false)
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Security Reports"
        text="View detailed reports and analytics about your security posture."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="summary" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Reports</DialogTitle>
                  <DialogDescription>Customize your report view by applying filters.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Severity</h4>
                    <Select
                      defaultValue={filterOptions.severity}
                      onValueChange={(value) => handleFilterChange("severity", "", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="critical">Critical Only</SelectItem>
                        <SelectItem value="high">High & Above</SelectItem>
                        <SelectItem value="medium">Medium & Above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Domains</h4>
                    <div className="grid gap-2">
                      {Object.entries(filterOptions.domains).map(([domain, checked]) => (
                        <div className="flex items-center space-x-2" key={domain}>
                          <Checkbox
                            id={`domain-${domain}`}
                            checked={checked}
                            onCheckedChange={(checked) => handleFilterChange("domains", domain, Boolean(checked))}
                          />
                          <Label htmlFor={`domain-${domain}`}>{domain}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Sources</h4>
                    <div className="grid gap-2">
                      {Object.entries(filterOptions.sources).map(([source, checked]) => (
                        <div className="flex items-center space-x-2" key={source}>
                          <Checkbox
                            id={`source-${source}`}
                            checked={checked}
                            onCheckedChange={(checked) => handleFilterChange("sources", source, Boolean(checked))}
                          />
                          <Label htmlFor={`source-${source}`}>{source}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Summary</CardTitle>
              <CardDescription>Overview of your security posture over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Security score trend chart will appear here</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+5 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">-2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">+7 from last month</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Security</CardTitle>
              <CardDescription>Security metrics for each monitored domain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Domain security comparison chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Trends</CardTitle>
              <CardDescription>Alert frequency and types over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Alert trend chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Sources</CardTitle>
              <CardDescription>Breakdown of alerts by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Source distribution chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
