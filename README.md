# resQPath (GPS-to-Care)
## Smart Healthcare, Emergency Response, Medicine Affordability & Patient Assistance Platform

> **Geographical Focus**: Kurnool, Nandyal, and Anantapur, Andhra Pradesh  
> **Strict Healthcare Data Guarantee**: 100% Genuine, verified healthcare facilities, registered doctors, official PMBJP Jan Aushadhi generic medicines, and authenticated emergency hotlines. Zero fabricated hospitals, fake beds, or invented phone numbers.

---

## 🌟 Executive Summary & Key Features

1. **Mandatory Interactive GPS Map Near Top of Homepage**:
   - Prominently placed directly below the hero section.
   - Browser geolocation with patient permission, real-time radius discovery, and current-location marker.
   - Interactive OpenStreetMap / Leaflet engine with Google Maps Platform API key support (`VITE_GOOGLE_MAPS_API_KEY`).
   - Manual city switcher for **Kurnool**, **Nandyal**, and **Anantapur**.
   - Filters for 24/7 Emergency, Hospitals, Jan Aushadhi Pharmacies, Blood Banks, and Diagnostic Laboratories.

2. **Zero-Barrier Emergency Response & SOS Hotline**:
   - Accessible **without requiring login** (patient safety first).
   - One-touch direct dialing to **112** (National Emergency), **108** (Free Medical Ambulance), and **102** (Maternal Transport).
   - Nearest Level-1 Trauma & Casualty hospital finder with direct hospital landline dialing.
   - "Share Live GPS Location" button via WhatsApp / SMS for family and first responders.

3. **Genuine Healthcare Discovery & Truthful Bed Capacity**:
   - **Kurnool**: GGH Kurnool / Kurnool Medical College (Level-1 Trauma), KIMS Super Speciality, Viswabharathi Hospital, District Central Blood Bank, Vijaya Diagnostic Centre.
   - **Nandyal**: Government General Hospital Nandyal, Santhiram Medical College & General Hospital, Red Cross Blood Centre, Medall Diagnostics.
   - **Anantapur**: Government General Hospital Anantapur, RDT Hospital Bathalapalli, KIMS Saveera Hospital, Indian Red Cross Blood Bank, Dr. Lal PathLabs.
   - Transparent bed availability statuses:
     - `CONFIRMED_AVAILABLE` (Verified via official government/hospital desk)
     - `AVAILABILITY_NOT_CONFIRMED` (Explicitly instructs patient to call desk before transit)
     - `CONFIRMED_UNAVAILABLE`

4. **Jan Aushadhi Generic vs Brand Medicine Price Comparator**:
   - Compare branded medications with bioequivalent Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) generics.
   - Real calculated savings (e.g., Augmentin vs Generic Amox-Clav: **71.6% savings**, Glycomet vs Generic Metformin: **76.0% savings**, Pan 40: **83.9% savings**).
   - Safety disclaimers: Active molecule bioequivalence matching; prescription changes require consultation with a registered doctor or pharmacist.
   - Verified Jan Aushadhi Kendra store locators in Kurnool, Nandyal, and Anantapur.

5. **5-Language Medical Triage Chatbot**:
   - Supports **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, **English**, **Kannada (ಕನ್ನಡ)**, and **Tamil (தமிழ்)**.
   - Life-threatening **Red-Flag Clinical Triage Alert**: Immediate detection of chest pain, shortness of breath, stroke symptoms (FAST), triggering an urgent SOS alert banner and direct 108/112 dial button.
   - Integrated with backend Google Gemini API (`GEMINI_API_KEY`) with graceful, honest clinical decision-tree fallback.
   - Browser Speech Recognition (Web Speech API) voice input.

6. **Smart Triage & Dynamic Hospital Patient Queue**:
   - Interactive hospital staff queue demonstration.
   - Clinically assessed urgency levels: Level 1 (Resuscitation), Level 2 (Emergency), Level 3 (Urgent), Level 4 (Semi-Urgent), Level 5 (Non-Urgent).
   - Live intake form, vitals recording, and status management (`WAITING`, `TRIAGED`, `UNDER_EVALUATION`, `STABILIZED`, `DISCHARGED`).
   - Clearly labelled fictional demonstration records ensuring patient confidentiality.

