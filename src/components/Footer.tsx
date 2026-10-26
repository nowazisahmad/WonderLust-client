import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-6 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
          {/* Left Column (Brand & Newsletter) */}
          <div className="max-w-md w-full">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Wanderlast
            </h2>
            <p className="text-gray-400 text-sm mb-12">
              Your gateway to extraordinary travel experiences around the world.
            </p>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-300 mb-2">
                Newsletter
              </h4>
              <p className="text-gray-500 text-xs mb-4">
                Subscribe for exclusive travel deals and inspiration.
              </p>
              
              {/* Newsletter Input */}
              <NewsletterForm />
            </div>
          </div>

          {/* Right Columns (Links) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-auto">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-300 mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/my-bookings" className="text-sm text-gray-400 hover:text-white transition-colors">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-300 mb-6">
                Support
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs uppercase tracking-widest text-gray-300 mb-6">
                Contact Us
              </h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>786 901 1622</li>
                <li>
                  <a href="mailto:info@wanderland.com" className="hover:text-white transition-colors">
                    info@wanderland.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section (Copyright & Socials) */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Wanderlust. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}