import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type ScanResult = {
  id?: string
  file: string
  line: number
  match: string
  type: "api_key" | "password" | "token" | "secret" | "credential" | "email"
  severity: "critical" | "high" | "medium" | "low"
  timestamp: string
  repository?: string
  domain: string
  source: string
  details?: string
  affected?: string
  resolved: boolean
  created_at?: string
}

export type Domain = {
  id?: string
  name: string
  status: "protected" | "at-risk"
  last_scan: string
  alerts: number
  date_added: string
  monitored_emails: number
  monitored_apis: number
}

export type SecurityMetric = {
  id?: string
  score: number
  password_security: number
  api_key_protection: number
  email_security: number
  total_alerts: number
  critical_issues: number
  resolved_issues: number
  last_updated: string
  created_at?: string
}

export type MonitoringSource = {
  id?: string
  name: string
  status: "active" | "inactive"
  icon: string
  last_check?: string
  created_at?: string
}

// Check if we're in demo mode or if we have Supabase credentials
const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock Supabase client for demo mode
const mockSupabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        limit: (limit: number) => ({
          single: async () => ({
            data: null,
            error: null,
          }),
        }),
        eq: (column: string, value: any) => ({
          single: async () => ({
            data: null,
            error: null,
          }),
        }),
      }),
      eq: (column: string, value: any) => ({
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          data: [],
          error: null,
        }),
        single: async () => ({
          data: null,
          error: null,
        }),
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({
          data: data,
          error: null,
        }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
      }),
    }),
  }),
}

// Create a real Supabase client if credentials are available
const realSupabase = isDemo
  ? mockSupabase
  : createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const supabase = realSupabase
