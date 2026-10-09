import React from 'react';
import { 
  ShieldCheck, MapPin, 
  Search, Pill, Stethoscope, ArrowRight, Activity
} from 'lucide-react';
import { CityName } from '../types';

interface HeroSectionProps {
  currentCity: CityName;
  onNavigateTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onRequestGps: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentCity,
  onNavigateTab,
  onOpenEmergency,
  onRequestGps,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200 overflow-hidden py-10 lg:py-14">
      {/* Background Subtle Medical Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Headline & Context */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Regional Coverage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700">
                Active Region: <strong className="text-sky-700">{currentCity}, Andhra Pradesh</strong>
              </span>
              <span className="text-[11px] text-slate-700 font-medium hidden sm:inline">
                (Kurnool • Nandyal • Anantapur)
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              The Right Care, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-800">
                Closer to You.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Find nearby genuine hospitals, connect with verified doctors, compare medicine prices at Jan Aushadhi Kendras, and access trusted multilingual health guidance in Telugu, Hindi, English, Kannada, and Tamil.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onRequestGps}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg transition flex items-center gap-2 group"
              >
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Find Nearby Care (GPS)</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </button>

              <button
                onClick={onOpenEmergency}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-red-600/20 transition flex items-center gap-2 active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span>Emergency Help (112 / 108)</span>
              </button>

              <button
                onClick={() => onNavigateTab('doctors')}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm px-4 py-3 rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <span>Find a Doctor</span>
              </button>

              <button
                onClick={() => onNavigateTab('medicines')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-sm px-4 py-3 rounded-xl transition flex items-center gap-2"
              >
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Compare Medicine Prices</span>
              </button>
            </div>

            {/* Truth & Verification Guarantee */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Government & Private Facilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Fabricated Data Policy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Real-Time Bed Status Verification Notice</span>
              </div>
            </div>
          </div>

          {/* Quick Access Visual Cards (Right Column) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {/* Card 1: 24/7 Emergency */}
            <div 
              onClick={onOpenEmergency}
              className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition cursor-pointer group bg-gradient-to-br from-white to-red-50/40"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition">
                Emergency & Trauma
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                One-touch 112 & 108 dispatch, nearest ICU departments.
              </p>
              <span className="text-[11px] font-semibold text-red-600 mt-2 inline-flex items-center gap-1">
                Immediate Access →
              </span>
            </div>

            {/* Card 2: Affordable Medicines */}
            <div 
              onClick={() => onNavigateTab('medicines')}
              className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition cursor-pointer group bg-gradient-to-br from-white to-emerald-50/40"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Jan Aushadhi Savings
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Compare brand vs generic costs. Save up to 80% on prescriptions.
              </p>
              <span className="text-[11px] font-semibold text-emerald-700 mt-2 inline-flex items-center gap-1">
                Calculate Savings →
              </span>
            </div>

            {/* Card 3: 5-Language Chatbot */}
            <div 
              onClick={() => onNavigateTab('chatbot')}
              className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition cursor-pointer group bg-gradient-to-br from-white to-sky-50/40"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">
                Multilingual AI Triage
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Symptom check in Telugu, Hindi, Kannada, Tamil, or English.
              </p>
              <span className="text-[11px] font-semibold text-sky-700 mt-2 inline-flex items-center gap-1">
                Start Health Chat →
              </span>
            </div>

            {/* Card 4: Smart Hospital Triage Queue */}
            <div 
              onClick={() => onNavigateTab('queue')}
              className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition cursor-pointer group bg-gradient-to-br from-white to-amber-50/40"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">
                Hospital Staff Queue
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Clinical triage demonstration, urgency levels & wait times.
              </p>
              <span className="text-[11px] font-semibold text-amber-800 mt-2 inline-flex items-center gap-1">
                View Staff Demo →
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
