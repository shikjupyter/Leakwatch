import { NextResponse } from "next/server"
import { getSecurityMetrics } from "@/lib/api-service"

// API route to get security metrics
export async function GET() {
  try {
    const metrics = await getSecurityMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching security metrics:", error)
    return NextResponse.json({ error: "Failed to fetch security metrics" }, { status: 500 })
  }
}
