"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Check, Globe } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { addGitHubScanResults } from "@/lib/scan-storage"
import { sendAlertNotification } from "@/app/actions/email-actions"

interface ScanResult {
  file: string
  line: number
  match: string
  type: "api_key" | "password" | "token" | "secret" | "credential"
  severity: "critical" | "high" | "medium" | "low"
}

export function GitHubScanner() {
  const { toast } = useToast()
  const [url, setUrl] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [hasScanned, setHasScanned] = useState(false)

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a URL to scan.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    setScanResults([])

    try {
      // Extract owner and repo from URL
      // Format: https://github.com/owner/repo
      const urlParts = url.split("/")
      const owner = urlParts[urlParts.length - 2]
      const repo = urlParts[urlParts.length - 1]

      // In a real implementation, this would make API calls to GitHub
      // For demo purposes, we'll simulate a scan with a timeout
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate finding some issues
      // In a real implementation, this would process actual GitHub API responses
      const simulatedResults: ScanResult[] = [
        {
          file: "config/database.js",
          line: 15,
          match: "password: 'db_password123'",
          type: "password",
          severity: "high",
        },
        {
          file: ".env",
          line: 3,
          match: "API_KEY=sk_test_51HZ6qEKLJSZ",
          type: "api_key",
          severity: "critical",
        },
        {
          file: "src/services/auth.js",
          line: 42,
          match: "const secretKey = 'my_jwt_secret_key'",
          type: "secret",
          severity: "high",
        },
        {
          file: "scripts/deploy.sh",
          line: 8,
          match: "export AWS_SECRET_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE",
          type: "credential",
          severity: "critical",
        },
      ]

      // Store the results in our Supabase database
      await addGitHubScanResults(url, simulatedResults)

      // Send email notification for critical findings
      const criticalFindings = simulatedResults.filter((result) => result.severity === "critical")
      if (criticalFindings.length > 0) {
        // In a real app, you would get this from user settings
        const userEmail = "shikongoken@gmail.com"

        try {
          // Send notification for the first critical finding
          await sendAlertNotification(userEmail, {
            domain: `${owner}/${repo}`,
            type: criticalFindings[0].type,
            severity: criticalFindings[0].severity,
            details: `Found ${criticalFindings[0].match} in ${criticalFindings[0].file} at line ${criticalFindings[0].line}`,
            source: "GitHub",
          })

          toast({
            title: "Security alert sent",
            description: "A notification email has been sent for critical findings.",
          })
        } catch (error) {
          console.error("Error sending alert notification:", error)
        }
      }

      setScanResults(simulatedResults)
      setHasScanned(true)

      toast({
        title: "Scan completed",
        description: `Found ${simulatedResults.length} potential credential leaks in ${owner}/${repo}. Dashboard updated.`,
      })
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning the URL.",
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
        <CardTitle>URL Scanner</CardTitle>
        <CardDescription>Scan URLs for potential credential leaks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL to Scan</Label>
          <Input
            id="url"
            placeholder="https://github.com/username/repository"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the full URL to scan (e.g., https://github.com/username/repository)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="access-token">Access Token (Optional)</Label>
          <Input
            id="access-token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            For private repositories, provide an access token with appropriate permissions
          </p>
        </div>

        <Button onClick={handleScan} disabled={isScanning} className="w-full">
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning URL...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Scan URL
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
                      <div className="font-medium">{result.file}</div>
                      <Badge variant="outline" className={getSeverityColor(result.severity)}>
                        {result.severity}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">Line {result.line}</div>
                    <div className="mt-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm">{result.match}</code>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Type:</span> {result.type}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-green-700 dark:text-green-400">No credential leaks found at this URL</span>
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
