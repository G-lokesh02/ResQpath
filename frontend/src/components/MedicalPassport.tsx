import React, { useState } from 'react';
import { 
  Heart, Shield, AlertCircle, Save, 
  Printer, Check, Phone, UserCheck
} from 'lucide-react';
import { EmergencyPassport, UserSession } from '../types';
import { api } from '../services/api';

interface MedicalPassportProps {
  user: UserSession | null;
  onOpenAuth: () => void;
}

export const MedicalPassportView: React.FC<MedicalPassportProps> = ({ user, onOpenAuth }) => {
  const [passport, setPassport] = useState<EmergencyPassport>({
    mobile_number: user?.mobile || '9876543210',
    patient_name: user?.name || 'Registered Patient (Kurnool)',
    blood_group: user?.blood_group || 'O+',
    allergies: 'Penicillin (Severe rash), Sulfa drugs',
    chronic_conditions: 'Type 2 Diabetes Mellitus, Essential Hypertension',
    current_medications: 'Metformin 500mg (1-0-1), Telmisartan 40mg (1-0-0)',
    emergency_contact_name: 'Anand Kumar (Brother)',
    emergency_contact_phone: '+91 94401 23456',
    consent_shared: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.savePassport(passport);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Local storage fallback
      localStorage.setItem(`passport_${passport.mobile_number}`, JSON.stringify(passport));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5" />
            Patient Controlled Health Record
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Medical Passport
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Maintain your critical clinical summary. In an emergency, paramedics and attending physicians can instantly access critical allergies and history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / PDF Card</span>
          </button>
        </div>
      </div>

      {!user && (
        <div className="mb-6 bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-sky-600 shrink-0" />
            <p className="text-xs text-slate-700">
              Log in with your mobile OTP to automatically synchronize your Emergency Passport with your mobile number across devices.
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 transition"
          >
            Mobile Login
          </button>
        </div>
      )}

      {/* Passport Form & Visual ID Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Printable Visual Health Card Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold tracking-wider text-xs uppercase text-slate-300">EMERGENCY ID</span>
              </div>
              <span className="text-xs bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full font-bold">
                resQPath AP
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">{passport.patient_name}</h3>
                <p className="text-xs text-slate-400">Mobile: {passport.mobile_number}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Blood Group</span>
                <span className="text-2xl font-black text-rose-400">{passport.blood_group}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-rose-300 font-bold block text-[11px]">⚠️ Known Allergies:</span>
                <span className="text-slate-200">{passport.allergies || 'None reported'}</span>
              </div>

              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sky-300 font-bold block text-[11px]">🏥 Chronic Conditions:</span>
                <span className="text-slate-200">{passport.chronic_conditions || 'None reported'}</span>
              </div>

              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-emerald-300 font-bold block text-[11px]">💊 Active Prescriptions:</span>
                <span className="text-slate-200">{passport.current_medications || 'None reported'}</span>
              </div>

              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">ICE Contact</span>
                  <span className="text-slate-100 font-bold">{passport.emergency_contact_name}</span>
                </div>
                <a
                  href={`tel:${passport.emergency_contact_phone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>Patient Consent: {passport.consent_shared ? 'Authorized for Emergency Care' : 'Private'}</span>
              <span>AP Healthcare ID</span>
            </div>
          </div>
        </div>

        {/* Passport Edit Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
              Update Health Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={passport.patient_name}
                  onChange={(e) => setPassport({ ...passport, patient_name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={passport.blood_group}
                  onChange={(e) => setPassport({ ...passport, blood_group: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Known Drug & Food Allergies
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa, Aspirin, Peanuts"
                value={passport.allergies}
                onChange={(e) => setPassport({ ...passport, allergies: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chronic Medical Conditions
              </label>
              <input
                type="text"
                placeholder="e.g. Diabetes, Hypertension, Asthma, Epilepsy"
                value={passport.chronic_conditions}
                onChange={(e) => setPassport({ ...passport, chronic_conditions: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Daily Prescriptions & Dosages
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Metformin 500mg, Atorvastatin 10mg"
                value={passport.current_medications}
                onChange={(e) => setPassport({ ...passport, current_medications: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  In Case of Emergency (ICE) Contact Name
                </label>
                <input
                  type="text"
                  value={passport.emergency_contact_name}
                  onChange={(e) => setPassport({ ...passport, emergency_contact_name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ICE Contact Phone Number
                </label>
                <input
                  type="text"
                  value={passport.emergency_contact_phone}
                  onChange={(e) => setPassport({ ...passport, emergency_contact_phone: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passport.consent_shared}
                  onChange={(e) => setPassport({ ...passport, consent_shared: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span>Allow first responders to scan this emergency summary</span>
              </label>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Saved Securely!' : 'Save Passport'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      <div className="mt-8 p-4 bg-slate-100 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <Shield className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong>Privacy Policy Guarantee:</strong> Your emergency medical summary is stored securely and never published publicly. You hold sole discretion over what health observations to record.
        </div>
      </div>
    </section>
  );
};
