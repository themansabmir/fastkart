import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                Fast<span className="text-primary">Kart</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Fast, reliable courier service across India. Trusted by thousands of businesses.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors aria-label='Facebook'">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors aria-label='Twitter'">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors aria-label='Instagram'">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors aria-label='LinkedIn'">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/#how-it-works" className="text-gray-400 hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/#pricing" className="text-gray-400 hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/#tracking" className="text-gray-400 hover:text-primary transition-colors">Track Parcel</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">Prohibited Items</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                <span>Head Office: Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>support@fastkartcargo.in</span>
              </li>
            </ul>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Subscribe to Updates</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} FastKart Cargo Pvt. Ltd. All rights reserved. | Registered office: Mumbai, India</p>
          <p className="mt-2">CIN: U63000MH2020PTC123456 (Sample)</p>
        </div>
      </div>
    </footer>
  );
}
