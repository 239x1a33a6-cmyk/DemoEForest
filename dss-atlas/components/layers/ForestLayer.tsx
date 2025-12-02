'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface ForestLayerProps {
    map: L.Map | null;
    selectedState: string | null;
    selectedDistrict: string | null;
    isVisible: boolean;
}

export default function ForestLayer({
    map,
    selectedState,
    selectedDistrict,
    isVisible
}: ForestLayerProps) {
    const layerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        if (!map || !isVisible || !selectedState || !selectedDistrict) {
            if (layerRef.current) {
                map?.removeLayer(layerRef.current);
                layerRef.current = null;
            }
            return;
        }

        const loadLayer = async () => {
            try {
                const centerLat = map.getCenter().lat;
                const centerLng = map.getCenter().lng;

                const mockGeoJSON = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: { type: "Forest", density: "Dense" },
                            geometry: {
                                type: "Polygon",
                                coordinates: [[
                                    [centerLng - 0.08, centerLat + 0.02],
                                    [centerLng - 0.05, centerLat + 0.02],
                                    [centerLng - 0.05, centerLat + 0.05],
                                    [centerLng - 0.08, centerLat + 0.05],
                                    [centerLng - 0.08, centerLat + 0.02]
                                ]]
                            }
                        }
                    ]
                };

                if (layerRef.current) map.removeLayer(layerRef.current);

                const layer = L.geoJSON(mockGeoJSON as any, {
                    style: {
                        color: "#166534", // Green-800
                        weight: 1,
                        fillColor: "#166534",
                        fillOpacity: 0.4
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindTooltip(`Forest: ${feature.properties.density}`, { sticky: true });
                        layer.on('mouseover', function (this: L.Path) {
                            this.setStyle({ fillOpacity: 0.7, weight: 2 });
                        });
                        layer.on('mouseout', function (this: L.Path) {
                            this.setStyle({ fillOpacity: 0.4, weight: 1 });
                        });
                    }
                });

                layer.addTo(map);
                layerRef.current = layer;

            } catch (error) {
                console.error("Error loading Forest Layer:", error);
            }
        };

        loadLayer();

        return () => {
            if (layerRef.current && map) {
                map.removeLayer(layerRef.current);
                layerRef.current = null;
            }
        };
    }, [map, selectedState, selectedDistrict, isVisible]);

    return null;
}
