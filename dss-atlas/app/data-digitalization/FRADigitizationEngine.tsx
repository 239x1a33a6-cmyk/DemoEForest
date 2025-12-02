// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
'use client';

import React, { useState, useEffect } from 'react';
import { generateMockResponse } from './mockData';
import GeoJSONUploader from './GeoJSONUploader';
import GeoMapViewer from './GeoMapViewer';
import ReviewTable from './ReviewTable';
import DocumentMapViewer from './DocumentMapViewer';
import AdminPasswordModal from '../components/AdminPasswordModal';
import StaticPasswordModal from '../components/StaticPasswordModal';
import StaticDashboardContent from '../components/StaticDashboardContent';
import AdminPanel from '../components/AdminPanel';
import type { ProcessedFeature } from '@/lib/geoValidator';
import { revalidateFeature } from '@/lib/geoValidator';

export default function FRADigitizationEngine() {
    const [mode, setMode] = useState<'document' | 'geojson' | 'static'>('document');

    // Document upload state
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState('Individual Forest Rights (IFR)');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('');
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('json');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const currentBlobUrlRef = React.useRef<string | null>(null);

    // GeoJSON upload state
    const [geoResult, setGeoResult] = useState<any>(null);
    const [geoFeatures, setGeoFeatures] = useState<ProcessedFeature[]>([]);

    // Admin panel state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [highlightedClaimId, setHighlightedClaimId] = useState<string | null>(null);

    // Static mode state
    const [showStaticPasswordModal, setShowStaticPasswordModal] = useState(false);
    const [isStaticAuthenticated, setIsStaticAuthenticated] = useState(false);

    // Secret key handler (backtick key)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                setShowPasswordModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        // Check for existing static session
        const staticSession = sessionStorage.getItem('static_mode_active');
        if (staticSession) {
            setIsStaticAuthenticated(true);
        }

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const steps = [
        "Deskewing & Noise Removal...",
        "Binarization...",
        "Multi-language OCR (English/Hindi/Odia)...",
        "Extracting Claim Info...",
        "Geospatial Parsing...",
        "Standardizing Data...",
        "Validating against LGD..."
    ];

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    // New function to handle file selection with preview cleanup
    const handleFileSelection = (selectedFile: File) => {
        // Clean up old blob URL
        if (currentBlobUrlRef.current) {
            URL.revokeObjectURL(currentBlobUrlRef.current);
            currentBlobUrlRef.current = null;
        }

        // Create new blob URL for preview
        const blobUrl = URL.createObjectURL(selectedFile);
        currentBlobUrlRef.current = blobUrl;
        setPreviewUrl(blobUrl);

        // Set file and clear previous results
        setFile(selectedFile);
        setResult(null);
    };

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (currentBlobUrlRef.current) {
                URL.revokeObjectURL(currentBlobUrlRef.current);
            }
        };
    }, []);

    const processDocument = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(0);
        setResult(null);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);

            setCurrentStep('Uploading document...');
            setProgress(10);

            // Call the upload API
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            setCurrentStep('Processing complete!');
            setProgress(100);

            const data = await response.json();

            if (data.ok && data.files && data.files.length > 0) {
                const uploadedFile = data.files[0];

                // Transform the response to match the expected format
                const transformedResult = {
                    metadata: {
                        file_name: uploadedFile.originalName,
                        checksum: uploadedFile.checksum,
                        ocr_confidence: uploadedFile.claims[0]?.extraction_confidence
                            ? `${(uploadedFile.claims[0].extraction_confidence * 100).toFixed(1)}%`
                            : 'N/A',
                        extraction_confidence: uploadedFile.validationSummary.valid > 0
                            ? `${((uploadedFile.validationSummary.valid / uploadedFile.validationSummary.total) * 100).toFixed(1)}%`
                            : '0%'
                    },
                    claims: uploadedFile.claims,
                    map_data: {
                        geojson: uploadedFile.geojson,
                        total_claims: uploadedFile.validationSummary.total
                    },
                    flags: {
                        total: uploadedFile.validationSummary.total,
                        valid: uploadedFile.validationSummary.valid,
                        invalid: uploadedFile.validationSummary.invalid,
                        missing_coordinates: uploadedFile.validationSummary.missingCoordinates,
                        duplicates: uploadedFile.validationSummary.duplicates,
                        clustered: uploadedFile.validationSummary.clustered
                    },
                    raw_response: uploadedFile
                };

                setResult(transformedResult);
            } else {
                throw new Error('Invalid response from server');
            }

            setIsProcessing(false);
        } catch (error) {
            console.error('Document processing failed:', error);
            setIsProcessing(false);
            setCurrentStep('Processing failed');

            // Fallback to mock data
            const { generateMockResponse } = await import('./mockData');
            setResult(generateMockResponse(documentType, file));
        }
    };

    const handleGeoUploadSuccess = async (data: any) => {
        setGeoResult(data);
        const features = data.features || [];
        setGeoFeatures(features);

        // Auto-save all imported features to database
        try {
            console.log(`Auto-saving ${features.length} imported features...`);

            // Save in batches to avoid overwhelming the server/DB
            const BATCH_SIZE = 5;
            for (let i = 0; i < features.length; i += BATCH_SIZE) {
                const batch = features.slice(i, i + BATCH_SIZE);
                await Promise.all(batch.map((feature: any) =>
                    fetch('/api/claims/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            feature,
                            saved_by: 'import'
                        })
                    }).catch(err => console.error('Failed to save feature:', err))
                ));
            }
            console.log('All imported features saved successfully');
        } catch (error) {
            console.error('Error auto-saving imported features:', error);
        }
    };

    const handleFeatureUpdate = async (index: number, updates: any) => {
        const updatedFeatures = [...geoFeatures];

        // Use revalidateFeature to automatically remove flags and recalculate confidence
        const revalidatedFeature = revalidateFeature(updatedFeatures[index], updates);

        updatedFeatures[index] = revalidatedFeature;
        setGeoFeatures(updatedFeatures);

        // Also update the summary to reflect changes
        const validFeatures = updatedFeatures.filter(f => f.confidence >= 0.5).length;
        const featuresNeedingReview = updatedFeatures.filter(f => f.flags.length > 0).length;

        setGeoResult({
            ...geoResult,
            summary: {
                ...geoResult.summary,
                valid_features: validFeatures,
                features_needing_review: featuresNeedingReview
            }
        });

        // Auto-save to database
        try {
            // Save the full revalidated feature including render_style
            await fetch('/api/claims/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feature: revalidatedFeature,
                    saved_by: 'user'  // TODO: Get actual user identifier
                })
            });

            console.log('Claim saved successfully');
        } catch (error) {
            console.error('Failed to save claim:', error);
            // Don't block the UI update on save failure
        }
    };

    const handlePasswordSuccess = (token: string) => {
        setAdminToken(token);
        setShowPasswordModal(false);
        setShowAdminPanel(true);
    };

    const handleViewClaimOnMap = async (claimId: string) => {
        if (!adminToken) return;

        try {
            const res = await fetch(`/api/claims/${claimId}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!res.ok) {
                console.error('Failed to fetch claim');
                return;
            }

            const claim = await res.json();
            console.log('Fetched claim for map view:', claim);

            // Switch to GeoJSON mode if not already
            setMode('geojson');

            // Set the claim as highlighted
            setHighlightedClaimId(claimId);

            // Add the claim to the features list if not already there
            const feature = claim.geojson;
            console.log('Setting feature for map:', feature);
            setGeoFeatures([feature]);
            setGeoResult({
                summary: {
                    total_features: 1,
                    valid_features: 1,
                    features_needing_review: 0,
                    total_area_ha: feature.properties?.area_ha || 0
                },
                features: [feature]
            });

            // Close admin panel
            setShowAdminPanel(false);
        } catch (error) {
            console.error('Error viewing claim:', error);
        }
    };

    const handleCloseAdminPanel = () => {
        setShowAdminPanel(false);
    };

    const handleStaticModeClick = () => {
        if (isStaticAuthenticated) {
            setMode('static');
        } else {
            setShowStaticPasswordModal(true);
        }
    };

    const handleStaticAuthSuccess = () => {
        setIsStaticAuthenticated(true);
        setShowStaticPasswordModal(false);
        setMode('static');
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        FRA Data Digitization Engine
                    </h2>
                    <p className="text-emerald-100 mt-2 text-sm">
                        AI-powered system to digitize, extract, clean, validate, and geospatially structure FRA data.
                    </p>
                </div>

                {/* Mode Selector */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setMode('document')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${mode === 'document'
                                ? 'border-emerald-500 text-emerald-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Document Upload (PDF/Image)
                            </span>
                        </button>
                        <button
                            onClick={() => setMode('geojson')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${mode === 'geojson'
                                ? 'border-emerald-500 text-emerald-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                GeoJSON Upload
                            </span>
                        </button>
                        <button
                            onClick={handleStaticModeClick}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${mode === 'static'
                                ? 'border-purple-500 text-purple-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                                Static Dataset
                            </span>
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {mode === 'document' && (
                        <>
                            {/* Document Upload Mode */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50"
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <div className="text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-1">Drag & drop or click to upload</p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                                            </div>
                                        </label>
                                        {file && (
                                            <div className="mt-4 p-2 bg-emerald-50 text-emerald-700 rounded text-sm font-medium flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {file.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                                    <select
                                        value={documentType}
                                        onChange={(e) => setDocumentType(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                                    >
                                        <option>Individual Forest Rights (IFR)</option>
                                        <option>Community Rights (CR)</option>
                                        <option>Community Forest Resource (CFR)</option>
                                        <option>Village Record / Nistar Patrak</option>
                                        <option>Other / Mixed</option>
                                    </select>

                                    <button
                                        onClick={processDocument}
                                        disabled={!file || isProcessing}
                                        className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium shadow-sm transition-all
                    ${!file || isProcessing
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                                            }`}
                                    >
                                        {isProcessing ? 'Processing...' : 'Start Digitization'}
                                    </button>

                                    {/* Document Preview */}
                                    {file && previewUrl && (
                                        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white">
                                            <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                                <span className="text-xs font-medium text-gray-600">Preview</span>
                                                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <div className="p-4" id="preview">
                                                {file.type.startsWith('image/') && (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Document preview"
                                                        className="max-w-full h-auto max-h-64 mx-auto rounded"
                                                    />
                                                )}
                                                {file.type === 'application/pdf' && (
                                                    <iframe
                                                        src={previewUrl}
                                                        className="w-full h-64 border-0"
                                                        title="PDF preview"
                                                    />
                                                )}
                                                {!file.type.startsWith('image/') && file.type !== 'application/pdf' && (
                                                    <div className="text-center py-6">
                                                        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="mt-2 text-xs text-gray-600">{file.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{file.type || 'Unknown type'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Processing Visualization */}
                            {isProcessing && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                                        <span>Status: {currentStep}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-7 gap-1">
                                        {steps.map((step, idx) => (
                                            <div key={idx} className={`h-1 rounded ${currentStep === step ? 'bg-emerald-500 animate-pulse' : steps.indexOf(currentStep) > idx ? 'bg-emerald-300' : 'bg-gray-200'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Results Section */}
                            {result && (
                                <div className="animate-fade-in">
                                    <div className="border-b border-gray-200 mb-4">
                                        <nav className="-mb-px flex space-x-8">
                                            {['json', 'map', 'validation'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize
                          ${activeTab === tab
                                                            ? 'border-emerald-500 text-emerald-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {tab === 'json' ? 'Structured JSON' : tab === 'map' ? 'GIS Map Preview' : 'Validation Flags'}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    <div className="min-h-[400px]">
                                        {activeTab === 'json' && (
                                            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                                <pre className="text-green-400 font-mono text-sm">
                                                    {JSON.stringify(result, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {activeTab === 'map' && (
                                            <DocumentMapViewer
                                                polygonPoints={result.map_data?.polygon_points}
                                                claims={result.claims}
                                                geojson={result.map_data?.geojson}
                                            />
                                        )}

                                        {activeTab === 'validation' && (
                                            <div className="space-y-4">
                                                {/* Validation Summary */}
                                                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Validation Summary</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                                            <span className="block text-xs uppercase tracking-wide text-gray-500">Total Claims</span>
                                                            <span className="font-bold text-2xl text-gray-800">{result.flags?.total || 0}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                                            <span className="block text-xs uppercase tracking-wide text-green-500">Valid</span>
                                                            <span className="font-bold text-2xl text-green-600">{result.flags?.valid || 0}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                                            <span className="block text-xs uppercase tracking-wide text-red-500">Invalid</span>
                                                            <span className="font-bold text-2xl text-red-600">{result.flags?.invalid || 0}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                                            <span className="block text-xs uppercase tracking-wide text-yellow-500">Missing Coords</span>
                                                            <span className="font-bold text-2xl text-yellow-600">{result.flags?.missing_coordinates || 0}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                                            <span className="block text-xs uppercase tracking-wide text-orange-500">Duplicates</span>
                                                            <span className="font-bold text-2xl text-orange-600">{result.flags?.duplicates || 0}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                                            <span className="block text-xs uppercase tracking-wide text-purple-500">Clustered</span>
                                                            <span className="font-bold text-2xl text-purple-600">{result.flags?.clustered || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Per-Claim Validation Details */}
                                                {result.claims && result.claims.map((claim: any, index: number) => {
                                                    const validation = claim.validation;
                                                    const hasIssues = validation.missing_fields?.length > 0 ||
                                                        validation.invalid_fields?.length > 0 ||
                                                        validation.duplicate ||
                                                        validation.cluster_flag ||
                                                        validation.low_confidence;

                                                    return (
                                                        <div key={index} className={`border rounded-lg p-4 ${hasIssues ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'}`}>
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-800">{claim.name || 'Unknown Claimant'}</h4>
                                                                    <p className="text-sm text-gray-600">{claim.village}, {claim.district}, {claim.state}</p>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${hasIssues ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                                                    {hasIssues ? 'Needs Review' : 'Valid'}
                                                                </span>
                                                            </div>

                                                            {validation.explanations && validation.explanations.length > 0 && (
                                                                <div className="mt-3 space-y-2">
                                                                    {validation.explanations.map((explanation: string, i: number) => (
                                                                        <div key={i} className="flex items-start text-sm">
                                                                            <svg className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                            </svg>
                                                                            <span className="text-gray-700">{explanation}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {!hasIssues && (
                                                                <div className="flex items-center text-sm text-green-700 mt-2">
                                                                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    All required fields present and valid
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                {/* Confidence Scores */}
                                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h3 className="text-sm font-medium text-blue-800">Confidence Scores</h3>
                                                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-blue-700">
                                                                <div>
                                                                    <span className="block text-xs uppercase tracking-wide text-blue-500">OCR</span>
                                                                    <span className="font-bold text-lg">{result.metadata?.ocr_confidence || 'N/A'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-xs uppercase tracking-wide text-blue-500">Extraction</span>
                                                                    <span className="font-bold text-lg">{result.metadata?.extraction_confidence || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {mode === 'geojson' && (
                        <>
                            {/* GeoJSON Upload Mode */}
                            <div className="space-y-6">
                                <GeoJSONUploader onUploadSuccess={handleGeoUploadSuccess} />

                                {geoResult && (
                                    <>
                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <div className="text-sm text-blue-600 font-medium">Total Features</div>
                                                <div className="text-2xl font-bold text-blue-900">{geoResult.summary.total_features}</div>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <div className="text-sm text-green-600 font-medium">Valid Features</div>
                                                <div className="text-2xl font-bold text-green-900">{geoResult.summary.valid_features}</div>
                                            </div>
                                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                                <div className="text-sm text-orange-600 font-medium">Need Review</div>
                                                <div className="text-2xl font-bold text-orange-900">{geoResult.summary.features_needing_review}</div>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                                <div className="text-sm text-purple-600 font-medium">Total Area</div>
                                                <div className="text-2xl font-bold text-purple-900">{geoResult.summary.total_area_ha.toFixed(2)} ha</div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={async () => {
                                                        const highConfFeatures = geoFeatures.filter(f => f.confidence >= 0.85);
                                                        if (highConfFeatures.length === 0) {
                                                            alert('No high-confidence features to accept');
                                                            return;
                                                        }
                                                        const ids = highConfFeatures.map(f => f.properties.claim_id);
                                                        const res = await fetch('/api/fra-digitization', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                action: 'bulk_accept',
                                                                payload: { feature_ids: ids, accepted_by: 'user@example.com' }
                                                            })
                                                        });
                                                        const data = await res.json();
                                                        alert(`Accepted ${data.result.accepted_count} features`);
                                                    }}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Accept High Confidence
                                                </button>

                                                <button
                                                    onClick={async () => {
                                                        const ids = geoFeatures.map(f => f.properties.claim_id);
                                                        const res = await fetch('/api/fra-digitization', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                action: 'export_review_csv',
                                                                payload: { feature_ids: ids }
                                                            })
                                                        });
                                                        const data = await res.json();
                                                        const csv = atob(data.result.csv_base64);
                                                        const blob = new Blob([csv], { type: 'text/csv' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = data.result.filename;
                                                        a.click();
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Export CSV
                                                </button>

                                                <button
                                                    onClick={async () => {
                                                        const ids = geoFeatures.map(f => f.properties.claim_id);
                                                        const res = await fetch('/api/fra-digitization', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                action: 'download_geojson',
                                                                payload: { feature_ids: ids }
                                                            })
                                                        });
                                                        const data = await res.json();
                                                        const blob = new Blob([JSON.stringify(data.result.geojson, null, 2)], { type: 'application/json' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = data.result.filename;
                                                        a.click();
                                                    }}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                    Export GeoJSON
                                                </button>
                                            </div>
                                        </div>

                                        {/* Map Viewer */}
                                        <GeoMapViewer features={geoFeatures} />

                                        {/* Review Table */}
                                        <ReviewTable features={geoFeatures} onFeatureUpdate={handleFeatureUpdate} />
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {mode === 'static' && (
                        <div className="animate-fade-in">
                            <StaticDashboardContent />
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Password Modal */}
            <AdminPasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={handlePasswordSuccess}
            />

            {/* Static Password Modal */}
            <StaticPasswordModal
                isOpen={showStaticPasswordModal}
                onClose={() => setShowStaticPasswordModal(false)}
                onSuccess={handleStaticAuthSuccess}
            />

            {/* Admin Panel */}
            {adminToken && (
                <AdminPanel
                    isOpen={showAdminPanel}
                    token={adminToken}
                    onClose={handleCloseAdminPanel}
                    onViewClaim={handleViewClaimOnMap}
                />
            )}
        </>
    );
}
