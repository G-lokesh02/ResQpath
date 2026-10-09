from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CityListView, FacilityListView, DoctorListView,
    PharmacyListView, MedicineListView, AmbulanceListView,
    OtpRequestView, OtpVerifyView, ChatbotTriageView,
    TriageQueueViewSet, EmergencyPassportView, health_check
)

router = DefaultRouter()
router.register(r'triage-queue', TriageQueueViewSet, basename='triage-queue')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('cities/', CityListView.as_view(), name='cities'),
    path('facilities/', FacilityListView.as_view(), name='facilities'),
    path('doctors/', DoctorListView.as_view(), name='doctors'),
    path('pharmacies/', PharmacyListView.as_view(), name='pharmacies'),
    path('medicines/', MedicineListView.as_view(), name='medicines'),
    path('ambulances/', AmbulanceListView.as_view(), name='ambulances'),
    
    # OTP Auth
    path('auth/otp/request/', OtpRequestView.as_view(), name='otp-request'),
    path('auth/otp/verify/', OtpVerifyView.as_view(), name='otp-verify'),
    
    # AI Chatbot & Clinical Triage
    path('chatbot/triage/', ChatbotTriageView.as_view(), name='chatbot-triage'),
    
    # Emergency Medical Passport
    path('passport/', EmergencyPassportView.as_view(), name='emergency-passport'),
    
    # Router endpoints (Triage Queue)
    path('', include(router.urls)),
]
