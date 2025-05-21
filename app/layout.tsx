import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { ProfileImageProvider } from "@/components/profile-image-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leakwatch - Real-Time Credential Breach Monitor",
  description: "Monitor and protect your business from credential leaks and data breaches",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ProfileImageProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ProfileImageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
