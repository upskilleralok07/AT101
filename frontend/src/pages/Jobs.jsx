import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { Search, Briefcase, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';

const Jobs = () => {
  const { user, profile } = useAuth();
  
  // Jobs/Recommendations state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestSaved, setLatestSaved] = useState([]);

  // Search parameters
  const [preferredRole, setPreferredRole] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [maxDistance, setMaxDistance] = useState(200);
  const [wfh, setWfh] = useState(false);

  // Load profile default role
  useEffect(() => {
    if (profile?.skills) {
      // Set default inputs if profile loaded
    }
  }, [profile]);

  const fetchLatestSaved = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/jobs/latest/${user.id}`);
      if (res.data.success) {
        setLatestSaved(res.data.recommendations);
      }
    } catch (err) {
      console.error('Error fetching saved recommendations:', err);
    }
  };

  useEffect(() => {
    fetchLatestSaved();
  }, [user]);

  const handleSearch = async () => {
    if (!user) return;
    setLoading(true);
    setJobs([]);
    try {
      // Get skills list (from profile, or fall back)
      const userSkills = profile?.skills
        ? profile.skills.split(',').map(s => s.trim())
        : ['python', 'sql', 'git', 'communication'];

      const res = await api.post('/jobs/recommend', {
        user_id: user.id,
        user_skills: userSkills,
        preferred_role: preferredRole,
        preferred_functional_area: functionalArea,
        preferred_industry: industry,
        preferred_company: company,
        preferred_location: location,
        max_distance: maxDistance,
        work_from_home: wfh,
        top_n: 9
      });
      
      if (res.data.success) {
        setJobs(res.data.recommendations);
        fetchLatestSaved();
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      alert('Error fetching recommendations from model. Check if models are loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Internship Recommendations</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Compute matching offers by matching your profile skills against our internship database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Advanced Filters Panel */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-card shadow-sm space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Search Parameters</span>
          </h3>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Role</label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                placeholder="e.g. Developer, Data Intern"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Functional Area</label>
              <input
                type="text"
                value={functionalArea}
                onChange={(e) => setFunctionalArea(e.target.value)}
                placeholder="e.g. IT, Operations"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Infosys, TCS"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location / State</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Noida, Bhopal"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Max Distance</span>
                <span>{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="600"
                step="10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="wfh"
                checked={wfh}
                onChange={(e) => setWfh(e.target.checked)}
                className="w-3.5 h-3.5 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <label htmlFor="wfh" className="text-xs text-slate-500 font-bold cursor-pointer select-none">
                Only WFH Opportunities
              </label>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-2.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all text-xs flex justify-center items-center gap-1.5"
            >
              {loading ? 'Matching...' : '🔍 Recommend Jobs'}
            </button>
          </div>
        </div>

        {/* Results Grid layout */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <span className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
              <p className="text-xs text-slate-400 font-semibold">Generating recommendations using TF-IDF matrices...</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {jobs.map((job, idx) => (
                <JobCard key={idx} {...job} />
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <>
              {latestSaved.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Latest Saved Matches</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestSaved.map((job, idx) => (
                      <JobCard key={idx} {...job} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-card p-16 text-center flex flex-col items-center justify-center space-y-4">
                  <Briefcase className="w-12 h-12 text-slate-300" />
                  <h3 className="text-base font-bold text-slate-700">No Matched Internships</h3>
                  <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
                    Adjust the parameter settings on the left panel and click 'Recommend Jobs' to search the CSV dataset.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
