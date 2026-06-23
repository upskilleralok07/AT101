import React, { useState } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import { Lightbulb, AlertTriangle, Sparkles, Check, AlertCircle } from 'lucide-react';

const AISuggestions = () => {
  const { parsedResume } = useAuth();
  const [targetRole, setTargetRole] = useState('Data Science');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  if (!parsedResume) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-card p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h3 className="text-base font-bold text-slate-700 font-sans">No Resume Scans Registered</h3>
        <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
          ⚠️ Please analyze your resume first in the Resume Analyzer page before viewing AI suggestions!
        </p>
      </div>
    );
  }

  const handleGetSuggestions = async () => {
    setLoading(true);
    setTips('');
    try {
      const skillsList = parsedResume.skills_found || parsedResume.skills || [];
      const missingList = parsedResume.missing_skills || [];
      
      const res = await api.post('/resume/suggestions', {
        skills: skillsList,
        missing_skills: missingList,
        category: targetRole
      });
      if (res.data.success) {
        setTips(res.data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      alert('Error fetching AI suggestions. Check if GROQ_API_KEY is configured.');
    } finally {
      setLoading(false);
    }
  };

  const skills = parsedResume.skills_found || parsedResume.skills || [];
  const missing = parsedResume.missing_skills || [];

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Suggestions</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Obtain customized coaching suggestions powered by Groq LLM analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selector and Action Column */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-card shadow-sm space-y-4 md:col-span-1 h-fit">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none font-bold text-slate-700 focus:border-primary/50 transition-all cursor-pointer"
            >
              <option value="Data Science">Data Science</option>
              <option value="Python Developer">Python Developer</option>
              <option value="Web Designing">Web Designing</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Java Developer">Java Developer</option>
              <option value="Database">Database Administrator</option>
              <option value="Blockchain">Blockchain Engineer</option>
              <option value="Network Security Engineer">Network Security</option>
            </select>
          </div>

          <button
            onClick={handleGetSuggestions}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-2.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all text-xs flex justify-center items-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get AI Suggestions</span>
              </>
            )}
          </button>
        </div>

        {/* Results Columns */}
        <div className="md:col-span-2 space-y-6">
          {tips ? (
            <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>Your Personalized Action Plan</span>
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                {tips}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-card p-8 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-700">No Action Plan Generated</h4>
              <p className="text-xs text-slate-400 font-semibold max-w-xs">
                Select your target role on the left and click 'Get AI Suggestions' to query recommendations.
              </p>
            </div>
          )}

          {/* Current Profile breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Your Current Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Skills You Have</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.length > 0 ? (
                    skills.map(s => (
                      <span key={s} className="bg-primary-light text-primary text-[10px] font-bold px-2 py-1 rounded-lg border border-primary/5 capitalize">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold">None detected</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Key Skills Missing</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {missing.length > 0 ? (
                    missing.map(s => (
                      <span key={s} className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-100 capitalize">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold">No critical skills missing! 🎉</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
