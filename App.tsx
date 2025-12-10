import React, { useState, useEffect } from 'react';
import { DEFAULT_QUESTIONS } from './constants';
import { User, Language, Question, FeedbackSubmission, RegisteredParent } from './types';
import Icon from './components/Icon';
import { LogOut, Globe, UserCheck, Lock, Hash, ArrowRight } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import ParentDashboard from './components/ParentDashboard';

// NOTE: In a real production app, these would come from Firestore
// Using localStorage for demo persistence
const loadLocal = (key: string, def: any) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : def;
};

const DEFAULT_REGISTERED_PARENTS: RegisteredParent[] = [
  { studentId: 'DSV1234', parentName: 'Demo Parent', parentPhone: '0911223344' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('am');
  const [questions, setQuestions] = useState<Question[]>(() => loadLocal('questions', DEFAULT_QUESTIONS));
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() => loadLocal('submissions', []));
  const [registeredParents, setRegisteredParents] = useState<RegisteredParent[]>(() => loadLocal('registeredParents', DEFAULT_REGISTERED_PARENTS));

  // Login Inputs
  const [loginTab, setLoginTab] = useState<'parent' | 'admin'>('parent');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('registeredParents', JSON.stringify(registeredParents));
  }, [registeredParents]);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginTab === 'parent') {
      if (phone.length < 3) return alert("Please enter a valid phone");
      if (studentId.length < 2) return alert("Please enter a valid Student ID");
      
      // Strict Check against Registered Parents
      const validParent = registeredParents.find(
        p => p.studentId === studentId && p.parentPhone === phone
      );

      if (validParent) {
        setUser({
          id: validParent.studentId,
          name: validParent.parentName,
          role: 'parent',
          phone: validParent.parentPhone
        });
      } else {
        alert('Access Denied: Invalid Student ID or Phone Number. Please contact the Admin to register.');
      }
    } else {
      if ((email === 'admin@dreamstars.com' && password === 'admin') || (email && password)) {
        setUser({
          id: 'admin1',
          name: 'Admin User',
          role: 'admin',
          email
        });
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const performDemoLogin = (type: 'parent' | 'admin') => {
    if (type === 'parent') {
      // Must match default registered parent for demo to make sense logically
      setStudentId('DSV1234');
      setPhone('0911223344');
      setUser({
        id: 'DSV1234',
        name: 'Demo Parent',
        role: 'parent',
        phone: '0911223344'
      });
    } else {
      setUser({
        id: 'admin-demo',
        name: 'Admin (Demo)',
        role: 'admin',
        email: 'admin@dreamstars.com'
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPhone('');
    setStudentId('');
    setEmail('');
    setPassword('');
  };

  const handleSubmitFeedback = (answers: { questionId: string; answer: 'well_done' | 'not_done' }[]) => {
    if (!user) return;
    
    // Create rich submission object
    const newSubmission: FeedbackSubmission = {
      id: Date.now().toString(),
      parentId: user.id,
      parentName: user.name,
      date: new Date().toLocaleString(),
      responses: answers.map(a => {
        const q = questions.find(q => q.id === a.questionId);
        return {
          questionId: a.questionId,
          questionText: q?.textAm || 'Unknown Question',
          answer: a.answer
        };
      })
    };

    setSubmissions([newSubmission, ...submissions]);
  };

  // --- Admin Handlers ---

  const toggleQuestion = (id: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, active: !q.active } : q));
  };

  const addNewQuestion = (am: string, en: string) => {
      const newQ: Question = {
          id: Date.now().toString(),
          textAm: am,
          textEn: en,
          active: true
      };
      setQuestions([...questions, newQ]);
  };

  const handleRegisterParent = (parent: RegisteredParent) => {
    if (registeredParents.some(p => p.studentId === parent.studentId)) {
      alert('Error: This Student ID is already registered.');
      return;
    }
    setRegisteredParents([parent, ...registeredParents]);
  };

  const handleDeleteParent = (studentId: string) => {
      setRegisteredParents(prev => prev.filter(p => p.studentId !== studentId));
  };

  // --- Renders ---

  const renderHeader = () => (
    <header className="bg-black text-white shadow-xl sticky top-0 z-50 border-b border-amber-600/30 backdrop-blur-md bg-black/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-10 h-8 sm:w-12 sm:h-10 rounded-lg flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform text-xs sm:text-sm">
              DSV
            </div>
            <div>
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-1">
                  Dream Stars <span className="text-amber-500 font-extrabold drop-shadow-sm">VIP</span>
                </h1>
            </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Only show language toggle if NOT admin */}
          {user?.role !== 'admin' && (
            <button 
              onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-black bg-white hover:bg-amber-400 hover:text-black transition-all px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md border border-gray-200"
            >
              <Globe size={16} />
              <span className="hidden sm:inline font-amharic">{lang === 'am' ? 'English' : 'አማርኛ'}</span>
              <span className="sm:hidden">{lang === 'am' ? 'En' : 'Am'}</span>
            </button>
          )}
          {user && (
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-amber-500 transition-colors transform hover:rotate-90 duration-300"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const renderLogin = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gray-400/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gray-500/30 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-gray-50 rounded-3xl shadow-2xl shadow-gray-500/20 border border-gray-200 overflow-hidden relative z-10 transform transition-all duration-500 flex flex-col">
        
        {/* Language Toggle for Login Screen */}
        <div className="absolute top-4 right-4 z-20">
             <button 
                onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all px-3 py-1.5 rounded-full border border-gray-300 shadow-sm"
              >
                <Globe size={14} />
                <span className="font-amharic">{lang === 'am' ? 'English' : 'አማርኛ'}</span>
              </button>
        </div>

        {/* Header Section */}
        <div className="bg-gray-50 pt-10 pb-6 px-10 text-center relative">
            <div className="relative z-10">
                <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-amber-500/20">
                     <span className="text-xl font-extrabold text-amber-500">DSV</span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-amharic tracking-tight">
                  {lang === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome'}
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                  <span className="text-gray-500">Dream Stars</span> <span className="text-amber-500">VIP</span>
                </p>
            </div>
        </div>
        
        {/* Modern Tabs */}
        <div className="flex bg-gray-200 p-1.5 mx-6 rounded-xl border border-gray-300/50">
          <button 
            onClick={() => setLoginTab('parent')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all shadow-sm font-amharic ${loginTab === 'parent' ? 'bg-white text-black shadow-md border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none'}`}
          >
            {lang === 'am' ? 'የወላጅ መግቢያ' : 'Parent Login'}
          </button>
          <button 
            onClick={() => setLoginTab('admin')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all shadow-sm font-amharic ${loginTab === 'admin' ? 'bg-white text-black shadow-md border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none'}`}
          >
            {lang === 'am' ? 'የአስተዳዳሪ መግቢያ' : 'Admin Login'}
          </button>
        </div>

        <div className="p-8 pt-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {loginTab === 'parent' ? (
              <>
                <div className="space-y-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase ml-1 font-amharic">
                      {lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                          <UserCheck size={20}/>
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder={lang === 'am' ? '0911...' : '0911...'}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all font-bold text-gray-900 bg-white focus:bg-white placeholder-gray-400 shadow-sm"
                      />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase ml-1 font-amharic">
                      {lang === 'am' ? 'የተማሪ መለያ' : 'Student ID'}
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                          <Hash size={20}/>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'am' ? 'መለያ...' : 'ID...'}
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all font-bold text-gray-900 bg-white focus:bg-white placeholder-gray-400 shadow-sm"
                      />
                    </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-gray-900 uppercase ml-1 font-amharic">
                    {lang === 'am' ? 'ኢሜይል አድራሻ' : 'Email Address'}
                  </label>
                  <div className="relative group">
                      <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                          <UserCheck size={20}/>
                      </span>
                      <input
                      type="email"
                      required
                      placeholder="admin@dreamstars.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all font-bold text-gray-900 bg-white focus:bg-white placeholder-gray-400 shadow-sm"
                      />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-gray-900 uppercase ml-1 font-amharic">
                    {lang === 'am' ? 'የይለፍ ቃል' : 'Password'}
                  </label>
                  <div className="relative group">
                      <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                          <Lock size={20}/>
                      </span>
                      <input
                      type="password"
                      required
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all font-bold text-gray-900 bg-white focus:bg-white placeholder-gray-400 shadow-sm"
                      />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-2 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 border border-gray-800 text-xs mt-6 group"
            >
              <span className="font-amharic tracking-wide">{lang === 'am' ? 'ግቡ' : 'Login'}</span>
              <div className="bg-amber-500 text-black p-1 rounded-full group-hover:translate-x-1 transition-transform">
                 <Icon name="ArrowRight" size={12} className="stroke-[3px]" />
              </div>
            </button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-[10px] text-center text-gray-400 mb-4 uppercase tracking-widest font-bold font-amharic">
              {lang === 'am' ? 'ሙከራ' : 'Demo'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => performDemoLogin('parent')}
                className="py-2.5 px-4 bg-white text-gray-600 rounded-lg text-xs font-bold hover:bg-black hover:text-white hover:border-black transition-all border border-gray-200 font-amharic shadow-sm"
              >
                {lang === 'am' ? 'የሙከራ ወላጅ' : 'Demo Parent'}
              </button>
              <button 
                type="button"
                onClick={() => performDemoLogin('admin')}
                className="py-2.5 px-4 bg-white text-gray-600 rounded-lg text-xs font-bold hover:bg-black hover:text-white hover:border-black transition-all border border-gray-200 font-amharic shadow-sm"
              >
                 {lang === 'am' ? 'የሙከራ አስተዳዳሪ' : 'Demo Admin'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Text for Login Page */}
      <p className="mt-6 text-xs text-gray-600 font-bold tracking-wide">
        © 2025 Study Tracker. Powered by Dream Stars VIP
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col text-gray-900">
      {user && renderHeader()}
      
      {!user ? renderLogin() : (
        <>
          {user.role === 'admin' ? (
            <AdminDashboard 
              user={user}
              questions={questions}
              submissions={submissions}
              registeredParents={registeredParents}
              onToggleQuestion={toggleQuestion}
              onAddQuestion={addNewQuestion}
              onRegisterParent={handleRegisterParent}
              onDeleteParent={handleDeleteParent}
            />
          ) : (
            <ParentDashboard 
              lang={lang}
              questions={questions}
              onSubmitFeedback={handleSubmitFeedback}
            />
          )}

          <footer className="bg-black border-t border-gray-800 py-6 mt-auto text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500">© 2025 Study Tracker.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;