'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  tribalBoundaries,
  administrativeBoundaries,
  getTribalBoundary,
  getAdministrativeBoundary,
  TribalBoundary,
  AdministrativeBoundary
} from './GeoJSONData';
import { apiService, ClaimsResponse, BoundaryResponse } from './services/apiService';
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';

interface PolygonAtlasMapProps {
  filters: {
    state: string;
    district: string;
    village: string;
    tribalGroup: string;
    claimStatus: string;
  };
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

export default function PolygonAtlasMap({
  filters,
  cinematicTarget,
  onCinematicComplete,
  onClaimsDataUpdate
}: PolygonAtlasMapProps) {
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<any>(null);
  const [highlightedBoundaries, setHighlightedBoundaries] = useState<any[]>([]);
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [currentCenter, setCurrentCenter] = useState({ lat: 20.593684, lng: 78.96288 });
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [mapLoadTimeout, setMapLoadTimeout] = useState(false);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const cinematicTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [showStateBoundary, setShowStateBoundary] = useState(true);

  // Layer definitions
  const layers = [
    { id: 'all', name: 'All Layers', icon: 'ri-stack-line' },
    { id: 'ifr', name: 'Individual Forest Rights', icon: 'ri-user-line' },
    { id: 'cfr', name: 'Community Forest Rights', icon: 'ri-group-line' },
    { id: 'cfres', name: 'Community Forest Resources', icon: 'ri-plant-line' },
    { id: 'villages', name: 'Village Boundaries', icon: 'ri-map-pin-line' },
    { id: 'state-boundary', name: 'State Boundary', icon: 'ri-map-pin-range-line' }
  ];

  const mapViews = [
    { id: 'satellite', name: 'Satellite', icon: 'ri-earth-line' },
    { id: 'terrain', name: 'Terrain', icon: 'ri-mountain-line' },
    { id: 'roadmap', name: 'Road Map', icon: 'ri-map-2-line' }
  ];

  // Initialize Google Maps
  useEffect(() => {
    // Set a timeout to force iframe fallback if map doesn't load
    const timeout = setTimeout(() => {
      if (!isMapLoaded) {
        console.warn('Map loading timeout, switching to iframe fallback');
        setMapLoadTimeout(true);
        setUseIframeFallback(true);
        setIsMapLoaded(true);
      }
    }, 5000); // 5 second timeout

    // Check if we have Google Maps API key, if not use iframe immediately
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY') {
      console.warn('No Google Maps API key found, using iframe fallback');
      setUseIframeFallback(true);
      setIsMapLoaded(true);
      clearTimeout(timeout);
      return;
    }

    const initializeMap = () => {
      if (typeof window !== 'undefined' && (window as any).google && mapRef.current) {
        try {
          const coordinates = getLocationCoordinates();
          const map = new (window as any).google.maps.Map(mapRef.current, {
            center: { lat: coordinates.lat, lng: coordinates.lng },
            zoom: coordinates.zoom,
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
          clearTimeout(timeout);
          console.log('Google Maps initialized successfully');
          return true;
        } catch (error) {
          console.error('Error initializing Google Maps:', error);
          return false;
        }
      }
      return false;
    };

    // Check if Google Maps is already loaded
    if ((window as any).google) {
      initializeMap();
    } else {
      // Wait for Google Maps to load
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max
      const checkGoogleMaps = () => {
        attempts++;
        if ((window as any).google) {
          if (initializeMap()) {
            return; // Success
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(checkGoogleMaps, 100);
        } else {
          // Fallback to iframe after max attempts
          console.warn('Google Maps failed to load, using iframe fallback');
          console.log('Google Maps API Key available:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
          setUseIframeFallback(true);
          setIsMapLoaded(true);
          clearTimeout(timeout);
        }
      };
      checkGoogleMaps();
    }

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Clear existing polygons
  const clearPolygons = () => {
    polygons.forEach(polygon => {
      polygon.setMap(null);
    });
    setPolygons([]);
  };

  // Create polygon from boundary data
  const createPolygon = (boundary: TribalBoundary | AdministrativeBoundary, isTribal: boolean = false) => {
    if (!mapInstance) return null;

    const paths = boundary.coordinates.map(ring =>
      ring.map(coord => new (window as any).google.maps.LatLng(coord[1], coord[0]))
    );

    const polygon = new (window as any).google.maps.Polygon({
      paths: paths,
      strokeColor: isTribal ? '#FFD700' : ('type' in boundary ? (boundary.type === 'state' ? '#EF4444' : boundary.type === 'district' ? '#3B82F6' : '#10B981') : '#10B981'),
      strokeOpacity: 1.0,
      strokeWeight: isTribal ? 3 : 2,
      fillColor: isTribal ? '#FFD700' : ('type' in boundary ? (boundary.type === 'state' ? '#EF4444' : boundary.type === 'district' ? '#3B82F6' : '#10B981') : '#10B981'),
      fillOpacity: isTribal ? 0.4 : 0.2,
      clickable: true,
      geodesic: true
    });

    // Add click event listener
    polygon.addListener('click', () => {
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${boundary.name}</h3>
            <p class="text-sm text-gray-600">${isTribal ? 'Tribal Area' : ('type' in boundary ? boundary.type.charAt(0).toUpperCase() + boundary.type.slice(1) : 'Area')}</p>
            ${isTribal ? `<p class="text-xs text-gray-500">Tribal Group: ${(boundary as TribalBoundary).tribalGroup}</p>` : ''}
          </div>
        `
      });
      infoWindow.setPosition(boundary.center);
      infoWindow.open(mapInstance);
    });

    polygon.setMap(mapInstance);
    return polygon;
  };

  // Fit map to boundary bounds
  const fitMapToBounds = (boundary: TribalBoundary | AdministrativeBoundary) => {
    if (!mapInstance) return;

    const bounds = new (window as any).google.maps.LatLngBounds();
    boundary.coordinates.forEach(ring => {
      ring.forEach(coord => {
        bounds.extend(new (window as any).google.maps.LatLng(coord[1], coord[0]));
      });
    });

    mapInstance.fitBounds(bounds);

    // Add some padding
    const listener = (window as any).google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
      if (mapInstance.getZoom() > 15) {
        mapInstance.setZoom(15);
      }
      (window as any).google.maps.event.removeListener(listener);
    });
  };

  // Handle filter changes and update boundaries
  useEffect(() => {
    if (!mapInstance || !isMapLoaded) return;

    const loadBoundaryData = async () => {
      setIsLoadingData(true);
      setDataError(null);
      clearPolygons();

      try {
        // Determine boundary type based on filters
        let boundaryType = 'all';
        if (filters.state && filters.district && filters.village && filters.tribalGroup) {
          boundaryType = 'tribal';
        } else if (filters.village) {
          boundaryType = 'village';
        } else if (filters.district) {
          boundaryType = 'district';
        } else if (filters.state) {
          boundaryType = 'state';
        }

        // Fetch boundary data from API
        const boundaryResponse = await apiService.fetchBoundaryData({
          state: filters.state,
          district: filters.district,
          village: filters.village,
          tribalGroup: filters.tribalGroup,
          type: boundaryType
        });

        if (boundaryResponse.success && boundaryResponse.data.features.length > 0) {
          const newPolygons: any[] = [];
          let targetBoundary: any = null;

          // Create polygons from GeoJSON features
          boundaryResponse.data.features.forEach((feature: any) => {
            const polygon = createPolygonFromGeoJSON(feature);
            if (polygon) {
              newPolygons.push(polygon);
              if (!targetBoundary) {
                targetBoundary = {
                  center: boundaryResponse.boundaries[0]?.center || { lat: 20.593684, lng: 78.96288 },
                  bbox: boundaryResponse.boundaries[0]?.bbox
                };
              }
            }
          });

          setPolygons(newPolygons);

          // Update highlighted boundaries for display
          const boundaries = boundaryResponse.boundaries.map((boundary: any) => ({
            type: boundary.type,
            name: boundary.name,
            color: boundary.type === 'tribal' ? '#FFD700' :
              boundary.type === 'state' ? '#EF4444' :
                boundary.type === 'district' ? '#3B82F6' : '#10B981',
            strokeWidth: boundary.type === 'tribal' ? 3 : 2,
            fillOpacity: boundary.type === 'tribal' ? 0.4 : 0.2
          }));

          setHighlightedBoundaries(boundaries);

          // Fit map to the boundary
          if (targetBoundary) {
            setTimeout(() => {
              fitMapToBoundsFromBbox(targetBoundary.bbox);
            }, 100);
          }
        } else {
          // Fallback to mock data if API fails
          console.warn('No boundary data from API, using fallback');
          loadFallbackBoundaries();
        }

        // Update claims data
        await updateClaimsDataFromAPI(filters);

      } catch (error) {
        console.error('Error loading boundary data:', error);
        setDataError('Failed to load boundary data. Using fallback data.');
        loadFallbackBoundaries();
        await updateClaimsDataFromAPI(filters);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadBoundaryData();
  }, [filters, mapInstance, isMapLoaded]);

  // Handle cinematic target changes
  useEffect(() => {
    console.log('Cinematic target changed:', cinematicTarget);
    if (cinematicTarget && mapInstance) {
      console.log('Processing cinematic target with map instance');
      setIsCinematicMode(true);

      // Clear any existing timeout
      if (cinematicTimeoutRef.current) {
        clearTimeout(cinematicTimeoutRef.current);
      }

      // Calculate center point from coordinates
      const coords = cinematicTarget.coordinates;
      if (coords && coords.length > 0) {
        // Calculate center of the polygon
        let totalLat = 0;
        let totalLng = 0;
        coords.forEach(coord => {
          totalLat += coord[1]; // lat
          totalLng += coord[0]; // lng
        });

        const centerLat = totalLat / coords.length;
        const centerLng = totalLng / coords.length;

        // Create polygon to show the land parcel
        const landPolygon = new (window as any).google.maps.Polygon({
          paths: coords.map(coord => new (window as any).google.maps.LatLng(coord[1], coord[0])),
          strokeColor: '#EF4444',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          fillColor: '#EF4444',
          fillOpacity: 0.3,
          clickable: true
        });

        landPolygon.setMap(mapInstance);

        // Animate to the location with smooth transition
        const bounds = new (window as any).google.maps.LatLngBounds();
        coords.forEach(coord => {
          bounds.extend(new (window as any).google.maps.LatLng(coord[1], coord[0]));
        });

        mapInstance.fitBounds(bounds);

        // Add some padding and limit zoom level
        const listener = (window as any).google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
          if (mapInstance.getZoom() > 18) {
            mapInstance.setZoom(18);
          }
          (window as any).google.maps.event.removeListener(listener);
        });

        // Create a marker for the patta holder at center
        const marker = new (window as any).google.maps.Marker({
          position: { lat: centerLat, lng: centerLng },
          map: mapInstance,
          title: cinematicTarget.pattaHolder,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="#FFFFFF" stroke-width="3"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">P</text>
              </svg>
            `),
            scaledSize: new (window as any).google.maps.Size(32, 32),
            anchor: new (window as any).google.maps.Point(16, 16)
          }
        });

        // Create info window
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div class="p-3">
              <h3 class="font-semibold text-gray-900">${cinematicTarget.pattaHolder}</h3>
              <p class="text-sm text-gray-600">${cinematicTarget.village}, ${cinematicTarget.district}</p>
              <p class="text-xs text-gray-500">${cinematicTarget.state}</p>
              <div class="mt-2 p-2 bg-red-50 rounded border border-red-200">
                <p class="text-xs text-red-700 font-medium">Land Parcel Highlighted</p>
              </div>
            </div>
          `
        });

        infoWindow.open(mapInstance, marker);

        // Auto-close cinematic mode after 8 seconds
        cinematicTimeoutRef.current = setTimeout(() => {
          setIsCinematicMode(false);
          marker.setMap(null);
          landPolygon.setMap(null);
          infoWindow.close();
          if (onCinematicComplete) {
            onCinematicComplete();
          }
        }, 8000);
      }
    } else if (cinematicTarget && !mapInstance) {
      console.log('Cinematic target received but map not ready, will retry when map loads');
    }
  }, [cinematicTarget, mapInstance]);

  // Create polygon from GeoJSON feature
  const createPolygonFromGeoJSON = (feature: any) => {
    if (!mapInstance || !feature.geometry) return null;

    const coordinates = feature.geometry.coordinates;
    let paths: any[] = [];

    if (feature.geometry.type === 'Polygon') {
      paths = coordinates[0].map((coord: number[]) =>
        new (window as any).google.maps.LatLng(coord[1], coord[0])
      );
    } else if (feature.geometry.type === 'MultiPolygon') {
      paths = coordinates[0][0].map((coord: number[]) =>
        new (window as any).google.maps.LatLng(coord[1], coord[0])
      );
    }

    if (paths.length === 0) return null;

    const isTribal = feature.properties?.tribalGroup || feature.properties?.name?.includes('Tribal');
    const boundaryType = feature.properties?.type || 'village';

    const polygon = new (window as any).google.maps.Polygon({
      paths: paths,
      strokeColor: isTribal ? '#FFD700' :
        (boundaryType === 'state' ? '#EF4444' :
          boundaryType === 'district' ? '#3B82F6' : '#10B981'),
      strokeOpacity: 1.0,
      strokeWeight: isTribal ? 3 : 2,
      fillColor: isTribal ? '#FFD700' :
        (boundaryType === 'state' ? '#EF4444' :
          boundaryType === 'district' ? '#3B82F6' : '#10B981'),
      fillOpacity: isTribal ? 0.4 : 0.2,
      clickable: true,
      geodesic: true
    });

    // Add click event listener
    polygon.addListener('click', () => {
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${feature.properties?.name || 'Boundary'}</h3>
            <p class="text-sm text-gray-600">${isTribal ? 'Tribal Area' : boundaryType.charAt(0).toUpperCase() + boundaryType.slice(1)}</p>
            ${feature.properties?.tribalGroup ? `<p class="text-xs text-gray-500">Tribal Group: ${feature.properties.tribalGroup}</p>` : ''}
            ${feature.properties?.area ? `<p class="text-xs text-gray-500">Area: ${feature.properties.area}</p>` : ''}
          </div>
        `
      });
      infoWindow.setPosition({
        lat: feature.properties?.center?.lat || 20.593684,
        lng: feature.properties?.center?.lng || 78.96288
      });
      infoWindow.open(mapInstance);
    });

    polygon.setMap(mapInstance);
    return polygon;
  };

