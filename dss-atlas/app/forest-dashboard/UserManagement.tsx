
'use client';

import { useState } from 'react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Ravi Oraon',
      email: 'ravi.oraon@community.fra',
      phone: '+91 9876543210',
      village: 'Khunti Village',
      district: 'Khunti',
      tribalCommunity: 'Ho',
      status: 'active',
      registrationDate: '2024-01-15',
      lastLogin: '2024-01-23',
      applications: 3,
      documentsUploaded: 8,
      verificationsCompleted: 2
    },
    {
      id: 2,
      name: 'Sita Munda',
      email: 'sita.munda@community.fra',
      phone: '+91 9876543211',
      village: 'Latehar Village',
      district: 'Latehar',
      tribalCommunity: 'Munda',
      status: 'active',
      registrationDate: '2024-01-12',
      lastLogin: '2024-01-22',
      applications: 2,
      documentsUploaded: 6,
      verificationsCompleted: 2
    },
    {
      id: 3,
      name: 'Ram Singh',
      email: 'ram.singh@community.fra',
      phone: '+91 9876543212',
      village: 'Gumla Village',
      district: 'Gumla',
      tribalCommunity: 'Oraon',
      status: 'pending',
      registrationDate: '2024-01-20',
      lastLogin: '2024-01-21',
      applications: 1,
      documentsUploaded: 3,
      verificationsCompleted: 0
    },
    {
      id: 4,
      name: 'Maya Kharia',
      email: 'maya.kharia@community.fra',
      phone: '+91 9876543213',
      village: 'Simdega Village',
      district: 'Simdega',
      tribalCommunity: 'Kharia',
      status: 'suspended',
      registrationDate: '2024-01-08',
      lastLogin: '2024-01-15',
      applications: 1,
      documentsUploaded: 2,
      verificationsCompleted: 0
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleApproveUser = (userId: number) => {
    if (confirm('Are you sure you want to approve this user?')) {
      console.log('Approving user:', userId);
      // Handle user approval logic
    }
  };

  const handleSuspendUser = (userId: number) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      console.log('Suspending user:', userId);
      // Handle user suspension logic
    }
  };

  const handleSendMessage = (user: any) => {
    setSelectedUser(user);
    setShowMessageModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 pr-8"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by name, email, village, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-check-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-unfollow-line text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-forbid-line text-2xl text-red-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'suspended').length}</p>
              <p className="text-sm text-gray-600">Suspended</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-group-line text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.tribalCommunity} Tribe</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.village}</div>
                    <div className="text-sm text-gray-500">{user.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.applications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer whitespace-nowrap"
                      >
                        View Details
                      </button>
                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="text-green-600 hover:text-green-900 cursor-pointer whitespace-nowrap"
                        >
                          Approve
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer whitespace-nowrap"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleSendMessage(user)}
                        className="text-purple-600 hover:text-purple-900 cursor-pointer whitespace-nowrap"
                      >
                        Message
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Tribal Community</label>
                      <p className="font-medium">{selectedUser.tribalCommunity}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Registration Date</label>
                      <p className="font-medium">{selectedUser.registrationDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Login</label>
                      <p className="font-medium">{selectedUser.lastLogin}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Location</label>
                      <p className="font-medium">{selectedUser.village}, {selectedUser.district}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-file-list-3-line text-2xl text-blue-600 mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-blue-900">{selectedUser.applications}</p>
                        <p className="text-sm text-blue-700">Applications</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-upload-line text-2xl text-green-600 mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-green-900">{selectedUser.documentsUploaded}</p>
                        <p className="text-sm text-green-700">Documents</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-check-line text-2xl text-purple-600 mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-purple-900">{selectedUser.verificationsCompleted}</p>
                        <p className="text-sm text-purple-700">Verified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                  <i className="ri-upload-line mr-2"></i>
                  Upload Documents
                </button>
                {selectedUser.status === 'pending' && (
                  <button 
                    onClick={() => handleApproveUser(selectedUser.id)}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Approve User
                  </button>
                )}
                {selectedUser.status === 'active' && (
                  <button 
                    onClick={() => handleSuspendUser(selectedUser.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-user-forbid-line mr-2"></i>
                    Suspend User
                  </button>
                )}
                <button 
                  onClick={() => handleSendMessage(selectedUser)}
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-message-line mr-2"></i>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Send Message to {selectedUser.name}</h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter message subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Type your message here..."
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap"
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
