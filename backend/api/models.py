from django.db import models
from django.utils import timezone

class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    state = models.CharField(max_length=100, default="Andhra Pradesh")
    latitude = models.FloatField()
    longitude = models.FloatField()
    emergency_phone = models.CharField(max_length=50, default="112")
    medical_emergency_phone = models.CharField(max_length=50, default="108")
    district_helpline = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name}, {self.state}"

class Facility(models.Model):
    CATEGORY_CHOICES = [
        ('GOVERNMENT_HOSPITAL', 'Government General Hospital'),
        ('TEACHING_HOSPITAL', 'Medical College / Teaching Hospital'),
        ('PRIVATE_HOSPITAL', 'Private Hospital'),
        ('SPECIALTY_HOSPITAL', 'Specialty Hospital / Eye / Maternity'),
        ('DIAGNOSTIC_CENTRE', 'Diagnostic & Imaging Centre'),
        ('BLOOD_BANK', 'Blood Bank / Component Facility'),
    ]

    BED_STATUS_CHOICES = [
        ('CONFIRMED_AVAILABLE', 'Confirmed Available'),
        ('CONFIRMED_UNAVAILABLE', 'Confirmed Unavailable'),
        ('AVAILABILITY_NOT_CONFIRMED', 'Availability Not Confirmed'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    city = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    contact_phone = models.CharField(max_length=100)
    emergency_services = models.BooleanField(default=True)
    specialties = models.JSONField(default=list, blank=True)
    bed_status = models.CharField(max_length=50, choices=BED_STATUS_CHOICES, default='AVAILABILITY_NOT_CONFIRMED')
    bed_status_note = models.CharField(max_length=255, default='Availability not confirmed. Contact hospital directly before transit.')
    bed_status_updated_at = models.DateTimeField(default=timezone.now)
    bed_status_source = models.CharField(max_length=255, default='Official Hospital Desk Verification')
    total_beds = models.IntegerField(default=0)
    icu_beds = models.IntegerField(default=0)
    official_website = models.URLField(blank=True, max_length=500)
    booking_url = models.URLField(blank=True, max_length=500)
    opening_hours = models.CharField(max_length=150, default='24/7 Emergency Services')
    verification_status = models.CharField(max_length=50, default='Verified Official Facility')
    verification_source = models.CharField(max_length=255, default='AP State Health Directory / Official Portal')
    verification_date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.name} ({self.city})"

class Doctor(models.Model):
    CONSULT_CHOICES = [
        ('IN_PERSON', 'In-Person Consultation'),
        ('ONLINE', 'Teleconsultation'),
        ('BOTH', 'In-Person & Teleconsultation'),
    ]

    name = models.CharField(max_length=200)
    qualifications = models.CharField(max_length=200)
    specialty = models.CharField(max_length=150)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='doctors', null=True, blank=True)
    facility_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=100, default='APMC Verified')
    consultation_type = models.CharField(max_length=50, choices=CONSULT_CHOICES, default='IN_PERSON')
    consultation_fee = models.CharField(max_length=100, default='Free / Subsidized OPD')
    availability_schedule = models.CharField(max_length=255, default='Mon-Sat: 09:00 AM - 01:00 PM')
    official_contact = models.CharField(max_length=100)
    official_booking_url = models.URLField(blank=True, max_length=500)
    verified_date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - {self.specialty} ({self.city})"

class Pharmacy(models.Model):
    PHARMACY_TYPES = [
        ('JAN_AUSHADHI', 'PMBJP Pradhan Mantri Jan Aushadhi Kendra'),
        ('RETAIL_CHAIN', 'Verified Pharmacy Chain'),
        ('COMMUNITY_PHARMACY', 'Community Medical Store'),
    ]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=PHARMACY_TYPES, default='JAN_AUSHADHI')
    city = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    contact_phone = models.CharField(max_length=100)
    operating_hours = models.CharField(max_length=150, default='08:00 AM - 10:00 PM')
    home_delivery = models.BooleanField(default=False)
    stock_disclaimer = models.CharField(
        max_length=255, 
        default='Live stock must be confirmed by calling the pharmacy before transit.'
    )
    verification_source = models.CharField(max_length=255, default='PMBJP Official Directory / Drug Inspector Register')

    def __str__(self):
        return f"{self.name} - {self.city}"

