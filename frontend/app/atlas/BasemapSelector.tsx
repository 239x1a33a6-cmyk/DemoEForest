import React from 'react';
import { MapStyle } from '@/types/atlas';

interface BasemapSelectorProps {
    currentStyle: string;
    onStyleChange: (styleId: string) => void;
}

export default function BasemapSelector({ currentStyle, onStyleChange }: BasemapSelectorProps) {
    const styles: MapStyle[] = [
        {
            id: 'satellite',
            name: 'Satellite',
            url: 'satellite', // ID used for internal mapping
            thumbnail: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/6/44/28'
        },
        {
            id: 'terrain',
            name: 'Terrain',
            url: 'terrain',
            thumbnail: 'https://tile.opentopomap.org/6/44/28.png'
        },
        {
            id: 'streets',
            name: 'Streets',
            url: 'streets',
            thumbnail: 'https://tile.openstreetmap.org/6/44/28.png'
        },
        {
            id: 'light',
            name: 'Light',
            url: 'light',
            thumbnail: 'https://basemaps.cartocdn.com/light_all/6/44/28.png'
        },
        {
            id: 'dark',
            name: 'Dark',
            url: 'dark',
            thumbnail: 'https://basemaps.cartocdn.com/dark_all/6/44/28.png'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
            {styles.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onStyleChange(style.id)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${currentStyle === style.id ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent hover:border-gray-300'
                        }`}
                    title={style.name}
                >
                    {/* We use a colored div as fallback if thumbnail fails or for simplicity */}
                    <div
                        className={`w-full h-full ${style.id.includes('satellite') ? 'bg-green-900' :
                            style.id.includes('dark') ? 'bg-gray-800' :
                                style.id.includes('light') ? 'bg-gray-100' :
                                    style.id.includes('outdoors') ? 'bg-green-100' : 'bg-blue-100'
                            }`}
                    >
                        {/* In a real app, we would use an Image component here */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-10">
                            <span className="text-[10px] font-bold text-white drop-shadow-md">{style.name}</span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
