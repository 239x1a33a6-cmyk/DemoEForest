
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-800">
              FRA Atlas
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/atlas" className="text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Atlas
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Dashboard
              </Link>
              <Link href="/data-digitalization" className="text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Data Digitization
              </Link>
              <Link href="/asset-mapping" className="text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Asset Mapping
              </Link>
              <Link href="/decision-support" className="text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                DSS
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 ml-8">
            <Link href="/login" className="text-gray-700 hover:text-green-800 px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
              Login
            </Link>
            <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
              Sign Up
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-800 cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-menu-line text-xl"></i>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link href="/atlas" className="block text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Atlas
              </Link>
              <Link href="/dashboard" className="block text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Dashboard
              </Link>
              <Link href="/data-digitalization" className="block text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Data Digitization
              </Link>
              <Link href="/asset-mapping" className="block text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Asset Mapping
              </Link>
              <Link href="/decision-support" className="block text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium cursor-pointer">
                DSS
              </Link>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link href="/login" className="block text-gray-700 hover:text-green-800 px-3 py-2 text-sm font-medium cursor-pointer">
                  Login
                </Link>
                <Link href="/signup" className="block bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap mx-3 mt-2">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
