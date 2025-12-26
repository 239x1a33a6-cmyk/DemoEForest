import React from 'react';
import { Layer, LayerType } from '@/types/atlas';
import { layerColors } from '@/lib/mapUtils';

interface LayerControlProps {
    layers: Layer[];
    onToggleLayer: (layerId: string) => void;
    onOpacityChange: (layerId: string, opacity: number) => void;
}

export default function LayerControl({ layers, onToggleLayer, onOpacityChange }: LayerControlProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-72 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-stack-line text-blue-600"></i>
                Layers
            </h3>

            <div className="space-y-3">
                {layers.map((layer) => (
                    <div key={layer.id} className="bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`layer-${layer.id}`}
                                    checked={layer.visible}
                                    onChange={() => onToggleLayer(layer.id)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <label
                                    htmlFor={`layer-${layer.id}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                                >
                                    <span
                                        className="w-3 h-3 rounded-full inline-block"
                                        style={{ backgroundColor: layer.color }}
                                    ></span>
                                    {layer.name}
                                </label>
                            </div>
                            {layer.icon && (
                                <i className={`${layer.icon} text-gray-400`}></i>
                            )}
                        </div>

                        {layer.visible && (
                            <div className="pl-6 pr-2">
                                <div className="flex items-center gap-2">
                                    <i className="ri-drop-line text-xs text-gray-400"></i>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={layer.opacity}
                                        onChange={(e) => onOpacityChange(layer.id, parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-500 w-8 text-right">
                                        {Math.round(layer.opacity * 100)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}
