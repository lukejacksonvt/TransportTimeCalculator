import { useState, useRef, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const HOSPITALS = [
  { id: "aro",    name: "Aroostook Medical Center",            city: "Presque Isle", lat: 46.6814, lng: -68.0157 },
  { id: "brig",   name: "Bridgton Hospital",                   city: "Bridgton",     lat: 44.0560, lng: -70.7130 },
  { id: "calais", name: "Calais Regional Hospital",            city: "Calais",       lat: 45.1887, lng: -67.2775 },
  { id: "cmmc",   name: "Central Maine Medical Center",        city: "Lewiston",     lat: 44.0996, lng: -70.2148 },
  { id: "dcmh",   name: "Down East Community Hospital",        city: "Machias",      lat: 44.7166, lng: -67.4637 },
  { id: "emmc",   name: "Eastern Maine Medical Center",        city: "Bangor",       lat: 44.8012, lng: -68.7778 },
  { id: "nfh",    name: "Franklin Memorial Hospital",          city: "Farmington",   lat: 44.6700, lng: -70.1520 },
  { id: "mgh",    name: "Maine General – Augusta",             city: "Augusta",      lat: 44.3106, lng: -69.7795 },
  { id: "mmmc",   name: "Maine Medical Center",                city: "Portland",     lat: 43.6591, lng: -70.2568 },
  { id: "smhc",   name: "Maine Medical Center – Biddeford",   city: "Biddeford",    lat: 43.4887, lng: -70.4534 },
  { id: "mhnc",   name: "Memorial Hospital",                   city: "North Conway", lat: 44.0540, lng: -71.1270 },
  { id: "mh",     name: "Mercy Hospital",                      city: "Portland",     lat: 43.6512, lng: -70.2602 },
  { id: "mid",    name: "Midcoast Medical Center",             city: "Brunswick",    lat: 43.9008, lng: -69.9653 },
  { id: "mch",    name: "Miles & St. Rose – Damariscotta",    city: "Damariscotta", lat: 44.0350, lng: -69.5145 },
  { id: "wbh",    name: "Northern Light – Blue Hill",          city: "Blue Hill",    lat: 44.4066, lng: -68.5930 },
  { id: "pen",    name: "Pen Bay Medical Center",              city: "Rockport",     lat: 44.1860, lng: -69.1060 },
  { id: "rfgh",   name: "Redington-Fairview General Hospital", city: "Skowhegan",   lat: 44.7652, lng: -69.7195 },
  { id: "rum",    name: "Rumford Hospital",                    city: "Rumford",      lat: 44.5545, lng: -70.5484 },
  { id: "scdh",   name: "Sebasticook Valley Health",           city: "Pittsfield",   lat: 44.7787, lng: -69.3817 },
  { id: "stmary", name: "St. Mary's Regional Medical Center",  city: "Lewiston",    lat: 44.1015, lng: -70.2130 },
  { id: "smh",    name: "Stephens Memorial Hospital",          city: "Norway",       lat: 44.2090, lng: -70.5370 },
  { id: "wcgh",   name: "Waldo County General Hospital",       city: "Belfast",      lat: 44.4273, lng: -69.0069 },
  { id: "ych",    name: "York Hospital",                       city: "York",         lat: 43.1690, lng: -70.6470 },
];

const BASES = [
  {
    id: "cmmc_base",
    name: "CMMC Base",
    label: "Central Maine Medical Center",
    city: "Lewiston",
    lat: 44.0996,
    lng: -70.2148,
    restockId: null, // no restock needed
  },
  {
    id: "rodman",
    name: "Rodman Road Base",
    label: "Rodman Road, Auburn",
    city: "Auburn",
    lat: 44.0913,
    lng: -70.2442,
    restockId: "cmmc", // restock at CMMC before returning
  },
];

const CMMC_COORDS = { lat: 44.0996, lng: -70.2148 };

const MAP_STYLES_LIGHT = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e8eff6" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d0dce8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a6a8a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
];

