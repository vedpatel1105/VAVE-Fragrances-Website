"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Building2, Gift, Users, Handshake, ArrowRight, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BusinessCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  fields: {
    [key: string]: {
      label: string
      type: string
      required: boolean
      options?: string[]
      placeholder?: string
    }
  }
}

const businessCategories: BusinessCategory[] = [
  {
    id: "white-labeling",
    title: "White Labeling & Brand Creation",
    description: "Start your own perfume brand with our custom fragrances, packaging design, and digital marketing services",
    icon: <Building2 className="h-8 w-8" />,
    color: "from-blue-500 to-purple-600",
    fields: {
      businessName: { label: "Business/Brand Name", type: "text", required: true, placeholder: "Enter your brand name" },
      businessType: { label: "Business Type", type: "select", required: true, options: ["Startup", "Existing Business", "Individual Entrepreneur", "Company"] },
      targetMarket: { label: "Target Market", type: "select", required: true, options: ["Luxury", "Premium", "Mass Market", "Niche", "Corporate Gifting"] },
      expectedVolume: { label: "Expected Monthly Volume", type: "select", required: true, options: ["100-500 units", "500-1000 units", "1000-5000 units", "5000+ units"] },
      budget: { label: "Investment Budget", type: "select", required: true, options: ["₹50K - ₹1L", "₹1L - ₹5L", "₹5L - ₹10L", "₹10L+"] },
      timeline: { label: "Launch Timeline", type: "select", required: true, options: ["1-3 months", "3-6 months", "6-12 months", "12+ months"] },
      services: { label: "Required Services", type: "checkbox", required: false, options: ["Custom Fragrance Development", "Packaging Design", "Digital Marketing", "Social Media Management", "Website Development", "Brand Strategy"] },
      additionalInfo: { label: "Additional Requirements", type: "textarea", required: false, placeholder: "Tell us more about your vision and specific needs..." }
    }
  },
  {
    id: "bulk-orders",
    title: "Bulk Orders & Corporate Gifting",
    description: "Perfect for offices, events, and corporate gifting with special bulk pricing and customization options",
    icon: <Gift className="h-8 w-8" />,
    color: "from-green-500 to-teal-600",
    fields: {
      companyName: { label: "Company/Organization Name", type: "text", required: true, placeholder: "Enter company name" },
      orderType: { label: "Order Type", type: "select", required: true, options: ["Corporate Gifting", "Event Favors", "Employee Rewards", "Client Gifts", "Wedding Favors", "Other"] },
      quantity: { label: "Expected Quantity", type: "select", required: true, options: ["50-100 units", "100-500 units", "500-1000 units", "1000+ units"] },
      budget: { label: "Budget Range", type: "select", required: true, options: ["₹25K - ₹50K", "₹50K - ₹1L", "₹1L - ₹2L", "₹2L+"] },
      deliveryDate: { label: "Required Delivery Date", type: "text", required: true, placeholder: "DD/MM/YYYY" },
      customization: { label: "Customization Required", type: "checkbox", required: false, options: ["Custom Packaging", "Branded Labels", "Custom Fragrance", "Gift Boxes", "Personalized Messages"] },
      deliveryLocation: { label: "Delivery Location", type: "text", required: true, placeholder: "City, State" },
      additionalInfo: { label: "Event/Project Details", type: "textarea", required: false, placeholder: "Tell us about your event or gifting requirements..." }
    }
  },
  {
    id: "distribution",
    title: "Distribution & Retail Partnership",
    description: "Become our distributor, retailer, or sales partner to sell VAVE fragrances in your store or region",
    icon: <Users className="h-8 w-8" />,
    color: "from-orange-500 to-red-600",
    fields: {
      businessName: { label: "Business/Store Name", type: "text", required: true, placeholder: "Enter business name" },
      businessType: { label: "Business Type", type: "select", required: true, options: ["Retail Store", "Online Store", "Distributor", "Sales Agent", "Event Organizer", "Other"] },
      location: { label: "Business Location", type: "text", required: true, placeholder: "City, State" },
      experience: { label: "Experience in Fragrance/Beauty", type: "select", required: true, options: ["No Experience", "1-2 years", "3-5 years", "5+ years"] },
      targetCustomers: { label: "Target Customer Base", type: "select", required: true, options: ["General Public", "Luxury Market", "Corporate Clients", "Online Customers", "Event Attendees"] },
      investmentCapacity: { label: "Investment Capacity", type: "select", required: true, options: ["₹25K - ₹50K", "₹50K - ₹1L", "₹1L - ₹2L", "₹2L+"] },
      expectedMonthlySales: { label: "Expected Monthly Sales", type: "select", required: true, options: ["50-100 units", "100-300 units", "300-500 units", "500+ units"] },
      additionalInfo: { label: "Business Background", type: "textarea", required: false, placeholder: "Tell us about your business, customer base, and why you want to partner with VAVE..." }
    }
  },
  {
    id: "collaboration",
    title: "Brand Collaborations",
    description: "Partner with VAVE for influencer collaborations, brand partnerships, and marketing initiatives",
    icon: <Handshake className="h-8 w-8" />,
    color: "from-pink-500 to-rose-600",
    fields: {
      influencerName: { label: "Name/Brand Name", type: "text", required: true, placeholder: "Enter your name or brand" },
      collaborationType: { label: "Collaboration Type", type: "select", required: true, options: ["Influencer Partnership", "Brand Collaboration", "Content Creation", "Event Partnership", "Product Launch", "Other"] },
      platform: { label: "Primary Platform", type: "select", required: true, options: ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "Blog", "Multiple Platforms"] },
      followerCount: { label: "Follower/Subscriber Count", type: "select", required: true, options: ["1K - 10K", "10K - 50K", "50K - 100K", "100K - 500K", "500K+"] },
      engagementRate: { label: "Average Engagement Rate", type: "select", required: true, options: ["1-3%", "3-5%", "5-8%", "8%+"] },
      targetAudience: { label: "Target Audience", type: "text", required: true, placeholder: "Describe your audience demographics" },
      collaborationGoals: { label: "Collaboration Goals", type: "checkbox", required: false, options: ["Product Promotion", "Brand Awareness", "Content Creation", "Event Participation", "Long-term Partnership"] },
      additionalInfo: { label: "Collaboration Proposal", type: "textarea", required: false, placeholder: "Tell us about your collaboration ideas and what you can offer..." }
    }
  }
]

