import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 md:px-12 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-xl text-white">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">UpSkiller</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary transition-all">
            Login
          </Link>
          <Link
            to="/login?signup=true"
            className="bg-primary hover:bg-primary-hover text-white text-sm font-bold py-2 px-5 rounded-xl shadow-md shadow-primary/25 hover:shadow-primary/35 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <span className="bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full inline-block uppercase tracking-wider">
            🚀 Powered by Groq AI
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-3xl">
            Your <span className="text-primary">Placement Journey</span> Starts Here
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Upload your resume to get instant ATS scores, identify skill gaps, master step-by-step roadmaps, and practice with real-time AI mock interviews.
          </p>
        </div>

        {/* Call To Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-2xl border border-slate-200 shadow-sm transition-all"
          >
            Explore Features
          </a>
        </div>

        {/* Value Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full border-t border-slate-200/80 pt-16 mt-8">
          <div className="space-y-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-4xl font-extrabold text-primary tracking-tight">10K+</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Students</p>
          </div>
          <div className="space-y-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-4xl font-extrabold text-primary tracking-tight">500+</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Hiring Partners</p>
          </div>
          <div className="space-y-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-4xl font-extrabold text-primary tracking-tight">95%</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Placement Rate</p>
          </div>
        </div>

        {/* Features Preview */}
        <section id="features" className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-left">
          <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-4">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Smart Resume Scans</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Scan your PDF resume dynamically against key ML pipelines to estimate placement probabilities.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-4">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">AI Mock Interviews</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Engage with custom technical mock interview workflows and obtain immediate ratings and solutions.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-4">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
              <Rocket className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Internship Matcher</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Match skills against internship databases to receive personalized recommendations automatically.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/85 py-6 text-center text-xs text-slate-400 font-medium mt-16">
        <p>© 2026 UpSkiller PlacePilot. Built for career readiness and placement automation.</p>
      </footer>
    </div>
  );
};

export default Landing;
