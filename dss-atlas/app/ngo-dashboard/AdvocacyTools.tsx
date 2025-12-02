
'use client';

import { useState } from 'react';

export default function AdvocacyTools() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  const campaigns = [
    {
      id: 1,
      title: 'Forest Rights Awareness Week',
      description: 'State-wide campaign to educate tribal communities about FRA rights and procedures',
      status: 'Active',
      reach: 2500,
      engagement: 85,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      platforms: ['Community Meetings', 'Radio', 'Pamphlets'],
      metrics: {
        meetings: 18,
        participants: 450,
        applications: 32,
        media_coverage: 5
      }
    },
    {
      id: 2,
      title: 'Legal Aid Helpline Promotion',
      description: 'Promoting free legal consultation services for forest land disputes',
      status: 'Planning',
      reach: 0,
      engagement: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      platforms: ['Social Media', 'Community Centers', 'Local Press'],
      metrics: {
        meetings: 0,
        participants: 0,
        applications: 0,
        media_coverage: 0
      }
    }
  ];

  const resources = [
    {
      id: 1,
      title: 'FRA Guidelines in Hindi',
      type: 'Document',
      downloads: 245,
      format: 'PDF',
      size: '2.5 MB',
      lastUpdated: '2024-01-10'
    },
    {
      id: 2,
      title: 'Community Rights Video Series',
      type: 'Video',
      downloads: 180,
      format: 'MP4',
      size: '450 MB',
      lastUpdated: '2024-01-05'
    },
    {
      id: 3,
      title: 'Application Form Templates',
      type: 'Forms',
      downloads: 320,
      format: 'PDF',
      size: '1.2 MB',
      lastUpdated: '2024-01-08'
    },
    {
      id: 4,
      title: 'Legal Rights Infographics',
      type: 'Visual',
      downloads: 156,
      format: 'PNG',
      size: '5.8 MB',
      lastUpdated: '2024-01-12'
    }
  ];

  const advocacy_issues = [
    {
      id: 1,
      title: 'Delayed FRA Committee Approvals',
      priority: 'High',
      communities_affected: 12,
      status: 'Ongoing',
      actions: [
        'Filed RTI applications for committee meeting records',
        'Organized community representation meeting',
        'Submitted formal complaint to District Collector'
      ],
      next_steps: 'Schedule meeting with Forest Department officials'
    },
    {
      id: 2,
      title: 'Inadequate Survey Documentation',
      priority: 'Medium',
      communities_affected: 8,
      status: 'Resolved',
      actions: [
        'Conducted parallel community surveys',
        'Submitted additional evidence to authorities',
        'Facilitated joint verification process'
      ],
      next_steps: 'Monitor implementation of new guidelines'
    },
    {
      id: 3,
      title: 'Mining Company Land Encroachment',
      priority: 'Critical',
      communities_affected: 5,
      status: 'Legal Action',
      actions: [
        'Filed public interest litigation',
        'Organized peaceful protests',
        'Engaged environmental lawyers'
      ],
      next_steps: 'Await court hearing scheduled for Feb 15'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Legal Action': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Advocacy Tools</h3>
          <div className="flex items-center space-x-3">
            <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </button>
            <button 
              onClick={() => setShowNewCampaign(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>
              New Campaign
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'campaigns', name: 'Campaigns', icon: 'ri-megaphone-line' },
            { id: 'resources', name: 'Resources', icon: 'ri-folder-line' },
            { id: 'issues', name: 'Advocacy Issues', icon: 'ri-alert-line' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Campaigns</p>
                <p className="text-2xl font-bold text-purple-900">3</p>
              </div>
              <i className="ri-megaphone-line text-purple-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Reach</p>
                <p className="text-2xl font-bold text-blue-900">2.5K</p>
              </div>
              <i className="ri-group-line text-blue-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Resources</p>
                <p className="text-2xl font-bold text-green-900">25</p>
              </div>
              <i className="ri-folder-line text-green-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Active Issues</p>
                <p className="text-2xl font-bold text-orange-900">2</p>
              </div>
              <i className="ri-alert-line text-orange-600 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span><i className="ri-calendar-line mr-1"></i>{campaign.startDate} - {campaign.endDate}</span>
                      <span><i className="ri-group-line mr-1"></i>{campaign.reach} people reached</span>
                      <span><i className="ri-heart-line mr-1"></i>{campaign.engagement}% engagement</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="ri-more-2-line"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.platforms.map((platform, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Meetings</p>
                        <p className="text-xl font-bold text-gray-900">{campaign.metrics.meetings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Participants</p>
                        <p className="text-xl font-bold text-gray-900">{campaign.metrics.participants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Applications</p>
                        <p className="text-xl font-bold text-gray-900">{campaign.metrics.applications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Media Coverage</p>
                        <p className="text-xl font-bold text-gray-900">{campaign.metrics.media_coverage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Resource Library</h3>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap">
                <i className="ri-upload-line mr-2"></i>
                Upload Resource
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600">{resource.type}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="ri-download-line"></i>
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span className="font-medium">{resource.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">{resource.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{resource.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-medium">{resource.lastUpdated}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 whitespace-nowrap">
                    <i className="ri-download-line mr-2"></i>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-6">
          {advocacy_issues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getPriorityColor(issue.priority)}`}>
                        {issue.priority} Priority
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      <i className="ri-community-line mr-1"></i>
                      {issue.communities_affected} communities affected
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="ri-more-2-line"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Actions Taken</h4>
                    <ul className="space-y-2">
                      {issue.actions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <i className="ri-checkbox-circle-fill text-green-500 mt-0.5"></i>
                          <span className="text-sm text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      <i className="ri-arrow-right-line mr-2 text-blue-600"></i>
                      {issue.next_steps}
                    </p>
                    <button className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium whitespace-nowrap">
                      <i className="ri-edit-line mr-1"></i>
                      Update Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Campaign</h3>
              <button 
                onClick={() => setShowNewCampaign(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows="3"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowNewCampaign(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowNewCampaign(false)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
