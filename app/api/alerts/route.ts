import { NextResponse } from "next/server"
import { getScanResults } from "@/lib/api-service"

// API route to get alerts
export async function GET() {
  try {
    const alerts = await getScanResults()
    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
