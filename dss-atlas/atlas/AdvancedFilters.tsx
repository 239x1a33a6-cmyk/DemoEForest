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
                        {['all', 'filed', 'pending', 'approved', 'rejected'].map((status) => (
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

                {/* Water Vulnerability Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Vulnerability</label>
                    <select
                        value={filters.waterVulnerability}
                        onChange={(e) => handleChange('waterVulnerability', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All Levels</option>
                        <option value="high">High Vulnerability</option>
                        <option value="medium">Medium Vulnerability</option>
                        <option value="low">Low Vulnerability</option>
                    </select>
                </div>

                {/* Toggle Switches */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="pending-claims" className="text-sm text-gray-700 cursor-pointer">
                            Show Pending Claims Only
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="pending-claims"
                                id="pending-claims"
                                checked={filters.showPendingClaims}
                                onChange={(e) => handleChange('showPendingClaims', e.target.checked)}
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                style={{ right: filters.showPendingClaims ? '0' : 'auto', left: filters.showPendingClaims ? 'auto' : '0' }}
                            />
                            <label
                                htmlFor="pending-claims"
                                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${filters.showPendingClaims ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            ></label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label htmlFor="scheme-gaps" className="text-sm text-gray-700 cursor-pointer">
                            Highlight Scheme Gaps
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="scheme-gaps"
                                id="scheme-gaps"
                                checked={filters.showSchemeGaps}
                                onChange={(e) => handleChange('showSchemeGaps', e.target.checked)}
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                style={{ right: filters.showSchemeGaps ? '0' : 'auto', left: filters.showSchemeGaps ? 'auto' : '0' }}
                            />
                            <label
                                htmlFor="scheme-gaps"
                                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${filters.showSchemeGaps ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            ></label>
                        </div>
                    </div>
                </div>

                {/* Date Range (Simplified) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                            onChange={(e) => {
                                const current = filters.dateRange || { start: '', end: '' };
                                handleChange('dateRange', { ...current, start: e.target.value });
                            }}
                        />
                        <input
                            type="date"
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                            onChange={(e) => {
                                const current = filters.dateRange || { start: '', end: '' };
                                handleChange('dateRange', { ...current, end: e.target.value });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
