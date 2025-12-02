import React from 'react';
import { InterventionReport } from '@/types/atlas';
import { exportAsExcel, exportAsPDF } from '@/lib/exportUtils';

interface InterventionReportsProps {
    reports: InterventionReport[];
    onClose: () => void;
}

export default function InterventionReports({ reports, onClose }: InterventionReportsProps) {
    const handleExportExcel = () => {
        // Flatten reports for Excel export
        const flatData = reports.flatMap(report =>
            report.actions.map(action => ({
                Village: report.village,
                District: report.district,
                State: report.state,
                Scheme: action.scheme,
                Intervention: action.intervention,
                Beneficiaries: action.beneficiaries,
                Budget: action.budget,
                Timeline: action.timeline
            }))
        );
        exportAsExcel(flatData, 'intervention-reports');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <i className="ri-file-list-3-line"></i>
                    Village-wise Intervention Reports
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportExcel}
                        className="px-3 py-1 bg-white text-purple-700 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        <i className="ri-file-excel-line mr-1"></i> Export Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-3 py-1 bg-white text-purple-700 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        <i className="ri-printer-line mr-1"></i> Print
                    </button>
                    <button onClick={onClose} className="text-white hover:text-gray-200 ml-2">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                <div className="space-y-6" id="intervention-reports-content">
                    {reports.map((report, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800">{report.village}</h3>
                                    <p className="text-xs text-gray-500">{report.district}, {report.state}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-800">Total Budget: ₹{report.totalBudget.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">{report.totalBeneficiaries} Beneficiaries</div>
                                </div>
                            </div>

                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">Scheme</th>
                                        <th className="px-4 py-2">Intervention</th>
                                        <th className="px-4 py-2 text-right">Beneficiaries</th>
                                        <th className="px-4 py-2 text-right">Est. Budget</th>
                                        <th className="px-4 py-2">Timeline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {report.actions.map((action, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium text-blue-600">{action.scheme}</td>
                                            <td className="px-4 py-2">{action.intervention}</td>
                                            <td className="px-4 py-2 text-right">{action.beneficiaries}</td>
                                            <td className="px-4 py-2 text-right">₹{action.budget.toLocaleString()}</td>
                                            <td className="px-4 py-2 text-gray-500">{action.timeline}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
