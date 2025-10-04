"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using VAVE Fragrances' website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Product Information</h2>
          <p className="mb-2">We strive to provide accurate product descriptions, images, and pricing information. However:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>All fragrances and products are subject to availability</li>
            <li>Product images are representative but may vary slightly from actual products</li>
            <li>We reserve the right to modify or discontinue products without prior notice</li>
            <li>Prices are subject to change without notice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Account Registration</h2>
          <p className="mb-2">When creating an account, you agree to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized account access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Ordering and Payment</h2>
          <p className="mb-2">By placing an order, you agree that:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Orders are subject to acceptance and availability</li>
            <li>Payment must be made in full at the time of purchase</li>
            <li>We accept payments through various methods supported by Razorpay, including:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Credit Cards (Visa, MasterCard, American Express)</li>
                <li>Debit Cards</li>
                <li>Net Banking</li>
                <li>UPI</li>
                <li>Popular Wallets</li>
              </ul>
            </li>
            <li>All payments are processed securely through Razorpay</li>
            <li>Transaction charges, if any, will be clearly displayed before payment</li>
            <li>Prices are inclusive of applicable taxes</li>
            <li>Failed transactions will be automatically refunded within 5-7 working days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Shipping and Delivery</h2>
          <p className="mb-2">Our shipping policy includes:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Free shipping on orders over ₹999</li>
            <li>Standard delivery within 3-5 business days</li>
            <li>Express delivery options available at additional cost</li>
            <li>Delivery times may vary based on location and circumstances</li>
            <li>Risk of loss transfers upon delivery to the carrier</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Returns and Refunds</h2>
          <p className="mb-2">Our return policy is limited to cases where the issue is from our side. Returns and refunds will only be accepted under the following conditions:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Product is delivered in a damaged or defective condition</li>
            <li>Wrong product is delivered</li>
            <li>Product has quality issues attributable to us</li>
          </ul>
          <p className="mb-2">Please note:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Requests for returns must be made within 7 days of delivery</li>
            <li>Products must be unused and in their original packaging</li>
            <li>Return shipping costs will be covered by us in case of eligible returns</li>
            <li>Refunds will be processed within 5-7 business days after product inspection</li>
            <li>We do not accept returns for reasons such as change of mind, personal preference, or fragrance dislike</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Intellectual Property</h2>
          <p className="mb-4">All content on this website, including text, images, logos, and designs, is the property of VAVE Fragrances and is protected by intellectual property laws. Any unauthorized use is strictly prohibited.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
          <p className="mb-4">VAVE Fragrances shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
          <p className="mb-4">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Continued use of our services constitutes acceptance of modified terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contact Information</h2>
          <p className="mb-4">For questions about these Terms of Service, please contact us at:</p>
          <ul className="list-none space-y-1">
            <li>Email: support@vavefragrances.com</li>
            <li>Phone: +91 93287 01508</li>
            <li></li>
          </ul>
        </section>

        <section className="mt-8">
          <p className="text-sm">Last Updated: October 4, 2025</p>
        </section>
      </div>
    </motion.div>
  );
}
