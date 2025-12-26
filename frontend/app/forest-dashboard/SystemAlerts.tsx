'use client';

import { useState } from 'react';

export default function SystemAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  const alerts = [
    {
      id: 1,
      type: 'deadline_approaching',
      title: 'FRA Application Deadline Approaching',
      description: '15 applications are approaching their processing deadline within 7 days',
      priority: 'high',
      timestamp: '2024-01-21T10:30:00',
      status: 'active',
      affectedCount: 15,
      actionRequired: 'Review and prioritize applications for immediate processing',
      relatedApplications: ['FRA-2024-001', 'FRA-2024-003', 'FRA-2024-007']
    },
    {
      id: 2,
      type: 'document_verification',
      title: 'Document Verification Required',
      description: 'Multiple applications pending document verification for over 10 days',
      priority: 'medium',
      timestamp: '2024-01-21T09:15:00',
      status: 'active',
      affectedCount: 8,
      actionRequired: 'Schedule document verification meetings with applicants',
      relatedApplications: ['FRA-2024-012', 'FRA-2024-018', 'FRA-2024-021']
    },
    {
      id: 3,
      type: 'system_maintenance',
      title: 'Scheduled System Maintenance',
      description: 'Planned system maintenance scheduled for tonight at 11:00 PM',
      priority: 'low',
      timestamp: '2024-01-21T08:00:00',
      status: 'scheduled',
      affectedCount: 0,
      actionRequired: 'Inform users about system downtime',
      relatedApplications: []
    },
    {
      id: 4,
      type: 'suspicious_activity',
      title: 'Suspicious Login Activity Detected',
      description: 'Multiple failed login attempts detected from unusual locations',
      priority: 'high',
      timestamp: '2024-01-20T22:45:00',
      status: 'resolved',
      affectedCount: 3,
      actionRequired: 'Security protocols activated, user accounts secured',
      relatedApplications: []
    },
    {
      id: 5,
      type: 'data_backup',
      title: 'Data Backup Completed Successfully',
      description: 'Weekly data backup completed without errors',
      priority: 'low',
      timestamp: '2024-01-20T02:00:00',
      status: 'completed',
      affectedCount: 0,
      actionRequired: 'No action required',
      relatedApplications: []
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filterPriority === 'all') return true;
    return alert.priority === filterPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline_approaching': return 'ri-alarm-warning-line';
      case 'document_verification': return 'ri-file-search-line';
      case 'system_maintenance': return 'ri-tools-line';
      case 'suspicious_activity': return 'ri-shield-cross-line';
      case 'data_backup': return 'ri-database-line';
      default: return 'ri-information-line';
    }
  };

  const handleViewAlert = (alert: any) => {
    setSelectedAlert(alert);
    setShowAlertDetails(true);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-alarm-warning-line text-2xl text-red-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.priority === 'high').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.priority === 'medium').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.status === 'resolved').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-notification-line text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 pr-8"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className={`${getAlertIcon(alert.type)} text-xl text-gray-600`}></i>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(alert.priority)}`}>
                          {alert.priority} priority
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        {alert.affectedCount > 0 && (
                          <span className="text-xs text-gray-500">
                            Affects {alert.affectedCount} items
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewAlert(alert)}
                        className="text-green-600 hover:text-green-900 text-sm font-medium cursor-pointer whitespace-nowrap"
                      >
                        View Details
                      </button>
                      {alert.status === 'active' && (
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer whitespace-nowrap">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Details Modal */}
      {showAlertDetails && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Alert Details</h3>
                <button
                  onClick={() => setShowAlertDetails(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Alert Header */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className={`${getAlertIcon(selectedAlert.type)} text-2xl text-gray-600`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedAlert.title}</h4>
                  <p className="text-gray-600 mt-1">{selectedAlert.description}</p>
                  <div className="flex items-center space-x-3 mt-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedAlert.priority)}`}>
                      {selectedAlert.priority} priority
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-900">Timestamp</label>
                  <p className="text-sm text-gray-600 mt-1">{formatTimestamp(selectedAlert.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Affected Items</label>
                  <p className="text-sm text-gray-600 mt-1">{selectedAlert.affectedCount || 'None'}</p>
                </div>
              </div>

              {/* Action Required */}
              <div>
                <label className="text-sm font-medium text-gray-900">Action Required</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedAlert.actionRequired}</p>
                </div>
              </div>

              {/* Related Applications */}
              {selectedAlert.relatedApplications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-900">Related Applications</label>
                  <div className="mt-2 space-y-2">
                    {selectedAlert.relatedApplications.map((appId: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{appId}</span>
                        <button className="text-green-600 hover:text-green-800 text-sm cursor-pointer">
                          View Application
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                {selectedAlert.status === 'active' && (
                  <>
                    <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap">
                      Mark as Resolved
                    </button>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                      Take Action
                    </button>
                  </>
                )}
                <button className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer whitespace-nowrap">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}