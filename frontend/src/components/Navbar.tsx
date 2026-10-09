import React from 'react';
import { 
  ShieldAlert, PhoneCall, MapPin, 
  UserCheck, LogIn, Globe
} from 'lucide-react';
import { CityName, LanguageCode, UserSession } from '../types';

interface NavbarProps {
  currentCity: CityName;
  onSelectCity: (city: CityName) => void;
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  currentLang,
  onSelectLang,
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenEmergency,
}) => {
  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  ];

  const cities: CityName[] = ['Kurnool', 'Nandyal', 'Anantapur'];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Urgent Emergency Strip */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase">Official Medical Emergency Network</span>
            <span className="hidden sm:inline text-red-100">| Andhra Pradesh Centralised Calling</span>
          </div>

          <div className="flex items-center gap-3 font-semibold">
            <a 
              href="tel:112" 
              className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition text-white"
            >
              <PhoneCall className="w-3 h-3" />
              <span>National: 112</span>
            </a>
            <a 
              href="tel:108" 
              className="bg-white text-red-700 px-3 py-0.5 rounded-full flex items-center gap-1.5 hover:bg-red-50 transition shadow-sm font-bold"
            >
              <PhoneCall className="w-3 h-3 text-red-600" />
              <span>Ambulance: 108</span>
            </a>
            <button 
              onClick={onOpenEmergency}
              className="bg-red-900/40 hover:bg-red-900/60 px-2.5 py-0.5 rounded-full transition text-white border border-red-400/40"
            >
              Emergency Protocols
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('map')} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-tight text-slate-900">
                    res<span className="text-sky-600">Q</span>Path
                  </span>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    AP Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium hidden sm:block">
                  Verified Healthcare & Emergency Discovery
                </p>
              </div>
            </button>

            {/* Regional City Selector Switcher */}
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-200">
              <span className="text-xs text-slate-700 font-medium mr-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                City:
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => onSelectCity(city)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      currentCity === city
                        ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {[
              { id: 'map', label: 'GPS Discovery' },
              { id: 'hospitals', label: 'Hospitals & Beds' },
              { id: 'doctors', label: 'Doctors' },
              { id: 'medicines', label: 'Medicine Prices' },
              { id: 'chatbot', label: '5-Lang AI Chat' },
              { id: 'queue', label: 'Smart Triage' },
              { id: 'passport', label: 'Medical Passport' },
              { id: 'blood', label: 'Blood & Labs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls: Lang & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-800">
                  {languages.find(l => l.code === currentLang)?.native}
                </span>
              </button>
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 hidden group-hover:block group-focus-within:block z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100">
                  Supported Languages
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onSelectLang(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition ${
                      currentLang === lang.code
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[11px] text-slate-700 font-medium">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile City Dropdown for Smaller Screens */}
            <div className="lg:hidden">
              <select
                value={currentCity}
                onChange={(e) => onSelectCity(e.target.value as CityName)}
                className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-800"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Emergency Quick Action Button */}
            <button
              onClick={onOpenEmergency}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm shadow-red-500/20 transition transform active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">SOS Emergency</span>
              <span className="sm:hidden">SOS</span>
            </button>

            {/* Patient Auth Button */}
            {user ? (
              <div 
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-100 transition"
                title={`Logged in as ${user.mobile}`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold hidden sm:inline">{user.name}</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1 py-0.2 rounded font-bold">
                  Verified
                </span>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-300" />
                <span>Patient Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub Navigation Tabs */}
        <div className="xl:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {[
            { id: 'map', label: 'Map Discovery' },
            { id: 'hospitals', label: 'Hospitals' },
            { id: 'doctors', label: 'Doctors' },
            { id: 'medicines', label: 'Medicine Prices' },
            { id: 'chatbot', label: '5-Lang AI Chat' },
            { id: 'queue', label: 'Triage Queue' },
            { id: 'passport', label: 'Passport' },
            { id: 'blood', label: 'Blood & Labs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
