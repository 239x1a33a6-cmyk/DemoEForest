// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

import React, { useState, useEffect } from 'react';

interface AdminPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (token: string) => void;
}

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }: AdminPasswordModalProps) {
    const [passwordSet, setPasswordSet] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            checkPasswordStatus();
        }
    }, [isOpen]);

    const checkPasswordStatus = async () => {
        try {
            const res = await fetch('/api/admin/status');
            const data = await res.json();
            setPasswordSet(data.passwordSet);
        } catch (err) {
            setError('Failed to check admin status');
        }
    };

    const handleSetPassword = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, confirm_password: confirmPassword })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to set password');
                setLoading(false);
                return;
            }

            // Auto-login after setting password
            await handleVerifyPassword();
        } catch (err) {
            setError('Failed to set password');
            setLoading(false);
        }
    };

    const handleVerifyPassword = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setError(`Too many attempts. Please wait ${data.retryAfter} seconds.`);
                } else {
                    setError(data.error || 'Invalid password');
                }
                setLoading(false);
                return;
            }

            // Success - pass token to parent
            onSuccess(data.token);
            setPassword('');
            setConfirmPassword('');
            setError('');
        } catch (err) {
            setError('Failed to verify password');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordSet) {
            handleVerifyPassword();
        } else {
            handleSetPassword();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {passwordSet === null ? 'Loading...' : passwordSet ? 'Admin Login' : 'Set Admin Password'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {passwordSet === null ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            {!passwordSet && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                            )}

                            {!passwordSet && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                                    <p className="font-medium mb-1">Password Requirements:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>At least 8 characters</li>
                                        <li>One uppercase letter</li>
                                        <li>One lowercase letter</li>
                                        <li>One number</li>
                                        <li>One special character</li>
                                    </ul>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white rounded-md py-2 font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : passwordSet ? 'Login' : 'Set Password'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>🔒 Secured with bcrypt encryption</p>
                </div>
            </div>
        </div>
    );
}
