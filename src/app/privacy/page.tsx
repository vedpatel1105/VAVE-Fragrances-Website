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
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>We collect personal information including name, email, phone number, and shipping address when you create an account or place an order.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>Your information is used to process orders, provide customer service, and send promotional materials (if opted in).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
          <p>We implement security measures to protect your personal information from unauthorized access or disclosure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Cookies and Tracking</h2>
          <p>We use cookies to improve your browsing experience and analyze website traffic.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
          <p>We may share your information with trusted third-party services for payment processing and shipping.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us for assistance.</p>
        </section>
      </div>
    </motion.div>
  );
}
