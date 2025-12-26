'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function InteractiveAtlas() {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<any>(null);
  const [hoveredState, setHoveredState] = useState<any>(null);

  const statesData = {
    'jharkhand': {
      name: 'Jharkhand',
      capital: 'Ranchi',
      area: '79,716 km²',
      population: '33.0 million',
      tribalPopulation: '26.3%',
      forestCover: '29.6%',
      fraApplications: '45,678',
      approvedClaims: '32,456',
      color: 'fill-emerald-400',
      hoverColor: 'fill-emerald-500',
      selectedColor: 'fill-emerald-600',
      coordinates: 'M 200 150 L 280 140 L 290 180 L 270 220 L 220 210 L 190 180 Z'
    },
    'telangana': {
      name: 'Telangana',
      capital: 'Hyderabad',
      area: '112,077 km²',
      population: '35.0 million',
      tribalPopulation: '9.3%',
      forestCover: '24.4%',
      fraApplications: '28,945',
      approvedClaims: '19,234',
      color: 'fill-blue-400',
      hoverColor: 'fill-blue-500',
      selectedColor: 'fill-blue-600',
      coordinates: 'M 150 250 L 230 240 L 240 280 L 220 320 L 170 310 L 140 280 Z'
    },
    'tripura': {
      name: 'Tripura',
      capital: 'Agartala',
      area: '10,486 km²',
      population: '3.7 million',
      tribalPopulation: '31.8%',
      forestCover: '73.7%',
      fraApplications: '12,567',
      approvedClaims: '8,934',
      color: 'fill-teal-400',
      hoverColor: 'fill-teal-500',
      selectedColor: 'fill-teal-600',
      coordinates: 'M 350 180 L 380 170 L 385 200 L 375 220 L 355 215 L 345 195 Z'
    },
    'madhyapradesh': {
      name: 'Madhya Pradesh',
      capital: 'Bhopal',
      area: '308,245 km²',
      population: '72.6 million',
      tribalPopulation: '21.1%',
      forestCover: '25.1%',
      fraApplications: '89,234',
      approvedClaims: '67,891',
      color: 'fill-orange-400',
      hoverColor: 'fill-orange-500',
      selectedColor: 'fill-orange-600',
      coordinates: 'M 100 200 L 180 190 L 190 230 L 170 270 L 120 260 L 90 230 Z'
    },
    'odisha': {
      name: 'Odisha',
      capital: 'Bhubaneswar',
      area: '155,707 km²',
      population: '42.0 million',
      tribalPopulation: '22.8%',
      forestCover: '33.2%',
      fraApplications: '56,789',
      approvedClaims: '41,234',
      color: 'fill-purple-400',
      hoverColor: 'fill-purple-500',
      selectedColor: 'fill-purple-600',
      coordinates: 'M 250 200 L 320 190 L 330 230 L 310 270 L 260 260 L 240 230 Z'
    }
  };

  const getStateColor = (stateKey: any) => {
    const state = statesData[stateKey as keyof typeof statesData];
    if (selectedState === stateKey) return state.selectedColor;
    if (hoveredState === stateKey) return state.hoverColor;
    return state.color;
  };

  const handleStateClick = (stateKey: any) => {
    setSelectedState(selectedState === stateKey ? null : stateKey);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('assetMapping.atlas.title')}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {t('assetMapping.atlas.liveData')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 h-96">
            <svg
              viewBox="0 0 400 350"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Background */}
              <rect width="400" height="350" fill="url(#mapGradient)" />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>

                {/* Glow Effect for Selected State */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* State Paths */}
              {Object.entries(statesData).map(([stateKey, state]) => (
                <g key={stateKey}>
                  <path
                    d={state.coordinates}
                    className={`${getStateColor(stateKey)} stroke-white stroke-2 cursor-pointer transition-all duration-300 hover:stroke-gray-300`}
                    style={{
                      filter: selectedState === stateKey ? 'url(#glow)' : 'none',
                      transform: selectedState === stateKey ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center'
                    }}
                    onClick={() => handleStateClick(stateKey)}
                    onMouseEnter={() => setHoveredState(stateKey)}
                    onMouseLeave={() => setHoveredState(null)}
                  />

                  {/* State Labels */}
                  <text
                    x={stateKey === 'jharkhand' ? 240 : stateKey === 'telangana' ? 190 : stateKey === 'tripura' ? 365 : stateKey === 'madhyapradesh' ? 140 : 285}
                    y={stateKey === 'jharkhand' ? 175 : stateKey === 'telangana' ? 275 : stateKey === 'tripura' ? 195 : stateKey === 'madhyapradesh' ? 225 : 225}
                    className="text-xs font-medium fill-gray-700 pointer-events-none"
                    textAnchor="middle"
                  >
                    {state.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredState && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-900">{statesData[hoveredState as keyof typeof statesData].name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {t('assetMapping.atlas.clickToView')}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {Object.entries(statesData).map(([stateKey, state]) => (
              <div key={stateKey} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${state.color.replace('fill-', 'bg-')}`}></div>
                <span className="text-gray-700">{state.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedState ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {statesData[selectedState as keyof typeof statesData].name}
                </h4>
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-close-line"></i>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">{t('assetMapping.atlas.capital')}</div>
                  <div className="font-medium text-gray-900">{statesData[selectedState as keyof typeof statesData].capital}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">{t('assetMapping.atlas.area')}</div>
                    <div className="font-medium text-gray-900">{statesData[selectedState as keyof typeof statesData].area}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{t('assetMapping.atlas.population')}</div>
                    <div className="font-medium text-gray-900">{statesData[selectedState as keyof typeof statesData].population}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">{t('assetMapping.atlas.tribalPopulation')}</div>
                    <div className="font-medium text-orange-600">{statesData[selectedState as keyof typeof statesData].tribalPopulation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{t('assetMapping.atlas.forestCover')}</div>
                    <div className="font-medium text-green-600">{statesData[selectedState as keyof typeof statesData].forestCover}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">{t('assetMapping.atlas.fraStats')}</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('assetMapping.atlas.totalApplications')}</span>
                      <span className="font-medium text-blue-600">{statesData[selectedState as keyof typeof statesData].fraApplications}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('assetMapping.atlas.approvedClaims')}</span>
                      <span className="font-medium text-green-600">{statesData[selectedState as keyof typeof statesData].approvedClaims}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('assetMapping.atlas.approvalRate')}</span>
                      <span className="font-medium text-purple-600">
                        {Math.round((parseInt(statesData[selectedState as keyof typeof statesData].approvedClaims.replace(',', '')) / parseInt(statesData[selectedState as keyof typeof statesData].fraApplications.replace(',', ''))) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap">
                    {t('assetMapping.atlas.viewReport')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-map-2-line text-gray-500 text-2xl"></i>
                </div>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">{t('assetMapping.atlas.selectState')}</h4>
              <p className="text-sm text-gray-600">
                {t('assetMapping.atlas.clickMapInstruction')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(statesData).map(([stateKey, state]) => (
          <div
            key={stateKey}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedState === stateKey
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            onClick={() => handleStateClick(stateKey)}
          >
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${state.color.replace('fill-', 'bg-')}`}></div>
              <div className="text-sm font-medium text-gray-900">{state.name}</div>
              <div className="text-xs text-gray-600 mt-1">{state.approvedClaims} claims</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}