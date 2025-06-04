"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Mail, Phone, HelpCircle, FileText, Truck, RotateCcw, CreditCard, Search } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Common help topics
const helpTopics = [
  {
    id: "orders",
    title: "Orders & Shipping",
    icon: <Truck className="h-6 w-6" />,
    description: "Track your order, shipping information, and delivery details.",
    faqs: [
      {
        question: "How do I track my order?",
        answer:
          "You can track your order by logging into your account and visiting the 'My Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping typically takes 3-5 business days within India. Express shipping takes 1-2 business days, and same-day delivery is available in select cities for orders placed before 12 PM.",
      },
      {
        question: "Is shipping free?",
        answer:
          "We offer free standard shipping on all orders above ₹1000. For orders below this amount, a shipping fee of ₹99 applies.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: <RotateCcw className="h-6 w-6" />,
    description: "Learn about our return policy, refund process, and exchanges.",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for unused items in their original packaging. Returns must include the original receipt or proof of purchase.",
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
    ],
  },
  {
    id: "payments",
    title: "Payments & Billing",
    icon: <CreditCard className="h-6 w-6" />,
    description: "Information about payment methods, billing issues, and invoices.",
    faqs: [
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
        question: "How do I get an invoice for my order?",
        answer:
          "An invoice is automatically generated and sent to your email address when your order is placed. You can also download your invoice by logging into your account and visiting the 'My Orders' section.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & Usage",
    icon: <FileText className="h-6 w-6" />,
    description: "Details about our products, usage instructions, and recommendations.",
    faqs: [
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
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ topic: string; question: string; answer: string }[]>([])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: { topic: string; question: string; answer: string }[] = []

    helpTopics.forEach((topic) => {
      topic.faqs.forEach(({ question, answer }) => {
        if (question.toLowerCase().includes(query) || answer.toLowerCase().includes(query)) {
          results.push({ topic: topic.title, question, answer })
        }
      })
    })

    setSearchResults(results)
  }

  return (
    <>
      <Navbar setIsCartOpen={() => {}} />
      <main className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8">How Can We Help?</h1>

          {/* Search Bar */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </form>
          </div>

          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Search Results</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Found {searchResults.length} results for "{searchQuery}"
              </p>

              <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {searchResults.map((result, index) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger className="px-6">
                      <div className="text-left">
                        <div className="text-sm text-accent mb-1">{result.topic}</div>
                        {result.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-700 dark:text-gray-300">{result.answer}</p>
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
            <div className="text-center mb-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find any results for "{searchQuery}". Please try a different search term or browse our help
                topics below.
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

          {/* Help Topics */}
          {(!searchQuery || searchResults.length === 0) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {helpTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-accent/10 rounded-full text-accent mr-4">{topic.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold">{topic.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View {topic.title}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Tabs defaultValue="orders">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="orders">Orders & Shipping</TabsTrigger>
                  <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
                  <TabsTrigger value="payments">Payments & Billing</TabsTrigger>
                  <TabsTrigger value="products">Products & Usage</TabsTrigger>
                </TabsList>

                {helpTopics.map((topic) => (
                  <TabsContent key={topic.id} value={topic.id} className="mt-6">
                    <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      {topic.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="px-6">{faq.question}</AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}

          {/* Contact Options */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Still Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mx-auto w-fit mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Chat with our support team in real-time.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Available 9 AM - 6 PM, Monday to Saturday
                </p>
                <Button>Start Chat</Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mx-auto w-fit mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Send us an email and we'll get back to you.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Response time: Within 24 hours</p>
                <Button variant="outline">
                  <a href="mailto:support@Vave.com">support@Vave.com</a>
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mx-auto w-fit mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Phone Support</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Call us directly for immediate assistance.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Available 9 AM - 6 PM, Monday to Saturday
                </p>
                <Button variant="outline">
                  <a href="tel:+918001234567">+91 800 123 4567</a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
