"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
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
    <>
      <SimpleNavbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Business Partnership Opportunities
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join the VAVE family and explore exciting business opportunities in the fragrance industry. 
              From white labeling to distribution partnerships, we offer comprehensive solutions for your business needs.
            </p>
          </div>

          {!selectedCategory ? (
            /* Category Selection */
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {businessCategories.map((category) => (
                  <Card 
                    key={category.id}
                    className="bg-black/40 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">{category.description}</p>
                      <div className="flex items-center text-white group-hover:text-yellow-400 transition-colors">
                        <span className="font-medium">Get Started</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Why Choose VAVE Section */}
              <div className="mt-24">
                <h2 className="text-3xl font-bold text-center mb-12">Why Partner with VAVE?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                    <p className="text-gray-300">High-quality fragrances with unique formulations and premium packaging</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                    <p className="text-gray-300">Dedicated support team to help you succeed in your business venture</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Handshake className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Flexible Partnership</h3>
                    <p className="text-gray-300">Customized partnership terms that work for your business model</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Section */
            <div className="max-w-4xl mx-auto">
              {isSubmitted ? (
                <Card className="bg-black/40 backdrop-blur-md border-white/10">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Inquiry Submitted Successfully!</h2>
                    <p className="text-gray-300 mb-8 text-lg">
                      Thank you for your interest in partnering with VAVE. Our business development team will review your inquiry and contact you within 24 hours.
                    </p>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => {
                          setIsSubmitted(false)
                          setSelectedCategory("")
                          setFormData({})
                        }}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-3"
                      >
                        Submit Another Inquiry
                      </Button>
                      <p className="text-sm text-gray-400">
                        Need immediate assistance? Contact us at{" "}
                        <a href="mailto:sales@vavefragrances.com" className="text-white hover:underline">
                          sales@vavefragrances.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-md border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedCategory("")}
                        className="text-white hover:text-white/80"
                      >
                        ← Back to Categories
                      </Button>
                    </div>
                    <CardTitle className="text-3xl font-bold">
                      {selectedCategoryData?.title}
                    </CardTitle>
                    <p className="text-gray-300 text-lg">
                      {selectedCategoryData?.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Basic Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <Input
                            value={formData.fullName || ""}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            required
                            placeholder="Enter your full name"
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email Address *</label>
                          <Input
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone Number *</label>
                          <Input
                            type="tel"
                            value={formData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                            placeholder="Enter your phone number"
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">City, State *</label>
                          <Input
                            value={formData.location || ""}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            required
                            placeholder="Enter your location"
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      {/* Category-specific fields */}
                      {selectedCategoryData && Object.entries(selectedCategoryData.fields).map(([fieldKey, fieldConfig]) => (
                        <div key={fieldKey}>
                          <label className="block text-sm font-medium mb-2">
                            {fieldConfig.label} {fieldConfig.required && "*"}
                          </label>
                          
                          {fieldConfig.type === "text" && (
                            <Input
                              value={formData[fieldKey] || ""}
                              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                              required={fieldConfig.required}
                              placeholder={fieldConfig.placeholder}
                              className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                            />
                          )}

                          {fieldConfig.type === "select" && (
                            <Select
                              value={formData[fieldKey] || ""}
                              onValueChange={(value) => handleInputChange(fieldKey, value)}
                              required={fieldConfig.required}
                            >
                              <SelectTrigger className="bg-black/40 border-white/20 text-white">
                                <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-white/20">
                                {fieldConfig.options?.map((option) => (
                                  <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
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
                              className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                            />
                          )}

                          {fieldConfig.type === "checkbox" && (
                            <div className="space-y-3">
                              {fieldConfig.options?.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${fieldKey}-${option}`}
                                    checked={formData[fieldKey]?.includes(option) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(fieldKey, option, checked as boolean)}
                                    className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                  />
                                  <label htmlFor={`${fieldKey}-${option}`} className="text-sm text-gray-300">
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="pt-6">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-white text-black hover:bg-gray-200 py-3 text-lg font-semibold"
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
    </>
  )
}