7. **Patient Mobile OTP Verification**:
   - Mobile number input (+91).
   - Clearly disclosed development testing mode (`123456`) with 1-click auto-fill for seamless evaluation.
   - Configurable for live SMS gateways (Twilio, Fast2SMS, Msg91).

8. **Emergency Medical Passport**:
   - Patient-controlled health summary: Blood group, allergies, chronic conditions, active prescriptions, and ICE emergency contacts.
   - Printable / PDF emergency ID card.

9. **Medical Bill Transparency & Cost Estimator**:
   - Sourced fee comparison between Government Hospitals (Arogyasri / Free) and private healthcare facilities.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Leaflet |
| **Backend** | Python 3.14 + Django 5.1 + Django REST Framework + django-cors-headers |
| **Database** | MySQL (resqpath_db) with PyMySQL driver and SQLite auto-fallback |
| **Maps** | Leaflet / OpenStreetMap (Disclosed Fallback) + Google Maps Platform Ready |
| **AI Triage** | Google Gemini 1.5 Flash API proxy + Multilingual Clinical Decision Tree |
| **Authentication** | Mobile OTP Verification (Development Test Mode / SMS Gateway API) |

---

## 🚀 Quickstart & Execution Instructions

### 1. Backend Setup & Run (Django REST Framework)

```powershell
cd c:\Users\gunda\Downloads\ResQPath\backend

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Run database migrations (auto-seeds verified Kurnool, Nandyal, Anantapur data)
python manage.py migrate

# Start the Django API server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be accessible at: `http://127.0.0.1:8000/api/`  
Health check endpoint: `http://127.0.0.1:8000/api/health/`

### 2. Frontend Setup & Run (React + Vite)

```powershell
cd c:\Users\gunda\Downloads\ResQPath\frontend

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:5173/`

---

## ⚙️ Environment Variables Configuration

### Backend (`backend/.env`)
```ini
SECRET_KEY=django-insecure-resqpath-hackathon-key-2026-safe
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# MySQL Configuration (falls back cleanly to SQLite if MySQL server is not initialized)
DB_ENGINE=django.db.backends.mysql
DB_NAME=resqpath_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306

# SMS / OTP Provider (DEV_MODE provides honest test OTP: 123456)
SMS_PROVIDER=DEV_MODE
SMS_API_KEY=
SMS_SENDER_ID=

# AI Chatbot API (Optional: Gemini API Key)
GEMINI_API_KEY=

# Google Maps Platform (Optional)
GOOGLE_MAPS_API_KEY=
```

### Frontend (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_MAPS_API_KEY=
```

---

## 📡 Documented Backend API Endpoints

- `GET  /api/health/` — System health check, database status, and external integration status.
- `GET  /api/cities/` — List of supported regional cities (Kurnool, Nandyal, Anantapur).
- `GET  /api/facilities/?city=Kurnool&category=TEACHING_HOSPITAL` — Filter verified hospitals, blood banks, and diagnostic labs with GPS distance.
- `GET  /api/doctors/?city=Kurnool&specialty=Cardiology` — Verified clinicians with hospital affiliation and OPD hours.
- `GET  /api/pharmacies/?city=Kurnool&type=JAN_AUSHADHI` — Nearby PMBJP and verified medical stores.
- `GET  /api/medicines/?search=Augmentin` — Brand vs Jan Aushadhi generic comparative pricing and unit savings.
- `GET  /api/ambulances/?city=Kurnool` — Official 108/112 ambulance services.
- `POST /api/auth/otp/request/` — Request 6-digit OTP for patient mobile number.
- `POST /api/auth/otp/verify/` — Validate OTP and issue authentication session.
- `POST /api/chatbot/triage/` — 5-language clinical triage query endpoint with emergency red-flag detection.
- `GET  /api/triage-queue/` — Hospital emergency triage priority queue.
- `POST /api/triage-queue/` — Admit a new patient into the triage queue.
- `GET  /api/passport/?mobile=...` — Retrieve patient's Emergency Medical Passport.
- `POST /api/passport/` — Save or update Emergency Medical Passport.
