// Multilingual Global Support imported from DashboardModule
'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div
      className="relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Dense%20lush%20green%20forest%20canopy%20aerial%20view%20with%20tribal%20settlements%20visible%20in%20clearings%2C%20natural%20forest%20management%2C%20sustainable%20development%2C%20government%20policy%20implementation%2C%20traditional%20forest%20dwellers%2C%20forest%20conservation%20with%20modern%20technology%20integration%2C%20bright%20natural%20lighting%2C%20professional%20documentary%20style&width=1200&height=600&seq=fra-hero&orientation=landscape')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              {t('hero.title')}
              <span className="block text-green-200">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/atlas" className="bg-white text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap">
                {t('hero.exploreAtlas')}
              </Link>
              <Link href="/dashboard" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-800 transition-colors cursor-pointer whitespace-nowrap">
                {t('hero.viewDashboard')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
