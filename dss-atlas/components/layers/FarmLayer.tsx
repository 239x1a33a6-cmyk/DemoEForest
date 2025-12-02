'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface FarmLayerProps {
    map: L.Map | null;
    selectedState: string | null;
    selectedDistrict: string | null;
    isVisible: boolean;
}

export default function FarmLayer({
    map,
    selectedState,
    selectedDistrict,
    isVisible
}: FarmLayerProps) {
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
                            properties: { type: "Farm", crop: "Rice" },
                            geometry: {
                                type: "Polygon",
                                coordinates: [[
                                    [centerLng + 0.05, centerLat + 0.05],
                                    [centerLng + 0.07, centerLat + 0.05],
                                    [centerLng + 0.07, centerLat + 0.07],
                                    [centerLng + 0.05, centerLat + 0.07],
                                    [centerLng + 0.05, centerLat + 0.05]
                                ]]
                            }
                        }
                    ]
                };

                if (layerRef.current) map.removeLayer(layerRef.current);

                const layer = L.geoJSON(mockGeoJSON as any, {
                    style: {
                        color: "#eab308", // Yellow/Gold
                        weight: 1,
                        fillColor: "#eab308",
                        fillOpacity: 0.4
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindTooltip(`Farm: ${feature.properties.crop}`, { sticky: true });
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
                console.error("Error loading Farm Layer:", error);
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
