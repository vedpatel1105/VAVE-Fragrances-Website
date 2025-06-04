"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [newsletter, setNewsletter] = useState(true)

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="text-lg">
            Enable Notifications
          </Label>
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="newsletter" className="text-lg">
            Subscribe to Newsletter
          </Label>
          <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
        </div>
      </div>
    </div>
  )
}
