'use client';

import { useState, useRef } from 'react';
import { apiService } from '../../atlas/services/apiService';

export default function DataUploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadType, setUploadType] = useState<'claims' | 'boundaries'>('claims');
  const [boundaryData, setBoundaryData] = useState({
    state: '',
    district: '',
    village: '',
    tribalGroup: '',
    boundaryType: 'village' as 'state' | 'district' | 'village' | 'tribal'
  });
  const [geojsonData, setGeojsonData] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadMessage('');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await apiService.uploadClaimsData(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        setUploadMessage(`✅ Successfully uploaded ${result.recordsProcessed} records!`);
      } else {
        setUploadMessage(`❌ Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage(`❌ Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    }
  };

  const handleBoundaryUpload = async () => {
    if (!boundaryData.state || !boundaryData.district || !geojsonData) {
      setUploadMessage('❌ Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadMessage('');

    try {
      const geojson = JSON.parse(geojsonData);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await apiService.uploadBoundaryData({
        state: boundaryData.state,
        district: boundaryData.district,
        village: boundaryData.village,
        tribalGroup: boundaryData.tribalGroup,
        boundaryType: boundaryData.boundaryType,
        geojson: geojson
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        setUploadMessage(`✅ Successfully uploaded boundary data!`);
        setBoundaryData({
          state: '',
          district: '',
          village: '',
          tribalGroup: '',
          boundaryType: 'village'
        });
        setGeojsonData('');
      } else {
        setUploadMessage(`❌ Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage(`❌ Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Upload Center</h1>
          
          {/* Upload Type Selector */}
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUploadType('claims')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadType === 'claims' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-file-list-line mr-2"></i>
                Upload Claims Data
              </button>
              <button
                onClick={() => setUploadType('boundaries')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadType === 'boundaries' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-map-2-line mr-2"></i>
                Upload Boundary Data
              </button>
            </div>
          </div>

          {/* Claims Data Upload */}
          {uploadType === 'claims' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Claims Data</h2>
                <p className="text-gray-600 mb-6">
                  Upload CSV or JSON files containing claims data. The file should include columns for State, District, Village, TribalGroup, and claim counts.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <i className="ri-upload-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Choose File to Upload</h3>
                  <p className="text-gray-600 mb-4">CSV or JSON files only</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Select File'}
                  </button>
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Upload Message */}
                {uploadMessage && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    uploadMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {uploadMessage}
                  </div>
                )}
              </div>

              {/* Sample Data Format */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Data Format</h3>
                <div className="bg-white rounded border p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-600">
{`State,District,Village,TribalGroup,IndividualRights,CommunityRights,ForestResources,TotalArea,Households,ApprovedCount,PendingCount,UnderReviewCount,RejectedCount
Telangana,Bhadradri Kothagudem,Aswapuram,Koya,15,8,5,45 hectares,25,12,3,2,1
Jharkhand,Ranchi,Angara,Munda,22,12,8,78 hectares,35,18,4,3,2
Madhya Pradesh,Dindori,Amarpur,Gond,18,10,6,62 hectares,28,14,2,1,1`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Boundary Data Upload */}
          {uploadType === 'boundaries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Boundary Data</h2>
                <p className="text-gray-600 mb-6">
                  Upload GeoJSON data for village, district, state, or tribal boundaries.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={boundaryData.state}
                      onChange={(e) => setBoundaryData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Telangana"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <input
                      type="text"
                      value={boundaryData.district}
                      onChange={(e) => setBoundaryData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Bhadradri Kothagudem"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                    <input
                      type="text"
                      value={boundaryData.village}
                      onChange={(e) => setBoundaryData(prev => ({ ...prev, village: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Aswapuram"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tribal Group</label>
                    <input
                      type="text"
                      value={boundaryData.tribalGroup}
                      onChange={(e) => setBoundaryData(prev => ({ ...prev, tribalGroup: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Koya"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Boundary Type</label>
                    <select
                      value={boundaryData.boundaryType}
                      onChange={(e) => setBoundaryData(prev => ({ ...prev, boundaryType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="state">State</option>
                      <option value="district">District</option>
                      <option value="village">Village</option>
                      <option value="tribal">Tribal Area</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GeoJSON Data *</label>
                  <textarea
                    value={geojsonData}
                    onChange={(e) => setGeojsonData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Paste your GeoJSON data here..."
                  />
                </div>

                <button
                  onClick={handleBoundaryUpload}
                  disabled={isUploading || !boundaryData.state || !boundaryData.district || !geojsonData}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload Boundary Data'}
                </button>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Upload Message */}
                {uploadMessage && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    uploadMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {uploadMessage}
                  </div>
                )}
              </div>

              {/* Sample GeoJSON Format */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample GeoJSON Format</h3>
                <div className="bg-white rounded border p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-600">
{`{
  "type": "Feature",
  "properties": {
    "name": "Koya Tribal Area - Aswapuram",
    "tribalGroup": "Koya",
    "village": "Aswapuram",
    "district": "Bhadradri Kothagudem",
    "state": "Telangana",
    "area": "45 hectares"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [80.5200, 17.2400],
      [80.5400, 17.2400],
      [80.5400, 17.2200],
      [80.5200, 17.2200],
      [80.5200, 17.2400]
    ]]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
