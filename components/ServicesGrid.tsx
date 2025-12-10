import React from 'react';
import { ServiceItem, Language } from '../types';
import Icon from './Icon';

interface ServicesGridProps {
  services: ServiceItem[];
  lang: Language;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ services, lang }) => {
  return (
    <div className="w-full py-2 sm:py-4">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-black mb-3 font-amharic uppercase tracking-tight">
          {lang === 'am' ? 'አገልግሎታችን' : 'Our Services'}
        </h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-6xl mx-auto">
        {services.map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 border border-gray-100 hover:border-amber-300 group p-5 sm:p-7 flex items-start gap-5 sm:gap-6 transform hover:-translate-y-1"
          >
            <div className="bg-amber-50 p-4 rounded-2xl group-hover:bg-black transition-colors duration-300 shrink-0 border border-amber-100 group-hover:border-black shadow-sm group-hover:shadow-md">
              <Icon name={service.icon} className="text-amber-600 group-hover:text-amber-500 transition-colors" size={28} />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 font-amharic group-hover:text-amber-600 transition-colors mb-2">
                {service.amharic}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed group-hover:text-gray-700">
                {service.english}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;