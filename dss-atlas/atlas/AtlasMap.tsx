'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, {
  Source,
  Layer as MapboxLayer,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
  MapRef
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Layer, Coordinates, BoundingBox, AtlasFilters } from '@/types/atlas';
import { layerColors, generateLayerStyle } from '@/lib/mapUtils';
import LayerControl from './LayerControl';
import ClaimPopup from './ClaimPopup';
import { loadClaimsCSV, ClaimsGeoJSON } from '@/lib/csvLoader';
import { generateDistrictClaims } from '@/lib/claimsGenerator';
import { ClaimRecord, ClaimGeoJSONFeature } from '@/types/atlas';

// Helper to generate MapLibre style objects for free tile sources
const getMapStyle = (styleId: string) => {
  const styles: Record<string, any> = {
    satellite: {
      version: 8,
      sources: {
        'satellite-source': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: 'Esri, Maxar, Earthstar Geographics'
        }
      },
      layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite-source', minzoom: 0, maxzoom: 19 }]
    },
    streets: {
      version: 8,
      sources: {
        'osm-source': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap Contributors'
        }
      },
      layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-source', minzoom: 0, maxzoom: 19 }]
    },
    terrain: {
      version: 8,
      sources: {
        'terrain-source': {
          type: 'raster',
          tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
        }
      },
      layers: [{ id: 'terrain-layer', type: 'raster', source: 'terrain-source', minzoom: 0, maxzoom: 17 }]
    },
    light: {
      version: 8,
      sources: {
        'light-source': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
      },
      layers: [{ id: 'light-layer', type: 'raster', source: 'light-source', minzoom: 0, maxzoom: 19 }]
    },
    dark: {
      version: 8,
      sources: {
        'dark-source': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
      },
      layers: [{ id: 'dark-layer', type: 'raster', source: 'dark-source', minzoom: 0, maxzoom: 19 }]
    }
  };
  return styles[styleId] || styles.streets;
};

interface AtlasMapProps {
  filters: AtlasFilters;
  onFeatureClick?: (feature: any) => void;
  measurementActive: boolean;
  onMeasurementsUpdate: (m: { distance: number; area: number }) => void;
}

