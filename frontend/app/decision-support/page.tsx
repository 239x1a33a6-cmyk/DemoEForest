'use client';

import { useState, useEffect } from 'react';
import DSSStats from './DSSStats';
import SpatialDecisionEngine from './SpatialDecisionEngine';
import AIRecommendationEngine from './AIRecommendationEngine';
import SchemeEligibilityEngine from './SchemeEligibilityEngine';
import PolicySimulator from './PolicySimulator';

export default function DecisionSupportPage() {
  const [activeSection, setActiveSection] = useState('spatial');

  const sections = [
    {
      id: 'spatial',
      name: 'Spatial Decision Engine',
      icon: 'ri-map-2-line'
    },
    {
      id: 'ai-recommendations',
      name: 'AI Recommendations',
      icon: 'ri-brain-line'
    },
    {
      id: 'eligibility',
      name: 'Eligibility Checker',
      icon: 'ri-checkbox-circle-line'
    },
    {
      id: 'simulator',
      name: 'Policy Simulator',
      icon: 'ri-settings-3-line'
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for trigger point

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <i className="ri-dashboard-3-line text-3xl text-white"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Decision Support System
              </h1>
              <p className="text-gray-600 mt-1">
                AI-driven spatial analytics for FRA & tribal development
              </p>
            </div>
          </div>
        </div>

        {/* KPI Stats */}
        <DSSStats />

        {/* Sticky Navigation Bar */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-2 mb-8 transition-all duration-300">
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${activeSection === section.id
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <i className={`${section.icon} text-lg`}></i>
                <span className="font-medium text-sm">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 pb-12">
          <section id="spatial" className="scroll-mt-28">
            <SpatialDecisionEngine />
          </section>

          <section id="ai-recommendations" className="scroll-mt-28">
            <AIRecommendationEngine />
          </section>

          <section id="eligibility" className="scroll-mt-28">
            <SchemeEligibilityEngine />
          </section>

          <section id="simulator" className="scroll-mt-28">
            <PolicySimulator />
          </section>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="ri-information-line"></i>
                About DSS
              </h4>
              <p className="text-sm text-green-100">
                Comprehensive decision support system integrating FRA claim data, AI-based asset mapping,
                and socio-economic data for evidence-based policy making.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="ri-database-2-line"></i>
                Data Sources
              </h4>
              <ul className="text-sm text-green-100 space-y-1">
                <li>• FRA Patta Records (IFR, CR, CFR)</li>
                <li>• Satellite Imagery & Land Use</li>
                <li>• Scheme Coverage Data</li>
                <li>• Vulnerability Indices</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="ri-shield-check-line"></i>
                Key Features
              </h4>
              <ul className="text-sm text-green-100 space-y-1">
                <li>• Spatial analytics & heatmaps</li>
                <li>• ML-based village clustering</li>
                <li>• Eligibility gap analysis</li>
                <li>• Policy scenario simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
