// Multilingual Global Support imported from DashboardModule
'use client';

import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Restore language from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>FRA Atlas - Forest Rights Act Mapping System</title>
        <meta name="description" content="Interactive WebGIS platform for visualizing Forest Rights Act data across India" />
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=geometry`}
          async
          defer
        ></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${pacifico.variable} antialiased`}
      >
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
