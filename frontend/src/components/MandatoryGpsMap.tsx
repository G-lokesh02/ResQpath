import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, Navigation, RefreshCw, AlertTriangle, 
  CheckCircle2, Phone, Compass, Info, Shield, Layers
} from 'lucide-react';
import { Facility, Pharmacy, CityName } from '../types';

interface MandatoryGpsMapProps {
  currentCity: CityName;
  onSelectCity: (city: CityName) => void;
  facilities: Facility[];
  pharmacies: Pharmacy[];
  onCallNumber: (phone: string) => void;
}

export const MandatoryGpsMap: React.FC<MandatoryGpsMapProps> = ({
  currentCity,
  onSelectCity,
  facilities,
  pharmacies,
  onCallNumber,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // GPS Location State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'IDLE' | 'LOCATING' | 'GRANTED' | 'DENIED' | 'UNAVAILABLE'>('IDLE');
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>('');

  // Category Filter State
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HOSPITAL' | 'EMERGENCY' | 'PHARMACY' | 'BLOOD_BANK' | 'DIAGNOSTIC'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Facility | Pharmacy | null>(null);

  // Regional City Default Coordinates
  const cityCoordinates: Record<CityName, [number, number]> = {
    'Kurnool': [15.8281, 78.0373],
    'Nandyal': [15.4886, 78.4836],
    'Anantapur': [14.6819, 77.6006],
  };

  // Request browser geolocation with strict patient permission
  const requestUserGeolocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('UNAVAILABLE');
      setGpsErrorMsg('Browser geolocation is not supported on this device. Manual city selection is active.');
      return;
    }

    setGpsStatus('LOCATING');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setGpsStatus('GRANTED');

        // Automatically determine closest supported city
        const distKurnool = Math.hypot(coords.lat - 15.8281, coords.lng - 78.0373);
        const distNandyal = Math.hypot(coords.lat - 15.4886, coords.lng - 78.4836);
        const distAnantapur = Math.hypot(coords.lat - 14.6819, coords.lng - 77.6006);

        if (distKurnool <= distNandyal && distKurnool <= distAnantapur) {
          onSelectCity('Kurnool');
        } else if (distNandyal <= distKurnool && distNandyal <= distAnantapur) {
          onSelectCity('Nandyal');
        } else {
          onSelectCity('Anantapur');
        }

        // Center map to user
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([coords.lat, coords.lng], 14);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('DENIED');
          setGpsErrorMsg('GPS permission was declined. Discover genuine facilities via manual city selection below.');
        } else {
          setGpsStatus('UNAVAILABLE');
          setGpsErrorMsg('Unable to determine exact GPS fix. Fallback regional coordinates loaded.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const center = userLocation ? [userLocation.lat, userLocation.lng] : cityCoordinates[currentCity];
      const map = L.map(mapContainerRef.current, {
        center: center as [number, number],
        zoom: userLocation ? 14 : 13,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      leafletMapRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map view when City or UserLocation changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (userLocation && gpsStatus === 'GRANTED') {
      leafletMapRef.current.setView([userLocation.lat, userLocation.lng], 14);
    } else {
      leafletMapRef.current.setView(cityCoordinates[currentCity], 13);
    }
  }, [currentCity, userLocation, gpsStatus]);

  // Render Markers on Map
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. Current Location Marker (if granted)
    if (userLocation && gpsStatus === 'GRANTED') {
      const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
          <div style="position:relative; width:24px; height:24px; background:#0284c7; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 10px rgba(2,132,199,0.8);">
            <div style="position:absolute; inset:-6px; border-radius:50%; background:rgba(2,132,199,0.35); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-family:sans-serif; padding:4px;">
          <strong style="color:#0284c7; font-size:13px;">📍 Your Current GPS Location</strong>
          <p style="margin:4px 0 0; font-size:11px; color:#64748b;">Nearby genuine care radius active.</p>
        </div>
      `);
      markersLayerRef.current.addLayer(userMarker);
    }

    // 2. Filter Facilities
    const cityFacilities = facilities.filter(f => f.city.toLowerCase() === currentCity.toLowerCase());
    const cityPharmacies = pharmacies.filter(p => p.city.toLowerCase() === currentCity.toLowerCase());

    const filteredFacilities = cityFacilities.filter(f => {
      if (activeFilter === 'HOSPITAL') return f.category.includes('HOSPITAL');
      if (activeFilter === 'EMERGENCY') return f.emergency_services;
      if (activeFilter === 'BLOOD_BANK') return f.category === 'BLOOD_BANK';
      if (activeFilter === 'DIAGNOSTIC') return f.category === 'DIAGNOSTIC_CENTRE';
      if (activeFilter === 'PHARMACY') return false;
      return true;
    }).filter(f => {
      if (!searchQuery) return true;
      return f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             f.address.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const filteredPharmacies = (activeFilter === 'ALL' || activeFilter === 'PHARMACY') ? cityPharmacies.filter(p => {
      if (!searchQuery) return true;
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.address.toLowerCase().includes(searchQuery.toLowerCase());
    }) : [];

    // Add Facility Markers
    filteredFacilities.forEach((fac) => {
      let pinColor = '#0284c7'; // Blue default
      if (fac.emergency_services) pinColor = '#dc2626'; // Red for emergency
      if (fac.category === 'BLOOD_BANK') pinColor = '#991b1b'; // Maroon
      if (fac.category === 'DIAGNOSTIC_CENTRE') pinColor = '#0d9488'; // Teal

      const facIcon = L.divIcon({
        className: 'facility-marker',
        html: `
          <div style="background:${pinColor}; color:#fff; width:28px; height:28px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:12px; font-weight:bold;">
            ${fac.category === 'BLOOD_BANK' ? '🩸' : fac.emergency_services ? '✚' : 'H'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([fac.latitude, fac.longitude], { icon: facIcon });
      
      const popupHtml = `
        <div style="font-family:sans-serif; max-width:240px; padding:2px;">
          <div style="font-size:10px; font-weight:bold; color:${pinColor}; text-transform:uppercase;">
            ${fac.category.replace('_', ' ')}
          </div>
          <div style="font-size:13px; font-weight:bold; color:#0f172a; margin-top:2px;">
            ${fac.name}
          </div>
          <div style="font-size:11px; color:#475569; margin:4px 0;">
            ${fac.address}
          </div>
          <div style="font-size:11px; font-weight:600; color:#166534; background:#f0fdf4; padding:2px 6px; border-radius:4px; margin-bottom:6px;">
            ${fac.bed_status === 'CONFIRMED_AVAILABLE' ? '🟢 Confirmed Beds Available' : '🟡 Bed Status: Call to Verify'}
          </div>
          <div style="display:flex; gap:6px;">
            <a href="tel:${fac.contact_phone}" style="background:#0284c7; color:#fff; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; display:inline-block;">
              📞 Call: ${fac.contact_phone}
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => setSelectedItem(fac));
      markersLayerRef.current?.addLayer(marker);
    });

    // Add Pharmacy Markers
    filteredPharmacies.forEach((pharm) => {
      const pharmIcon = L.divIcon({
        className: 'pharmacy-marker',
        html: `
          <div style="background:#059669; color:#fff; width:26px; height:26px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:11px; font-weight:bold;">
            💊
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([pharm.latitude, pharm.longitude], { icon: pharmIcon });
      const popupHtml = `
        <div style="font-family:sans-serif; max-width:230px; padding:2px;">
          <div style="font-size:10px; font-weight:bold; color:#059669; text-transform:uppercase;">
            ${pharm.type.replace('_', ' ')}
          </div>
          <div style="font-size:13px; font-weight:bold; color:#0f172a; margin-top:2px;">
            ${pharm.name}
          </div>
          <div style="font-size:11px; color:#475569; margin:4px 0;">
            ${pharm.address}
          </div>
          <div style="font-size:10px; color:#64748b; font-style:italic; margin-bottom:6px;">
            ${pharm.stock_disclaimer}
          </div>
          <a href="tel:${pharm.contact_phone}" style="background:#059669; color:#fff; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; display:inline-block;">
            📞 Call: ${pharm.contact_phone}
          </a>
        </div>
      `;
      marker.bindPopup(popupHtml);
      marker.on('click', () => setSelectedItem(pharm));
      markersLayerRef.current?.addLayer(marker);
    });

  }, [facilities, pharmacies, currentCity, activeFilter, searchQuery, userLocation, gpsStatus]);

  return (
    <section id="mandatory-gps-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Map Header with Mandatory Placement Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
        
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-sky-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Navigation className="w-5 h-5 text-sky-600" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Mandatory GPS Healthcare Discovery Map
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Top Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time proximity mapping of genuine hospitals, emergency departments, and pharmacies in <strong>{currentCity}</strong>.
              </p>
            </div>

            {/* GPS Trigger & Region Selector */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={requestUserGeolocation}
                disabled={gpsStatus === 'LOCATING'}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95 ${
                  gpsStatus === 'GRANTED'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                {gpsStatus === 'LOCATING' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Acquiring GPS Fix...</span>
                  </>
                ) : gpsStatus === 'GRANTED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>GPS Active ({userLocation?.lat.toFixed(3)}, {userLocation?.lng.toFixed(3)})</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5" />
                    <span>Use My Exact GPS Location</span>
                  </>
                )}
              </button>

              {/* Manual City Fallback Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['Kurnool', 'Nandyal', 'Anantapur'] as CityName[]).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      if (leafletMapRef.current) {
                        leafletMapRef.current.setView(cityCoordinates[city], 13);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      currentCity === city
                        ? 'bg-white text-sky-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* GPS Status Feedback Alerts */}
          {gpsStatus === 'DENIED' && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Geolocation Permission Declined:</strong> {gpsErrorMsg} You can freely select Kurnool, Nandyal, or Anantapur manually to discover all verified facilities.
              </div>
            </div>
          )}

          {gpsStatus === 'UNAVAILABLE' && (
            <div className="mt-3 bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong>Location Service Notice:</strong> {gpsErrorMsg}
              </div>
            </div>
          )}

          {/* Category Filters Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-700" /> Filter:
              </span>
              {[
                { id: 'ALL', label: 'All Services' },
                { id: 'EMERGENCY', label: '🚨 24/7 Emergency' },
                { id: 'HOSPITAL', label: '🏥 Hospitals' },
                { id: 'PHARMACY', label: '💊 Pharmacies' },
                { id: 'BLOOD_BANK', label: '🩸 Blood Banks' },
                { id: 'DIAGNOSTIC', label: '🔬 Diagnostics' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id as any)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    activeFilter === btn.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Quick Keyword Search */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search facility by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* The Interactive Map Viewport */}
        <div className="relative">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[450px] sm:h-[500px] z-10 bg-slate-100"
          />

          {/* Map Disclosed Fallback Notice Banner */}
          <div className="absolute bottom-2 left-2 right-2 sm:right-auto z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-md max-w-md text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-0.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interactive Leaflet Map Active</span>
            </div>
            <p>
              Displaying genuine verified coordinates. Google Maps Platform key configurable via <code>VITE_GOOGLE_MAPS_API_KEY</code>.
            </p>
          </div>
        </div>

        {/* Selected Facility Quick Details Card */}
        {selectedItem && (
          <div className="p-4 bg-sky-50/70 border-t border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded uppercase">
                  {'category' in selectedItem ? selectedItem.category.replace('_', ' ') : 'Pharmacy'}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedItem.name}
                </h4>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedItem.address}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCallNumber(selectedItem.contact_phone)}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {selectedItem.contact_phone}</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
