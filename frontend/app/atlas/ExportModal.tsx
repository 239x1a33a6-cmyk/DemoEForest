import React, { useState } from 'react';
import { ExportFormat, ExportOptions } from '@/types/atlas';

interface ExportModalProps {
    onExport: (format: ExportFormat, options: ExportOptions) => void;
    onClose: () => void;
    isExporting: boolean;
}

export default function ExportModal({ onExport, onClose, isExporting }: ExportModalProps) {
    const [format, setFormat] = useState<ExportFormat>('png');
    const [options, setOptions] = useState<ExportOptions>({
        format: 'png',
        includeFilters: true,
        includeLegend: true,
        includeMetadata: true,
        quality: 0.95,
    });

    const handleExport = () => {
        onExport(format, options);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Export Map Data</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {isExporting ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900">Exporting...</h3>
                            <p className="text-gray-500">Please wait while we prepare your file.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Format Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['png', 'jpg', 'pdf'].map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setFormat(fmt as ExportFormat)}
                                            className={`p-3 border rounded-lg text-center transition-colors ${format === fmt
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {fmt.toUpperCase()}
                                        </button>
                                    ))}
                                    {['excel', 'geojson', 'shapefile'].map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setFormat(fmt as ExportFormat)}
                                            className={`p-3 border rounded-lg text-center transition-colors ${format === fmt
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {fmt === 'shapefile' ? 'SHP' : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={options.includeLegend}
                                            onChange={(e) => setOptions({ ...options, includeLegend: e.target.checked })}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Include Map Legend</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={options.includeFilters}
                                            onChange={(e) => setOptions({ ...options, includeFilters: e.target.checked })}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Include Current Filters</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={options.includeMetadata}
                                            onChange={(e) => setOptions({ ...options, includeMetadata: e.target.checked })}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Include Metadata & Attribution</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleExport}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <i className="ri-download-line"></i>
                                Download {format.toUpperCase()}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
