import React from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';

interface HeatmapLayerProps {
    data: any; // GeoJSON feature collection of points
    visible: boolean;
    type: 'water' | 'livelihood' | 'dss';
}

export default function HeatmapLayer({ data, visible, type }: HeatmapLayerProps) {
    if (!visible || !data) return null;

    // Define color gradients based on type
    const getHeatmapColors = () => {
        switch (type) {
            case 'water':
                return [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(33,102,172,0)',
                    0.2, 'rgb(103,169,207)',
                    0.4, 'rgb(209,229,240)',
                    0.6, 'rgb(253,219,199)',
                    0.8, 'rgb(239,138,98)',
                    1, 'rgb(178,24,43)'
                ];
            case 'livelihood':
                return [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(0,104,55,0)',
                    0.2, 'rgb(102,189,99)',
                    0.4, 'rgb(217,240,211)',
                    0.6, 'rgb(254,224,139)',
                    0.8, 'rgb(253,174,97)',
                    1, 'rgb(215,48,39)'
                ];
            default: // DSS
                return [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(255,255,204,0)',
                    0.2, 'rgb(255,237,160)',
                    0.4, 'rgb(254,217,118)',
                    0.6, 'rgb(254,178,76)',
                    0.8, 'rgb(253,141,60)',
                    1, 'rgb(227,26,28)'
                ];
        }
    };

    return (
        <Source type="geojson" data={data}>
            <Layer
                id={`heatmap-${type}`}
                type="heatmap"
                paint={{
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'score'], // Assuming 'score' property exists in data
                        0, 0,
                        100, 1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        9, 3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': getHeatmapColors() as any,
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 2,
                        9, 20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7, 1,
                        9, 0
                    ]
                }}
            />
        </Source>
    );
}
