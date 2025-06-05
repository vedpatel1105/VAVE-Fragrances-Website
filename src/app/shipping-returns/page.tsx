"use client"

import { motion } from "framer-motion"
import { Truck, RotateCcw, Clock, HelpCircle } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function ShippingReturnsPage() {
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
              <Button variant="outline" className="w-full">
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
              <Button variant="outline" className="w-full">
                View Return Policy
              </Button>
            </div>
          </div>

          <section id="shipping" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Shipping Information</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-4">Shipping Methods & Timeframes</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Shipping Method</th>
                      <th className="text-left py-3 px-4">Estimated Delivery</th>
                      <th className="text-left py-3 px-4">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">Standard Shipping</td>
                      <td className="py-3 px-4">3-5 business days</td>
                      <td className="py-3 px-4">₹99 (Free on orders above ₹1000)</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">Express Shipping</td>
                      <td className="py-3 px-4">1-2 business days</td>
                      <td className="py-3 px-4">₹199</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Same Day Delivery</td>
                      <td className="py-3 px-4">Same day (order before 12 PM)</td>
                      <td className="py-3 px-4">₹299 (Available in select cities)</td>
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

          <section id="returns" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Return Policy</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-accent mr-3" />
                <h3 className="text-xl font-bold">30-Day Return Policy</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, you can
                return it within 30 days of delivery for a full refund or exchange.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Return Conditions:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Items must be unused and in their original packaging</li>
                  <li>Seal must be intact for fragrances</li>
                  <li>Original receipt or proof of purchase required</li>
                  <li>Gift receipts are valid for returns (store credit only)</li>
                </ul>
              </div>
            </div>

            <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6">How to Initiate a Return</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Log in to your account and go to "My Orders"</li>
                    <li>Select the order containing the item(s) you wish to return</li>
                    <li>Click on "Return Items" and follow the prompts</li>
                    <li>Print the return shipping label (if applicable)</li>
                    <li>Package the item(s) securely with all original packaging</li>
                    <li>Attach the return shipping label and drop off at the nearest courier location</li>
                  </ol>
                  <p className="mt-4">
                    Alternatively, you can contact our customer service team at support@Vave.com or call us at
                    1-800-Vave-HELP for assistance with your return.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="px-6">Refund Process</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Once we receive your return, our team will inspect the item(s) to ensure they meet our return
                    conditions. Refunds will be processed within 5-7 business days after inspection. The refund will be
                    issued to the original payment method used for the purchase.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Please note that shipping charges are non-refundable unless the return is due to our error (damaged
                    item, wrong item shipped, etc.).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="px-6">Exchanges</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    If you'd like to exchange an item for a different size, fragrance, or product, you can request an
                    exchange during the return process. If the exchange item is of higher value, you'll need to pay the
                    difference. If it's of lower value, we'll refund the difference to your original payment method.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="px-6">Damaged or Defective Items</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    If you receive a damaged or defective item, please contact our customer service team within 48 hours
                    of delivery. Please provide photos of the damaged item and packaging. We'll arrange for a
                    replacement or refund as soon as possible, and you won't be responsible for return shipping costs in
                    these cases.
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
                    Yes, gifts can be returned with a gift receipt within 30 days of the purchase date. Returns with
                    gift receipts will be issued as store credit at the current selling price. The gift giver will not
                    be notified of the return.
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

         
            
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
