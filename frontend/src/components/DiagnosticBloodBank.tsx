import React, { useState } from 'react';
import { 
  Droplet, Microscope, Phone, ExternalLink, 
  MapPin, ShieldCheck, Clock, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Facility, CityName } from '../types';

interface DiagnosticBloodBankProps {
  facilities: Facility[];
  currentCity: CityName;
  onCallNumber: (phone: string) => void;
}

export const DiagnosticBloodBank: React.FC<DiagnosticBloodBankProps> = ({
  facilities,
  currentCity,
  onCallNumber,
}) => {
  const [activeTab, setActiveTab] = useState<'BLOOD' | 'DIAGNOSTIC'>('BLOOD');

  const bloodBanks = facilities.filter(
    (f) => f.city.toLowerCase() === currentCity.toLowerCase() && f.category === 'BLOOD_BANK'
  );

  const diagnostics = facilities.filter(
    (f) => f.city.toLowerCase() === currentCity.toLowerCase() && f.category === 'DIAGNOSTIC_CENTRE'
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Droplet className="w-3.5 h-3.5" />
            Specialized Critical Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Blood Banks & Diagnostic Laboratories in {currentCity}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Registered blood component units and NABL-accredited diagnostic imaging centres in Andhra Pradesh.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('BLOOD')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'BLOOD'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-rose-600" />
            <span>Blood Banks ({bloodBanks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DIAGNOSTIC')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'DIAGNOSTIC'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Diagnostics ({diagnostics.length})</span>
          </button>
        </div>
      </div>

      {/* Blood Banks View */}
      {activeTab === 'BLOOD' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bloodBanks.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      Licensed State Blood Centre
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>24 Hours Issue</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {bank.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{bank.address}</span>
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-1">
                    {bank.specialties.map((spec, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        🩸 {spec}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{bank.bed_status_note}"
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onCallNumber(bank.contact_phone)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition flex-1 justify-center active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Blood Bank: {bank.contact_phone}</span>
                  </button>

                  <a
                    href="https://eraktkosh.in"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                  >
                    <span>e-RaktKosh</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-950">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>Blood Requisition Protocol:</strong> Blood units are issued against a valid registered physician prescription with patient cross-match sample. We never fabricate live inventory numbers. Call the blood bank directly to confirm stock and bring an eligible replacement donor if required.
            </div>
          </div>
        </div>
      )}

      {/* Diagnostics View */}
      {activeTab === 'DIAGNOSTIC' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {diagnostics.map((diag) => (
              <div
                key={diag.id}
                className="bg-white rounded-2xl border border-teal-100 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      NABL Diagnostic Center
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{diag.opening_hours}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {diag.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{diag.address}</span>
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-1">
                    {diag.specialties.map((spec, i) => (
                      <span key={i} className="text-[10px] bg-teal-50 text-teal-900 px-2 py-0.5 rounded font-medium">
                        🔬 {spec}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{diag.bed_status_note}"
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onCallNumber(diag.contact_phone)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition flex-1 justify-center active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Lab: {diag.contact_phone}</span>
                  </button>

                  {diag.booking_url ? (
                    <a
                      href={diag.booking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                    >
                      <span>Book Online</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
