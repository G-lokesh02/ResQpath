import React, { useState } from 'react';
import { Pill, Phone, MapPin, Clock, Search, Filter, CheckCircle2 } from 'lucide-react';
import { Pharmacy, CityName } from '../types';

interface PharmaciesDirectoryProps {
  pharmacies: Pharmacy[];
  currentCity: CityName;
  onCallNumber: (phone: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const PharmaciesDirectory: React.FC<PharmaciesDirectoryProps> = ({
  pharmacies,
  currentCity,
  onCallNumber,
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const cityPharmacies = pharmacies.filter(
    (p) => p.city.toLowerCase() === currentCity.toLowerCase()
  );

  const filtered = cityPharmacies.filter((p) => {
    if (filterType !== 'ALL' && p.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Pill className="w-3.5 h-3.5" />
            Medical Shops & Jan Aushadhi Kendras
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pharmacies & Medicine Stores in {currentCity}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Official PMBJP Pradhan Mantri Jan Aushadhi Kendras, 24/7 retail pharmacies, and local medical shops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('medicines')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            💰 Compare Jan Aushadhi Prices →
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {[
            { id: 'ALL', label: 'All Stores' },
            { id: 'JAN_AUSHADHI', label: '💊 Jan Aushadhi (Govt)' },
            { id: 'RETAIL_CHAIN', label: '🏪 Retail 24/7 (Apollo/MedPlus)' },
            { id: 'COMMUNITY_PHARMACY', label: '🏥 Local Stores' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                filterType === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search store name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Pharmacies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pharm) => (
          <div
            key={pharm.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  pharm.type === 'JAN_AUSHADHI'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {pharm.type.replace('_', ' ')}
                </span>

                {pharm.home_delivery && (
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                    Delivery Available
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">
                {pharm.name}
              </h3>

              <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{pharm.address}</span>
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{pharm.operating_hours}</span>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                "{pharm.stock_disclaimer}"
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onCallNumber(pharm.contact_phone)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store: {pharm.contact_phone}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
