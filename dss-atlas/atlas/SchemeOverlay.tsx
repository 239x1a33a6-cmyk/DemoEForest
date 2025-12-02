import React from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { SchemeRecommendation } from '@/types/atlas';

interface SchemeOverlayProps {
    schemes: SchemeRecommendation[];
    visible: boolean;
    activeSchemeType: string | 'all';
}

export default function SchemeOverlay({ schemes, visible, activeSchemeType }: SchemeOverlayProps) {
    if (!visible || !schemes.length) return null;

    // Filter schemes based on active type
    const filteredSchemes = activeSchemeType === 'all'
        ? schemes
        : schemes.filter(s => s.type === activeSchemeType);

    // Convert to GeoJSON
    const geoJsonData = {
        type: 'FeatureCollection',
        features: filteredSchemes.map(scheme => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [scheme.coordinates.lng, scheme.coordinates.lat]
            },
            properties: {
                id: scheme.id,
                name: scheme.name,
                type: scheme.type,
                priority: scheme.priority,
                budget: scheme.estimatedBudget,
                beneficiaries: scheme.beneficiaries
            }
        }))
    };

    return (
        <Source type="geojson" data={geoJsonData as any}>
            <Layer
                id="scheme-markers"
                type="circle"
                paint={{
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 4,
                        10, 8,
                        15, 12
                    ],
                    'circle-color': [
                        'match',
                        ['get', 'type'],
                        'JJM', '#3B82F6', // Blue
                        'MGNREGA', '#F59E0B', // Orange
                        'PM-KISAN', '#10B981', // Green
                        'DAJGUA', '#8B5CF6', // Purple
                        '#6B7280' // Default Gray
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.9
                }}
            />
            <Layer
                id="scheme-labels"
                type="symbol"
                layout={{
                    'text-field': ['get', 'type'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 10,
                    'text-offset': [0, 1.5],
                    'text-anchor': 'top'
                }}
                paint={{
                    'text-color': '#374151',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                }}
                minzoom={10}
            />
        </Source>
    );
}
