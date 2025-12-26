'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

/**
 * FRA Patta holder data
 */
interface FRAPattaHolder {
    lat: number;
    lng: number;
    name: string;
    landArea: number; // in hectares
    village: string;
    claimType: 'IFR' | 'CFR'; // Individual or Community Forest Rights
}

/**
 * Props for FRALayer component
 */
interface FRALayerProps {
    map: L.Map | null;
    selectedState: string | null;
    isVisible: boolean;
}

/**
 * Generate mock FRA patta data for a state
 */
function generateFRAPattaData(stateName: string): FRAPattaHolder[] {
    const stateData: Record<string, FRAPattaHolder[]> = {
        'Telangana': [
            { lat: 19.3500, lng: 79.2833, name: 'Ramesh Kumar', landArea: 2.5, village: 'Asifabad', claimType: 'IFR' },
            { lat: 17.6688, lng: 80.8936, name: 'Lakshmi Devi', landArea: 1.8, village: 'Bhadrachalam', claimType: 'IFR' },
            { lat: 18.1924, lng: 79.9289, name: 'Mulugu Tribal Community', landArea: 45.0, village: 'Mulugu', claimType: 'CFR' },
            { lat: 17.2400, lng: 81.1200, name: 'Suresh Rao', landArea: 3.2, village: 'Aswaraopeta', claimType: 'IFR' },
            { lat: 18.3167, lng: 79.9833, name: 'Eturnagaram Community', landArea: 38.5, village: 'Eturnagaram', claimType: 'CFR' }
        ],
        'Madhya Pradesh': [
            { lat: 22.9200, lng: 81.1000, name: 'Dinesh Patel', landArea: 2.1, village: 'Amarpur', claimType: 'IFR' },
            { lat: 22.4300, lng: 80.1100, name: 'Nainpur Tribal Group', landArea: 52.0, village: 'Nainpur', claimType: 'CFR' },
            { lat: 22.3167, lng: 74.3667, name: 'Bhil Community', landArea: 68.5, village: 'Alirajpur', claimType: 'CFR' },
            { lat: 22.4200, lng: 74.5600, name: 'Ravi Singh', landArea: 1.9, village: 'Jobat', claimType: 'IFR' },
            { lat: 22.6200, lng: 80.4000, name: 'Gond Tribal Council', landArea: 42.0, village: 'Bichhiya', claimType: 'CFR' }
        ],
        'Jharkhand': [
            { lat: 23.3800, lng: 85.1200, name: 'Santosh Mahato', landArea: 2.8, village: 'Angara', claimType: 'IFR' },
            { lat: 22.6900, lng: 85.6300, name: 'Ho Tribal Community', landArea: 55.0, village: 'Chakradharpur', claimType: 'CFR' },
            { lat: 22.5562, lng: 85.8444, name: 'Munda Community', landArea: 48.5, village: 'Chaibasa', claimType: 'CFR' },
            { lat: 22.4900, lng: 86.4800, name: 'Priya Kumari', landArea: 1.6, village: 'Baharagora', claimType: 'IFR' },
            { lat: 23.2200, lng: 85.1500, name: 'Oraon Tribal Group', landArea: 38.0, village: 'Sonahatu', claimType: 'CFR' }
        ],
        'Tripura': [
            { lat: 23.8315, lng: 91.2868, name: 'Tripuri Community', landArea: 32.0, village: 'Agartala', claimType: 'CFR' },
            { lat: 24.3667, lng: 92.1667, name: 'Reang Tribal Group', landArea: 28.5, village: 'Dharmanagar', claimType: 'CFR' },
            { lat: 23.2500, lng: 91.4500, name: 'Jamatia Community', landArea: 35.0, village: 'Belonia', claimType: 'CFR' },
            { lat: 23.8500, lng: 91.1200, name: 'Debbarma Singh', landArea: 2.3, village: 'Bishalgarh', claimType: 'IFR' }
        ]
    };

    return stateData[stateName] || [];
}

/**
 * Create custom FRA marker icon
 */
function createFRAIcon(claimType: 'IFR' | 'CFR'): L.DivIcon {
    const color = claimType === 'IFR' ? '#3b82f6' : '#10b981'; // Blue for IFR, Green for CFR
    const label = claimType === 'IFR' ? 'I' : 'C';

    return L.divIcon({
        html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
      ">${label}</div>
    `,
        className: 'fra-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
}

/**
 * FRALayer Component
 * 
 * Displays FRA (Forest Rights Act) Patta holder locations
 * Shows individual and community forest rights claims
 */
export default function FRALayer({ map, selectedState, isVisible }: FRALayerProps) {
    const layerGroupRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!map || !isVisible || !selectedState) {
            // Clean up existing layers
            if (layerGroupRef.current) {
                map?.removeLayer(layerGroupRef.current);
                layerGroupRef.current = null;
            }
            return;
        }

        // Generate FRA patta data for the selected state
        const fraPattaData = generateFRAPattaData(selectedState);

        if (fraPattaData.length === 0) {
            console.warn(`No FRA patta data for state: ${selectedState}`);
            return;
        }

        // Remove existing layer group
        if (layerGroupRef.current) {
            map.removeLayer(layerGroupRef.current);
        }

        // Create new layer group
        const layerGroup = L.layerGroup();

        // Add markers for each FRA patta holder
        fraPattaData.forEach(patta => {
            const marker = L.marker([patta.lat, patta.lng], {
                icon: createFRAIcon(patta.claimType)
            });

            // Add popup with patta holder information
            marker.bindPopup(`
        <div class="p-3 min-w-[220px]">
          <h4 class="font-bold text-gray-900 mb-2">${patta.name}</h4>
          <div class="text-sm space-y-1">
            <p><span class="font-medium">Village:</span> ${patta.village}</p>
            <p><span class="font-medium">Land Area:</span> ${patta.landArea} hectares</p>
            <p><span class="font-medium">Claim Type:</span> 
              <span class="px-2 py-0.5 rounded text-xs font-medium ${patta.claimType === 'IFR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                ${patta.claimType === 'IFR' ? 'Individual Forest Rights' : 'Community Forest Rights'}
              </span>
            </p>
            <p class="text-xs text-gray-500 mt-2">
              Coordinates: ${patta.lat.toFixed(4)}°N, ${patta.lng.toFixed(4)}°E
            </p>
          </div>
        </div>
      `);

            // Add to layer group
            marker.addTo(layerGroup);
        });

        // Add layer group to map
        layerGroup.addTo(map);
        layerGroupRef.current = layerGroup;

        // Cleanup
        return () => {
            if (layerGroupRef.current && map) {
                map.removeLayer(layerGroupRef.current);
                layerGroupRef.current = null;
            }
        };
    }, [map, selectedState, isVisible]);

    return null;
}
