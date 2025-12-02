// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

'use client';

import { useState } from 'react';

export default function UploadSection() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing with realistic progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Add files to processing queue
          const event = new CustomEvent('filesProcessed', {
            detail: {
              files: files.map((file, index) => ({
                id: Date.now() + index,
                filename: file.name,
                status: 'processing',
                progress: 0,
                stage: 'OCR Extraction',
                estimatedTime: `${Math.floor(Math.random() * 5) + 2} min remaining`,
                size: file.size
              }))
            }
          });
          window.dispatchEvent(event);

          // Show success notification
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
          notification.innerHTML = `
            <div class="flex items-center gap-2">
              <i class="ri-check-line"></i>
              <span>${files.length} files added to processing queue</span>
            </div>
          `;
          document.body.appendChild(notification);
          
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
          }, 3000);

          // Reset state
          setTimeout(() => {
            setIsProcessing(false);
            setProcessingProgress(0);
            setFiles([]);
          }, 1000);
          
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <i className="ri-upload-cloud-2-line text-3xl text-gray-400"></i>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop your FRA documents here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports PDF, JPG, PNG files up to 10MB each
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <i className="ri-folder-open-line mr-2"></i>
          Choose Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Files ({files.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-file-text-line text-blue-500"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={isProcessing}
                  className={`w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-loader-4-line text-blue-600 animate-spin"></i>
                </div>
                <div>
                  <div className="font-medium text-blue-900">Preparing Files for Processing</div>
                  <div className="text-sm text-blue-700">Validating and uploading {files.length} documents...</div>
                </div>
              </div>
              <div className="bg-blue-100 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(processingProgress, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-600 mt-1 text-right">
                {Math.round(processingProgress)}% Complete
              </div>
            </div>
          )}

          <button
            onClick={processFiles}
            disabled={isProcessing || files.length === 0}
            className={`w-full mt-4 py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              isProcessing || files.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin"></i>
                </div>
                Processing Files...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-play-line"></i>
                </div>
                Start Processing
              </div>
            )}
          </button>
        </div>
      )}

      {/* File Processing Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Processing Tips</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>Clear, high-resolution scans work best</span>
          </li>
          <li className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>PDF files are processed faster than images</span>
          </li>
          <li className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>Processing time: ~2-5 minutes per document</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
