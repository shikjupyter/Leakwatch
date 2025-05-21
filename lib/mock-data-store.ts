// Mock data store to replace Supabase in the demo environment
import type { ScanResult, Domain, SecurityMetric, MonitoringSource } from "./supabase"

// In-memory storage for mock data
let scanResults: ScanResult[] = [
  {
    id: "1",
    file: "config/database.js",
    line: 15,
    match: "password: 'db_password123'",
    type: "password",
    severity: "high",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    repository: "https://github.com/safaricom/payment-api",
    domain: "safaricom/payment-api",
    source: "GitHub",
    details: "Found in config/database.js at line 15",
    affected: "User account",
    resolved: false,
  },
  {
    id: "2",
    file: ".env",
    line: 3,
    match: "API_KEY=sk_test_51HZ6qEKLJSZ",
    type: "api_key",
    severity: "critical",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    repository: "https://github.com/safaricom/payment-api",
    domain: "safaricom/payment-api",
    source: "GitHub",
    details: "Found in .env at line 3",
    affected: "API endpoint",
    resolved: false,
  },
  {
    id: "3",
    file: "src/services/auth.js",
    line: 42,
    match: "const secretKey = 'my_jwt_secret_key'",
    type: "secret",
    severity: "high",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    repository: "https://github.com/kenyapower/customer-portal",
    domain: "kenyapower/customer-portal",
    source: "GitHub",
    details: "Found in src/services/auth.js at line 42",
    affected: "System security",
    resolved: false,
  },
]

const domains: Domain[] = [
  {
    id: "1",
    name: "safaricom/payment-api",
    status: "at-risk",
    last_scan: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    alerts: 2,
    date_added: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    monitored_emails: 12,
    monitored_apis: 5,
  },
  {
    id: "2",
    name: "kenyapower/customer-portal",
    status: "at-risk",
    last_scan: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    alerts: 1,
    date_added: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
    monitored_emails: 8,
    monitored_apis: 3,
  },
  {
    id: "3",
    name: "equity/mobile-banking",
    status: "protected",
    last_scan: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    alerts: 0,
    date_added: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    monitored_emails: 15,
    monitored_apis: 7,
  },
]

let securityMetrics: SecurityMetric = {
  id: "1",
  score: 75,
  password_security: 65,
  api_key_protection: 60,
  email_security: 85,
  total_alerts: 3,
  critical_issues: 1,
  resolved_issues: 0,
  last_updated: new Date().toISOString(),
}

const monitoringSources: MonitoringSource[] = [
  {
    id: "1",
    name: "GitHub",
    status: "active",
    icon: "Github",
    last_check: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "2",
    name: "Local Projects",
    status: "inactive",
    icon: "Folder",
    last_check: null,
  },
  {
    id: "3",
    name: "Websites",
    status: "active",
    icon: "Globe",
    last_check: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: "4",
    name: "Dark Web",
    status: "inactive",
    icon: "Shield",
    last_check: null,
  },
]

