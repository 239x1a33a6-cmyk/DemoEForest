'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';
import DistrictBoundaryLayer from '@/components/layers/DistrictBoundaryLayer';
import { booleanPointInPolygon, point, bbox } from '@turf/turf';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [analysisMode, setAnalysisMode] = useState('standard');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [districtPolygon, setDistrictPolygon] = useState<any>(null);

  // Leaflet refs
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    { id: 'forest', name: t('assetMapping.detection.types.forest'), symbol: '🌲', color: 'text-green-600', area: '2,450 ha' },
    { id: 'water', name: t('assetMapping.detection.types.water'), symbol: '💧', color: 'text-blue-600', area: '180 ha' },
    { id: 'agriculture', name: t('assetMapping.detection.types.agriculture'), symbol: '🌾', color: 'text-yellow-600', area: '1,200 ha' },
    { id: 'settlement', name: t('assetMapping.detection.types.settlement'), symbol: '🏘️', color: 'text-orange-600', area: '320 ha' },
    { id: 'infrastructure', name: t('assetMapping.detection.types.infrastructure'), symbol: '🛣️', color: 'text-gray-600', area: '95 ha' }
  ]);

  const analysisData = {
    confidence: 94,
    lastUpdated: t('assetMapping.viewer.daysAgo', { count: 2 }),
    changeDetection: '+2.3% forest cover',
    aiRecommendation: 'Sustainable forest management practices recommended'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on India or default location
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap Tile Layer (More reliable for testing)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Add labels overlay (optional, but good for context)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setMapInstance(map);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
  }, []);

  // Helper function to get state coordinates (fallback)
  const getStateCoordinates = (state: string) => {
    const stateCoordinates = {
      'Jharkhand': { lat: 23.6102, lng: 85.2799 },
      'Telangana': { lat: 18.1124, lng: 79.0193 },
      'Tripura': { lat: 23.9408, lng: 91.9882 },
      'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
      'Odisha': { lat: 20.9517, lng: 85.0985 }
    };
    return stateCoordinates[state as keyof typeof stateCoordinates] || { lat: 20.5937, lng: 78.9629 };
  };

  // Listen for location changes from VillageSelector
  useEffect(() => {
    const handleLocationChange = (event: any) => {
      console.log("SatelliteViewer received location update:", event.detail);
      const { state, district, village, data } = event.detail;
      setCurrentLocation({ state, district, village, data });

      if (state && district && village) {
        setIsLoadingImage(true);

        // Update asset data based on location
        if (data) {
          setAssetTypes([
            { id: 'forest', name: t('assetMapping.detection.types.forest'), symbol: '🌲', color: 'text-green-600', area: data.forest.area },
            { id: 'water', name: t('assetMapping.detection.types.water'), symbol: '💧', color: 'text-blue-600', area: data.water.area },
            { id: 'agriculture', name: t('assetMapping.detection.types.agriculture'), symbol: '🌾', color: 'text-yellow-600', area: data.agriculture.area },
            { id: 'settlement', name: t('assetMapping.detection.types.settlement'), symbol: '🏘️', color: 'text-orange-600', area: data.settlement.area },
            { id: 'infrastructure', name: t('assetMapping.detection.types.infrastructure'), symbol: '🛣️', color: 'text-gray-600', area: data.infrastructure.area }
          ]);
        }

        // Simulate loading delay for "satellite image" (map tiles loading)
        setTimeout(() => {
          setIsLoadingImage(false);
          // Note: Zooming is handled by the Boundary Layers now
        }, 1000);
      }
    };

    window.addEventListener('assetDataUpdated', handleLocationChange);
    return () => window.removeEventListener('assetDataUpdated', handleLocationChange);
  }, [t]);

  // Fetch district polygon when location changes
  useEffect(() => {
    if (!currentLocation?.state || !currentLocation?.district) {
      setDistrictPolygon(null);
      return;
    }

    console.log(`Fetching district polygon for: ${currentLocation.state} - ${currentLocation.district}`);
    fetch(`/data/new_districts/${currentLocation.state}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("District GeoJSON loaded:", data);
        const feature = data.features.find((f: any) =>
          f.properties.dtname.toLowerCase() === currentLocation.district.toLowerCase()
        );
        console.log("Found district feature:", feature);
        setDistrictPolygon(feature || null);
      })
      .catch(err => {
        console.error("Error loading district polygon:", err);
        setDistrictPolygon(null);
      });
  }, [currentLocation?.state, currentLocation?.district]);

  // Update markers when location or assets change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !currentLocation) return;

    markersRef.current.clearLayers();

    // Only add markers if we have a specific location selected (District or Village)
    if (currentLocation.district) {
      // Use district polygon for precise placement if available, otherwise fallback to state center
      let bounds: [number, number, number, number] | null = null;
      if (districtPolygon) {
        bounds = bbox(districtPolygon) as [number, number, number, number];
      }

      const baseCoords = getStateCoordinates(currentLocation.state);
      const seed = (currentLocation.village || currentLocation.district).length;

      assetTypes.forEach((asset, typeIndex) => {
        const markerCount = 5 + (seed % 5); // 5 to 10 markers per type

        for (let i = 0; i < markerCount; i++) {
          // Generate position
          let lat = baseCoords.lat;
          let lng = baseCoords.lng;
          let isValidPosition = false;
          let attempts = 0;

          // Try to find a point inside the polygon
          if (districtPolygon && bounds) {
            const [minLng, minLat, maxLng, maxLat] = bounds;
            while (!isValidPosition && attempts < 50) {
              const randomLng = minLng + Math.random() * (maxLng - minLng);
              const randomLat = minLat + Math.random() * (maxLat - minLat);

              if (booleanPointInPolygon(point([randomLng, randomLat]), districtPolygon)) {
                lat = randomLat;
                lng = randomLng;
                isValidPosition = true;
              }
              attempts++;
            }
          } else {
            // Fallback to simple radial distribution if no polygon
            const angle = (seed + typeIndex * 10 + i) * (Math.PI * 2 / markerCount);
            const distance = 0.02 + (Math.random() * 0.05);
            lat = baseCoords.lat + Math.sin(angle) * distance;
            lng = baseCoords.lng + Math.cos(angle) * distance;
            isValidPosition = true;
          }

          if (!isValidPosition) continue; // Skip if couldn't find valid position

          const iconHtml = `
                    <div class="flex items-center justify-center w-8 h-8 hover:scale-125 transition-transform cursor-pointer drop-shadow-md">
                        <span class="text-2xl filter drop-shadow-sm">${asset.symbol}</span>
                    </div>
                `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-asset-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([lat, lng], { icon: customIcon });

          marker.on('click', () => setSelectedAsset(asset));

          // Add detailed popup
          const popupContent = `
                    <div class="p-3 min-w-[200px]">
                        <div class="flex items-center gap-2 mb-2 border-b pb-2">
                            <span class="text-2xl">${asset.symbol}</span>
                            <div>
                                <h3 class="font-bold text-gray-900 text-sm">${asset.name}</h3>
                                <span class="text-xs text-gray-500 uppercase tracking-wider">Asset Details</span>
                            </div>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Area:</span>
                                <span class="font-medium text-gray-900">${asset.area}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Status:</span>
                                <span class="text-green-600 font-medium flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Monitored
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Last Survey:</span>
                                <span class="font-medium text-gray-900">2 days ago</span>
                            </div>
                            <div class="bg-gray-50 p-2 rounded mt-2 border border-gray-100">
                                <div class="text-gray-500 mb-1">Change Detection</div>
                                <div class="font-medium text-blue-600 flex items-center gap-1">
                                    <i class="ri-arrow-up-line"></i>
                                    +1.2% Growth
                                </div>
                            </div>
                            <button class="w-full mt-2 bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors text-xs font-medium">
                                View Full Report
                            </button>
                        </div>
                    </div>
                `;

          marker.bindPopup(popupContent, {
            className: 'custom-popup',
            closeButton: false,
            maxWidth: 250
          });

          markersRef.current?.addLayer(marker);
        }
      });
    }
  }, [currentLocation, assetTypes, districtPolygon]);


  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Invalidate size after transition to ensure map fills container
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 300);
  };

  const containerClasses = isFullscreen
    ? 'bg-white rounded-lg shadow-lg border border-gray-200 fixed inset-0 z-50'
    : 'bg-white rounded-lg shadow-lg border border-gray-200';

  return (
    <>
      <style jsx global>{`
        .custom-asset-marker {
            background: transparent;
            border: none;
        }
      `}</style>
      <div className={containerClasses}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t('assetMapping.viewer.title')}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {t('assetMapping.viewer.liveAnalysis')}
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer transition-colors"
                title={isFullscreen ? t('assetMapping.viewer.exitFullscreen') : t('assetMapping.viewer.fullscreen')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}></i>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">{t('assetMapping.viewer.analysisMode')}:</label>
              <select
                value={analysisMode}
                onChange={(e) => setAnalysisMode(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
              >
                <option value="standard">{t('assetMapping.viewer.modes.standard')}</option>
                <option value="ai-enhanced">{t('assetMapping.viewer.modes.aiEnhanced')}</option>
                <option value="change-detection">{t('assetMapping.viewer.modes.changeDetection')}</option>
                <option value="real-time">{t('assetMapping.viewer.modes.realTime')}</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {t('assetMapping.viewer.confidence')}: <span className="font-medium text-green-600">{analysisData.confidence}%</span>
            </div>
          </div>
        </div>

        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-96 lg:h-[500px]'} bg-gray-50`}>
          {/* Map Container */}
          <div ref={mapContainerRef} className="w-full h-full z-0" style={{ minHeight: '100%', minWidth: '100%', position: 'absolute', top: 0, left: 0 }} />

          {/* Asset Mapping Map enhanced with DSS polygon boundary integration */}
          <StateBoundaryLayer
            map={mapInstance}
            selectedState={currentLocation?.state || null}
            isVisible={!!currentLocation?.state}
          />

          <DistrictBoundaryLayer
            map={mapInstance}
            selectedState={currentLocation?.state || null}
            selectedDistrict={currentLocation?.district || null}
            isVisible={!!currentLocation?.district}
          />

          {isLoadingImage && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-satellite-line text-2xl text-blue-600 animate-pulse"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('assetMapping.viewer.loading')}</h3>
                <p className="text-gray-600">
                  {currentLocation ?
                    t('assetMapping.viewer.fetching', { village: currentLocation.village, district: currentLocation.district }) :
                    t('assetMapping.viewer.preparing')
                  }
                </p>
              </div>
            </div>
          )}

          {/* Analysis Overlay - Positioned absolutely over map */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[400]">
            <div className="text-sm font-medium text-gray-900 mb-2">{t('assetMapping.viewer.assetAnalysis')}</div>
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
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[400]">
            <div className="text-sm font-medium text-gray-900 mb-2">{t('assetMapping.viewer.locationInfo')}</div>
            <div className="space-y-1 text-xs text-gray-600">
              {currentLocation ? (
                <>
                  <div><strong>Village:</strong> {currentLocation.village}</div>
                  <div><strong>District:</strong> {currentLocation.district}</div>
                  <div><strong>State:</strong> {currentLocation.state}</div>
                  <div>Lat: {getStateCoordinates(currentLocation.state).lat.toFixed(4)}° N</div>
                  <div>Lng: {getStateCoordinates(currentLocation.state).lng.toFixed(4)}° E</div>
                  <div>Zoom: {mapRef.current?.getZoom() || 15}x</div>
                  <div>Updated: {analysisData.lastUpdated}</div>
                </>
              ) : (
                <>
                  <div>Lat: 20.5937° N</div>
                  <div>Lng: 78.9629° E</div>
                  <div>Zoom: 5x</div>
                  <div>Updated: {analysisData.lastUpdated}</div>
                </>
              )}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs z-[400]">
            <div className="text-sm font-medium text-gray-900 mb-2">{t('assetMapping.viewer.aiInsights')}</div>
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
                <span className="text-blue-600 font-medium">{t('assetMapping.viewer.aiAnalysisActive')}</span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400]">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-green-50 text-gray-700 hover:text-green-700 cursor-pointer transition-colors border border-gray-200"
              title={t('assetMapping.viewer.zoomIn')}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-zoom-in-line"></i>
              </div>
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-green-50 text-gray-700 hover:text-green-700 cursor-pointer transition-colors border border-gray-200"
              title={t('assetMapping.viewer.zoomOut')}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-zoom-out-line"></i>
              </div>
            </button>
            <button
              onClick={() => {
                if (currentLocation?.state) {
                  const coords = getStateCoordinates(currentLocation.state);
                  mapRef.current?.setView([coords.lat, coords.lng], 8);
                } else {
                  mapRef.current?.setView([20.5937, 78.9629], 5);
                }
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-green-50 text-gray-700 hover:text-green-700 cursor-pointer transition-colors border border-gray-200"
              title={t('assetMapping.viewer.resetView')}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-home-2-line"></i>
              </div>
            </button>
          </div>
        </div>

        {/* Asset Details Panel */}
        {selectedAsset && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedAsset.symbol}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedAsset.name}</h4>
                  <p className="text-sm text-gray-600">{t('assetMapping.classification.table.area')}: {selectedAsset.area}</p>
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
                <div className="text-gray-600">{t('assetMapping.detection.status')}</div>
                <div className="font-medium text-green-600">{t('assetMapping.viewer.monitored')}</div>
              </div>
              <div>
                <div className="text-gray-600">{t('assetMapping.viewer.lastSurvey')}</div>
                <div className="font-medium">{t('assetMapping.viewer.daysAgo', { count: 15 })}</div>
              </div>
              <div>
                <div className="text-gray-600">{t('assetMapping.viewer.change')}</div>
                <div className="font-medium text-blue-600">+1.2%</div>
              </div>
            </div>
          </div>
        )}

        {/* Asset Legend Table */}
        <div className="p-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">{t('assetMapping.viewer.assetAnalysis')}</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('assetMapping.classification.table.assetType')}</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('assetMapping.classification.table.area')}</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('assetMapping.detection.status')}</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('assetMapping.viewer.actions')}</th>
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
                        {t('assetMapping.viewer.monitored')}
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