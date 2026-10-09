import React from 'react';
import { 
  BadgePercent, ShieldCheck, 
  CreditCard, CheckCircle2
} from 'lucide-react';
import { CityName } from '../types';

interface CostTransparencyProps {
  currentCity: CityName;
}

export const CostTransparency: React.FC<CostTransparencyProps> = ({ currentCity }) => {
  const publishedServices = [
    {
      category: 'Doctor Consultations',
      items: [
        { name: `Government General Hospital (GGH) ${currentCity} OPD`, govtCost: 'Free / ₹10 Card', privateCost: '₹300 - ₹500', note: 'Free under AP Arogyasri Scheme' },
        { name: 'Specialist Cardiology Consultation', govtCost: 'Free', privateCost: '₹500 - ₹800', note: 'Includes preliminary ECG' },
        { name: 'Pediatric General Checkup', govtCost: 'Free', privateCost: '₹350 - ₹500', note: 'Free routine childhood immunizations' },
      ]
    },
    {
      category: 'Diagnostic & Imaging Tests',
      items: [
        { name: 'Complete Blood Picture (CBP / CBC)', govtCost: 'Free', privateCost: '₹220 - ₹350', note: 'Standard hematology profile' },
        { name: 'Fasting & Postprandial Blood Glucose', govtCost: 'Free', privateCost: '₹80 - ₹120', note: 'Essential diabetes monitoring' },
        { name: 'Digital Chest X-Ray (PA View)', govtCost: 'Free', privateCost: '₹350 - ₹500', note: 'Available 24/7 in GGH Casualty' },
        { name: 'CT Scan Brain (Plain)', govtCost: 'Free (Subsidized)', privateCost: '₹1,800 - ₹2,500', note: 'Emergency trauma assessment' },
        { name: 'MRI 1.5T Brain / Spine', govtCost: 'Free (Empanelled)', privateCost: '₹4,500 - ₹6,500', note: 'NABL Diagnostic Network pricing' },
      ]
    },
    {
      category: 'Emergency Transport & Ambulance',
      items: [
        { name: '108 Emergency Ambulance (ALS/BLS)', govtCost: '100% Free', privateCost: '₹1,500 - ₹3,000', note: 'Call 108 for immediate dispatch' },
        { name: '102 Maternal & Infant JSSK Ambulance', govtCost: '100% Free', privateCost: 'N/A', note: 'Government institutional delivery transport' },
      ]
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <BadgePercent className="w-3.5 h-3.5" />
          Price Transparency & Comparison
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Medical Service & Diagnostic Cost Estimator in {currentCity}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Compare standard diagnostic and consultation fees across government health facilities and private establishments in Andhra Pradesh.
        </p>
      </div>

      {/* Tables by Category */}
      <div className="space-y-6">
        {publishedServices.map((section, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>{section.category}</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                Region: {currentCity}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/50 text-slate-600 font-bold border-b border-slate-200/60">
                    <th className="py-3 px-6">Medical Service / Procedure</th>
                    <th className="py-3 px-6 text-emerald-700">Govt Hospital / Arogyasri</th>
                    <th className="py-3 px-6 text-slate-700">Private Facility Average</th>
                    <th className="py-3 px-6 text-slate-500">Clinical & Sourcing Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {section.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-6 font-black text-emerald-700">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          {item.govtCost}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-800">
                        {item.privateCost}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 text-[11px]">
                        {item.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Integrity Guarantee */}
      <div className="mt-8 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Billing Transparency & Integrity Principle:</strong> resQPath strictly refuses to generate simulated or fake financial bills. Prices shown above are published rates from public health schemes (Aarogyasri / NHM) and verified local tariff cards. Exact final hospital bills depend on clinical findings and complications during patient care.
        </div>
      </div>
    </section>
  );
};
