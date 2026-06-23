import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Mic, Lightbulb, Compass, Award, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Resume Analyzer',
      description: 'Paste your resume text or upload a PDF to obtain an instant placement score and skill breakdown.',
      icon: FileText,
      path: '/resume',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Job Match Score',
      description: 'Compare your resume skills against predefined industry roles to evaluate alignment metrics.',
      icon: Briefcase,
      path: '/match-score',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Mock Interview',
      description: 'Practice mock interview sessions with AI questions, recording options, and real-time grading reports.',
      icon: Mic,
      path: '/interviews',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'AI Suggestions',
      description: 'Obtain customized profile improvements from career experts powered by Groq LLM analytics.',
      icon: Lightbulb,
      path: '/suggestions',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto text-center py-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          🚀 Welcome to PlacePilot AI
        </h1>
        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Analyze your resume, match job roles, practice mock interview scenarios, and view recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {features.map((feat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(feat.path)}
            className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center cursor-pointer group space-y-4"
          >
            <div className={`p-4 rounded-2xl border ${feat.color} group-hover:scale-105 transition-all`}>
              <feat.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-primary transition-all">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upskill Now CTA Banner Card */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto mt-8 text-left">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span>Boost Your Job Readiness with UpSkiller!</span>
          </h2>
          <p className="text-sm text-white/80 font-medium max-w-2xl">
            Access personalized skill courses, coding roadmaps, and career development programs designed to get you hired.
          </p>
        </div>
        <a
          href="https://upskillerai.lovable.app/upskiller"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white text-orange-600 font-extrabold rounded-xl shadow hover:bg-orange-50 transition-all text-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Upskill Now</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-12 max-w-lg mx-auto text-xs font-semibold text-primary">
        👈 Navigate using the sidebar to analyze your profile and start practicing.
      </div>
    </div>
  );
};

export default Home;