  // Fit map to bbox
  const fitMapToBoundsFromBbox = (bbox: any) => {
    if (!mapInstance || !bbox) return;

    const bounds = new (window as any).google.maps.LatLngBounds();
    bounds.extend(new (window as any).google.maps.LatLng(bbox.south, bbox.west));
    bounds.extend(new (window as any).google.maps.LatLng(bbox.north, bbox.east));

    mapInstance.fitBounds(bounds);

    const listener = (window as any).google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
      if (mapInstance.getZoom() > 15) {
        mapInstance.setZoom(15);
      }
      (window as any).google.maps.event.removeListener(listener);
    });
  };

  // Comprehensive village coordinates database
  const getVillageCoordinates = (): { [key: string]: { lat: number; lng: number; zoom: number } } => {
    const villageCoordinates: { [key: string]: { lat: number; lng: number; zoom: number } } = {
      // Jharkhand villages with exact coordinates
      'Angara': { lat: 23.3800, lng: 85.1200, zoom: 14 },
      'Bero': { lat: 23.2800, lng: 85.4200, zoom: 14 },
      'Bundu': { lat: 23.1600, lng: 85.5800, zoom: 14 },
      'Chanho': { lat: 23.4200, lng: 85.2800, zoom: 14 },
      'Kanke': { lat: 23.4300, lng: 85.3200, zoom: 14 },
      'Lapung': { lat: 23.2900, lng: 85.1800, zoom: 14 },
      'Mandar': { lat: 23.3600, lng: 85.1900, zoom: 14 },
      'Namkum': { lat: 23.2700, lng: 85.2600, zoom: 14 },
      'Ormanjhi': { lat: 23.2400, lng: 85.2900, zoom: 14 },
      'Rania': { lat: 23.3900, lng: 85.2100, zoom: 14 },
      'Sonahatu': { lat: 23.2200, lng: 85.1500, zoom: 14 },
      'Tamar': { lat: 23.4600, lng: 85.0800, zoom: 14 },

      'Baharagora': { lat: 22.4900, lng: 86.4800, zoom: 14 },
      'Chakulia': { lat: 22.5200, lng: 86.7200, zoom: 14 },
      'Dhalbhumgarh': { lat: 22.5400, lng: 86.7500, zoom: 14 },
      'Ghatshila': { lat: 22.5800, lng: 86.4600, zoom: 14 },
      'Gurabandha': { lat: 22.7200, lng: 86.1800, zoom: 14 },
      'Jamshedpur': { lat: 22.8046, lng: 86.2029, zoom: 14 },
      'Musabani': { lat: 22.5100, lng: 86.4400, zoom: 14 },
      'Patamda': { lat: 22.6800, lng: 86.1200, zoom: 14 },
      'Potka': { lat: 22.6200, lng: 86.3800, zoom: 14 },

      'Chakradharpur': { lat: 22.6900, lng: 85.6300, zoom: 14 },
      'Chaibasa': { lat: 22.5562, lng: 85.8444, zoom: 14 },
      'Goilkera': { lat: 22.8300, lng: 85.4200, zoom: 14 },
      'Hatgamharia': { lat: 22.6100, lng: 85.4800, zoom: 14 },
      'Jagannathpur': { lat: 22.4800, lng: 85.7200, zoom: 14 },
      'Jhinkpani': { lat: 22.3900, lng: 85.8800, zoom: 14 },
      'Khuntpani': { lat: 22.4200, lng: 85.9200, zoom: 14 },
      'Kumardungi': { lat: 22.5800, lng: 85.7800, zoom: 14 },
      'Majhgaon': { lat: 22.6400, lng: 85.5600, zoom: 14 },
      'Manjhari': { lat: 22.7100, lng: 85.4900, zoom: 14 },
      'Noamundi': { lat: 22.1600, lng: 85.5000, zoom: 14 },
      'Sonua': { lat: 22.4600, lng: 85.6800, zoom: 14 },
      'Tonto': { lat: 22.2800, lng: 85.4200, zoom: 14 },
      'Tulin': { lat: 22.3400, lng: 85.3800, zoom: 14 },

      // Madhya Pradesh villages
      'Amarpur': { lat: 22.9200, lng: 81.1000, zoom: 14 },
      'Bajag': { lat: 22.8800, lng: 81.0600, zoom: 14 },
      'Karanjia': { lat: 22.9600, lng: 81.1400, zoom: 14 },
      'Mehandwani': { lat: 22.9000, lng: 81.0800, zoom: 14 },
      'Samnapur': { lat: 22.9400, lng: 81.1200, zoom: 14 },
      'Shahpura': { lat: 22.8600, lng: 81.0400, zoom: 14 },

      'Bichhiya': { lat: 22.6200, lng: 80.4000, zoom: 14 },
      'Ghughri': { lat: 22.5800, lng: 80.3600, zoom: 14 },
      'Narayanganj': { lat: 22.6600, lng: 80.4400, zoom: 14 },
      'Nainpur': { lat: 22.4300, lng: 80.1100, zoom: 14 },
      'Narayanpur': { lat: 22.6000, lng: 80.3800, zoom: 14 },

      'Alirajpur': { lat: 22.3167, lng: 74.3667, zoom: 14 },
      'Jobat': { lat: 22.4200, lng: 74.5600, zoom: 14 },
      'Kathiwara': { lat: 22.6800, lng: 74.2400, zoom: 14 },
      'Meghnagar': { lat: 22.6400, lng: 74.4800, zoom: 14 },
      'Petlawad': { lat: 22.8000, lng: 74.8000, zoom: 14 },
      'Ranapur': { lat: 22.2800, lng: 74.2000, zoom: 14 },
      'Thandla': { lat: 22.9700, lng: 74.6000, zoom: 14 },

      // Odisha villages
      'Badasahi': { lat: 21.9200, lng: 86.8200, zoom: 14 },
      'Bangriposi': { lat: 21.9800, lng: 86.5400, zoom: 14 },
      'Baripada': { lat: 21.9287, lng: 86.7350, zoom: 14 },
      'Betanoti': { lat: 21.7800, lng: 86.8600, zoom: 14 },
      'Bijatala': { lat: 21.8400, lng: 86.7800, zoom: 14 },
      'Bisoi': { lat: 21.8800, lng: 86.9200, zoom: 14 },
      'Gopabandhunagar': { lat: 21.9600, lng: 86.6800, zoom: 14 },
      'Jashipur': { lat: 22.0200, lng: 86.2200, zoom: 14 },
      'Khunta': { lat: 22.1200, lng: 86.0400, zoom: 14 },
      'Kuliana': { lat: 21.9000, lng: 86.8800, zoom: 14 },
      'Kusumi': { lat: 21.8600, lng: 86.9600, zoom: 14 },
      'Moroda': { lat: 21.7600, lng: 86.9000, zoom: 14 },
      'Rairangpur': { lat: 22.1000, lng: 86.2000, zoom: 14 },
      'Raruan': { lat: 21.9400, lng: 86.5800, zoom: 14 },
      'Samakhunta': { lat: 21.8000, lng: 86.8400, zoom: 14 },
      'Suliapada': { lat: 21.7400, lng: 86.8000, zoom: 14 },
      'Thakurmunda': { lat: 21.7200, lng: 86.7600, zoom: 14 },
      'Tiring': { lat: 21.9800, lng: 86.4800, zoom: 14 },
      'Udala': { lat: 22.1600, lng: 86.0800, zoom: 14 },

      'Balisankara': { lat: 22.0800, lng: 84.1200, zoom: 14 },
      'Bargaon': { lat: 21.9600, lng: 84.2800, zoom: 14 },
      'Bisra': { lat: 22.0400, lng: 84.0800, zoom: 14 },
      'Bonai': { lat: 21.9200, lng: 84.3600, zoom: 14 },
      'Gurundia': { lat: 22.1400, lng: 84.2400, zoom: 14 },
      'Hemgir': { lat: 22.2000, lng: 84.1600, zoom: 14 },
      'Koida': { lat: 22.1800, lng: 85.0200, zoom: 14 },
      'Kuanrmunda': { lat: 22.0600, lng: 84.4400, zoom: 14 },
      'Kutra': { lat: 22.1200, lng: 84.3200, zoom: 14 },
      'Lahunipara': { lat: 22.0200, lng: 84.2000, zoom: 14 },
      'Lathikata': { lat: 22.1600, lng: 84.0400, zoom: 14 },
      'Lefripada': { lat: 22.1000, lng: 84.1800, zoom: 14 },
      'Nuagaon': { lat: 22.0000, lng: 84.3000, zoom: 14 },
      'Rajgangpur': { lat: 22.1167, lng: 84.0167, zoom: 14 },
      'Subdega': { lat: 22.1800, lng: 84.2800, zoom: 14 },
      'Tangarpali': { lat: 22.0800, lng: 84.2600, zoom: 14 },

      // Tripura villages
      'Agartala': { lat: 23.8315, lng: 91.2868, zoom: 14 },
      'Bishalgarh': { lat: 23.8500, lng: 91.1200, zoom: 14 },
      'Boxanagar': { lat: 23.7800, lng: 91.1800, zoom: 14 },
      'Jirania': { lat: 23.7600, lng: 91.2400, zoom: 14 },
      'Khayerpur': { lat: 23.8200, lng: 91.3200, zoom: 14 },
      'Mandwi': { lat: 23.8000, lng: 91.1600, zoom: 14 },
      'Mohanpur': { lat: 23.9200, lng: 91.1800, zoom: 14 },
      'Old Agartala': { lat: 23.8400, lng: 91.2600, zoom: 14 },
      'Ranirbazar': { lat: 23.8600, lng: 91.3000, zoom: 14 },
      'Sidhai': { lat: 23.7400, lng: 91.2200, zoom: 14 },

      'Dharmanagar': { lat: 24.3667, lng: 92.1667, zoom: 14 },
      'Kailashahar': { lat: 24.3300, lng: 92.0000, zoom: 14 },
      'Kadamtala': { lat: 24.4200, lng: 92.1200, zoom: 14 },
      'Panisagar': { lat: 24.2800, lng: 92.2400, zoom: 14 },
      'Kumarghat': { lat: 24.2200, lng: 92.0600, zoom: 14 },

      'Belonia': { lat: 23.2500, lng: 91.4500, zoom: 14 },
      'Rajnagar': { lat: 23.3200, lng: 91.3800, zoom: 14 },
      'Rupaichhari': { lat: 23.1800, lng: 91.5200, zoom: 14 },
      'Sabroom': { lat: 23.0000, lng: 91.7000, zoom: 14 },
      'Satchand': { lat: 23.1200, lng: 91.4800, zoom: 14 },
      'Udaipur': { lat: 23.5333, lng: 91.4833, zoom: 14 },

      // Telangana villages
      'Asifabad': { lat: 19.3500, lng: 79.2833, zoom: 14 },
      'Bela': { lat: 19.4200, lng: 79.1800, zoom: 14 },
      'Boath': { lat: 19.2800, lng: 79.4200, zoom: 14 },
      'Gudihathnoor': { lat: 19.1600, lng: 79.5600, zoom: 14 },
      'Ichoda': { lat: 19.4800, lng: 79.3200, zoom: 14 },
      'Jainoor': { lat: 19.0800, lng: 79.6800, zoom: 14 },
      'Kerameri': { lat: 19.3800, lng: 79.4600, zoom: 14 },
      'Kubeer': { lat: 19.2400, lng: 79.5200, zoom: 14 },
      'Mudhole': { lat: 19.1200, lng: 79.6200, zoom: 14 },
      'Narnoor': { lat: 19.0400, lng: 79.7400, zoom: 14 },
      'Tamsi': { lat: 19.4400, lng: 79.2600, zoom: 14 },
      'Talamadugu': { lat: 19.3200, lng: 79.3800, zoom: 14 },
      'Utnoor': { lat: 19.0000, lng: 79.8000, zoom: 14 },
      'Wankidi': { lat: 19.1800, lng: 79.5800, zoom: 14 },

      'Aswaraopeta': { lat: 17.2400, lng: 81.1200, zoom: 14 },
      'Bhadrachalam': { lat: 17.6688, lng: 80.8936, zoom: 14 },
      'Burgampahad': { lat: 17.4200, lng: 80.7800, zoom: 14 },
      'Chintoor': { lat: 17.1800, lng: 81.2600, zoom: 14 },
      'Dummugudem': { lat: 17.5600, lng: 80.5200, zoom: 14 },
      'Gundala': { lat: 17.3800, lng: 80.9400, zoom: 14 },
      'Julurpad': { lat: 17.1200, lng: 81.3800, zoom: 14 },
      'Kukunoor': { lat: 17.4800, lng: 80.6600, zoom: 14 },
      'Kunavaram': { lat: 17.0600, lng: 81.4400, zoom: 14 },
      'Madhira': { lat: 16.9400, lng: 80.3800, zoom: 14 },
      'Mudigonda': { lat: 17.0800, lng: 80.4400, zoom: 14 },
      'Nelakondapalli': { lat: 17.0200, lng: 80.5800, zoom: 14 },
      'Penuballi': { lat: 17.1600, lng: 80.7200, zoom: 14 },
      'Pinapaka': { lat: 17.3200, lng: 80.8800, zoom: 14 },
      'Raghunathapalem': { lat: 17.2800, lng: 80.9800, zoom: 14 },
      'Singareni': { lat: 17.4600, lng: 80.7400, zoom: 14 },
      'Sujathanagar': { lat: 17.3600, lng: 80.8200, zoom: 14 },
      'Thirumalayapalem': { lat: 17.2200, lng: 81.0400, zoom: 14 },
      'Tirumalayapalem': { lat: 17.2000, lng: 81.0600, zoom: 14 },
      'Velairpadu': { lat: 17.1400, lng: 81.1800, zoom: 14 },
      'Wyra': { lat: 17.2600, lng: 80.8600, zoom: 14 },
      'Yellandu': { lat: 17.5900, lng: 80.3300, zoom: 14 },

      'Eturnagaram': { lat: 18.3167, lng: 79.9833, zoom: 14 },
      'Govindaraopet': { lat: 18.2800, lng: 80.1200, zoom: 14 },
      'Mangapet': { lat: 18.4200, lng: 79.8600, zoom: 14 },
      'Mulugu': { lat: 18.1924, lng: 79.9289, zoom: 14 },
      'Tadvai': { lat: 18.3600, lng: 79.7800, zoom: 14 },
      'Venkatapuram': { lat: 18.2400, lng: 80.0800, zoom: 14 },
      'Wazeedu': { lat: 18.1600, lng: 80.0400, zoom: 14 },
      'Aswapuram': { lat: 17.2400, lng: 80.5200, zoom: 14 }
    };
    return villageCoordinates;
  };

  // Get coordinates based on selection priority
  const getLocationCoordinates = () => {
    const villageCoords = getVillageCoordinates();

    // If village is selected and exists in our database, use exact village coordinates
    if (filters.village && villageCoords[filters.village]) {
      return villageCoords[filters.village];
    }

    // Fallback to district coordinates
    const districtCoordinates: { [key: string]: { lat: number; lng: number; zoom: number } } = {
      // Jharkhand districts
      'Ranchi': { lat: 23.3441, lng: 85.3096, zoom: 10 },
      'East Singhbhum': { lat: 22.8046, lng: 86.2029, zoom: 10 },
      'West Singhbhum': { lat: 22.5562, lng: 85.0449, zoom: 10 },
      'Bokaro': { lat: 23.7957, lng: 85.9568, zoom: 10 },
      'Deoghar': { lat: 24.4823, lng: 86.6958, zoom: 10 },
      'Dumka': { lat: 24.2676, lng: 87.2497, zoom: 10 },
      'Giridih': { lat: 24.1970, lng: 86.3009, zoom: 10 },
      'Godda': { lat: 24.8267, lng: 87.2142, zoom: 10 },
      'Hazaribagh': { lat: 23.9929, lng: 85.3647, zoom: 10 },
      'Dhanbad': { lat: 23.7957, lng: 86.4304, zoom: 10 },

      // Madhya Pradesh districts
      'Dindori': { lat: 22.9417, lng: 81.0833, zoom: 10 },
      'Mandla': { lat: 22.5986, lng: 80.3714, zoom: 10 },
      'Jhabua': { lat: 22.7676, lng: 74.5953, zoom: 10 },
      'Balaghat': { lat: 21.8047, lng: 80.1847, zoom: 10 },
      'Betul': { lat: 21.9081, lng: 77.8986, zoom: 10 },
      'Chhindwara': { lat: 22.0572, lng: 78.9389, zoom: 10 },
      'Seoni': { lat: 22.0859, lng: 79.5431, zoom: 10 },

      // Odisha districts
      'Mayurbhanj': { lat: 21.9287, lng: 86.7350, zoom: 10 },
      'Sundargarh': { lat: 22.1167, lng: 84.0167, zoom: 10 },
      'Koraput': { lat: 18.8120, lng: 82.7108, zoom: 10 },
      'Kandhamal': { lat: 20.2333, lng: 84.0500, zoom: 10 },
      'Kalahandi': { lat: 19.9167, lng: 83.1667, zoom: 10 },
      'Rayagada': { lat: 19.1667, lng: 83.4167, zoom: 10 },

      // Tripura districts
      'West Tripura': { lat: 23.8315, lng: 91.2868, zoom: 10 },
      'North Tripura': { lat: 24.3167, lng: 92.1667, zoom: 10 },
      'South Tripura': { lat: 23.1667, lng: 91.4333, zoom: 10 },
      'Dhalai': { lat: 23.8500, lng: 91.9000, zoom: 10 },
      'Gomati': { lat: 23.5333, lng: 91.4667, zoom: 10 },
      'Khowai': { lat: 24.0667, lng: 91.6000, zoom: 10 },
      'Sepahijala': { lat: 23.7333, lng: 91.3667, zoom: 10 },
      'Unakoti': { lat: 24.3167, lng: 92.0167, zoom: 10 },

      // Telangana districts
      'Adilabad': { lat: 19.6700, lng: 78.5300, zoom: 10 },
      'Khammam': { lat: 17.2473, lng: 80.1514, zoom: 10 },
      'Mulugu': { lat: 18.1924, lng: 79.9289, zoom: 10 },
      'Bhadradri Kothagudem': { lat: 17.5500, lng: 80.6167, zoom: 10 },
      'Jayashankar Bhupalpally': { lat: 18.4167, lng: 79.6500, zoom: 10 },
      'Mahabubabad': { lat: 17.5981, lng: 80.0034, zoom: 10 }
    };

    if (filters.district && districtCoordinates[filters.district]) {
      return districtCoordinates[filters.district];
    }

    // Fallback to state coordinates
    const stateCoordinates: { [key: string]: { lat: number; lng: number; zoom: number } } = {
      'jh': { lat: 23.6102, lng: 85.2799, zoom: 8 },
      'mp': { lat: 22.9734, lng: 78.6569, zoom: 7 },
      'or': { lat: 20.9517, lng: 85.0985, zoom: 8 },
      'tr': { lat: 23.9408, lng: 91.9882, zoom: 9 },
      'tg': { lat: 18.1124, lng: 79.0193, zoom: 8 },
      'ap': { lat: 15.9129, lng: 79.7400, zoom: 7 },
      'as': { lat: 26.2006, lng: 92.9376, zoom: 7 },
      'br': { lat: 25.0961, lng: 85.3131, zoom: 7 },
      'cg': { lat: 21.2787, lng: 81.8661, zoom: 7 },
      'ga': { lat: 15.2993, lng: 74.1240, zoom: 9 },
      'gj': { lat: 23.0225, lng: 72.5714, zoom: 7 },
      'hp': { lat: 31.1048, lng: 77.1734, zoom: 7 },
      'ka': { lat: 15.3173, lng: 75.7139, zoom: 7 },
      'kl': { lat: 10.8505, lng: 76.2711, zoom: 8 },
      'mh': { lat: 19.7515, lng: 75.7139, zoom: 7 },
      'rj': { lat: 27.0238, lng: 74.2179, zoom: 7 },
      'tn': { lat: 11.1271, lng: 78.6569, zoom: 7 },
      'up': { lat: 26.8467, lng: 80.9462, zoom: 7 },
      'uk': { lat: 30.0668, lng: 79.0193, zoom: 7 },
      'wb': { lat: 22.9868, lng: 87.8550, zoom: 7 },
      'jk': { lat: 33.7782, lng: 76.5762, zoom: 7 }
    };

    if (filters.state && stateCoordinates[filters.state]) {
      return stateCoordinates[filters.state];
    }

    // Default India center
    return { lat: 20.593684, lng: 78.96288, zoom: 5 };
  };

  // Fallback to mock data
  const loadFallbackBoundaries = () => {
    clearPolygons();
    const newPolygons: any[] = [];
    let targetBoundary: TribalBoundary | AdministrativeBoundary | null = null;

    // If all four filters are selected, prioritize tribal boundary
    if (filters.state && filters.district && filters.village && filters.tribalGroup) {
      const tribalBoundary = getTribalBoundary(filters.state, filters.district, filters.village, filters.tribalGroup);
      if (tribalBoundary) {
        const polygon = createPolygon(tribalBoundary, true);
        if (polygon) {
          newPolygons.push(polygon);
          targetBoundary = tribalBoundary;
        }
      }
    }

    // If tribal boundary not found or not all filters selected, show administrative boundaries
    if (!targetBoundary) {
      if (filters.village) {
        const villageBoundary = getAdministrativeBoundary('village', filters.village);
        if (villageBoundary) {
          const polygon = createPolygon(villageBoundary, false);
          if (polygon) {
            newPolygons.push(polygon);
            targetBoundary = villageBoundary;
          }
        }
      }

      if (filters.district) {
        const districtBoundary = getAdministrativeBoundary('district', filters.district);
        if (districtBoundary) {
          const polygon = createPolygon(districtBoundary, false);
          if (polygon) {
            newPolygons.push(polygon);
            if (!targetBoundary) targetBoundary = districtBoundary;
          }
        }
      }

      if (filters.state) {
        const stateBoundary = getAdministrativeBoundary('state', filters.state);
        if (stateBoundary) {
          const polygon = createPolygon(stateBoundary, false);
          if (polygon) {
            newPolygons.push(polygon);
            if (!targetBoundary) targetBoundary = stateBoundary;
          }
        }
      }
    }

    setPolygons(newPolygons);

    // Update highlighted boundaries for display
    const boundaries = [];
    if (filters.state && filters.district && filters.village && filters.tribalGroup) {
      const tribalBoundary = getTribalBoundary(filters.state, filters.district, filters.village, filters.tribalGroup);
      if (tribalBoundary) {
        boundaries.push({
          type: 'tribal',
          name: `${tribalBoundary.tribalGroup} Tribal Area - ${tribalBoundary.village}`,
          color: '#FFD700',
          strokeWidth: 3,
          fillOpacity: 0.4
        });
      }
    } else {
      if (filters.state) {
        boundaries.push({
          type: 'state',
          name: filters.state,
          color: '#EF4444',
          strokeWidth: 2,
          fillOpacity: 0.2
        });
      }
      if (filters.district) {
        boundaries.push({
          type: 'district',
          name: filters.district,
          color: '#3B82F6',
          strokeWidth: 2,
          fillOpacity: 0.2
        });
      }
      if (filters.village) {
        boundaries.push({
          type: 'village',
          name: filters.village,
          color: '#10B981',
          strokeWidth: 2,
          fillOpacity: 0.2
        });
      }
    }

    setHighlightedBoundaries(boundaries);

    if (targetBoundary) {
      setTimeout(() => {
        fitMapToBounds(targetBoundary!);
      }, 100);
    }
  };

  // Update claims data from API
  const updateClaimsDataFromAPI = async (filters: any) => {
    try {
      const claimsResponse = await apiService.fetchClaimsData(filters);

      if (claimsResponse.success && claimsResponse.data.length > 0) {
        // Use the first record for popup display
        const firstRecord = claimsResponse.data[0];
        const claimsData = {
          individualRights: firstRecord.individualRights,
          communityRights: firstRecord.communityRights,
          forestResources: firstRecord.forestResources,
          totalArea: firstRecord.totalArea,
          households: firstRecord.households,
          approvalRate: firstRecord.approvalRate,
          level: filters.tribalGroup ? 'tribal' : filters.village ? 'village' : filters.district ? 'district' : 'state',
          location: filters.tribalGroup && filters.village ?
            `${filters.tribalGroup} Tribal Area - ${filters.village}` :
            filters.village ? `${filters.village} Village` :
              filters.district ? `${filters.district} District` :
                filters.state,
          tribalGroup: filters.tribalGroup
        };

        if (onClaimsDataUpdate) {
          onClaimsDataUpdate(claimsData);
        }

        setPopupData(claimsData);
        setShowPopup(true);
      } else {
        // No data found
        if (onClaimsDataUpdate) {
          onClaimsDataUpdate(null);
        }
        setShowPopup(false);
        setPopupData(null);
      }
    } catch (error) {
      console.error('Error fetching claims data:', error);
      if (onClaimsDataUpdate) {
        onClaimsDataUpdate(null);
      }
      setShowPopup(false);
      setPopupData(null);
    }
  };

  // Update claims data based on current filters (fallback)
  const updateClaimsData = (filters: any) => {
    let claimsData = null;

    if (filters.state && filters.district && filters.village && filters.tribalGroup) {
      // Tribal area level data
      claimsData = {
        individualRights: Math.floor(Math.random() * 20) + 5,
        communityRights: Math.floor(Math.random() * 10) + 2,
        forestResources: Math.floor(Math.random() * 8) + 1,
        totalArea: `${Math.floor(Math.random() * 100) + 20} hectares`,
        households: Math.floor(Math.random() * 30) + 10,
        approvalRate: `${Math.floor(Math.random() * 20) + 70}%`,
        level: 'tribal',
        location: `${filters.tribalGroup} Tribal Area - ${filters.village}`,
        tribalGroup: filters.tribalGroup
      };
    } else if (filters.village) {
      // Village level data
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
      // District level data
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
      // State level data
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

    // Show popup for claims data
    if (claimsData) {
      setPopupData(claimsData);
      setShowPopup(true);
    } else {
      setShowPopup(false);
      setPopupData(null);
    }
  };

  const getMapUrl = () => {
    const coordinates = getLocationCoordinates();

    let mapType = 'roadmap';
    if (mapView === 'satellite') {
      mapType = 'satellite';
    } else if (mapView === 'terrain') {
      mapType = 'terrain';
    }

    // Use Google Maps embed API for better reliability
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey && apiKey !== 'YOUR_API_KEY') {
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${coordinates.lat},${coordinates.lng}&zoom=${coordinates.zoom}&maptype=${mapType}`;
    } else {
      // Fallback to basic Google Maps URL
      return `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=${mapType}&z=${coordinates.zoom}&output=embed`;
    }
  };

  const getStateName = (stateKey: string) => {
    const stateNames: { [key: string]: string } = {
      'jh': 'Jharkhand',
      'mp': 'Madhya Pradesh',
      'or': 'Odisha',
      'tr': 'Tripura',
      'tg': 'Telangana',
      'ap': 'Andhra Pradesh',
      'as': 'Assam',
      'br': 'Bihar',
      'cg': 'Chhattisgarh',
      'ga': 'Goa',
      'gj': 'Gujarat',
      'hp': 'Himachal Pradesh',
      'ka': 'Karnataka',
      'kl': 'Kerala',
      'mh': 'Maharashtra',
      'rj': 'Rajasthan',
      'tn': 'Tamil Nadu',
      'up': 'Uttar Pradesh',
      'uk': 'Uttarakhand',
      'wb': 'West Bengal',
      'jk': 'Jammu & Kashmir'
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${selectedLayer === layer.id
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mapView === view.id
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
          {isMapLoaded ? (
            useIframeFallback ? (
              <iframe
                src={getMapUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FRA Atlas Map"
                key={`${getLocationCoordinates().lat}-${getLocationCoordinates().lng}-${getLocationCoordinates().zoom}-${mapView}`}
              ></iframe>
            ) : (
              <div ref={mapRef} className="w-full h-full"></div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Map...</h3>
                <p className="text-gray-600">
                  {mapLoadTimeout ? 'Switching to fallback map...' : 'Initializing Google Maps'}
                </p>
                {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY' ? (
                  <p className="text-sm text-yellow-600 mt-2">Using fallback map (no API key)</p>
                ) : null}
              </div>
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
                  {filters.tribalGroup && filters.village ?
                    `${filters.tribalGroup} Tribal Area - ${filters.village}` :
                    filters.village ? `${filters.village} Village` :
                      filters.district ? `${filters.district} District` :
                        getStateName(filters.state)}
                </div>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {/* Layer Control */}
            <div className="bg-white rounded-lg shadow-lg p-2">
              <button
                onClick={() => setShowStateBoundary(!showStateBoundary)}
                className={`p-2 rounded-lg transition-colors ${showStateBoundary ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Toggle State Boundary"
              >
                <i className="ri-map-pin-range-line text-xl"></i>
              </button>
            </div>

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

          <StateBoundaryLayer
            map={mapInstance}
            selectedState={filters.state}
            isVisible={showStateBoundary}
          />
        </div>

        {/* Claims Data Popup */}
        {showPopup && popupData && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{popupData?.location || 'Location'}</h3>
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
                  <div className="text-2xl font-bold text-blue-600">{popupData?.individualRights || 0}</div>
                  <div className="text-xs text-blue-700">Individual Rights</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{popupData?.communityRights || 0}</div>
                  <div className="text-xs text-green-700">Community Rights</div>
                </div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{popupData?.forestResources || 0}</div>
                <div className="text-xs text-purple-700">Forest Resources</div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Area:</span>
                  <span className="font-medium">{popupData?.totalArea || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Households:</span>
                  <span className="font-medium">{popupData?.households || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Rate:</span>
                  <span className="font-medium text-green-600">{popupData?.approvalRate || 'N/A'}</span>
                </div>
                {popupData?.tribalGroup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tribal Group:</span>
                    <span className="font-medium text-yellow-600">{popupData.tribalGroup}</span>
                  </div>
                )}
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
                {filters.tribalGroup && <span>Tribal Group: <strong>{filters.tribalGroup}</strong></span>}
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
