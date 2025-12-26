import React, { useState, useEffect } from 'react';
import { AtlasFilters } from '@/types/atlas';

// Comprehensive list of states matching the API mapping
const states = [
    'Madhya Pradesh', 'Telangana', 'Tripura', 'Odisha'
];

interface HierarchicalSearchProps {
    filters: AtlasFilters;
    onFilterChange: (filters: AtlasFilters) => void;
}

export default function HierarchicalSearch({ filters, onFilterChange }: HierarchicalSearchProps) {
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

    // Update available districts when state changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (filters.state) {
                setIsLoadingDistricts(true);
                try {
                    const response = await fetch(`/api/geo?state=${encodeURIComponent(filters.state)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.features) {
                            // Extract unique district names
                            const districts = new Set<string>();
                            data.features.forEach((feature: any) => {
                                const props = feature.properties || {};
                                const name = props.dtname || props.district || props.DISTRICT || props.NAME_2;
                                if (name) districts.add(name);
                            });
                            setAvailableDistricts(Array.from(districts).sort());
                        }
                    } else {
                        console.error('Failed to fetch districts');
                        setAvailableDistricts([]);
                    }
                } catch (error) {
                    console.error('Error fetching districts:', error);
                    setAvailableDistricts([]);
                } finally {
                    setIsLoadingDistricts(false);
                }
            } else {
                setAvailableDistricts([]);
            }
        };

        fetchDistricts();
    }, [filters.state]);



    const handleChange = (field: keyof AtlasFilters, value: string) => {
        const newFilters = { ...filters, [field]: value };

        // Reset dependent fields
        if (field === 'state') {
            newFilters.district = '';
            newFilters.village = '';
        } else if (field === 'district') {
            newFilters.village = '';
        }

        onFilterChange(newFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-search-line text-blue-600"></i>
                Location Search
            </h3>

            <div className="space-y-4">
                {/* State Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                        value={filters.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select State</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                {/* District Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                        {isLoadingDistricts && <span className="ml-2 text-xs text-gray-500">(Loading...)</span>}
                    </label>
                    <select
                        value={filters.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                        disabled={!filters.state || isLoadingDistricts}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <option value="">Select District</option>
                        {availableDistricts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

