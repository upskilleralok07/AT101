import React, { useState } from 'react';
import { BookOpen, Trophy, Clock, Milestone } from 'lucide-react';

const Learning = () => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'DSA', 'Web Development', 'System Design', 'Aptitude'];

  const courses = [
    {
      title: 'Data Structures & Algorithms',
      category: 'DSA',
      modules: 50,
      tasks: 30,
      metric: '30 tasks completed',
      progress: 60,
      duration: '3-4 weeks',
      color: 'bg-blue-600',
    },
    {
      title: 'System Design Basics',
      category: 'System Design',
      modules: 25,
      tasks: 12,
      metric: '56% progress completed',
      progress: 56,
      duration: '2 weeks',
      color: 'bg-sky-500',
    },
    {
      title: 'Database (SQL) Core',
      category: 'System Design',
      modules: 20,
      tasks: 8,
      metric: '3 weeks length',
      progress: 40,
      duration: '3 weeks',
      color: 'bg-indigo-600',
    },
    {
      title: 'OOPs in Java',
      category: 'DSA',
      modules: 30,
      tasks: 15,
      metric: '2 weeks duration',
      progress: 50,
      duration: '2 weeks',
      color: 'bg-orange-500',
    },
    {
      title: 'REST API & Microservices',
      category: 'Web Development',
      modules: 15,
      tasks: 6,
      metric: '1 week duration',
      progress: 0,
      duration: '1 week',
      color: 'bg-emerald-600',
    },
  ];

  const filteredCourses = activeTab === 'All'
    ? courses
    : courses.filter(c => c.category === activeTab);

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Learning Modules</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Explore course plans targeted to resolve your matching profile deficiencies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              activeTab === cat
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((c, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-xl text-white ${c.color} shrink-0`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight">{c.title}</h3>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-100 rounded px-2 py-0.5 mt-1.5 inline-block uppercase">
                    {c.category}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>{c.metric}</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} transition-all`} style={{ width: `${c.progress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{c.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Milestone className="w-3.5 h-3.5" />
                  <span>{c.modules} Modules</span>
                </div>
              </div>
              <button
                onClick={() => alert('Launching module console! (Mock)')}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md shadow-primary/20 transition-all"
              >
                {c.progress > 0 ? 'Continue' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
