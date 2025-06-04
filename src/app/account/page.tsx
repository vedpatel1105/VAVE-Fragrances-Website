"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Account() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile to an API
    console.log("Updated profile:", profile)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={profile.address} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={profile.city} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={profile.country} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" name="zipCode" value={profile.zipCode} onChange={handleInputChange} />
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </div>
    </div>
  )
}
