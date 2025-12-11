import React, { useState } from 'react';
import { Question, Language } from '../types';
import { CheckCircle, XCircle, Send } from 'lucide-react';

interface FeedbackFormProps {
  questions: Question[];
  lang: Language;
  onSubmit: (answers: { questionId: string; answer: 'well_done' | 'not_done' }[]) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ questions, lang, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, 'well_done' | 'not_done' | null>>({});

  const handleSelect = (qId: string, val: 'well_done' | 'not_done') => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAnswers = Object.entries(answers)
      .filter(([_, val]) => val !== null)
      .map(([key, val]) => ({
        questionId: key,
        answer: val as 'well_done' | 'not_done'
      }));

    if (formattedAnswers.length !== questions.length) {
      alert(lang === 'am' ? 'እባክዎ ሁሉንም ጥያቄዎች ይመልሱ' : 'Please answer all questions');
      return;
    }
    onSubmit(formattedAnswers);
    setAnswers({}); // Reset form
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-6 sm:p-10 max-w-4xl mx-auto border border-gray-100">
      <div className="text-center mb-10 bg-black rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        <h3 className="text-xl sm:text-3xl font-extrabold mb-3 relative z-10">
            {lang === 'am' ? 'የዕለት ክትትል ቅጽ' : 'Daily Activity Tracker'}
        </h3>
        <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20">
             <p className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider relative z-10">
                {lang === 'am' ? 'እባክዎ የሚከተሉትን ጥያቄዎች ይመልሱ' : 'Please answer: Not done / Well done'}
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-14">
        {questions.map((q) => (
          <div key={q.id} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0">
            <div className="text-center mb-6 max-w-2xl mx-auto">
              <p className="font-extrabold text-xl sm:text-2xl text-gray-900 font-amharic mb-2 leading-tight">
                {q.textAm}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {q.textEn}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              {/* Not Done Button */}
              <button
                type="button"
                onClick={() => handleSelect(q.id, 'not_done')}
                className={`group flex-1 flex flex-row items-center justify-between px-5 py-3 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  answers[q.id] === 'not_done'
                    ? 'bg-gray-900 border-gray-900 text-white shadow-xl'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                     <div className={`p-1.5 rounded-full ${answers[q.id] === 'not_done' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <XCircle size={18} />
                     </div>
                    <span className="font-amharic font-bold text-sm uppercase tracking-wider">
                    {lang === 'am' ? 'አልተሰራም' : 'Not Done'}
                    </span>
                </div>
                {/* Radio Indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === 'not_done' ? 'border-white' : 'border-gray-300'}`}>
                    {answers[q.id] === 'not_done' && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                </div>
              </button>

              {/* Well Done Button */}
              <button
                type="button"
                onClick={() => handleSelect(q.id, 'well_done')}
                className={`group flex-1 flex flex-row items-center justify-between px-5 py-3 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  answers[q.id] === 'well_done'
                    ? 'bg-amber-500 border-amber-500 text-black shadow-xl'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-3">
                     <div className={`p-1.5 rounded-full ${answers[q.id] === 'well_done' ? 'bg-black/10 text-black' : 'bg-amber-50 text-amber-500 group-hover:bg-amber-100'}`}>
                        <CheckCircle size={18} />
                     </div>
                    <span className="font-amharic font-bold text-sm uppercase tracking-wider">
                    {lang === 'am' ? 'በደንብ ተከናውኗል' : 'Well Done'}
                    </span>
                </div>
                {/* Radio Indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === 'well_done' ? 'border-black' : 'border-gray-300'}`}>
                    {answers[q.id] === 'well_done' && <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />}
                </div>
              </button>
            </div>
          </div>
        ))}

        <div className="pt-4 flex justify-center">
            <button
                type="submit"
                className="w-full sm:max-w-xs bg-black hover:bg-gray-900 text-white font-bold py-2.5 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-black/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-gray-800 text-base"
            >
                <span className="bg-amber-500 p-1 rounded-full text-black"><Send size={14}/></span>
                <span>{lang === 'am' ? 'ላክ' : 'Submit Feedback'}</span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;