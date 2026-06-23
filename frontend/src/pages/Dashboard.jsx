import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import {
  FileText,
  Mic,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/${user.id}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Construct chart data from past results
  const getChartData = () => {
    if (!data?.recent_activity || data.recent_activity.length === 0) {
      // Default placeholder timeline data matching mockup
      return [
        { date: '12 May', Score: 60 },
        { date: '18 May', Score: 68 },
        { date: '25 May', Score: 72 },
        { date: '02 Jun', Score: 75 },
        { date: '09 Jun', Score: 78 },
      ];
    }

    // Map backwards so it goes chronological
    return [...data.recent_activity]
      .reverse()
      .map((item) => {
        const dateStr = item.created_at
          ? new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
          : '—';
        return {
          date: dateStr,
          Score: item.resume_score || (item.interview_score ? item.interview_score * 10 : 60),
        };
      })
      .slice(-6); // last 6 items
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
          <p className="text-sm text-slate-400 font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    resume_score: 0,
    interview_score: 'N/A',
    target_role: 'General',
    missing_skills_count: 0,
    interviews_completed: 0,
    resumes_scanned: 0,
  };

  const readinessScore = metrics.resume_score
    ? Math.round((metrics.resume_score + (metrics.interview_score !== 'N/A' ? metrics.interview_score * 10 : metrics.resume_score)) / 2)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Greeting panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome back, {user?.name || 'Alok'}! 👋</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Let's check your candidate score and resume matches today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh stats</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Placement Readiness"
          value={readinessScore > 0 ? `${readinessScore}%` : 'N/A'}
          subtext={readinessScore >= 70 ? 'Excellent progress! Keep it up!' : 'Needs skill scaling'}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Latest Resume Score"
          value={metrics.resume_score > 0 ? `${metrics.resume_score}%` : 'N/A'}
          subtext={`Identified target: ${metrics.target_role}`}
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Mock Interviews"
          value={metrics.interviews_completed > 0 ? `${metrics.interviews_completed} attempts` : '0'}
          subtext={metrics.interview_score !== 'N/A' ? `Last score: ${metrics.interview_score}/10` : 'No submissions yet'}
          icon={Mic}
          color="purple"
        />
        <MetricCard
          title="Missing key skills"
          value={metrics.missing_skills_count > 0 ? `${metrics.missing_skills_count}` : '0'}
          subtext="Recommended additions"
          icon={BrainCircuit}
          color="rose"
        />
      </div>

      {/* Analytics Graph & Quick recommendations layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness History Graph */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Score Progress</h3>
              <p className="text-xs text-slate-400 font-semibold">Your rating trajectory over recent scans</p>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1 font-bold">Chronological</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B4DFF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#5B4DFF" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Score" stroke="#5B4DFF" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable recommendations panel */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-slate-800">Recommendations</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-slate-100/50 transition-all border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">DSA Practice</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Solve arrays & hash maps</p>
                </div>
                <button onClick={() => window.location.hash = '#/learn'} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-slate-100/50 transition-all border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">System Design Basics</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Learn horizontal vs vertical scaling</p>
                </div>
                <button onClick={() => window.location.hash = '#/learn'} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-slate-100/50 transition-all border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">OOPs in Java</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Polymorphism & interface classes</p>
                </div>
                <button onClick={() => window.location.hash = '#/learn'} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mt-4 text-center">
            <p className="text-xs text-amber-800 font-bold">Ready to boost your placement score?</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Learn advanced industry skills on UpSkiller.</p>
            <a
              href="https://upskillerai.lovable.app/upskiller"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 border border-amber-200 font-extrabold text-xs shadow-sm transition-all duration-200"
            >
              <span>Upskill Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-4 text-center">
            <p className="text-xs text-primary font-bold">Need a fresh score?</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Re-evaluate by uploading an updated PDF.</p>
          </div>
        </div>
      </div>

      {/* Recent Activity history list */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
        <div className="divide-y divide-slate-100 overflow-hidden">
          {data?.recent_activity && data.recent_activity.length > 0 ? (
            data.recent_activity.map((row, idx) => {
              const dateStr = row.created_at
                ? new Date(row.created_at).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                : '—';
              return (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/40"></span>
                    <span className="font-semibold text-slate-700">
                      {row.resume_score !== null
                        ? `Resume scanned with score: ${Math.round(row.resume_score)}%`
                        : `Mock Interview finished with score: ${row.interview_score}/10`}
                    </span>
                    <span className="text-[10px] bg-slate-100 rounded px-2 py-0.5 text-slate-500 font-bold capitalize">
                      Role: {row.target_role || 'General'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{dateStr}</span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 font-medium">
              No attempts logged yet. Start by going to the Resume Analyzer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
