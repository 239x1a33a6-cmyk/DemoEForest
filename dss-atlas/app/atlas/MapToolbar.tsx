import React from 'react';

interface MapToolbarProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onGeolocate: () => void;
    onMeasure: () => void;
    onExport: () => void;
    onPrint: () => void;
    onShare: () => void;
}

export default function MapToolbar({
    onZoomIn,
    onZoomOut,
    onGeolocate,
    onMeasure,
    onExport,
    onPrint,
    onShare
}: MapToolbarProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col p-1 gap-1">
            <button
                onClick={onZoomIn}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="Zoom In"
            >
                <i className="ri-add-line text-lg"></i>
            </button>
            <button
                onClick={onZoomOut}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="Zoom Out"
            >
                <i className="ri-subtract-line text-lg"></i>
            </button>

            <div className="h-px bg-gray-200 my-1"></div>

            <button
                onClick={onGeolocate}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="My Location"
            >
                <i className="ri-crosshair-2-line text-lg"></i>
            </button>

            <button
                onClick={onMeasure}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="Measure Distance/Area"
            >
                <i className="ri-ruler-line text-lg"></i>
            </button>

            <div className="h-px bg-gray-200 my-1"></div>

            <button
                onClick={onExport}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="Export Map"
            >
                <i className="ri-download-line text-lg"></i>
            </button>

            <button
                onClick={onPrint}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="Print Map"
            >
                <i className="ri-printer-line text-lg"></i>
            </button>

            <button
                onClick={onShare}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors"
                title="Share View"
            >
                <i className="ri-share-line text-lg"></i>
            </button>
        </div>
    );
}
