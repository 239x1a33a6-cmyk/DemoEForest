
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NGOHeader() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-leaf-line text-white text-lg"></i>
              </div>
              <span className="font-['Pacifico'] text-xl text-gray-800">FRA Atlas</span>
            </Link>
            <div className="ml-8 flex items-center">
              <span className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                NGO Dashboard
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/atlas" className="text-gray-600 hover:text-purple-600 transition-colors">
              <i className="ri-map-2-line mr-1"></i>
              Atlas
            </Link>
            <Link href="/asset-mapping" className="text-gray-600 hover:text-purple-600 transition-colors">
              <i className="ri-satellite-line mr-1"></i>
              Mapping
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                  <i className="ri-user-line text-white text-sm"></i>
                </div>
                <span className="text-sm">Priya Sharma</span>
                <i className="ri-arrow-down-s-line ml-1"></i>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Priya Sharma</p>
                    <p className="text-xs text-gray-500">Green Earth NGO</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <i className="ri-user-settings-line mr-2"></i>
                    Profile Settings
                  </Link>
                  <Link href="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <i className="ri-notification-line mr-2"></i>
                    Notifications
                  </Link>
                  <div className="border-t border-gray-100 mt-1">
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <i className="ri-logout-box-line mr-2"></i>
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
