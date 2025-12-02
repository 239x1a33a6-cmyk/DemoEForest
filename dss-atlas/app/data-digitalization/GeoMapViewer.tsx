// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ProcessedFeature } from '@/lib/geoValidator';

interface GeoMapViewerProps {
    features: ProcessedFeature[];
    onFeatureClick?: (feature: ProcessedFeature) => void;
}

export default function GeoMapViewer({ features, onFeatureClick }: GeoMapViewerProps) {
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

            // Create map
            const map = L.default.map(mapContainerRef.current!, {
                center: [22.5, 79.5],
                zoom: 6,
            });

            // Add tile layer
            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add features
            if (features.length > 0) {
                console.log('Rendering features:', features.length);
                const bounds: [number, number][] = [];

                features.forEach((feature, idx) => {
                    try {
                        if (!feature || !feature.geometry) {
                            console.warn('Invalid feature at index', idx, feature);
                            return;
                        }

                        let coordinates: any = [];

                        if (feature.geometry.type === 'Polygon') {
                            if (feature.geometry.coordinates && feature.geometry.coordinates[0]) {
                                coordinates = feature.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
                            }
                        } else if (feature.geometry.type === 'MultiPolygon') {
                            if (feature.geometry.coordinates && feature.geometry.coordinates[0] && feature.geometry.coordinates[0][0]) {
                                coordinates = feature.geometry.coordinates[0][0].map((coord: number[]) => [coord[1], coord[0]]);
                            }
                        }

                        if (coordinates.length > 0) {
                            const style = feature.render_style || {
                                strokeColor: '#3388ff',
                                fillColor: '#3388ff',
                                opacity: 0.2
                            };

                            const polygon = L.default.polygon(coordinates, {
                                color: style.strokeColor,
                                fillColor: style.fillColor,
                                fillOpacity: style.opacity,
                                weight: 2
                            }).addTo(map);

                            const props = feature.properties || {};
                            const popupContent = `
                  <div class="p-2">
                    <div class="font-bold text-sm mb-1">${props.claim_id || 'No ID'}</div>
                    <div class="text-xs space-y-1">
                      <div><strong>Type:</strong> ${props.claim_type || 'N/A'}</div>
                      <div><strong>Holder:</strong> ${props.holder_name || 'N/A'}</div>
                      <div><strong>Village:</strong> ${props.village_name || 'N/A'}</div>
                      <div><strong>Area:</strong> ${(props.area_ha || 0).toFixed(2)} ha</div>
                      <div><strong>Confidence:</strong> ${((props.confidence || 0) * 100).toFixed(0)}%</div>
                      ${props.flags && props.flags.length > 0 ? `<div class="text-red-600"><strong>Flags:</strong> ${props.flags.join(', ')}</div>` : ''}
                    </div>
                  </div>
                `;

                            polygon.bindPopup(popupContent);

                            if (onFeatureClick) {
                                polygon.on('click', () => onFeatureClick(feature));
                            }

                            // Collect bounds
                            coordinates.forEach((coord: [number, number]) => bounds.push(coord));
                        } else {
                            console.warn('No valid coordinates for feature', idx);
                        }
                    } catch (err) {
                        console.error('Error rendering feature', idx, err);
                    }
                });

                // Fit map to bounds
                if (bounds.length > 0) {
                    try {
                        map.fitBounds(bounds, { padding: [50, 50] });
                    } catch (err) {
                        console.error('Error fitting bounds:', err);
                    }
                }
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
    }, [features, onFeatureClick]);

    if (features.length === 0) {
        return (
            <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p>Upload a GeoJSON file to view features on the map</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Map Preview
                </h3>
                <div className="mt-2 flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                        <span className="text-gray-600">High Confidence (≥0.85)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-gray-600">Medium (0.5-0.85)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-gray-600">Low (&lt;0.5)</span>
                    </div>
                </div>
            </div>

            <div className="h-[500px] relative z-0">
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
        </div>
    );
}
