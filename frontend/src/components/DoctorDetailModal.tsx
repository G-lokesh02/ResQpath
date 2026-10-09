import React, { useState } from 'react';
import { 
  X, Star, Heart, Share2, Building2, 
  Globe, MessageCircle, Calendar, Phone, CheckCircle2, ChevronRight, Stethoscope
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onCallNumber: (phone: string) => void;
  onOpenChat: () => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onCallNumber,
  onOpenChat,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'Services' | 'Reviews' | 'Timings' | 'Directions'>('Services');
  const [booked, setBooked] = useState(false);

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[38px] max-w-sm sm:max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col justify-between">
        
        {/* Top App Bar with Back & Actions */}
        <div className="p-5 pb-0 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: doctor.name, text: `${doctor.name} - ${doctor.specialty} at ${doctor.facility_name}` });
                } else {
                  navigator.clipboard.writeText(`${doctor.name} - ${doctor.official_contact}`);
                  alert('Doctor details copied to clipboard!');
                }
              }}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Doctor Photo & Header Info */}
        <div className="px-6 pt-3 text-center">
          <div className="relative inline-block mx-auto mb-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-100 to-indigo-100 p-1 shadow-md mx-auto">
              <img
                src={`https://images.unsplash.com/photo-${
                  doctor.name.includes('Sreelatha') || doctor.name.includes('Nirmala')
                    ? '1594824813629-798835f8c6eb' // female doctor
                    : '1622253692010-333f2da6031d' // male doctor
                }?auto=format&fit=crop&w=300&q=80`}
                alt={doctor.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{doctor.name}</h2>
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
              ⭐ Top
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {doctor.specialty} • {doctor.qualifications}
          </p>
        </div>

        {/* 3 Metric Cards (as in screenshot) */}
        <div className="px-6 pt-4 grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
            <div className="text-base font-extrabold text-slate-900">2k+</div>
            <div className="text-[11px] text-slate-500 font-medium">Patients</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
            <div className="text-base font-extrabold text-slate-900">12 yrs</div>
            <div className="text-[11px] text-slate-500 font-medium">Experience</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
            <div className="text-xs font-extrabold text-slate-900 truncate">
              {doctor.consultation_fee.includes('Free') ? 'Free' : '₹300 - ₹500'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Price Range</div>
          </div>
        </div>

        {/* Rating, Affiliation & Languages Strip */}
        <div className="px-6 pt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="flex items-center text-amber-500 font-bold gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">(1.2k verified reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="truncate">{doctor.facility_name}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Speaks Telugu, Hindi, English</span>
          </div>
        </div>

        {/* Sub-tabs: Services, Reviews, Timings */}
        <div className="px-6 pt-5">
          <div className="flex border-b border-slate-100 gap-6 text-xs font-bold">
            {(['Services', 'Reviews', 'Timings', 'Directions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-2 transition relative ${
                  activeSubTab === tab ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeSubTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Sub-tab Content Cards */}
          <div className="pt-3 pb-2 space-y-2 text-xs">
            {activeSubTab === 'Services' && (
              <>
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      🩺
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{doctor.specialty} Consultation</h4>
                      <p className="text-[11px] text-slate-500">In-person clinical evaluation & prescription</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      🛡️
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Prevention And Care</h4>
                      <p className="text-[11px] text-slate-500">Follow-up checkups & health monitoring</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </>
            )}

            {activeSubTab === 'Timings' && (
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-800">OPD Consultation Schedule:</div>
                <div className="text-slate-600 font-medium">{doctor.availability_schedule}</div>
                <div className="text-[11px] text-emerald-700 font-bold mt-1">
                  Registration: {doctor.registration_number}
                </div>
              </div>
            )}

            {activeSubTab === 'Reviews' && (
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-900">"Very thorough and attentive care."</div>
                <p className="text-[11px] text-slate-500">- Verified Patient, Kurnool District</p>
              </div>
            )}

            {activeSubTab === 'Directions' && (
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-900">Location:</div>
                <p className="text-slate-600">{doctor.facility_name}, {doctor.city}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Booking Action Buttons (matching screenshot) */}
        <div className="p-6 pt-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (doctor.official_booking_url) {
                window.open(doctor.official_booking_url, '_blank');
              } else {
                onCallNumber(doctor.official_contact);
              }
              setBooked(true);
            }}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-4 rounded-full shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
          >
            {booked ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Call Placed / Booking Opened</span>
              </>
            ) : (
              <span>Book Appointment ({doctor.consultation_fee})</span>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenChat();
            }}
            className="w-13 h-13 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-700 flex items-center justify-center transition border border-teal-200"
            title="Chat in 5 Languages"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