class Medicine(models.Model):
    brand_name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=255)
    strength = models.CharField(max_length=100)
    dosage_form = models.CharField(max_length=100, default='Tablet')
    brand_manufacturer = models.CharField(max_length=200)
    brand_pack_size = models.CharField(max_length=100, default='10 Tablets')
    brand_price = models.DecimalField(max_digits=8, decimal_places=2)
    jan_aushadhi_name = models.CharField(max_length=255)
    jan_aushadhi_pack_size = models.CharField(max_length=100, default='10 Tablets')
    jan_aushadhi_price = models.DecimalField(max_digits=8, decimal_places=2)
    savings_percentage = models.DecimalField(max_digits=5, decimal_places=1)
    clinical_notes = models.TextField(
        default='Bioequivalent active ingredient. Any prescription change must be confirmed by a licensed medical practitioner or pharmacist.'
    )

    def __str__(self):
        return f"{self.brand_name} vs {self.jan_aushadhi_name} ({self.strength})"

class AmbulanceProvider(models.Model):
    SERVICE_CHOICES = [
        ('GOVT_FREE', 'Government Emergency Response (Free)'),
        ('ALS', 'Advanced Life Support (ALS)'),
        ('BLS', 'Basic Life Support (BLS)'),
    ]

    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=100)
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES, default='GOVT_FREE')
    coverage_area = models.CharField(max_length=255, default='District-wide & National Highway Corridor')
    notes = models.CharField(max_length=255, default='Official Emergency Calling Service. Direct dispatch via 108/112.')

    def __str__(self):
        return f"{self.name} ({self.city}) - {self.contact_phone}"

class TriageTicket(models.Model):
    LEVEL_CHOICES = [
        ('LEVEL_1_RESUSCITATION', 'Level 1: Resuscitation (Immediate)'),
        ('LEVEL_2_EMERGENCY', 'Level 2: Emergency (< 15 mins)'),
        ('LEVEL_3_URGENT', 'Level 3: Urgent (< 30 mins)'),
        ('LEVEL_4_SEMI_URGENT', 'Level 4: Semi-Urgent (< 60 mins)'),
        ('LEVEL_5_NON_URGENT', 'Level 5: Non-Urgent (< 120 mins)'),
    ]

    STATUS_CHOICES = [
        ('WAITING', 'Waiting for Assessment'),
        ('TRIAGED', 'Triaged by Nurse'),
        ('UNDER_EVALUATION', 'Under Doctor Evaluation'),
        ('STABILIZED', 'Stabilized / Treatment Given'),
        ('DISCHARGED', 'Discharged / Admitted'),
    ]

    ticket_number = models.CharField(max_length=50, unique=True)
    patient_name = models.CharField(max_length=200)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    facility_name = models.CharField(max_length=255)
    primary_symptom = models.CharField(max_length=255)
    vitals_summary = models.CharField(max_length=255, default='BP 120/80, Pulse 76, SpO2 98%')
    urgency_level = models.CharField(max_length=50, choices=LEVEL_CHOICES, default='LEVEL_3_URGENT')
    emergency_warning_flag = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='WAITING')
    est_wait_minutes = models.IntegerField(default=25)
    reassessment_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.ticket_number}] {self.patient_name} - {self.urgency_level}"

class EmergencyPassport(models.Model):
    mobile_number = models.CharField(max_length=20, unique=True)
    patient_name = models.CharField(max_length=200, default='Registered Patient')
    blood_group = models.CharField(max_length=10, default='O+')
    allergies = models.TextField(blank=True, default='None reported')
    chronic_conditions = models.TextField(blank=True, default='None reported')
    current_medications = models.TextField(blank=True, default='None reported')
    emergency_contact_name = models.CharField(max_length=200, blank=True, default='Family Member')
    emergency_contact_phone = models.CharField(max_length=50, blank=True, default='')
    consent_shared = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Passport: {self.patient_name} ({self.blood_group})"

class OtpSession(models.Model):
    mobile_number = models.CharField(max_length=20)
    otp_code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    is_dev_mode = models.BooleanField(default=True)

    def __str__(self):
        return f"OTP for {self.mobile_number}: {self.is_verified}"
