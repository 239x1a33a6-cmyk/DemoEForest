// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

'use client';

import { useState } from 'react';

export default function ExtractionResults() {
  const [selectedDocument, setSelectedDocument] = useState('doc1');

  const extractedData = {
    doc1: {
      filename: 'IFR_Verification_Bastar.pdf',
      entities: [
        { type: 'Person', value: 'Ramesh Kumar Singh', confidence: 0.95 },
        { type: 'Village', value: 'Bhairamgarh', confidence: 0.92 },
        { type: 'District', value: 'Bastar', confidence: 0.98 },
        { type: 'State', value: 'Chhattisgarh', confidence: 0.97 },
        { type: 'Claim ID', value: 'IFR/2023/BST/1234', confidence: 0.89 },
        { type: 'Date', value: '15-03-2023', confidence: 0.93 },
        { type: 'Area', value: '2.5 acres', confidence: 0.87 }
      ],
      extractedText: 'Individual Forest Right (IFR) verification certificate for Ramesh Kumar Singh, resident of Bhairamgarh village, Bastar district, Chhattisgarh state. Claim ID: IFR/2023/BST/1234. Date of verification: 15-03-2023. Approved area: 2.5 acres...'
    },
    doc2: {
      filename: 'CFR_Records_Sundargarh.pdf',
      entities: [
        { type: 'Community', value: 'Bhil Tribal Community', confidence: 0.94 },
        { type: 'Village', value: 'Kansbahal', confidence: 0.91 },
        { type: 'District', value: 'Sundargarh', confidence: 0.96 },
        { type: 'State', value: 'Odisha', confidence: 0.98 },
        { type: 'Claim ID', value: 'CFR/2023/SUN/5678', confidence: 0.88 },
        { type: 'Date', value: '22-04-2023', confidence: 0.92 },
        { type: 'Area', value: '150 hectares', confidence: 0.85 }
      ],
      extractedText: 'Community Forest Resource (CFR) rights granted to Bhil Tribal Community of Kansbahal village, Sundargarh district, Odisha state. Claim ID: CFR/2023/SUN/5678. Date of grant: 22-04-2023. Approved forest area: 150 hectares...'
    }
  };

  const documents = [
    { id: 'doc1', name: 'IFR_Verification_Bastar.pdf' },
    { id: 'doc2', name: 'CFR_Records_Sundargarh.pdf' }
  ];

  const currentDoc = extractedData[selectedDocument as keyof typeof extractedData];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Extraction Results</h3>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer pr-8"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 cursor-pointer whitespace-nowrap">
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Named Entities</h4>
          <div className="space-y-3">
            {currentDoc.entities.map((entity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">{entity.type}:</span>
                  <span className="text-sm text-gray-900 ml-2">{entity.value}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(entity.confidence)}`}>
                  {Math.round(entity.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Extracted Text</h4>
          <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              {currentDoc.extractedText}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Accuracy: 92%</span>
              <span>Processing time: 2.3s</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap">
                Edit
              </button>
              <button className="text-sm text-green-600 hover:text-green-700 cursor-pointer whitespace-nowrap">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
