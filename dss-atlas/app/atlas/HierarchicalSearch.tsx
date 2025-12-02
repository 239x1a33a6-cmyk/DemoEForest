import React, { useState, useEffect } from 'react';
import { AtlasFilters } from '@/types/atlas';

// Comprehensive list of states matching the API mapping
const states = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
];

interface HierarchicalSearchProps {
    filters: AtlasFilters;
    onFilterChange: (filters: AtlasFilters) => void;
}

export default function HierarchicalSearch({ filters, onFilterChange }: HierarchicalSearchProps) {
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [pattaIdInput, setPattaIdInput] = useState('');
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

    const handlePattaSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ ...filters, pattaHolderId: pattaIdInput });
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

                {/* Village Selection (Simplified) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                    <input
                        type="text"
                        value={filters.village}
                        onChange={(e) => handleChange('village', e.target.value)}
                        placeholder="Enter village name"
                        disabled={!filters.district}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Patta ID Search */}
            <form onSubmit={handlePattaSearch}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patta Holder ID</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={pattaIdInput}
                        onChange={(e) => setPattaIdInput(e.target.value)}
                        placeholder="Enter ID (e.g. PH-1234)"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <i className="ri-search-line"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}
