"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Add-Destination", href: "/add-destination"},
    { name: "My Bookings", href: "/bookings" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          
          {/* Left: Navigation Links */}
          <div className="hidden md:flex space-x-8 text-[15px] text-gray-800">
            {navLinks.map((link) => {
              // Check if the current path matches the link
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[#00AEEF] font-medium" 
                      : "hover:text-[#00AEEF]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Center: Logo */}
          <div className="shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className="text-2xl font-bold text-[#00AEEF] tracking-wide"
            >
              Wanderlast
            </Link>
          </div>

          {/* Right: Auth Links */}
          <div className="flex items-center space-x-6 text-[15px] text-gray-800">
            <button className="flex items-center hover:text-[#00AEEF] transition-colors">
              <User size={16} className="mr-1.5" strokeWidth={2} />
              <span>Profile</span>
            </button>
            <Link
              href="/login"
              className="hover:text-[#00AEEF] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 hover:text-[#00AEEF] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}