import React from 'react';
import { MapPin, Building2, Briefcase, HelpCircle } from 'lucide-react';

const JobCard = ({ company_name, internship_role, functional_area, industry, location, distance_km, recommendation_score, explanation }) => {
  
  // Format percentage display
  const matchPercent = Math.min(Math.round(recommendation_score * 100), 100);
  
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight capitalize">
              {company_name ? company_name.replace(/_/g, ' ') : 'N/A'}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
              <Building2 className="w-3.5 h-3.5" />
              <span className="capitalize">{industry || 'Technology'}</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getScoreColor(matchPercent)} flex items-center gap-1`}>
            <span>{matchPercent}% Fit</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold capitalize">Role: {internship_role}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="capitalize">{location || 'Remote'}</span>
            {distance_km > 0 && (
              <span className="text-xs text-slate-400 font-medium">({distance_km.toFixed(1)} km away)</span>
            )}
          </div>
        </div>

        {explanation && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                <span className="font-semibold text-slate-700">Why matches: </span>
                {explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium capitalize">Area: {functional_area || 'General'}</span>
        <button
          onClick={() => alert('Application submitted! (Mock)')}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
