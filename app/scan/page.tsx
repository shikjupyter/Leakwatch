import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { GitHubScanner } from "@/components/github-scanner"
import { LocalScanner } from "@/components/local-scanner"
import { WebsiteScanner } from "@/components/website-scanner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ScanPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Security Scanner"
        text="Scan URLs and projects for potential credential leaks and security issues."
      />

      <Tabs defaultValue="github" className="space-y-4">
        <TabsList>
          <TabsTrigger value="github">GitHub URL</TabsTrigger>
          <TabsTrigger value="local">Local Project</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
        </TabsList>

        <TabsContent value="github">
          <GitHubScanner />
        </TabsContent>

        <TabsContent value="local">
          <LocalScanner />
        </TabsContent>

        <TabsContent value="website">
          <WebsiteScanner />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
