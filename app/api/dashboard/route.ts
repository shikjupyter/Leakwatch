import { NextResponse } from "next/server"
import { getScanResults, getMonitoredDomains, getSecurityMetrics, getMonitoringSources } from "@/lib/api-service"

// API route to get all dashboard data
export async function GET() {
  try {
    // Fetch all data in parallel
    const [alerts, domains, metrics, sources] = await Promise.all([
      getScanResults(),
      getMonitoredDomains(),
      getSecurityMetrics(),
      getMonitoringSources(),
    ])

    return NextResponse.json({
      alerts,
      domains,
      metrics,
      sources,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
