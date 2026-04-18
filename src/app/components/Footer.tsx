import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-20 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/50 mb-6">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/collection" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  All Extraits
                </Link>
              </li>
              <li>
                <Link href="/layering" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Scent Alchemy
                </Link>
              </li>
              <li>
                <Link href="/scent-finder" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Digital Sommelier
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/50 mb-6">About</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                   VAVE
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  The Craft
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/50 mb-6">Concierge</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Information
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/50 mb-6">Connect</h3>
            <div className="flex space-x-6">
              <Link
                href="https://www.facebook.com/Vavefragrances"
                className="text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook strokeWidth={1.5} className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.twitter.com/Vavefragrances"
                className="text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter strokeWidth={1.5} className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/Vavefragrances"
                className="text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram strokeWidth={1.5} className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-10">
              <p className="text-white/30 text-xs font-light leading-relaxed">
                Join our private newsletter for exclusive allocations and olfactory insights.
              </p>
              <div className="mt-4 flex">
                <input type="email" placeholder="Email Address" className="bg-transparent border border-white/10 text-white text-xs px-4 py-3 focus:outline-none focus:border-white/40 transition-colors w-full" />
                <button className="bg-white text-black px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/30 text-xs font-light">
          <p>&copy; {new Date().getFullYear()}  VAVE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <span className="text-white/10">|</span>
            <span className="font-mono tracking-widest text-[9px] uppercase">Designed in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
