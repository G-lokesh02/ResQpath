from rest_framework import serializers
from .models import (
    City, Facility, Doctor, Pharmacy, Medicine, 
    AmbulanceProvider, TriageTicket, EmergencyPassport, OtpSession
)

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class FacilitySerializer(serializers.ModelSerializer):
    doctors = DoctorSerializer(many=True, read_only=True)

    class Meta:
        model = Facility
        fields = '__all__'

class PharmacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pharmacy
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

class AmbulanceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceProvider
        fields = '__all__'

class TriageTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = TriageTicket
        fields = '__all__'

class EmergencyPassportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyPassport
        fields = '__all__'
