"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleNavbar from "../components/SimpleNavbar"

// FAQ data organized by categories
type FAQCategory = keyof typeof faqData;

const faqData = {
  products: [
    {
      question: "What types of fragrances do you offer?",
      answer:
        "We offer a wide range of fragrances including eau de parfum, eau de toilette, and body mists. Our collections include floral, woody, oriental, fresh, and citrus scent families to suit different preferences and occasions.",
    },
    {
      question: "How long do your fragrances last?",
      answer:
        "The longevity of our fragrances varies by concentration. Our eau de parfum typically lasts 6-8 hours, eau de toilette lasts 4-6 hours, and body mists last 2-3 hours. Factors like skin type, climate, and application method can also affect longevity.",
    },
    {
      question: "Are your products tested on animals?",
      answer:
        "No, Vave is proud to be a cruelty-free brand. We do not test our products on animals, nor do we work with suppliers who conduct animal testing. We're certified by PETA as a cruelty-free company.",
    },
    {
      question: "What ingredients do you use in your fragrances?",
      answer:
        "We use a combination of natural and synthetic ingredients to create our fragrances. All ingredients are carefully selected for quality and safety, and comply with international fragrance regulations. A full ingredient list is available on each product page.",
    },
    {
      question: "Do you offer samples of your fragrances?",
      answer:
        "Yes, we offer sample sets that allow you to try multiple fragrances before committing to a full-size bottle. You can also request samples with your order, and we occasionally include complimentary samples with purchases.",
    },
  ],
  orders: [
    {
      question: "How do I place an order?",
      answer:
        "You can place an order through our website by browsing our collections, selecting the products you want, and proceeding to checkout. You'll need to create an account or check out as a guest, provide shipping information, and complete payment.",
    },
    {
      question: "Can I modify or cancel my order after it's placed?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it, provided it hasn't been processed yet. Please contact our customer service team immediately with your order number if you need to make changes.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards (Visa, Mastercard, American Express), UPI payments, net banking, and popular wallets like Paytm and PhonePe. We also offer Cash on Delivery for orders under ₹5000.",
    },
    {
      question: "Is it safe to use my credit card on your website?",
      answer:
        "Yes, our website uses industry-standard SSL encryption to protect your personal and payment information. We are PCI DSS compliant and never store your full credit card details on our servers.",
    },
    {
      question: "Do you offer gift wrapping?",
      answer:
        "Yes, we offer premium gift wrapping services for an additional ₹99. You can select this option during checkout and include a personalized message for the recipient.",
    },
  ],
  shipping: [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 3-5 business days within India. Express shipping takes 1-2 business days, and same-day delivery is available in select cities for orders placed before 12 PM. International shipping times vary by destination.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we ship to all locations within India. For international shipping, please contact our customer service team to discuss options and shipping costs.",
    },
    {
      question: "Is shipping free?",
      answer:
        "We offer free standard shipping on all orders above ₹1000. For orders below this amount, a shipping fee of ₹99 applies. Express shipping and same-day delivery have additional charges regardless of order value.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section.",
    },
    {
      question: "What if my package is damaged during shipping?",
      answer:
        "If you receive a damaged package, please contact our customer service team within 48 hours of delivery with photos of the damaged item and packaging. We'll arrange for a replacement or refund as soon as possible.",
    },
  ],
  returns: [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in their original packaging. Returns must include the original receipt or proof of purchase. Please note that shipping charges are non-refundable unless the return is due to our error.",
    },
    {
      question: "How do I initiate a return?",
      answer:
        "To initiate a return, log in to your account, go to 'My Orders,' select the order containing the item(s) you wish to return, and click on 'Return Items.' Follow the prompts to complete the return process.",
    },
    {
      question: "How long does it take to process a refund?",
      answer:
        "Once we receive your return, our team will inspect the item(s) to ensure they meet our return conditions. Refunds will be processed within 5-7 business days after inspection and will be issued to the original payment method.",
    },
    {
      question: "Can I exchange an item instead of returning it?",
      answer:
        "Yes, you can request an exchange during the return process. If the exchange item is of higher value, you'll need to pay the difference. If it's of lower value, we'll refund the difference to your original payment method.",
    },
    {
      question: "Can I return a gift?",
      answer:
        "Yes, gifts can be returned with a gift receipt within 30 days of the purchase date. Returns with gift receipts will be issued as store credit at the current selling price. The gift giver will not be notified of the return.",
    },
  ],
  account: [
    {
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking on the 'Sign Up' or 'Create Account' button on our website. You'll need to provide your name, email address, and create a password. You can also sign up using your Google or Facebook account.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to reset your password. The link is valid for 24 hours.",
    },
    {
      question: "Can I update my account information?",
      answer:
        "Yes, you can update your account information by logging in and navigating to the 'My Account' or 'Profile' section. Here, you can update your name, email, password, and saved addresses.",
    },
    {
      question: "How can I view my order history?",
      answer:
        "You can view your order history by logging into your account and navigating to the 'My Orders' section. Here, you'll find details of all your past orders, including order status, items purchased, and tracking information.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take data security seriously. We use industry-standard encryption to protect your personal information and never share your data with third parties without your consent. You can review our Privacy Policy for more details.",
    },
  ],
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ category: string; question: string; answer: string }[]>([])
  const [activeTab, setActiveTab] = useState<FAQCategory | "all">("all")

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: { category: string; question: string; answer: string }[] = []

    Object.entries(faqData).forEach(([category, questions]) => {
      questions.forEach(({ question, answer }) => {
        if (question.toLowerCase().includes(query) || answer.toLowerCase().includes(query)) {
          results.push({ category, question, answer })
        }
      })
    })

    setSearchResults(results)
  }

  // Get FAQs based on active tab
  const getActiveFAQs = () => {
    if (activeTab === "all") {
      return Object.entries(faqData).flatMap(([category, questions]) => questions.map((q) => ({ ...q, category })))
    }

    return faqData[activeTab as FAQCategory]?.map((q) => ({ ...q, category: activeTab })) || []
  }

  // Display search results or active tab FAQs
  const displayFAQs = searchQuery && searchResults.length > 0 ? searchResults : getActiveFAQs()

  return (
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-white/20">
      <SimpleNavbar />
      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Support</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Frequently Asked Questions</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-8 text-lg rounded-none bg-zinc-900/40 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/30 focus:ring-1 focus:ring-white/30 h-16 w-full"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-6 w-6" />
              <Button type="submit" variant="outline" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black hover:bg-gray-200 border-none rounded-none h-12 px-8">
                Search
              </Button>
            </form>
          </div>

          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Search Results</h2>
              <p className="text-white/50 font-light mb-6">
                Found {searchResults.length} results for "{searchQuery}"
              </p>

              <Accordion type="single" collapsible className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-lg shadow-sm">
                {searchResults.map((result, index) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger className="px-6">
                      <div className="text-left">
                        <div className="text-sm text-white/40 tracking-widest mb-1 capitalize">{result.category}</div>
                        {result.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-white/70 font-light leading-relaxed">{result.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* No Search Results */}
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center mb-12 p-8 bg-zinc-900/30 border border-white/5 rounded-lg">
              <h2 className="text-2xl font-serif text-white tracking-wide mb-2">No Results Found</h2>
              <p className="text-white/50 font-light mb-6">
                We couldn't find any results for "{searchQuery}". Please try a different search term or browse our FAQ
                categories below.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* FAQ Categories */}
          {(!searchQuery || searchResults.length === 0) && (
            <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as FAQCategory)}>
              <TabsList className="w-full grid grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <Accordion type="single" collapsible className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-lg shadow-sm">
                  {displayFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="px-6">
                        {activeTab === "all" && (
                          <div className="text-left">
                            <div className="text-sm text-white/40 tracking-widest mb-1 capitalize">{faq.category}</div>
                            {faq.question}
                          </div>
                        )}
                        {activeTab !== "all" && faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-white/70 font-light leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          )}

          {/* Still Need Help */}
         
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
