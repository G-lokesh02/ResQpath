import React, { useState } from 'react';
import { 
  Bell, MapPin, Search, Calendar, 
  ChevronRight, Star, Phone, ShieldCheck, 
  ArrowUpRight, Heart, Activity, Pill, UserCheck, CheckCircle2
} from 'lucide-react';
import { Facility, Doctor, Pharmacy, AmbulanceProvider, CityName, UserSession } from '../types';

interface DocSpotHomeProps {
  currentCity: CityName;
  onSelectCity: (city: CityName) => void;
  user: UserSession | null;
  doctors: Doctor[];
  facilities: Facility[];
  pharmacies: Pharmacy[];
  ambulances: AmbulanceProvider[];
  onSelectDoctor: (doctor: Doctor) => void;
  onNavigateTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenAuth: () => void;
  onCallNumber: (phone: string) => void;
}

export const DocSpotHome: React.FC<DocSpotHomeProps> = ({
  currentCity,
  onSelectCity,
  user,
  doctors,
  facilities,
  pharmacies,
  ambulances,
  onSelectDoctor,
  onNavigateTab,
  onOpenEmergency,
  onOpenAuth,
  onCallNumber,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  const specialties = [
    { id: 'Dental', label: 'Dental', icon: '🦷', color: 'bg-slate-50' },
    { id: 'Cardiology', label: 'Cardiology', icon: '❤️', color: 'bg-red-50' },
    { id: 'Neurology', label: 'Neurology', icon: '🧠', color: 'bg-purple-50' },
    { id: 'Nephrology', label: 'Nephrology', icon: '🫘', color: 'bg-amber-50' },
    { id: 'Pulmonology', label: 'Pulmonology', icon: '🫁', color: 'bg-rose-50' },
    { id: 'Emergency', label: '24/7 Casualty', icon: '🚨', color: 'bg-red-100' },
    { id: 'Ambulance', label: 'Ambulance', icon: '🚑', color: 'bg-orange-50' },
    { id: 'Jan Aushadhi', label: 'Jan Aushadhi', icon: '💊', color: 'bg-emerald-50' },
  ];

  const cityDoctors = doctors.filter(d => d.city.toLowerCase() === currentCity.toLowerCase());
  const cityFacilities = facilities.filter(f => f.city.toLowerCase() === currentCity.toLowerCase());
  const cityPharmacies = pharmacies.filter(p => p.city.toLowerCase() === currentCity.toLowerCase());
  const cityAmbulances = ambulances.filter(a => a.city.toLowerCase() === currentCity.toLowerCase());

  // Filtered doctors
  const displayDoctors = cityDoctors.filter(d => {
    if (selectedSpecialty !== 'ALL' && !d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.facility_name.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">
      
      {/* 1. Header (Hello Amanda style) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hello, {user ? user.name.split(' ')[0] : 'Amanda'}
          </h1>
          <div className="relative inline-block mt-0.5">
            <select
              value={currentCity}
              onChange={(e) => onSelectCity(e.target.value as CityName)}
              className="appearance-none bg-transparent pr-5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer focus:outline-hidden"
            >
              <option value="Kurnool">📍 Kurnool, AP</option>
              <option value="Nandyal">📍 Nandyal, AP</option>
              <option value="Anantapur">📍 Anantapur, AP</option>
            </select>
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-teal-700">
              ⌄
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={onOpenEmergency}
            className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition shadow-xs relative"
            title="Emergency SOS"
          >
            <Bell className="w-5 h-5 text-red-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          <div 
            onClick={onOpenAuth}
            className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden cursor-pointer shadow-xs border border-white hover:scale-105 transition"
            title="Patient Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. Sleek Rounded Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search a doctor, hospital, ambulance or medicine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-full border border-slate-200/80 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition"
        />
      </div>

      {/* 3. Specialties Icon Grid (matching screenshot) */}
      <div>
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {specialties.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'Emergency') onOpenEmergency();
                else if (item.id === 'Ambulance') onNavigateTab('ambulances');
                else if (item.id === 'Jan Aushadhi') onNavigateTab('medicines');
                else setSelectedSpecialty(selectedSpecialty === item.id ? 'ALL' : item.id);
              }}
              className={`p-3.5 rounded-3xl border transition flex flex-col items-center justify-center gap-1.5 shadow-2xs ${
                selectedSpecialty === item.id 
                  ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-200' 
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs'
              }`}
            >
              <div className="text-2xl sm:text-3xl filter drop-shadow-xs">{item.icon}</div>
              <span className="text-[11px] font-bold text-slate-700 tracking-tight text-center leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Live GPS Radar & Date Card (matching screenshot) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row items-stretch gap-3">
        {/* Date Box */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl p-4 flex sm:flex-col items-center justify-between sm:justify-center text-center shrink-0 min-w-[100px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-100">Monday</span>
          <span className="text-2xl sm:text-3xl font-black">21</span>
          <span className="text-xs font-medium text-teal-100">Jan 2026</span>
        </div>

        {/* Mini Radar Map snippet with live nearby pins */}
        <div 
          onClick={() => onNavigateTab('map')}
          className="flex-1 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between cursor-pointer group transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-900">
                Live GPS Radar ({currentCity})
              </span>
            </div>
            <span className="text-[11px] font-bold text-teal-700 group-hover:underline flex items-center gap-0.5">
              Open Map <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            <strong>{cityFacilities.length} Hospitals</strong> • <strong>{cityAmbulances.length} Ambulances</strong> • <strong>{cityPharmacies.length} Pharmacies</strong> within proximity.
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 5.0 GGH Trauma
            </span>
            <span className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 KIMS
            </span>
          </div>
        </div>
      </div>

      {/* 5. Upcoming Appointments & Emergency Care (matching screenshot) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Featured Doctor in {currentCity}
          </h2>
          <button 
            onClick={() => onNavigateTab('doctors')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Doctor Card */}
        {cityDoctors[0] && (
          <div 
            onClick={() => onSelectDoctor(cityDoctors[0])}
            className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shadow-xs border border-white">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
                    alt={cityDoctors[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{cityDoctors[0].name}</h3>
                  <p className="text-xs text-slate-500">{cityDoctors[0].specialty}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    <span>Verified APMC</span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">{cityDoctors[0].consultation_fee}</span>
                <span className="text-[10px] text-slate-400">OPD Consultation</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Today: 09:00 AM - 01:00 PM</span>
              </div>
              <span className="font-bold text-teal-700">View Profile →</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Quick Emergency Ambulances Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🚑 Emergency Ambulances in {currentCity}</span>
          </h2>
          <button 
            onClick={() => onNavigateTab('ambulances')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700"
          >
            All ({cityAmbulances.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cityAmbulances.slice(0, 2).map((amb) => (
            <div key={amb.id} className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">{amb.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{amb.coverage_area}</p>
                <span className="text-[10px] font-bold text-red-600 mt-1 inline-block">
                  {amb.service_type === 'GOVT_FREE' ? 'Free Govt 108' : 'Advanced Life Support'}
                </span>
              </div>

              <button
                onClick={() => onCallNumber(amb.contact_phone)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs p-2.5 rounded-xl shadow-xs"
                title={`Call ${amb.contact_phone}`}
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Nearby Medical Shops & Jan Aushadhi Kendras */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>💊 Medical Shops & Jan Aushadhi</span>
          </h2>
          <button 
            onClick={() => onNavigateTab('medicines')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700"
          >
            Compare Prices →
          </button>
        </div>

        <div className="space-y-2.5">
          {cityPharmacies.slice(0, 3).map((pharm) => (
            <div key={pharm.id} className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    pharm.type === 'JAN_AUSHADHI' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pharm.type.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-1">{pharm.name}</h4>
                <p className="text-[11px] text-slate-500">{pharm.address}</p>
              </div>

              <button
                onClick={() => onCallNumber(pharm.contact_phone)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
