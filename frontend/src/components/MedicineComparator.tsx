import React, { useState } from 'react';
import { 
  Pill, Search, TrendingDown, ShieldCheck, 
  Phone, AlertTriangle, Building, CheckCircle2
} from 'lucide-react';
import { Medicine, Pharmacy, CityName } from '../types';

interface MedicineComparatorProps {
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  currentCity: CityName;
  onCallNumber: (phone: string) => void;
}

export const MedicineComparator: React.FC<MedicineComparatorProps> = ({
  medicines,
  pharmacies,
  currentCity,
  onCallNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Filter medicines
  const filteredMedicines = medicines.filter((m) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.brand_name.toLowerCase().includes(q) ||
      m.generic_name.toLowerCase().includes(q) ||
      m.jan_aushadhi_name.toLowerCase().includes(q)
    );
  });

  // Jan Aushadhi pharmacies in current city
  const cityJanAushadhiPharmacies = pharmacies.filter(
    (p) => p.city.toLowerCase() === currentCity.toLowerCase() && p.type === 'JAN_AUSHADHI'
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Pill className="w-3.5 h-3.5" />
            Medicine Affordability & Equivalence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jan Aushadhi Generic vs Brand Price Comparator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Compare verified branded drugs with government PMBJP generic bioequivalents. Verified data from official drug registries.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand (e.g. Augmentin, Dolo, Glycomet)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Side-by-side Comparative Medicine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedicines.map((med) => {
          const brandPriceNum = typeof med.brand_price === 'number' ? med.brand_price : parseFloat(med.brand_price);
          const genericPriceNum = typeof med.jan_aushadhi_price === 'number' ? med.jan_aushadhi_price : parseFloat(med.jan_aushadhi_price);
          const savingsAmount = (brandPriceNum - genericPriceNum).toFixed(2);

          return (
            <div
              key={med.id}
              onClick={() => setSelectedMedicine(med)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header with Strength and Savings Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {med.dosage_form} • {med.strength}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>SAVE {med.savings_percentage}%</span>
                  </span>
                </div>

                {/* Branded Medicine Info */}
                <div className="mt-2">
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {med.brand_name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Mfg: {med.brand_manufacturer} ({med.brand_pack_size})
                  </div>
                  <div className="text-sm font-semibold text-rose-600 mt-1 line-through opacity-85">
                    Retail Price: ₹{brandPriceNum.toFixed(2)}
                  </div>
                </div>

                {/* Jan Aushadhi Equivalent Section */}
                <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jan Aushadhi Generic Bioequivalent</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    {med.jan_aushadhi_name}
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <div className="text-lg font-black text-emerald-700">
                      ₹{genericPriceNum.toFixed(2)}
                      <span className="text-xs font-normal text-emerald-800 ml-1">
                        / {med.jan_aushadhi_pack_size}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-emerald-800">
                      You save ₹{savingsAmount}
                    </div>
                  </div>
                </div>

                {/* Active Ingredient */}
                <div className="mt-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Active Molecule:</span> {med.generic_name}
                </div>
              </div>

              {/* Bottom Quick Call */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs font-semibold text-sky-700 hover:text-sky-800 hover:bg-slate-100 transition">
                Tap to check nearby pharmacy stock →
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Medicine Modal / Stock Inspector */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  Generic Substitution Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedMedicine.brand_name} vs {selectedMedicine.jan_aushadhi_name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMedicine(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-2 border border-slate-100">
              <div><strong>Active Molecule:</strong> {selectedMedicine.generic_name}</div>
              <div><strong>Strength:</strong> {selectedMedicine.strength}</div>
              <div><strong>Dosage Form:</strong> {selectedMedicine.dosage_form}</div>
              <div className="text-emerald-800 font-bold">
                Potential Savings: {selectedMedicine.savings_percentage}% (₹{(Number(selectedMedicine.brand_price) - Number(selectedMedicine.jan_aushadhi_price)).toFixed(2)} per pack)
              </div>
              <div className="text-slate-600 italic">
                "{selectedMedicine.clinical_notes}"
              </div>
            </div>

            {/* Pharmacies stocking Jan Aushadhi in Current City */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Verified Jan Aushadhi Outlets in {currentCity}</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cityJanAushadhiPharmacies.map((pharm) => (
                  <div key={pharm.id} className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{pharm.name}</div>
                      <div className="text-slate-500 text-[11px]">{pharm.address}</div>
                    </div>
                    <button
                      onClick={() => onCallNumber(pharm.contact_phone)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call {pharm.contact_phone}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Call pharmacy to verify current stock before traveling. Substitution of prescription medicines requires verification by a registered pharmacist or doctor.
              </span>
            </div>

            <button
              onClick={() => setSelectedMedicine(null)}
              className="w-full bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Clinical Medicine Safety Warning */}
      <div className="mt-8 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Medical Safety Guarantee:</strong> resQPath does not dispense or sell prescription medicines directly. Price comparisons reflect official published MRPs from PMBJP and authorized retail distributors. Always bring a valid prescription from a registered medical practitioner. Never stop or change essential medications without consulting your prescribing doctor.
        </div>
      </div>
    </section>
  );
};