export default function AtlasMap({ filters, onFeatureClick, measurementActive, onMeasurementsUpdate }: AtlasMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 78.96288,
    latitude: 20.593684,
    zoom: 4
  });

  const [mapStyle, setMapStyle] = useState(getMapStyle('streets'));
  const [hoveredFeature, setHoveredFeature] = useState<any>(null);
  const [cursor, setCursor] = useState<string>('auto');
  const drawRef = useRef<any>(null);
  const [claimsData, setClaimsData] = useState<ClaimsGeoJSON | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);

  // Layer State
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'claim-ifr', name: 'IFR Claims', type: 'ifr', visible: true, opacity: 1, color: '#3B82F6', zIndex: 70 },
    { id: 'claim-cr', name: 'CR Claims', type: 'cr', visible: true, opacity: 1, color: '#F97316', zIndex: 71 },
    { id: 'claim-cfr', name: 'CFR Claims', type: 'cfr', visible: true, opacity: 1, color: '#10B981', zIndex: 72 },
  ]);

  // Data State
  const [geoJsonData, setGeoJsonData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Fetch asset data based on filters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.state) queryParams.append('state', filters.state);
        if (filters.district) queryParams.append('district', filters.district);

        // Fetch Asset layers only
        const assetResponse = await fetch(`/api/asset-layers?${queryParams.toString()}`);
        const assetData = await assetResponse.json();

        setGeoJsonData({
          assets: assetData
        });
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);



  // Layer toggling
  const handleToggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    ));
  };

  // State for external GeoJSON boundary
  const [stateBoundaries, setStateBoundaries] = useState<any>(null);
  const [highlightedState, setHighlightedState] = useState<any>(null);

  // Fetch state/district boundaries when filters change
  useEffect(() => {
    const fetchBoundaries = async () => {
      if (!filters.state) {
        setHighlightedState(null);
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('state', filters.state);
        // We fetch all districts for the state to keep context
        // if (filters.district) {
        //   queryParams.append('district', filters.district);
        // }

        const response = await fetch(`/api/geo?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch boundaries');

        const data = await response.json();

        setHighlightedState(data);

        // Calculate bounds and fly to location
        if (data.features && data.features.length > 0 && mapRef.current) {
          let featuresToBound = data.features;

          // If district is selected, only zoom to that district
          if (filters.district) {
            const districtFeatures = data.features.filter((f: any) => {
              const props = f.properties || {};
              const dName = props.dtname || props.district || props.DISTRICT || props.NAME_2 || '';
              return dName.toLowerCase() === filters.district?.toLowerCase();
            });
            if (districtFeatures.length > 0) {
              featuresToBound = districtFeatures;
            }
          }

          // Simple bbox calculation
          let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90;

          featuresToBound.forEach((feature: any) => {
            const geometry = feature.geometry;

            // Function to extract all coordinates from a geometry
            const extractCoords = (coords: any, depth: number = 0): void => {
              if (depth === 0 && geometry.type === 'Polygon') {
                // Polygon: array of rings, each ring is array of [lng, lat]
                coords.forEach((ring: any[]) => {
                  ring.forEach(([lng, lat]: [number, number]) => {
                    if (lng < minLng) minLng = lng;
                    if (lng > maxLng) maxLng = lng;
                    if (lat < minLat) minLat = lat;
                    if (lat > maxLat) maxLat = lat;
                  });
                });
              } else if (depth === 0 && geometry.type === 'MultiPolygon') {
                // MultiPolygon: array of polygons
                coords.forEach((polygon: any) => {
                  polygon.forEach((ring: any[]) => {
                    ring.forEach(([lng, lat]: [number, number]) => {
                      if (lng < minLng) minLng = lng;
                      if (lng > maxLng) maxLng = lng;
                      if (lat < minLat) minLat = lat;
                      if (lat > maxLat) maxLat = lat;
                    });
                  });
                });
              }
            };

            extractCoords(geometry.coordinates);
          });

          mapRef.current.fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { padding: 50, duration: 1500 }
          );
        }

      } catch (err) {
        console.error('Error fetching boundaries:', err);
        setHighlightedState(null);
      }
    };

    fetchBoundaries();
  }, [filters.state, filters.district]);

  // Generate claims data when district changes
  useEffect(() => {
    if (filters.state && filters.district) {
      console.log(`Generating claims for ${filters.district}, ${filters.state}`);

      // Find district geometry if available
      let districtGeometry = null;
      if (stateBoundaries && stateBoundaries.features) {
        const districtFeature = stateBoundaries.features.find((f: any) =>
          f.properties &&
          (f.properties.district === filters.district || f.properties.DISTRICT === filters.district)
        );
        if (districtFeature) {
          districtGeometry = districtFeature.geometry;
        }
      }

      const data = generateDistrictClaims(filters.state, filters.district, districtGeometry);
      setClaimsData(data);
    } else {
      // Clear claims if no district selected
      setClaimsData(null);
    }
  }, [filters.state, filters.district, stateBoundaries]);

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, opacity } : l
    ));
  };

  // Map interactions
  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  const onClick = useCallback((event: any) => {
    const feature = event.features?.[0];
    if (feature && onFeatureClick) {
      onFeatureClick(feature);
    }
  }, [onFeatureClick]);

  // Handle click on highlighted state
  const onStateClick = useCallback((event: any) => {
    const feature = event.features?.[0];
    if (feature) {
      const { lat, lng } = event.lngLat;
      setHoveredFeature({
        ...feature,
        properties: {
          ...feature.properties,
          popupLat: lat,
          popupLng: lng
        }
      });
    }
  }, []);

  // Helper to construct filter expression based on status and pending toggle
  const getClaimFilter = (claimType: string) => {
    const baseFilter = ['==', ['get', 'claim_type'], claimType];

    // 1. "Show Pending Claims Only" Toggle Logic
    if (filters.showPendingClaims) {
      // If ON: Show ONLY Pending claims (regardless of other status filters)
      return ['all', baseFilter, ['==', ['get', 'status'], 'Pending']];
    }

    // 2. Advanced Status Filters Logic
    if (filters.claimStatus && filters.claimStatus !== 'all') {
      // Map 'approved', 'pending', etc. to 'Approved', 'Pending' (case sensitive in data)
      const statusMap: Record<string, string> = {
        'approved': 'Approved',
        'pending': 'Pending',
        'filed': 'Filed',
        'rejected': 'Rejected'
      };

      const mappedStatus = statusMap[filters.claimStatus.toLowerCase()] || filters.claimStatus;
      return ['all', baseFilter, ['==', ['get', 'status'], mappedStatus]];
    }

    // Default: Show all for this claim type
    return baseFilter;
  };

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactiveLayerIds={[
          'highlighted-state-fill',
          'claim-ifr-circles',
          'claim-cr-circles',
          'claim-cfr-circles',
          ...layers.filter(l => l.visible).map(l => l.id)
        ]}
        cursor={cursor}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={(e) => {
          // Check if we clicked a claim marker
          const claimLayers = ['claim-ifr-circles', 'claim-cr-circles', 'claim-cfr-circles'];
          const claimFeatures = mapRef.current?.queryRenderedFeatures(e.point, { layers: claimLayers });

          if (claimFeatures && claimFeatures.length > 0) {
            const claim = claimFeatures[0].properties as ClaimRecord;
            setSelectedClaim(claim);
            return;
          }

          // Check if we clicked the highlighted state
          const features = mapRef.current?.queryRenderedFeatures(e.point, { layers: ['highlighted-state-fill'] });
          if (features && features.length > 0) {
            onStateClick({ ...e, features });
          } else {
            onClick(e);
          }
        }}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
        <ScaleControl position="bottom-right" />

        {/* Highlighted State/District Polygons */}
        {highlightedState && (
          <Source id="highlighted-state-source-fill" type="geojson" data={highlightedState}>
            {/* Fill layer */}
            <MapboxLayer
              id="highlighted-state-fill"
              type="fill"
              paint={{
                'fill-color': filters.district
                  ? ['case',
                    ['==', ['downcase', ['get', 'dtname']], filters.district.toLowerCase()], '#FFA500', // Selected district: Orange
                    '#4A90E2' // Other districts: Blue
                  ]
                  : '#4A90E2', // State view: Blue
                'fill-opacity': filters.district
                  ? ['case',
                    ['==', ['downcase', ['get', 'dtname']], filters.district.toLowerCase()], 0.3, // Selected district opacity
                    0.1 // Other districts: lighter opacity
                  ]
                  : 0.2 // State view opacity
              }}
            />
            {/* Outline layer */}
            <MapboxLayer
              id="highlighted-state-outline"
              type="line"
              paint={{
                'line-color': '#000000',
                'line-width': filters.district
                  ? ['case',
                    ['==', ['downcase', ['get', 'dtname']], filters.district.toLowerCase()], 3, // Selected district: Bold
                    1 // Other districts: Thin
                  ]
                  : 2, // State view: Medium
                'line-opacity': 1
              }}
            />
          </Source>
        )}

        {/* Data Sources & Layers */}
        {geoJsonData.fra && (
          <Source id="fra-source" type="geojson" data={geoJsonData.fra}>
            {/* State Boundaries - Always Visible */}
            <MapboxLayer
              id="state"
              type="line"
              paint={{
                'line-color': filters.state
                  ? ['case', ['==', ['get', 'name'], filters.state], '#000000', layerColors.state]
                  : layerColors.state,
                'line-width': filters.state
                  ? ['case', ['==', ['get', 'name'], filters.state], 3, 1]
                  : 2,
                'line-opacity': 1
              }}
              filter={['==', ['get', 'type'], 'state']}
            />

            {/* District Boundaries - Always Visible */}
            <MapboxLayer
              id="district"
              type="line"
              paint={{
                'line-color': layerColors.district,
                'line-width': 1.5,
                'line-opacity': 0.8
              }}
              filter={['==', ['get', 'type'], 'district']}
            />
          </Source>
        )}

        {/* Asset Data Source */}
        {geoJsonData.assets && layers.find(l => l.id === 'asset')?.visible && (
          <Source id="asset-source" type="geojson" data={geoJsonData.assets}>
            <MapboxLayer
              id="asset-points"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  5, 6,  // Increased size
                  10, 8,
                  15, 12
                ],
                'circle-color': [
                  'match',
                  ['get', 'type'],
                  'pond', layerColors.asset.pond,
                  'irrigation', layerColors.asset.irrigation,
                  'road', layerColors.asset.road,
                  'homestead', layerColors.asset.homestead,
                  'school', layerColors.asset.school,
                  'health', layerColors.asset.health,
                  'forest', layerColors.asset.forest,
                  '#4B5563'
                ],
                'circle-stroke-width': 1.5, // Black stroke border
                'circle-stroke-color': '#000000',
                'circle-opacity': layers.find(l => l.id === 'asset')?.opacity
              }}
              filter={
                filters.district
                  ? ['all', ['==', ['get', 'state'], filters.state], ['==', ['get', 'district'], filters.district]]
                  : filters.state
                    ? ['==', ['get', 'state'], filters.state]
                    : undefined
              }
            />
            {/* Asset Labels (visible at high zoom) */}
            <MapboxLayer
              id="asset-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Regular'],
                'text-size': 12,
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'visibility': 'visible'
              }}
              paint={{
                'text-color': '#333333',
                'text-halo-color': '#ffffff',
                'text-halo-width': 2,
                'text-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 13, 1]
              }}
            />
          </Source>
        )}



        {/* Popup for Highlighted State */}
        {hoveredFeature && hoveredFeature.properties.NAME_1 && (
          <Popup
            longitude={hoveredFeature.properties.popupLng || 0}
            latitude={hoveredFeature.properties.popupLat || 0}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setHoveredFeature(null)}
            anchor="bottom"
          >
            <div className="p-2">
              <h3 className="font-bold text-lg">{hoveredFeature.properties.NAME_1}</h3>
              <p className="text-sm text-gray-600">
                Lat: {hoveredFeature.properties.popupLat?.toFixed(5)}<br />
                Lon: {hoveredFeature.properties.popupLng?.toFixed(5)}
              </p>
            </div>
          </Popup>
        )}

        {/* CSV Claims Data Source */}
        {claimsData && (
          <Source id="claims-source" type="geojson" data={claimsData}>
            {/* IFR Claims */}
            {layers.find(l => l.id === 'claim-ifr')?.visible && (
              <MapboxLayer
                id="claim-ifr-circles"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    4, 4,
                    8, 6,
                    12, 8
                  ],
                  'circle-color': '#3B82F6',
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#000000',
                  'circle-opacity': layers.find(l => l.id === 'claim-ifr')?.opacity || 1
                }}
                filter={getClaimFilter('IFR')}
              />
            )}

            {/* CR Claims */}
            {layers.find(l => l.id === 'claim-cr')?.visible && (
              <MapboxLayer
                id="claim-cr-circles"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    4, 4,
                    8, 6,
                    12, 8
                  ],
                  'circle-color': '#F97316',
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#000000',
                  'circle-opacity': layers.find(l => l.id === 'claim-cr')?.opacity || 1
                }}
                filter={getClaimFilter('CR')}
              />
            )}

            {/* CFR Claims */}
            {layers.find(l => l.id === 'claim-cfr')?.visible && (
              <MapboxLayer
                id="claim-cfr-circles"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    4, 4,
                    8, 6,
                    12, 8
                  ],
                  'circle-color': '#10B981',
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#000000',
                  'circle-opacity': layers.find(l => l.id === 'claim-cfr')?.opacity || 1
                }}
                filter={getClaimFilter('CFR')}
              />
            )}
          </Source>
        )}

        {/* Claim Popup */}
        {selectedClaim && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <ClaimPopup
              claim={selectedClaim}
              onClose={() => setSelectedClaim(null)}
            />
          </div>
        )}
      </Map>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        <LayerControl
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onOpacityChange={handleOpacityChange}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="font-medium text-gray-700">Loading map data...</span>
          </div>
        </div>
      )}
    </div>
  );
}
