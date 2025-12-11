import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import Icon from './Icon';

interface ServiceSlide {
  id: number;
  am: string;
  en: string;
  image: string;
}

const SLIDES: ServiceSlide[] = [
  {
    id: 1,
    am: 'ማንኛውም የጤና ማማከር አገልግሎት በዶክተሮች',
    en: 'Any health consulting service by doctors',
    // image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070' // Doctor/Stethoscope
      image: 'https://i.pinimg.com/736x/6e/ec/1c/6eec1ca916d7cd82702345ef59b733c7.jpg' // Doctor/Stethoscope

},
  {
    id: 2,
    am: 'የልጆች እና የህፃናት ት/ቤት እና ክትትል',
    en: 'Child and infant school and monitoring',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=2022' // Classroom/Kids
  },
  {
    id: 3,
    am: 'የቤተሰብ ጤና ማማከር',
    en: 'Family health consulting',
    // image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070' // Happy Family
    image: 'https://i.pinimg.com/1200x/51/b7/e5/51b7e5214cc92392bcf768a9ea358e58.jpg' // Happy Family
  
},
  {
    id: 4,
    am: 'የውጭ የነፃ ት/ቤት ዕድል',
    en: 'Foreign free scholarship opportunities',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070' // University/Graduation
  },
  {
    id: 5,
    am: 'የተፈታኝ ተማሪዎች ልዩ ድጋፍ ማማከር እና ማብቃት',
    en: 'Special support consulting and empowerment for examinees',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2070' // Studying hard
  },
  {
    id: 6,
    am: 'የእናቶች እና የጨቅላ ህፃናት ጤና እና አስተዳደግ ማማከር',
    en: 'Maternal and infant health and upbringing consulting',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=2070' // Mother and baby
  },
  {
    id: 7,
    am: 'የተማሪዎች የት/ቤት ማማከር እና ክትትል (ለሁሉም ክፍል)',
    en: 'Student school consulting and monitoring (All grades)',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca28497b1?auto=format&fit=crop&q=80&w=2070' // School hallway
  },
  {
    id: 8,
    am: 'የቋንቋ ትምህርት (ለሀገር ውስጥ እና ለሀገር ውጭ)',
    en: 'Language education (Domestic and International)',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2071' // Books/Learning
  }
];

interface ServiceCarouselProps {
  lang: Language;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ lang }) => {
  const [current, setCurrent] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <div className="w-full relative h-[380px] sm:h-[500px] rounded-[32px] overflow-hidden shadow-2xl shadow-gray-900/20 group border border-gray-100">
      
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[5000ms] ease-out scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
          
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 px-6 text-center z-20">
             <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/30 px-4 py-1 rounded-full mb-4">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                    {lang === 'am' ? 'አገልግሎቶቻችን' : 'Our Services'}
                </span>
             </div>
             <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 font-amharic leading-tight drop-shadow-md max-w-4xl">
               {slide.am}
             </h2>
             <p className="text-gray-300 text-sm sm:text-lg font-medium max-w-2xl drop-shadow-sm">
               {slide.en}
             </p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-amber-500/50 group/btn"
      >
        <Icon name="ChevronLeft" size={24} className="group-hover/btn:scale-110 transition-transform" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-amber-500/50 group/btn"
      >
        <Icon name="ChevronRight" size={24} className="group-hover/btn:scale-110 transition-transform" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? 'w-8 bg-amber-500' : 'w-2 bg-white/50 hover:bg-white'
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default ServiceCarousel;