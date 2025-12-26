// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Claim {
    claim_id: string;
    name?: string;
    village?: string;
    district?: string;
    state?: string;
    extent_ha?: number | null;
    lat?: number | null;
    lon?: number | null;
}

interface DocumentMapViewerProps {
    polygonPoints?: number[][];
    claims?: Claim[];
    geojson?: any;
}

export default function DocumentMapViewer({ polygonPoints, claims, geojson }: DocumentMapViewerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet library
        import('leaflet').then((L) => {
            if (mapRef.current) {
                mapRef.current.remove();
            }

            // Create map with default center
            const map = L.default.map(mapContainerRef.current!, {
                center: [20.5937, 78.9629], // Center of India
                zoom: 5,
            });

            // Add tile layer
            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const bounds: any[] = [];
            const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

            // Render claims as polygons
            if (claims && claims.length > 0) {
                claims.forEach((claim, index) => {
                    if (claim.lat && claim.lon) {
                        const centerLat = claim.lat;
                        const centerLon = claim.lon;

                        // Create a polygon around the center point
                        // Using extent_ha to determine polygon size
                        const areaHa = claim.extent_ha || 1;
                        // Approximate: 1 hectare ≈ 0.01 km² ≈ 0.003° at equator
                        const offset = Math.sqrt(areaHa) * 0.003;

                        const polygonCoords: [number, number][] = [
                            [centerLat + offset, centerLon - offset],
                            [centerLat + offset, centerLon + offset],
                            [centerLat - offset, centerLon + offset],
                            [centerLat - offset, centerLon - offset],
                        ];

                        const color = colors[index % colors.length];

                        const polygon = L.default.polygon(polygonCoords, {
                            color: color,
                            fillColor: color,
                            fillOpacity: 0.4,
                            weight: 2
                        }).addTo(map);

                        // Add popup with claim info
                        const popupContent = `
                            <div class="p-2">
                                <h3 class="font-bold text-lg mb-2">${claim.name || 'Unknown'}</h3>
                                <p class="text-sm"><strong>Area:</strong> ${claim.extent_ha?.toFixed(2) || 'N/A'} ha</p>
                                <p class="text-sm"><strong>Village:</strong> ${claim.village || 'N/A'}</p>
                                <p class="text-sm"><strong>District:</strong> ${claim.district || 'N/A'}</p>
                                <p class="text-sm"><strong>State:</strong> ${claim.state || 'N/A'}</p>
                            </div>
                        `;
                        polygon.bindPopup(popupContent);

                        // Add label with owner name
                        const icon = L.default.divIcon({
                            className: 'custom-label',
                            html: `<div style="
                                background: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                border: 2px solid ${color};
                                font-weight: bold;
                                font-size: 12px;
                                white-space: nowrap;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            ">${claim.name || 'Unknown'}</div>`,
                            iconSize: [0, 0],
                            iconAnchor: [0, 0]
                        });

                        L.default.marker([centerLat, centerLon], { icon }).addTo(map);

                        bounds.push([centerLat, centerLon]);
                    }
                });

                // Fit map to show all polygons
                if (bounds.length > 0) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
            // Fallback: old polygon points format
            else if (polygonPoints && polygonPoints.length > 0) {
                const latLngs: [number, number][] = polygonPoints.map(point => [point[0], point[1]] as [number, number]);

                const polygon = L.default.polygon(latLngs, {
                    color: 'purple',
                    fillColor: 'purple',
                    fillOpacity: 0.3,
                    weight: 2
                }).addTo(map);

                map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
            }

            mapRef.current = map;
            setIsLoaded(true);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [polygonPoints, claims, geojson]);

    return (
        <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300 relative z-0">
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                        <p className="text-gray-500">Loading map...</p>
                    </div>
                </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
}
