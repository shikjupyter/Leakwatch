"use server"

// Mock email service that doesn't rely on actual SMTP connections
export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; message: string; previewUrl?: string }> {
  try {
    // Log the email details for debugging
    console.log("Sending email:", {
      to,
      subject,
      htmlLength: html.length,
    })

    // Generate a mock preview URL
    // In a real app, this would be a link to view the email in a web interface
    const timestamp = new Date().getTime()
    const previewUrl = `/api/email-preview?id=${timestamp}`

    // Store the email content in a server-side cache or database
    // For this demo, we'll just simulate success

    // Simulate a small delay to make it feel realistic
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      message: `Email sent successfully (simulated). In a production environment, this would be sent to ${to}.`,
      previewUrl,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function testEmailNotification(
  email: string,
): Promise<{ success: boolean; message: string; previewUrl?: string }> {
  const subject = "Leakwatch Test Notification"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Leakwatch Security</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <h2>Test Notification</h2>
        <p>This is a test notification from Leakwatch Security.</p>
        <p>Your email notifications are working correctly!</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message from Leakwatch Security. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmailNotification(email, subject, html)
}

export async function sendAlertNotification(
  email: string,
  alert: {
    domain: string
    type: string
    severity: string
    details: string
    source: string
  },
): Promise<{ success: boolean; message: string; previewUrl?: string }> {
  const subject = `[${alert.severity.toUpperCase()}] Security Alert for ${alert.domain}`

  const severityColor =
    alert.severity === "critical"
      ? "#DC2626"
      : alert.severity === "high"
        ? "#EA580C"
        : alert.severity === "medium"
          ? "#2563EB"
          : "#16A34A"

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Leakwatch Security</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <h2>Security Alert Detected</h2>
        <p>A security issue has been detected for your domain.</p>
        
        <div style="background-color: #f8f9fa; border: 1px solid #e0e0e0; padding: 15px; margin: 20px 0;">
          <p><strong>Domain:</strong> ${alert.domain}</p>
          <p><strong>Issue Type:</strong> ${alert.type}</p>
          <p><strong>Severity:</strong> <span style="color: ${severityColor}; font-weight: bold;">${alert.severity.toUpperCase()}</span></p>
          <p><strong>Details:</strong> ${alert.details}</p>
          <p><strong>Source:</strong> ${alert.source}</p>
          <p><strong>Detected:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Please log in to your Leakwatch dashboard to investigate and resolve this issue.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://leakwatch.io/alerts" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Alert Details
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message from Leakwatch Security. Please do not reply to this email.
            If you believe this alert is a false positive, you can mark it as resolved in your dashboard.
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmailNotification(email, subject, html)
}
