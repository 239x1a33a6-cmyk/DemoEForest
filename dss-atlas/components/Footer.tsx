
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">FRA Atlas</h3>
            <p className="text-gray-300 mb-6 max-w-lg">
              Empowering forest-dwelling communities through AI-powered digitization,
              satellite-based asset mapping, and intelligent decision support systems
              for sustainable forest management.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                <i className="ri-twitter-line text-lg"></i>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                <i className="ri-linkedin-line text-lg"></i>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                <i className="ri-github-line text-lg"></i>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/atlas" className="text-gray-300 hover:text-white cursor-pointer">FRA Atlas</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white cursor-pointer">Dashboard</Link></li>
              <li><Link href="/data-digitalization" className="text-gray-300 hover:text-white cursor-pointer">Data Digitization</Link></li>
              <li><Link href="/asset-mapping" className="text-gray-300 hover:text-white cursor-pointer">Asset Mapping</Link></li>
              <li><Link href="/decision-support" className="text-gray-300 hover:text-white cursor-pointer">Decision Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/documentation" className="text-gray-300 hover:text-white cursor-pointer">Documentation</Link></li>
              <li><Link href="/api" className="text-gray-300 hover:text-white cursor-pointer">API Reference</Link></li>
              <li><Link href="/training" className="text-gray-300 hover:text-white cursor-pointer">Training Materials</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-white cursor-pointer">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FRA Atlas. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm cursor-pointer">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm cursor-pointer">Terms of Service</Link>
              <Link href="https://readdy.ai/?origin=logo" target="_blank" className="text-gray-400 hover:text-white text-sm cursor-pointer">Made with Readdy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
