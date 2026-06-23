import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import { ClipboardCheck, FileText, Mic, BarChart3, AlertTriangle } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/${user.id}`);
      if (res.data?.recent_activity) {
        setHistory(res.data.recent_activity);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center">
        <span className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
      </div>
    );
  }

  const resumeAttempts = history.filter(item => item.resume_score !== null);
  const interviewAttempts = history.filter(item => item.interview_score !== null);

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Placement Reports & History</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Review details of your resume matches, ATS scores, and interview performance logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumes Report logs */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Resume Scan History</span>
          </h3>

          {resumeAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Target Role</th>
                    <th className="py-2.5">Label</th>
                    <th className="py-2.5 text-right">ATS Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {resumeAttempts.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5">
                        {new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-2.5 capitalize">{item.target_role || 'General'}</td>
                      <td className="py-2.5 text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          item.resume_label?.includes('Likely') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {item.resume_label?.replace('✅', '').replace('❌', '') || 'Scanned'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-extrabold text-primary">{Math.round(item.resume_score)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-semibold py-8 text-center">No resume scans registered.</p>
          )}
        </div>

        {/* Interviews logs */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            <span>Interview Simulation Logs</span>
          </h3>

          {interviewAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Interview Category</th>
                    <th className="py-2.5 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {interviewAttempts.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5">
                        {new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-2.5 capitalize">{item.target_role || 'Data Science'}</td>
                      <td className="py-2.5 text-right font-extrabold text-primary">{item.interview_score}/10</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-semibold py-8 text-center">No interview attempts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
