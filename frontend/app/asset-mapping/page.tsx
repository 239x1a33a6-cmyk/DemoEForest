'use client';


import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';

const SatelliteViewer = dynamic(() => import('./SatelliteViewer'), {
  ssr: false,
  loading: () => <div className="h-96 lg:h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>
});
import VillageSelector from './VillageSelector';
import AssetDetection from './AssetDetection';
import MappingStats from './MappingStats';
import ClassificationResults from './ClassificationResults';
import { useTranslation } from 'react-i18next';

export default function AssetMappingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('assetMapping.title')}</h1>
          <p className="text-xl text-green-100">
            {t('assetMapping.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <VillageSelector />
          </div>

          <div className="lg:col-span-3">
            <SatelliteViewer />
          </div>
        </div>

        {/* Analysis and Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AssetDetection />
          <MappingStats />
        </div>

        {/* Classification Results */}
        <ClassificationResults />
      </div>

      <Footer />
    </div>
  );
}
