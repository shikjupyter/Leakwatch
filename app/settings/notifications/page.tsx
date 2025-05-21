"use client"

import type React from "react"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, AlertTriangle, ExternalLink, CheckCircle } from "lucide-react"
import { testEmailNotification } from "@/app/actions/email-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NotificationsSettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const [notificationSettings, setNotificationSettings] = useState({
    criticalAlerts: true,
    highAlerts: true,
    mediumAlerts: true,
    lowAlerts: false,
    emailNotifications: true,
    emailAddress: "shikongoken@gmail.com",
    digestNotifications: true,
    digestTime: "9",
    weeklyReport: true,
    weeklyDay: "1",
  })

  const handleSwitchChange = (id: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved successfully.",
    })

    setIsSaving(false)
  }

  const handleTestEmail = async () => {
    if (!notificationSettings.emailAddress) {
      toast({
        title: "Email address required",
        description: "Please enter an email address to send the test notification.",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    setEmailSent(false)

    try {
      // Show immediate feedback
      toast({
        title: "Sending test email",
        description: "This may take a few seconds...",
      })

      const result = await testEmailNotification(notificationSettings.emailAddress)

      if (result.success) {
        setEmailSent(true)
        toast({
          title: "Test email sent",
          description: "A test notification has been sent successfully.",
        })

        // Store the preview URL if available
        if (result.previewUrl) {
          setEmailPreviewUrl(result.previewUrl)
        }
      } else {
        toast({
          title: "Failed to send test email",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error sending test email",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      console.error("Error sending test email:", error)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Notification Settings"
        text="Configure how and when you receive alerts and notifications."
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Alert Preferences</CardTitle>
            <CardDescription>Choose which types of security alerts you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="criticalAlerts" className="flex flex-col space-y-1">
                <span>Critical Alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Immediate notifications for high-severity security issues
                </span>
              </Label>
              <Switch
                id="criticalAlerts"
                checked={notificationSettings.criticalAlerts}
                onCheckedChange={() => handleSwitchChange("criticalAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="highAlerts" className="flex flex-col space-y-1">
                <span>High Priority Alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Notifications for important security issues
                </span>
              </Label>
              <Switch
                id="highAlerts"
                checked={notificationSettings.highAlerts}
                onCheckedChange={() => handleSwitchChange("highAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="mediumAlerts" className="flex flex-col space-y-1">
                <span>Medium Priority Alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Notifications for moderate security issues
                </span>
              </Label>
              <Switch
                id="mediumAlerts"
                checked={notificationSettings.mediumAlerts}
                onCheckedChange={() => handleSwitchChange("mediumAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="lowAlerts" className="flex flex-col space-y-1">
                <span>Low Priority Alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Notifications for minor security issues
                </span>
              </Label>
              <Switch
                id="lowAlerts"
                checked={notificationSettings.lowAlerts}
                onCheckedChange={() => handleSwitchChange("lowAlerts")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure your email notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                For demonstration purposes, emails are simulated and won't actually be delivered to your address.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Receive alerts via email</span>
              </Label>
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={() => handleSwitchChange("emailNotifications")}
              />
            </div>
            <div className="pl-0 sm:pl-6">
              <div className="grid gap-2">
                <Label htmlFor="emailAddress">Email address</Label>
                <Input
                  id="emailAddress"
                  value={notificationSettings.emailAddress}
                  onChange={handleInputChange}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestEmail}
                  disabled={isTesting || !notificationSettings.emailNotifications}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-3 w-3" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>

              {emailSent && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">Email sent successfully</p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        In a production environment, this would be delivered to {notificationSettings.emailAddress}
                      </p>

                      {emailPreviewUrl && (
                        <Button variant="link" size="sm" className="h-auto p-0 mt-2" asChild>
                          <a href={emailPreviewUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            View Email Preview
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Schedule</CardTitle>
            <CardDescription>Configure when you want to receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="digestNotifications" className="flex flex-col space-y-1">
                <span>Daily Digest</span>
                <span className="font-normal text-sm text-muted-foreground">Receive a daily summary of all alerts</span>
              </Label>
              <Switch
                id="digestNotifications"
                checked={notificationSettings.digestNotifications}
                onCheckedChange={() => handleSwitchChange("digestNotifications")}
              />
            </div>
            <div className="pl-0 sm:pl-6">
              <div className="grid gap-2">
                <Label htmlFor="digestTime">Delivery time</Label>
                <Select
                  value={notificationSettings.digestTime}
                  onValueChange={(value) => handleSelectChange("digestTime", value)}
                  disabled={!notificationSettings.digestNotifications}
                >
                  <SelectTrigger id="digestTime">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6:00 AM</SelectItem>
                    <SelectItem value="7">7:00 AM</SelectItem>
                    <SelectItem value="8">8:00 AM</SelectItem>
                    <SelectItem value="9">9:00 AM</SelectItem>
                    <SelectItem value="10">10:00 AM</SelectItem>
                    <SelectItem value="11">11:00 AM</SelectItem>
                    <SelectItem value="12">12:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="weeklyReport" className="flex flex-col space-y-1">
                <span>Weekly Report</span>
                <span className="font-normal text-sm text-muted-foreground">Receive a weekly summary report</span>
              </Label>
              <Switch
                id="weeklyReport"
                checked={notificationSettings.weeklyReport}
                onCheckedChange={() => handleSwitchChange("weeklyReport")}
              />
            </div>
            <div className="pl-0 sm:pl-6">
              <div className="grid gap-2">
                <Label htmlFor="weeklyDay">Delivery day</Label>
                <Select
                  value={notificationSettings.weeklyDay}
                  onValueChange={(value) => handleSelectChange("weeklyDay", value)}
                  disabled={!notificationSettings.weeklyReport}
                >
                  <SelectTrigger id="weeklyDay">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                    <SelectItem value="0">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
