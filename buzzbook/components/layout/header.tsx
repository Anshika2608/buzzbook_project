"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 rounded-md">
              <span className="text-white font-bold text-lg">BUZZ</span>
            </div>
            <span className="text-white font-light text-lg tracking-wide">BOOK</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              Home
            </Link>
            <Link
              href="/showtimes"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              Showtimes
            </Link>
            <Link
              href="/theaters"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              Our Theatre
            </Link>
            <Link
              href="/store"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              Store
            </Link>
            <Link
              href="/about"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              Contact
            </Link>
            <Link
              href="/signin"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-sm"
            >
              Sign In
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button className="bg-transparent border border-gray-500/60 text-white hover:bg-purple-600 hover:border-purple-600 transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium">
              Join
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 bg-black/95 backdrop-blur-md rounded-lg mt-2 border border-gray-800/50">
            <nav className="flex flex-col space-y-4 px-6">
              <Link
                href="/"
                className="text-white hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/showtimes"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                Showtimes
              </Link>
              <Link
                href="/theaters"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                Our Theatre
              </Link>
              <Link
                href="/store"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                Store
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                Contact
              </Link>
              <Link
                href="/signin"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-700/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button className="bg-transparent border border-gray-500/60 text-white hover:bg-purple-600 
                hover:border-purple-600 transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium">
                  Join
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
