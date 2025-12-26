// Multilingual Global Support imported from DashboardModule
'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const languages = [
    { code: 'en', name: 'English', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        console.log('Language change requested:', langCode);
        i18n.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        setIsOpen(false);
        console.log('Language changed to:', langCode);
        // Force page reload to ensure all components update
        window.location.reload();
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                aria-label="Select language"
            >
                <span className="text-xl">{currentLanguage.flag}</span>
                <span className="font-medium text-gray-700 text-sm">{currentLanguage.code.toUpperCase()}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLanguageChange(lang.code);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${lang.code === i18n.language ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{lang.name}</div>
                                    <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                                </div>
                                {lang.code === i18n.language && (
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
