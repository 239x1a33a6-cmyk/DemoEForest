
'use client';

export default function StateOverview() {
  const stateData = [
    { state: 'Odisha', claims: 542891, grants: 389456, progress: 72 },
    { state: 'Chhattisgarh', claims: 423675, grants: 318234, progress: 75 },
    { state: 'Jharkhand', claims: 387432, grants: 264789, progress: 68 },
    { state: 'Madhya Pradesh', claims: 465123, grants: 312456, progress: 67 },
    { state: 'Maharashtra', claims: 298765, grants: 234567, progress: 78 },
    { state: 'Andhra Pradesh', claims: 234567, grants: 187432, progress: 80 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">State-wise Overview</h3>
      <div className="space-y-4">
        {stateData.map((state, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{state.state}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>Claims: {state.claims.toLocaleString()}</span>
                <span>Grants: {state.grants.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-10">{state.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
