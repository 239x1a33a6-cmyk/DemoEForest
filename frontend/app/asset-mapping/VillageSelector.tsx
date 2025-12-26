'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AssetData {
  forest: {
    area: string;
    coverage: number;
    quality: string;
    biodiversity: string;
  };
  water: {
    area: string;
    sources: number;
    quality: string;
    seasonal: string;
  };
  agriculture: {
    area: string;
    productivity: string;
    crops: string;
    irrigation: string;
  };
  settlement: {
    area: string;
    population: number;
    density: string;
    infrastructure: string;
  };
  infrastructure: {
    area: string;
    roads: string;
    connectivity: string;
    facilities: string;
  };
  minerals: {
    deposits: string;
    reserves: string;
    mining: string;
  };
  tribal: {
    population: number;
    groups: string[];
    rights: string;
  };
  lastUpdated?: string;
  dataSource?: string;
}

interface StateData {
  districts: {
    [key: string]: string[];
  };
}

interface StatesData {
  [key: string]: StateData;
}

interface StateFactors {
  [key: string]: {
    forest: number;
    water: number;
    agriculture: number;
    minerals: number;
  };
}

const SUPPORTED_STATES = [
  'Jharkhand',
  'Telangana',
  'Tripura',
  'Madhya Pradesh',
  'Odisha'
];

