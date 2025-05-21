import { addGitHubScanResults as addSupabaseGitHubScanResults } from './supabase-service';

// Export the addGitHubScanResults function
export const addGitHubScanResults = addSupabaseGitHubScanResults;

// Re-export other functions from supabase-service
export {
  getAllScanResults,
  getAllDomains,
  getLatestSecurityMetrics,
  getAllMonitoringSources,
  calculateSecurityMetrics
} from './supabase-service';