const MAP_STYLES_DARK = [
  { elementType: "geometry", stylers: [{ color: "#0a1520" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a1520" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5a8aaa" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#7aaabb" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#182e3e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0d1e2c" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1a3a50" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#060d14" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#1a3a50" }] },
];

function isDarkHour() {
  const h = new Date().getHours();
  return h >= 20 || h < 6;
}
const BEDSIDE_MIN = 40; // per stop
const BEDSIDE_TOTAL = 80; // both bedsides combined

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function groundMin(miles) {
  return Math.round((miles * 1.35 / 55) * 60 + 5);
}

function flightMin(miles) {
  return Math.round((miles / 172) * 60 + 10);
}

function formatTime(mins) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function calcLegs(base, sending, receiving, mode) {
  const timeFn = mode === "air" ? flightMin : groundMin;

  const dist = (a, b) => haversine(a.lat, a.lng, b.lat, b.lng);

  const leg1 = dist(base, sending);   // base -> sending
  const leg2 = dist(sending, receiving); // sending -> receiving
  const leg3 = base.restockId
    ? dist(receiving, CMMC_COORDS)     // receiving -> CMMC (restock)
    : dist(receiving, base);           // receiving -> base

  const leg4 = base.restockId
    ? dist(CMMC_COORDS, base)          // CMMC -> Rodman Road
    : null;

  const t1 = timeFn(leg1);
  const t2 = timeFn(leg2);
  const t3 = timeFn(leg3);
  const t4 = leg4 ? timeFn(leg4) : null;

  const transit = t1 + t2 + t3 + (t4 || 0);
  const total = transit + BEDSIDE_TOTAL;

  return {
    legs: [
      { label: `${base.city} → ${sending.city}`, miles: Math.round(leg1), time: t1 },
      { label: `${sending.city} → ${receiving.city}`, miles: Math.round(leg2), time: t2 },
      ...(base.restockId
        ? [
            { label: `${receiving.city} → CMMC (restock)`, miles: Math.round(leg3), time: t3 },
            { label: `CMMC → ${base.city}`, miles: Math.round(dist(CMMC_COORDS, base)), time: t4 },
          ]
        : [
            { label: `${receiving.city} → ${base.city}`, miles: Math.round(leg3), time: t3 },
          ]),
    ],
    transit,
    total,
  };
}

export default function App() {
  const [baseId, setBaseId] = useState("");
  const [sendingId, setSendingId] = useState("");
  const [receivingId, setReceivingId] = useState("");
  const [mode, setMode] = useState("ground");

  const base = BASES.find(b => b.id === baseId);
  const sending = HOSPITALS.find(h => h.id === sendingId);
  const receiving = HOSPITALS.find(h => h.id === receivingId);

  // --- all state up front ---
  const [isDark, setIsDark] = useState(isDarkHour);
  const [isLoaded, setIsLoaded] = useState(false);
  const [groundRoute, setGroundRoute] = useState(null);

  // --- derived values ---
  const valid = base && sending && receiving && sendingId !== receivingId;
  const isRodman = base?.restockId != null;

  const haverResult = valid ? calcLegs(base, sending, receiving, mode) : null;
  const result = (() => {
    if (!haverResult || mode !== "ground" || !groundRoute) return haverResult;
    const apiLegs = groundRoute.routes[0].legs;
    const updatedLegs = haverResult.legs.map((leg, i) => ({
      ...leg,
      time: apiLegs[i] ? Math.round(apiLegs[i].duration.value / 60) : leg.time,
      miles: apiLegs[i] ? Math.round(apiLegs[i].distance.value / 1609.34) : leg.miles,
    }));
    const transit = updatedLegs.reduce((sum, l) => sum + l.time, 0);
    return { ...haverResult, legs: updatedLegs, transit, total: transit + BEDSIDE_TOTAL };
  })();
  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    const id = setInterval(() => setIsDark(isDarkHour()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!valid || !isLoaded || mode !== "ground") { setGroundRoute(null); return; }
    const svc = new window.google.maps.DirectionsService();
    const waypoints = [
      { location: { lat: sending.lat, lng: sending.lng }, stopover: true },
      { location: { lat: receiving.lat, lng: receiving.lng }, stopover: true },
      ...(base.restockId ? [{ location: CMMC_COORDS, stopover: true }] : []),
    ];
    svc.route({
      origin: { lat: base.lat, lng: base.lng },
      destination: { lat: base.lat, lng: base.lng },
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
    }, (res, status) => setGroundRoute(status === "OK" ? res : null));
  }, [baseId, sendingId, receivingId, mode, isLoaded]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      version: "weekly",
    });
    loader.load().then(() => setIsLoaded(true));
  }, []);

  // Init map when div mounts and API is ready
  useEffect(() => {
    if (!isLoaded || !mapDivRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapDivRef.current, {
      center: { lat: 44.5, lng: -69.5 },
      zoom: 7,
      styles: isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "cooperative",
    });
  }, [isLoaded, result]);

  // Update map styles when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setOptions({ styles: isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT });
  }, [isDark]);

  // Update markers, polyline, and fitBounds when route changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
    if (!valid) return;

    const mkr = (position, fillColor, strokeColor) => {
      const m = new window.google.maps.Marker({
        position, map: mapInstanceRef.current,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 9,
          fillColor, fillOpacity: 1, strokeColor, strokeWeight: 2 }
      });
      markersRef.current.push(m);
    };
    mkr({ lat: base.lat, lng: base.lng }, "#2e5a72", "#4a8aaa");
    mkr({ lat: sending.lat, lng: sending.lng }, "#d4a820", "#f0c840");
    mkr({ lat: receiving.lat, lng: receiving.lng }, "#1e7a48", "#2eb868");

    const isGroundWithRoute = mode === "ground" && groundRoute;
    const path = isGroundWithRoute
      ? groundRoute.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))
      : [
          { lat: base.lat, lng: base.lng },
          { lat: sending.lat, lng: sending.lng },
          { lat: receiving.lat, lng: receiving.lng },
          ...(base.restockId ? [CMMC_COORDS] : []),
          { lat: base.lat, lng: base.lng },
        ];

    polylineRef.current = new window.google.maps.Polyline({
      path, map: mapInstanceRef.current,
      strokeColor: mode === "air" ? "#1e9a58" : "#d4a820",
      strokeOpacity: 0.85, strokeWeight: 3,
    });

    if (isGroundWithRoute) {
      mapInstanceRef.current.fitBounds(groundRoute.routes[0].bounds, 60);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(pt => bounds.extend(pt));
      mapInstanceRef.current.fitBounds(bounds, 60);
    }
  }, [valid, baseId, sendingId, receivingId, mode, groundRoute]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #f0f4f8;
          color: #2a4060;
          font-family: 'Barlow Condensed', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 48px;
        }
        .wrap { width: 100%; max-width: 580px; }

        /* HEADER */
        .header { margin-bottom: 24px; }
        .header-row { display: flex; align-items: center; gap: 12px; }
        .sol { width: 36px; height: 36px; }
        .title { font-size: 24px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1a2d40; line-height: 1; }
        .sub { font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: #8aaac4; margin-top: 5px; }

        /* CARD */
        .card {
          background: #ffffff;
          border: 1px solid #dde6ef;
          border-radius: 4px;
          padding: 22px;
          position: relative;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: linear-gradient(to bottom, #c49a00, #1a7040);
          border-radius: 4px 0 0 4px;
        }

        /* SECTION LABEL */
        .sec-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #8aaac4;
          margin-bottom: 8px;
        }

        /* SELECTS */
        .fields { display: flex; flex-direction: column; gap: 14px; }
        .field { display: flex; flex-direction: column; }
        .sel-wrap { position: relative; }
        select {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #cddbe8;
          color: #2a4060;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          padding: 9px 34px 9px 12px;
          border-radius: 2px;
          appearance: none;
          cursor: pointer;
          outline: none;
          transition: border-color 0.18s;
        }
        select:focus { border-color: #c49a00; }
        select option { background: #ffffff; }
        .sel-wrap::after {
          content: '▾';
          position: absolute;
          right: 10px; top: 50%;
          transform: translateY(-50%);
          color: #8aaac4;
          pointer-events: none;
          font-size: 13px;
        }

        /* MODE TOGGLE */
        .mode-row { display: flex; gap: 0; margin-top: 14px; }
        .mode-btn {
          flex: 1;
          background: #f8fafc;
          border: 1px solid #cddbe8;
          color: #8aaac4;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 8px 0;
          cursor: pointer;
          transition: all 0.18s;
        }
        .mode-btn:first-child { border-radius: 2px 0 0 2px; }
        .mode-btn:last-child { border-radius: 0 2px 2px 0; border-left: none; }
        .mode-btn.active.ground { background: #fffbeb; border-color: #c49a00; color: #a07800; }
        .mode-btn.active.air { background: #f0fdf4; border-color: #1a7040; color: #1a7040; }
        .mode-btn:not(.active):hover { border-color: #b0c8e0; color: #4a6a8a; }

        /* DIVIDER */
        .divider {
          display: flex; align-items: center; gap: 10px;
          margin: 20px 0 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          color: #b0c8e0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #e8eff6;
        }

        /* MISSION PROFILE */
        .profile { animation: fadeUp 0.28s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* LEGS */
        .legs { display: flex; flex-direction: column; gap: 0; }
        .leg {
          display: flex;
          align-items: stretch;
          gap: 0;
          position: relative;
        }
        .leg-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 28px;
          flex-shrink: 0;
          padding: 2px 0;
        }
        .leg-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          border: 2px solid #c49a00;
          background: #f0f4f8;
          flex-shrink: 0;
          z-index: 1;
        }
        .leg-dot.green { border-color: #1a7040; }
        .leg-dot.dim { border-color: #b0c8e0; }
        .leg-line {
          flex: 1;
          width: 1px;
          background: #e8eff6;
          margin: 2px 0;
        }
        .leg-content {
          flex: 1;
          padding: 6px 0 14px 8px;
        }
        .leg-route {
          font-size: 14px;
          font-weight: 600;
          color: #2a4060;
          letter-spacing: 0.04em;
        }
        .leg-meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #8aaac4;
          margin-top: 2px;
        }
        .leg-time {
          font-size: 18px;
          font-weight: 700;
          color: #1a2d40;
          margin-top: 1px;
        }

        /* BEDSIDE STOPS */
        .bedside-stop {
          display: flex;
          align-items: stretch;
          gap: 0;
        }
        .bedside-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 28px;
          flex-shrink: 0;
          padding: 2px 0;
        }
        .bedside-dot {
          width: 13px; height: 13px;
          border-radius: 2px;
          background: #fffbeb;
          border: 2px solid #c49a00;
          flex-shrink: 0;
          z-index: 1;
          display: flex; align-items: center; justify-content: center;
          font-size: 7px;
          color: #a07800;
        }
        .bedside-dot.receiving {
          background: #f0fdf4;
          border-color: #1a7040;
          color: #1a7040;
        }
        .bedside-line {
          flex: 1;
          width: 1px;
          background: #e8eff6;
          margin: 2px 0;
        }
        .bedside-content {
          flex: 1;
          padding: 4px 0 14px 8px;
        }
        .bedside-label {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.14em;
          color: #a07800;
          text-transform: uppercase;
        }
        .bedside-label.receiving { color: #1a7040; }
        .bedside-name {
          font-size: 14px;
          font-weight: 600;
          color: #4a6a8a;
          margin-top: 1px;
        }
        .bedside-time {
          font-size: 18px;
          font-weight: 700;
          color: #1a2d40;
          margin-top: 1px;
        }

        /* RESTOCK BADGE */
        .restock-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f0f8ff;
          border: 1px solid #b0c8e0;
          border-radius: 2px;
          padding: 3px 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #6a8aaa;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* TOTALS */
        .totals {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .total-box {
          background: #f8fafc;
          border: 1px solid #dde6ef;
          border-radius: 3px;
          padding: 14px;
        }
        .total-box.highlight {
          border-color: #c49a00;
          background: #fffbeb;
        }
        .total-box.highlight.air {
          border-color: #1a7040;
          background: #f0fdf4;
        }
        .total-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8aaac4;
          margin-bottom: 6px;
        }
        .total-label.gold { color: #a07800; }
        .total-label.green { color: #1a7040; }
        .total-value {
          font-size: 38px;
          font-weight: 800;
          line-height: 1;
          color: #1a2d40;
          letter-spacing: -0.01em;
        }
        .total-breakdown {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #8aaac4;
          margin-top: 6px;
        }

        .hint {
          text-align: center;
          color: #b0c8e0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          padding: 28px 0 8px;
          border-top: 1px dashed #dde6ef;
          margin-top: 18px;
        }

        .disclaimer {
          margin-top: 14px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          color: #9ab0c4;
          letter-spacing: 0.06em;
          border-top: 1px solid #e8eff6;
          padding-top: 10px;
        }

        /* THEME TRANSITIONS */
        body, .card, select, .mode-btn, .total-box, .leg-dot, .bedside-dot {
          transition: background 0.4s, color 0.4s, border-color 0.4s;
        }

        /* DARK THEME OVERRIDES */
        body[data-theme="dark"] { background: #070d14; color: #b8ccd8; }
        body[data-theme="dark"] .title { color: #deeaf2; }
        body[data-theme="dark"] .sub { color: #2e5a72; }
        body[data-theme="dark"] .card { background: #0b1520; border-color: #152434; }
        body[data-theme="dark"] .card::before { background: linear-gradient(to bottom, #d4a820, #1e7a48); }
        body[data-theme="dark"] .sec-label { color: #2e5a72; }
        body[data-theme="dark"] select { background: #060f18; border-color: #152434; color: #b8ccd8; }
        body[data-theme="dark"] select:focus { border-color: #d4a820; }
        body[data-theme="dark"] select option { background: #0b1520; }
        body[data-theme="dark"] .sel-wrap::after { color: #2e5a72; }
        body[data-theme="dark"] .mode-btn { background: #060f18; border-color: #152434; color: #2e5a72; }
        body[data-theme="dark"] .mode-btn.active.ground { background: #1a1400; border-color: #d4a820; color: #d4a820; }
        body[data-theme="dark"] .mode-btn.active.air { background: #001810; border-color: #1e7a48; color: #1e7a48; }
        body[data-theme="dark"] .mode-btn:not(.active):hover { border-color: #2a4a60; color: #5a8a9a; }
        body[data-theme="dark"] .divider { color: #1e3a50; }
        body[data-theme="dark"] .divider::before,
        body[data-theme="dark"] .divider::after { background: #0d2030; }
        body[data-theme="dark"] .leg-dot { border-color: #d4a820; background: #070d14; }
        body[data-theme="dark"] .leg-dot.green { border-color: #1e7a48; }
        body[data-theme="dark"] .leg-dot.dim { border-color: #1e3a50; }
        body[data-theme="dark"] .leg-line { background: #0d2030; }
        body[data-theme="dark"] .leg-route { color: #8aacbe; }
        body[data-theme="dark"] .leg-meta { color: #2e5a72; }
        body[data-theme="dark"] .leg-time { color: #deeaf2; }
        body[data-theme="dark"] .bedside-dot { background: #1a1a0a; border-color: #d4a820; color: #d4a820; }
        body[data-theme="dark"] .bedside-dot.receiving { background: #001810; border-color: #1e7a48; color: #1e7a48; }
        body[data-theme="dark"] .bedside-line { background: #0d2030; }
        body[data-theme="dark"] .bedside-label { color: #d4a820; }
        body[data-theme="dark"] .bedside-label.receiving { color: #1e9a58; }
        body[data-theme="dark"] .bedside-name { color: #7a9ab0; }
        body[data-theme="dark"] .bedside-time { color: #deeaf2; }
        body[data-theme="dark"] .restock-badge { background: #0a0f1a; border-color: #1e3a60; color: #3a6080; }
        body[data-theme="dark"] .total-box { background: #060f18; border-color: #152434; }
        body[data-theme="dark"] .total-box.highlight { border-color: #d4a820; background: #0e0e00; }
        body[data-theme="dark"] .total-box.highlight.air { border-color: #1e7a48; background: #001408; }
        body[data-theme="dark"] .total-label { color: #2e5a72; }
        body[data-theme="dark"] .total-label.gold { color: #a07820; }
        body[data-theme="dark"] .total-label.green { color: #1a6a38; }
        body[data-theme="dark"] .total-value { color: #deeaf2; }
        body[data-theme="dark"] .total-breakdown { color: #2e5a72; }
        body[data-theme="dark"] .hint { color: #152434; border-top-color: #0d1e2c; }
        body[data-theme="dark"] .disclaimer { color: #1a3040; border-top-color: #0a1820; }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="header-row">
            <svg className="sol" viewBox="0 0 100 100" fill="none">
              {[0,60,120].map(a => (
                <rect key={a} x="41" y="8" width="18" height="84" rx="4"
                  fill="#0d1e10" stroke="#1e7a48" strokeWidth="1.5"
                  transform={`rotate(${a} 50 50)`} />
              ))}
              <path d="M50 22 L44 32 H48 V42 H52 V32 H56 Z" fill="#d4a820" />
            </svg>
            <div>
              <div className="title">Mission Time Calculator</div>
              <div className="sub">LifeFlight of Maine · Full Transport Profile</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="fields">
            <div className="field">
              <div className="sec-label">Originating Base</div>
              <div className="sel-wrap">
                <select value={baseId} onChange={e => setBaseId(e.target.value)}>
                  <option value="">— Select base —</option>
                  {BASES.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <div className="sec-label">Sending Hospital</div>
              <div className="sel-wrap">
                <select value={sendingId} onChange={e => setSendingId(e.target.value)}>
                  <option value="">— Select sending hospital —</option>
                  {HOSPITALS.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <div className="sec-label">Receiving Hospital</div>
              <div className="sel-wrap">
                <select value={receivingId} onChange={e => setReceivingId(e.target.value)}>
                  <option value="">— Select receiving hospital —</option>
                  {HOSPITALS.filter(h => h.id !== sendingId).map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mode-row">
            <button
              className={`mode-btn ground${mode === "ground" ? " active ground" : ""}`}
              onClick={() => setMode("ground")}
            >Ground</button>
            <button
              className={`mode-btn air${mode === "air" ? " active air" : ""}`}
              onClick={() => setMode("air")}
            >Air</button>
          </div>

          {result ? (
            <div className="profile" key={`${baseId}-${sendingId}-${receivingId}-${mode}`}>
              <div className="divider">Mission Profile</div>

              <div className="legs">
                {/* Leg 1: Base to Sending */}
                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    <div className="leg-line" />
                  </div>
                  <div className="leg-content">
                    <div className="leg-route">{result.legs[0].label}</div>
                    <div className="leg-meta">{result.legs[0].miles} mi · transit</div>
                    <div className="leg-time">{formatTime(result.legs[0].time)}</div>
                  </div>
                </div>

                {/* Bedside: Sending */}
                <div className="bedside-stop">
                  <div className="bedside-connector">
                    <div className="bedside-dot">+</div>
                    <div className="bedside-line" />
                  </div>
                  <div className="bedside-content">
                    <div className="bedside-label">Bedside · Sending</div>
                    <div className="bedside-name">{sending.name}</div>
                    <div className="bedside-time">{formatTime(BEDSIDE_MIN)}</div>
                  </div>
                </div>

                {/* Leg 2: Sending to Receiving */}
                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    <div className="leg-line" />
                  </div>
                  <div className="leg-content">
                    <div className="leg-route">{result.legs[1].label}</div>
                    <div className="leg-meta">{result.legs[1].miles} mi · transit</div>
                    <div className="leg-time">{formatTime(result.legs[1].time)}</div>
                  </div>
                </div>

                {/* Bedside: Receiving */}
                <div className="bedside-stop">
                  <div className="bedside-connector">
                    <div className="bedside-dot receiving">+</div>
                    <div className="bedside-line" />
                  </div>
                  <div className="bedside-content">
                    <div className="bedside-label receiving">Bedside · Receiving</div>
                    <div className="bedside-name">{receiving.name}</div>
                    <div className="bedside-time">{formatTime(BEDSIDE_MIN)}</div>
                  </div>
                </div>

                {/* Leg 3: back (either to CMMC restock or to base) */}
                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    {isRodman && <div className="leg-line" />}
                  </div>
                  <div className="leg-content">
                    <div className="leg-route">{result.legs[2].label}</div>
                    <div className="leg-meta">{result.legs[2].miles} mi · transit</div>
                    <div className="leg-time">{formatTime(result.legs[2].time)}</div>
                    {isRodman && <div className="restock-badge">⟳ Restock at CMMC</div>}
                  </div>
                </div>

                {/* Leg 4: CMMC to Rodman Road (Rodman only) */}
                {isRodman && result.legs[3] && (
                  <div className="leg">
                    <div className="leg-connector">
                      <div className="leg-dot green" />
                    </div>
                    <div className="leg-content">
                      <div className="leg-route">{result.legs[3].label}</div>
                      <div className="leg-meta">{result.legs[3].miles} mi · return to base</div>
                      <div className="leg-time">{formatTime(result.legs[3].time)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="totals">
                <div className="total-box">
                  <div className="total-label">Transit Only</div>
                  <div className="total-value">{formatTime(result.transit)}</div>
                  <div className="total-breakdown">Driving/flight time</div>
                </div>
                <div className={`total-box highlight${mode === "air" ? " air" : ""}`}>
                  <div className={`total-label ${mode === "air" ? "green" : "gold"}`}>Total Mission</div>
                  <div className="total-value">{formatTime(result.total)}</div>
                  <div className="total-breakdown">Transit + 80 min bedside</div>
                </div>
              </div>

              <div className="disclaimer">
                ⚠ Ground: est. road factor 1.35× avg 55 mph · Air: straight-line 150 kts + 10 min ops · Estimates only — not for clinical decision-making
              </div>
            </div>
          ) : (
            <div className="hint">
              {baseId && sendingId && receivingId && sendingId === receivingId
                ? "Sending and receiving hospitals must differ"
                : "Select base, sending hospital, and receiving hospital"}
            </div>
          )}
        </div>

        {isLoaded && result && (
          <div
            ref={mapDivRef}
            style={{ marginTop: 16, borderRadius: 4, overflow: "hidden", height: 320,
              border: `1px solid ${isDark ? "#152434" : "#dde6ef"}` }}
          />
        )}
      </div>
    </>
  );
}
