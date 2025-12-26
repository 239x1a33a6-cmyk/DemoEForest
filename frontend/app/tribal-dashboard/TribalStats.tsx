
'use client';

import { useState } from 'react';

export default function TribalStats() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Village Development Committee Meeting',
      date: '2024-02-15',
      time: '10:00 AM',
      location: 'Community Hall, Khunti Village',
      agenda: 'Discussion on new forest conservation initiatives'
    },
    {
      id: 2,
      title: 'FRA Rights Awareness Session',
      date: '2024-02-20',
      time: '2:00 PM',
      location: 'Village School Ground',
      agenda: 'Understanding forest rights and application process'
    }
  ];

  const faqData = [
    {
      question: 'How do I apply for Forest Rights under FRA?',
      answer: 'You can apply through the FRA Applications section in your dashboard. Fill out the required forms, upload necessary documents, and submit for review.'
    },
    {
      question: 'What documents are required for FRA application?',
      answer: 'Required documents include Aadhaar Card, Tribal Certificate, Land Survey Map, Community Letter, and proof of traditional use of forest land.'
    },
    {
      question: 'How long does the verification process take?',
      answer: 'The verification process typically takes 30-60 days depending on the complexity of the application and field verification requirements.'
    },
    {
      question: 'Can I track my application status?',
      answer: 'Yes, you can track your application status in the FRA Applications section. You will receive updates at each stage of the process.'
    },
    {
      question: 'What should I do if my application is rejected?',
      answer: 'If rejected, you can review the reasons provided, address the issues, and resubmit your application with additional documentation if needed.'
    },
    {
      question: 'How do I renew my forest rights certificate?',
      answer: 'Forest rights certificates do not require renewal. However, you may need to update your documents if there are changes in land use or family details.'
    },
    {
      question: 'Who can I contact for help with my application?',
      answer: 'You can contact the Forest Department helpline at 1800-XXX-XXXX or email support@fra.gov.in for assistance with your application.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Important Updates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Important Updates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Forest Rights Granted */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-award-line text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">New Forest Rights Granted</h3>
                  <p className="text-sm text-green-700 mt-1">3 new individual forest rights approved in your area</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                <i className="ri-information-line mr-2"></i>
                Learn More
              </button>
            </div>
          </div>

          {/* Upcoming Community Meetings */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="ri-calendar-event-line text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Upcoming Community Meetings</h3>
                  <p className="text-sm text-blue-700 mt-1">{upcomingMeetings.length} meetings scheduled this month</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => setShowCalendar(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-calendar-line mr-2"></i>
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Support */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-customer-service-line text-xl text-purple-600"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Official Government Helpline</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <i className="ri-phone-line text-green-600"></i>
                    <span className="text-sm font-medium">1800-345-3570</span>
                    <span className="text-xs text-gray-500">(Toll Free)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-phone-line text-green-600"></i>
                    <span className="text-sm font-medium">011-2436-0749</span>
                    <span className="text-xs text-gray-500">(Direct Line)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-mail-line text-blue-600"></i>
                    <span className="text-sm font-medium">support@fra.gov.in</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">State Forest Department</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <i className="ri-phone-line text-green-600"></i>
                    <span className="text-sm font-medium">0651-2401-234</span>
                    <span className="text-xs text-gray-500">(Jharkhand)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-mail-line text-blue-600"></i>
                    <span className="text-sm font-medium">forest.jharkhand@gov.in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-question-answer-line text-xl text-orange-600"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get quick answers to common questions about FRA applications and processes.</p>
            
            <button 
              onClick={() => setShowFAQ(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-book-open-line mr-2"></i>
              View FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Community Meeting Calendar</h3>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                  <i className="ri-add-line mr-2"></i>
                  Add Event
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{meeting.title}</h4>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-calendar-line mr-2"></i>
                            {meeting.date} at {meeting.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-map-pin-line mr-2"></i>
                            {meeting.location}
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <i className="ri-file-text-line mr-2 mt-0.5"></i>
                            <span>{meeting.agenda}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-800 cursor-pointer whitespace-nowrap">
                          <i className="ri-notification-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h4>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Approved Applications</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-map-2-line text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">4.3</p>
              <p className="text-sm text-gray-600">Total Acres</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-community-line text-2xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Community Members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
