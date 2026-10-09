import React, { useState } from 'react';
import { 
  Building2, Phone, MapPin, ExternalLink, 
  CheckCircle, AlertCircle, Clock, ShieldCheck, Filter, Search
} from 'lucide-react';
import { Facility, CityName } from '../types';

interface HospitalDirectoryProps {
  facilities: Facility[];
  currentCity: CityName;
  onCallNumber: (phone: string) => void;
}

export const HospitalDirectory: React.FC<HospitalDirectoryProps> = ({
  facilities,
  currentCity,
  onCallNumber,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const cityFacilities = facilities.filter(
    (f) => f.city.toLowerCase() === currentCity.toLowerCase()
  );

  const filtered = cityFacilities.filter((f) => {
    if (selectedCategory !== 'ALL' && f.category !== selectedCategory) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q) ||
        f.specialties.some(s => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Directory Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Verified Hospital Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospitals & Healthcare Facilities in {currentCity}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Genuine government, teaching, and private hospitals with verified emergency status. No fabricated listings.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital or specialty..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {[
          { id: 'ALL', label: 'All Facilities' },
          { id: 'TEACHING_HOSPITAL', label: 'Medical Colleges / Teaching' },
          { id: 'GOVERNMENT_HOSPITAL', label: 'Government Hospitals' },
          { id: 'PRIVATE_HOSPITAL', label: 'Private Multi-Specialty' },
          { id: 'DIAGNOSTIC_CENTRE', label: 'Diagnostics' },
          { id: 'BLOOD_BANK', label: 'Blood Banks' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((hospital) => {
          const isConfirmedAvailable = hospital.bed_status === 'CONFIRMED_AVAILABLE';
          const isAvailabilityUnconfirmed = hospital.bed_status === 'AVAILABILITY_NOT_CONFIRMED';

          return (
            <div
              key={hospital.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {hospital.category.replace('_', ' ')}
                  </span>

                  {/* Bed Availability Badge */}
                  {isConfirmedAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Beds Available</span>
                    </span>
                  ) : isAvailabilityUnconfirmed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Verify via Call</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      <span>Capacity Full</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition leading-snug">
                  {hospital.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1.5 line-clamp-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{hospital.address}</span>
                </p>

                {/* Specialties Tag Cloud */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 4).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                    {hospital.specialties.length > 4 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                        +{hospital.specialties.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Opening Hours & Beds count */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[140px]">{hospital.opening_hours}</span>
                  </div>
                  {hospital.total_beds > 0 && (
                    <span className="font-semibold text-slate-700">
                      {hospital.total_beds} Total Beds ({hospital.icu_beds} ICU)
                    </span>
                  )}
                </div>

                {/* Bed Status Notice */}
                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                  "{hospital.bed_status_note}"
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onCallNumber(hospital.contact_phone)}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 flex-1 justify-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {hospital.contact_phone}</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition shadow-2xs"
                  title="Open GPS Navigation"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No healthcare facilities matched your search in {currentCity}.</p>
        </div>
      )}

      {/* Truth in Healthcare Disclaimer */}
      <div className="mt-8 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-950">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong>Healthcare Verification Commitment:</strong> Every hospital listed above is a registered institution in Andhra Pradesh. Real-time ICU and emergency bed availability is subject to change at hospital admission triage. We advise family members to call the reception desk before or during patient transit.
        </div>
      </div>
    </section>
  );
};
