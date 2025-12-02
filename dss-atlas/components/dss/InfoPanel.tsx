'use client';

import { getStateMetadata } from '@/lib/stateMetadata';

/**
 * Props for InfoPanel component
 */
interface InfoPanelProps {
    selectedState: string | null;
    isLoading?: boolean;
}

/**
 * InfoPanel Component
 * 
 * Displays information about the selected state:
 * - State name
 * - Number of districts
 * - FRA Patta holders count
 * - Priority villages count
 */
export default function InfoPanel({ selectedState, isLoading }: InfoPanelProps) {
    // Get metadata for the selected state
    const metadata = selectedState ? getStateMetadata(selectedState) : null;

    if (!selectedState) {
        return (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-[280px]">
                <h3 className="text-lg font-bold text-gray-900 mb-2">State Information</h3>
                <p className="text-sm text-gray-500 italic">Select a state to view details</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-[280px]">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600">Loading state data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-[280px]">
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedState}</h3>
                <p className="text-xs text-gray-500">State Information</p>
            </div>

            {/* Statistics */}
            {metadata ? (
                <div className="space-y-3">
                    {/* Districts */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i className="ri-map-2-line text-blue-600"></i>
                            </div>
                            <span className="text-sm text-gray-600">Districts</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{metadata.districtCount}</span>
                    </div>

                    {/* FRA Patta Holders */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <i className="ri-user-location-line text-green-600"></i>
                            </div>
                            <span className="text-sm text-gray-600">FRA Patta Holders</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{metadata.fraHolders.toLocaleString()}</span>
                    </div>

                    {/* Priority Villages */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <i className="ri-alert-line text-red-600"></i>
                            </div>
                            <span className="text-sm text-gray-600">Priority Villages</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">{metadata.priorityVillages}</span>
                            <p className="text-xs text-red-600 font-medium">High Risk</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-500 italic">
                    No data available for this state
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Data auto-updates when state selection changes
                </p>
            </div>
        </div>
    );
}
