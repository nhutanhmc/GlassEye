'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="font-serif font-bold text-base text-accent">A</span>
              </div>
              <span className="font-serif font-bold text-lg text-primary-foreground">AndreaQuality</span>
            </div>
            <p className="text-primary-foreground/75 text-sm mb-6 leading-relaxed">
              Premium eyewear crafted for every style and occasion
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-5 text-primary-foreground">Shop</h4>
            <ul className="space-y-3 text-primary-foreground/75 text-sm">
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  Optical Frames
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-primary-foreground/80 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 pt-8 flex flex-col sm:flex-row justify-between items-center text-primary-foreground/70 text-sm">
          <p>&copy; 2024 AndreaQuality. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span>Secure Checkout</span>
            <span className="text-primary-foreground/50">•</span>
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
