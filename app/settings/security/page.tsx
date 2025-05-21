"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, Key, Loader2, Shield, Smartphone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SecuritySettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [isRevokingSession, setIsRevokingSession] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    apiUsageAlerts: true,
    passwordChangeAlerts: true,
  })

  const handleSwitchChange = (id: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }))

    if (id === "twoFactorEnabled") {
      toast({
        title: !securitySettings.twoFactorEnabled ? "2FA setup required" : "2FA disabled",
        description: !securitySettings.twoFactorEnabled
          ? "Please complete the 2FA setup process."
          : "Two-factor authentication has been disabled.",
      })
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved successfully.",
    })

    setIsSaving(false)
  }

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "API key generated",
      description: "Your new API key has been generated successfully.",
    })

    setIsGeneratingKey(false)
  }

  const handleRevokeSession = async () => {
    setIsRevokingSession(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Session revoked",
      description: "The selected session has been revoked successfully.",
    })

    setIsRevokingSession(false)
  }

  const handleCopyApiKey = () => {
    // In a real app, this would copy the actual API key
    navigator.clipboard.writeText("••••••••••••••••••••••••••••••")
    setIsCopied(true)

    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })

    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Security Settings" text="Manage your account security and authentication options." />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="twoFactorEnabled" className="flex flex-col space-y-1">
                  <span>Two-factor authentication</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Protect your account with an authentication app
                  </span>
                </Label>
              </div>
              <Switch
                id="twoFactorEnabled"
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={() => handleSwitchChange("twoFactorEnabled")}
              />
            </div>
            <div className="pl-0 sm:pl-9">
              <Button
                variant="outline"
                size="sm"
                disabled={!securitySettings.twoFactorEnabled}
                onClick={() => {
                  toast({
                    title: "2FA setup",
                    description: "The 2FA setup process will be available soon.",
                  })
                }}
              >
                Set up two-factor authentication
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <Key className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="recovery-codes" className="flex flex-col space-y-1">
                  <span>Recovery codes</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Generate backup codes to use if you lose access to your device
                  </span>
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!securitySettings.twoFactorEnabled}
                onClick={() => {
                  toast({
                    title: "Recovery codes",
                    description: "Recovery codes functionality will be available soon.",
                  })
                }}
              >
                View codes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for programmatic access to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Production API Key</p>
                  <p className="text-sm text-muted-foreground">Created on Apr 23, 2023</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Input value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "API key regenerated",
                      description: "Your API key has been regenerated successfully.",
                    })
                  }}
                >
                  Regenerate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "API key revoked",
                      description: "Your API key has been revoked successfully.",
                    })
                  }}
                >
                  Revoke
                </Button>
              </div>
            </div>
            <Button onClick={handleGenerateApiKey} disabled={isGeneratingKey}>
              {isGeneratingKey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Generate New API Key
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login Sessions</CardTitle>
            <CardDescription>Manage your active login sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div className="space-y-1">
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Chrome on Windows • Nairobi, Kenya</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <div className="mt-2 pl-9 text-xs text-muted-foreground">Last active: Just now</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-muted-foreground">iPhone 13 • Naivasha, Kenya</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRevokeSession} disabled={isRevokingSession}>
                  {isRevokingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : "Revoke"}
                </Button>
              </div>
              <div className="mt-2 pl-9 text-xs text-muted-foreground">Last active: 2 days ago</div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "All sessions logged out",
                  description: "All other sessions have been logged out successfully.",
                })
              }}
            >
              Log Out All Other Sessions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>Configure security alert settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="loginAlerts" className="flex flex-col space-y-1">
                <span>Unusual login alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Get notified about logins from new devices or locations
                </span>
              </Label>
              <Switch
                id="loginAlerts"
                checked={securitySettings.loginAlerts}
                onCheckedChange={() => handleSwitchChange("loginAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="apiUsageAlerts" className="flex flex-col space-y-1">
                <span>API usage alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Get notified about unusual API usage patterns
                </span>
              </Label>
              <Switch
                id="apiUsageAlerts"
                checked={securitySettings.apiUsageAlerts}
                onCheckedChange={() => handleSwitchChange("apiUsageAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="passwordChangeAlerts" className="flex flex-col space-y-1">
                <span>Password change alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Get notified when your password is changed
                </span>
              </Label>
              <Switch
                id="passwordChangeAlerts"
                checked={securitySettings.passwordChangeAlerts}
                onCheckedChange={() => handleSwitchChange("passwordChangeAlerts")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}
