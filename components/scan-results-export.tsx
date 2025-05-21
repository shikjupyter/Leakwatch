"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ScanResult {
  file: string
  line: number
  match: string
  type: string
  severity: string
}

interface ScanResultsExportProps {
  results: ScanResult[]
  projectName: string
}

export function ScanResultsExport({ results, projectName }: ScanResultsExportProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (results.length === 0) {
      toast({
        title: "No results to export",
        description: "There are no scan results to export.",
      })
      return
    }

    setIsExporting(true)

    try {
      // Create CSV content
      const headers = ["File", "Line", "Match", "Type", "Severity"]
      const csvRows = [
        headers.join(","),
        ...results.map((result) =>
          [`"${result.file}"`, result.line, `"${result.match.replace(/"/g, '""')}"`, result.type, result.severity].join(
            ",",
          ),
        ),
      ]
      const csvContent = csvRows.join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      // Set up download
      const sanitizedProjectName = projectName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      link.setAttribute("href", url)
      link.setAttribute("download", `leakwatch_scan_${sanitizedProjectName}_${timestamp}.csv`)
      link.style.display = "none"

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: "Scan results have been exported to CSV.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the results.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting || results.length === 0}>
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </>
      )}
    </Button>
  )
}
