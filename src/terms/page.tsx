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
          <p>By accessing and using Vave Fragrances' services, you agree to be bound by these Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Product Information</h2>
          <p>All fragrances and products listed on our website are subject to availability. We reserve the right to modify or discontinue products without notice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Ordering and Payment</h2>
          <p>Orders are subject to acceptance and availability. Payment must be made in full at the time of purchase.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Shipping and Delivery</h2>
          <p>Delivery times may vary based on location. We are not responsible for delays outside our control.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Returns and Refunds</h2>
          <p>Returns are accepted within 30 days of purchase. Products must be unused and in original packaging.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Account Security</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>
      </div>
    </motion.div>
  );
}
