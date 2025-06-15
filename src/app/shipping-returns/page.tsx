"use client"

import { motion } from "framer-motion"
import { Truck, RotateCcw, Clock, HelpCircle } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export default function ShippingReturnsPage() {
  const shippingRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const returnRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8">Shipping & Returns</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-accent mr-4" />
                <h2 className="text-2xl font-bold">Shipping</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We want to ensure your Vave fragrances reach you quickly and safely. Here's everything you need to know
                about our shipping process.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => scrollToSection(shippingRef)}
              >
                View Shipping Details
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <RotateCcw className="h-8 w-8 text-accent mr-4" />
                <h2 className="text-2xl font-bold">Returns</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Not completely satisfied with your purchase? Our hassle-free return policy makes it easy to return or
                exchange your items.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => scrollToSection(returnRef)}
              >
                View Return Policy
              </Button>
            </div>
          </div>

          <section id="shipping" ref={shippingRef} className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Shipping Information</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-4">Shipping Methods & Timeframes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Delivery Time</th>
                      <th className="text-left py-3 px-4">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">Within City</td>
                      <td className="py-3 px-4">2-3 business days</td>
                      <td className="py-3 px-4">₹49 - ₹99</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Outside City</td>
                      <td className="py-3 px-4">4-7 business days</td>
                      <td className="py-3 px-4">₹99 - ₹199 (Based on distance)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6">Order Processing Time</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Orders are typically processed within 24 hours of being placed. During sale periods or holidays,
                    processing may take up to 48 hours. You'll receive a confirmation email once your order has been
                    shipped with tracking information.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="px-6">Shipping Restrictions</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Due to the alcohol content in our fragrances, there are some shipping restrictions. We currently
                    ship to all locations within India. For international shipping, please contact our customer service
                    team.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="px-6">Order Tracking</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Once your order ships, you'll receive a tracking number via email. You can also track your order by
                    logging into your account and visiting the "My Orders" section. Our tracking system provides
                    real-time updates on your package's location and estimated delivery date.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="px-6">Shipping Carriers</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    We partner with reliable shipping carriers including BlueDart, DTDC, and Delhivery to ensure your
                    fragrances arrive safely and on time. The carrier for your order will be selected based on your
                    location and the shipping method you choose.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator className="my-12" />

          <section id="returns" ref={returnRef} className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Return Policy</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-accent mr-3" />
                <h3 className="text-xl font-bold">Important Return Information</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Due to the nature of fragrances and for hygiene reasons, we have a strict return policy. Returns are only accepted in the following cases:
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Returns Are Only Accepted If:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>The product received is damaged or defective</li>
                  <li>You received a different product than what was ordered</li>
                  <li>The seal is unbroken and the package is completely unopened</li>
                </ul>
                
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    Please Note: We cannot accept returns of opened or used fragrances for hygiene and safety reasons. 
                    Make sure to check your order carefully upon receipt.
                  </p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6">How to Report a Problem</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Contact customer service within 48 hours of delivery</li>
                    <li>Provide your order number and clear photos of the issue</li>
                    <li>Our team will review your case within 24 hours</li>
                    <li>If approved, we'll provide return shipping instructions or replacement details</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="px-6">Refund Process for Valid Returns</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    For valid returns (damaged, wrong item, or unopened products), refunds will be processed within 5-7 
                    business days after we receive and verify the returned item. The refund will be issued to the 
                    original payment method used for the purchase.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="faq" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6">Do you ship internationally?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Currently, we ship to all locations within India. For international shipping, please contact our
                    customer service team at support@Vave.com to discuss options and shipping costs.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="px-6">
                  Can I change my shipping address after placing an order?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    If your order hasn't been processed yet, we may be able to change the shipping address. Please
                    contact our customer service team immediately with your order number and the new shipping address.
                    Once an order has been shipped, we cannot change the delivery address.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="px-6">What if I'm not home when my package is delivered?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Our shipping partners typically make two delivery attempts. If you're not available, they'll leave a
                    delivery notice with instructions on how to reschedule delivery or pick up your package from their
                    local facility. You can also use the tracking information to manage delivery preferences.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="px-6">Can I return a gift?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Due to our strict return policy on fragrances, gift returns follow the same guidelines as regular returns. 
                    We can only accept returns for damaged items, wrong deliveries, or completely unopened products. 
                    Any approved returns will be issued as store credit.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="px-6">How do I track my order?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Once your order ships, you'll receive a tracking number via email. You can also track your order by
                    logging into your account and visiting the "My Orders" section. If you have any issues tracking your
                    order, please contact our customer service team.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <form action="https://formsubmit.co/vavefragrances@gmail.com" method="POST">
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_subject" value="New Product Issue Report" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Your contact number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Number</label>
                    <input
                      type="text"
                      name="order_number"
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="If applicable"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      name="product_name"
                      required
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Name of the fragrance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Size</label>
                    <select
                      name="product_size"
                      required
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    >
                      <option value="">Select size</option>
                      <option value="30ml">30ml</option>
                      <option value="50ml">50ml</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Describe the Issue</label>
                  <textarea
                    name="issue_description"
                    required
                    rows={4}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Please describe the issue you're experiencing with the product"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full">Submit Report</Button>
              </form>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
