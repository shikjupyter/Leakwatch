"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle, Check, Globe } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { addGitHubScanResults } from "@/lib/scan-storage" // Reusing the same storage function

interface ScanResult {
  url: string
  type: "api_key" | "password" | "token" | "secret" | "credential"
  match: string
  context: string
  severity: "critical" | "high" | "medium" | "low"
}

export function WebsiteScanner() {
  const { toast } = useToast()
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [crawlWebsite, setCrawlWebsite] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [hasScanned, setHasScanned] = useState(false)

  const handleScan = async () => {
    if (!websiteUrl) {
      toast({
        title: "Website URL required",
        description: "Please enter a website URL to scan.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    setScanResults([])

    try {
      // In a real implementation, this would call your API to scan the website
      // For demo purposes, we'll simulate a scan with a timeout
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate finding some issues
      const simulatedResults: ScanResult[] = [
        {
          url: `${websiteUrl}/config.js`,
          type: "api_key",
          match: "apiKey: 'sk_test_51HZ6qEKLJSZ'",
          context: "const config = { apiKey: 'sk_test_51HZ6qEKLJSZ', environment: 'production' }",
          severity: "critical",
        },
        {
          url: `${websiteUrl}/js/main.js`,
          type: "password",
          match: "password: 'admin123'",
          context: "// Temporary dev credentials\nconst devLogin = { username: 'admin', password: 'admin123' }",
          severity: "high",
        },
        {
          url: `${websiteUrl}/js/auth.js`,
          type: "token",
          match: "JWT_SECRET='my_jwt_secret_key'",
          context: "// TODO: Move to environment variables\nconst JWT_SECRET='my_jwt_secret_key'",
          severity: "high",
        },
      ]

      // Convert to the format our storage system expects
      const storageResults = simulatedResults.map((result, index) => ({
        file: result.url,
        line: index + 1, // Simulate line numbers
        match: result.match,
        type: result.type,
        severity: result.severity,
      }))

      // Store the results in our storage system
      addGitHubScanResults(websiteUrl, storageResults)

      setScanResults(simulatedResults)
      setHasScanned(true)

      toast({
        title: "Scan completed",
        description: `Found ${simulatedResults.length} potential credential leaks on ${websiteUrl}. Dashboard updated.`,
      })
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning the website.",
        variant: "destructive",
      })
      console.error("Scan error:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "high":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Website Scanner</CardTitle>
        <CardDescription>Scan websites for exposed credentials and sensitive information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="website-url">Website URL</Label>
          <Input
            id="website-url"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Enter the full URL of the website you want to scan</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="crawl-website"
            checked={crawlWebsite}
            onCheckedChange={(checked) => setCrawlWebsite(!!checked)}
          />
          <Label htmlFor="crawl-website">Crawl website (scan multiple pages)</Label>
        </div>

        <Button onClick={handleScan} disabled={isScanning} className="w-full">
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning Website...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Scan Website
            </>
          )}
        </Button>

        {hasScanned && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Scan Results</h3>
              <Badge
                variant="outline"
                className={scanResults.length > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
              >
                {scanResults.length} {scanResults.length === 1 ? "issue" : "issues"} found
              </Badge>
            </div>

            {scanResults.length > 0 ? (
              <div className="space-y-3">
                {scanResults.map((result, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{result.url}</div>
                      <Badge variant="outline" className={getSeverityColor(result.severity)}>
                        {result.severity}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Type:</span> {result.type}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Match:</span> {result.match}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Context:</p>
                      <code className="mt-1 block rounded bg-muted px-2 py-1 text-sm">{result.context}</code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-green-700 dark:text-green-400">No credential leaks found on this website</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-xs text-muted-foreground">
          <AlertCircle className="mr-1 inline-block h-3 w-3" />
          This scanner is for educational purposes only. Always verify results manually.
        </div>
      </CardFooter>
    </Card>
  )
}
