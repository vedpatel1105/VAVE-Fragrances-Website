"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <p className="mb-6">At VAVE Fragrances, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="mb-2">We collect the following types of information:</p>
          <h3 className="text-xl font-medium mt-4 mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name and contact details</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through Razorpay)</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-4 mb-2">Account Information:</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Login credentials</li>
            <li>Purchase history</li>
            <li>Product preferences</li>
            <li>Wishlist items</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Automated Information:</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Device information</li>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Usage data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="mb-2">We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Processing and fulfilling your orders</li>
            <li>Providing customer support</li>
            <li>Personalizing your shopping experience</li>
            <li>Sending order updates and shipping notifications</li>
            <li>Marketing communications (with your consent)</li>
            <li>Improving our products and services</li>
            <li>Preventing fraud and maintaining security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
          <p className="mb-2">We implement robust security measures including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>SSL/TLS encryption for all data transmission</li>
            <li>Secure payment processing through Razorpay</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal information</li>
            <li>Employee confidentiality agreements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Cookies and Tracking</h2>
          <p className="mb-2">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Remember your preferences</li>
            <li>Maintain your shopping cart</li>
            <li>Analyze website traffic and performance</li>
            <li>Provide personalized recommendations</li>
            <li>Improve website functionality</li>
          </ul>
          <p className="mb-4">You can control cookie settings through your browser preferences.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
          <p className="mb-2">We work with trusted third-party services for:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Payment processing (Razorpay)
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment information is securely handled by Razorpay</li>
                <li>We do not store your card details or banking information</li>
                <li>Razorpay maintains PCI DSS compliance for secure transactions</li>
                <li>Razorpay may collect additional data for fraud prevention</li>
              </ul>
            </li>
            <li>Shipping and delivery</li>
            <li>Email communications</li>
            <li>Analytics and performance monitoring</li>
          </ul>
          <p className="mb-4">These partners are bound by strict confidentiality agreements and data protection requirements. For more information about how Razorpay processes your payment data, please refer to <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">Razorpay's Privacy Policy</a>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Privacy Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
            <li>Lodge a complaint with supervisory authorities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>
          <p className="mb-4">Our services are not intended for children under 13. We do not knowingly collect information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. International Data Transfers</h2>
          <p className="mb-4">Your information may be transferred and processed in countries where our service providers are located. We ensure appropriate safeguards are in place for such transfers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Privacy Policy</h2>
          <p className="mb-4">We may update this policy periodically. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contact Us</h2>
          <p className="mb-2">For privacy-related inquiries, please contact us at:</p>
          <ul className="list-none space-y-1 mb-4">
            <li>Email: info@vavefragrances.com</li>
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
