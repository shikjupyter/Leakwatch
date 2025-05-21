import { supabase } from './supabase';
import type { ScanResult, Domain, SecurityMetric, MonitoringSource } from './supabase';

// Get all scan results
export async function getAllScanResults(): Promise<ScanResult[]> {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching scan results:', error);
    return [];
  }
}

// Get all domains
export async function getAllDomains(): Promise<Domain[]> {
  try {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .order('last_scan', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching domains:', error);
    return [];
  }
}

// Get latest security metrics
export async function getLatestSecurityMetrics(): Promise<SecurityMetric> {
  try {
    const { data, error } = await supabase
      .from('security_metrics')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no metrics exist yet, return default values
      return {
        score: 0,
        password_security: 0,
        api_key_protection: 0,
        email_security: 0,
        total_alerts: 0,
        critical_issues: 0,
        resolved_issues: 0,
        last_updated: new Date().toISOString(),
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching security metrics:', error);
    return {
      score: 0,
      password_security: 0,
      api_key_protection: 0,
      email_security: 0,
      total_alerts: 0,
      critical_issues: 0,
      resolved_issues: 0,
      last_updated: new Date().toISOString(),
    };
  }
}

// Get all monitoring sources
export async function getAllMonitoringSources(): Promise<MonitoringSource[]> {
  try {
    const { data, error } = await supabase
      .from('monitoring_sources')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching monitoring sources:', error);
    return [];
  }
}

// Add scan results from GitHub scanner
export async function addGitHubScanResults(
  repoUrl: string,
  results: Array<{
    file: string;
    line: number;
    match: string;
    type: string;
    severity: string;
  }>,
): Promise<void> {
  try {
    // Extract domain from GitHub URL
    const urlParts = repoUrl.split('/');
    const owner = urlParts[urlParts.length - 2] || '';
    const repo = urlParts[urlParts.length - 1] || '';
    const domain = `${owner}/${repo}`;

    // Current timestamp
    const timestamp = new Date().toISOString();

    // Convert scanner results to our storage format
    const newResults = results.map((result) => ({
      file: result.file,
      line: result.line,
      match: result.match,
      type: result.type,
      severity: result.severity,
      timestamp,
      repository: repoUrl,
      domain,
      source: 'GitHub',
      details: `Found in ${result.file} at line ${result.line}`,
      affected:
        result.type === 'api_key' ? 'API endpoint' : result.type === 'password' ? 'User account' : 'System security',
      resolved: false,
    }));

    // Add to our database
    const { error: insertError } = await supabase
      .from('scan_results')
      .insert(newResults);

    if (insertError) throw insertError;

    // Check if domain exists
    const { data: existingDomain, error: domainError } = await supabase
      .from('domains')
      .select('*')
      .eq('name', domain)
      .single();

    if (domainError && domainError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if domain doesn't exist
      throw domainError;
    }

    // Determine domain status based on scan results
    const criticalCount = newResults.filter((r) => r.severity === 'critical').length;
    const highCount = newResults.filter((r) => r.severity === 'high').length;
    const status = criticalCount > 0 || highCount > 0 ? 'at-risk' : 'protected';

    if (existingDomain) {
      // Update existing domain
      const { error: updateError } = await supabase
        .from('domains')
        .update({
          status,
          last_scan: timestamp,
          alerts: existingDomain.alerts + newResults.length,
        })
        .eq('name', domain);

      if (updateError) throw updateError;
    } else {
      // Create new domain
      const { error: createError } = await supabase
        .from('domains')
        .insert({
          name: domain,
          status,
          last_scan: timestamp,
          alerts: newResults.length,
          date_added: timestamp,
          monitored_emails: Math.floor(Math.random() * 20) + 5, // Simulated data
          monitored_apis: Math.floor(Math.random() * 10) + 1, // Simulated data
        });

      if (createError) throw createError;
    }

    // Update monitoring sources
    const { data: githubSource, error: sourceError } = await supabase
      .from('monitoring_sources')
      .select('*')
      .eq('name', 'GitHub')
      .single();

    if (sourceError && sourceError.code !== 'PGRST116') throw sourceError;

    if (githubSource) {
      const { error: updateError } = await supabase
        .from('monitoring_sources')
        .update({
          status: 'active',
          last_check: timestamp,
        })
        .eq('name', 'GitHub');

      if (updateError) throw updateError;
    }

    // Calculate and update security metrics
    await calculateSecurityMetrics();
  } catch (error) {
    console.error('Error in addGitHubScanResults:', error);
  }
}

// Calculate security metrics based on scan results
export async function calculateSecurityMetrics(): Promise<SecurityMetric> {
  try {
    // Get all scan results
    const { data: scanResults, error: scanError } = await supabase
      .from('scan_results')
      .select('*');

    if (scanError) throw scanError;

    // If no scan results, return zero metrics
    if (!scanResults || scanResults.length === 0) {
      const defaultMetrics = {
        score: 0,
        password_security: 0,
        api_key_protection: 0,
        email_security: 0,
        total_alerts: 0,
        critical_issues: 0,
        resolved_issues: 0,
        last_updated: new Date().toISOString(),
      };

      // Insert default metrics
      const { error: insertError } = await supabase
        .from('security_metrics')
        .insert(defaultMetrics);

      if (insertError) throw insertError;

      return defaultMetrics;
    }

    const totalAlerts = scanResults.length;
    const unresolvedAlerts = scanResults.filter((r) => !r.resolved).length;
    const criticalIssues = scanResults.filter((r) => r.severity === 'critical' && !r.resolved).length;
    const highIssues = scanResults.filter((r) => r.severity === 'high' && !r.resolved).length;
    const resolvedIssues = scanResults.filter((r) => r.resolved).length;

    // Calculate security score (0-100)
    let score = 100;
    if (totalAlerts > 0) {
      score -= criticalIssues * 15; // -15 points per critical issue
      score -= highIssues * 10; // -10 points per high issue
      score += resolvedIssues * 5; // +5 points per resolved issue
      score = Math.max(0, Math.min(100, score));
    }

    // Calculate component scores
    const passwordSecurity = calculateComponentScore(scanResults.filter((r) => r.type === 'password'));
    const apiKeyProtection = calculateComponentScore(scanResults.filter((r) => r.type === 'api_key'));
    const emailSecurity = calculateComponentScore(
      scanResults.filter((r) => r.type === 'credential' && r.match.includes('email')),
    );

    const newMetrics = {
      score: Math.round(score),
      password_security: passwordSecurity,
      api_key_protection: apiKeyProtection,
      email_security: emailSecurity,
      total_alerts: totalAlerts,
      critical_issues: criticalIssues,
      resolved_issues: resolvedIssues,
      last_updated: new Date().toISOString(),
    };

    // Insert new metrics
    const { error: insertError } = await supabase
      .from('security_metrics')
      .insert(newMetrics);

    if (insertError) throw insertError;

    return newMetrics;
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
    };
  }
}

// Helper to calculate component scores
function calculateComponentScore(results: ScanResult[]): number {
  if (results.length === 0) return 0; // Start with zero score if no issues

  const unresolvedCount = results.filter((r) => !r.resolved).length;
  const criticalCount = results.filter((r) => r.severity === 'critical' && !r.resolved).length;
  const highCount = results.filter((r) => r.severity === 'high' && !r.resolved).length;

  // Start with 100 and subtract based on issues
  let score = 100;
  score -= criticalCount * 20; // -20 points per critical issue
  score -= highCount * 15; // -15 points per high issue
  score -= unresolvedCount * 5; // -5 points per other unresolved issue

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}
