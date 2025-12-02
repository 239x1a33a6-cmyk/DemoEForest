// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

'use client';

import { useState, useEffect } from 'react';

export default function ProcessingQueue() {
  const [queueItems, setQueueItems] = useState([
    {
      id: 1,
      filename: 'FRA_Claims_Raigarh_2023.pdf',
      status: 'processing',
      progress: 67,
      stage: 'OCR Extraction',
      estimatedTime: '3 min remaining'
    },
    {
      id: 2,
      filename: 'IFR_Verification_Bastar.pdf',
      status: 'completed',
      progress: 100,
      stage: 'NER Analysis Complete',
      extractedEntities: 45
    },
    {
      id: 3,
      filename: 'CFR_Records_Sundargarh.pdf',
      status: 'queued',
      progress: 0,
      stage: 'Waiting in queue',
      queuePosition: 3
    },
    {
      id: 4,
      filename: 'CR_Documents_Koraput.pdf',
      status: 'error',
      progress: 0,
      stage: 'Processing failed',
      error: 'Invalid file format'
    }
  ]);

  // Listen for new files being processed
  useEffect(() => {
    const handleFilesProcessed = (event) => {
      const newFiles = event.detail.files;
      setQueueItems(prev => [...newFiles, ...prev]);
      
      // Start processing simulation for new files
      newFiles.forEach((file, index) => {
        setTimeout(() => {
          simulateProcessing(file.id);
        }, index * 500);
      });
    };

    window.addEventListener('filesProcessed', handleFilesProcessed);
    
    return () => {
      window.removeEventListener('filesProcessed', handleFilesProcessed);
    };
  }, []);

  // Simulate processing progress
  const simulateProcessing = (fileId) => {
    const progressInterval = setInterval(() => {
      setQueueItems(prev => prev.map(item => {
        if (item.id === fileId && item.status === 'processing') {
          const newProgress = Math.min(item.progress + Math.random() * 15, 100);
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return {
              ...item,
              status: 'completed',
              progress: 100,
              stage: 'NER Analysis Complete',
              extractedEntities: Math.floor(Math.random() * 50) + 20,
              estimatedTime: undefined
            };
          }
          
          return {
            ...item,
            progress: newProgress,
            estimatedTime: `${Math.ceil((100 - newProgress) / 20)} min remaining`
          };
        }
        return item;
      }));
    }, 1000);
  };

  const retryProcessing = (fileId) => {
    setQueueItems(prev => prev.map(item => {
      if (item.id === fileId) {
        const updatedItem = {
          ...item,
          status: 'processing',
          progress: 0,
          stage: 'OCR Extraction',
          error: undefined,
          estimatedTime: '5 min remaining'
        };
        
        // Start processing simulation
        setTimeout(() => simulateProcessing(fileId), 500);
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeFromQueue = (fileId) => {
    setQueueItems(prev => prev.filter(item => item.id !== fileId));
  };

  const viewResults = (fileId) => {
    // Dispatch event to show results
    const event = new CustomEvent('viewProcessingResults', {
      detail: { fileId }
    });
    window.dispatchEvent(event);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="ri-eye-line"></i>
        <span>Opening extraction results...</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'queued': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return 'ri-refresh-line';
      case 'completed': return 'ri-check-line';
      case 'queued': return 'ri-time-line';
      case 'error': return 'ri-error-warning-line';
      default: return 'ri-file-line';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Processing Queue</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live updates</span>
        </div>
      </div>

      {queueItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <i className="ri-file-list-3-line text-4xl text-gray-300"></i>
          </div>
          <p className="text-gray-500 mb-2">No files in processing queue</p>
          <p className="text-sm text-gray-400">Upload documents to start processing</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queueItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${getStatusColor(item.status)}`}>
                    <i className={`${getStatusIcon(item.status)} text-sm ${
                      item.status === 'processing' ? 'animate-spin' : ''
                    }`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.filename}</p>
                    <p className="text-xs text-gray-500">{item.stage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </div>
              </div>

              {item.status === 'processing' && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(item.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.estimatedTime}</p>
                </div>
              )}

              {item.status === 'completed' && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Entities extracted: {item.extractedEntities}</span>
                  <button 
                    onClick={() => viewResults(item.id)}
                    className="text-green-600 hover:text-green-700 cursor-pointer whitespace-nowrap font-medium"
                  >
                    View Results
                  </button>
                </div>
              )}

              {item.status === 'queued' && (
                <p className="text-xs text-gray-500">Position in queue: #{item.queuePosition}</p>
              )}

              {item.status === 'error' && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-red-600">{item.error}</p>
                  <button 
                    onClick={() => retryProcessing(item.id)}
                    className="text-blue-600 hover:text-blue-700 text-xs cursor-pointer whitespace-nowrap font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Queue Statistics */}
      {queueItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {queueItems.filter(item => item.status === 'processing').length}
              </div>
              <div className="text-xs text-gray-500">Processing</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {queueItems.filter(item => item.status === 'queued').length}
              </div>
              <div className="text-xs text-gray-500">Queued</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {queueItems.filter(item => item.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {queueItems.filter(item => item.status === 'error').length}
              </div>
              <div className="text-xs text-gray-500">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
