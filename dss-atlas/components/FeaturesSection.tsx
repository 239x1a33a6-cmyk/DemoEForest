
'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'ri-database-2-line',
      title: 'Data Digitization',
      description: 'AI-powered extraction and standardization of legacy FRA documents using NER and OCR technologies for comprehensive digital archives.',
      image: 'https://readdy.ai/api/search-image?query=Digital%20document%20processing%20with%20AI%20technology%2C%20scanning%20old%20paper%20documents%20into%20digital%20format%2C%20data%20extraction%20algorithms%2C%20government%20records%20digitization%2C%20modern%20office%20setting%20with%20computers%20and%20scanners%2C%20clean%20professional%20environment&width=400&height=300&seq=digitization&orientation=landscape'
    },
    {
      icon: 'ri-map-2-line',
      title: 'Interactive FRA Atlas',
      description: 'WebGIS platform with layered visualization of IFR, CR, CFR claims, village boundaries, and real-time progress tracking across administrative levels.',
      image: 'https://readdy.ai/api/search-image?query=Interactive%20digital%20map%20interface%20showing%20forest%20areas%20with%20data%20layers%2C%20GIS%20mapping%20system%2C%20satellite%20imagery%20overlay%2C%20geographical%20information%20system%20dashboard%2C%20modern%20web%20interface%2C%20green%20forest%20boundaries%20and%20villages%20marked&width=400&height=300&seq=atlas&orientation=landscape'
    },
    {
      icon: 'ri-satellite-line',
      title: 'AI Asset Mapping',
      description: 'Computer vision analysis of satellite imagery to identify agricultural land, forest cover, water bodies, and homesteads using advanced ML models.',
      image: 'https://readdy.ai/api/search-image?query=Satellite%20imagery%20analysis%20with%20AI%20overlay%20showing%20forest%20areas%2C%20agricultural%20fields%2C%20water%20bodies%2C%20and%20settlements%2C%20computer%20vision%20technology%20identifying%20land%20use%20patterns%2C%20aerial%20view%20with%20data%20visualization%20markers&width=400&height=300&seq=mapping&orientation=landscape'
    },
    {
      icon: 'ri-brain-line',
      title: 'Decision Support System',
      description: 'Rule-based AI engine that cross-links FRA holders with CSS scheme eligibility, prioritizing interventions for targeted development.',
      image: 'https://readdy.ai/api/search-image?query=Decision%20support%20system%20dashboard%20with%20data%20analytics%2C%20AI-powered%20recommendations%20interface%2C%20government%20policy%20planning%20tools%2C%20charts%20and%20graphs%20showing%20scheme%20benefits%2C%20modern%20data%20visualization%20for%20policy%20makers&width=400&height=300&seq=dss&orientation=landscape'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Legacy Integration',
      description: 'Seamless integration of historical FRA data with modern atlas systems, ensuring continuity and comprehensive coverage of all claims.',
      image: 'https://readdy.ai/api/search-image?query=Data%20integration%20process%20showing%20old%20paper%20records%20being%20converted%20to%20digital%20format%2C%20legacy%20system%20modernization%2C%20historical%20documents%20connecting%20to%20modern%20databases%2C%20technology%20bridge%20concept&width=400&height=300&seq=legacy&orientation=landscape'
    },
    {
      icon: 'ri-line-chart-line',
      title: 'Progress Tracking',
      description: 'Real-time monitoring and analytics of FRA implementation progress at village, block, district, and state levels with comprehensive reporting.',
      image: 'https://readdy.ai/api/search-image?query=Progress%20tracking%20dashboard%20with%20real-time%20analytics%2C%20government%20policy%20implementation%20monitoring%2C%20administrative%20level%20reporting%20interface%2C%20data%20visualization%20charts%20showing%20forest%20rights%20progress%20across%20regions&width=400&height=300&seq=tracking&orientation=landscape'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive FRA Management Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leveraging cutting-edge AI and satellite technology to transform forest rights administration 
            and empower forest-dwelling communities across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-2xl text-green-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
