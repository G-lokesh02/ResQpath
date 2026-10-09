import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MandatoryGpsMap } from './components/MandatoryGpsMap';
import { DocSpotHome } from './components/DocSpotHome';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { HospitalDirectory } from './components/HospitalDirectory';
import { DoctorDirectory } from './components/DoctorDirectory';
import { AmbulanceDirectory } from './components/AmbulanceDirectory';
import { PharmaciesDirectory } from './components/PharmaciesDirectory';
import { MedicineComparator } from './components/MedicineComparator';
import { MedicalChatbot } from './components/MedicalChatbot';
import { SmartTriageQueue } from './components/SmartTriageQueue';
import { MedicalPassportView } from './components/MedicalPassport';
import { DiagnosticBloodBank } from './components/DiagnosticBloodBank';
import { CostTransparency } from './components/CostTransparency';
import { EmergencyModal } from './components/EmergencyModal';
import { OtpAuthModal } from './components/OtpAuthModal';
import { VerificationFooter } from './components/VerificationFooter';

import { 
  CityName, LanguageCode, Facility, Doctor, 
  Pharmacy, Medicine, AmbulanceProvider, UserSession 
} from './types';
import { api } from './services/api';
import { 
  FALLBACK_FACILITIES, FALLBACK_DOCTORS, 
  FALLBACK_PHARMACIES, FALLBACK_MEDICINES, FALLBACK_AMBULANCES 
} from './data/verifiedData';
import { 
  Home, Calendar, MessageSquare, PhoneCall, 
  User, Smartphone, Monitor
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Region State
  const [currentCity, setCurrentCity] = useState<CityName>('Kurnool');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('app-home'); // 'app-home' default matching reference
  const [viewMode, setViewMode] = useState<'APP_FRAME' | 'EXPANDED'>('EXPANDED');

  // Modals State
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Authenticated Patient Session
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('resqpath_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Healthcare Datasets State
  const [facilities, setFacilities] = useState<Facility[]>(FALLBACK_FACILITIES);
  const [doctors, setDoctors] = useState<Doctor[]>(FALLBACK_DOCTORS);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(FALLBACK_PHARMACIES);
  const [medicines, setMedicines] = useState<Medicine[]>(FALLBACK_MEDICINES);
  const [ambulances, setAmbulances] = useState<AmbulanceProvider[]>(FALLBACK_AMBULANCES);

  // Fetch verified datasets from Django backend on load
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [facData, docData, pharmData, medData, ambData] = await Promise.allSettled([
          api.getFacilities(),
          api.getDoctors(),
          api.getPharmacies(),
          api.getMedicines(),
          api.getAmbulances(),
        ]);

        if (facData.status === 'fulfilled' && facData.value?.length) {
          setFacilities(facData.value);
        }
        if (docData.status === 'fulfilled' && docData.value?.length) {
          setDoctors(docData.value);
        }
        if (pharmData.status === 'fulfilled' && pharmData.value?.length) {
          setPharmacies(pharmData.value);
        }
        if (medData.status === 'fulfilled' && medData.value?.length) {
          setMedicines(medData.value);
        }
        if (ambData.status === 'fulfilled' && ambData.value?.length) {
          setAmbulances(ambData.value);
        }
      } catch {
        // Fallback already pre-loaded
      }
    };

    loadBackendData();
  }, []);

  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    localStorage.setItem('resqpath_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('resqpath_user');
  };

  const handleCallNumber = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  const handleRequestGps = () => {
    setActiveTab('map');
    const el = document.getElementById('mandatory-gps-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      
      {/* View Mode & Quick Emergency Header Switcher */}
      <div className="bg-slate-900 text-white py-1 px-4 text-xs flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-teal-400">resQPath (GPS-to-Care)</span>
          <span className="hidden sm:inline text-slate-400">| Official AP Healthcare Network</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Design View:</span>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('APP_FRAME')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                viewMode === 'APP_FRAME' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="iOS App Interface from Reference Screenshot"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile App View</span>
            </button>
            <button
              onClick={() => setViewMode('EXPANDED')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                viewMode === 'EXPANDED' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Full Expanded Portal View"
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop View</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Header & Emergency Top Bar */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={setCurrentCity}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        
        {/* VIEW MODE 1: APP FRAME (Matching the uploaded reference mockup directly!) */}
        {viewMode === 'APP_FRAME' ? (
          <div className="py-6 px-4 flex justify-center">
            {/* Phone Bezel Container */}
            <div className="w-full max-w-[420px] bg-slate-950 p-3.5 rounded-[52px] shadow-2xl border-4 border-slate-800 relative">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800"></span>
              </div>

              {/* Phone Inner Screen Viewport */}
              <div className="bg-slate-50 rounded-[42px] overflow-hidden min-h-[780px] max-h-[820px] overflow-y-auto relative pt-8 pb-16">
                
                {activeTab === 'app-home' && (
                  <DocSpotHome
                    currentCity={currentCity}
                    onSelectCity={setCurrentCity}
                    user={user}
                    doctors={doctors}
                    facilities={facilities}
                    pharmacies={pharmacies}
                    ambulances={ambulances}
                    onSelectDoctor={setSelectedDoctor}
                    onNavigateTab={setActiveTab}
                    onOpenEmergency={() => setIsEmergencyOpen(true)}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onCallNumber={handleCallNumber}
                  />
                )}

                {activeTab === 'map' && (
                  <div className="p-3">
                    <MandatoryGpsMap
                      currentCity={currentCity}
                      onSelectCity={setCurrentCity}
                      facilities={facilities}
                      pharmacies={pharmacies}
                      onCallNumber={handleCallNumber}
                    />
                  </div>
                )}

                {activeTab === 'hospitals' && (
                  <HospitalDirectory
                    facilities={facilities}
                    currentCity={currentCity}
                    onCallNumber={handleCallNumber}
                  />
                )}

                {activeTab === 'doctors' && (
                  <DoctorDirectory
                    doctors={doctors}
                    currentCity={currentCity}
                    onCallNumber={handleCallNumber}
                  />
                )}

                {activeTab === 'ambulances' && (
                  <AmbulanceDirectory
                    ambulances={ambulances}
                    currentCity={currentCity}
                    onCallNumber={handleCallNumber}
                  />
                )}

                {activeTab === 'pharmacies' && (
                  <PharmaciesDirectory
                    pharmacies={pharmacies}
                    currentCity={currentCity}
                    onCallNumber={handleCallNumber}
                    onNavigateTab={setActiveTab}
                  />
                )}

                {activeTab === 'medicines' && (
                  <MedicineComparator
                    medicines={medicines}
                    pharmacies={pharmacies}
                    currentCity={currentCity}
                    onCallNumber={handleCallNumber}
                  />
                )}

                {activeTab === 'chatbot' && (
                  <MedicalChatbot
                    currentLanguage={currentLang}
                    onChangeLanguage={setCurrentLang}
                    currentCity={currentCity}
                    onOpenEmergency={() => setIsEmergencyOpen(true)}
                  />
                )}

                {activeTab === 'queue' && (
                  <SmartTriageQueue currentCity={currentCity} />
                )}

                {activeTab === 'passport' && (
                  <MedicalPassportView
                    user={user}
                    onOpenAuth={() => setIsAuthOpen(true)}
                  />
                )}

                {activeTab === 'blood' && (
                  <DiagnosticBloodBank
                    facilities={facilities}
                    currentCity={currentCity}
                    onCallNumber={handleCallNumber}
                  />
                )}

                {/* Floating Bottom Phone Dock Bar (as in screenshot) */}
                <div className="sticky bottom-3 left-0 right-0 px-4 z-30">
                  <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-full p-1.5 px-4 shadow-xl flex items-center justify-between border border-slate-700/60">
                    <button
                      onClick={() => setActiveTab('app-home')}
                      className={`p-2 rounded-full transition ${
                        activeTab === 'app-home' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Home"
                    >
                      <Home className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('queue')}
                      className={`p-2 rounded-full transition ${
                        activeTab === 'queue' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Appointments & Queue"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('chatbot')}
                      className={`p-2 rounded-full transition ${
                        activeTab === 'chatbot' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="5-Lang AI Chatbot"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsEmergencyOpen(true)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                      title="Emergency SOS"
                    >
                      <PhoneCall className="w-4 h-4 animate-bounce" />
                    </button>

                    <button
                      onClick={() => setActiveTab('passport')}
                      className={`p-2 rounded-full transition ${
                        activeTab === 'passport' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Medical Passport"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: EXPANDED DESKTOP VIEW */
          <>
            {/* Top DocSpot Quick Navigation Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <DocSpotHome
                currentCity={currentCity}
                onSelectCity={setCurrentCity}
                user={user}
                doctors={doctors}
                facilities={facilities}
                pharmacies={pharmacies}
                ambulances={ambulances}
                onSelectDoctor={setSelectedDoctor}
                onNavigateTab={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onCallNumber={handleCallNumber}
              />
            </div>

            {/* MANDATORY GPS MAP: Positioned near top of homepage right below Hero/DocSpot Bar */}
            <MandatoryGpsMap
              currentCity={currentCity}
              onSelectCity={setCurrentCity}
              facilities={facilities}
              pharmacies={pharmacies}
              onCallNumber={handleCallNumber}
            />

            {/* Comprehensive Section Views */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
              <HospitalDirectory
                facilities={facilities}
                currentCity={currentCity}
                onCallNumber={handleCallNumber}
              />

              <AmbulanceDirectory
                ambulances={ambulances}
                currentCity={currentCity}
                onCallNumber={handleCallNumber}
              />

              <PharmaciesDirectory
                pharmacies={pharmacies}
                currentCity={currentCity}
                onCallNumber={handleCallNumber}
                onNavigateTab={setActiveTab}
              />

              <MedicineComparator
                medicines={medicines}
                pharmacies={pharmacies}
                currentCity={currentCity}
                onCallNumber={handleCallNumber}
              />

              <CostTransparency currentCity={currentCity} />
            </div>
          </>
        )}

      </main>

      {/* Floating Bottom Navigation Dock for Viewport */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-full p-2 px-6 shadow-2xl flex items-center gap-3 sm:gap-6 border border-slate-700/80">
          <button
            onClick={() => setActiveTab('app-home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'app-home' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🗺️</span>
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'queue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Triage</span>
          </button>

          <button
            onClick={() => setActiveTab('chatbot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'chatbot' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">5-Lang Chat</span>
          </button>

          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-lg shadow-red-600/30 transition transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS 112/108</span>
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'passport' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Passport</span>
          </button>
        </div>
      </div>

      {/* Doctor Profile Drawer/Modal (matching phone 2 in reference screenshot) */}
      <DoctorDetailModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onCallNumber={handleCallNumber}
        onOpenChat={() => setActiveTab('chatbot')}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        currentCity={currentCity}
        ambulances={ambulances}
      />

      {/* OTP Authentication Modal */}
      <OtpAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Verification Footer */}
      <VerificationFooter />
    </div>
  );
};

export default App;
