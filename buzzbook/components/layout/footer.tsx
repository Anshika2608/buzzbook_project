import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-3 py-1.5 rounded-md">
                <span className="text-white font-bold text-sm">BUZZ</span>
              </div>
              <span className="text-white font-light tracking-wide">BOOK</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">

              Your premier destination for seamless movie bookings. Experience cinema like never before with BuzzBook&rsquo;s intuitive platform.



            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Movies */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Movies</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/now-showing"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  href="/coming-soon"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link
                  href="/imax"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  IMAX Experience
                </Link>
              </li>
              <li>
                <Link
                  href="/3d-movies"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  3D Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/premieres"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Premieres
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/theaters"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Find Theaters
                </Link>
              </li>
              <li>
                <Link
                  href="/gift-cards"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link
                  href="/group-booking"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Group Booking
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/concessions"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  Concessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">1-800-BUZZBOOK</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">hello@buzzbook.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  123 Cinema Boulevard
                  <br />
                  Entertainment District
                  <br />
                  New York, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} BuzzBook. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-purple-400 transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-purple-400 transition-colors duration-200 text-sm">
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="text-gray-500 hover:text-purple-400 transition-colors duration-200 text-sm"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
