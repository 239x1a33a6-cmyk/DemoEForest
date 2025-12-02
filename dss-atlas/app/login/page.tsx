
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('tribal');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process and redirect based on user type
    setTimeout(() => {
      setIsLoading(false);
      
      // Redirect based on user type
      switch (userType) {
        case 'forest-officer':
          router.push('/forest-dashboard');
          break;
        case 'tribal':
          router.push('/tribal-dashboard');
          break;
        case 'ngo':
          router.push('/ngo-dashboard');
          break;
        default:
          router.push('/dashboard');
          break;
      }
    }, 1500);
  };

  const getUserTypeConfig = () => {
    switch (userType) {
      case 'forest-officer':
        return {
          title: 'Forest Officer Portal',
          subtitle: 'Access administrative dashboard and community records',
          icon: 'ri-shield-user-line',
          color: 'green'
        };
      case 'tribal':
        return {
          title: 'Community Member Portal',
          subtitle: 'Access your forest rights and community resources',
          icon: 'ri-community-line',
          color: 'blue'
        };
      case 'ngo':
        return {
          title: 'NGO Representative Portal',
          subtitle: 'Support community development and advocacy',
          icon: 'ri-hand-heart-line',
          color: 'purple'
        };
      default:
        return {
          title: 'General User Portal',
          subtitle: 'Access forest information and resources',
          icon: 'ri-user-line',
          color: 'gray'
        };
    }
  };

  const config = getUserTypeConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* User Type Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Login Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('tribal')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                  userType === 'tribal' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-community-line text-xl"></i>
                  <span>Tribal Community</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('forest-officer')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                  userType === 'forest-officer' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-shield-user-line text-xl"></i>
                  <span>Forest Officer</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('ngo')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                  userType === 'ngo' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-hand-heart-line text-xl"></i>
                  <span>NGO Rep.</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('other')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                  userType === 'other' 
                    ? 'border-gray-500 bg-gray-50 text-gray-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-user-line text-xl"></i>
                  <span>Other</span>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            {/* Test Credentials Section */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                <i className="ri-information-line mr-2"></i>
                Demo Credentials
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs text-yellow-700">
                {userType === 'tribal' && (
                  <>
                    <div><strong>Tribal Community:</strong></div>
                    <div>Email: tribal@demo.com | Password: tribal123</div>
                    <div>Email: ramesh.tribal@demo.com | Password: demo123</div>
                  </>
                )}
                {userType === 'forest-officer' && (
                  <>
                    <div><strong>Forest Officer:</strong></div>
                    <div>Email: officer@forest.gov.in | Password: officer123</div>
                    <div>ID: FO12345 | Password: forest2024</div>
                  </>
                )}
                {userType === 'ngo' && (
                  <>
                    <div><strong>NGO Representative:</strong></div>
                    <div>Email: ngo@advocacy.org | Password: ngo123</div>
                    <div>Email: coordinator@tribal.ngo | Password: support2024</div>
                  </>
                )}
                {userType === 'other' && (
                  <>
                    <div><strong>Other User:</strong></div>
                    <div>Email: researcher@university.edu | Password: research123</div>
                    <div>Email: consultant@demo.com | Password: other2024</div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className={`mx-auto h-12 w-12 flex items-center justify-center bg-${config.color}-100 rounded-full`}>
                <i className={`${config.icon} text-2xl text-${config.color}-600`}></i>
              </div>
              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                {config.title}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {config.subtitle}
              </p>
              <p className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                  Register here
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address / Employee ID
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500"
                      placeholder={userType === 'forest-officer' ? 'Enter your employee ID or email' : 'Enter your email'}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <i className="ri-mail-line text-gray-400"></i>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 pr-10"
                      placeholder="Enter your password"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <i className={`${config.icon} mr-2`}></i>
                      Sign in as {userType === 'forest-officer' ? 'Forest Officer' : userType === 'tribal' ? 'Community Member' : userType === 'ngo' ? 'NGO Representative' : 'User'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}