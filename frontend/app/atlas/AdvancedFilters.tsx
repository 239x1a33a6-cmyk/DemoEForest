import React from 'react';
import { AtlasFilters } from '@/types/atlas';

interface AdvancedFiltersProps {
    filters: AtlasFilters;
    onFilterChange: (filters: AtlasFilters) => void;
}

export default function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
    const handleChange = (field: keyof AtlasFilters, value: any) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-filter-3-line text-blue-600"></i>
                Advanced Filters
            </h3>

            <div className="space-y-4">
                {/* Claim Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Claim Status</label>
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleChange('claimStatus', status)}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${filters.claimStatus === status
                                    ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
