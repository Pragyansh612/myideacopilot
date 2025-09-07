"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, Bell, Shield, Download, Trash2, LogOut, Camera, Save, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Creative thinker and idea enthusiast",
  })

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    ideaReminders: false,
    weeklyDigest: true,
    aiSuggestions: true,
  })

  const [preferences, setPreferences] = useState({
    defaultView: "grid",
    ideasPerPage: "12",
    autoSave: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message in real app
  }

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your ideas will be permanently lost.",
      )
    ) {
      // Handle account deletion
      console.log("Account deletion requested")
    }
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      // Handle logout
      console.log("Logout requested")
    }
  }

  const handleExportData = () => {
    // Handle data export
    console.log("Data export requested")
  }

  return (
    <AppLayout>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information and profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/professional-headshot.png" />
                <AvatarFallback className="text-lg gradient-primary text-primary-foreground">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="glass border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="glass border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="glass border-border/50"
              />
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving} className="gradient-primary hover:glow-primary">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your MyIdeaCopilot experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <ThemeToggle />
            </div>

            <Separator />

            {/* Default View */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Default Ideas View</Label>
                <p className="text-sm text-muted-foreground">How ideas are displayed by default</p>
              </div>
              <Select
                value={preferences.defaultView}
                onValueChange={(value) => setPreferences({ ...preferences, defaultView: value })}
              >
                <SelectTrigger className="w-32 glass border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ideas Per Page */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Ideas Per Page</Label>
                <p className="text-sm text-muted-foreground">Number of ideas to show per page</p>
              </div>
              <Select
                value={preferences.ideasPerPage}
                onValueChange={(value) => setPreferences({ ...preferences, ideasPerPage: value })}
              >
                <SelectTrigger className="w-20 glass border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Save</Label>
                <p className="text-sm text-muted-foreground">Automatically save ideas as you type</p>
              </div>
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive updates and reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Updates</Label>
                <p className="text-sm text-muted-foreground">Receive product updates and announcements</p>
              </div>
              <Switch
                checked={notifications.emailUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Idea Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded to capture new ideas</p>
              </div>
              <Switch
                checked={notifications.ideaReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, ideaReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of your ideas and progress</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>AI Suggestions</Label>
                <p className="text-sm text-muted-foreground">Receive AI-powered idea suggestions</p>
              </div>
              <Switch
                checked={notifications.aiSuggestions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, aiSuggestions: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy Section */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2 text-primary" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Export Your Data</Label>
                <p className="text-sm text-muted-foreground">Download all your ideas and data</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Section */}
        <Card className="glass-strong border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Account Actions
            </CardTitle>
            <CardDescription>Manage your account and session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sign Out</Label>
                <p className="text-sm text-muted-foreground">Sign out of your current session</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-destructive">Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
