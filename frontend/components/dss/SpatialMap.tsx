'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VillageData, MapFilters } from '@/types/dss';
import StateBoundaryLayer from '@/components/layers/StateBoundaryLayer';
import DistrictBoundaryLayer from '@/components/layers/DistrictBoundaryLayer';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SpatialMapProps {
  villages: VillageData[];
  filters: MapFilters;
  onVillageSelect: (village: VillageData) => void;
}

export default function SpatialMap({ villages, filters, onVillageSelect }: SpatialMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const polygonsRef = useRef<L.LayerGroup | null>(null);
  const heatmapRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current).setView([17.5551, 80.6245], 8);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Create layer groups
    markersRef.current = L.layerGroup().addTo(map);
    polygonsRef.current = L.layerGroup().addTo(map);
    heatmapRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Load and display Patta markers from CSV
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !polygonsRef.current) return;

    // Clear existing layers
    markersRef.current.clearLayers();
    polygonsRef.current.clearLayers();

    // CRITICAL: Only load pattas if BOTH state AND district are selected
    // Do NOT show markers if only state is selected
    if (filters.state === 'All' || filters.district === 'All') {
      return;
    }

    const loadPattaData = async () => {
      try {
        const response = await fetch('/data/fra_pattas_all_states.csv');
        const csvText = await response.text();

        // Parse CSV
        const lines = csvText.split('\n').slice(1); // Skip header
        const pattas = lines
          .filter(line => line.trim())
          .map(line => {
            const [id, holder_name, status, land_area_acres, latitude, longitude, village, district, state] = line.split(',');
            return {
              id: id?.trim(),
              holder_name: holder_name?.trim(),
              status: status?.trim(),
              land_area_acres: parseFloat(land_area_acres),
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              village: village?.trim(),
              district: district?.trim(),
              state: state?.trim()
            };
          });

        // Filter: MUST match BOTH state AND district
        const filteredPattas = pattas.filter(patta => {
          return patta.state === filters.state && patta.district === filters.district;
        });

        if (filteredPattas.length === 0) return;

        const bounds: L.LatLngBoundsExpression = [];

        filteredPattas.forEach(patta => {
          if (isNaN(patta.latitude) || isNaN(patta.longitude)) return;

          bounds.push([patta.latitude, patta.longitude]);

          // Only add markers if village-boundary layer is visible
          if (filters.visibleLayers.includes('village-boundary')) {
            // Status-based icon selection
            // Use separate icon files: green for APPROVED, red for PENDING
            // This provides clear visual distinction for government decision-making
            const iconUrl = patta.status === 'APPROVED'
              ? '/icons/green.png'  // Green icon for approved pattas
              : '/icons/red.png';   // Red icon for pending pattas

            const customIcon = L.icon({
              iconUrl: iconUrl,
              iconSize: [30, 30],
              iconAnchor: [15, 30],  // Bottom center alignment
              popupAnchor: [0, -30]
            });

            const marker = L.marker([patta.latitude, patta.longitude], { icon: customIcon })
              .bindPopup(createPattaPopupContent(patta));

            markersRef.current?.addLayer(marker);
          }
        });

        // Fit map to bounds
        if (bounds.length > 0 && mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

      } catch (error) {
        console.error('Error loading patta data:', error);
      }
    };

    loadPattaData();
  }, [filters.state, filters.district, filters.visibleLayers]);

  // Update heatmap when metric changes
  useEffect(() => {
    if (!mapRef.current || !heatmapRef.current) return;

    heatmapRef.current.clearLayers();

    if (!filters.visibleLayers.includes('heatmap') || villages.length === 0) return;

    // Create circle markers for heatmap effect
    villages.forEach(village => {
      const [lat, lng] = village.center;
      let intensity = 0;

      switch (filters.heatmapMetric) {
        case 'water':
          intensity = village.vulnerabilityScores.water;
          break;
        case 'livelihood':
          intensity = village.vulnerabilityScores.livelihood;
          break;
        case 'ecological':
          intensity = village.vulnerabilityScores.ecological;
          break;
        default:
          intensity = village.vulnerabilityScores.overall;
      }

      const circle = L.circle([lat, lng], {
        color: getVulnerabilityColor(intensity),
        fillColor: getVulnerabilityColor(intensity),
        fillOpacity: 0.4,
        radius: intensity * 100, // Scale radius based on intensity
        weight: 1
      }).bindPopup(`
        <div class="text-sm">
          <strong>${village.name}</strong><br/>
          ${filters.heatmapMetric.charAt(0).toUpperCase() + filters.heatmapMetric.slice(1)} Vulnerability: ${intensity.toFixed(1)}
        </div>
      `);

      heatmapRef.current?.addLayer(circle);
    });
  }, [villages, filters.heatmapMetric, filters.visibleLayers]);

  // Create popup content for Patta markers with scheme eligibility
  function createPattaPopupContent(patta: any): string {
    // Determine eligible schemes based on land area and status
    const schemes = [];

    // PM-KISAN eligibility: land area >= 1.0 acres
    if (patta.land_area_acres >= 1.0) {
      schemes.push('✓ PM-KISAN');
    }

    // MGNREGA: all are eligible
    schemes.push('✓ MGNREGA');

    // Fast-track benefit for pending pattas
    if (patta.status === 'PENDING') {
      schemes.push('⚠ Fast-track Approval Benefit');
    }

    const statusColor = patta.status === 'APPROVED' ? '#2ecc71' : '#e67e22';
    const statusText = patta.status === 'APPROVED' ? 'APPROVED' : 'PENDING';

    return `
      <div class="p-2 min-w-[250px]">
        <h3 class="font-bold text-lg mb-2">${patta.holder_name}</h3>
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-600">ID:</span>
            <span class="font-medium">${patta.id}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span class="font-bold" style="color: ${statusColor}">${statusText}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Land Area:</span>
            <span class="font-medium">${patta.land_area_acres.toFixed(2)} acres</span>
          </div>
          <div class="border-t border-gray-200 my-2"></div>
          <div class="flex justify-between">
            <span class="text-gray-600">Village:</span>
            <span class="font-medium">${patta.village}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">District:</span>
            <span class="font-medium">${patta.district}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">State:</span>
            <span class="font-medium">${patta.state}</span>
          </div>
          <div class="border-t border-gray-200 my-2"></div>
          <div>
            <span class="text-gray-700 font-semibold">Eligible Schemes:</span>
            <div class="mt-1 space-y-1">
              ${schemes.map(scheme => `<div class="text-xs">${scheme}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function createPopupContent(village: VillageData): string {
    return `
      <div class="p-2 min-w-[250px]">
        <h3 class="font-bold text-lg mb-2">${village.name}</h3>
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-600">District:</span>
            <span class="font-medium">${village.district}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Block:</span>
            <span class="font-medium">${village.block}</span>
          </div>
          <div class="border-t border-gray-200 my-2"></div>
          <div class="flex justify-between">
            <span class="text-gray-600">FRA Pattas Issued:</span>
            <span class="font-medium text-green-600">${village.pattaStats.totalIssued}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Pattas Pending:</span>
            <span class="font-medium text-orange-600">${village.pattaStats.totalPending}</span>
          </div>
          <div class="border-t border-gray-200 my-2"></div>
          <div class="flex justify-between">
            <span class="text-gray-600">Population:</span>
            <span class="font-medium">${village.population.total.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tribal Population:</span>
            <span class="font-medium">${village.population.tribalPopulation.toLocaleString()}</span>
          </div>
          <div class="border-t border-gray-200 my-2"></div>
          <div class="flex justify-between">
            <span class="text-gray-600">Overall Vulnerability:</span>
            <span class="font-medium" style="color: ${getVulnerabilityColor(village.vulnerabilityScores.overall)}">${village.vulnerabilityScores.overall.toFixed(1)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Category:</span>
            <span class="font-medium uppercase">${village.vulnerabilityScores.category}</span>
          </div>
        </div>
        <button 
          onclick="window.dispatchEvent(new CustomEvent('villageSelect', { detail: '${village.id}' }))"
          class="mt-3 w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
        >
          View Full Details
        </button>
      </div>
    `;
  }

  function getVulnerabilityColor(score: number): string {
    if (score >= 75) return '#dc2626'; // red-600 - Critical
    if (score >= 60) return '#f97316'; // orange-500 - High
    if (score >= 40) return '#eab308'; // yellow-500 - Medium
    return '#22c55e'; // green-500 - Low
  }

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-[600px] rounded-lg border border-gray-300 z-0" />

      {/* State Boundary Layer */}
      <StateBoundaryLayer
        map={mapRef.current}
        selectedState={filters.state === 'All' ? null : filters.state}
        isVisible={filters.state !== 'All'}
      />

      {/* District Boundary Layer */}
      <DistrictBoundaryLayer
        map={mapRef.current}
        selectedState={filters.state === 'All' ? null : filters.state}
        selectedDistrict={filters.district === 'All' ? null : filters.district}
        isVisible={filters.district !== 'All'}
      />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Vulnerability Scale</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Low (0-39)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
            <span>Medium (40-59)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span>High (60-74)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span>Critical (75-100)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
