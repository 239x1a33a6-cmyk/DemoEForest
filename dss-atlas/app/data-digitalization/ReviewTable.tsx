// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
'use client';

import React, { useState } from 'react';
import type { ProcessedFeature } from '@/lib/geoValidator';

interface ReviewTableProps {
    features: ProcessedFeature[];
    onFeatureUpdate?: (index: number, updates: any) => void;
}

export default function ReviewTable({ features, onFeatureUpdate }: ReviewTableProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<any>({});

    const featuresNeedingReview = features.filter(f => (f.flags?.length || 0) > 0);

    const startEdit = (index: number, feature: ProcessedFeature) => {
        setEditingIndex(index);
        setEditValues({
            holder_name: feature.properties.holder_name || '',
            village_name: feature.properties.village_name || '',
            district: feature.properties.district || '',
            state: feature.properties.state || '',
            notes: feature.properties.notes || ''
        });
    };

    const saveEdit = (index: number) => {
        if (onFeatureUpdate) {
            onFeatureUpdate(index, editValues);
        }
        setEditingIndex(null);
        setEditValues({});
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditValues({});
    };

    if (featuresNeedingReview.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">All features validated!</p>
                    <p className="text-sm mt-1">No features require manual review</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Features Needing Review ({featuresNeedingReview.length})
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holder</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (ha)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {featuresNeedingReview.map((feature, idx) => {
                            const isEditing = editingIndex === feature.feature_index;
                            return (
                                <tr key={feature.feature_index} className={isEditing ? 'bg-blue-50' : ''}>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{feature.properties.claim_id}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editValues.holder_name}
                                                onChange={(e) => setEditValues({ ...editValues, holder_name: e.target.value })}
                                                className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                        ) : (
                                            <span className={!feature.properties.holder_name ? 'text-red-500 italic' : ''}>
                                                {feature.properties.holder_name || 'Missing'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editValues.village_name}
                                                onChange={(e) => setEditValues({ ...editValues, village_name: e.target.value })}
                                                className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                        ) : (
                                            <span className={!feature.properties.village_name ? 'text-red-500 italic' : ''}>
                                                {feature.properties.village_name || 'Missing'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{feature.properties.area_ha.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${feature.confidence >= 0.85 ? 'bg-green-100 text-green-800' :
                                                feature.confidence >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {(feature.confidence * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex flex-wrap gap-1">
                                            {(feature.flags || []).map((flag, i) => (
                                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
                                                    {flag.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {isEditing ? (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => saveEdit(feature.feature_index)}
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(feature.feature_index, feature)}
                                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