export default function BusinessInquiry() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setFormData({})
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field] || []
      if (checked) {
        return { ...prev, [field]: [...currentValues, option] }
      } else {
        return { ...prev, [field]: currentValues.filter((item: string) => item !== option) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const selectedCategoryData = businessCategories.find(cat => cat.id === selectedCategory)
      const formDataWithCategory = {
        ...formData,
        category: selectedCategoryData?.title,
        categoryId: selectedCategory,
        timestamp: new Date().toISOString(),
        _subject: `VAVE Business Inquiry: ${selectedCategoryData?.title}`,
        _template: "table"
      }

      const response = await fetch("https://formsubmit.co/sales@vavefragrances.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formDataWithCategory),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({})
        setSelectedCategory("")
        toast({
          title: "Inquiry Submitted Successfully!",
          description: "Thank you for your interest. Our team will contact you within 24 hours.",
        })
      } else {
        throw new Error("Form submission failed")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategoryData = businessCategories.find(cat => cat.id === selectedCategory)

  return (
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-white/20">
      <SimpleNavbar />
      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Partner With Us</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">
              Business Opportunities
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
              Join the VAVE family and explore exciting business opportunities in the fragrance industry. 
              From white labeling to distribution partnerships, we offer comprehensive solutions for your business needs.
            </p>
          </div>

          {!selectedCategory ? (
            /* Category Selection */
            <div className="max-w-6xl mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {businessCategories.map((category) => (
                  <Card 
                    key={category.id}
                    className="bg-zinc-900/40 backdrop-blur-sm border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-10 relative z-10">
                      <div className={`w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}>
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-serif tracking-wide text-white mb-4">{category.title}</h3>
                      <p className="text-white/50 text-sm font-light leading-relaxed mb-8">{category.description}</p>
                      <div className="flex items-center text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 group-hover:text-white transition-colors duration-300">
                        <span>Get Started</span>
                        <ArrowRight className="h-3 w-3 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Why Choose VAVE Section */}
              <div className="mt-32 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
                <div className="pt-24 text-center">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">The Advantage</h2>
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-16 tracking-wide">Why Partner with VAVE</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="group">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/10 transition-colors duration-300">
                        <Building2 className="h-6 w-6 text-white/70" />
                      </div>
                      <h4 className="text-lg font-serif mb-3 tracking-wide">Premium Quality</h4>
                      <p className="text-white/40 text-sm font-light leading-relaxed">High-quality fragrances with unique formulations and sophisticated packaging design.</p>
                    </div>
                    <div className="group">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/10 transition-colors duration-300">
                        <Users className="h-6 w-6 text-white/70" />
                      </div>
                      <h4 className="text-lg font-serif mb-3 tracking-wide">Expert Support</h4>
                      <p className="text-white/40 text-sm font-light leading-relaxed">A dedicated support team committed to helping your business venture succeed at every step.</p>
                    </div>
                    <div className="group">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/10 transition-colors duration-300">
                        <Handshake className="h-6 w-6 text-white/70" />
                      </div>
                      <h4 className="text-lg font-serif mb-3 tracking-wide">Flexible Partnership</h4>
                      <p className="text-white/40 text-sm font-light leading-relaxed">Customized partnership terms designed to align seamlessly with your operational model.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Section */
            <div className="max-w-4xl mx-auto">
              {isSubmitted ? (
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5 text-center p-16">
                  <CardContent className="p-0">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Check className="h-8 w-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif tracking-wide text-white mb-6">Inquiry Submitted Successfully</h2>
                    <p className="text-white/50 text-sm font-light leading-relaxed mb-10 max-w-xl mx-auto">
                      Thank you for your interest in partnering with VAVE. Our business development team will review your inquiry and contact you within 24 hours.
                    </p>
                    <div className="space-y-6">
                      <Button 
                        onClick={() => {
                          setIsSubmitted(false)
                          setSelectedCategory("")
                          setFormData({})
                        }}
                        className="h-12 px-8 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300"
                      >
                        Submit Another Inquiry
                      </Button>
                      <p className="text-xs text-white/40 font-light tracking-wide">
                        Need immediate assistance? Contact us at{" "}
                        <a href="mailto:sales@vavefragrances.com" className="text-white/70 hover:text-white transition-colors border-b border-white/20 pb-0.5">
                          sales@vavefragrances.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5">
                  <CardHeader className="pb-8">
                    <div className="mb-6">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedCategory("")}
                        className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white hover:bg-transparent -ml-3"
                      >
                        ← Back to Categories
                      </Button>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-serif text-white tracking-wide mb-4">
                      {selectedCategoryData?.title}
                    </CardTitle>
                    <p className="text-white/50 text-sm font-light leading-relaxed">
                      {selectedCategoryData?.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Basic Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest text-white/50">Full Name *</label>
                          <Input
                            value={formData.fullName || ""}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            required
                            placeholder="Enter your full name"
                            className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest text-white/50">Email Address *</label>
                          <Input
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest text-white/50">Phone Number *</label>
                          <Input
                            type="tel"
                            value={formData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                            placeholder="Enter your phone number"
                            className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest text-white/50">City, State *</label>
                          <Input
                            value={formData.location || ""}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            required
                            placeholder="Enter your location"
                            className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                          />
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-8 space-y-8">
                        <h3 className="text-lg font-serif text-white tracking-wide">Additional Details</h3>
                        {/* Category-specific fields */}
                        {selectedCategoryData && Object.entries(selectedCategoryData.fields).map(([fieldKey, fieldConfig]) => (
                          <div key={fieldKey} className="space-y-2">
                            <label className="block text-[11px] uppercase tracking-widest text-white/50 mb-3">
                              {fieldConfig.label} {fieldConfig.required && "*"}
                            </label>
                            
                            {fieldConfig.type === "text" && (
                              <Input
                                value={formData[fieldKey] || ""}
                                onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                required={fieldConfig.required}
                                placeholder={fieldConfig.placeholder}
                                className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                              />
                            )}

                            {fieldConfig.type === "select" && (
                              <Select
                                value={formData[fieldKey] || ""}
                                onValueChange={(value) => handleInputChange(fieldKey, value)}
                                required={fieldConfig.required}
                              >
                                <SelectTrigger className="h-12 bg-zinc-950/50 border-white/10 text-white focus:ring-1 focus:ring-white/30 rounded-none">
                                  <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} className="text-white/20" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                  {fieldConfig.options?.map((option) => (
                                    <SelectItem key={option} value={option} className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}

                            {fieldConfig.type === "textarea" && (
                              <Textarea
                                value={formData[fieldKey] || ""}
                                onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                required={fieldConfig.required}
                                placeholder={fieldConfig.placeholder}
                                rows={4}
                                className="bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none resize-none pt-4"
                              />
                            )}

                            {fieldConfig.type === "checkbox" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {fieldConfig.options?.map((option) => (
                                  <div key={option} className="flex items-center space-x-3 bg-zinc-950/30 p-4 border border-white/5">
                                    <Checkbox
                                      id={`${fieldKey}-${option}`}
                                      checked={formData[fieldKey]?.includes(option) || false}
                                      onCheckedChange={(checked) => handleCheckboxChange(fieldKey, option, checked as boolean)}
                                      className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black rounded-none"
                                    />
                                    <label htmlFor={`${fieldKey}-${option}`} className="text-sm font-light text-white/70 cursor-pointer">
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-8 border-t border-white/5">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Business Inquiry"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
