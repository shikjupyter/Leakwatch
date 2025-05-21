import { NextResponse } from "next/server"
import { getMonitoringSources } from "@/lib/api-service"

// API route to get monitoring sources
export async function GET() {
  try {
    const sources = await getMonitoringSources()
    return NextResponse.json(sources)
  } catch (error) {
    console.error("Error fetching monitoring sources:", error)
    return NextResponse.json({ error: "Failed to fetch monitoring sources" }, { status: 500 })
  }
}
