"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Instagram, Users, Star, Gift, Heart } from "lucide-react"

export default function InfluencerCollaboration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagramHandle: "",
    contentType: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contentType: value }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Using formsubmit.co for form submission
      const response = await fetch("https://formsubmit.co/collab@vavefragrances.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _subject: `VAVE Influencer Collaboration Application: ${formData.name}`,
          _template: "table",
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          instagramHandle: "",
          contentType: "",
          additionalInfo: "",
        })
      } else {
        console.error("Form submission failed")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SimpleNavbar />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Influencer Collaboration</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Join our community of fragrance enthusiasts and content creators! We're looking for passionate influencers 
            to showcase our premium fragrances through authentic content and barter collaborations.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-pink-600 dark:text-pink-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Free Products</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Receive complimentary VAVE fragrances to create authentic content
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Join our exclusive network of fragrance influencers and creators
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Growth</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Collaborate with a premium brand and grow your influence
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Apply for Collaboration</h2>
            {isSubmitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Application Submitted!</h3>
                <p className="text-green-700 dark:text-green-400">
                  Thank you for your interest in collaborating with VAVE. We'll review your application and get back to you within 3-5 business days.
                </p>
                <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="instagramHandle" className="block text-sm font-medium mb-1">
                      Instagram Handle *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Instagram className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        id="instagramHandle"
                        name="instagramHandle"
                        value={formData.instagramHandle}
                        onChange={handleChange}
                        required
                        placeholder="@yourusername"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contentType" className="block text-sm font-medium mb-1">
                      Preferred Content Type *
                    </label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reels">Instagram Reels</SelectItem>
                        <SelectItem value="posts">Instagram Posts</SelectItem>
                        <SelectItem value="stories">Instagram Stories</SelectItem>
                        <SelectItem value="all">All Content Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1">
                      Additional Information
                    </label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder="Tell us about your content style, follower count, previous collaborations, or any other relevant information..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Share any additional details about your content style, audience demographics, or previous brand collaborations.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">What We're Looking For</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-accent/10 rounded-full mr-4">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Authentic Content</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Creators who genuinely love fragrances and can create authentic, engaging content
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-accent/10 rounded-full mr-4">
                    <Instagram className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Active Instagram Presence</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Regular posting schedule with high-quality visuals and engaged audience
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-accent/10 rounded-full mr-4">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Engaged Audience</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Followers who are interested in lifestyle, beauty, and luxury products
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Collaboration Benefits</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Free VAVE fragrance products</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Creative freedom in content creation</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Potential for long-term partnerships</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Exclusive access to new launches</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Brand recognition and credibility</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Collaboration Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">collab@vavefragrances.com</p>
                </div>
                <div>
                  <h3 className="font-medium">Response Time</h3>
                  <p className="text-gray-600 dark:text-gray-300">3-5 business days</p>
                </div>
                <div>
                  <h3 className="font-medium">Follow Us</h3>
                  <a
                    href="https://instagram.com/vavefragrances"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    @vavefragrances
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
