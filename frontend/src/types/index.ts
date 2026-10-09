export type CityName = 'Kurnool' | 'Nandyal' | 'Anantapur';

export type LanguageCode = 'en' | 'te' | 'hi' | 'kn' | 'ta';

export interface City {
  id: number;
  name: CityName;
  state: string;
  latitude: number;
  longitude: number;
  emergency_phone: string;
  medical_emergency_phone: string;
  district_helpline: string;
}

export interface Facility {
  id: number;
  name: string;
  category: 'GOVERNMENT_HOSPITAL' | 'TEACHING_HOSPITAL' | 'PRIVATE_HOSPITAL' | 'SPECIALTY_HOSPITAL' | 'DIAGNOSTIC_CENTRE' | 'BLOOD_BANK';
  city: CityName;
  address: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  emergency_services: boolean;
  specialties: string[];
  bed_status: 'CONFIRMED_AVAILABLE' | 'CONFIRMED_UNAVAILABLE' | 'AVAILABILITY_NOT_CONFIRMED';
  bed_status_note: string;
  bed_status_updated_at?: string;
  bed_status_source: string;
  total_beds: number;
  icu_beds: number;
  official_website: string;
  booking_url: string;
  opening_hours: string;
  verification_status: string;
  verification_source: string;
  verification_date: string;
  distance_km?: number;
}

export interface Doctor {
  id: number;
  name: string;
  qualifications: string;
  specialty: string;
  facility_name: string;
  city: CityName;
  registration_number: string;
  consultation_type: 'IN_PERSON' | 'ONLINE' | 'BOTH';
  consultation_fee: string;
  availability_schedule: string;
  official_contact: string;
  official_booking_url: string;
  verified_date: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  type: 'JAN_AUSHADHI' | 'RETAIL_CHAIN' | 'COMMUNITY_PHARMACY';
  city: CityName;
  address: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  operating_hours: string;
  home_delivery: boolean;
  stock_disclaimer: string;
  verification_source: string;
  distance_km?: number;
}

export interface Medicine {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  brand_manufacturer: string;
  brand_pack_size: string;
  brand_price: number | string;
  jan_aushadhi_name: string;
  jan_aushadhi_pack_size: string;
  jan_aushadhi_price: number | string;
  savings_percentage: number | string;
  clinical_notes: string;
}

export interface AmbulanceProvider {
  id: number;
  name: string;
  city: CityName;
  contact_phone: string;
  service_type: 'GOVT_FREE' | 'ALS' | 'BLS';
  coverage_area: string;
  notes: string;
}

export interface TriageTicket {
  id?: number;
  ticket_number: string;
  patient_name: string;
  age: number;
  gender: string;
  city: string;
  facility_name: string;
  primary_symptom: string;
  vitals_summary: string;
  urgency_level: 'LEVEL_1_RESUSCITATION' | 'LEVEL_2_EMERGENCY' | 'LEVEL_3_URGENT' | 'LEVEL_4_SEMI_URGENT' | 'LEVEL_5_NON_URGENT';
  emergency_warning_flag: boolean;
  status: 'WAITING' | 'TRIAGED' | 'UNDER_EVALUATION' | 'STABILIZED' | 'DISCHARGED';
  est_wait_minutes: number;
  reassessment_notes?: string;
  created_at?: string;
}

export interface EmergencyPassport {
  mobile_number: string;
  patient_name: string;
  blood_group: string;
  allergies: string;
  chronic_conditions: string;
  current_medications: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  consent_shared: boolean;
}

export interface UserSession {
  name: string;
  mobile: string;
  blood_group?: string;
  auth_mode: string;
}
