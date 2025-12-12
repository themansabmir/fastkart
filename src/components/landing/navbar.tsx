"use client";

import { useState } from "react";
import { Menu, X, Package } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onGetQuote: () => void;
}

export function Navbar({ onGetQuote }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#tracking", label: "Tracking" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQs" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              Fast<span className="text-primary">Kart</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onGetQuote}
              className="btn-primary px-6 py-2 rounded-lg font-semibold text-sm transition-transform duration-150 active:scale-95"
            >
              Get a Quote
            </button>
            <Link
              href="/login"
              className="btn-primary px-6 py-2 rounded-lg font-semibold text-sm transition-transform duration-150 active:scale-95"
              
              >
               Login
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onGetQuote();
              }}
              className="w-full btn-primary px-6 py-3 rounded-lg font-semibold text-sm"
            >
              Get a Quote
            </button>
            <Link
              href="/login"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-center"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
