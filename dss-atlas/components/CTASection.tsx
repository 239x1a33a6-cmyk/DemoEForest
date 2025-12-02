
'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-800 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Forest Rights Management?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
          Join the digital revolution in forest administration. Access comprehensive 
          data insights, AI-powered analytics, and decision support tools designed 
          for sustainable forest management and community empowerment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-white text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap">
            Access Dashboard
          </Link>
          <Link href="/atlas" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-800 transition-colors cursor-pointer whitespace-nowrap">
            Explore Atlas
          </Link>
        </div>
      </div>
    </section>
  );
}
