
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClaim, getClaimsByUser } from '@/lib/firestore/claims';
import { FRAClaim } from '@/lib/types/fra-workflow';

export default function FRAApplications() {
  const { user } = useAuth();
  const [activeApplication, setActiveApplication] = useState<any>(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('');

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      if (user?.uid) {
        try {
          const claims = await getClaimsByUser(user.uid);
          // Map Firestore data to UI format if needed, or adjust UI to match data
          setApplications(claims.map(c => ({
            id: c.id,
            title: c.type === 'IFR' ? 'Individual Forest Right' : c.type === 'CFR' ? 'Community Forest Resource' : c.type,
            applicationNumber: `FRA/${c.updatedAt.substring(0, 4)}/CLAIM/${c.id.substring(0, 5).toUpperCase()}`,
            landArea: c.formData?.areaClaimed || 'N/A',
            location: `${c.village}, ${c.district}`,
            status: c.status.toLowerCase(),
            submittedDate: c.createdAt.split('T')[0],
            lastUpdated: c.updatedAt.split('T')[0],
            documents: c.documents?.map(d => d.name) || [],
            description: c.formData?.natureOfRight || 'No description',
            gpsCoordinates: '23.3441° N, 85.2263° E', // Placeholder if not in data
            certificateAvailable: c.status === 'TITLE_ISSUED'
          })));
        } catch (error) {
          console.error("Error fetching claims:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchClaims();
  }, [user]);

  // Removed hardcoded applications list

  // End of applications state setup

  const governmentSchemes = [
    {
      id: 1,
      name: 'Individual Forest Rights (IFR)',
      description: 'Rights to forest land for individual families who have been traditionally residing in forest areas',
      eligibility: 'Scheduled Tribes and other traditional forest dwellers',
      documents: ['Aadhaar Card', 'Tribal Certificate', 'Land Survey Map', 'Witness Statements', 'Traditional Use Evidence']
    },
    {
      id: 2,
      name: 'Community Forest Rights (CFR)',
      description: 'Rights to community forest resources for sustainable use and conservation',
      eligibility: 'Gram Sabha of villages with forest dwelling communities',
      documents: ['Community Resolution', 'Traditional Use Evidence', 'Community Maps', 'Panchayat Resolution']
    },
    {
      id: 3,
      name: 'Community Forest Resource Rights',
      description: 'Rights to protect, regenerate, conserve or manage community forest resources',
      eligibility: 'Forest dwelling Scheduled Tribes and other traditional forest dwellers',
      documents: ['Community Agreement', 'Forest Management Plan', 'Traditional Knowledge Documentation']
    },
    {
      id: 4,
      name: 'Conversion of Pattas/Leases/Grants',
      description: 'Conversion of existing pattas or leases or grants issued by any local authority',
      eligibility: 'Holders of existing pattas/leases in forest areas',
      documents: ['Existing Patta/Lease Documents', 'Survey Records', 'Revenue Records']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'ri-check-line';
      case 'under-review': return 'ri-time-line';
      case 'rejected': return 'ri-close-line';
      default: return 'ri-file-line';
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const type = selectedScheme.includes('Individual') ? 'IFR' : 'CFR';

      const claimData: Partial<FRAClaim> = {
        claimantId: user.uid,
        claimantName: user.displayName || formData.get('fullName') as string,
        type: type,
        state: user.state || 'Jharkhand', // Fallback
        district: user.district || 'Khunti',
        block: user.block || 'Khunti',
        village: user.village || 'Khunti Village',
        formData: {
          // fd_name_of_claimant removed as it is not in type
          areaClaimed: formData.get('landArea') as string,
          natureOfRight: formData.get('description') as string,
          // boundaries: ... (would come from GPS input or map)
        },
        // Mock documents for now
        documents: []
      };

      await createClaim(claimData);

      // Refresh list (simple reload for now or fetch again)
      setActiveApplication(null);
      setShowNewApplication(false);
      window.location.reload(); // Simple refresh for demo

    } catch (error) {
      console.error("Error creating claim", error);
      alert("Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: any) => {
    setActiveApplication(application);
    setShowApplicationDetails(true);
  };

  const handleViewOnMap = (application: any) => {
    setActiveApplication(application);
    setShowMapView(true);
  };

  const handleDownloadCertificate = (application: any) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `FRA_Certificate_${application.applicationNumber}.pdf`;
    link.click();
  };

  const handleDownloadDocument = (docName: string) => {
    // Simulate document download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${docName}.pdf`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My FRA Applications</h2>
          <button
            onClick={() => setShowNewApplication(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Create New Application
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-check-line text-2xl text-green-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-green-900">2</p>
                <p className="text-sm text-green-700">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-time-line text-2xl text-yellow-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-yellow-900">1</p>
                <p className="text-sm text-yellow-700">Under Review</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-map-2-line text-2xl text-blue-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-blue-900">4.3</p>
                <p className="text-sm text-blue-700">Total Acres</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((application) => (
          <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{application.title}</h3>
                  <p className="text-sm text-gray-500">Application #{application.applicationNumber}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                  <i className={`${getStatusIcon(application.status)} mr-1`}></i>
                  {application.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Land Area</p>
                  <p className="text-lg font-bold text-gray-900">{application.landArea}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">{application.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Updated</p>
                  <p className="text-sm text-gray-900">{application.lastUpdated}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-sm text-gray-600">{application.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="ri-calendar-line mr-1"></i>
                    Submitted: {application.submittedDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="ri-file-list-line mr-1"></i>
                    {application.documents.length} Documents
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewApplication(application)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer whitespace-nowrap"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleViewOnMap(application)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium cursor-pointer whitespace-nowrap"
                  >
                    View on Map
                  </button>
                  {application.certificateAvailable && (
                    <button
                      onClick={() => handleDownloadCertificate(application)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer whitespace-nowrap"
                    >
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Application Modal */}
      {showNewApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Create New FRA Application</h3>
                <button
                  onClick={() => setShowNewApplication(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Government Scheme</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {governmentSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme.name)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedScheme === scheme.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <h5 className="font-semibold text-gray-900 mb-2">{scheme.name}</h5>
                      <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Eligibility:</strong> {scheme.eligibility}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedScheme && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Form - {selectedScheme}</h4>

                  <form className="space-y-6" onSubmit={handleSubmitClaim}>
                    {/* Personal Details */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-3">Personal Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            name="fullName"
                            type="text"
                            defaultValue={user?.displayName || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                          <input
                            name="aadhaar"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                          <input
                            name="village"
                            type="text"
                            defaultValue={user?.village || 'Khunti Village'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                          <input
                            name="district"
                            type="text"
                            defaultValue={user?.district || 'Khunti'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Land Details */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-3">Land Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Land Area (in acres)</label>
                          <input
                            name="landArea"
                            type="number"
                            step="0.1"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GPS Coordinates</label>
                          <input
                            name="gpsCoordinates"
                            type="text"
                            placeholder="e.g., 23.3441° N, 85.2263° E"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Land Description</label>
                        <textarea
                          name="description"
                          rows={3}
                          placeholder="Describe the traditional use of this land..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-3">Required Documents</h5>
                      <div className="space-y-3">
                        {governmentSchemes.find(s => s.name === selectedScheme)?.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-sm font-medium">{doc}</span>
                            <button
                              type="button"
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                            >
                              Upload
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                      >
                        Preview Application
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMapView && activeApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Land Parcel Map View</h3>
                  <p className="text-sm text-gray-500">{activeApplication.title} - {activeApplication.applicationNumber}</p>
                </div>
                <button
                  onClick={() => setShowMapView(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                    <iframe
                      src={`https://maps.google.com/maps?q=${activeApplication.gpsCoordinates}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Land Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Area:</span>
                        <p className="font-medium">{activeApplication.landArea}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Location:</span>
                        <p className="font-medium">{activeApplication.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Coordinates:</span>
                        <p className="font-medium">{activeApplication.gpsCoordinates}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Application Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(activeApplication.status)}`}>
                      <i className={`${getStatusIcon(activeApplication.status)} mr-1`}></i>
                      {activeApplication.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                      <i className="ri-download-line mr-2"></i>
                      Download Map
                    </button>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                      <i className="ri-share-line mr-2"></i>
                      Share Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {showApplicationDetails && activeApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{activeApplication.title}</h3>
                  <p className="text-sm text-gray-500">Application #{activeApplication.applicationNumber}</p>
                </div>
                <button
                  onClick={() => setShowApplicationDetails(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Application Status</h4>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(activeApplication.status)}`}>
                    <i className={`${getStatusIcon(activeApplication.status)} mr-2`}></i>
                    {activeApplication.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Key Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Land Area:</span>
                      <span className="text-sm font-medium">{activeApplication.landArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Submitted:</span>
                      <span className="text-sm font-medium">{activeApplication.submittedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Updated:</span>
                      <span className="text-sm font-medium">{activeApplication.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Location Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <p className="text-sm font-medium">{activeApplication.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">GPS Coordinates:</span>
                      <p className="text-sm font-medium">{activeApplication.gpsCoordinates}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm text-gray-500">Description:</span>
                    <p className="text-sm font-medium mt-1">{activeApplication.description}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeApplication.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className="ri-file-text-line text-blue-600"></i>
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <button className="text-green-600 hover:text-green-800 cursor-pointer">
                        <i className="ri-download-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Application Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-check-line text-green-600"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Application Submitted</p>
                      <p className="text-xs text-gray-500">{activeApplication.submittedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-search-line text-blue-600"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Under Review by Forest Department</p>
                      <p className="text-xs text-gray-500">{activeApplication.submittedDate}</p>
                    </div>
                  </div>

                  {activeApplication.status === 'approved' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-award-line text-green-600"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Application Approved</p>
                        <p className="text-xs text-gray-500">{activeApplication.lastUpdated}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                {activeApplication.status === 'approved' && (
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                    <i className="ri-download-line mr-2"></i>
                    Download Certificate
                  </button>
                )}
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                  <i className="ri-map-pin-line mr-2"></i>
                  View on Map
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 cursor-pointer whitespace-nowrap">
                  <i className="ri-printer-line mr-2"></i>
                  Print Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
