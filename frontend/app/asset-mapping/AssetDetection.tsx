'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AssetDetection() {
  const { t } = useTranslation();
  const [detectionResults, setDetectionResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [expandedCard, setExpandedCard] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Listen for asset data updates
  useEffect(() => {
    const handleAssetDataUpdate = (event: any) => {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      setExpandedCard(null);
      setSelectedLocation({
        state: event.detail.state,
        district: event.detail.district,
        village: event.detail.village
      });

      // Simulate AI analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Process asset data and generate detection results
      setTimeout(() => {
        const assetData = event.detail.data;

        if (assetData) {
          const results = generateDetectionResults(assetData, event.detail);
          setDetectionResults(results);
        }

        setIsAnalyzing(false);
        setAnalysisProgress(100);
        clearInterval(progressInterval);
      }, 2000);
    };

    window.addEventListener('assetDataUpdated', handleAssetDataUpdate);

    return () => {
      window.removeEventListener('assetDataUpdated', handleAssetDataUpdate);
    };
  }, []);

  // Generate realistic detection results based on asset data
  const generateDetectionResults = (assetData: any, locationData: any) => {
    const results = [];

    // Forest detection
    if (assetData.forest) {
      const forestArea = parseInt(assetData.forest.area) || 0;
      results.push({
        id: 'forest',
        type: t('assetMapping.detection.types.forest'),
        area: assetData.forest.area,
        confidence: 92 + Math.floor(Math.random() * 6),
        status: forestArea > 1000 ? t('assetMapping.detection.statusTypes.denseCoverage') : forestArea > 500 ? t('assetMapping.detection.statusTypes.moderateCoverage') : t('assetMapping.detection.statusTypes.sparseCoverage'),
        icon: 'ri-tree-line',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        details: {
          quality: assetData.forest.quality,
          biodiversity: assetData.forest.biodiversity,
          coverage: `${assetData.forest.coverage}%`
        },
        extendedInfo: {
          description: 'Forest areas identified through satellite imagery analysis using advanced machine learning algorithms.',
          threats: ['Deforestation', 'Illegal logging', 'Forest fires'],
          conservation: ['Protected area status', 'Community forest management', 'Reforestation programs'],
          species: ['Sal trees', 'Teak', 'Bamboo', 'Various medicinal plants'],
          carbonSequestration: `${Math.round(forestArea * 2.5)} tons CO2/year`,
          economicValue: `₹${Math.round(forestArea * 15000).toLocaleString()}/year`
        }
      });
    }

    // Water body detection
    if (assetData.water) {
      results.push({
        id: 'water',
        type: t('assetMapping.detection.types.water'),
        area: assetData.water.area,
        confidence: 88 + Math.floor(Math.random() * 8),
        status: t('assetMapping.detection.statusTypes.sourcesDetected', { count: assetData.water.sources }),
        icon: 'ri-drop-line',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        details: {
          quality: assetData.water.quality,
          type: assetData.water.seasonal,
          sources: assetData.water.sources
        },
        extendedInfo: {
          description: 'Water bodies including rivers, ponds, wells, and seasonal streams identified through spectral analysis.',
          waterTypes: ['Rivers', 'Ponds', 'Wells', 'Seasonal streams'],
          usage: ['Drinking water', 'Irrigation', 'Livestock', 'Fishing'],
          challenges: ['Water pollution', 'Seasonal scarcity', 'Groundwater depletion'],
          conservation: ['Rainwater harvesting', 'Watershed management', 'Water treatment'],
          capacity: `${Math.round(parseInt(assetData.water.area) * 0.8)} million liters`,
          beneficiaries: `${Math.round(assetData.settlement?.population * 1.2)} people`
        }
      });
    }

    // Agricultural land detection
    if (assetData.agriculture) {
      const agriArea = parseInt(assetData.agriculture.area) || 0;
      results.push({
        id: 'agriculture',
        type: t('assetMapping.detection.types.agriculture'),
        area: assetData.agriculture.area,
        confidence: 85 + Math.floor(Math.random() * 10),
        status: t('assetMapping.detection.statusTypes.productivity', { level: assetData.agriculture.productivity }),
        icon: 'ri-plant-line',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        details: {
          productivity: assetData.agriculture.productivity,
          crops: assetData.agriculture.crops,
          irrigation: assetData.agriculture.irrigation
        },
        extendedInfo: {
          description: 'Agricultural lands classified by crop type and productivity levels using multi-spectral satellite data.',
          cropTypes: assetData.agriculture.crops.split(', '),
          seasons: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'],
          yield: `${Math.round(agriArea * 2.3)} tons/year`,
          farmers: `${Math.round(agriArea / 2.5)} farming families`,
          income: `₹${Math.round(agriArea * 25000).toLocaleString()}/year`,
          challenges: ['Pest attacks', 'Weather dependency', 'Market access', 'Soil degradation']
        }
      });
    }

    // Settlement detection
    if (assetData.settlement) {
      results.push({
        id: 'settlement',
        type: t('assetMapping.detection.types.settlement'),
        area: assetData.settlement.area,
        confidence: 90 + Math.floor(Math.random() * 8),
        status: t('assetMapping.detection.statusTypes.population', { count: assetData.settlement.population }),
        icon: 'ri-home-4-line',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        details: {
          population: assetData.settlement.population,
          density: assetData.settlement.density,
          infrastructure: assetData.settlement.infrastructure
        },
        extendedInfo: {
          description: 'Residential and commercial settlements identified through building footprint analysis.',
          households: Math.round(assetData.settlement.population / 4.5),
          demographics: {
            children: `${Math.round(assetData.settlement.population * 0.35)}`,
            adults: `${Math.round(assetData.settlement.population * 0.55)}`,
            elderly: `${Math.round(assetData.settlement.population * 0.10)}`
          },
          facilities: ['Primary school', 'Health center', 'Community hall', 'Religious places'],
          utilities: ['Electricity', 'Water supply', 'Sanitation', 'Mobile connectivity'],
          livelihood: ['Agriculture', 'Forest products', 'Small business', 'Daily labor']
        }
      });
    }

    // Infrastructure detection
    if (assetData.infrastructure) {
      results.push({
        id: 'infrastructure',
        type: t('assetMapping.detection.types.infrastructure'),
        area: assetData.infrastructure.area,
        confidence: 87 + Math.floor(Math.random() * 8),
        status: t('assetMapping.detection.statusTypes.roads', { count: assetData.infrastructure.roads }),
        icon: 'ri-road-map-line',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        details: {
          roads: assetData.infrastructure.roads,
          connectivity: assetData.infrastructure.connectivity,
          facilities: assetData.infrastructure.facilities
        },
        extendedInfo: {
          description: 'Transportation and utility infrastructure mapped using high-resolution satellite imagery.',
          roadTypes: ['Paved roads', 'Gravel roads', 'Village paths', 'Forest tracks'],
          connectivity: {
            nearestTown: '15 km',
            railwayStation: '25 km',
            airport: '85 km',
            hospital: '12 km'
          },
          utilities: ['Power lines', 'Mobile towers', 'Water pipelines'],
          development: ['Road improvement needed', 'Bridge construction', 'Street lighting']
        }
      });
    }

    // Mineral resources detection (if available)
    if (assetData.minerals) {
      results.push({
        id: 'minerals',
        type: t('assetMapping.detection.types.minerals'),
        area: 'Survey Area',
        confidence: 75 + Math.floor(Math.random() * 15),
        status: t('assetMapping.detection.statusTypes.reserves', { level: assetData.minerals.reserves }),
        icon: 'ri-copper-diamond-line',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        details: {
          deposits: assetData.minerals.deposits,
          reserves: assetData.minerals.reserves,
          mining: assetData.minerals.mining
        },
        extendedInfo: {
          description: 'Mineral deposits identified through geological surveys and satellite-based mineral mapping.',
          mineralTypes: assetData.minerals.deposits.split(', '),
          extraction: assetData.minerals.mining,
          employment: `${Math.round(Math.random() * 200 + 50)} jobs`,
          revenue: `₹${Math.round(Math.random() * 5000000 + 1000000).toLocaleString()}/year`,
          environmental: ['Land restoration', 'Water management', 'Air quality monitoring'],
          regulations: ['Mining permits', 'Environmental clearance', 'Community consent']
        }
      });
    }

    return results;
  };

  // Default detection results when no location is selected
  useEffect(() => {
    if (!selectedLocation && detectionResults.length === 0) {
      setDetectionResults([
        {
          id: 'forest',
          type: t('assetMapping.detection.types.forest'),
          area: '2,450 ha',
          confidence: 94,
          status: t('assetMapping.detection.statusTypes.denseCoverage'),
          icon: 'ri-tree-line',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          details: { quality: 'Dense', biodiversity: 'High', coverage: '65%' },
          extendedInfo: {
            description: 'Dense forest coverage with high biodiversity value.',
            threats: ['Deforestation', 'Illegal logging'],
            conservation: ['Protected area', 'Community management'],
            species: ['Sal trees', 'Teak', 'Bamboo'],
            carbonSequestration: '6,125 tons CO2/year',
            economicValue: '₹3,67,50,000/year'
          }
        },
        {
          id: 'water',
          type: t('assetMapping.detection.types.water'),
          area: '180 ha',
          confidence: 91,
          status: t('assetMapping.detection.statusTypes.sourcesDetected', { count: 8 }),
          icon: 'ri-drop-line',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          details: { quality: 'Good', type: 'Perennial', sources: 8 },
          extendedInfo: {
            description: 'Multiple water sources supporting local ecosystem.',
            waterTypes: ['Rivers', 'Ponds', 'Wells'],
            usage: ['Drinking', 'Irrigation', 'Livestock'],
            challenges: ['Seasonal variation', 'Quality maintenance'],
            conservation: ['Rainwater harvesting', 'Watershed management'],
            capacity: '144 million liters',
            beneficiaries: '1,500 people'
          }
        },
        {
          id: 'agriculture',
          type: t('assetMapping.detection.types.agriculture'),
          area: '1,200 ha',
          confidence: 88,
          status: t('assetMapping.detection.statusTypes.productivity', { level: 'Medium' }),
          icon: 'ri-plant-line',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          details: { productivity: 'Medium', crops: 'Rice, Wheat', irrigation: '60%' },
          extendedInfo: {
            description: 'Mixed agricultural land with moderate productivity.',
            cropTypes: ['Rice', 'Wheat'],
            seasons: ['Kharif', 'Rabi'],
            yield: '2,760 tons/year',
            farmers: '480 families',
            income: '₹3,00,00,000/year',
            challenges: ['Weather dependency', 'Market access']
          }
        },
        {
          id: 'settlement',
          type: t('assetMapping.detection.types.settlement'),
          area: '320 ha',
          confidence: 96,
          status: t('assetMapping.detection.statusTypes.population', { count: 1250 }),
          icon: 'ri-home-4-line',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          details: { population: 1250, density: 'Medium', infrastructure: 'Good' },
          extendedInfo: {
            description: 'Well-established settlement with good infrastructure.',
            households: 278,
            demographics: { children: '438', adults: '688', elderly: '125' },
            facilities: ['School', 'Health center', 'Community hall'],
            utilities: ['Electricity', 'Water supply', 'Mobile network'],
            livelihood: ['Agriculture', 'Small business', 'Services']
          }
        }
      ]);
    }
  }, [selectedLocation, detectionResults.length, t]);

  const handleCardClick = (result: any) => {
    if (expandedCard === result.id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(result.id);
    }
  };

  const handleViewDetails = (result: any) => {
    setSelectedAsset(result);
    setShowDetailModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('assetMapping.detection.title')}</h3>
        {selectedLocation && (
          <div className="text-sm text-gray-600">
            {selectedLocation.village}, {selectedLocation.district}
          </div>
        )}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-brain-line animate-pulse"></i>
            </div>
            {t('assetMapping.detection.analyzing')}
          </div>
        )}
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-brain-line text-blue-600 animate-pulse"></i>
            </div>
            <div>
              <div className="font-medium text-blue-900">{t('assetMapping.detection.analysisInProgress')}</div>
              <div className="text-sm text-blue-700">{t('assetMapping.detection.processing', { village: selectedLocation?.village })}</div>
            </div>
          </div>
          <div className="bg-blue-100 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(analysisProgress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-blue-600 mt-1 text-right">
            {Math.round(analysisProgress)}{t('assetMapping.detection.complete')}
          </div>
        </div>
      )}

      {/* Detection Results */}
      <div className="space-y-4">
        {detectionResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${result.bgColor} border-opacity-50 transition-all duration-300 cursor-pointer hover:shadow-md ${isAnalyzing ? 'opacity-50' : 'opacity-100'
              } ${expandedCard === result.id ? 'ring-2 ring-blue-300' : ''}`}
            onClick={() => !isAnalyzing && handleCardClick(result)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${result.bgColor} rounded-lg flex items-center justify-center`}>
                  <div className={`w-5 h-5 flex items-center justify-center ${result.color}`}>
                    <i className={result.icon}></i>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{result.type}</h4>
                  <p className="text-sm text-gray-600">{result.status}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {isAnalyzing ? '...' : result.area}
                </div>
                <div className={`text-sm font-medium ${result.color}`}>
                  {isAnalyzing ? '...' : `${result.confidence}% confidence`}
                </div>
              </div>
            </div>

            {/* Basic Details */}
            {!isAnalyzing && result.details && (
              <div className="pt-3 border-t border-gray-200 border-opacity-50">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {Object.entries(result.details).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-gray-600 capitalize">{key}:</div>
                      <div className="font-medium text-gray-900">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded Content */}
            {expandedCard === result.id && !isAnalyzing && result.extendedInfo && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">{result.extendedInfo.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {result.extendedInfo.carbonSequestration && (
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-green-700">{t('assetMapping.detection.carbonSequestration')}</div>
                        <div className="text-gray-900">{result.extendedInfo.carbonSequestration}</div>
                      </div>
                    )}
                    {result.extendedInfo.economicValue && (
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-blue-700">{t('assetMapping.detection.economicValue')}</div>
                        <div className="text-gray-900">{result.extendedInfo.economicValue}</div>
                      </div>
                    )}
                    {result.extendedInfo.capacity && (
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-blue-700">{t('assetMapping.detection.waterCapacity')}</div>
                        <div className="text-gray-900">{result.extendedInfo.capacity}</div>
                      </div>
                    )}
                    {result.extendedInfo.yield && (
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-yellow-700">{t('assetMapping.detection.annualYield')}</div>
                        <div className="text-gray-900">{result.extendedInfo.yield}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(result);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
                    >
                      {t('assetMapping.detection.viewFullDetails')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Expand/Collapse Indicator */}
            {!isAnalyzing && (
              <div className="flex justify-center mt-3">
                <div className={`w-6 h-6 flex items-center justify-center ${result.color} transition-transform duration-200 ${expandedCard === result.id ? 'rotate-180' : ''
                  }`}>
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analysis Summary */}
      {!isAnalyzing && detectionResults.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t('assetMapping.detection.analysisComplete')}</span>
            </div>
            <div className="text-gray-500">
              {t('assetMapping.detection.assetsDetected', { count: detectionResults.length })}
            </div>
          </div>

          {selectedLocation && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t('assetMapping.detection.summary', { village: selectedLocation.village })}</div>
              <div className="text-xs text-gray-500">
                {t('assetMapping.detection.averageConfidence')}: {Math.round(detectionResults.reduce((acc, r) => acc + r.confidence, 0) / detectionResults.length)}% •
                {t('assetMapping.detection.dataSource')}: {t('assetMapping.detection.realTimeAnalysis')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Modal */}
      {showDetailModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${selectedAsset.bgColor} rounded-lg flex items-center justify-center`}>
                    <div className={`w-6 h-6 flex items-center justify-center ${selectedAsset.color}`}>
                      <i className={selectedAsset.icon}></i>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedAsset.type}</h2>
                    <p className="text-gray-600">{selectedAsset.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 ${selectedAsset.bgColor} rounded-lg border`}>
                  <div className={`${selectedAsset.color} font-medium`}>{t('assetMapping.detection.areaCoverage')}</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedAsset.area}</div>
                </div>
                <div className={`p-4 ${selectedAsset.bgColor} rounded-lg border`}>
                  <div className={`${selectedAsset.color} font-medium`}>{t('assetMapping.detection.detectionConfidence')}</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedAsset.confidence}%</div>
                </div>
                <div className={`p-4 ${selectedAsset.bgColor} rounded-lg border`}>
                  <div className={`${selectedAsset.color} font-medium`}>{t('assetMapping.detection.status')}</div>
                  <div className="text-lg font-bold text-gray-900">{selectedAsset.status}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('assetMapping.detection.description')}</h3>
                <p className="text-gray-700">{selectedAsset.extendedInfo.description}</p>
              </div>

              {/* Extended Information */}
              <div className="space-y-6">
                {selectedAsset.extendedInfo.species && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assetMapping.detection.speciesAndBiodiversity')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAsset.extendedInfo.species.map((species: any, index: number) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {species}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAsset.extendedInfo.waterTypes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assetMapping.detection.waterSourceTypes')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAsset.extendedInfo.waterTypes.map((type: any, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAsset.extendedInfo.cropTypes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assetMapping.detection.cropTypes')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAsset.extendedInfo.cropTypes.map((crop: any, index: number) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAsset.extendedInfo.facilities && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assetMapping.detection.availableFacilities')}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAsset.extendedInfo.facilities.map((facility: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <i className="ri-check-line text-green-600"></i>
                          {facility}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAsset.extendedInfo.challenges && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assetMapping.detection.keyChallenges')}</h4>
                    <div className="space-y-2">
                      {selectedAsset.extendedInfo.challenges.map((challenge: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <i className="ri-alert-line text-orange-600"></i>
                          {challenge}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAsset.extendedInfo.conservation && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assetMapping.detection.conservationMeasures')}</h4>
                    <div className="space-y-2">
                      {selectedAsset.extendedInfo.conservation.map((measure: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <i className="ri-leaf-line text-green-600"></i>
                          {measure}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Metrics */}
              {(selectedAsset.extendedInfo.carbonSequestration || selectedAsset.extendedInfo.economicValue || selectedAsset.extendedInfo.beneficiaries) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('assetMapping.detection.impactMetrics')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedAsset.extendedInfo.carbonSequestration && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{selectedAsset.extendedInfo.carbonSequestration}</div>
                        <div className="text-sm text-green-600">{t('assetMapping.detection.carbonSequestration')}</div>
                      </div>
                    )}
                    {selectedAsset.extendedInfo.economicValue && (
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{selectedAsset.extendedInfo.economicValue}</div>
                        <div className="text-sm text-blue-600">{t('assetMapping.detection.economicValue')}</div>
                      </div>
                    )}
                    {selectedAsset.extendedInfo.beneficiaries && (
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">{selectedAsset.extendedInfo.beneficiaries}</div>
                        <div className="text-sm text-orange-600">{t('assetMapping.detection.beneficiaries')}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
