import React, { useState, useEffect } from 'react';
import { User, Question, FeedbackSubmission, RegisteredParent } from '../types';
import Icon from './Icon';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface AdminDashboardProps {
  user: User;
  questions: Question[];
  submissions: FeedbackSubmission[];
  registeredParents: RegisteredParent[];
  onToggleQuestion: (id: string) => void;
  onAddQuestion: (am: string, en: string) => void;
  onRegisterParent: (parent: RegisteredParent) => void;
  onDeleteParent: (studentId: string) => void;
}

type Tab = 'overview' | 'parents' | 'questions';

const ITEMS_PER_PAGE = 5;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, 
  questions, 
  submissions,
  registeredParents,
  onToggleQuestion, 
  onAddQuestion,
  onRegisterParent,
  onDeleteParent
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Question State
  const [newQAm, setNewQAm] = useState('');
  const [newQEn, setNewQEn] = useState('');

  // Parent Registration State
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Delete Confirmation State
  const [parentToDelete, setParentToDelete] = useState<string | null>(null);

  // Analytics State
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [parentPage, setParentPage] = useState(1);

  // Ensure page starts at the top when Admin Dashboard loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset pagination if data length changes (e.g., deletion)
  useEffect(() => {
    const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
    if (feedbackPage > totalPages && totalPages > 0) {
        setFeedbackPage(totalPages);
    }
  }, [submissions.length, feedbackPage]);

  // Reset pagination when search term changes
  useEffect(() => {
    setParentPage(1);
  }, [searchTerm]);

  const handleAddQ = (e: React.FormEvent) => {
    e.preventDefault();
    if(newQAm && newQEn) {
        onAddQuestion(newQAm, newQEn);
        setNewQAm('');
        setNewQEn('');
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // 1. Validate ID: Must start with DSV followed by numbers
    const normalizedId = regId.trim().toUpperCase();
    // Check for DSV prefix followed immediately by one or more digits
    if (!/^DSV\d+$/.test(normalizedId)) {
        setRegError('Student ID must start with "DSV" followed by numbers only (e.g., DSV001).');
        return;
    }

    // 2. Validate Phone: Must be exactly 10 digits
    const normalizedPhone = regPhone.trim();
    if (!/^\d{10}$/.test(normalizedPhone)) {
        setRegError('Phone number must be exactly 10 digits.');
        return;
    }

    if (regName && normalizedId && normalizedPhone) {
      onRegisterParent({
        parentName: regName,
        studentId: normalizedId,
        parentPhone: normalizedPhone
      });
      setRegName('');
      setRegId('');
      setRegPhone('');
      setRegError(null);
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow numbers
    if (val === '' || /^\d+$/.test(val)) {
        setRegPhone(val);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, studentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Instead of window.confirm, set the state to trigger custom modal
    setParentToDelete(studentId);
  };

  const confirmDelete = () => {
    if (parentToDelete) {
        onDeleteParent(parentToDelete);
        setParentToDelete(null);
    }
  };

  const cancelDelete = () => {
      setParentToDelete(null);
  };

  // Export Parents to CSV
  const exportParentsCSV = () => {
    const headers = "Student ID,Parent Name,Phone Number\n";
    const rows = registeredParents.map(p => 
      `"${p.studentId}","${p.parentName}","${p.parentPhone}"`
    ).join("\n");

    downloadCSV(headers + rows, `parents_export_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const downloadCSV = (content: string, fileName: string) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Logic
  const getPaginatedData = <T,>(data: T[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return {
        currentData: data.slice(startIndex, startIndex + ITEMS_PER_PAGE),
        totalPages: Math.ceil(data.length / ITEMS_PER_PAGE),
        totalItems: data.length
    };
  };

  // Prepare Chart Data for Selected Parent
  const getChartData = (parentId: string) => {
    // Filter submissions for this parent
    const parentSubs = submissions.filter(s => s.parentId === parentId);
    
    // Process into chart format (chronological order)
    const sortedSubs = [...parentSubs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedSubs.map(sub => {
        const total = sub.responses.length;
        const wellDoneCount = sub.responses.filter(r => r.answer === 'well_done').length;
        // Calculate percentage score (0-100)
        const score = total > 0 ? Math.round((wellDoneCount / total) * 100) : 0;
        
        // Extract simple date (e.g., "10/24")
        const dateObj = new Date(sub.date);
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

        return {
            date: dateStr,
            fullDate: sub.date,
            score: score,
            details: sub
        };
    });
  };

  // Filter Parents based on Search Term
  const filteredParents = registeredParents.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
        p.parentName.toLowerCase().includes(search) ||
        p.studentId.toLowerCase().includes(search) ||
        p.parentPhone.includes(search)
    );
  });

  const { currentData: currentFeedback, totalPages: totalFeedbackPages } = getPaginatedData<FeedbackSubmission>(submissions, feedbackPage);
  // Apply pagination to FILTERED parents
  const { currentData: currentParents, totalPages: totalParentPages } = getPaginatedData<RegisteredParent>(filteredParents, parentPage);

  // Also apply pagination to the RAW list for the Parent Management tab (or use filtered if you want search there too, but usually separation is good. 
  // Let's use the same filtered list for simplicity if desired, but user asked for "search engine for progress overview". 
  // For the 'Parents' tab (Management), I will use the raw list unless requested otherwise. 
  // Actually, keeping them separate is safer to avoid confusion. I will make a separate pagination for the management tab using raw data.
  const { currentData: managementParents, totalPages: totalManagementPages } = getPaginatedData<RegisteredParent>(registeredParents, parentPage);


  // Custom Tooltip Component for Recharts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/95 text-white p-4 border border-amber-500/30 shadow-2xl rounded-xl max-w-xs backdrop-blur-md z-50">
          <p className="font-bold text-amber-500 mb-2 border-b border-gray-800 pb-2 text-sm">{data.fullDate}</p>
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Daily Score</span>
             <span className={`text-sm font-bold ${data.score >= 50 ? 'text-green-400' : 'text-red-400'}`}>{data.score}%</span>
          </div>
          <div className="space-y-3">
            {data.details.responses.map((res: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-300 leading-tight">{res.questionText}</span>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${res.answer === 'well_done' ? 'bg-amber-500' : 'bg-gray-700'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${res.answer === 'well_done' ? 'text-white' : 'text-gray-500'}`}>
                            {res.answer === 'well_done' ? 'Well Done' : 'Not Done'}
                        </span>
                    </div>
                </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPagination = (currentPage: number, totalPages: number, setPage: (p: number) => void) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-bold text-black">{currentPage}</span> of <span className="font-bold text-black">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => setPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <Icon name="ChevronLeft" size={20} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                             <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                aria-current={currentPage === pageNum ? 'page' : undefined}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 transition-colors ${
                                    currentPage === pageNum
                                        ? 'bg-amber-500 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <Icon name="ChevronRight" size={20} />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
  };

  return (
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Manage feedback, parents, and system settings.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 mb-6 sm:mb-8 gap-1">
            <button 
                onClick={() => { setActiveTab('overview'); setSelectedParentId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm rounded-t-lg transition-all border-b-2 ${activeTab === 'overview' ? 'text-amber-600 border-amber-500 bg-amber-50/50' : 'text-gray-500 border-transparent hover:text-black hover:bg-gray-50'}`}
            >
                <Icon name="LayoutDashboard" size={18} />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
            </button>
            <button 
                onClick={() => setActiveTab('parents')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm rounded-t-lg transition-all border-b-2 ${activeTab === 'parents' ? 'text-amber-600 border-amber-500 bg-amber-50/50' : 'text-gray-500 border-transparent hover:text-black hover:bg-gray-50'}`}
            >
                <Icon name="Users" size={18} />
                Parents
            </button>
            <button 
                onClick={() => setActiveTab('questions')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm rounded-t-lg transition-all border-b-2 ${activeTab === 'questions' ? 'text-amber-600 border-amber-500 bg-amber-50/50' : 'text-gray-500 border-transparent hover:text-black hover:bg-gray-50'}`}
            >
                <Icon name="Settings" size={18} />
                Settings
            </button>
          </div>

          {/* TAB 1: OVERVIEW (Parent Analytics) */}
          {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 sm:p-6 mb-8 border border-gray-100 animate-fadeIn min-h-[60vh] flex flex-col">
                  
                  {!selectedParentId ? (
                    // VIEW 1: Parent List AND Global Activity
                    <>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl text-black shadow-lg shadow-amber-500/20">
                                    <Icon name="Activity" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Progress Overview</h2>
                                    <p className="text-gray-500 text-xs">Select a parent to view detailed daily response analytics.</p>
                                </div>
                            </div>

                            {/* SEARCH ENGINE */}
                            <div className="w-full md:w-auto relative group">
                                <span className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                    <Icon name="Search" size={18} />
                                </span>
                                <input 
                                    type="text"
                                    placeholder="Search parents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Parent Cards Grid */}
                        {filteredParents.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200 flex flex-col items-center justify-center">
                                <p className="text-gray-500 font-medium">No parents found matching "{searchTerm}".</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentParents.map((parent) => {
                                    const parentSubs = submissions.filter(s => s.parentId === parent.studentId);
                                    const totalSubs = parentSubs.length;
                                    const lastSub = parentSubs.length > 0 ? parentSubs[0].date.split(',')[0] : 'Never';

                                    return (
                                        <div key={parent.studentId} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{parent.parentName}</h3>
                                                    <span className="text-xs font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">{parent.studentId}</span>
                                                </div>
                                                <div className="bg-white p-2 rounded-full text-gray-400 group-hover:text-amber-500 shadow-sm">
                                                    <Icon name="User" size={20} />
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                                <div>
                                                    <p className="font-bold text-black text-lg">{totalSubs}</p>
                                                    <p className="text-xs uppercase tracking-wide">Responses</p>
                                                </div>
                                                <div className="w-px h-8 bg-gray-300"></div>
                                                <div>
                                                    <p className="font-bold text-black text-lg">{lastSub}</p>
                                                    <p className="text-xs uppercase tracking-wide">Last Active</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => setSelectedParentId(parent.studentId)}
                                                className="w-full bg-black text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-black transition-colors"
                                            >
                                                View Progress <Icon name="ArrowRight" size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {renderPagination(parentPage, totalParentPages, setParentPage)}

                        {/* Global Recent Activity Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gray-100 p-2.5 rounded-xl text-gray-600"><Icon name="List" size={24} /></div>
                                <h2 className="text-xl font-bold text-gray-900">Recent Activity Tracker</h2>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-black text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-500">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-500">Parent</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-500">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-amber-500">Summary</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentFeedback.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{sub.date.split(',')[0]}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{sub.parentName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                     <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">Submitted</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {sub.responses.filter(r => r.answer === 'well_done').length} / {sub.responses.length} Well Done
                                                </td>
                                            </tr>
                                        ))}
                                         {submissions.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No activity yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {renderPagination(feedbackPage, totalFeedbackPages, setFeedbackPage)}
                        </div>
                    </>
                  ) : (
                    // VIEW 2: Parent Analytics Detail
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <button 
                                onClick={() => setSelectedParentId(null)}
                                className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                            >
                                <Icon name="ChevronLeft" size={16} /> Back to List
                            </button>
                            <div className="text-right">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {registeredParents.find(p => p.studentId === selectedParentId)?.parentName}
                                </h2>
                                <span className="text-xs font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                    {selectedParentId}
                                </span>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Icon name="Activity" size={16} className="text-amber-500"/> Daily Performance (%)
                            </h3>
                            
                            {getChartData(selectedParentId).length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={getChartData(selectedParentId)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{fill: '#6b7280', fontSize: 12}} 
                                                axisLine={false} 
                                                tickLine={false}
                                                dy={10}
                                            />
                                            <YAxis 
                                                tick={{fill: '#6b7280', fontSize: 12}} 
                                                axisLine={false} 
                                                tickLine={false}
                                                domain={[0, 100]}
                                                unit="%"
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line 
                                                type="monotone" 
                                                dataKey="score" 
                                                stroke="#f59e0b" 
                                                strokeWidth={3} 
                                                dot={{ r: 4, fill: '#000', strokeWidth: 2, stroke: '#fff' }} 
                                                activeDot={{ r: 6, fill: '#f59e0b' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-gray-400 font-medium italic">
                                    No data available for chart
                                </div>
                            )}
                        </div>

                        {/* Recent History for this Parent */}
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Detailed Submission History</h3>
                        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-black text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-amber-500">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-amber-500">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-amber-500">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getChartData(selectedParentId)
                                        .sort((a,b) => new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime()) // Reverse chronological for list
                                        .map((item, idx) => (
                                        <tr key={idx} className="hover:bg-amber-50/20">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.fullDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.score === 100 ? 'bg-green-100 text-green-800' : item.score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.score}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {item.details.responses.filter(r => r.answer === 'well_done').length} Well Done / {item.details.responses.length} Total
                                            </td>
                                        </tr>
                                    ))}
                                    {getChartData(selectedParentId).length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No submissions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                  )}
              </div>
          )}

          {/* TAB 2: PARENTS (Registration) */}
          {activeTab === 'parents' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 sm:p-6 mb-8 border border-gray-100 animate-fadeIn min-h-[60vh] flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-black p-2.5 rounded-xl text-white shadow-lg shadow-black/20"><Icon name="Users" size={24} /></div>
                        <h2 className="text-xl font-bold text-gray-900">Parent Management</h2>
                    </div>
                    <button 
                        onClick={exportParentsCSV}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors border border-gray-200"
                    >
                        <Icon name="Download" size={16} /> <span className="sm:hidden">Export</span><span className="hidden sm:inline">Export List</span>
                    </button>
                  </div>

                  {/* Registration Form */}
                  <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border border-gray-200 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                        <div className="bg-amber-100 p-1 rounded text-amber-600"><Icon name="UserPlus" size={14} /></div>
                        Register New Parent
                    </h3>
                    
                    {regError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-bold flex items-center gap-2 animate-pulse">
                            <Icon name="XCircle" size={16} />
                            {regError}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-4 gap-5 md:items-end">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Parent Name</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-amber-500 transition-colors"><Icon name="User" size={16}/></span>
                            <input 
                                className="w-full border border-gray-300 p-2.5 pl-9 rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-black bg-white placeholder-gray-400 text-sm transition-all shadow-sm"
                                placeholder="Name"
                                value={regName}
                                onChange={e => setRegName(e.target.value)}
                                required
                            />
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Student ID</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-amber-500 transition-colors"><Icon name="Hash" size={16}/></span>
                            <input 
                                className="w-full border border-gray-300 p-2.5 pl-9 rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-black bg-white placeholder-gray-400 text-sm transition-all shadow-sm"
                                placeholder="DSV..."
                                value={regId}
                                onChange={e => setRegId(e.target.value)}
                                required
                            />
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Phone Number</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-amber-500 transition-colors"><Icon name="Phone" size={16}/></span>
                            <input 
                                type="tel"
                                className="w-full border border-gray-300 p-2.5 pl-9 rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-black bg-white placeholder-gray-400 text-sm transition-all shadow-sm"
                                placeholder="09..."
                                value={regPhone}
                                onChange={handlePhoneChange}
                                required
                            />
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <button type="submit" className="w-full bg-black text-white px-4 py-2.5 rounded-lg hover:bg-amber-500 hover:text-black hover:border-amber-500 font-bold shadow-lg flex items-center justify-center gap-2 border border-black transition-all active:scale-95 text-sm group">
                            <Icon name="Plus" size={16} className="text-amber-500 group-hover:text-black transition-colors"/> Register
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Parent List - Responsive (Table on Desktop, Cards on Mobile) */}
                  <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-black text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap text-amber-500">Parent Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap text-amber-500">Student ID</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap text-amber-500">Phone</th>
                          <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider whitespace-nowrap text-amber-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {managementParents.map((parent) => (
                          <tr key={parent.studentId} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{parent.parentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"><span className="font-mono font-bold bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded">{parent.studentId}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{parent.parentPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteClick(e, parent.studentId)}
                                className="text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 p-2 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-100"
                                title="Remove Access"
                              >
                                <Icon name="Trash2" size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {registeredParents.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No registered parents found.</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                     {managementParents.map((parent) => (
                        <div key={parent.studentId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between active:border-amber-400 transition-colors">
                            <div className="space-y-2">
                                <div className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                    <div className="bg-gray-100 p-1.5 rounded-full text-gray-500"><Icon name="User" size={14}/></div>
                                    {parent.parentName}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-100 px-2 py-1 rounded font-bold">
                                        <Icon name="Hash" size={12} />
                                        <span className="font-mono">{parent.studentId}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <Icon name="Phone" size={12} />
                                        <span>{parent.parentPhone}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={(e) => handleDeleteClick(e, parent.studentId)}
                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-3 rounded-xl transition-colors cursor-pointer"
                            >
                                <Icon name="Trash2" size={20} />
                            </button>
                        </div>
                     ))}
                     {registeredParents.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">No registered parents found.</div>
                     )}
                  </div>
                  
                  {renderPagination(parentPage, totalManagementPages, setParentPage)}

              </div>
          )}

          {/* TAB 3: QUESTIONS (Settings) */}
          {activeTab === 'questions' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 sm:p-6 border border-gray-100 animate-fadeIn min-h-[60vh]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gray-900 p-2.5 rounded-xl text-white"><Icon name="List" size={24} /></div>
                    <h2 className="text-xl font-bold text-gray-900">Manage Feedback Questions</h2>
                  </div>
                  
                  <form onSubmit={handleAddQ} className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <input 
                          className="flex-1 border border-gray-300 p-3 rounded-lg outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-amharic text-black bg-white placeholder-gray-400 transition-all focus:shadow-sm"
                          placeholder="New Question (Amharic)"
                          value={newQAm}
                          onChange={e => setNewQAm(e.target.value)}
                          required
                      />
                      <input 
                          className="flex-1 border border-gray-300 p-3 rounded-lg outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black bg-white placeholder-gray-400 transition-all focus:shadow-sm"
                          placeholder="New Question (English)"
                          value={newQEn}
                          onChange={e => setNewQEn(e.target.value)}
                          required
                      />
                      <button type="submit" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 font-bold shadow-lg flex items-center justify-center gap-2 border border-black hover:scale-105 transition-transform">
                          <Icon name="Plus" size={18} className="text-amber-500"/> Add
                      </button>
                  </form>

                  <div className="space-y-4">
                      {questions.map(q => (
                          <div key={q.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-xl transition-all gap-4 ${q.active ? 'bg-white border-gray-200 shadow-sm hover:border-amber-300' : 'bg-gray-100 border-gray-200 opacity-60'}`}>
                              <div className="flex-1">
                                  <p className="font-amharic font-bold text-gray-900 text-lg mb-1">{q.textAm}</p>
                                  <p className="text-sm text-gray-500">{q.textEn}</p>
                              </div>
                              <div className="flex items-center gap-4 self-end sm:self-center">
                                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border ${q.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                                      {q.active ? 'Active' : 'Inactive'}
                                  </span>
                                  <button 
                                      onClick={() => onToggleQuestion(q.id)}
                                      className={`p-2.5 rounded-full transition-colors ${q.active ? 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50' : 'bg-white text-gray-400 hover:text-green-600 hover:bg-green-50 shadow-sm'}`}
                                      title={q.active ? "Deactivate" : "Activate"}
                                  >
                                      <Icon name={q.active ? 'Trash2' : 'CheckCircle'} size={20} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Delete Confirmation Modal */}
          {parentToDelete && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={cancelDelete}
            >
                <div 
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-red-50 p-8 flex justify-center border-b border-red-100">
                        <div className="bg-white p-4 rounded-full shadow-lg shadow-red-200">
                            <Icon name="Trash2" size={40} className="text-red-500" />
                        </div>
                    </div>
                    <div className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Parent?</h3>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                            Are you sure you want to delete the parent <span className="font-bold text-black bg-amber-100 px-1 rounded">{parentToDelete}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={cancelDelete}
                                className="flex-1 py-3.5 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-3.5 px-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          )}
      </main>
  );
};

export default AdminDashboard;