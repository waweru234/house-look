import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Cyan Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-houselook-cyan via-houselook-blue to-houselook-cyan"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/images/houselooklogo.png"
                alt="HouseLook Logo"
                width={72}
                height={72}
                className="w-16 h-16 object-contain"
              />
              <span className="text-2xl font-black tracking-wide">
                House<span className="text-houselook-cyan">Look</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Kenya's freshest house-hunting platform designed for Gen Z. Find your vibe, find your crib with HouseLook.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-houselook-cyan/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-houselook-cyan" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-houselook-cyan/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-houselook-cyan" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-houselook-cyan/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-houselook-cyan" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-houselook-cyan">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-houselook-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-400 hover:text-houselook-cyan transition-colors">
                  Browse Houses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-houselook-cyan transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-houselook-cyan transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-houselook-cyan transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-houselook-cyan">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-houselook-cyan" />
                <span className="text-gray-400">info@houselook.co.ke</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-houselook-cyan" />
                <span className="text-gray-400">0793779647</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-houselook-cyan mt-1" />
                <span className="text-gray-400">
                  Westlands Business Center
                  <br />
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} HouseLook. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-400 hover:text-houselook-cyan text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-houselook-cyan text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-gray-400 hover:text-houselook-cyan text-sm transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
