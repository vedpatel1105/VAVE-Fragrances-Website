"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"
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
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-white/20">
      <SimpleNavbar />
      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Join The Brand</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Influencer Collaboration</h1>
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
              Join our community of fragrance enthusiasts and content creators. We're looking for passionate influencers 
              to showcase our premium fragrances through authentic content and barter collaborations.
            </p>
          </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
          
          <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5 p-10 text-center hover:bg-white/5 transition-all duration-500 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mx-auto w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <Gift className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif tracking-wide text-white mb-4">Free Products</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Receive complimentary VAVE fragrances to create authentic content
              </p>
            </div>
          </Card>
          
          <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5 p-10 text-center hover:bg-white/5 transition-all duration-500 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mx-auto w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <Users className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif tracking-wide text-white mb-4">Community</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Join our exclusive network of fragrance influencers and creators
              </p>
            </div>
          </Card>
          
          <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5 p-10 text-center hover:bg-white/5 transition-all duration-500 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mx-auto w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <Star className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif tracking-wide text-white mb-4">Growth</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Collaborate with a premium brand and grow your influence
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5 p-8 lg:p-12">
            <h2 className="text-3xl font-serif text-white tracking-wide mb-8">Apply for Collaboration</h2>
            {isSubmitted ? (
              <div className="bg-white/5 border border-white/10 p-12 rounded-lg text-center">
                <div className="mx-auto w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif text-white tracking-wide mb-4">Application Submitted</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed mb-8">
                  Thank you for your interest in collaborating with VAVE. We'll review your application and get back to you within 3-5 business days.
                </p>
                <Button 
                  className="h-12 px-8 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[11px] uppercase tracking-widest text-white/50">
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
                      className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="instagramHandle" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Instagram Handle *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Instagram className="h-4 w-4 text-white/30" />
                      </div>
                      <Input
                        id="instagramHandle"
                        name="instagramHandle"
                        value={formData.instagramHandle}
                        onChange={handleChange}
                        required
                        placeholder="@yourusername"
                        className="pl-12 h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contentType" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Preferred Content Type *
                    </label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger className="h-12 bg-zinc-950/50 border-white/10 text-white focus:ring-1 focus:ring-white/30 rounded-none">
                        <SelectValue placeholder="Select content type" className="text-white/20"/>
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="reels" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Instagram Reels</SelectItem>
                        <SelectItem value="posts" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Instagram Posts</SelectItem>
                        <SelectItem value="stories" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Instagram Stories</SelectItem>
                        <SelectItem value="all" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">All Content Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="additionalInfo" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Additional Information
                    </label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder="Tell us about your content style, follower count, previous collaborations..."
                      rows={4}
                      className="bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none resize-none pt-4"
                    />
                    <p className="text-[10px] text-white/30 mt-2 font-light">
                      Share any additional details about your content style, audience demographics, or previous brand collaborations.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
              </form>
            )}
          </Card>

          <div className="space-y-8">
            <Card className="bg-transparent border-none shadow-none">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-8">What We're Looking For</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full mr-5">
                    <Heart className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 tracking-wide">Authentic Content</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">
                      Creators who genuinely love fragrances and can create authentic, engaging content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full mr-5">
                    <Instagram className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 tracking-wide">Active Instagram Presence</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">
                      Regular posting schedule with high-quality visuals and engaged audience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full mr-5">
                    <Users className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 tracking-wide">Engaged Audience</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">
                      Followers who are interested in lifestyle, beauty, and premium luxury products.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="w-full h-px bg-white/5 my-8"></div>

            <Card className="bg-transparent border-none shadow-none">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-8">Collaboration Benefits</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-white/40 mr-4" strokeWidth={2} />
                  <span className="text-sm font-light text-white/70">Free VAVE fragrance products</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-white/40 mr-4" strokeWidth={2} />
                  <span className="text-sm font-light text-white/70">Creative freedom in content creation</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-white/40 mr-4" strokeWidth={2} />
                  <span className="text-sm font-light text-white/70">Potential for long-term partnerships</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-white/40 mr-4" strokeWidth={2} />
                  <span className="text-sm font-light text-white/70">Exclusive access to new launches</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-white/40 mr-4" strokeWidth={2} />
                  <span className="text-sm font-light text-white/70">Brand recognition and high credibility</span>
                </div>
              </div>
            </Card>

            <div className="w-full h-px bg-white/5 my-8"></div>

            <Card className="bg-transparent border-none shadow-none">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Collaboration Email</h3>
                  <p className="text-white">collab@vavefragrances.com</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Response Time</h3>
                  <p className="text-white">3-5 business days</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Follow Us</h3>
                  <a
                    href="https://instagram.com/vavefragrances"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors border-b border-white/20 pb-0.5"
                  >
                    <Instagram className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    @vavefragrances
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  )
}
