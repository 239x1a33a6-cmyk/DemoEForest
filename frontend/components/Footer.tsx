// Multilingual Global Support imported from DashboardModule
'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{t('appTitle')}</h3>
            <p className="text-gray-300 mb-6 max-w-lg">
              {t('footer.description')}
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
            <h4 className="text-lg font-semibold mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2">
              <li><Link href="/atlas" className="text-gray-300 hover:text-white cursor-pointer">{t('footer.fraAtlas')}</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white cursor-pointer">{t('footer.dashboard')}</Link></li>
              <li><Link href="/data-digitalization" className="text-gray-300 hover:text-white cursor-pointer">{t('footer.dataDigitization')}</Link></li>
              <li><Link href="/asset-mapping" className="text-gray-300 hover:text-white cursor-pointer">{t('footer.assetMapping')}</Link></li>
              <li><Link href="/decision-support" className="text-gray-300 hover:text-white cursor-pointer">{t('footer.decisionSupport')}</Link></li>
            </ul>
          </div>


        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm cursor-pointer">{t('footer.privacyPolicy')}</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm cursor-pointer">{t('footer.termsOfService')}</Link>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
