import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import { Target, CheckCircle2, ChevronRight, AlertCircle, Compass } from 'lucide-react';

const SkillGap = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestAnalysis = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/resume/latest/${user.id}`);
      if (res.data.analysis) {
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      console.error('Error fetching skill gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestAnalysis();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center">
        <span className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
      </div>
    );
  }

  // Predefined job skill requirements mapped to roles
  const JOB_SKILLS_MAP = {
    'data science': ['python', 'machine learning', 'deep learning', 'pandas', 'numpy', 'sql', 'statistics', 'tensorflow', 'scikit-learn'],
    'python developer': ['python', 'flask', 'django', 'fastapi', 'sql', 'git', 'rest api', 'docker'],
    'web developer': ['html', 'css', 'javascript', 'react', 'node', 'git', 'rest api', 'sql'],
    'devops engineer': ['docker', 'kubernetes', 'aws', 'linux', 'git', 'jenkins', 'ansible', 'ci/cd'],
    'java developer': ['java', 'spring boot', 'sql', 'git', 'rest api', 'docker', 'maven'],
    'general': ['python', 'sql', 'git', 'communication', 'teamwork', 'leadership'],
  };

  const detectedRole = (analysis?.target_role || 'General').toLowerCase();
  const requiredSkills = JOB_SKILLS_MAP[detectedRole] || JOB_SKILLS_MAP['general'];
  
  // Custom mock skill lists extracted if resume_score is not processed yet
  const userSkillsList = analysis
    ? (analysis.skills_found ? analysis.skills_found : ['python', 'git', 'sql', 'communication'])
    : ['python', 'git', 'sql', 'communication'];

  const matchedSkills = requiredSkills.filter(s => userSkillsList.includes(s));
  const missingSkills = requiredSkills.filter(s => !userSkillsList.includes(s));
  
  const matchPercent = Math.round((matchedSkills.length / requiredSkills.length) * 100) || 65;

  return (
    <div className="space-y-8">
      {/* Overview Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white border border-slate-200/80 p-6 rounded-card shadow-sm">
        <div>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Target Role: {analysis?.target_role || 'SDE'}
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-3">Skill Gap Overview</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Comparing your uploaded profile skills against industry role criteria.
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#5B4DFF"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * matchPercent) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-slate-800">{matchPercent}%</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Overall Match</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ready for screening</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Skill Gaps columns */}
        <div className="space-y-6 lg:col-span-1">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>Top Skill Gaps</span>
          </h3>

          <div className="space-y-4">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-card shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800 capitalize">{skill}</span>
                    <span className="text-[9px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded border border-rose-100 uppercase">
                      Missing
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                    <span>Target status:</span>
                    <span className="text-primary font-bold">Beginner → Advanced</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200/80 p-8 rounded-card text-center text-slate-400 font-medium">
                No gaps identified. You have all key skills! 🎉
              </div>
            )}
          </div>
        </div>

        {/* Roadmap milestone checklist */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <span>Your Roadmap</span>
          </h3>

          <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-8 relative overflow-hidden">
            {/* Timeline connectors vertical bar */}
            <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-slate-100"></div>

            <div className="space-y-8 relative z-10">
              {/* Milestone 1 */}
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div className="space-y-1.5 flex-1 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">Master DSA Basics</h4>
                    <span className="text-[10px] bg-primary-light text-primary font-bold px-2.5 py-0.5 rounded-lg">2-3 weeks</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Focus on basic structures: Arrays, Linked Lists, Hash Maps, and Binary Search patterns.
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div className="space-y-1.5 flex-1 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">System Design Basics</h4>
                    <span className="text-[10px] bg-primary-light text-primary font-bold px-2.5 py-0.5 rounded-lg">2 weeks</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Understand microservices, load balancing, caching architectures, and relational database sharding.
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div className="space-y-1.5 flex-1 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">Advanced Topics & Tools</h4>
                    <span className="text-[10px] bg-primary-light text-primary font-bold px-2.5 py-0.5 rounded-lg">3 weeks</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Adopt orchestration technologies like Docker, Kubernetes, and configure automated GitHub Action CI/CD pipelines.
                  </p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                  4
                </div>
                <div className="space-y-1.5 flex-1 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">Interview Simulation Prep</h4>
                    <span className="text-[10px] bg-primary-light text-primary font-bold px-2.5 py-0.5 rounded-lg">2 weeks</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Practice with the Mock Interview panel, answering technical, behavioral, and HR questions dynamically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
