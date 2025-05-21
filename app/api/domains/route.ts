import { NextResponse } from "next/server"
import { getMonitoredDomains } from "@/lib/api-service"

// API route to get domains
export async function GET() {
  try {
    const domains = await getMonitoredDomains()
    return NextResponse.json(domains)
  } catch (error) {
    console.error("Error fetching domains:", error)
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 })
  }
}
