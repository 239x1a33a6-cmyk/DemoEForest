
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TribalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/tribal-dashboard" className="text-2xl font-bold text-blue-800">
              FRA Atlas - Community Portal
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/tribal-dashboard" className="text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                My Dashboard
              </Link>
              <Link href="/atlas" className="text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Forest Atlas
              </Link>
              <Link href="/community-forum" className="text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Community Forum
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Resources
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Help & Support
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 ml-8">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-700 hover:text-blue-800 cursor-pointer"
              >
                <i className="ri-notification-line text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">FRA Application Approved</p>
                          <p className="text-xs text-gray-500">Your land claim has been approved - 1 day ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">Community Meeting</p>
                          <p className="text-xs text-gray-500">Village meeting scheduled for tomorrow - 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-blue-600"></i>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Ravi Oraon</p>
                <p className="text-gray-500">Community Member</p>
              </div>
            </div>

            <Link href="/login" className="text-gray-700 hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
              Logout
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-800 cursor-pointer"
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
              <Link href="/tribal-dashboard" className="block text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium cursor-pointer">
                My Dashboard
              </Link>
              <Link href="/atlas" className="block text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Forest Atlas
              </Link>
              <Link href="/community-forum" className="block text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Community Forum
              </Link>
              <Link href="/resources" className="block text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Resources
              </Link>
              <Link href="/support" className="block text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium cursor-pointer">
                Help & Support
              </Link>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link href="/login" className="block text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium cursor-pointer">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
