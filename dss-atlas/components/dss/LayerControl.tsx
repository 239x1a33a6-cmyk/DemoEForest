'use client';

import { useState } from 'react';

/**
 * Layer configuration
 */
interface Layer {
    id: string;
    name: string;
    icon: string;
    enabled: boolean;
}

/**
 * Props for LayerControl component
 */
interface LayerControlProps {
    onLayerToggle: (layerId: string, enabled: boolean) => void;
    initialLayers?: Record<string, boolean>;
}

/**
 * LayerControl Component
 * 
 * Provides toggles for different map layers:
 * - State Boundaries
 * - Heatmap (Vulnerability)
 * - FRA Pattas
 */
export default function LayerControl({ onLayerToggle, initialLayers }: LayerControlProps) {
    const [layers, setLayers] = useState<Layer[]>([
        {
            id: 'state-boundary',
            name: 'State Boundary',
            icon: 'ri-map-pin-range-line',
            enabled: initialLayers?.['state-boundary'] ?? true
        },
        {
            id: 'heatmap',
            name: 'Vulnerability Heatmap',
            icon: 'ri-fire-line',
            enabled: initialLayers?.['heatmap'] ?? true
        },
        {
            id: 'fra-pattas',
            name: 'FRA Pattas',
            icon: 'ri-user-location-line',
            enabled: initialLayers?.['fra-pattas'] ?? true
        }
    ]);

    const handleToggle = (layerId: string) => {
        setLayers(prevLayers =>
            prevLayers.map(layer => {
                if (layer.id === layerId) {
                    const newEnabled = !layer.enabled;
                    onLayerToggle(layerId, newEnabled);
                    return { ...layer, enabled: newEnabled };
                }
                return layer;
            })
        );
    };

    return (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] min-w-[200px]">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="ri-stack-line"></i>
                Layer Control
            </h4>

            <div className="space-y-2">
                {layers.map(layer => (
                    <label
                        key={layer.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={layer.enabled}
                            onChange={() => handleToggle(layer.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <i className={`${layer.icon} text-gray-600`}></i>
                        <span className="text-sm text-gray-700 flex-1">{layer.name}</span>
                    </label>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                    Toggle layers on/off to customize your view
                </p>
            </div>
        </div>
    );
}
