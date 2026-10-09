import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, Clock, 
  PlusCircle, RefreshCw, Info, Heart
} from 'lucide-react';
import { TriageTicket, CityName } from '../types';

interface SmartTriageQueueProps {
  currentCity: CityName;
}

export const SmartTriageQueue: React.FC<SmartTriageQueueProps> = ({ currentCity }) => {
  // Demo triage queue records
  const [tickets, setTickets] = useState<TriageTicket[]>([
    {
      id: 1,
      ticket_number: 'ER-KNL-101',
      patient_name: 'Venkat Raman Rao (Demo Patient)',
      age: 58,
      gender: 'Male',
      city: 'Kurnool',
      facility_name: 'GGH Kurnool & Medical College',
      primary_symptom: 'Retrosternal crushing chest pain, diaphoresis, dyspnea',
      vitals_summary: 'BP 160/98 mmHg, Pulse 108 bpm, SpO2 93%, ECG: ST elevation',
      urgency_level: 'LEVEL_1_RESUSCITATION',
      emergency_warning_flag: true,
      status: 'UNDER_EVALUATION',
      est_wait_minutes: 0,
      reassessment_notes: 'Priority 1: Immediate cath lab alert. Attending physician on site.',
    },
    {
      id: 2,
      ticket_number: 'ER-NDL-102',
      patient_name: 'Sujatha Devi (Demo Patient)',
      age: 34,
      gender: 'Female',
      city: 'Nandyal',
      facility_name: 'Santhiram Medical College Hospital',
      primary_symptom: 'Right lower quadrant acute pain, tenderness, nausea',
      vitals_summary: 'BP 118/76 mmHg, Pulse 88 bpm, Temp 100.4°F, SpO2 98%',
      urgency_level: 'LEVEL_3_URGENT',
      emergency_warning_flag: false,
      status: 'TRIAGED',
      est_wait_minutes: 20,
      reassessment_notes: 'Nurse triaged. Surgical duty registrar scheduled for McBurney point evaluation.',
    },
    {
      id: 3,
      ticket_number: 'ER-ATP-103',
      patient_name: 'Nagaraju Chowdary (Demo Patient)',
      age: 42,
      gender: 'Male',
      city: 'Anantapur',
      facility_name: 'GGH Anantapur Casualty',
      primary_symptom: 'High grade pyrexia, severe body ache for 3 days',
      vitals_summary: 'BP 124/82 mmHg, Pulse 82 bpm, Temp 102.1°F, SpO2 97%',
      urgency_level: 'LEVEL_4_SEMI_URGENT',
      emergency_warning_flag: false,
      status: 'WAITING',
      est_wait_minutes: 45,
      reassessment_notes: 'Oral antipyretic administered. Blood tests queued.',
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState<{
    patient_name: string;
    age: string;
    gender: string;
    primary_symptom: string;
    vitals_summary: string;
    urgency_level: TriageTicket['urgency_level'];
    emergency_warning_flag: boolean;
  }>({
    patient_name: '',
    age: '',
    gender: 'Male',
    primary_symptom: '',
    vitals_summary: 'BP 120/80 mmHg, Pulse 76 bpm, SpO2 98%',
    urgency_level: 'LEVEL_3_URGENT',
    emergency_warning_flag: false,
  });

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.patient_name || !newPatient.primary_symptom) return;

    const newTicket: TriageTicket = {
      id: Date.now(),
      ticket_number: `ER-${currentCity.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      patient_name: `${newPatient.patient_name} (Demo Patient)`,
      age: parseInt(newPatient.age) || 30,
      gender: newPatient.gender,
      city: currentCity,
      facility_name: `Government General Hospital (GGH) ${currentCity}`,
      primary_symptom: newPatient.primary_symptom,
      vitals_summary: newPatient.vitals_summary,
      urgency_level: newPatient.urgency_level,
      emergency_warning_flag: newPatient.emergency_warning_flag,
      status: 'WAITING',
      est_wait_minutes: newPatient.urgency_level === 'LEVEL_1_RESUSCITATION' ? 0 : 30,
      reassessment_notes: 'Staff triaged entry. Monitoring vitals.',
    };

    setTickets([newTicket, ...tickets]);
    setShowAddForm(false);
    setNewPatient({
      patient_name: '',
      age: '',
      gender: 'Male',
      primary_symptom: '',
      vitals_summary: 'BP 120/80 mmHg, Pulse 76 bpm, SpO2 98%',
      urgency_level: 'LEVEL_3_URGENT',
      emergency_warning_flag: false,
    });
  };

  const handleUpdateStatus = (id: number | undefined, newStatus: TriageTicket['status']) => {
    if (!id) return;
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getUrgencyBadge = (level: TriageTicket['urgency_level']) => {
    switch (level) {
      case 'LEVEL_1_RESUSCITATION':
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">Level 1: Resuscitation (Immediate)</span>;
      case 'LEVEL_2_EMERGENCY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">Level 2: Emergency (&lt;15 min)</span>;
      case 'LEVEL_3_URGENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">Level 3: Urgent (&lt;30 min)</span>;
      case 'LEVEL_4_SEMI_URGENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">Level 4: Semi-Urgent</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500 text-white">Level 5: Non-Urgent</span>;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Hospital Staff Triage System
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dynamic Hospital Emergency Queue: {currentCity}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Clinical triage demonstration prioritizing evaluated medical urgency rather than first-come arrival.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel Entry' : '+ Triage New Patient'}</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Fictional Demonstration Mode:</strong> All patient records shown in this queue workflow are synthetic demonstration cases clearly labelled for hackathon evaluation. No genuine confidential patient health records are displayed.
        </div>
      </div>

      {/* New Triage Intake Form */}
      {showAddForm && (
        <form onSubmit={handleAddTicket} className="mb-8 p-6 bg-white rounded-3xl border border-sky-200 shadow-md space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <span>Emergency Department Patient Intake & Urgency Classification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={newPatient.patient_name}
                onChange={(e) => setNewPatient({ ...newPatient, patient_name: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                required
                placeholder="e.g. 45"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Symptoms & Complaint</label>
              <input
                type="text"
                required
                placeholder="e.g. Sudden severe headache with numbness"
                value={newPatient.primary_symptom}
                onChange={(e) => setNewPatient({ ...newPatient, primary_symptom: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vital Signs Summary</label>
              <input
                type="text"
                value={newPatient.vitals_summary}
                onChange={(e) => setNewPatient({ ...newPatient, vitals_summary: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Urgency Classification</label>
              <select
                value={newPatient.urgency_level}
                onChange={(e) => setNewPatient({ ...newPatient, urgency_level: e.target.value as any })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
              >
                <option value="LEVEL_1_RESUSCITATION">Level 1: Resuscitation (Immediate Life Threat)</option>
                <option value="LEVEL_2_EMERGENCY">Level 2: Emergency (Under 15 mins)</option>
                <option value="LEVEL_3_URGENT">Level 3: Urgent (Under 30 mins)</option>
                <option value="LEVEL_4_SEMI_URGENT">Level 4: Semi-Urgent (Under 60 mins)</option>
                <option value="LEVEL_5_NON_URGENT">Level 5: Non-Urgent (Under 120 mins)</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPatient.emergency_warning_flag}
                  onChange={(e) => setNewPatient({ ...newPatient, emergency_warning_flag: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Flag with Critical Emergency Warning Icon</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              Admit into Triage Queue
            </button>
          </div>
        </form>
      )}

      {/* Patient Queue Cards List */}
      <div className="space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className={`p-5 rounded-2xl border transition shadow-xs bg-white ${
              t.emergency_warning_flag || t.urgency_level === 'LEVEL_1_RESUSCITATION'
                ? 'border-red-300 ring-1 ring-red-200'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {t.ticket_number}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {t.patient_name} • {t.age} yrs ({t.gender})
                  </h4>
                  <div className="text-xs text-slate-500">
                    Hospital: {t.facility_name} ({t.city})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getUrgencyBadge(t.urgency_level)}
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-700">Primary Complaint:</span>{' '}
                <span className="text-slate-900 font-medium">{t.primary_symptom}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Clinical Vitals:</span>{' '}
                <span className="text-slate-900 font-medium">{t.vitals_summary}</span>
              </div>
              <div className="md:col-span-2 text-slate-600 italic">
                <strong>Staff Notes:</strong> "{t.reassessment_notes}"
              </div>
            </div>

            {/* Staff Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Est. Doctor Evaluation: <strong>{t.est_wait_minutes === 0 ? 'Immediate (0 min)' : `${t.est_wait_minutes} mins`}</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700 mr-1">Update Status:</span>
                {(['WAITING', 'TRIAGED', 'UNDER_EVALUATION', 'STABILIZED', 'DISCHARGED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(t.id, st)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                      t.status === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
