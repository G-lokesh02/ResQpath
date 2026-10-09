import React from 'react';
import { Phone, ShieldAlert, MapPin, CheckCircle2 } from 'lucide-react';
import { AmbulanceProvider, CityName } from '../types';

interface AmbulanceDirectoryProps {
  ambulances: AmbulanceProvider[];
  currentCity: CityName;
  onCallNumber: (phone: string) => void;
}

export const AmbulanceDirectory: React.FC<AmbulanceDirectoryProps> = ({
  ambulances,
  currentCity,
  onCallNumber,
}) => {
  const cityAmbulances = ambulances.filter(
    (a) => a.city.toLowerCase() === currentCity.toLowerCase()
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          Official Emergency Ambulances
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verified Ambulance Fleet in {currentCity}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Government free 108 emergency units, maternal ambulances (102), and hospital Advanced Life Support (ALS) trauma transports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cityAmbulances.map((amb) => (
          <div
            key={amb.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  amb.service_type === 'GOVT_FREE'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-sky-50 text-sky-700 border border-sky-200'
                }`}>
                  {amb.service_type === 'GOVT_FREE' ? 'Free Government Service' : 'Advanced Life Support (ALS)'}
                </span>

                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>24/7 Active</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">
                {amb.name}
              </h3>

              <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Coverage: {amb.coverage_area}</span>
              </p>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                "{amb.notes}"
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => onCallNumber(amb.contact_phone)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Dispatch: {amb.contact_phone}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
