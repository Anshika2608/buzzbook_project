"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Location from '@/components/modals/Location'
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/context/AuthContext"
import { useLocation } from "@/app/context/LocationContext"



export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { city, movies } = useLocation()


  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between pb-6 pt-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/LogoF.png"
              alt="BuzzBook Logo"
              width={102}
              height={56}
              className="h-16 w-auto"
            />
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium text-base">
              Home
            </Link>
            <Link href={`/movies/${city}`} className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-base">
              Movies
            </Link>
            <Link href="/events" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 font-medium text-base">
              Events
            </Link>
          </nav>

          {/* Right Side: Location + Login */}
          <div className="hidden lg:flex items-center space-x-4">
  <Location />

  {!user ? (
    <Link href="/login">
      <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-base font-medium">
        Login
      </Button>
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold">
          {user.name?.charAt(0).toUpperCase()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-black text-white border border-gray-700">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/bookings" className="cursor-pointer">My Bookings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-red-400"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
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
              <Link href={`/movies/${city}`} className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium">
                Movies
              </Link>
              <Link href="/events" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 py-2 text-sm font-medium">
                Events
              </Link>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
  <Location />

  {!user ? (
    <Link href="/login">
      <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-sm font-medium">
        Login
      </Button>
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold">
          {user.name?.charAt(0).toUpperCase()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-black text-white border border-gray-700">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/bookings" className="cursor-pointer">My Bookings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-red-400"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
</div>

            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
