"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Location from '@/components/modals/Location'
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo1.png"
              alt="BuzzBook Logo"
              width={102}
              height={56}
              className="h-10 w-auto"
            />
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium text-base">
              Home
            </Link>
            <Link href="/movies" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-base">
              Movies
            </Link>
            <Link href="/showtimes" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-base">
              Showtimes
            </Link>
          </nav>

          {/* Right Side: Location + Login */}
          <div className="hidden lg:flex items-center space-x-4">
            <Location />
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-base font-medium">
                Login
              </Button>
            </Link>
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
              <Link href="/" className="text-white hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/movies" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium">
                Movies
              </Link>
              <Link href="/showtimes" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium">
                Showtimes
              </Link>

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-700/50">
                <Location />
                <Link href="/login">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-sm font-medium">
                    Login
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
