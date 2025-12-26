// Multilingual Global Support imported from DashboardModule
'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: 'ri-database-2-line',
      titleKey: 'features.dataDigitization.title',
      descriptionKey: 'features.dataDigitization.description',
      image: 'https://readdy.ai/api/search-image?query=Digital%20document%20processing%20with%20AI%20technology%2C%20scanning%20old%20paper%20documents%20into%20digital%20format%2C%20data%20extraction%20algorithms%2C%20government%20records%20digitization%2C%20modern%20office%20setting%20with%20computers%20and%20scanners%2C%20clean%20professional%20environment&width=400&height=300&seq=digitization&orientation=landscape',
      link: '/data-digitalization'
    },
    {
      icon: 'ri-map-2-line',
      titleKey: 'features.interactiveAtlas.title',
      descriptionKey: 'features.interactiveAtlas.description',
      image: 'https://readdy.ai/api/search-image?query=Interactive%20digital%20map%20interface%20showing%20forest%20areas%20with%20data%20layers%2C%20GIS%20mapping%20system%2C%20satellite%20imagery%20overlay%2C%20geographical%20information%20system%20dashboard%2C%20modern%20web%20interface%2C%20green%20forest%20boundaries%20and%20villages%20marked&width=400&height=300&seq=atlas&orientation=landscape',
      link: '/atlas'
    },
    {
      icon: 'ri-satellite-line',
      titleKey: 'features.aiAssetMapping.title',
      descriptionKey: 'features.aiAssetMapping.description',
      image: 'https://readdy.ai/api/search-image?query=Satellite%20imagery%20analysis%20with%20AI%20overlay%20showing%20forest%20areas%2C%20agricultural%20fields%2C%20water%20bodies%2C%20and%20settlements%2C%20computer%20vision%20technology%20identifying%20land%20use%20patterns%2C%20aerial%20view%20with%20data%20visualization%20markers&width=400&height=300&seq=mapping&orientation=landscape',
      link: '/asset-mapping'
    },
    {
      icon: 'ri-brain-line',
      titleKey: 'features.decisionSupport.title',
      descriptionKey: 'features.decisionSupport.description',
      image: 'https://readdy.ai/api/search-image?query=Decision%20support%20system%20dashboard%20with%20data%20analytics%2C%20AI-powered%20recommendations%20interface%2C%20government%20policy%20planning%20tools%2C%20charts%20and%20graphs%20showing%20scheme%20benefits%2C%20modern%20data%20visualization%20for%20policy%20makers&width=400&height=300&seq=dss&orientation=landscape',
      link: '/decision-support'
    },
    {
      icon: 'ri-shield-check-line',
      titleKey: 'features.legacyIntegration.title',
      descriptionKey: 'features.legacyIntegration.description',
      image: 'https://readdy.ai/api/search-image?query=Data%20integration%20process%20showing%20old%20paper%20records%20being%20converted%20to%20digital%20format%2C%20legacy%20system%20modernization%2C%20historical%20documents%20connecting%20to%20modern%20databases%2C%20technology%20bridge%20concept&width=400&height=300&seq=legacy&orientation=landscape',
      link: '#'
    },
    {
      icon: 'ri-line-chart-line',
      titleKey: 'features.progressTracking.title',
      descriptionKey: 'features.progressTracking.description',
      image: 'https://readdy.ai/api/search-image?query=Progress%20tracking%20dashboard%20with%20real-time%20analytics%2C%20government%20policy%20implementation%20monitoring%2C%20administrative%20level%20reporting%20interface%2C%20data%20visualization%20charts%20showing%20forest%20rights%20progress%20across%20regions&width=400&height=300&seq=tracking&orientation=landscape',
      link: '/dashboard'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link href={feature.link} key={index} className="block h-full">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 h-full flex flex-col">
                <div className="h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={feature.image}
                    alt={t(feature.titleKey)}
                    className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <i className={`${feature.icon} text-2xl text-green-600`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