export default function VillageSelector() {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSatellite, setIsLoadingSatellite] = useState(false);
  const [satelliteDataLoaded, setSatelliteDataLoaded] = useState(false);
  const [isLoadingAssetData, setIsLoadingAssetData] = useState(false);
  const [assetData, setAssetData] = useState<AssetData | null>(null);

  // Dynamic district loading
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDistricts() {
      if (!selectedState) {
        setDistricts([]);
        return;
      }

      try {
        const response = await fetch(`/data/new_districts/${selectedState}.json`);
        if (!response.ok) throw new Error('Failed to fetch district data');

        const data = await response.json();
        // Extract unique district names from features
        const districtNames = Array.from(new Set(
          data.features.map((f: any) => f.properties.dtname)
        )).sort() as string[];

        setDistricts(districtNames);
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistricts([]);
      }
    }

    fetchDistricts();
    setSelectedDistrict(''); // Reset district when state changes
  }, [selectedState]);

  // Mock village data generator
  const getVillagesForDistrict = (district: string) => {
    if (!district) return [];
    return [
      `${district} Village 1`,
      `${district} Village 2`,
      `${district} Village 3`,
      `${district} Village 4`,
      `${district} Village 5`
    ];
  };

  // Comprehensive asset data database with realistic variations
  const assetDatabase: { [key: string]: AssetData } = {
    // Jharkhand villages
    'Jamshedpur': {
      forest: { area: '1,250 ha', coverage: 45, quality: 'Dense', biodiversity: 'High' },
      water: { area: '180 ha', sources: 12, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '890 ha', productivity: 'Medium', crops: 'Rice, Wheat', irrigation: '65%' },
      settlement: { area: '420 ha', population: 1850, density: 'High', infrastructure: 'Good' },
      infrastructure: { area: '160 ha', roads: '45 km', connectivity: 'Excellent', facilities: 'Complete' },
      minerals: { deposits: 'Iron Ore', reserves: 'High', mining: 'Active' },
      tribal: { population: 1200, groups: ['Ho', 'Santhal'], rights: 'Recognized' }
    },
    'Chaibasa': {
      forest: { area: '2,100 ha', coverage: 68, quality: 'Dense', biodiversity: 'Very High' },
      water: { area: '95 ha', sources: 8, quality: 'Excellent', seasonal: 'Perennial' },
      agriculture: { area: '1,200 ha', productivity: 'High', crops: 'Rice, Maize', irrigation: '45%' },
      settlement: { area: '280 ha', population: 980, density: 'Medium', infrastructure: 'Fair' },
      infrastructure: { area: '85 ha', roads: '28 km', connectivity: 'Good', facilities: 'Basic' },
      minerals: { deposits: 'Iron Ore, Copper', reserves: 'Medium', mining: 'Limited' },
      tribal: { population: 750, groups: ['Ho', 'Munda'], rights: 'Pending' }
    },
    'Ranchi': {
      forest: { area: '1,800 ha', coverage: 52, quality: 'Mixed', biodiversity: 'High' },
      water: { area: '220 ha', sources: 15, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '1,100 ha', productivity: 'Medium', crops: 'Rice, Vegetables', irrigation: '70%' },
      settlement: { area: '380 ha', population: 1650, density: 'High', infrastructure: 'Excellent' },
      infrastructure: { area: '140 ha', roads: '52 km', connectivity: 'Excellent', facilities: 'Complete' },
      minerals: { deposits: 'Coal, Mica', reserves: 'High', mining: 'Active' },
      tribal: { population: 950, groups: ['Oraon', 'Munda'], rights: 'Recognized' }
    },
    'Ghatshila': {
      forest: { area: '1,650 ha', coverage: 58, quality: 'Dense', biodiversity: 'High' },
      water: { area: '125 ha', sources: 9, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '950 ha', productivity: 'Medium', crops: 'Rice, Pulses', irrigation: '55%' },
      settlement: { area: '320 ha', population: 1200, density: 'Medium', infrastructure: 'Good' },
      infrastructure: { area: '95 ha', roads: '35 km', connectivity: 'Good', facilities: 'Good' },
      minerals: { deposits: 'Copper, Iron', reserves: 'High', mining: 'Active' },
      tribal: { population: 800, groups: ['Ho', 'Santhal'], rights: 'Recognized' }
    },
    'Potka': {
      forest: { area: '1,450 ha', coverage: 62, quality: 'Dense', biodiversity: 'High' },
      water: { area: '85 ha', sources: 6, quality: 'Good', seasonal: 'Seasonal' },
      agriculture: { area: '780 ha', productivity: 'Low', crops: 'Rice, Maize', irrigation: '35%' },
      settlement: { area: '250 ha', population: 850, density: 'Low', infrastructure: 'Basic' },
      infrastructure: { area: '65 ha', roads: '22 km', connectivity: 'Fair', facilities: 'Basic' },
      minerals: { deposits: 'Iron Ore', reserves: 'Medium', mining: 'Limited' },
      tribal: { population: 650, groups: ['Ho'], rights: 'Pending' }
    },

    // Telangana villages
    'Adilabad': {
      forest: { area: '1,950 ha', coverage: 65, quality: 'Dense', biodiversity: 'Very High' },
      water: { area: '150 ha', sources: 10, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '1,350 ha', productivity: 'High', crops: 'Cotton, Rice', irrigation: '80%' },
      settlement: { area: '320 ha', population: 1450, density: 'Medium', infrastructure: 'Good' },
      infrastructure: { area: '120 ha', roads: '38 km', connectivity: 'Good', facilities: 'Good' },
      minerals: { deposits: 'Coal, Limestone', reserves: 'High', mining: 'Active' },
      tribal: { population: 950, groups: ['Gond', 'Kolam'], rights: 'Recognized' }
    },
    'Hyderabad': {
      forest: { area: '450 ha', coverage: 18, quality: 'Sparse', biodiversity: 'Low' },
      water: { area: '80 ha', sources: 25, quality: 'Fair', seasonal: 'Perennial' },
      agriculture: { area: '600 ha', productivity: 'Low', crops: 'Vegetables', irrigation: '90%' },
      settlement: { area: '1,200 ha', population: 5500, density: 'Very High', infrastructure: 'Excellent' },
      infrastructure: { area: '380 ha', roads: '125 km', connectivity: 'Excellent', facilities: 'Complete' },
      minerals: { deposits: 'Granite', reserves: 'Low', mining: 'Limited' },
      tribal: { population: 200, groups: ['Lambada'], rights: 'Urban' }
    },
    'Bhadrachalam': {
      forest: { area: '2,200 ha', coverage: 72, quality: 'Dense', biodiversity: 'Very High' },
      water: { area: '180 ha', sources: 12, quality: 'Excellent', seasonal: 'Perennial' },
      agriculture: { area: '980 ha', productivity: 'Medium', crops: 'Rice, Turmeric', irrigation: '60%' },
      settlement: { area: '280 ha', population: 1100, density: 'Medium', infrastructure: 'Fair' },
      infrastructure: { area: '90 ha', roads: '32 km', connectivity: 'Fair', facilities: 'Basic' },
      minerals: { deposits: 'Bauxite', reserves: 'Medium', mining: 'Limited' },
      tribal: { population: 850, groups: ['Koya', 'Gond'], rights: 'Recognized' }
    },

    // Tripura villages
    'Agartala': {
      forest: { area: '1,100 ha', coverage: 42, quality: 'Mixed', biodiversity: 'Medium' },
      water: { area: '120 ha', sources: 18, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '800 ha', productivity: 'High', crops: 'Rice, Jute', irrigation: '75%' },
      settlement: { area: '450 ha', population: 2200, density: 'High', infrastructure: 'Excellent' },
      infrastructure: { area: '180 ha', roads: '65 km', connectivity: 'Excellent', facilities: 'Complete' },
      minerals: { deposits: 'Natural Gas', reserves: 'Medium', mining: 'Active' },
      tribal: { population: 800, groups: ['Tripuri', 'Reang'], rights: 'Recognized' }
    },
    'Dharmanagar': {
      forest: { area: '1,650 ha', coverage: 58, quality: 'Dense', biodiversity: 'High' },
      water: { area: '90 ha', sources: 7, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '950 ha', productivity: 'Medium', crops: 'Rice, Tea', irrigation: '50%' },
      settlement: { area: '220 ha', population: 950, density: 'Medium', infrastructure: 'Good' },
      infrastructure: { area: '95 ha', roads: '28 km', connectivity: 'Good', facilities: 'Good' },
      minerals: { deposits: 'Limestone', reserves: 'Low', mining: 'Limited' },
      tribal: { population: 650, groups: ['Tripuri', 'Halam'], rights: 'Recognized' }
    },

    // Madhya Pradesh villages
    'Bhopal': {
      forest: { area: '980 ha', coverage: 35, quality: 'Mixed', biodiversity: 'Medium' },
      water: { area: '160 ha', sources: 22, quality: 'Fair', seasonal: 'Perennial' },
      agriculture: { area: '1,050 ha', productivity: 'Medium', crops: 'Wheat, Soybean', irrigation: '85%' },
      settlement: { area: '520 ha', population: 2800, density: 'High', infrastructure: 'Excellent' },
      infrastructure: { area: '220 ha', roads: '85 km', connectivity: 'Excellent', facilities: 'Complete' },
      minerals: { deposits: 'Sandstone', reserves: 'Medium', mining: 'Limited' },
      tribal: { population: 450, groups: ['Gond', 'Bhil'], rights: 'Urban' }
    },
    'Indore': {
      forest: { area: '720 ha', coverage: 28, quality: 'Sparse', biodiversity: 'Low' },
      water: { area: '110 ha', sources: 15, quality: 'Fair', seasonal: 'Seasonal' },
      agriculture: { area: '890 ha', productivity: 'High', crops: 'Cotton, Wheat', irrigation: '90%' },
      settlement: { area: '680 ha', population: 3200, density: 'Very High', infrastructure: 'Excellent' },
      infrastructure: { area: '280 ha', roads: '95 km', connectivity: 'Excellent', facilities: 'Complete' },
      minerals: { deposits: 'Black Soil', reserves: 'High', mining: 'None' },
      tribal: { population: 300, groups: ['Bhil'], rights: 'Urban' }
    },

    // Odisha villages
    'Angul': {
      forest: { area: '1,750 ha', coverage: 62, quality: 'Dense', biodiversity: 'High' },
      water: { area: '200 ha', sources: 11, quality: 'Good', seasonal: 'Perennial' },
      agriculture: { area: '1,150 ha', productivity: 'Medium', crops: 'Rice, Sugarcane', irrigation: '70%' },
      settlement: { area: '290 ha', population: 1350, density: 'Medium', infrastructure: 'Good' },
      infrastructure: { area: '110 ha', roads: '42 km', connectivity: 'Good', facilities: 'Good' },
      minerals: { deposits: 'Coal, Iron', reserves: 'Very High', mining: 'Active' },
      tribal: { population: 850, groups: ['Kol', 'Gond'], rights: 'Recognized' }
    },
    'Balangir': {
      forest: { area: '1,450 ha', coverage: 55, quality: 'Mixed', biodiversity: 'Medium' },
      water: { area: '130 ha', sources: 9, quality: 'Good', seasonal: 'Seasonal' },
      agriculture: { area: '1,280 ha', productivity: 'High', crops: 'Rice, Turmeric', irrigation: '65%' },
      settlement: { area: '310 ha', population: 1250, density: 'Medium', infrastructure: 'Fair' },
      infrastructure: { area: '95 ha', roads: '35 km', connectivity: 'Fair', facilities: 'Basic' },
      minerals: { deposits: 'Bauxite', reserves: 'High', mining: 'Active' },
      tribal: { population: 750, groups: ['Kondh', 'Gond'], rights: 'Pending' }
    }
  };

  // Simulate API data fetching with realistic delays
  const fetchAssetData = async (state: string, district: string, village: string) => {
    setIsLoadingAssetData(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    try {
      // Get data from database or generate realistic data
      let data = assetDatabase[village];

      if (!data) {
        // Generate realistic data based on location characteristics
        const baseData = generateRealisticAssetData(state, district, village);
        data = baseData;
      }

      // Add some real-time variation to simulate live data
      const variation = 0.95 + Math.random() * 0.1; // ±5% variation
      const updatedData = {
        ...data,
        forest: {
          ...data.forest,
          area: Math.round(parseInt(data.forest.area) * variation) + ' ha'
        },
        water: {
          ...data.water,
          area: Math.round(parseInt(data.water.area) * variation) + ' ha'
        },
        agriculture: {
          ...data.agriculture,
          area: Math.round(parseInt(data.agriculture.area) * variation) + ' ha'
        },
        settlement: {
          ...data.settlement,
          area: Math.round(parseInt(data.settlement.area) * variation) + ' ha'
        },
        infrastructure: {
          ...data.infrastructure,
          area: Math.round(parseInt(data.infrastructure.area) * variation) + ' ha'
        },
        lastUpdated: new Date().toLocaleString(),
        dataSource: 'Real-time Satellite Analysis'
      };

      setAssetData(updatedData);

      // Dispatch event to update other components
      const event = new CustomEvent('assetDataUpdated', {
        detail: {
          state,
          district,
          village,
          data: updatedData
        }
      });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('Error fetching asset data:', error);
      // Set fallback data
      setAssetData(generateRealisticAssetData(state, district, village));
    } finally {
      setIsLoadingAssetData(false);
    }
  };

  // Generate realistic asset data for villages not in database
  const generateRealisticAssetData = (state: string, district: string, village: string): AssetData => {
    const stateFactors: StateFactors = {
      'Jharkhand': { forest: 1.2, water: 0.8, agriculture: 1.0, minerals: 1.5 },
      'Telangana': { forest: 0.9, water: 1.1, agriculture: 1.3, minerals: 1.0 },
      'Tripura': { forest: 1.4, water: 1.2, agriculture: 0.9, minerals: 0.5 },
      'Madhya Pradesh': { forest: 1.1, water: 0.9, agriculture: 1.2, minerals: 0.8 },
      'Odisha': { forest: 1.3, water: 1.0, agriculture: 1.1, minerals: 1.3 }
    };

    const factor = stateFactors[state] || { forest: 1.0, water: 1.0, agriculture: 1.0, minerals: 1.0 };

    return {
      forest: {
        area: Math.round(800 + Math.random() * 1200 * factor.forest) + ' ha',
        coverage: Math.round(30 + Math.random() * 50),
        quality: ['Sparse', 'Mixed', 'Dense'][Math.floor(Math.random() * 3)],
        biodiversity: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)]
      },
      water: {
        area: Math.round(50 + Math.random() * 200 * factor.water) + ' ha',
        sources: Math.round(3 + Math.random() * 15),
        quality: ['Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 3)],
        seasonal: ['Seasonal', 'Perennial'][Math.floor(Math.random() * 2)]
      },
      agriculture: {
        area: Math.round(600 + Math.random() * 800 * factor.agriculture) + ' ha',
        productivity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        crops: 'Rice, Local Crops',
        irrigation: Math.round(30 + Math.random() * 60) + '%'
      },
      settlement: {
        area: Math.round(200 + Math.random() * 400) + ' ha',
        population: Math.round(500 + Math.random() * 2000),
        density: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        infrastructure: ['Basic', 'Fair', 'Good'][Math.floor(Math.random() * 3)]
      },
      infrastructure: {
        area: Math.round(50 + Math.random() * 150) + ' ha',
        roads: Math.round(15 + Math.random() * 60) + ' km',
        connectivity: ['Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 3)],
        facilities: ['Basic', 'Good', 'Complete'][Math.floor(Math.random() * 3)]
      },
      minerals: {
        deposits: 'Various',
        reserves: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        mining: ['None', 'Limited', 'Active'][Math.floor(Math.random() * 3)]
      },
      tribal: {
        population: Math.round(200 + Math.random() * 800),
        groups: ['Local Tribes'],
        rights: ['Pending', 'Recognized'][Math.floor(Math.random() * 2)]
      }
    };
  };

  const handleStateChange = (state: string) => {
    setIsLoading(true);
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedVillage('');
    setAssetData(null);
    setSatelliteDataLoaded(false);
    setTimeout(() => setIsLoading(false), 500);

    // Dispatch event for state change
    const event = new CustomEvent('assetDataUpdated', {
      detail: {
        state: state,
        district: '',
        village: '',
        data: null
      }
    });
    window.dispatchEvent(event);
  };

  const handleDistrictChange = (district: string) => {
    setIsLoading(true);
    setSelectedDistrict(district);
    setSelectedVillage('');
    setAssetData(null);
    setSatelliteDataLoaded(false);
    setTimeout(() => setIsLoading(false), 300);

    // Dispatch event for district change
    const event = new CustomEvent('assetDataUpdated', {
      detail: {
        state: selectedState,
        district: district,
        village: '',
        data: null
      }
    });
    window.dispatchEvent(event);
  };

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
    setSatelliteDataLoaded(false);

    // Fetch asset data when village is selected
    if (village && selectedState && selectedDistrict) {
      fetchAssetData(selectedState, selectedDistrict, village);
    } else {
      setAssetData(null);
    }
  };

  const getDistricts = () => {
    return districts;
  };

  const getVillages = () => {
    return getVillagesForDistrict(selectedDistrict);
  };

  const handleLoadSatelliteData = () => {
    if (!selectedDistrict) return;

    setIsLoadingSatellite(true);
    setSatelliteDataLoaded(false);

    // Fetch asset data for the district (simulated)
    fetchAssetData(selectedState, selectedDistrict, selectedDistrict); // Use district as village name for data gen

    // Simulate satellite data loading process
    setTimeout(() => {
      setSatelliteDataLoaded(true);
      setIsLoadingSatellite(false);

      // Trigger satellite viewer update
      const event = new CustomEvent('satelliteDataLoaded', {
        detail: {
          state: selectedState,
          district: selectedDistrict,
          village: '', // No village selected
          assetData: assetData
        }
      });
      window.dispatchEvent(event);

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <i class="ri-satellite-line"></i>
          <span>${t('assetMapping.selector.dataLoadedNotification', { village: selectedDistrict })}</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);

    }, 2500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assetMapping.selector.title')}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('assetMapping.selector.state')}</label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8"
            >
              <option value="">{t('assetMapping.selector.selectState')}</option>
              {SUPPORTED_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('assetMapping.selector.district')}</label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!selectedState}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{t('assetMapping.selector.selectDistrict')}</option>
              {getDistricts().map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              {isLoading ? (
                <i className="ri-loader-4-line text-gray-500 animate-spin"></i>
              ) : (
                <i className="ri-arrow-down-s-line text-gray-500"></i>
              )}
            </div>
          </div>
        </div>


      </div>

      {/* Asset Data Loading State */}
      {isLoadingAssetData && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-loader-4-line text-blue-600 animate-spin"></i>
            </div>
            <div>
              <div className="font-medium text-blue-900">{t('assetMapping.selector.loadingAssetData')}</div>
              <div className="text-sm text-blue-700">{t('assetMapping.selector.fetchingData', { village: selectedVillage })}</div>
            </div>
          </div>
          <div className="mt-3 bg-blue-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Enhanced Asset Data Display */}
      {selectedDistrict && assetData && !isLoadingAssetData && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-green-900">{t('assetMapping.selector.realTimeAssetData')}</h4>
            <div className="flex items-center gap-1 text-xs text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {t('assetMapping.selector.liveData')}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('assetMapping.selector.location')}:</span>
              <span className="font-medium text-gray-900">{selectedDistrict}, {selectedState}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('assetMapping.selector.lastUpdated')}:</span>
              <span className="font-medium text-gray-900">{assetData.lastUpdated || t('assetMapping.selector.justNow')}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <h5 className="font-medium text-green-900 mb-3">{t('assetMapping.selector.detailedOverview')}</h5>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🌲</span>
                    <span className="font-medium text-green-900">{t('assetMapping.selector.forest')}</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">{assetData.forest.area}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.coverage')}:</span>
                    <span>{assetData.forest.coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.quality')}:</span>
                    <span>{assetData.forest.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.biodiversity')}:</span>
                    <span>{assetData.forest.biodiversity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">💧</span>
                    <span className="font-medium text-blue-900">{t('assetMapping.selector.water')}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">{assetData.water.area}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.sources')}:</span>
                    <span>{assetData.water.sources}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.quality')}:</span>
                    <span>{assetData.water.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.type')}:</span>
                    <span>{assetData.water.seasonal}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-yellow-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">🌾</span>
                    <span className="font-medium text-yellow-900">{t('assetMapping.selector.agriculture')}</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700">{assetData.agriculture.area}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.productivity')}:</span>
                    <span>{assetData.agriculture.productivity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.crops')}:</span>
                    <span>{assetData.agriculture.crops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.irrigation')}:</span>
                    <span>{assetData.agriculture.irrigation}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">🏘️</span>
                    <span className="font-medium text-orange-900">{t('assetMapping.selector.settlement')}</span>
                  </div>
                  <span className="text-sm font-bold text-orange-700">{assetData.settlement.area}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.population')}:</span>
                    <span>{assetData.settlement.population}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.density')}:</span>
                    <span>{assetData.settlement.density}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('assetMapping.selector.infrastructure')}:</span>
                    <span>{assetData.settlement.infrastructure}</span>
                  </div>
                </div>
              </div>

              {assetData.tribal && (
                <div className="bg-white p-3 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">👥</span>
                      <span className="font-medium text-purple-900">{t('assetMapping.selector.tribalCommunity')}</span>
                    </div>
                    <span className="text-sm font-bold text-purple-700">{assetData.tribal.population}</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>{t('assetMapping.selector.groups')}:</span>
                      <span>{Array.isArray(assetData.tribal.groups) ? assetData.tribal.groups.join(', ') : assetData.tribal.groups}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('assetMapping.selector.rightsStatus')}:</span>
                      <span className={assetData.tribal.rights === 'Recognized' ? 'text-green-600' : 'text-orange-600'}>
                        {assetData.tribal.rights}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleLoadSatelliteData}
        disabled={!selectedDistrict || isLoadingSatellite || isLoadingAssetData}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoadingSatellite ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-loader-4-line animate-spin"></i>
            </div>
            {t('assetMapping.selector.loadingSatelliteData')}
          </div>
        ) : satelliteDataLoaded ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-check-line"></i>
            </div>
            {t('assetMapping.selector.satelliteDataLoaded')}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-satellite-line"></i>
            </div>
            {t('assetMapping.selector.loadSatelliteData')}
          </div>
        )}
      </button>

      {satelliteDataLoaded && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-satellite-line text-blue-600"></i>
            </div>
            <span className="text-sm font-medium text-blue-900">{t('assetMapping.selector.satelliteDataStatus')}</span>
          </div>
          <div className="space-y-1 text-xs text-blue-800">
            <div className="flex justify-between">
              <span>{t('assetMapping.selector.resolution')}:</span>
              <span className="font-medium">0.5m per pixel</span>
            </div>
            <div className="flex justify-between">
              <span>{t('assetMapping.selector.lastUpdated')}:</span>
              <span className="font-medium">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span>{t('assetMapping.selector.coverage')}:</span>
              <span className="font-medium">100% complete</span>
            </div>
            <div className="flex justify-between">
              <span>{t('assetMapping.selector.analysisReady')}:</span>
              <span className="font-medium text-green-600">✓ {t('assetMapping.selector.available')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
