'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface SettlementLayerProps {
    map: L.Map | null;
    selectedState: string | null;
    selectedDistrict: string | null;
    isVisible: boolean;
}

export default function SettlementLayer({
    map,
    selectedState,
    selectedDistrict,
    isVisible
}: SettlementLayerProps) {
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
                            properties: { type: "Settlement", name: "Village Center" },
                            geometry: {
                                type: "Polygon",
                                coordinates: [[
                                    [centerLng + 0.01, centerLat - 0.03],
                                    [centerLng + 0.02, centerLat - 0.03],
                                    [centerLng + 0.02, centerLat - 0.02],
                                    [centerLng + 0.01, centerLat - 0.02],
                                    [centerLng + 0.01, centerLat - 0.03]
                                ]]
                            }
                        }
                    ]
                };

                if (layerRef.current) map.removeLayer(layerRef.current);

                const layer = L.geoJSON(mockGeoJSON as any, {
                    style: {
                        color: "#7f1d1d", // Red-900
                        weight: 1,
                        fillColor: "#7f1d1d",
                        fillOpacity: 0.4
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindTooltip(`Settlement: ${feature.properties.name}`, { sticky: true });
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
                console.error("Error loading Settlement Layer:", error);
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
