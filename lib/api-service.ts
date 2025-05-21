import {
  getAllScanResults as getSupabaseScanResults,
  getAllDomains as getSupabaseDomains,
  getLatestSecurityMetrics as getSupabaseSecurityMetrics,
  getAllMonitoringSources as getSupabaseMonitoringSources,
  addGitHubScanResults as addSupabaseGitHubScanResults
} from './supabase-service';

import type {
  ScanResult as ScanResultType,
  Domain as DomainType,
  SecurityMetric as SecurityMetricType,
  MonitoringSource as MonitoringSourceType
} from './supabase';

export type ScanResult = ScanResultType;
export type Domain = DomainType;
export type SecurityMetrics = SecurityMetricType;
export type MonitoringSource = MonitoringSourceType;

// Function to read scan results from storage
export async function getScanResults(): Promise<ScanResult[]> {
  try {
    return await getSupabaseScanResults();
  } catch (error) {
    console.error('Error fetching scan results:', error);
    return [];
  }
}

// Function to get monitored domains with real-time status
export async function getMonitoredDomains(): Promise<Domain[]> {
  try {
    return await getSupabaseDomains();
  } catch (error) {
    console.error('Error fetching monitored domains:', error);
    return [];
  }
}

// Function to get security metrics
export async function getSecurityMetrics(): Promise<SecurityMetrics> {
  try {
    return await getSupabaseSecurityMetrics();
  } catch (error) {
    console.error('Error calculating security metrics:', error);
    return {
      score: 0,
      password_security: 0,
      api_key_protection: 0,
      email_security: 0,
      total_alerts: 0,
      critical_issues: 0,
      resolved_issues: 0,
      last_updated: new Date().toISOString(),
    } as SecurityMetrics;
  }
}

// Function to get monitoring sources
export async function getMonitoringSources(): Promise<MonitoringSource[]> {
  try {
    return await getSupabaseMonitoringSources();
  } catch (error) {
    console.error('Error fetching monitoring sources:', error);
    return [];
  }
}

// Export the addGitHubScanResults function
export const addGitHubScanResults = addSupabaseGitHubScanResults;

// Function to format relative time (e.g., "2 hours ago")
export function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return `${diffSecs} seconds ago`;
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  } catch (error) {
    return 'Unknown time';
  }
}
