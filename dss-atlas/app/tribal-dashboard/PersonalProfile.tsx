
'use client';

import { useState } from 'react';

export default function PersonalProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    firstName: 'Ravi',
    lastName: 'Oraon',
    email: 'ravi.oraon@community.fra',
    phone: '+91 9876543210',
    tribalCommunity: 'Ho',
    village: 'Khunti Village',
    district: 'Khunti',
    state: 'Jharkhand',
    traditionalOccupation: 'Agriculture, Forest produce collection',
    landHolding: 'Traditional agricultural land of 5.2 acres used by family for over 50 years',
    familyMembers: '6',
    registrationDate: '2024-01-15'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, JPEG, or PNG files.');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should not exceed 5MB.');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowUploadModal(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const documents = [
    {
      id: 1,
      name: 'Aadhaar Card',
      status: 'verified',
      uploadDate: '2024-01-15',
      size: '2.1 MB',
      expiryDate: null,
      renewalRequired: false
    },
    {
      id: 2,
      name: 'Tribal Certificate',
      status: 'verified',
      uploadDate: '2024-01-15',
      size: '1.8 MB',
      expiryDate: null,
      renewalRequired: false
    },
    {
      id: 3,
      name: 'Land Records',
      status: 'verified',
      uploadDate: '2024-01-16',
      size: '3.2 MB',
      expiryDate: null,
      renewalRequired: false
    },
    {
      id: 4,
      name: 'Income Certificate',
      status: 'pending',
      uploadDate: '2024-01-20',
      size: '1.5 MB',
      expiryDate: '2024-12-31',
      renewalRequired: true
    },
    {
      id: 5,
      name: 'Residence Proof',
      status: 'expired',
      uploadDate: '2023-06-15',
      size: '2.3 MB',
      expiryDate: '2024-01-15',
      renewalRequired: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDocument = (doc: any) => {
    // Simulate document viewing
    window.open('#', '_blank');
  };

  const handleDownloadDocument = (doc: any) => {
    // Simulate document download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${doc.name}.pdf`;
    link.click();
  };

  const handleDeleteDocument = (docId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      // Handle document deletion
      console.log('Deleting document:', docId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-4xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
              <p className="text-blue-100">{formData.tribalCommunity} Tribe • {formData.village}</p>
              <p className="text-blue-200 text-sm">Member since {formData.registrationDate}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap"
          >
            <i className="ri-edit-line mr-2"></i>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Document Alerts */}
      {documents.some(doc => doc.renewalRequired || doc.status === 'expired') && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <i className="ri-alert-line text-2xl text-red-600"></i>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Document Renewal Required</h3>
              <p className="text-sm text-red-700">
                {documents.filter(doc => doc.renewalRequired || doc.status === 'expired').length} document(s) need renewal or have expired.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tribal Community</label>
              {isEditing ? (
                <select
                  name="tribalCommunity"
                  value={formData.tribalCommunity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="Ho">Ho</option>
                  <option value="Santhal">Santhal</option>
                  <option value="Munda">Munda</option>
                  <option value="Oraon">Oraon</option>
                  <option value="Kharia">Kharia</option>
                  <option value="Bhumij">Bhumij</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.tribalCommunity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Members</label>
              {isEditing ? (
                <input
                  type="number"
                  name="familyMembers"
                  value={formData.familyMembers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.familyMembers} members</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              {isEditing ? (
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.village}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              {isEditing ? (
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.district}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              {isEditing ? (
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.state}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Livelihood Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Livelihood Information</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Traditional Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="traditionalOccupation"
                  value={formData.traditionalOccupation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.traditionalOccupation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Holding Details</label>
              {isEditing ? (
                <textarea
                  name="landHolding"
                  value={formData.landHolding}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.landHolding}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-upload-line mr-2"></i>
              Upload Document
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <i className="ri-file-text-line text-2xl text-blue-600"></i>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{doc.name}</h4>
                      <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                      {doc.expiryDate && (
                        <p className="text-xs text-red-500">Expires: {doc.expiryDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    {doc.renewalRequired && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Renewal Required
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{doc.size}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer whitespace-nowrap"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(doc)}
                      className="text-green-600 hover:text-green-800 text-sm cursor-pointer whitespace-nowrap"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-800 text-sm cursor-pointer whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-8">
                  <option value="">Select document type</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="tribal">Tribal Certificate</option>
                  <option value="income">Income Certificate</option>
                  <option value="residence">Residence Proof</option>
                  <option value="land">Land Records</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                >
                  Choose File
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, JPEG, PNG (Max size: 5MB)
                </p>
              </div>

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
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
