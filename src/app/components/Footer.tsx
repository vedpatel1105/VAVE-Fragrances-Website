import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif text-dark">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/collection" className="text-dark/80 hover:text-gold transition-colors">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-dark/80 hover:text-gold transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-dark/80 hover:text-gold transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif text-dark">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-dark/80 hover:text-gold transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-dark/80 hover:text-gold transition-colors">
                  Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-dark/80 hover:text-gold transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif text-dark">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-dark/80 hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-dark/80 hover:text-gold transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-dark/80 hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif text-dark">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/Vavefragrances"
                className="text-dark hover:text-gold transition-colors"
              >
                <Facebook />
              </Link>
              <Link
                href="https://www.twitter.com/Vavefragrances"
                className="text-dark hover:text-gold transition-colors"
              >
                <Twitter />
              </Link>
              <Link
                href="https://www.instagram.com/Vavefragrances"
                className="text-dark hover:text-gold transition-colors"
              >
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-dark/80">
          <p>&copy; 2025 Vave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
