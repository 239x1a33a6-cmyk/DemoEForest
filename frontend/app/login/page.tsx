'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { getAuthClient, getFirestoreClient } from '@/lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('tribal'); // For UI selection
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuthClient();
      if (!auth) throw new Error("Auth not initialized");

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Fetch user profile to get role
      const db = getFirestoreClient();
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'TRIBAL';

        // Redirect based on ROLE
        switch (role) {
          case 'TRIBAL':
            router.push('/tribal-dashboard');
            break;
          case 'FRC_MEMBER':
            router.push('/frc-portal');
            break;
          case 'SDLC_MEMBER':
            router.push('/sdlc-portal');
            break;
          case 'DLC_MEMBER':
            router.push('/dlc-portal');
            break;
          case 'SLMC_MEMBER':
            router.push('/dashboard'); // Main Admin Dashboard
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        // No profile found? Default to tribal or error
        router.push('/tribal-dashboard');
      }

    } catch (error: any) {
      console.error("Login error", error);
      alert("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'tribal': // UI State key
        return {
          title: 'Tribal / Beneficiary Login',
          icon: 'ri-community-line',
          color: 'blue'
        };
      case 'frc':
        return {
          title: 'FRC Member Login',
          icon: 'ri-group-line',
          color: 'green'
        };
      case 'sdlc':
        return {
          title: 'SDLC Official Login',
          icon: 'ri-government-line',
          color: 'orange'
        };
      case 'dlc':
        return {
          title: 'DLC Official Login',
          icon: 'ri-building-4-line',
          color: 'purple'
        };
      default:
        return {
          title: 'User Login',
          icon: 'ri-user-line',
          color: 'gray'
        };
    }
  };

  const config = getRoleConfig(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* User Type Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Login Portal</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('tribal')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${activeTab === 'tribal'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-community-line text-xl"></i>
                  <span>Tribal / User</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('frc')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${activeTab === 'frc'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-group-line text-xl"></i>
                  <span>FRC Member</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sdlc')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${activeTab === 'sdlc'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-government-line text-xl"></i>
                  <span>SDLC Member</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dlc')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${activeTab === 'dlc'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <i className="ri-building-4-line text-xl"></i>
                  <span>DLC Member</span>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            {/* Removed Mock Credentials for clean production-like feel */}

            <div>
              <div className={`mx-auto h-12 w-12 flex items-center justify-center bg-${config.color}-100 rounded-full`}>
                <i className={`${config.icon} text-2xl text-${config.color}-600`}></i>
              </div>
              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                {config.title}
              </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address / Member ID
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
                      placeholder="Enter your email"
                    />
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

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none cursor-pointer"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}