import React, { useState } from 'react';
import { 
  Stethoscope, Phone, Calendar, 
  ShieldCheck, Search, Filter
} from 'lucide-react';
import { Doctor, CityName } from '../types';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  currentCity: CityName;
  onCallNumber: (phone: string) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  currentCity,
  onCallNumber,
}) => {
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cityDoctors = doctors.filter(
    (d) => d.city.toLowerCase() === currentCity.toLowerCase()
  );

  const specialties = ['ALL', ...Array.from(new Set(cityDoctors.map(d => d.specialty)))];

  const filtered = cityDoctors.filter((doc) => {
    if (specialtyFilter !== 'ALL' && doc.specialty !== specialtyFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.facility_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            Registered Clinicians
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Doctors in {currentCity}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Registered medical specialists affiliated with genuine hospitals and medical colleges in Andhra Pradesh.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Specialty:
        </span>
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSpecialtyFilter(spec)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              specialtyFilter === spec
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-100">
                  {doctor.specialty}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{doctor.registration_number}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition">
                {doctor.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {doctor.qualifications}
              </p>

              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="font-semibold text-slate-800">
                  🏥 {doctor.facility_name}
                </div>
                <div className="text-slate-500">
                  ⏰ {doctor.availability_schedule}
                </div>
                <div className="text-slate-700 font-medium">
                  💵 Consultation Fee: <span className="text-sky-700 font-bold">{doctor.consultation_fee}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onCallNumber(doctor.official_contact)}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition flex-1 justify-center active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Desk: {doctor.official_contact}</span>
              </button>

              {doctor.official_booking_url ? (
                <a
                  href={doctor.official_booking_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Official Booking</span>
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No doctors found matching the selected filter in {currentCity}.</p>
        </div>
      )}
    </section>
  );
};
