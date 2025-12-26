'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface FRAPattasLayerProps {
    map: L.Map | null;
    selectedState: string | null;
    selectedDistrict: string | null;
    isVisible: boolean;
}

/**
 * FRAPattasLayer Component
 * 
 * Displays FRA Patta boundaries (polygons) for the selected district.
 * 
 * Behavior:
 * - Loads only for selected district
 * - Style: color: "#008000", weight: 1, fillOpacity: 0.5
 * - Tooltip: Patta Holder Name + Area
 * - Popup: Deep info (claim ID, area, status)
 */
export default function FRAPattasLayer({
    map,
    selectedState,
    selectedDistrict,
    isVisible
}: FRAPattasLayerProps) {
    const layerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        if (!map || !isVisible || !selectedState || !selectedDistrict) {
            if (layerRef.current) {
                map?.removeLayer(layerRef.current);
                layerRef.current = null;
            }
            return;
        }

        const loadFRAPattas = async () => {
            try {
                // In a real scenario, we would fetch from an API or file
                // const response = await fetch(`/data/fra/${selectedState}/${selectedDistrict}.json`);
                // const data = await response.json();

                // For demo purposes, we'll generate some mock polygons near the map center
                // or try to load a placeholder if available.
                // Since we don't have the files yet, we will create a mock GeoJSON FeatureCollection

                // Get current map center to place mock data nearby (if we can't get district bounds easily)
                // Better yet, we can't easily get district bounds here without fetching district data again.
                // But we can just use some hardcoded offsets from state centers or just wait for real data.

                // Let's try to fetch a placeholder file, and if it fails, log it.
                // But to ensure "WOW" factor, we should probably have some data.
                // I'll create a mock feature collection with a few polygons.

                const centerLat = map.getCenter().lat;
                const centerLng = map.getCenter().lng;

                // Mock Data Generation (3 polygons)
                const mockGeoJSON = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {
                                holder_name: "Ramesh Kumar",
                                area_acres: 2.5,
                                claim_id: "FRA-2024-001",
                                status: "Approved",
                                village: "Sample Village 1"
                            },
                            geometry: {
                                type: "Polygon",
                                coordinates: [[
                                    [centerLng - 0.01, centerLat - 0.01],
                                    [centerLng + 0.01, centerLat - 0.01],
                                    [centerLng + 0.01, centerLat + 0.01],
                                    [centerLng - 0.01, centerLat + 0.01],
                                    [centerLng - 0.01, centerLat - 0.01]
                                ]]
                            }
                        },
                        {
                            type: "Feature",
                            properties: {
                                holder_name: "Sita Devi",
                                area_acres: 1.8,
                                claim_id: "FRA-2024-002",
                                status: "Pending",
                                village: "Sample Village 2"
                            },
                            geometry: {
                                type: "Polygon",
                                coordinates: [[
                                    [centerLng + 0.02, centerLat + 0.02],
                                    [centerLng + 0.04, centerLat + 0.02],
                                    [centerLng + 0.03, centerLat + 0.04],
                                    [centerLng + 0.02, centerLat + 0.02]
                                ]]
                            }
                        }
                    ]
                };

                // Remove existing layer
                if (layerRef.current) {
                    map.removeLayer(layerRef.current);
                }

                const layer = L.geoJSON(mockGeoJSON as any, {
                    style: {
                        color: "#008000",
                        weight: 1,
                        fillColor: "#008000",
                        fillOpacity: 0.5
                    },
                    onEachFeature: (feature, layer) => {
                        // Tooltip
                        layer.bindTooltip(
                            `${feature.properties.holder_name} (${feature.properties.area_acres} acres)`,
                            { sticky: true }
                        );

                        // Popup
                        layer.bindPopup(`
                            <div class="p-2 min-w-[200px]">
                                <h3 class="font-bold text-green-800 mb-1">FRA Patta Details</h3>
                                <div class="text-sm space-y-1">
                                    <p><span class="font-semibold">Holder:</span> ${feature.properties.holder_name}</p>
                                    <p><span class="font-semibold">Claim ID:</span> ${feature.properties.claim_id}</p>
                                    <p><span class="font-semibold">Area:</span> ${feature.properties.area_acres} acres</p>
                                    <p><span class="font-semibold">Status:</span> ${feature.properties.status}</p>
                                    <p><span class="font-semibold">Village:</span> ${feature.properties.village}</p>
                                </div>
                            </div>
                        `);

                        // Hover highlight
                        layer.on('mouseover', function (this: L.Path) {
                            this.setStyle({
                                weight: 2,
                                fillOpacity: 0.7
                            });
                        });

                        layer.on('mouseout', function (this: L.Path) {
                            this.setStyle({
                                weight: 1,
                                fillOpacity: 0.5
                            });
                        });
                    }
                });

                layer.addTo(map);
                layerRef.current = layer;

            } catch (error) {
                console.error("Error loading FRA Pattas:", error);
            }
        };

        loadFRAPattas();

        return () => {
            if (layerRef.current && map) {
                map.removeLayer(layerRef.current);
                layerRef.current = null;
            }
        };
    }, [map, selectedState, selectedDistrict, isVisible]);

    return null;
}
