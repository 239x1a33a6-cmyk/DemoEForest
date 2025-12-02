
'use client';

export default function StatsSection() {
  const stats = [
    {
      number: '2.5M+',
      label: 'FRA Claims Processed',
      description: 'Individual and community forest rights claims digitized and verified'
    },
    {
      number: '15,000+',
      label: 'Villages Mapped',
      description: 'Forest-dwelling communities with comprehensive asset mapping'
    },
    {
      number: '98%',
      label: 'Accuracy Rate',
      description: 'AI-powered satellite imagery analysis and data extraction precision'
    },
    {
      number: '50+',
      label: 'Districts Covered',
      description: 'Administrative regions with integrated FRA Atlas implementation'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transforming Forest Rights Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform has successfully digitized millions of forest rights records and 
            empowered thousands of communities with data-driven decision making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-3">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-2">
                {stat.label}
              </div>
              <div className="text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered Insights for Policy Makers
              </h3>
              <p className="text-gray-600 mb-6">
                Our Decision Support System provides intelligent recommendations by analyzing 
                FRA data alongside Central Sector Schemes, enabling targeted development 
                interventions for forest-dwelling communities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">PM-KISAN scheme integration and eligibility mapping</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Jal Jeevan Mission water infrastructure planning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">MGNREGA employment opportunity optimization</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">DAJGUA multi-ministry coordination support</span>
                </div>
              </div>
            </div>
            <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=Government%20policy%20dashboard%20with%20data%20analytics%20showing%20forest%20management%20statistics%2C%20charts%20and%20graphs%20displaying%20scheme%20benefits%20for%20tribal%20communities%2C%20modern%20administrative%20interface%20with%20colorful%20data%20visualization&width=500&height=300&seq=policy-dashboard&orientation=landscape"
                alt="Policy Dashboard"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
