import React from 'react';
import { useAuth } from '../services/auth';
import { Briefcase, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const JobMatchScore = () => {
  const { parsedResume } = useAuth();

  const JOB_ROLES = {
    "Data Scientist": [
      "python", "machine learning", "deep learning", "pandas",
      "numpy", "sql", "tensorflow", "scikit-learn", "statistics"
    ],
    "Python Developer": [
      "python", "flask", "django", "fastapi", "sql",
      "git", "rest api", "docker"
    ],
    "Web Developer": [
      "html", "css", "javascript", "react", "node",
      "git", "rest api", "sql"
    ],
    "DevOps Engineer": [
      "docker", "kubernetes", "aws", "linux", "git",
      "jenkins", "ansible", "ci/cd"
    ],
    "Data Engineer": [
      "python", "sql", "spark", "hadoop", "kafka",
      "airflow", "etl", "aws"
    ],
    "Java Developer": [
      "java", "spring boot", "sql", "git",
      "rest api", "docker", "maven"
    ],
  };

  if (!parsedResume) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-card p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h3 className="text-base font-bold text-slate-700 font-sans">No Resume Scans Registered</h3>
        <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
          ⚠️ Please analyze your resume first in the Resume Analyzer page before viewing job matches!
        </p>
      </div>
    );
  }

  // Get active skills list from shared parsedResume
  const userSkillsSet = new Set(parsedResume.skills_found || parsedResume.skills || []);

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Job Match Score</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Evaluate how well your resume matches predefined job categories.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(JOB_ROLES).map(([role, requiredSkills]) => {
          const requiredSet = new Set(requiredSkills);
          const matched = requiredSkills.filter(s => userSkillsSet.has(s));
          const missing = requiredSkills.filter(s => !userSkillsSet.has(s));
          
          const score = Math.round((matched.length / requiredSkills.length) * 100);
          
          const scoreColor = score >= 70 ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : score >= 40 ? 'text-amber-600 border-amber-100 bg-amber-50' : 'text-rose-600 border-rose-100 bg-rose-50';
          const progressColor = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500';

          return (
            <div key={role} className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/15 text-primary border border-primary/20 rounded-xl">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">{role}</h3>
                </div>
                <div className={`px-4 py-1.5 rounded-xl border text-xs font-bold ${scoreColor}`}>
                  {score}% Match
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${score}%` }}></div>
              </div>

              {/* Lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Matched Skills ({matched.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matched.length > 0 ? (
                      matched.map(s => (
                        <span key={s} className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-100 capitalize">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">None matched</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>Missing Skills ({missing.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.length > 0 ? (
                      missing.map(s => (
                        <span key={s} className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-100 capitalize">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold">Perfect match! 🎉</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobMatchScore;
