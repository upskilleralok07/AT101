import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { User, Mail, Sparkles, BookOpen, Link2, Save, FileCheck } from 'lucide-react';

const Profile = () => {
  const { user, profile, updateProfile, fetchProfile } = useAuth();
  
  // Profile settings state
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [newCertificate, setNewCertificate] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [newAchievement, setNewAchievement] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setSkills(profile.skills || '');
      setCertificates(profile.certificates || []);
      setAchievements(profile.achievements || []);
      setGithub(profile.social_links?.github || '');
      setLinkedin(profile.social_links?.linkedin || '');
      setPortfolio(profile.social_links?.portfolio || '');
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const res = await updateProfile({
      bio,
      skills,
      certificates,
      achievements,
      social_links: { github, linkedin, portfolio }
    });

    setLoading(false);
    if (res.success) {
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setError(res.error);
    }
  };

  const addCertificate = () => {
    if (newCertificate.trim()) {
      setCertificates([...certificates, newCertificate.trim()]);
      setNewCertificate('');
    }
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, idx) => idx !== index));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Your Profile & Settings</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Customize your candidate profile to improve the relevance of matching internship recommendations.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold p-4 rounded-xl">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold p-4 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm flex flex-col items-center justify-center text-center space-y-4 md:col-span-1">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-extrabold text-3xl uppercase shadow-inner">
            {user?.name ? user.name.slice(0, 2) : 'U'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{user?.email}</p>
          </div>
          <span className="text-[10px] text-primary font-bold bg-primary-light rounded px-2.5 py-1">
            Standard Account
          </span>
        </div>

        {/* Right Side: Details Forms */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-6 md:col-span-2">
          {/* Bio section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio Description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell hiring managers about yourself (e.g. passionate full stack developer...)"
              className="w-full h-24 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-primary/50 transition-all resize-none"
            ></textarea>
          </div>

          {/* Skills (comma separated input) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills (Comma Separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. python, react, sql, docker"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50 focus:bg-white transition-all"
            />
          </div>

          {/* Certificates list config */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Certificates</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCertificate}
                onChange={(e) => setNewCertificate(e.target.value)}
                placeholder="e.g. AWS Certified Developer"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary/50 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={addCertificate}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 rounded-xl shadow transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {certificates.map((cert, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                  <span>{cert}</span>
                  <button type="button" onClick={() => removeCertificate(idx)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Achievements config */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Achievements</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="e.g. 1st Place in Hackathon"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary/50 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 rounded-xl shadow transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((ach, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                  <span>{ach}</span>
                  <button type="button" onClick={() => removeAchievement(idx)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Social links inputs */}
          <div className="space-y-3.5 border-t border-slate-100 pt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Link2 className="w-4 h-4 text-slate-400" />
              <span>Social Links</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GitHub Username</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="e.g. githubprofile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="e.g. linkedin.com/in/username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portfolio Website</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="e.g. https://portfolio.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Updating...' : 'Save Profile details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
