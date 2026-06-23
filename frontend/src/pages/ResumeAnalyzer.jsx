import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import ResumeUploader from '../components/ResumeUploader';
import {
  FileCheck,
  ListPlus,
  ArrowRight,
  TrendingUp,
  Brain,
  Download,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const { user, parsedResume, updateParsedResume } = useAuth();
  const [analysis, setAnalysis] = useState(parsedResume);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [targetRole, setTargetRole] = useState('General');

  const fetchLatestAnalysis = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/resume/latest/${user.id}`);
      if (res.data.analysis) {
        const item = res.data.analysis;
        // Parse SQL schema attributes to UI properties
        const parsed = {
          score: item.resume_score,
          label: item.resume_label,
          num_skills: item.skills_found || 0,
          missing_skills_count: item.missing_skills || 0,
          category: item.target_role,
          skills_found: [], // will fetch on new scan or fallback
          missing_skills: [], 
          skill_breakdown: {}
        };
        setAnalysis(parsed);
        updateParsedResume(parsed);
      }
    } catch (err) {
      console.error('Error fetching latest resume:', err);
    }
  };

  useEffect(() => {
    if (!analysis) {
      fetchLatestAnalysis();
    }
  }, [user]);

  const handleAnalyze = async ({ mode, file, text }) => {
    if (!user) return;
    setLoading(true);
    setSuggestions('');
    
    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('target_role', targetRole);

    if (mode === 'file' && file) {
      formData.append('file', file);
    } else if (mode === 'text' && text) {
      formData.append('text', text);
    }

    try {
      const res = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        updateParsedResume(res.data.analysis);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      alert(err.response?.data?.detail || 'Analysis failed. Make sure the API backend is running.');
    } finally {
      setLoading(false);
    }
  };


  const fetchSuggestions = async () => {
    if (!analysis) return;
    setLoadingSuggestions(true);
    try {
      const skillsList = analysis.skills_found || [];
      const missingList = analysis.missing_skills || [];
      const roleStr = targetRole !== 'General' ? targetRole : (analysis.category || 'Software Engineer');

      const res = await api.post('/resume/suggestions', {
        skills: skillsList,
        missing_skills: missingList,
        category: roleStr
      });
      if (res.data.success) {
        setSuggestions(res.data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const scoreColor = analysis?.score >= 70 ? 'text-emerald-500' : analysis?.score >= 50 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="space-y-8">
      {/* Target Role Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-5 rounded-card shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Target Role Tuning</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Select a role to align your ATS scoring suggestions</p>
        </div>
        <select
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none font-semibold text-slate-700 focus:border-primary/50 transition-all cursor-pointer"
        >
          <option value="General">General (Auto Detect)</option>
          <option value="Data Science">Data Science / Machine Learning</option>
          <option value="Python Developer">Python Developer</option>
          <option value="Web Designing">Web Designing / Frontend</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
          <option value="Java Developer">Java Developer</option>
          <option value="Database">Database Administrator</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-800">Upload & Analyze</h3>
          <ResumeUploader onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {analysis ? (
            <>
              {/* Analysis Header Card */}
              <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-primary" />
                    <span>Analysis Results</span>
                  </h3>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Gauge */}
                  <div className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                    <div className="relative flex items-center justify-center w-28 h-28">
                      {/* Circle Gauge SVG */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke={analysis.score >= 70 ? '#10B981' : analysis.score >= 50 ? '#F59E0B' : '#EF4444'}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={301.6}
                          strokeDashoffset={301.6 - (301.6 * (analysis.score || 0)) / 100}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-slate-800">{analysis.score}%</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ATS MATCH</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-4 text-center">{analysis.label}</span>
                  </div>

                  {/* Skills count */}
                  <div className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-2">
                    <Brain className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-extrabold text-slate-800">{analysis.num_skills}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase text-center">Skills Extracted</span>
                  </div>

                  {/* Word count */}
                  <div className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-extrabold text-slate-800">{analysis.word_count || 'N/A'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase text-center">Resume Words</span>
                  </div>
                </div>

                {/* Strengths & Improve lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Strengths</span>
                    </h4>
                    <ul className="text-xs text-slate-500 font-medium space-y-2 leading-relaxed">
                      <li>• Good matching profile for {analysis.category || 'General'}.</li>
                      <li>• Strong representation of specialized skills ({analysis.num_skills} identified).</li>
                      <li>• Clean layout formatting and readable vocabulary.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Areas to Improve</span>
                    </h4>
                    <ul className="text-xs text-slate-500 font-medium space-y-2 leading-relaxed">
                      {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                        <>
                          <li>• Consider learning missing skills: {analysis.missing_skills.slice(0, 3).join(', ')}.</li>
                          <li>• Quantify achievements with percentage values.</li>
                          <li>• Tailor experience bullets to target descriptions.</li>
                        </>
                      ) : (
                        <>
                          <li>• Add links to active GitHub or projects portfolios.</li>
                          <li>• List certified credentials clearly.</li>
                          <li>• Quantify performance metrics in project descriptions.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills Tags breakdown list */}
              <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <ListPlus className="w-5 h-5 text-primary" />
                  <span>Skills Categorization</span>
                </h3>

                {analysis.skills_found && analysis.skills_found.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills_found.map((s, idx) => (
                        <span key={idx} className="bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full select-none capitalize border border-primary/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold">No specialized skills lists loaded.</p>
                )}

                {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>Missing Target Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_skills.map((s, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-full select-none capitalize border border-rose-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Resume improvement suggestions panel */}
              <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <span>AI Coaching Suggestions</span>
                  </h3>
                  {!suggestions && (
                    <button
                      onClick={fetchSuggestions}
                      disabled={loadingSuggestions}
                      className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md shadow-primary/25 transition-all"
                    >
                      {loadingSuggestions ? 'Scaling...' : 'Get AI Suggestions'}
                    </button>
                  )}
                </div>

                {loadingSuggestions && (
                  <div className="py-8 flex justify-center">
                    <span className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></span>
                  </div>
                )}

                {suggestions && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                    {suggestions}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-card p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
              <FileCheck className="w-12 h-12 text-slate-300" />
              <h3 className="text-base font-bold text-slate-700">No Resume Scans Found</h3>
              <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
                Paste your resume details or upload a PDF files template on the left panel to display placement indicators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
