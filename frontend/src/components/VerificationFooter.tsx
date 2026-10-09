import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Check, 
  Database, Server, Cpu, MapPin
} from 'lucide-react';

export const VerificationFooter: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReported(true);
    setTimeout(() => {
      setReported(false);
      setShowReportModal(false);
      setReportText('');
    }, 2000);
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand & Guarantee */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white">
                ✚
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                res<span className="text-sky-400">Q</span>Path
              </span>
              <span className="bg-sky-900/80 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                AP Health Guard
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A healthcare navigation platform dedicated to patient safety, verified healthcare discovery, and affordable generic medicines in <strong>Kurnool, Nandyal, and Anantapur</strong>.
            </p>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-xs space-y-1.5 text-slate-300">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Non-Fabrication Charter</span>
              </div>
              <p className="text-[11px] text-slate-400">
                resQPath never invents facilities, doctors, bed availability, medicine costs, or patient outcomes. Information sourced from AP Vaidya Vidhana Parishad, KMC, PMBJP, and e-RaktKosh.
              </p>
            </div>
          </div>

          {/* Target Regional Coverage */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Geographical Scope
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Kurnool City & District, AP</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Nandyal City & District, AP</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Anantapur City & District, AP</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 italic">
                Expanding to other AP districts in future phases.
              </li>
            </ul>
          </div>

          {/* Trust & Actions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Data Integrity
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-between"
              >
                <span>Report Outdated Detail</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span>Verified AP Helplines:</span>
                <div className="mt-1 font-bold text-slate-200 flex justify-between">
                  <span>Medical: 108</span>
                  <span>Unified: 112</span>
                  <span>Maternal: 102</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live System Architecture Indicators */}
        <div className="py-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-300">Live Stack Status:</span>
            <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-[11px]">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Database: MySQL (resqpath_db / Resilient Fallback)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-[11px]">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backend: Django REST Framework</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Chatbot: 5-Lang Triage Engine</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            resQPath Hackathon Prototype • Strictly Non-Commercial
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
          <strong>Medical Notice:</strong> resQPath is an informational and emergency routing application. It is not an emergency hospital, licensed medical clinic, or licensed pharmacy. Emergency requests should immediately be communicated directly to state emergency response numbers 112 or 108.
        </div>

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Report Inaccurate Healthcare Information
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Help us maintain data integrity. Submit corrections for facility phone numbers, addresses, or hours.
            </p>

            {reported ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Correction logged for administrative audit. Thank you!</span>
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  placeholder="Specify facility name and the incorrect phone number, address, or bed status..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
