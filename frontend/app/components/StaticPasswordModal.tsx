// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

import React, { useState } from 'react';

interface StaticPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function StaticPasswordModal({ isOpen, onClose, onSuccess }: StaticPasswordModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/static/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem('static_mode_active', 'true');
                onSuccess();
                setPassword('');
            } else {
                setError(data.error || 'Invalid password');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                    🔐 Static Dataset Access
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter password to access the Static CFR Dataset Module
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                        disabled={loading}
                    />

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                setPassword('');
                                setError('');
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            disabled={loading || !password}
                        >
                            {loading ? 'Verifying...' : 'Access'}
                        </button>
                    </div>
                </form>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    Press Escape to close
                </p>
            </div>
        </div>
    );
}
