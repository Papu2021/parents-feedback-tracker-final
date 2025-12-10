import React, { useState, useEffect } from 'react';
import { Language, Question } from '../types';
import FeedbackForm from './FeedbackForm';
import ServicesGrid from './ServicesGrid';
import Icon from './Icon';
import { Star } from 'lucide-react';
import { SERVICES_DATA } from '../constants';

interface ParentDashboardProps {
    lang: Language;
    questions: Question[];
    onSubmitFeedback: (answers: { questionId: string; answer: 'well_done' | 'not_done' }[]) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ lang, questions, onSubmitFeedback }) => {
    const [submitted, setSubmitted] = useState(false);

    // Ensure page starts at the top when Parent Dashboard loads or changes state
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [submitted]);

    const handleFormSubmit = (answers: { questionId: string; answer: 'well_done' | 'not_done' }[]) => {
        onSubmitFeedback(answers);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[70vh] animate-fadeIn bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100">
                <div className="bg-white p-8 sm:p-14 rounded-[32px] shadow-2xl shadow-amber-500/10 border border-white max-w-2xl w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                    <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30 transform hover:scale-110 transition-transform">
                        <Icon name="CheckCircle" size={56} className="text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6 font-amharic">
                        {lang === 'am' ? 'ተሳክቷል!' : 'Success!'}
                    </h2>
                    <p className="text-gray-500 text-lg sm:text-xl mb-10 font-amharic leading-relaxed max-w-lg mx-auto">
                        {lang === 'am' 
                            ? 'አስተያየትዎ በተሳካ ሁኔታ ተላኳል! ስለሰጡን አስተያየት እናመሰግናለን።' 
                            : 'Your feedback has been submitted successfully! Thank you for your response.'}
                    </p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="bg-black text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-all transform active:scale-95 flex items-center gap-3 mx-auto border border-gray-800 hover:shadow-xl"
                    >
                        <span className="text-amber-500"><Icon name="ArrowRight" size={20} /></span>
                        <span>{lang === 'am' ? 'ወደ ዋናው ገጽ ተመለስ' : 'Back to Dashboard'}</span>
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-[32px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-gray-800 group">
                {/* Abstract Glows */}
                <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors duration-700"></div>
                <div className="absolute bottom-[-50%] left-[-10%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-amber-400 mb-4 tracking-widest uppercase">
                            Dream Stars VIP
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white leading-tight">
                            {lang === 'am' ? 'እንኳን ደህና መጡ!' : 'Welcome back!'}
                        </h2>
                        <p className="opacity-80 max-w-xl text-gray-300 text-base sm:text-lg leading-relaxed font-light">
                            {lang === 'am' ? 'የልጅዎን የእለት እንቅስቃሴ እዚህ ይከታተሉ፣ አገልግሎታችንን ከታች ይመልከቱ።' : 'Track your child\'s daily progress here and explore our premium services below.'}
                        </p>
                    </div>
                    
                    {/* Decorative Icon */}
                    <div className="hidden sm:block opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                         <Icon name="Baby" size={140} className="text-amber-500" />
                    </div>
                </div>
            </div>

            {/* 1. Feedback Section */}
            <section className="relative">
                <div className="flex items-center gap-4 mb-8 sm:mb-12 justify-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="text-amber-500 animate-pulse"><Star size={14} fill="currentColor"/></span>
                        Daily Check-in
                        <span className="text-amber-500 animate-pulse"><Star size={14} fill="currentColor"/></span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                <FeedbackForm 
                    questions={questions.filter(q => q.active)} 
                    lang={lang} 
                    onSubmit={handleFormSubmit} 
                />
            </section>

            {/* 2. Services Section */}
            <section className="bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f3f4f6_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                    <ServicesGrid services={SERVICES_DATA} lang={lang} />
                </div>
            </section>
        </main>
    );
}

export default ParentDashboard;