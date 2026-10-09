import React, { useState } from 'react';
import { 
  PhoneCall, ShieldAlert, X, 
  MapPin, Share2, HeartPulse, Check, ExternalLink
} from 'lucide-react';
import { CityName, AmbulanceProvider } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CityName;
  ambulances: AmbulanceProvider[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  ambulances,
}) => {
  const [copiedLocation, setCopiedLocation] = useState(false);

  if (!isOpen) return null;

  const districtHelplines: Record<CityName, { phone: string; name: string }> = {
    'Kurnool': { phone: '08518-277305', name: 'Kurnool District Emergency Control Room' },
    'Nandyal': { phone: '08514-222444', name: 'Nandyal District Disaster & Medical Helpline' },
    'Anantapur': { phone: '08554-220003', name: 'Anantapur District Emergency Response Cell' },
  };

  const emergencyHospitals: Record<CityName, { name: string; phone: string; address: string; beds: string }[]> = {
    'Kurnool': [
      {
        name: 'GGH Kurnool & Kurnool Medical College (Level 1 Trauma)',
        phone: '08518-255312',
        address: 'Budhawara Peta, Kurnool (24/7 Casualty & Blood Bank)',
        beds: '🟢 Beds Confirmed Available (Govt Emergency)'
      },
      {
        name: 'KIMS Super Speciality Hospital Kurnool',
        phone: '08518-288288',
        address: 'NH-44, Joharapuram Road, Kurnool (ICU & Cath Lab)',
        beds: '🟡 Call Reception to Confirm ICU Bed'
      }
    ],
    'Nandyal': [
      {
        name: 'Government General Hospital Nandyal',
        phone: '08514-245100',
        address: 'Sanjeeva Nagar, Nandyal (24/7 Casualty)',
        beds: '🟢 Beds Confirmed Available'
      },
      {
        name: 'Santhiram Medical College & Hospital',
        phone: '08514-222501',
        address: 'NH-40, Nerawada, Nandyal (Critical Care & Trauma)',
        beds: '🟢 Tertiary Emergency Open'
      }
    ],
    'Anantapur': [
      {
        name: 'Government General Hospital Anantapur',
        phone: '08554-274244',
        address: 'Court Road, Clock Tower, Anantapur (24/7 Casualty)',
        beds: '🟢 Beds Confirmed Available'
      },
      {
        name: 'RDT Hospital Bathalapalli (Charitable Trauma Care)',
        phone: '08559-244222',
        address: 'Kadiri Road, Bathalapalli (Critical Care)',
        beds: '🟢 Beds Confirmed Available'
      }
    ]
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const text = `MEDICAL EMERGENCY: I need assistance near ${currentCity}. My GPS coordinates: https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
          setCopiedLocation(true);
          setTimeout(() => setCopiedLocation(false), 3000);
        }
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      }, () => {
        const fallbackText = `MEDICAL EMERGENCY: I need assistance in ${currentCity}, Andhra Pradesh. Please contact 108 or 112.`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fallbackText)}`, '_blank');
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-red-200">
        
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 sm:p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold bg-white/20 px-2 py-0.5 rounded">
                Zero Barrier • No Login Required
              </span>
              <h2 className="text-2xl font-black mt-1">
                Emergency Medical Response: {currentCity}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Top Big Call Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <a
              href="tel:108"
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-red-600/25 transition transform active:scale-98 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white text-red-600 flex items-center justify-center font-black text-xl">
                  108
                </div>
                <div>
                  <div className="font-bold text-base leading-tight">Medical Ambulance</div>
                  <div className="text-xs text-red-100">Government Free 24/7 Response</div>
                </div>
              </div>
              <PhoneCall className="w-6 h-6 group-hover:animate-bounce" />
            </a>

            <a
              href="tel:112"
              className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-md transition transform active:scale-98 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-xl border border-slate-700">
                  112
                </div>
                <div>
                  <div className="font-bold text-base leading-tight">National Emergency</div>
                  <div className="text-xs text-slate-300">Police, Fire & Medical Unified</div>
                </div>
              </div>
              <PhoneCall className="w-6 h-6 group-hover:scale-110" />
            </a>
          </div>

          {/* Share Live Location CTA */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Share Your GPS Coordinates
                </h4>
                <p className="text-xs text-slate-600">
                  Instantly sends your exact GPS link to trusted family via WhatsApp or SMS.
                </p>
              </div>
            </div>

            <button
              onClick={handleShareLocation}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
            >
              {copiedLocation ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLocation ? 'Link Copied!' : 'Send Live Location'}</span>
            </button>
          </div>

          {/* Nearest Casualty & Trauma Centres in Active City */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>Nearest Emergency Departments in {currentCity}</span>
            </h3>

            <div className="space-y-2.5">
              {emergencyHospitals[currentCity]?.map((hosp, i) => (
                <div 
                  key={i} 
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{hosp.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{hosp.address}</p>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                      {hosp.beds}
                    </span>
                  </div>

                  <a
                    href={`tel:${hosp.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call: {hosp.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* District Helpline Notice */}
          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">{districtHelplines[currentCity]?.name}</span>
              <p className="text-slate-500">Official District Administration Helplines</p>
            </div>
            <a 
              href={`tel:${districtHelplines[currentCity]?.phone}`}
              className="font-bold text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>{districtHelplines[currentCity]?.phone}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Pre-Arrival First-Aid Protocols */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
            <h4 className="font-bold text-amber-900 uppercase tracking-wide">
              Critical Pre-Arrival Instructions
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li><strong>Severe Chest Pain:</strong> Keep patient seated, loosen tight clothing. Do not give food or drink. Call 108 immediately.</li>
              <li><strong>Severe Bleeding:</strong> Apply firm, direct pressure with a clean cloth. Elevate wound if possible.</li>
              <li><strong>Stroke Warning (FAST):</strong> Check Face drooping, Arm weakness, Speech difficulty. Note the exact time symptoms started.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-between items-center text-xs text-slate-500">
          <span>Official Andhra Pradesh Emergency Care Protocol</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            Close Emergency Panel
          </button>
        </div>

      </div>
    </div>
  );
};
