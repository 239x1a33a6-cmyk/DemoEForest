
'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SatelliteViewer from './SatelliteViewer';
import VillageSelector from './VillageSelector';
import AssetDetection from './AssetDetection';
import MappingStats from './MappingStats';
import ClassificationResults from './ClassificationResults';
import InteractiveAtlas from './InteractiveAtlas';

export default function AssetMappingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Asset Mapping</h1>
          <p className="text-xl text-green-100">
            AI-powered satellite imagery analysis for comprehensive forest and land asset mapping
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Interactive Atlas */}
        <div className="mb-8">
          <InteractiveAtlas />
        </div>

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
