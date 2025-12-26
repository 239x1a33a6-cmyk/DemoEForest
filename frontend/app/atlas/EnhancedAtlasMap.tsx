'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface AtlasMapProps {
  filters: any;
  cinematicTarget?: {
    pattaHolder: string;
    coordinates: number[][];
    state: string;
    district: string;
    village: string;
  };
  onCinematicComplete?: () => void;
  onClaimsDataUpdate?: (data: any) => void;
}

interface BoundaryData {
  type: 'state' | 'district' | 'village';
  name: string;
  coordinates: number[][];
  color: string;
  strokeWidth: number;
  fillOpacity: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Globally declare Google maps on window to avoid TS errors in client code
declare global {
  interface Window {
    google?: any;
  }
}

export {};

export default function EnhancedAtlasMap({ 
  filters, 
  cinematicTarget, 
  onCinematicComplete,
  onClaimsDataUpdate 
}: AtlasMapProps) {
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<any | null>(null);
  const [highlightedBoundaries, setHighlightedBoundaries] = useState<BoundaryData[]>([]);
  const [assetOverlays, setAssetOverlays] = useState<any[]>([]);
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [cinematicStage, setCinematicStage] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(2);
  const [currentCenter, setCurrentCenter] = useState({ lat: 20.593684, lng: 78.96288 });
  const [landParcelHighlight, setLandParcelHighlight] = useState(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const cinematicTimeoutRef = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Layer definitions
  const layers = [
    { id: 'all', name: 'All Layers', icon: 'ri-stack-line' },
    { id: 'ifr', name: 'Individual Forest Rights', icon: 'ri-user-line' },
    { id: 'cfr', name: 'Community Forest Rights', icon: 'ri-group-line' },
    { id: 'cfres', name: 'Community Forest Resources', icon: 'ri-plant-line' },
    { id: 'villages', name: 'Village Boundaries', icon: 'ri-map-pin-line' }
  ];

  const mapViews = [
    { id: 'satellite', name: 'Satellite', icon: 'ri-earth-line' },
    { id: 'terrain', name: 'Terrain', icon: 'ri-mountain-line' },
    { id: 'roadmap', name: 'Road Map', icon: 'ri-map-2-line' }
  ];

  // Comprehensive coordinate database with proper bounds
  const getLocationData = (): Record<string, any> => {
    const locationDatabase: Record<string, any> = {
      // States with proper bounds
      'jharkhand': {
        center: { lat: 23.6102, lng: 85.2799 },
        zoom: 7,
        bounds: {
          north: 25.5,
          south: 21.5,
          east: 88.0,
          west: 83.0
        },
        coordinates: [
          [83.0, 25.5], [88.0, 25.5], [88.0, 21.5], [83.0, 21.5], [83.0, 25.5]
        ]
      },
      'madhyapradesh': {
        center: { lat: 22.9734, lng: 78.6569 },
        zoom: 6,
        bounds: {
          north: 26.9,
          south: 21.0,
          east: 82.8,
          west: 74.0
        },
        coordinates: [
          [74.0, 26.9], [82.8, 26.9], [82.8, 21.0], [74.0, 21.0], [74.0, 26.9]
        ]
      },
      'odisha': {
        center: { lat: 20.9517, lng: 85.0985 },
        zoom: 7,
        bounds: {
          north: 22.5,
          south: 17.8,
          east: 87.5,
          west: 81.0
        },
        coordinates: [
          [81.0, 22.5], [87.5, 22.5], [87.5, 17.8], [81.0, 17.8], [81.0, 22.5]
        ]
      },
      'tripura': {
        center: { lat: 23.9408, lng: 91.9882 },
        zoom: 8,
        bounds: {
          north: 24.5,
          south: 22.9,
          east: 92.3,
          west: 91.1
        },
        coordinates: [
          [91.1, 24.5], [92.3, 24.5], [92.3, 22.9], [91.1, 22.9], [91.1, 24.5]
        ]
      },
      'telangana': {
        center: { lat: 18.1124, lng: 79.0193 },
        zoom: 7,
        bounds: {
          north: 19.9,
          south: 15.6,
          east: 81.1,
          west: 77.0
        },
        coordinates: [
          [77.0, 19.9], [81.1, 19.9], [81.1, 15.6], [77.0, 15.6], [77.0, 19.9]
        ]
      },
      // Districts
      'Bhadradri Kothagudem': {
        center: { lat: 17.5500, lng: 80.6167 },
        zoom: 10,
        bounds: {
          north: 18.2,
          south: 17.0,
          east: 81.5,
          west: 79.5
        },
        coordinates: [
          [79.5, 18.2], [81.5, 18.2], [81.5, 17.0], [79.5, 17.0], [79.5, 18.2]
        ]
      },
      'Ranchi': {
        center: { lat: 23.3441, lng: 85.3096 },
        zoom: 10,
        bounds: {
          north: 23.8,
          south: 22.9,
          east: 85.8,
          west: 84.8
        },
        coordinates: [
          [84.8, 23.8], [85.8, 23.8], [85.8, 22.9], [84.8, 22.9], [84.8, 23.8]
        ]
      },
      // Villages
      'Kothagudem': {
        center: { lat: 17.5500, lng: 80.6167 },
        zoom: 14,
        bounds: {
          north: 17.6,
          south: 17.5,
          east: 80.7,
          west: 80.5
        },
        coordinates: [
          [80.5, 17.6], [80.7, 17.6], [80.7, 17.5], [80.5, 17.5], [80.5, 17.6]
        ]
      },
      'Angara': {
        center: { lat: 23.3800, lng: 85.1200 },
        zoom: 14,
        bounds: {
          north: 23.4,
          south: 23.36,
          east: 85.14,
          west: 85.10
        },
        coordinates: [
          [85.10, 23.4], [85.14, 23.4], [85.14, 23.36], [85.10, 23.36], [85.10, 23.4]
        ]
      }
    };

    return locationDatabase;
  };

  // Enhanced boundary highlighting function
  const highlightBoundary = (regionType: 'state' | 'district' | 'village', regionName: string) => {
    const locationData = getLocationData();
    const regionData = locationData[regionName.toLowerCase()] || locationData[regionName];
    
    if (!regionData) {
      console.warn(`No data found for ${regionType}: ${regionName}`);
      return null;
    }

    const boundary: BoundaryData = {
      type: regionType,
      name: regionName,
      coordinates: regionData.coordinates,
      color: regionType === 'state' ? '#EF4444' : regionType === 'district' ? '#3B82F6' : '#10B981',
      strokeWidth: regionType === 'state' ? 5 : regionType === 'district' ? 4 : 3,
      fillOpacity: regionType === 'state' ? 0.1 : regionType === 'district' ? 0.15 : 0.2,
      bounds: regionData.bounds
    };

    return boundary;
  };

  // Smooth zoom and pan animation
  const animateToRegion = (center: { lat: number; lng: number }, zoom: number, duration: number = 1000) => {
    if (!mapInstance) return;

    // Use Google Maps panTo and setZoom with animation
    mapInstance.panTo(center);
    mapInstance.setZoom(zoom);
    
    setCurrentCenter(center);
    setCurrentZoom(zoom);
  };

  // Generate boundaries based on current filters
  const generateBoundaries = () => {
    const boundaries: BoundaryData[] = [];
    
    // Always show state boundary if state is selected
    if (filters.state) {
      const stateBoundary = highlightBoundary('state', filters.state);
      if (stateBoundary) {
        boundaries.push(stateBoundary);
      }
    }

    // Show district boundary if district is selected
    if (filters.district) {
      const districtBoundary = highlightBoundary('district', filters.district);
      if (districtBoundary) {
        boundaries.push(districtBoundary);
      }
    }

    // Show village boundary if village is selected
    if (filters.village) {
      const villageBoundary = highlightBoundary('village', filters.village);
      if (villageBoundary) {
        boundaries.push(villageBoundary);
      }
    }

    return boundaries;
  };

  // Update claims data based on current selection
  const updateClaimsSection = (filters: any) => {
    const locationData = getLocationData();
    let claimsData = null;

    if (filters.village) {
      // Village-level data
      claimsData = {
        individualRights: Math.floor(Math.random() * 50) + 10,
        communityRights: Math.floor(Math.random() * 20) + 5,
        forestResources: Math.floor(Math.random() * 15) + 3,
        totalArea: `${Math.floor(Math.random() * 500) + 100} hectares`,
        households: Math.floor(Math.random() * 100) + 20,
        approvalRate: `${Math.floor(Math.random() * 30) + 60}%`,
        level: 'village',
        location: filters.village
      };
    } else if (filters.district) {
      // District-level data
      claimsData = {
        individualRights: Math.floor(Math.random() * 5000) + 1000,
        communityRights: Math.floor(Math.random() * 2000) + 500,
        forestResources: Math.floor(Math.random() * 1500) + 300,
        totalArea: `${Math.floor(Math.random() * 50000) + 10000} hectares`,
        households: Math.floor(Math.random() * 200) + 50,
        approvalRate: `${Math.floor(Math.random() * 20) + 65}%`,
        level: 'district',
        location: filters.district
      };
    } else if (filters.state) {
      // State-level data
      claimsData = {
        individualRights: Math.floor(Math.random() * 50000) + 10000,
        communityRights: Math.floor(Math.random() * 20000) + 5000,
        forestResources: Math.floor(Math.random() * 15000) + 3000,
        totalArea: `${Math.floor(Math.random() * 500000) + 100000} hectares`,
        households: Math.floor(Math.random() * 1000) + 200,
        approvalRate: `${Math.floor(Math.random() * 15) + 70}%`,
        level: 'state',
        location: filters.state
      };
    }

    if (claimsData && onClaimsDataUpdate) {
      onClaimsDataUpdate(claimsData);
    }

    return claimsData;
  };

  // Handle filter changes with smooth animations
  useEffect(() => {
    const boundaries = generateBoundaries();
    setHighlightedBoundaries(boundaries);

    // Update claims data
    const claimsData = updateClaimsSection(filters);

    // Animate to the most specific region
    const locationData = getLocationData();
    let targetLocation = null;

    if (filters.village) {
      targetLocation = locationData[filters.village] || locationData['Kothagudem'];
    } else if (filters.district) {
      targetLocation = locationData[filters.district] || locationData['Bhadradri Kothagudem'];
    } else if (filters.state) {
      targetLocation = locationData[filters.state.toLowerCase()] || locationData['telangana'];
    }

    if (targetLocation) {
      // Add a small delay for smooth animation
      setTimeout(() => {
        animateToRegion(targetLocation.center, targetLocation.zoom, 1500);
      }, 100);
    }

    // Show popup for claims data
    if (claimsData) {
      setPopupData(claimsData);
      setShowPopup(true);
    } else {
      setShowPopup(false);
      setPopupData(null);
    }
  }, [filters, mapInstance]);

  // Initialize map when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.593684, lng: 78.96288 },
        zoom: 5,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      setMapInstance(map);
      setIsMapLoaded(true);
    }
  }, []);

  const getMapUrl = () => {
    const coordinates = getLocationData();
    let targetLocation = null;

    if (filters.village) {
      targetLocation = coordinates[filters.village] || coordinates['Kothagudem'];
    } else if (filters.district) {
      targetLocation = coordinates[filters.district] || coordinates['Bhadradri Kothagudem'];
    } else if (filters.state) {
      targetLocation = coordinates[filters.state.toLowerCase()] || coordinates['telangana'];
    } else {
      targetLocation = { center: { lat: 20.593684, lng: 78.96288 }, zoom: 5 };
    }

    let mapType = 'roadmap';
    if (mapView === 'satellite') {
      mapType = 'satellite';
    } else if (mapView === 'terrain') {
      mapType = 'terrain';
    }

    return `https://maps.google.com/maps?q=${targetLocation.center.lat},${targetLocation.center.lng}&t=${mapType}&z=${targetLocation.zoom}&output=embed`;
  };

  const getStateName = (stateKey: string) => {
    const stateNames = {
      'jharkhand': 'Jharkhand',
      'madhyapradesh': 'Madhya Pradesh',
      'odisha': 'Odisha',
      'tripura': 'Tripura',
      'telangana': 'Telangana'
    };
    return stateNames[stateKey] || stateKey;
  };

  const layerData = {
    title: 'All Layers',
    description: 'Complete view of all FRA data layers',
    color: 'text-gray-600',
    icon: 'ri-stack-line'
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Layer Filters */}
          <div className="flex flex-wrap gap-2 flex-1">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedLayer === layer.id
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={layer.icon}></i>
                  </div>
                  {layer.name}
                </div>
              </button>
            ))}
          </div>

          {/* Map View Controls */}
          <div className="flex gap-2">
            {mapViews.map((view) => (
              <button
                key={view.id}
                onClick={() => setMapView(view.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  mapView === view.id
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={view.icon}></i>
                  </div>
                  {view.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Layer Info */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 flex items-center justify-center ${layerData.color}`}>
              <i className={layerData.icon}></i>
            </div>
            <div>
              <div className="font-medium text-gray-900">{layerData.title}</div>
              <div className="text-sm text-gray-600">{layerData.description}</div>
            </div>
          </div>
        </div>

        {/* Boundary Highlight Status */}
        {highlightedBoundaries.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-focus-3-line text-blue-600"></i>
              </div>
              <div>
                <div className="font-medium text-blue-900">Area Highlighted</div>
                <div className="text-sm text-blue-700">
                  {highlightedBoundaries.map(b => b.name).join(', ')} boundaries are now visible on the map
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className={`relative bg-gray-50 ${isFullscreen ? 'h-screen' : 'h-96 lg:h-[600px]'}`}>
        <div className="relative w-full h-full">
          <iframe
            src={getMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="FRA Atlas Map"
            key={`${currentCenter.lat}-${currentCenter.lng}-${currentZoom}-${mapView}`}
          ></iframe>

          {/* Enhanced Boundary Overlay */}
          {highlightedBoundaries.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {highlightedBoundaries.map((boundary, index) => {
                  const centerX = 50;
                  const centerY = 50;
                  const size = boundary.type === 'village' ? 8 : boundary.type === 'district' ? 15 : 25;

                  const pathData = `M ${centerX - size} ${centerY - size} L ${centerX + size} ${centerY - size} L ${centerX + size} ${centerY + size} L ${centerX - size} ${centerY + size} Z`;

                  return (
                    <g key={index}>
                      {/* Outer glow effect */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={boundary.color}
                        strokeWidth={(boundary.strokeWidth / 10) + 1}
                        strokeOpacity="0.3"
                        className="animate-pulse"
                      />
                      {/* Main boundary */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={boundary.color}
                        strokeWidth={boundary.strokeWidth / 10}
                        strokeDasharray="3,2"
                        className="animate-pulse"
                      />
                      {/* Filled area */}
                      <path
                        d={pathData}
                        fill={boundary.color}
                        fillOpacity={boundary.fillOpacity}
                      />
                      {/* Boundary label */}
                      <text
                        x={centerX}
                        y={centerY - size - 2}
                        textAnchor="middle"
                        className="text-xs fill-gray-800 font-medium"
                        style={{ fontSize: '8px' }}
                      >
                        {boundary.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Location Marker */}
          {(filters.state || filters.district || filters.village) && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-map-pin-fill text-white"></i>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/75 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {filters.village ? `${filters.village} Village` :
                    filters.district ? `${filters.district} District` :
                      getStateName(filters.state)}
                </div>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={isFullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"}></i>
              </div>
            </button>
            <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-download-line text-gray-700"></i>
              </div>
            </button>
            <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-share-line text-gray-700"></i>
              </div>
            </button>
            <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-refresh-line text-gray-700"></i>
              </div>
            </button>
          </div>
        </div>

        {/* Claims Data Popup */}
        {showPopup && popupData && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{popupData.location}</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-close-line"></i>
                </div>
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{popupData.individualRights}</div>
                  <div className="text-xs text-blue-700">Individual Rights</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{popupData.communityRights}</div>
                  <div className="text-xs text-green-700">Community Rights</div>
                </div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{popupData.forestResources}</div>
                <div className="text-xs text-purple-700">Forest Resources</div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Area:</span>
                  <span className="font-medium">{popupData.totalArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Households:</span>
                  <span className="font-medium">{popupData.households}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Rate:</span>
                  <span className="font-medium text-green-600">{popupData.approvalRate}</span>
                </div>
              </div>

              <Link href="/asset-mapping" className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap inline-block text-center">
                View Detailed Report
              </Link>
            </div>
          </div>
        )}

        {/* Layer Legend */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-medium text-gray-900 mb-3">Active Layer</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-4 h-4 flex items-center justify-center ${layerData.color}`}>
              <i className={layerData.icon}></i>
            </div>
            <span className="text-sm font-medium">{layerData.title}</span>
          </div>
          <div className="text-xs text-gray-600 mb-3">{layerData.description}</div>

          {highlightedBoundaries.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-2">Highlighted Boundaries</div>
              {highlightedBoundaries.map((boundary, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 border-2 rounded-sm animate-pulse"
                    style={{ borderColor: boundary.color, backgroundColor: `${boundary.color}20` }}
                  ></div>
                  <span className="text-xs text-gray-600">{boundary.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      {!isFullscreen && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Map View: <strong>{mapViews.find(v => v.id === mapView)?.name}</strong></span>
                <span>Active Layer: <strong>{layerData.title}</strong></span>
                {filters.state && <span>State: <strong>{getStateName(filters.state)}</strong></span>}
                {filters.district && <span>District: <strong>{filters.district}</strong></span>}
                {filters.village && <span>Village: <strong>{filters.village}</strong></span>}
                {highlightedBoundaries.length > 0 && (
                  <span className="text-blue-600">
                    <strong>{highlightedBoundaries.length} boundary highlighted</strong>
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real-time Data • Exact Coordinates
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
