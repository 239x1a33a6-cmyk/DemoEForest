
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                We encountered an error while processing your request. Please try refreshing or check back later.
            </p>
            <div className="space-x-4">
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Try again
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
