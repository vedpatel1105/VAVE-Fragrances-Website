"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import SimpleInstagramFeed from "@/src/app/components/SimpleInstagramFeed"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Check, Mail, Phone, MapPin, Clock } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Using formsubmit.co for form submission
      const response = await fetch("https://formsubmit.co/Info@vavefragrances.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _subject: `VAVE Contact Form: ${formData.subject}`,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
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
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Get In Touch</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Contact Us</h1>
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
              Have questions about our fragrances or need assistance? We're here to help. Reach out to us using the form below or through our contact information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <Card className="bg-zinc-900/40 backdrop-blur-sm border-white/5 p-8 lg:p-12">
              <h2 className="text-3xl font-serif text-white tracking-wide mb-8">Send Us a Message</h2>
            {isSubmitted ? (
              <div className="bg-white/5 border border-white/10 p-12 rounded-lg text-center">
                <div className="mx-auto w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif text-white tracking-wide mb-4">Message Sent</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed mb-8">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button 
                  className="h-12 px-8 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your mail"
                      className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Product Inquiry"
                      className="h-12 bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-[11px] uppercase tracking-widest text-white/50">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Your message here..."
                      rows={5}
                      className="bg-zinc-950/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none resize-none pt-4"
                    />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
              </form>
            )}
          </Card>

          <div className="space-y-8">
            <Card className="bg-transparent border-none shadow-none">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full mr-5">
                    <Mail className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 tracking-wide">Email</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">Info@vavefragrances.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full mr-5">
                    <Phone className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 tracking-wide">Phone</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">+91 9328701508<br/>+91 9265851446</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full mr-5">
                    <Clock className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 tracking-wide">Business Hours</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-white/40 text-sm font-light leading-relaxed">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-white/40 text-sm font-light leading-relaxed">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="w-full h-px bg-white/5 my-8"></div>

            <Card className="bg-transparent border-none shadow-none">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-8">Connect With Us</h2>
              <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
                Follow us on social media for the latest updates, promotions, and fragrance inspiration.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/vavefragrances"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Instagram Feed Section */}
        <div className="mt-32">
          <SimpleInstagramFeed />
        </div>
      </div>
      </div>
      <Footer />
    </main>
  )
}
