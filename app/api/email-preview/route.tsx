import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In a real app, you would retrieve the email content from a database or cache
  // based on the ID in the request

  // For this demo, we'll just return a simple HTML page
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Preview</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4F46E5;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .footer {
          padding: 10px 20px;
          background-color: #f9f9f9;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Leakwatch Security</h1>
        </div>
        <div class="content">
          <h2>Test Notification</h2>
          <p>This is a test notification from Leakwatch Security.</p>
          <p>Your email notifications are working correctly!</p>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px;">
            <p><strong>This is a simulated email preview.</strong></p>
            <p>In a production environment, this email would be sent to the recipient's inbox.</p>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from Leakwatch Security. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
