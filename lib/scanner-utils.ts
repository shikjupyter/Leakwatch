// Pattern definitions for credential scanning
export const CREDENTIAL_PATTERNS = {
  // API Keys
  apiKey: [
    /api[_-]?key[^a-zA-Z0-9]([a-zA-Z0-9]{16,})/i,
    /api[_-]?secret[^a-zA-Z0-9]([a-zA-Z0-9]{16,})/i,
    /access[_-]?key[^a-zA-Z0-9]([a-zA-Z0-9]{16,})/i,
    /access[_-]?token[^a-zA-Z0-9]([a-zA-Z0-9]{16,})/i,
  ],

  // AWS Credentials
  aws: [
    /AKIA[0-9A-Z]{16}/,
    /aws[_-]?access[_-]?key[_-]?id[^a-zA-Z0-9]([a-zA-Z0-9]{20,})/i,
    /aws[_-]?secret[_-]?access[_-]?key[^a-zA-Z0-9]([a-zA-Z0-9]{40,})/i,
  ],

  // Database Credentials
  database: [
    /password[^a-zA-Z0-9]([a-zA-Z0-9!@#$%^&*()_+]{8,})/i,
    /passwd[^a-zA-Z0-9]([a-zA-Z0-9!@#$%^&*()_+]{8,})/i,
    /pwd[^a-zA-Z0-9]([a-zA-Z0-9!@#$%^&*()_+]{8,})/i,
    /db_password[^a-zA-Z0-9]([a-zA-Z0-9!@#$%^&*()_+]{8,})/i,
  ],

  // OAuth Tokens
  oauth: [
    /oauth[^a-zA-Z0-9]([a-zA-Z0-9]{30,})/i,
    /refresh[_-]?token[^a-zA-Z0-9]([a-zA-Z0-9]{30,})/i,
    /access[_-]?token[^a-zA-Z0-9]([a-zA-Z0-9]{30,})/i,
  ],

  // Private Keys
  privateKey: [
    /-----BEGIN PRIVATE KEY-----/,
    /-----BEGIN RSA PRIVATE KEY-----/,
    /-----BEGIN DSA PRIVATE KEY-----/,
    /-----BEGIN EC PRIVATE KEY-----/,
  ],

  // JWT Secrets
  jwt: [/jwt[_-]?secret[^a-zA-Z0-9]([a-zA-Z0-9]{16,})/i, /jwt[_-]?token[^a-zA-Z0-9]([a-zA-Z0-9]{16,})/i],
}

// Determine severity based on credential type
export function determineSeverity(match: string, type: string): "critical" | "high" | "medium" | "low" {
  // AWS credentials are always critical
  if (type === "aws" || match.includes("AWS_SECRET") || match.includes("AKIA")) {
    return "critical"
  }

  // Private keys are critical
  if (match.includes("PRIVATE KEY")) {
    return "critical"
  }

  // API keys are typically high severity
  if (type === "apiKey" || match.includes("API_KEY") || match.includes("api_key")) {
    return "high"
  }

  // Database passwords are high severity
  if (match.includes("password") || match.includes("PASSWORD")) {
    return "high"
  }

  // OAuth tokens are medium to high
  if (type === "oauth" || match.includes("token") || match.includes("TOKEN")) {
    return "medium"
  }

  // Default to medium
  return "medium"
}

// Check if a file should be ignored
export function shouldIgnoreFile(filePath: string): boolean {
  const ignoredPatterns = [
    /node_modules/,
    /\.git\//,
    /\.vscode\//,
    /\.idea\//,
    /dist\//,
    /build\//,
    /\.DS_Store/,
    /\.env\.example/,
    /\.env\.sample/,
    /\.test\./,
    /\.spec\./,
    /test\//,
    /tests\//,
    /example\//,
    /examples\//,
  ]

  return ignoredPatterns.some((pattern) => pattern.test(filePath))
}
