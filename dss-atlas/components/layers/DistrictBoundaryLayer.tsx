'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

/**
 * Props for DistrictBoundaryLayer component
 */
interface DistrictBoundaryLayerProps {
    map: L.Map | null; // Existing Leaflet Map instance
    selectedState: string | null; // State name (e.g., "Andhra Pradesh")
    selectedDistrict: string | null; // District name (e.g., "Adilabad")
    isVisible?: boolean; // Optional: Whether the layer should be visible
}

/**
 * DistrictBoundaryLayer Component
 * 
 * Adds district boundary polygons to an existing Leaflet map.
 * Loads GeoJSON from /public/data/districts/{State}.json
 * Filters by properties.DISTRICT
 * 
 * Features:
 * - Dynamic loading based on selected state
 * - Filters for specific district
 * - Custom styling (thicker border)
 * - Hover effects
 * - Click popup with coordinates
 * - Smooth zoom animation
 */
export default function DistrictBoundaryLayer({
    map,
    selectedState,
    selectedDistrict,
    isVisible = true
}: DistrictBoundaryLayerProps) {
    const districtLayerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        // Early return if map is not ready or required selections are missing
        if (!map || !selectedState || !selectedDistrict || !isVisible) {
            // Cleanup if we have a layer but conditions aren't met
            if (districtLayerRef.current && map) {
                map.removeLayer(districtLayerRef.current);
                districtLayerRef.current = null;
            }
            return;
        }

        const loadDistrictBoundary = async () => {
            try {
                // Remove existing layer before loading new one
                if (districtLayerRef.current) {
                    map.removeLayer(districtLayerRef.current);
                    districtLayerRef.current = null;
                }

                // Fetch state-specific district data from new dataset
                const response = await fetch(`/data/new_districts/${selectedState}.json`);

                if (!response.ok) {
                    throw new Error(`Failed to load district data for ${selectedState}`);
                }

                const geojsonData = await response.json();

                // Find the specific district feature
                // Case-insensitive matching for robustness
                // Using 'dtname' property from new dataset
                const districtFeature = geojsonData.features.find(
                    (feature: any) =>
                        feature.properties.dtname?.trim().toLowerCase() === selectedDistrict.trim().toLowerCase()
                );

                if (!districtFeature) {
                    console.warn(`District "${selectedDistrict}" not found in ${selectedState} data`);
                    return;
                }

                // Create GeoJSON layer
                const districtLayer = L.geoJSON(districtFeature, {
                    style: () => ({
                        color: '#333333',      // Darker border
                        weight: 3,             // Thicker border than state (2px -> 3px)
                        fillColor: '#FFD700',  // Gold fill for distinction
                        fillOpacity: 0.2       // Lower opacity to see underlying map
                    }),
                    onEachFeature: (feature, layer) => {
                        // Hover effects
                        layer.on('mouseover', function (this: L.Path) {
                            this.setStyle({
                                weight: 4,
                                fillOpacity: 0.4
                            });
                        });

                        layer.on('mouseout', function (this: L.Path) {
                            this.setStyle({
                                weight: 3,
                                fillOpacity: 0.2
                            });
                        });

                        // Click popup
                        layer.on('click', (e: L.LeafletMouseEvent) => {
                            const { lat, lng } = e.latlng;
                            const popupContent = `
                                <div style="padding: 8px; min-width: 150px;">
                                    <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">${selectedDistrict}</h3>
                                    <p style="margin: 0; font-size: 12px; color: #666;">${selectedState}</p>
                                    <div style="margin-top: 8px; font-size: 11px; color: #888;">
                                        Lat: ${lat.toFixed(4)}<br/>
                                        Lon: ${lng.toFixed(4)}
                                    </div>
                                </div>
                            `;
                            layer.bindPopup(popupContent).openPopup();
                        });
                    }
                });

                // Add to map
                districtLayer.addTo(map);
                districtLayerRef.current = districtLayer;

                // Animate zoom to district bounds
                const bounds = districtLayer.getBounds();
                map.flyToBounds(bounds, {
                    duration: 1.5,
                    padding: [50, 50],
                    maxZoom: 10 // Allow zooming in closer than state level
                });

            } catch (error) {
                console.error('Error loading district boundary:', error);
            }
        };

        loadDistrictBoundary();

        // Cleanup on unmount or dependency change
        return () => {
            if (districtLayerRef.current && map) {
                map.removeLayer(districtLayerRef.current);
                districtLayerRef.current = null;
            }
        };
    }, [map, selectedState, selectedDistrict, isVisible]);

    return null;
}
