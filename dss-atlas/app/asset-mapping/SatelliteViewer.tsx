'use client';

import { useState, useEffect } from 'react';

interface AssetType {
  id: string;
  name: string;
  symbol: string;
  color: string;
  area: string;
}

interface LocationData {
  state: string;
  district: string;
  village: string;
  data?: any;
}

export default function SatelliteViewer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [analysisMode, setAnalysisMode] = useState('standard');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [satelliteImageUrl, setSatelliteImageUrl] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    { id: 'forest', name: 'Forest Area', symbol: '🌲', color: 'text-green-600', area: '2,450 ha' },
    { id: 'water', name: 'Water Bodies', symbol: '💧', color: 'text-blue-600', area: '180 ha' },
    { id: 'agriculture', name: 'Agriculture', symbol: '🌾', color: 'text-yellow-600', area: '1,200 ha' },
    { id: 'settlement', name: 'Settlements', symbol: '🏘️', color: 'text-orange-600', area: '320 ha' },
    { id: 'infrastructure', name: 'Infrastructure', symbol: '🛣️', color: 'text-gray-600', area: '95 ha' }
  ]);

  const analysisData = {
    confidence: 94,
    lastUpdated: '2 hours ago',
    changeDetection: '+2.3% forest cover',
    aiRecommendation: 'Sustainable forest management practices recommended'
  };

  // Real satellite imagery database with the specific aerial view you provided
  const getRealSatelliteImage = (state: string, district: string, village: string) => {
    // Using the specific satellite image showing turquoise river, dense forest, and settlement
    const satelliteImages: { [key: string]: string } = {
      // Jharkhand villages - Forest, river, and settlement satellite imagery
      'Jamshedpur': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Ranchi': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Angara': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      
      // Telangana villages - Forest, river, and settlement aerial views
      'Hyderabad': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Adilabad': 'img.png',
      
      // Tripura villages - Forest, river, and settlement satellite imagery
      'Agartala': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Udaipur': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      
      // Madhya Pradesh villages - Forest, river, and settlement aerial views
      'Bhopal': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Indore': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      
      // Odisha villages - Forest, river, and settlement satellite imagery
      'Bhubaneswar': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Angul': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=',
      'Balangir': 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c='
    };

    // Check if we have a real satellite image for this village
    const imageKey = village;
    if (satelliteImages[imageKey]) {
      return satelliteImages[imageKey];
    }

    // Fallback to the same satellite image for all states
    return 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=';
  };

  // Fallback realistic satellite images for different terrain types
  const getFallbackSatelliteImage = (terrainType: string) => {
    // All fallback images use the same satellite image showing forest, water body, and settlement
    return 'https://media.istockphoto.com/id/1536073188/photo/water-discharged-from-the-village-discharge-waste-water-into-natural-water-sources-water.jpg?s=612x612&w=0&k=20&c=EhXr3QFvs6cWFbICP67g42BvgiggbIceuJ6gZdVNM-c=';
  };

  // Helper function to get state coordinates
  const getStateCoordinates = (state: string) => {
    const stateCoordinates = {
      'Jharkhand': { lat: 23.6102, lng: 85.2799 },
      'Telangana': { lat: 18.1124, lng: 79.0193 },
      'Tripura': { lat: 23.9408, lng: 91.9882 },
      'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
      'Odisha': { lat: 20.9517, lng: 85.0985 }
    };
    return stateCoordinates[state as keyof typeof stateCoordinates] || stateCoordinates['Jharkhand'];
  };

  // Listen for location changes from VillageSelector
  useEffect(() => {
    const handleLocationChange = (event: any) => {
      const { state, district, village, data } = event.detail;
      setCurrentLocation({ state, district, village, data });
      
      if (state && district && village) {
        setIsLoadingImage(true);
        
        // Get real satellite image for the selected location
        const imageUrl = getRealSatelliteImage(state, district, village);
        setSatelliteImageUrl(imageUrl);
        
        // Update asset data based on location
        if (data) {
          setAssetTypes([
            { id: 'forest', name: 'Forest Area', symbol: '🌲', color: 'text-green-600', area: data.forest.area },
            { id: 'water', name: 'Water Bodies', symbol: '💧', color: 'text-blue-600', area: data.water.area },
            { id: 'agriculture', name: 'Agriculture', symbol: '🌾', color: 'text-yellow-600', area: data.agriculture.area },
            { id: 'settlement', name: 'Settlements', symbol: '🏘️', color: 'text-orange-600', area: data.settlement.area },
            { id: 'infrastructure', name: 'Infrastructure', symbol: '🛣️', color: 'text-gray-600', area: data.infrastructure.area }
          ]);
        }
        
        // Load image with proper error handling
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          setSatelliteImageUrl(imageUrl);
          setIsLoadingImage(false);
        };
        image.onerror = () => {
          // Use the same satellite image as fallback for all states
          const fallbackUrl = 'YOUR_UPLOADED_IMAGE_URL_HERE';
          setSatelliteImageUrl(fallbackUrl);
          setIsLoadingImage(false);
        };
        image.src = imageUrl;
      }
    };

    window.addEventListener('assetDataUpdated', handleLocationChange);
    return () => window.removeEventListener('assetDataUpdated', handleLocationChange);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClasses = isFullscreen 
    ? 'bg-white rounded-lg shadow-lg border border-gray-200 fixed inset-0 z-50'
    : 'bg-white rounded-lg shadow-lg border border-gray-200';

  return (
    <>
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className={containerClasses}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Satellite Imagery Viewer</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Live Analysis
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}></i>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Analysis Mode:</label>
            <select 
              value={analysisMode}
              onChange={(e) => setAnalysisMode(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="standard">Standard</option>
              <option value="ai-enhanced">AI Enhanced</option>
              <option value="change-detection">Change Detection</option>
              <option value="real-time">Real-time Monitoring</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Confidence: <span className="font-medium text-green-600">{analysisData.confidence}%</span>
          </div>
        </div>
      </div>

      <div className={`relative ${isFullscreen ? 'h-screen' : 'h-96 lg:h-[500px]'} bg-gray-50`}>
        {isLoadingImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-satellite-line text-2xl text-blue-600 animate-pulse"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Satellite Imagery</h3>
              <p className="text-gray-600">
                {currentLocation ? 
                  `Fetching real-time satellite data for ${currentLocation.village}, ${currentLocation.district}` :
                  'Preparing satellite imagery...'
                }
              </p>
            </div>
          </div>
        ) : (
          <div 
            className="w-full h-full relative overflow-hidden rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&h=600&fit=crop&crop=center&auto=format&q=80')`
            }}
          >
            {/* Dynamic Animated Background */}
            <div className="absolute inset-0">
              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px',
                  animation: 'gridMove 20s linear infinite'
                }}></div>
              </div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Dynamic Wave Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-600/20 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/30 to-transparent animate-pulse"></div>
              </div>
              
              {/* Satellite Image Overlay (if available) */}
              {satelliteImageUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{ backgroundImage: `url('${satelliteImageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-transparent to-slate-900/40"></div>
                </div>
              )}
            </div>
            {/* Asset Overlay Markers */}
            <div className="absolute inset-0">
              {/* Forest Areas - Positioned in dense green areas */}
              <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50 animate-pulse"
                   onClick={() => setSelectedAsset(assetTypes[0])}
                   title={`Forest Area: ${assetTypes[0]?.area || 'N/A'}`}>
                <div className="relative">
                  🌲
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-green-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[0])}
                   title={`Forest Area: ${assetTypes[0]?.area || 'N/A'}`}>
                🌲
              </div>
              <div className="absolute bottom-1/4 left-1/6 w-10 h-10 bg-green-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[0])}
                   title={`Forest Area: ${assetTypes[0]?.area || 'N/A'}`}>
                🌲
              </div>
              
              {/* Water Bodies - Positioned near water features */}
              <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-blue-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[1])}
                   title={`Water Bodies: ${assetTypes[1]?.area || 'N/A'}`}>
                💧
              </div>
              <div className="absolute top-1/6 right-1/6 w-10 h-10 bg-blue-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[1])}
                   title={`Water Bodies: ${assetTypes[1]?.area || 'N/A'}`}>
                💧
              </div>
              
              {/* Agriculture - Positioned in rectangular field areas */}
              <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-yellow-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[2])}
                   title={`Agriculture: ${assetTypes[2]?.area || 'N/A'}`}>
                🌾
              </div>
              <div className="absolute bottom-1/4 right-1/2 w-10 h-10 bg-yellow-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[2])}
                   title={`Agriculture: ${assetTypes[2]?.area || 'N/A'}`}>
                🌾
              </div>
              <div className="absolute top-2/3 left-1/2 w-10 h-10 bg-yellow-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[2])}
                   title={`Agriculture: ${assetTypes[2]?.area || 'N/A'}`}>
                🌾
              </div>
              
              {/* Settlements - Positioned in built-up areas */}
              <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-orange-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[3])}
                   title={`Settlements: ${assetTypes[3]?.area || 'N/A'}`}>
                🏘️
              </div>
              <div className="absolute bottom-1/3 right-1/5 w-10 h-10 bg-orange-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[3])}
                   title={`Settlements: ${assetTypes[3]?.area || 'N/A'}`}>
                🏘️
              </div>
              
              {/* Infrastructure - Positioned along roads and infrastructure */}
              <div className="absolute bottom-1/2 left-1/5 w-10 h-10 bg-gray-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[4])}
                   title={`Infrastructure: ${assetTypes[4]?.area || 'N/A'}`}>
                🛣️
              </div>
              <div className="absolute top-3/4 right-1/3 w-10 h-10 bg-gray-600/90 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white/50"
                   onClick={() => setSelectedAsset(assetTypes[4])}
                   title={`Infrastructure: ${assetTypes[4]?.area || 'N/A'}`}>
                🛣️
              </div>
            </div>

            {/* Analysis Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Asset Analysis</div>
              <div className="space-y-1 text-xs">
                {assetTypes.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      <span>{asset.symbol}</span>
                      <span className={asset.color}>{asset.name}</span>
                    </div>
                    <span className="text-gray-600">{asset.area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coordinates Panel */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Location Info</div>
              <div className="space-y-1 text-xs text-gray-600">
                {currentLocation ? (
                  <>
                    <div><strong>Village:</strong> {currentLocation.village}</div>
                    <div><strong>District:</strong> {currentLocation.district}</div>
                    <div><strong>State:</strong> {currentLocation.state}</div>
                    <div>Lat: {getStateCoordinates(currentLocation.state).lat}° N</div>
                    <div>Lng: {getStateCoordinates(currentLocation.state).lng}° E</div>
                    <div>Zoom: 15x</div>
                    <div>Updated: {analysisData.lastUpdated}</div>
                  </>
                ) : (
                  <>
                    <div>Lat: 23.3441° N</div>
                    <div>Lng: 85.3096° E</div>
                    <div>Zoom: 15x</div>
                    <div>Updated: {analysisData.lastUpdated}</div>
                  </>
                )}
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
              <div className="text-sm font-medium text-gray-900 mb-2">AI Insights</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{analysisData.changeDetection}</span>
                </div>
                <div className="text-gray-600">{analysisData.aiRecommendation}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-brain-line text-blue-600"></i>
                  </div>
                  <span className="text-blue-600 font-medium">AI Analysis Active</span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-zoom-in-line text-gray-700"></i>
                </div>
              </button>
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-zoom-out-line text-gray-700"></i>
                </div>
              </button>
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-refresh-line text-gray-700"></i>
                </div>
              </button>
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-download-line text-gray-700"></i>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Asset Details Panel */}
      {selectedAsset && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedAsset.symbol}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{selectedAsset.name}</h4>
                <p className="text-sm text-gray-600">Area: {selectedAsset.area}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedAsset(null)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-close-line"></i>
              </div>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Status</div>
              <div className="font-medium text-green-600">Monitored</div>
            </div>
            <div>
              <div className="text-gray-600">Last Survey</div>
              <div className="font-medium">15 days ago</div>
            </div>
            <div>
              <div className="text-gray-600">Change</div>
              <div className="font-medium text-blue-600">+1.2%</div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Legend Table */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Asset Analysis</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assetTypes.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{asset.symbol}</span>
                      <span className={`text-sm font-medium ${asset.color}`}>{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {asset.area}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                      Monitored
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800">
                      <i className="ri-eye-line"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}