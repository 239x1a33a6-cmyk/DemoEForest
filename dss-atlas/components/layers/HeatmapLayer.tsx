'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

/**
 * Vulnerability data point
 */
interface VulnerabilityPoint {
    lat: number;
    lng: number;
    score: number; // 0-100
    name: string;
}

/**
 * Props for HeatmapLayer component
 */
interface HeatmapLayerProps {
    map: L.Map | null;
    selectedState: string | null;
    isVisible: boolean;
}

/**
 * Generate mock vulnerability data points for a state
 */
function generateVulnerabilityData(stateName: string): VulnerabilityPoint[] {
    const stateData: Record<string, VulnerabilityPoint[]> = {
        'Telangana': [
            { lat: 18.1124, lng: 79.0193, score: 85, name: 'Adilabad Region' },
            { lat: 17.5500, lng: 80.6167, score: 72, name: 'Bhadradri Kothagudem' },
            { lat: 18.1924, lng: 79.9289, score: 65, name: 'Mulugu' },
            { lat: 17.2473, lng: 80.1514, score: 58, name: 'Khammam' },
            { lat: 18.4167, lng: 79.6500, score: 45, name: 'Jayashankar Bhupalpally' }
        ],
        'Madhya Pradesh': [
            { lat: 22.9417, lng: 81.0833, score: 88, name: 'Dindori' },
            { lat: 22.5986, lng: 80.3714, score: 76, name: 'Mandla' },
            { lat: 22.7676, lng: 74.5953, score: 82, name: 'Jhabua' },
            { lat: 21.8047, lng: 80.1847, score: 68, name: 'Balaghat' },
            { lat: 22.0572, lng: 78.9389, score: 55, name: 'Chhindwara' }
        ],
        'Jharkhand': [
            { lat: 23.3441, lng: 85.3096, score: 78, name: 'Ranchi' },
            { lat: 22.8046, lng: 86.2029, score: 70, name: 'East Singhbhum' },
            { lat: 22.5562, lng: 85.0449, score: 85, name: 'West Singhbhum' },
            { lat: 24.4823, lng: 86.6958, score: 62, name: 'Deoghar' },
            { lat: 23.9929, lng: 85.3647, score: 48, name: 'Hazaribagh' }
        ],
        'Tripura': [
            { lat: 23.8315, lng: 91.2868, score: 65, name: 'West Tripura' },
            { lat: 24.3167, lng: 92.1667, score: 72, name: 'North Tripura' },
            { lat: 23.1667, lng: 91.4333, score: 68, name: 'South Tripura' },
            { lat: 23.8500, lng: 91.9000, score: 55, name: 'Dhalai' }
        ]
    };

    return stateData[stateName] || [];
}

/**
 * Get color based on vulnerability score
 */
function getVulnerabilityColor(score: number): string {
    if (score >= 75) return '#dc2626'; // Red - High
    if (score >= 50) return '#eab308'; // Yellow - Medium
    return '#22c55e'; // Green - Low
}

/**
 * HeatmapLayer Component
 * 
 * Displays vulnerability score heatmap using circle markers
 * Color-coded: Red (High) | Yellow (Mid) | Green (Low)
 */
export default function HeatmapLayer({ map, selectedState, isVisible }: HeatmapLayerProps) {
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

        // Generate vulnerability data for the selected state
        const vulnerabilityData = generateVulnerabilityData(selectedState);

        if (vulnerabilityData.length === 0) {
            console.warn(`No vulnerability data for state: ${selectedState}`);
            return;
        }

        // Remove existing layer group
        if (layerGroupRef.current) {
            map.removeLayer(layerGroupRef.current);
        }

        // Create new layer group
        const layerGroup = L.layerGroup();

        // Add circle markers for each vulnerability point
        vulnerabilityData.forEach(point => {
            const color = getVulnerabilityColor(point.score);

            // Create circle marker
            const circle = L.circle([point.lat, point.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
                radius: point.score * 150, // Scale radius based on score
                weight: 2
            });

            // Add popup
            circle.bindPopup(`
        <div class="p-2 min-w-[180px]">
          <h4 class="font-semibold text-gray-900 mb-1">${point.name}</h4>
          <div class="text-sm space-y-1">
            <p><span class="font-medium">Vulnerability Score:</span> <span style="color: ${color}; font-weight: bold;">${point.score}/100</span></p>
            <p class="text-xs text-gray-600">
              ${point.score >= 75 ? 'High Risk' : point.score >= 50 ? 'Medium Risk' : 'Low Risk'}
            </p>
          </div>
        </div>
      `);

            // Add to layer group
            circle.addTo(layerGroup);
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
