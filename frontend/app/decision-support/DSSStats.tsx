'use client';

import { useEffect, useState } from 'react';
import { DSSMetrics } from '@/types/dss';
import { mockVillages } from '@/lib/mockData';

export default function DSSStats() {
  const [metrics, setMetrics] = useState<DSSMetrics>({
    schemeCoverageIncrease: 0,
    waterIndexImprovement: 0,
    livelihoodIndexImprovement: 0,
    pendingClaimsReduction: 0,
    villagesAnalyzed: 0,
    interventionsPlanned: 0,
    reportsGenerated: 0,
    beneficiariesReached: 0,
    budgetUtilization: 0
  });

  useEffect(() => {
    // Calculate metrics dynamically from mockVillages
    const totalVillages = mockVillages.length;
    const totalPopulation = mockVillages.reduce((sum, v) => sum + v.population.total, 0);
    const totalTribalPop = mockVillages.reduce((sum, v) => sum + v.population.tribalPopulation, 0);

    // Calculate improvements (simulated based on vulnerability scores)
    const avgWaterScore = mockVillages.reduce((sum, v) => sum + v.vulnerabilityScores.water, 0) / totalVillages;
    const avgLivelihoodScore = mockVillages.reduce((sum, v) => sum + v.vulnerabilityScores.livelihood, 0) / totalVillages;

    // Calculate scheme coverage
    const totalEligible = totalTribalPop; // Simplified assumption
    const totalCovered = mockVillages.reduce((sum, v) => sum + v.schemeCoverage.totalCoverage, 0);
    const coveragePercent = (totalCovered / totalEligible) * 100;

    setMetrics({
      schemeCoverageIncrease: parseFloat((coveragePercent - 45).toFixed(1)), // Assuming baseline was 45%
      waterIndexImprovement: parseFloat((avgWaterScore - 30).toFixed(1)), // Assuming baseline was 30
      livelihoodIndexImprovement: parseFloat((avgLivelihoodScore - 25).toFixed(1)), // Assuming baseline was 25
      pendingClaimsReduction: 31.2, // Keep hardcoded for now as we don't have historical claim data
      villagesAnalyzed: totalVillages,
      interventionsPlanned: Math.floor(totalVillages * 3.5), // Avg 3.5 interventions per village
      reportsGenerated: 89,
      beneficiariesReached: totalCovered,
      budgetUtilization: 67.8
    });
  }, []);

  const stats = [
    {
      label: 'Scheme Coverage Increase',
      value: `${metrics.schemeCoverageIncrease}%`,
      icon: 'ri-arrow-up-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'FRA beneficiaries enrolled'
    },
    {
      label: 'Water Index Improvement',
      value: `${metrics.waterIndexImprovement}%`,
      icon: 'ri-water-flash-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Villages with improved water access'
    },
    {
      label: 'Livelihood Index Improvement',
      value: `${metrics.livelihoodIndexImprovement}%`,
      icon: 'ri-plant-line',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Enhanced income opportunities'
    },
    {
      label: 'Pending Claims Reduction',
      value: `${metrics.pendingClaimsReduction}%`,
      icon: 'ri-file-reduce-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Faster FRA claim processing'
    },
    {
      label: 'Villages Analyzed',
      value: metrics.villagesAnalyzed.toLocaleString(),
      icon: 'ri-map-pin-line',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Comprehensive spatial analysis'
    },
    {
      label: 'Interventions Planned',
      value: metrics.interventionsPlanned.toLocaleString(),
      icon: 'ri-tools-line',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Asset creation projects'
    },
    {
      label: 'Beneficiaries Reached',
      value: metrics.beneficiariesReached.toLocaleString(),
      icon: 'ri-group-line',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Tribal households impacted'
    },
    {
      label: 'Budget Utilization',
      value: `${metrics.budgetUtilization}%`,
      icon: 'ri-funds-line',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Efficient fund deployment'
    }
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
        <p className="text-sm text-gray-600">Real-time monitoring of tribal development progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <i className={`${stat.icon} text-2xl`}></i>
              </div>
            </div>
            <div className="mb-1">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
            </div>
            <div className="text-xs text-gray-500">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
