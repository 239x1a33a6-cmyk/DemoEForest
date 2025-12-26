'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ClassificationResults() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const classificationData = {
    overview: [
      { category: t('assetMapping.detection.types.forest'), area: '2,847 ha', percentage: 42.5, color: 'bg-green-600' },
      { category: t('assetMapping.detection.types.agriculture'), area: '1,923 ha', percentage: 28.7, color: 'bg-yellow-500' },
      { category: t('assetMapping.detection.types.water'), area: '456 ha', percentage: 6.8, color: 'bg-blue-500' },
      { category: t('assetMapping.detection.types.settlement'), area: '634 ha', percentage: 9.5, color: 'bg-purple-500' },
      { category: t('assetMapping.detection.statusTypes.sparseCoverage'), area: '845 ha', percentage: 12.5, color: 'bg-orange-500' }
    ],
    details: [
      {
        id: 1,
        type: t('assetMapping.detection.types.forest'),
        subtype: t('assetMapping.detection.statusTypes.denseCoverage'),
        area: '1,245 ha',
        confidence: 0.96,
        coordinates: '19.8762°N, 82.4528°E',
        lastUpdated: '2024-11-15'
      },
      {
        id: 2,
        type: t('assetMapping.detection.types.water'),
        subtype: 'Pond',
        area: '12.5 ha',
        confidence: 0.89,
        coordinates: '19.8745°N, 82.4501°E',
        lastUpdated: '2024-11-15'
      },
      {
        id: 3,
        type: t('assetMapping.detection.types.agriculture'),
        subtype: 'Cropland',
        area: '567 ha',
        confidence: 0.92,
        coordinates: '19.8798°N, 82.4567°E',
        lastUpdated: '2024-11-15'
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: t('assetMapping.classification.tabs.overview'), icon: 'ri-pie-chart-line' },
    { id: 'details', name: t('assetMapping.classification.tabs.details'), icon: 'ri-list-check' },
    { id: 'timeline', name: t('assetMapping.classification.tabs.timeline'), icon: 'ri-time-line' }
  ];

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleScheduleUpdate = () => {
    setShowScheduleModal(true);
  };

  const executeExport = (format: string) => {
    setIsExporting(true);
    setShowExportModal(false);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // Create and download file
      const data = JSON.stringify(classificationData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `asset-classification-report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const executeSchedule = (frequency: string) => {
    setIsScheduling(true);
    setShowScheduleModal(false);

    // Simulate scheduling process
    setTimeout(() => {
      setIsScheduling(false);
      alert(`Analysis scheduled for ${frequency} updates`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('assetMapping.classification.title')}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {isExporting ? (
              <div className="flex items-center space-x-1">
                <i className="ri-refresh-line animate-spin"></i>
                <span>{t('assetMapping.classification.exporting')}</span>
              </div>
            ) : (
              t('assetMapping.classification.exportReport')
            )}
          </button>
          <button
            onClick={handleScheduleUpdate}
            disabled={isScheduling}
            className="text-sm text-green-600 hover:text-green-700 cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {isScheduling ? (
              <div className="flex items-center space-x-1">
                <i className="ri-refresh-line animate-spin"></i>
                <span>{t('assetMapping.classification.scheduling')}</span>
              </div>
            ) : (
              t('assetMapping.classification.scheduleUpdate')
            )}
          </button>
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <i className={`${tab.icon} text-sm`}></i>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {classificationData.overview.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.category}</h4>
                  <p className="text-sm text-gray-600">{item.area}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">{t('assetMapping.classification.table.assetType')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">{t('assetMapping.classification.table.subtype')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">{t('assetMapping.classification.table.area')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">{t('assetMapping.classification.table.confidence')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">{t('assetMapping.classification.table.coordinates')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">{t('assetMapping.classification.table.lastUpdated')}</th>
              </tr>
            </thead>
            <tbody>
              {classificationData.details.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{item.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.subtype}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.area}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.confidence >= 0.9 ? 'text-green-600 bg-green-100' :
                        item.confidence >= 0.8 ? 'text-yellow-600 bg-yellow-100' :
                          'text-red-600 bg-red-100'
                      }`}>
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.coordinates}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <i className="ri-time-line text-4xl text-gray-400"></i>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">{t('assetMapping.classification.timeline.title')}</h4>
          <p className="text-gray-600 mb-4">{t('assetMapping.classification.timeline.description')}</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap">
            {t('assetMapping.classification.timeline.generate')}
          </button>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assetMapping.classification.export.title')}</h3>
            <div className="space-y-3">
              <button
                onClick={() => executeExport('pdf')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-file-pdf-line text-red-600"></i>
                  <div>
                    <div className="font-medium">{t('assetMapping.classification.export.pdf')}</div>
                    <div className="text-sm text-gray-600">{t('assetMapping.classification.export.pdfDesc')}</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => executeExport('csv')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-file-excel-line text-green-600"></i>
                  <div>
                    <div className="font-medium">{t('assetMapping.classification.export.csv')}</div>
                    <div className="text-sm text-gray-600">{t('assetMapping.classification.export.csvDesc')}</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => executeExport('json')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-file-code-line text-blue-600"></i>
                  <div>
                    <div className="font-medium">{t('assetMapping.classification.export.json')}</div>
                    <div className="text-sm text-gray-600">{t('assetMapping.classification.export.jsonDesc')}</div>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                {t('assetMapping.classification.export.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assetMapping.classification.schedule.title')}</h3>
            <div className="space-y-3">
              <button
                onClick={() => executeSchedule('Daily')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-calendar-line text-blue-600"></i>
                  <div>
                    <div className="font-medium">{t('assetMapping.classification.schedule.daily')}</div>
                    <div className="text-sm text-gray-600">{t('assetMapping.classification.schedule.dailyDesc')}</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => executeSchedule('Weekly')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-calendar-week-line text-green-600"></i>
                  <div>
                    <div className="font-medium">{t('assetMapping.classification.schedule.weekly')}</div>
                    <div className="text-sm text-gray-600">{t('assetMapping.classification.schedule.weeklyDesc')}</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => executeSchedule('Monthly')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="ri-calendar-month-line text-purple-600"></i>
                  <div>
                    <div className="font-medium">{t('assetMapping.classification.schedule.monthly')}</div>
                    <div className="text-sm text-gray-600">{t('assetMapping.classification.schedule.monthlyDesc')}</div>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                {t('assetMapping.classification.schedule.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
