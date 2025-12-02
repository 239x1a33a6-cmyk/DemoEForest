
'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '../../components/Header';

// Location data structure
const locationData = {
  "Jharkhand": {
    "Ranchi": ["Ranchi City", "Bundu", "Tamar", "Sonahatu", "Angara"],
    "Khunti": ["Khunti Village", "Murhu", "Torpa", "Rania", "Karra"],
    "Latehar": ["Latehar Village", "Manika", "Chandwa", "Balumath", "Herhanj"],
    "Gumla": ["Gumla Town", "Sisai", "Palkot", "Raidih", "Bharno"],
    "Simdega": ["Simdega Town", "Kolebira", "Thethaitanagar", "Jaldega", "Bolba"]
  },
  "Odisha": {
    "Mayurbhanj": ["Baripada", "Rairangpur", "Karanjia", "Udala", "Jashipur"],
    "Keonjhar": ["Keonjhar Town", "Champua", "Barbil", "Ghatagaon", "Anandapur"],
    "Sundargarh": ["Rourkela", "Sundargarh Town", "Rajgangpur", "Panposh", "Biramitrapur"],
    "Kandhamal": ["Phulbani", "Baliguda", "Tumudibandh", "Kotagarh", "Chakapada"]
  },
  "Chhattisgarh": {
    "Bastar": ["Jagdalpur", "Bakawand", "Tokapal", "Bastar Town", "Kondagaon"],
    "Dantewada": ["Dantewada Town", "Katekalyan", "Kuakonda", "Barsoor", "Geedam"],
    "Kanker": ["Kanker Town", "Narharpur", "Antagarh", "Bhanupratappur", "Koylibeda"],
    "Sukma": ["Sukma Town", "Konta", "Chintagufa", "Dornapal", "Gadiras"]
  }
};

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organization: '',
    employeeId: '',
    designation: '',
    state: '',
    district: '',
    village: '',
    tribalCommunity: '',
    traditionalOccupation: '',
    landHolding: '',
    ngoRegistrationNumber: '',
    workingSince: '',
    focusAreas: '',
    qualification: '',
    specialization: '',
    experience: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCurrentStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset dependent dropdowns
      if (name === 'state') {
        newData.district = '';
        newData.village = '';
      } else if (name === 'district') {
        newData.village = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to login after signup
      window.location.href = '/login';
    }, 2000);
  };

  const getRoleConfig = () => {
    switch (selectedRole) {
      case 'tribal':
        return {
          title: 'Tribal Community Registration',
          subtitle: 'Register to access your forest rights and community resources',
          icon: 'ri-community-line',
          color: 'blue',
          bgGradient: 'from-blue-500 to-blue-600'
        };
      case 'forest-officer':
        return {
          title: 'Forest Officer Registration',
          subtitle: 'Register for administrative access and community oversight',
          icon: 'ri-shield-user-line',
          color: 'green',
          bgGradient: 'from-green-500 to-green-600'
        };
      case 'ngo':
        return {
          title: 'NGO Representative Registration',
          subtitle: 'Register to support community development and advocacy',
          icon: 'ri-hand-heart-line',
          color: 'purple',
          bgGradient: 'from-purple-500 to-purple-600'
        };
      default:
        return {
          title: 'General User Registration',
          subtitle: 'Register to access forest information and resources',
          icon: 'ri-user-line',
          color: 'gray',
          bgGradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const config = getRoleConfig();
  const availableDistricts = formData.state ? Object.keys(locationData[formData.state] || {}) : [];
  const availableVillages = (formData.state && formData.district) ? locationData[formData.state]?.[formData.district] || [] : [];

  if (currentStep === 'role-selection') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center bg-green-100 rounded-full">
                <i className="ri-user-add-line text-3xl text-green-600"></i>
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Choose Your Registration Type
              </h2>
              <p className="mt-2 text-gray-600">
                Select the option that best describes your role
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tribal Community */}
              <div 
                onClick={() => handleRoleSelect('tribal')}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <i className="ri-community-line text-3xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tribal Community</h3>
                  <p className="text-gray-600 text-sm mb-4">For tribal community members seeking forest rights recognition</p>
                  <ul className="text-xs text-gray-500 text-left space-y-1">
                    <li>• Access FRA applications</li>
                    <li>• Track land claims</li>
                    <li>• Community resources</li>
                    <li>• Traditional rights documentation</li>
                  </ul>
                </div>
              </div>

              {/* Forest Officer */}
              <div 
                onClick={() => handleRoleSelect('forest-officer')}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <i className="ri-shield-user-line text-3xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Forest Officer</h3>
                  <p className="text-gray-600 text-sm mb-4">For government forest department officials</p>
                  <ul className="text-xs text-gray-500 text-left space-y-1">
                    <li>• Full administrative access</li>
                    <li>• User management</li>
                    <li>• Application processing</li>
                    <li>• Compliance monitoring</li>
                  </ul>
                </div>
              </div>

              {/* NGO Representative */}
              <div 
                onClick={() => handleRoleSelect('ngo')}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <i className="ri-hand-heart-line text-3xl text-purple-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">NGO Representative</h3>
                  <p className="text-gray-600 text-sm mb-4">For NGO workers supporting communities</p>
                  <ul className="text-xs text-gray-500 text-left space-y-1">
                    <li>• Community insights</li>
                    <li>• Advocacy tools</li>
                    <li>• Progress tracking</li>
                    <li>• Resource coordination</li>
                  </ul>
                </div>
              </div>

              {/* Other Users */}
              <div 
                onClick={() => handleRoleSelect('other')}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-gray-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    <i className="ri-user-line text-3xl text-gray-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Other Users</h3>
                  <p className="text-gray-600 text-sm mb-4">For researchers, academics, and other stakeholders</p>
                  <ul className="text-xs text-gray-500 text-left space-y-1">
                    <li>• Research access</li>
                    <li>• Data insights</li>
                    <li>• Educational resources</li>
                    <li>• Limited data access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header with role-specific styling */}
          <div className={`bg-gradient-to-r ${config.bgGradient} rounded-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentStep('role-selection')}
                    className="text-white/80 hover:text-white cursor-pointer"
                  >
                    <i className="ri-arrow-left-line text-xl"></i>
                  </button>
                  <div className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center`}>
                    <i className={`${config.icon} text-2xl`}></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{config.title}</h2>
                    <p className="text-white/90 text-sm mt-1">{config.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8"
                    >
                      <option value="">Select State</option>
                      {Object.keys(locationData).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      District *
                    </label>
                    <select
                      id="district"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.state}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8 disabled:bg-gray-100"
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                      Village/Town *
                    </label>
                    <select
                      id="village"
                      name="village"
                      required
                      value={formData.village}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8 disabled:bg-gray-100"
                    >
                      <option value="">Select Village/Town</option>
                      {availableVillages.map((village) => (
                        <option key={village} value={village}>{village}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              {selectedRole === 'tribal' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="tribalCommunity" className="block text-sm font-medium text-gray-700">
                        Tribal Community
                      </label>
                      <select
                        id="tribalCommunity"
                        name="tribalCommunity"
                        value={formData.tribalCommunity}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8"
                      >
                        <option value="">Select Community</option>
                        <option value="Ho">Ho</option>
                        <option value="Santhal">Santhal</option>
                        <option value="Munda">Munda</option>
                        <option value="Oraon">Oraon</option>
                        <option value="Kharia">Kharia</option>
                        <option value="Bhumij">Bhumij</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="traditionalOccupation" className="block text-sm font-medium text-gray-700">
                        Traditional Occupation
                      </label>
                      <input
                        id="traditionalOccupation"
                        name="traditionalOccupation"
                        type="text"
                        value={formData.traditionalOccupation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="e.g., Agriculture, Forest produce collection"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="landHolding" className="block text-sm font-medium text-gray-700">
                        Land Holding Details
                      </label>
                      <textarea
                        id="landHolding"
                        name="landHolding"
                        rows={3}
                        value={formData.landHolding}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Describe your land holdings and traditional use..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'forest-officer' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                        Employee ID *
                      </label>
                      <input
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        required
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Enter your employee ID"
                      />
                    </div>
                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        Designation *
                      </label>
                      <select
                        id="designation"
                        name="designation"
                        required
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8"
                      >
                        <option value="">Select Designation</option>
                        <option value="Forest Officer">Forest Officer</option>
                        <option value="Assistant Forest Officer">Assistant Forest Officer</option>
                        <option value="Range Officer">Range Officer</option>
                        <option value="Forest Guard">Forest Guard</option>
                        <option value="Divisional Forest Officer">Divisional Forest Officer</option>
                        <option value="Deputy Conservator">Deputy Conservator</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                        Department/Organization *
                      </label>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        required
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="e.g., Jharkhand Forest Department"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'ngo' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">NGO Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                        NGO Name *
                      </label>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        required
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Enter NGO name"
                      />
                    </div>
                    <div>
                      <label htmlFor="ngoRegistrationNumber" className="block text-sm font-medium text-gray-700">
                        Registration Number
                      </label>
                      <input
                        id="ngoRegistrationNumber"
                        name="ngoRegistrationNumber"
                        type="text"
                        value={formData.ngoRegistrationNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="NGO registration number"
                      />
                    </div>
                    <div>
                      <label htmlFor="workingSince" className="block text-sm font-medium text-gray-700">
                        Working Since
                      </label>
                      <input
                        id="workingSince"
                        name="workingSince"
                        type="number"
                        value={formData.workingSince}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Year started working"
                      />
                    </div>
                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        Your Role *
                      </label>
                      <select
                        id="designation"
                        name="designation"
                        required
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8"
                      >
                        <option value="">Select Role</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Field Coordinator">Field Coordinator</option>
                        <option value="Community Organizer">Community Organizer</option>
                        <option value="Legal Advisor">Legal Advisor</option>
                        <option value="Director">Director</option>
                        <option value="Program Officer">Program Officer</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="focusAreas" className="block text-sm font-medium text-gray-700">
                        Focus Areas
                      </label>
                      <textarea
                        id="focusAreas"
                        name="focusAreas"
                        rows={2}
                        value={formData.focusAreas}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="e.g., Tribal rights, Forest conservation, Community development..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'other' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                        Organization/Institution
                      </label>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Your organization"
                      />
                    </div>
                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        Designation/Role
                      </label>
                      <input
                        id="designation"
                        name="designation"
                        type="text"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Your role/designation"
                      />
                    </div>
                    <div>
                      <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                        Qualification
                      </label>
                      <input
                        id="qualification"
                        name="qualification"
                        type="text"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Your highest qualification"
                      />
                    </div>
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                        Area of Interest
                      </label>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 pr-8"
                      >
                        <option value="">Select Area</option>
                        <option value="Research">Research</option>
                        <option value="Academic Study">Academic Study</option>
                        <option value="Policy Analysis">Policy Analysis</option>
                        <option value="Environmental Studies">Environmental Studies</option>
                        <option value="Social Work">Social Work</option>
                        <option value="Journalism">Journalism</option>
                        <option value="Legal Studies">Legal Studies</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 pr-10"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 hover:text-gray-600`}></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 hover:text-gray-600`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer mt-1"
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-green-600 hover:text-green-500">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-green-600 hover:text-green-500">
                    Privacy Policy
                  </Link>. I understand that my information will be used for FRA Atlas access and may be verified by forest department officials.
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r ${config.bgGradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <i className={`${config.icon} mr-2`}></i>
                      Create {selectedRole === 'tribal' ? 'Community' : selectedRole === 'forest-officer' ? 'Officer' : selectedRole === 'ngo' ? 'NGO' : 'User'} Account
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