// Mock functions to replace Supabase operations
export async function getAllScanResultsMock(): Promise<ScanResult[]> {
  return [...scanResults].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getAllDomainsMock(): Promise<Domain[]> {
  return [...domains].sort((a, b) => new Date(b.last_scan).getTime() - new Date(a.last_scan).getTime())
}

export async function getLatestSecurityMetricsMock(): Promise<SecurityMetric> {
  return { ...securityMetrics }
}

export async function getAllMonitoringSourcesMock(): Promise<MonitoringSource[]> {
  return [...monitoringSources]
}

export async function addGitHubScanResultsMock(
  repoUrl: string,
  results: Array<{
    file: string
    line: number
    match: string
    type: string
    severity: string
  }>,
): Promise<void> {
  // Extract domain from GitHub URL
  const urlParts = repoUrl.split("/")
  const owner = urlParts[urlParts.length - 2] || ""
  const repo = urlParts[urlParts.length - 1] || ""
  const domain = `${owner}/${repo}`

  // Current timestamp
  const timestamp = new Date().toISOString()

  // Convert scanner results to our storage format
  const newResults = results.map((result, index) => ({
    id: `new-${Date.now()}-${index}`,
    file: result.file,
    line: result.line,
    match: result.match,
    type: result.type as ScanResult["type"],
    severity: result.severity as ScanResult["severity"],
    timestamp,
    repository: repoUrl,
    domain,
    source: "GitHub",
    details: `Found in ${result.file} at line ${result.line}`,
    affected:
      result.type === "api_key" ? "API endpoint" : result.type === "password" ? "User account" : "System security",
    resolved: false,
  }))

  // Add to our mock database
  scanResults = [...scanResults, ...newResults]

  // Update domain information
  const criticalCount = newResults.filter((r) => r.severity === "critical").length
  const highCount = newResults.filter((r) => r.severity === "high").length

  // Determine domain status based on scan results
  const status = criticalCount > 0 || highCount > 0 ? "at-risk" : "protected"

  // Check if domain exists
  const existingDomainIndex = domains.findIndex((d) => d.name === domain)

  if (existingDomainIndex !== -1) {
    // Update existing domain
    domains[existingDomainIndex] = {
      ...domains[existingDomainIndex],
      status,
      last_scan: timestamp,
      alerts: domains[existingDomainIndex].alerts + newResults.length,
    }
  } else {
    // Create new domain
    domains.push({
      id: `new-${Date.now()}`,
      name: domain,
      status,
      last_scan: timestamp,
      alerts: newResults.length,
      date_added: timestamp,
      monitored_emails: Math.floor(Math.random() * 20) + 5, // Simulated data
      monitored_apis: Math.floor(Math.random() * 10) + 1, // Simulated data
    })
  }

  // Update monitoring sources
  const githubSourceIndex = monitoringSources.findIndex((s) => s.name === "GitHub")
  if (githubSourceIndex !== -1) {
    monitoringSources[githubSourceIndex] = {
      ...monitoringSources[githubSourceIndex],
      status: "active",
      last_check: timestamp,
    }
  }

  // Update security metrics
  calculateSecurityMetricsMock()
}

// Calculate security metrics based on scan results
export async function calculateSecurityMetricsMock(): Promise<SecurityMetric> {
  const totalAlerts = scanResults.length
  const unresolvedAlerts = scanResults.filter((r) => !r.resolved).length
  const criticalIssues = scanResults.filter((r) => r.severity === "critical" && !r.resolved).length
  const highIssues = scanResults.filter((r) => r.severity === "high" && !r.resolved).length
  const resolvedIssues = scanResults.filter((r) => r.resolved).length

  // Calculate security score (0-100)
  let score = 100
  if (totalAlerts > 0) {
    score -= criticalIssues * 15 // -15 points per critical issue
    score -= highIssues * 10 // -10 points per high issue
    score += resolvedIssues * 5 // +5 points per resolved issue
    score = Math.max(0, Math.min(100, score))
  }

  // Calculate component scores
  const passwordSecurity = calculateComponentScoreMock(scanResults.filter((r) => r.type === "password"))
  const apiKeyProtection = calculateComponentScoreMock(scanResults.filter((r) => r.type === "api_key"))
  const emailSecurity = calculateComponentScoreMock(
    scanResults.filter((r) => r.type === "credential" && r.match.includes("email")),
  )

  securityMetrics = {
    id: "1",
    score: Math.round(score),
    password_security: passwordSecurity,
    api_key_protection: apiKeyProtection,
    email_security: emailSecurity,
    total_alerts: totalAlerts,
    critical_issues: criticalIssues,
    resolved_issues: resolvedIssues,
    last_updated: new Date().toISOString(),
  }

  return securityMetrics
}

// Helper to calculate component scores
function calculateComponentScoreMock(results: ScanResult[]): number {
  if (results.length === 0) return 95 // Default high score if no issues

  const unresolvedCount = results.filter((r) => !r.resolved).length
  const criticalCount = results.filter((r) => r.severity === "critical" && !r.resolved).length
  const highCount = results.filter((r) => r.severity === "high" && !r.resolved).length

  // Start with 100 and subtract based on issues
  let score = 100
  score -= criticalCount * 20 // -20 points per critical issue
  score -= highCount * 15 // -15 points per high issue
  score -= unresolvedCount * 5 // -5 points per other unresolved issue

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}
