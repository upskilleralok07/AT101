import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { Target, Search, SlidersHorizontal, AlertTriangle, Cpu } from 'lucide-react';

const InternshipRecommendation = () => {
  const { user, parsedResume } = useAuth();
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestSaved, setLatestSaved] = useState([]);

  // Form states
  const [manualSkillsInput, setManualSkillsInput] = useState('');
  const [preferredRole, setPreferredRole] = useState('');
  const [preferredFunctionalArea, setPreferredFunctionalArea] = useState('');
  const [preferredCompany, setPreferredCompany] = useState('');
  const [preferredIndustry, setPreferredIndustry] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [maxDistance, setMaxDistance] = useState(200);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [topN, setTopN] = useState(5);

  // Set default values based on parsed resume
  useEffect(() => {
    if (parsedResume) {
      setPreferredRole(parsedResume.category || '');
    }
  }, [parsedResume]);

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

  const handleRecommend = async () => {
    if (!user) return;
    setLoading(true);
    setRecommendations([]);

    // Determine active skills list
    let userSkills = [];
    if (manualSkillsInput.trim()) {
      userSkills = manualSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    } else if (parsedResume?.skills_found) {
      userSkills = parsedResume.skills_found;
    } else if (parsedResume?.skills) {
      userSkills = parsedResume.skills;
    }

    try {
      const res = await api.post('/jobs/recommend', {
        user_id: user.id,
        user_skills: userSkills,
        preferred_role: preferredRole,
        preferred_functional_area: preferredFunctionalArea,
        preferred_industry: preferredIndustry,
        preferred_company: preferredCompany,
        preferred_location: preferredLocation,
        max_distance: maxDistance,
        work_from_home: workFromHome,
        top_n: topN
      });

      if (res.data.success) {
        setRecommendations(res.data.recommendations);
        fetchLatestSaved();
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      alert(err.response?.data?.detail || 'Internship matching failed. Verify if models/intern/internship.csv exists.');
    } finally {
      setLoading(false);
    }
  };

  const detectedRole = parsedResume?.category || '';
  const parsedSkills = parsedResume?.skills_found || parsedResume?.skills || [];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">🎯 AI Internship Recommendation</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Obtain customized internship offers matching your skills using cosine-similarity feature matching.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-4">
        {parsedResume ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              <span className="font-bold text-slate-800">Detected Resume Category:</span> {detectedRole}
            </p>
            <p className="text-sm font-semibold text-slate-700">
              <span className="font-bold text-slate-800">Skills Found in Resume ({parsedSkills.length}):</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {parsedSkills.slice(0, 15).map(s => (
                <span key={s} className="bg-primary-light text-primary text-[10px] font-bold px-2 py-1 rounded-lg border border-primary/5 capitalize">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-bold text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>No resume analyzed yet. Add your skills manually below or upload a resume first.</span>
            </p>
          </div>
        )}

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enter skills manually (comma separated)</label>
          <input
            type="text"
            value={manualSkillsInput}
            onChange={(e) => setManualSkillsInput(e.target.value)}
            placeholder="e.g. python, sql, communication, teamwork"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Configurator */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-card shadow-sm space-y-4 lg:col-span-1 h-fit">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Search Filters</span>
          </h3>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Role</label>
              <select
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all cursor-pointer font-medium text-slate-700"
              >
                <option value="">All Roles (Any)</option>
                <option value="Business Development">Business Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Social Media Marketing">Social Media Marketing</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Human Resources (HR)">Human Resources (HR)</option>
                <option value="Content Writing">Content Writing</option>
                <option value="Marketing">Marketing</option>
                <option value="Video Making/Editing">Video Making/Editing</option>
                <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Law/Legal">Law/Legal</option>
                <option value="Telecalling">Telecalling</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Functional Area</label>
              <select
                value={preferredFunctionalArea}
                onChange={(e) => setPreferredFunctionalArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all cursor-pointer font-medium text-slate-700"
              >
                <option value="">All Functional Areas (Any)</option>
                <option value="information technology">IT / Software</option>
                <option value="operations management">Operations</option>
                <option value="finance & accounting">Finance & Accounting</option>
                <option value="sales & marketing">Sales & Marketing</option>
                <option value="human resources">Human Resources</option>
                <option value="customer care / service">Customer Care / Service</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Company</label>
              <select
                value={preferredCompany}
                onChange={(e) => setPreferredCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all cursor-pointer font-medium text-slate-700"
              >
                <option value="">All Companies (Any)</option>
                <option value="Top Talent Bridge">Top Talent Bridge</option>
                <option value="Stirring Minds">Stirring Minds</option>
                <option value="HappiMynd">HappiMynd</option>
                <option value="Pawzz">Pawzz</option>
                <option value="Narigiri's Connect To Universe Private Limited">Narigiri's Connect</option>
                <option value="Blackcoffer">Blackcoffer</option>
                <option value="Pereyan LLP">Pereyan LLP</option>
                <option value="Across The Globe (ATG)">Across The Globe (ATG)</option>
                <option value="Avaari">Avaari</option>
                <option value="QA Solvers">QA Solvers</option>
                <option value="Eduminatti">Eduminatti</option>
                <option value="Buddha Education Association Incorporation">Buddha Education</option>
                <option value="HaZZten">HaZZten</option>
                <option value="Edugenskill">Edugenskill</option>
                <option value="Qriocity Ventures Private Limited">Qriocity Ventures</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Industry</label>
              <select
                value={preferredIndustry}
                onChange={(e) => setPreferredIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all cursor-pointer font-medium text-slate-700"
              >
                <option value="">All Industries (Any)</option>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing / Advertising</option>
                <option value="Finance">Finance / Banking</option>
                <option value="Education">Education / EdTech</option>
                <option value="Non-Profit">Non-Profit / NGO</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Location</label>
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all cursor-pointer font-medium text-slate-700"
              >
                <option value="">All Locations (Any)</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Noida">Noida</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Indore">Indore</option>
                <option value="Navi Mumbai">Navi Mumbai</option>
                <option value="Thane">Thane</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Max Distance</span>
                <span>{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="600"
                step="10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="wfh"
                checked={workFromHome}
                onChange={(e) => setWorkFromHome(e.target.checked)}
                className="w-3.5 h-3.5 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <label htmlFor="wfh" className="text-xs text-slate-500 font-bold cursor-pointer select-none">
                Only WFH Opportunities
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Recommendations count</span>
                <span>{topN}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <button
              onClick={handleRecommend}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-2.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all text-xs flex justify-center items-center gap-1.5"
            >
              {loading ? 'Matching...' : '🔍 Recommend Internships'}
            </button>
          </div>
        </div>

        {/* Recommendations list */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <span className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
              <p className="text-xs text-slate-400 font-semibold">Finding the best internships for you...</p>
            </div>
          )}

          {!loading && recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {recommendations.map((job, idx) => (
                <JobCard key={idx} {...job} />
              ))}
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <>
              {latestSaved.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Saved Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestSaved.map((job, idx) => (
                      <JobCard key={idx} {...job} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-card p-16 text-center flex flex-col items-center justify-center space-y-4">
                  <Target className="w-12 h-12 text-slate-300" />
                  <h3 className="text-base font-bold text-slate-700">No Recommendations Found</h3>
                  <p className="text-xs text-slate-400 font-semibold max-w-xs">
                    Choose search options on the left and click 'Recommend Internships' to trigger cosine calculations.
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

export default InternshipRecommendation;
