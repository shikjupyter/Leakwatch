"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Check, FolderSearch } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { addGitHubScanResults } from "@/lib/scan-storage" // Reusing the same storage function

interface ScanResult {
  file: string
  line: number
  match: string
  type: "api_key" | "password" | "token" | "secret" | "credential"
  severity: "critical" | "high" | "medium" | "low"
}

export function LocalScanner() {
  const { toast } = useToast()
  const [projectPath, setProjectPath] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [hasScanned, setHasScanned] = useState(false)

  const handleScan = async () => {
    if (!projectPath) {
      toast({
        title: "Project path required",
        description: "Please enter a local project path to scan.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    setScanResults([])

    try {
      // In a real implementation, this would scan local files
      // For demo purposes, we'll simulate a scan with a timeout
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate finding some issues
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
      ]

      // Store the results in our storage system
      // Using the project path as the "repository" URL
      addGitHubScanResults(`local://${projectPath}`, simulatedResults)

      setScanResults(simulatedResults)
      setHasScanned(true)

      toast({
        title: "Scan completed",
        description: `Found ${simulatedResults.length} potential credential leaks in your project. Dashboard updated.`,
      })
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning the local project.",
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
        <CardTitle>Local Project Scanner</CardTitle>
        <CardDescription>Scan your local project files for potential credential leaks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-path">Project Path</Label>
          <Input
            id="project-path"
            placeholder="/path/to/your/project"
            value={projectPath}
            onChange={(e) => setProjectPath(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Enter the full path to your local project directory</p>
        </div>

        <Button onClick={handleScan} disabled={isScanning} className="w-full">
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning Project...
            </>
          ) : (
            <>
              <FolderSearch className="mr-2 h-4 w-4" />
              Scan Local Project
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
                <span className="text-green-700 dark:text-green-400">No credential leaks found in this project</span>
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
