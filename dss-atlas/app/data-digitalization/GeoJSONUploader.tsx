// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
'use client';

import React, { useState } from 'react';

interface GeoJSONUploaderProps {
    onUploadSuccess: (result: any) => void;
}

export default function GeoJSONUploader({ onUploadSuccess }: GeoJSONUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState('IFR');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.geojson') || droppedFile.name.endsWith('.json')) {
                setFile(droppedFile);
                setError(null);
            } else {
                setError('Please upload a .geojson or .json file');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.name.endsWith('.geojson') || selectedFile.name.endsWith('.json')) {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a .geojson or .json file');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', documentType);
        formData.append('uploaded_by', 'user@fra-atlas.org');

        try {
            const response = await fetch('/api/geo-ingest', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status === 'error') {
                setError(data.message || data.errors.join(', '));
                setIsUploading(false);
                return;
            }

            onUploadSuccess(data);
            setFile(null);
        } catch (err) {
            setError('Network error uploading GeoJSON');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Upload GeoJSON File
            </h3>

            <div className="space-y-4">
                {/* Document Type Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Claim Type
                    </label>
                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                    >
                        <option value="IFR">Individual Forest Rights (IFR)</option>
                        <option value="CR">Community Rights (CR)</option>
                        <option value="CFR">Community Forest Resource (CFR)</option>
                    </select>
                </div>

                {/* File Upload Area */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50"
                >
                    <input
                        type="file"
                        id="geojson-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".geojson,.json"
                    />
                    <label htmlFor="geojson-upload" className="cursor-pointer">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-1 font-medium">Drag & drop GeoJSON file</p>
                            <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                        </div>
                    </label>
                    {file && (
                        <div className="mt-4 p-2 bg-emerald-50 text-emerald-700 rounded text-sm font-medium flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {file.name}
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium shadow-sm transition-all
            ${!file || isUploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                        }`}
                >
                    {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Upload & Validate'
                    )}
                </button>
            </div>
        </div>
    );
}
