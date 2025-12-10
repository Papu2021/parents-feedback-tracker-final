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
            <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
              <p className="font-extrabold text-xl sm:text-2xl text-gray-900 font-amharic mb-3 leading-tight">
                {q.textAm}
              </p>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                {q.textEn}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => handleSelect(q.id, 'not_done')}
                className={`group flex-1 flex flex-col items-center justify-center gap-3 px-6 py-5 rounded-2xl border-2 transition-all duration-300 ${
                  answers[q.id] === 'not_done'
                    ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.03]'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${answers[q.id] === 'not_done' ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    <XCircle size={32} strokeWidth={2.5} className={answers[q.id] === 'not_done' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} />
                </div>
                <span className="font-amharic font-bold text-sm uppercase tracking-wider">
                  {lang === 'am' ? 'አልተሰራም' : 'Not Done'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelect(q.id, 'well_done')}
                className={`group flex-1 flex flex-col items-center justify-center gap-3 px-6 py-5 rounded-2xl border-2 transition-all duration-300 ${
                  answers[q.id] === 'well_done'
                    ? 'bg-amber-500 border-amber-500 text-black shadow-xl shadow-amber-500/30 scale-[1.03]'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-amber-500 hover:text-amber-600'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${answers[q.id] === 'well_done' ? 'bg-black/10' : 'bg-amber-50 group-hover:bg-amber-100'}`}>
                    <CheckCircle size={32} strokeWidth={2.5} className={answers[q.id] === 'well_done' ? 'text-black' : 'text-amber-300 group-hover:text-amber-600'} />
                </div>
                <span className="font-amharic font-bold text-sm uppercase tracking-wider">
                  {lang === 'am' ? 'በደንብ ተከናውኗል' : 'Well Done'}
                </span>
              </button>
            </div>
          </div>
        ))}

        <div className="pt-6 sm:pt-8 flex justify-center">
            <button
                type="submit"
                className="w-full sm:max-w-md bg-black hover:bg-gray-900 text-white font-bold py-2.5 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-black/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-gray-800"
            >
                <span className="bg-amber-500 p-1 rounded-full text-black"><Send size={16}/></span>
                <span className="text-base">{lang === 'am' ? 'ላክ' : 'Submit Feedback'}</span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;