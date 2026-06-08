import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { loadConfig } from "./config";

const HOSPITALS = [
  // Maine
  { id: "aro",    state: "ME", name: "Aroostook Medical Center",            city: "Presque Isle",  lat: 46.6814, lng: -68.0157 },
  { id: "brig",   state: "ME", name: "Bridgton Hospital",                   city: "Bridgton",      lat: 44.0560, lng: -70.7130 },
  { id: "cadean", state: "ME", name: "C.A. Dean Hospital",                  city: "Greenville",    lat: 45.4608, lng: -69.5900 },
  { id: "calais", state: "ME", name: "Calais Regional Hospital",            city: "Calais",        lat: 45.1887, lng: -67.2775 },
  { id: "cary",   state: "ME", name: "Cary Medical Center",                 city: "Caribou",       lat: 46.8614, lng: -68.0089 },
  { id: "cmmc",   state: "ME", name: "Central Maine Medical Center",        city: "Lewiston",      lat: 44.0996, lng: -70.2148 },
  { id: "dcmh",   state: "ME", name: "Down East Community Hospital",        city: "Machias",       lat: 44.7166, lng: -67.4637 },
  { id: "emmc",   state: "ME", name: "Eastern Maine Medical Center",        city: "Bangor",        lat: 44.8012, lng: -68.7778 },
  { id: "nfh",    state: "ME", name: "Franklin Memorial Hospital",          city: "Farmington",    lat: 44.6700, lng: -70.1520 },
  { id: "nmmc",   state: "ME", name: "Northern Maine Medical Center",        city: "Fort Kent",     lat: 47.2574, lng: -68.5912 },
  { id: "houlton",state: "ME", name: "Houlton Regional Hospital",           city: "Houlton",       lat: 46.1284, lng: -67.8393 },
  { id: "mgh",    state: "ME", name: "Maine General – Augusta",             city: "Augusta",       lat: 44.3106, lng: -69.7795 },
  { id: "mgt",    state: "ME", name: "Maine General – Thayer",              city: "Waterville",    lat: 44.5516, lng: -69.6350 },
  { id: "mmmc",   state: "ME", name: "Maine Medical Center",                city: "Portland",      lat: 43.6591, lng: -70.2568 },
  { id: "smhc",   state: "ME", name: "Maine Medical Center – Biddeford",    city: "Biddeford",     lat: 43.4887, lng: -70.4534 },
  { id: "mhs",    state: "ME", name: "MaineHealth – Sanford",               city: "Sanford",       lat: 43.4342, lng: -70.7483 },
  { id: "mayo",   state: "ME", name: "Mayo Regional Hospital",              city: "Dover-Foxcroft",lat: 45.1854, lng: -69.2335 },
  { id: "mh",     state: "ME", name: "Mercy Hospital",                      city: "Portland",      lat: 43.6512, lng: -70.2602 },
  { id: "mid",    state: "ME", name: "Midcoast Medical Center",             city: "Brunswick",     lat: 43.9008, lng: -69.9653 },
  { id: "mch",    state: "ME", name: "Miles & St. Rose – Damariscotta",     city: "Damariscotta",  lat: 44.0350, lng: -69.5145 },
  { id: "millin", state: "ME", name: "Millinocket Regional Hospital",       city: "Millinocket",   lat: 45.6568, lng: -68.7106 },
  { id: "mdi",    state: "ME", name: "Mount Desert Island Hospital",        city: "Bar Harbor",    lat: 44.3876, lng: -68.2033 },
  { id: "wbh",    state: "ME", name: "Northern Light – Blue Hill",          city: "Blue Hill",     lat: 44.4066, lng: -68.5930 },
  { id: "nlmch",  state: "ME", name: "Northern Light Maine Coast Hospital", city: "Ellsworth",     lat: 44.5435, lng: -68.4195 },
  { id: "nlsj",   state: "ME", name: "Northern Light St. Joseph Hospital",  city: "Bangor",        lat: 44.8087, lng: -68.7794 },
  { id: "pen",    state: "ME", name: "Pen Bay Medical Center",              city: "Rockport",      lat: 44.1860, lng: -69.1060 },
  { id: "pvh",    state: "ME", name: "Penobscot Valley Hospital",           city: "Lincoln",       lat: 45.3622, lng: -68.4987 },
  { id: "rfgh",   state: "ME", name: "Redington-Fairview General Hospital", city: "Skowhegan",     lat: 44.7652, lng: -69.7195 },
  { id: "rum",    state: "ME", name: "Rumford Hospital",                    city: "Rumford",       lat: 44.5545, lng: -70.5484 },
  { id: "scdh",   state: "ME", name: "Sebasticook Valley Health",           city: "Pittsfield",    lat: 44.7787, lng: -69.3817 },
  { id: "stmary", state: "ME", name: "St. Mary's Regional Medical Center",  city: "Lewiston",      lat: 44.1015, lng: -70.2130 },
  { id: "smh",    state: "ME", name: "Stephens Memorial Hospital",          city: "Norway",        lat: 44.2090, lng: -70.5370 },
  { id: "wcgh",   state: "ME", name: "Waldo County General Hospital",       city: "Belfast",       lat: 44.4273, lng: -69.0069 },
  { id: "ych",    state: "ME", name: "York Hospital",                       city: "York",          lat: 43.1690, lng: -70.6470 },
  // New Hampshire
  { id: "avh",    state: "NH", name: "Androscoggin Valley Hospital",        city: "Berlin",        lat: 44.4778, lng: -71.1853 },
  { id: "cmc",    state: "NH", name: "Catholic Medical Center",             city: "Manchester",    lat: 42.9905, lng: -71.4548 },
  { id: "cheshire",state:"NH", name: "Cheshire Medical Center",             city: "Keene",         lat: 42.9381, lng: -72.2765 },
  { id: "concord",state: "NH", name: "Concord Hospital",                    city: "Concord",       lat: 43.2135, lng: -71.5360 },
  { id: "dhmc",   state: "NH", name: "Dartmouth-Hitchcock Medical Center",  city: "Lebanon",       lat: 43.6389, lng: -72.3198 },
  { id: "elliot", state: "NH", name: "Elliot Hospital",                     city: "Manchester",    lat: 42.9848, lng: -71.4482 },
  { id: "frisbie",state: "NH", name: "Frisbie Memorial Hospital",           city: "Rochester",     lat: 43.2987, lng: -70.9743 },
  { id: "lrgh",   state: "NH", name: "Lakes Region General Hospital",       city: "Laconia",       lat: 43.5248, lng: -71.4695 },
  { id: "littleton",state:"NH",name: "Littleton Regional Hospital",         city: "Littleton",     lat: 44.3036, lng: -71.7803 },
  { id: "mhnc",   state: "NH", name: "Memorial Hospital",                   city: "North Conway",  lat: 44.0540, lng: -71.1270 },
  { id: "porth",  state: "NH", name: "Portsmouth Regional Hospital",        city: "Portsmouth",    lat: 43.0718, lng: -70.7626 },
  { id: "snhmc",  state: "NH", name: "Southern NH Medical Center",          city: "Nashua",        lat: 42.7654, lng: -71.4673 },
  { id: "speare", state: "NH", name: "Speare Memorial Hospital",            city: "Plymouth",      lat: 43.7548, lng: -71.6887 },
  { id: "stjnh",  state: "NH", name: "St. Joseph Hospital",                 city: "Nashua",        lat: 42.7559, lng: -71.4695 },
  { id: "valley", state: "NH", name: "Valley Regional Hospital",            city: "Claremont",     lat: 43.3773, lng: -72.3365 },
  { id: "weeks",  state: "NH", name: "Weeks Medical Center",                city: "Lancaster",     lat: 44.4887, lng: -71.5695 },
  { id: "wdh",    state: "NH", name: "Wentworth-Douglass Hospital",         city: "Dover",         lat: 43.1973, lng: -70.8734 },
  // Massachusetts
  { id: "bidmc",  state: "MA", name: "Beth Israel Deaconess Medical Center",city: "Boston",        lat: 42.3385, lng: -71.1070 },
  { id: "bch",    state: "MA", name: "Boston Children's Hospital",          city: "Boston",        lat: 42.3388, lng: -71.1073 },
  { id: "bwh",    state: "MA", name: "Brigham and Women's Hospital",        city: "Boston",        lat: 42.3359, lng: -71.1065 },
  { id: "lahey",  state: "MA", name: "Lahey Hospital & Medical Center",     city: "Burlington",    lat: 42.5073, lng: -71.2016 },
  { id: "mgh_ma", state: "MA", name: "Massachusetts General Hospital",      city: "Boston",        lat: 42.3629, lng: -71.0686 },
  { id: "tufts",  state: "MA", name: "Tufts Medical Center",                city: "Boston",        lat: 42.3496, lng: -71.0633 },
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
  {
    id: "sanford",
    name: "Sanford Base",
    label: "23 Presidential Ln, Sanford",
    city: "Sanford",
    lat: 43.3982,
    lng: -70.7095,
    restockId: null,
  },
  {
    id: "emmc_base",
    name: "EMMC Base",
    label: "Eastern Maine Medical Center, Bangor",
    city: "Bangor",
    lat: 44.8012,
    lng: -68.7778,
    restockId: null,
  },
  {
    id: "bangor_hangar",
    name: "600 Hangar",
    label: "189 Odlin Rd, Bangor",
    city: "Bangor",
    lat: 44.8050,
    lng: -68.8200,
    restockId: null,
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
const CMMC_STOP_MIN = 15; // blood/narcotics dropoff at CMMC (Rodman only)
const BEDSIDE_TOTAL = 80;  // placeholder for calcLegs; overridden by bedsideMin state in component

const BEDSIDE_PRESETS = [
  { label: "20 min", min: 20 },
  { label: "40 min", min: 40 },
  { label: "60 min", min: 60, hint: "ECMO · Balloon · Impella · Isolette" },
];

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

function bearingDeg(lat1, lng1, lat2, lng2) {
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// Positive = headwind (slows), negative = tailwind (speeds up).
// windDirDeg is meteorological: the direction FROM which wind blows.
function windCorrectedSpeed(airspeedKts, legBearingDeg, windSpeedKts, windDirDeg) {
  const hw = windSpeedKts * Math.cos((windDirDeg - legBearingDeg) * Math.PI / 180);
  return Math.max(airspeedKts - hw, 10);
}

function groundMin(miles, cfg) {
  return Math.round((miles * cfg.groundWindingFactor / cfg.groundSpeedMph) * 60 + cfg.groundOpsMin);
}

function formatTime(mins) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// Parse Routes API duration string e.g. "3600s" → 3600
const parseSecs = s => parseInt(s) || 0;

// Fixed Wing — King Air B200 with Raisbeck EPIC Platinum (defaults; overridden by config)

const AIRPORTS = [
  // Maine
  { id: "bgr", state: "ME", code: "KBGR", city: "Bangor",       lat: 44.8074, lng: -68.8281 },
  { id: "pwm", state: "ME", code: "KPWM", city: "Portland",     lat: 43.6462, lng: -70.3087 },
  { id: "pqi", state: "ME", code: "KPQI", city: "Presque Isle", lat: 46.6889, lng: -68.0447 },
  { id: "fve", state: "ME", code: "KFVE", city: "Frenchville",  lat: 47.2855, lng: -68.3126 },
  { id: "wvl", state: "ME", code: "KWVL", city: "Waterville",   lat: 44.5332, lng: -69.6755 },
  { id: "bhb", state: "ME", code: "KBHB", city: "Bar Harbor",   lat: 44.4498, lng: -68.3616 },
  { id: "mlt", state: "ME", code: "KMLT", city: "Millinocket",  lat: 45.6478, lng: -68.6856 },
  { id: "old", state: "ME", code: "KOLD", city: "Old Town",     lat: 44.9527, lng: -68.6743 },
  { id: "car", state: "ME", code: "KCAR", city: "Caribou",      lat: 46.8715, lng: -68.0179 },
  { id: "hul", state: "ME", code: "KHUL", city: "Houlton",      lat: 46.1231, lng: -67.7921 },
  { id: "pnn", state: "ME", code: "KPNN", city: "Princeton",    lat: 45.2065, lng: -67.5654 },
  { id: "lew", state: "ME", code: "KLEW", city: "Auburn",       lat: 44.0484, lng: -70.2835 },
  { id: "sfm", state: "ME", code: "KSFM", city: "Sanford",      lat: 43.3939, lng: -70.7080 },
  // Massachusetts
  { id: "bos", state: "MA", code: "KBOS", city: "Boston",       lat: 42.3630, lng: -71.0052 },
  { id: "orh", state: "MA", code: "KORH", city: "Worcester",    lat: 42.2673, lng: -71.8757 },
  { id: "ack", state: "MA", code: "KACK", city: "Nantucket",    lat: 41.2531, lng: -70.0600 },
  { id: "bed", state: "MA", code: "KBED", city: "Bedford",      lat: 42.4700, lng: -71.2890 },
  // Vermont
  { id: "btv", state: "VT", code: "KBTV", city: "Burlington",   lat: 44.4720, lng: -73.1533 },
];
const AIRPORT_STATES = [
  { code: "ME", name: "Maine" },
  { code: "MA", name: "Massachusetts" },
  { code: "VT", name: "Vermont" },
];


const BASE_SHIFTS = {
  sanford:       [{ start: 800,  end: 2000 }, { start: 2000, end: 800  }],
  cmmc_base:     [{ start: 1000, end: 2200 }],
  rodman:        [{ start: 1000, end: 2200 }],
  emmc_base:     [{ start: 1900, end: 700  }, { start: 700,  end: 1900 }],
  bangor_hangar: [{ start: 1900, end: 700  }, { start: 700,  end: 1900 }],
};

function getActiveShift(baseId, now, baseShifts) {
  const shifts = baseShifts[baseId];
  if (!shifts) return null;
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const { start, end } of shifts) {
    const startMins = Math.floor(start / 100) * 60 + (start % 100);
    const endMins   = Math.floor(end   / 100) * 60 + (end   % 100);
    const inShift   = endMins > startMins
      ? nowMins >= startMins && nowMins < endMins
      : nowMins >= startMins || nowMins < endMins;
    if (!inShift) continue;
    const shiftEnd = new Date(now);
    shiftEnd.setHours(Math.floor(end / 100), end % 100, 0, 0);
    if (endMins <= startMins && nowMins >= startMins) shiftEnd.setDate(shiftEnd.getDate() + 1);
    const fmt = n => `${String(Math.floor(n / 100)).padStart(2, "0")}${String(n % 100).padStart(2, "0")}`;
    return { label: `${fmt(start)}–${fmt(end)}`, end: shiftEnd };
  }
  return null;
}

function decodePolyline(encoded) {
  const pts = [];
  let i = 0, lat = 0, lng = 0;
  while (i < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = result = 0;
    do { b = encoded.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    pts.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return pts;
}

function makeTempLabel(position, text, className, map) {
  const overlay = new window.google.maps.OverlayView();
  let div;
  overlay.onAdd = function () {
    div = document.createElement("div");
    div.className = `temp-label ${className}`;
    div.textContent = text;
    this.getPanes().overlayLayer.appendChild(div);
  };
  overlay.draw = function () {
    const proj = this.getProjection();
    if (!proj || !div) return;
    const pt = proj.fromLatLngToDivPixel(new window.google.maps.LatLng(position.lat, position.lng));
    if (pt) { div.style.left = pt.x + "px"; div.style.top = pt.y + "px"; }
  };
  overlay.onRemove = function () {
    if (div?.parentNode) div.parentNode.removeChild(div);
    div = null;
  };
  overlay.setMap(map);
  return overlay;
}

async function computeRoute(origin, waypoints, destination) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const res = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes?key=${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "routes.legs.duration,routes.legs.distanceMeters,routes.legs.polyline.encodedPolyline",
    },
    body: JSON.stringify({
      origin:      { location: { latLng: { latitude: origin.lat,      longitude: origin.lng      } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      intermediates: waypoints.map(wp => ({ location: { latLng: { latitude: wp.lat, longitude: wp.lng } } })),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    console.error("Routes API 400:", err?.error?.message ?? JSON.stringify(err));
    return null;
  }
  const data = await res.json();
  return data?.routes?.[0] ?? null;
}


function calcLegs(base, sending, receiving, mode, cfg, windSpeedKts = 0, windDirDeg = 0) {
  const CMMC = { lat: CMMC_COORDS.lat, lng: CMMC_COORDS.lng };
  const dist  = (a, b) => haversine(a.lat, a.lng, b.lat, b.lng);

  const airLeg = (from, to, liftMin = 0) => {
    const miles   = dist(from, to);
    const bearing = bearingDeg(from.lat, from.lng, to.lat, to.lng);
    const gs      = windSpeedKts > 0
      ? windCorrectedSpeed(cfg.rotorSpeedKts, bearing, windSpeedKts, windDirDeg)
      : cfg.rotorSpeedKts;
    return { miles, time: Math.round((miles / gs) * 60 + liftMin), gs: Math.round(gs) };
  };
  const groundLeg = (from, to) => {
    const miles = dist(from, to);
    return { miles, time: groundMin(miles, cfg), gs: null };
  };

  // Lift overhead only on the initial departure leg; subsequent legs covered by bedside time.
  let l1, l2, l3, l4;
  if (mode === "air") {
    l1 = airLeg(base, sending, cfg.rotorOpsMin);
    l2 = airLeg(sending, receiving);
    l3 = base.restockId ? airLeg(receiving, CMMC) : airLeg(receiving, base);
    l4 = base.restockId ? airLeg(CMMC, base) : null;
  } else {
    l1 = groundLeg(base, sending);
    l2 = groundLeg(sending, receiving);
    l3 = base.restockId ? groundLeg(receiving, CMMC) : groundLeg(receiving, base);
    l4 = base.restockId ? groundLeg(CMMC, base) : null;
  }

  const transit = l1.time + l2.time + l3.time + (l4?.time || 0);
  const total   = transit + BEDSIDE_TOTAL + (base.restockId ? CMMC_STOP_MIN : 0);

  return {
    legs: [
      { label: `${base.city} → ${sending.city}`,     miles: Math.round(l1.miles), time: l1.time, gs: l1.gs },
      { label: `${sending.city} → ${receiving.city}`,miles: Math.round(l2.miles), time: l2.time, gs: l2.gs },
      ...(base.restockId
        ? [
            { label: `${receiving.city} → CMMC (restock)`, miles: Math.round(l3.miles), time: l3.time, gs: l3.gs },
            { label: `CMMC → ${base.city}`,                miles: Math.round(dist(CMMC, base)), time: l4.time, gs: l4.gs },
          ]
        : [
            { label: `${receiving.city} → ${base.city}`, miles: Math.round(l3.miles), time: l3.time, gs: l3.gs },
          ]),
    ],
    transit,
    total,
  };
}

const LOAD_TIME = (() => { const d = new Date(); return `${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}`; })();

function HospitalSelect({ value, onChange, placeholder, exclude, pinnedIds, hospitals = HOSPITALS }) {
  const [open, setOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const [nhOpen, setNhOpen] = useState(false);
  const [maOpen, setMaOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const ref = useRef(null);

  const available = exclude ? hospitals.filter(h => h.id !== exclude) : hospitals;
  const pinnedSet = new Set(pinnedIds || []);
  const pinned = pinnedIds ? pinnedIds.map(id => available.find(h => h.id === id)).filter(Boolean) : [];
  const me    = available.filter(h => h.state === "ME" && !pinnedSet.has(h.id));
  const nh    = available.filter(h => h.state === "NH");
  const ma    = available.filter(h => h.state === "MA");
  const other = available.filter(h => !["ME","NH","MA"].includes(h.state) && !pinnedSet.has(h.id));
  const selected = hospitals.find(h => h.id === value);

  useEffect(() => {
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!open && selected) {
      setMeOpen(!pinnedSet.has(selected.id) && selected.state === "ME");
      setNhOpen(selected.state === "NH");
      setMaOpen(selected.state === "MA");
    }
    setOpen(o => !o);
  };

  const pick = id => { onChange(id); setOpen(false); };

  const renderOption = h => (
    <button key={h.id} type="button" className={`hsel-option${value === h.id ? " active" : ""}`} onClick={() => pick(h.id)}>
      {h.name}<span className="hsel-city">{h.city}</span>
    </button>
  );

  return (
    <div className="hsel" ref={ref}>
      <button type="button" className={`hsel-trigger${!value ? " placeholder" : ""}`} onClick={handleToggle}>
        <span>{selected ? `${selected.name} (${selected.city})` : placeholder}</span>
        <span className="hsel-arrow">▾</span>
      </button>
      {open && (
        <div className="hsel-panel">
          {pinned.length > 0 ? (
            <>
              <div className="hsel-state-label">Most Common</div>
              {pinned.map(renderOption)}
              <button type="button" className="hsel-state-toggle" onClick={() => setMeOpen(o => !o)}>
                <span>Maine</span><span>{meOpen ? "▴" : "▾"}</span>
              </button>
              {meOpen && me.map(renderOption)}
            </>
          ) : (
            <>
              <div className="hsel-state-label">Maine</div>
              {me.map(renderOption)}
            </>
          )}
          <button type="button" className="hsel-state-toggle" onClick={() => setNhOpen(o => !o)}>
            <span>New Hampshire</span><span>{nhOpen ? "▴" : "▾"}</span>
          </button>
          {nhOpen && nh.map(renderOption)}
          <button type="button" className="hsel-state-toggle" onClick={() => setMaOpen(o => !o)}>
            <span>Massachusetts</span><span>{maOpen ? "▴" : "▾"}</span>
          </button>
          {maOpen && ma.map(renderOption)}
          {other.length > 0 && <>
            <button type="button" className="hsel-state-toggle" onClick={() => setOtherOpen(o => !o)}>
              <span>Other</span><span>{otherOpen ? "▴" : "▾"}</span>
            </button>
            {otherOpen && other.map(renderOption)}
          </>}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [baseId, setBaseId] = useState("");
  const [crewBaseId, setCrewBaseId] = useState("");
  const [sendingId, setSendingId] = useState("");
  const [receivingId, setReceivingId] = useState("");
  const [mode, setMode] = useState("ground");
  const [hasFuelStop, setHasFuelStop] = useState(false);
  const [fuelStopAirportId, setFuelStopAirportId] = useState("");

  // --- all state up front ---
  const [cfg] = useState(() => loadConfig());
  const [isDark, setIsDark] = useState(() => { const s = localStorage.getItem("theme"); return s ? s === "dark" : isDarkHour(); });
  const [now, setNow] = useState(() => new Date());
  const [includeCmmcStop, setIncludeCmmcStop] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [groundRoute, setGroundRoute] = useState(null);
  const [fwGroundLegs, setFwGroundLegs] = useState(null);
  const [sendingAirportId, setSendingAirportId] = useState("");
  const [receivingAirportId, setReceivingAirportId] = useState("");
  const [currentPos, setCurrentPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [bedsideMin, setBedsideMin] = useState(40);
  const [windSpeedKts, setWindSpeedKts] = useState(0);
  const [windDirDeg, setWindDirDeg] = useState(0);
  const [weatherLayer, setWeatherLayer] = useState("precip");
  const [showTraffic, setShowTraffic] = useState(true);
  const [hospitalWeather, setHospitalWeather] = useState({});

  const allHospitals = useMemo(() => [...HOSPITALS, ...cfg.customHospitals], [cfg]);
  const allAirports  = useMemo(() => [...AIRPORTS,  ...cfg.customAirports],  [cfg]);

  const fixedBase = BASES.find(b => b.id === baseId);
  const base = baseId === "current"
    ? (currentPos ? { id: "current", name: "Current Location", city: "Current Location", lat: currentPos.lat, lng: currentPos.lng, restockId: null } : null)
    : fixedBase;
  const sending   = allHospitals.find(h => h.id === sendingId);
  const receiving = allHospitals.find(h => h.id === receivingId);

  // --- derived values ---
  const valid = base && sending && receiving && sendingId !== receivingId;
  const isRodman = base?.restockId != null;
  const legMeta = groundRoute ? "road routing" : "transit";
  const cmmcAdd = isRodman && includeCmmcStop ? cfg.cmmcStopMin : 0;

  const bedsideTotal = bedsideMin * 2;
  const haverResult = (valid && mode !== "fw") ? calcLegs(base, sending, receiving, mode, cfg, windSpeedKts, windDirDeg) : null;
  const result = (() => {
    if (!haverResult) return null;
    if (mode !== "ground" || !groundRoute) {
      return { ...haverResult, total: haverResult.transit + bedsideTotal + cmmcAdd };
    }
    const apiLegs = groundRoute.legs;
    const updatedLegs = haverResult.legs.map((leg, i) => ({
      ...leg,
      time: apiLegs[i] ? Math.round(parseSecs(apiLegs[i].duration) / 60) : leg.time,
      miles: apiLegs[i] ? Math.round((apiLegs[i].distanceMeters ?? 0) / 1609.34) : leg.miles,
    }));
    const transit = updatedLegs.reduce((sum, l) => sum + l.time, 0);
    return { ...haverResult, legs: updatedLegs, transit, total: transit + bedsideTotal + cmmcAdd };
  })();

  // Fuel stop (rotor only) — splits the transport leg through an intermediate airport
  const fuelStop = (() => {
    if (mode !== "air" || !hasFuelStop || !fuelStopAirportId || !valid) return null;
    const fsa = allAirports.find(a => a.id === fuelStopAirportId);
    if (!fsa) return null;
    const m1 = haversine(sending.lat, sending.lng, fsa.lat, fsa.lng);
    const m2 = haversine(fsa.lat, fsa.lng, receiving.lat, receiving.lng);
    const b1 = bearingDeg(sending.lat, sending.lng, fsa.lat, fsa.lng);
    const b2 = bearingDeg(fsa.lat, fsa.lng, receiving.lat, receiving.lng);
    const gs1 = windSpeedKts > 0 ? windCorrectedSpeed(cfg.rotorSpeedKts, b1, windSpeedKts, windDirDeg) : cfg.rotorSpeedKts;
    const gs2 = windSpeedKts > 0 ? windCorrectedSpeed(cfg.rotorSpeedKts, b2, windSpeedKts, windDirDeg) : cfg.rotorSpeedKts;
    return {
      airport: fsa,
      leg1: { label: `${sending.city} → ${fsa.code}`, miles: Math.round(m1), time: Math.round((m1 / gs1) * 60), gs: Math.round(gs1) },
      leg2: { label: `${fsa.code} → ${receiving.city}`, miles: Math.round(m2), time: Math.round((m2 / gs2) * 60), gs: Math.round(gs2) },
      stopMin: cfg.fuelStopMin,
    };
  })();

  const resultWithFuelStop = (() => {
    if (!result || !fuelStop) return result;
    const replaced = fuelStop.leg1.time + fuelStop.leg2.time + fuelStop.stopMin - result.legs[1].time;
    return { ...result, fuelStop, transit: result.transit + replaced, total: result.total + replaced };
  })();
  const activeResult = resultWithFuelStop ?? result;

  const fwResult = (() => {
    if (mode !== "fw" || !valid || !sendingAirportId || !receivingAirportId) return null;
    const sendApt  = allAirports.find(a => a.id === sendingAirportId);
    const recvApt  = allAirports.find(a => a.id === receivingAirportId);
    const bgrApt   = allAirports.find(a => a.id === "bgr");
    const isBgrBoth = sendingAirportId === "bgr" && receivingAirportId === "bgr";
    const sameApt   = sendingAirportId === receivingAirportId;
    const gl = fwGroundLegs;

    const gLeg = (key, from, to, fLat, fLng, tLat, tLng) => ({
      type: "ground",
      key,
      toCoord: { lat: tLat, lng: tLng },
      label: `Ground · ${from} → ${to}`,
      time:  gl?.[key]?.time  ?? groundMin(haversine(fLat, fLng, tLat, tLng), cfg),
      miles: gl?.[key]?.miles ?? Math.round(haversine(fLat, fLng, tLat, tLng)),
      live: !!gl?.[key]?.time,
    });
    const fLeg = (a, b) => {
      const nm      = haversine(a.lat, a.lng, b.lat, b.lng) * 0.868976;
      const bearing = bearingDeg(a.lat, a.lng, b.lat, b.lng);
      const gs      = windSpeedKts > 0
        ? windCorrectedSpeed(cfg.fwSpeedKts, bearing, windSpeedKts, windDirDeg)
        : cfg.fwSpeedKts;
      return {
        type: "flight",
        toCoord: { lat: b.lat, lng: b.lng },
        label: `Flight · ${a.code} → ${b.code}`,
        time:  Math.round((nm / gs) * 60 + cfg.fwOpsMin),
        miles: Math.round(nm),
        gs:    Math.round(gs),
      };
    };

    const legs = [];
    legs.push({ type: "lift", label: "Lift · 600 Hangar (KBGR)", time: cfg.fwLiftMin });
    if (sendingAirportId !== "bgr") legs.push(fLeg(bgrApt, sendApt));
    legs.push(gLeg("aptToSend", sendApt.code, sending.city, sendApt.lat, sendApt.lng, sending.lat, sending.lng));
    legs.push({ type: "bedside", side: "sending", hospital: sending, time: bedsideMin });
    if (isBgrBoth) {
      legs.push(gLeg("sendToRecv", sending.city, receiving.city, sending.lat, sending.lng, receiving.lat, receiving.lng));
    } else {
      legs.push(gLeg("sendToApt", sending.city, sendApt.code, sending.lat, sending.lng, sendApt.lat, sendApt.lng));
      if (!sameApt) legs.push(fLeg(sendApt, recvApt));
      legs.push(gLeg("aptToRecv", recvApt.code, receiving.city, recvApt.lat, recvApt.lng, receiving.lat, receiving.lng));
    }
    legs.push({ type: "bedside", side: "receiving", hospital: receiving, time: bedsideMin });
    legs.push(gLeg("recvToApt", receiving.city, recvApt.code, receiving.lat, receiving.lng, recvApt.lat, recvApt.lng));
    if (receivingAirportId !== "bgr") legs.push(fLeg(recvApt, bgrApt));

    const transit = legs.filter(l => l.type !== "bedside").reduce((s, l) => s + l.time, 0);
    return { legs, transit, total: transit + bedsideMin * 2 };
  })();

  const shiftInfo = (() => {
    const shiftBaseId = baseId === "current" ? crewBaseId : baseId;
    if (!shiftBaseId) return null;
    const active = getActiveShift(shiftBaseId, now, cfg.baseShifts);
    if (!active) return { status: "none" };
    const activeResult = mode === "fw" ? fwResult : (resultWithFuelStop ?? result);
    if (!activeResult) return { status: "idle", label: active.label };
    const returnTime = new Date(now.getTime() + activeResult.total * 60 * 1000);
    const gracePeriodEnd = new Date(active.end.getTime() + 2 * 60 * 60 * 1000);
    const rStr = t => `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
    const status = returnTime <= active.end ? "green" : returnTime <= gracePeriodEnd ? "yellow" : "red";
    return { status, label: active.label, returnStr: rStr(returnTime) };
  })();

  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const weatherLayerRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const tempLabelsRef = useRef([]);

  // Ref callback: clears the Maps instance when the div unmounts so it
  // gets re-created on the new element when the div remounts (e.g. FW mode switch)
  const mapDivRefCallback = useCallback((el) => {
    mapDivRef.current = el;
    if (!el) {
      mapInstanceRef.current = null;
      setMapReady(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (baseId !== "current") { setCurrentPos(null); setLocating(false); return; }
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => { setLocating(false); alert("Unable to get location. Please check your browser permissions."); setBaseId(""); }
    );
  }, [baseId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    const fetchWx = async (hospital) => {
      if (!hospital) return;
      const res = await fetch(
        `https://weather.googleapis.com/v1/currentConditions:lookup?key=${key}&location.latitude=${hospital.lat}&location.longitude=${hospital.lng}&unitsSystem=IMPERIAL`
      ).catch(() => null);
      if (!res?.ok) return;
      const data = await res.json().catch(() => null);
      const temp = data?.temperature?.degrees;
      if (temp == null) return;
      setHospitalWeather(prev => ({ ...prev, [hospital.id]: Math.round(temp) }));
    };
    fetchWx(sending);
    fetchWx(receiving);
    fetchWx(base);
  }, [sendingId, receivingId, baseId]);

  useEffect(() => {
    if (!valid || mode !== "ground") { setGroundRoute(null); return; }
    // When receiving IS the restock hospital, skip the duplicate intermediate
    const receivingIsRestock = base.restockId && receiving.id === base.restockId;
    const waypoints = [
      { lat: sending.lat, lng: sending.lng },
      { lat: receiving.lat, lng: receiving.lng },
      ...(base.restockId && !receivingIsRestock ? [{ lat: CMMC_COORDS.lat, lng: CMMC_COORDS.lng }] : []),
    ];
    computeRoute(
      { lat: base.lat, lng: base.lng },
      waypoints,
      { lat: base.lat, lng: base.lng }
    ).then(route => {
      if (!route) { setGroundRoute(null); return; }
      // Re-insert a zero leg for the CMMC→CMMC stop so leg indices stay aligned
      if (receivingIsRestock && route.legs.length === 3) {
        const legs = [route.legs[0], route.legs[1], { duration: "0s", distanceMeters: 0 }, route.legs[2]];
        setGroundRoute({ ...route, legs });
      } else {
        setGroundRoute(route);
      }
    });
  }, [baseId, sendingId, receivingId, mode]);

  // Reset fuel stop when leaving rotor mode
  useEffect(() => {
    if (mode !== "air") { setHasFuelStop(false); setFuelStopAirportId(""); }
  }, [mode]);

  // Reset FW mode if base changes away from 600 Hangar
  useEffect(() => {
    if (mode === "fw" && baseId !== "bangor_hangar") setMode("ground");
  }, [baseId]);

  // Compute FW ground legs (one Routes API call per segment)
  useEffect(() => {
    if (mode !== "fw" || !valid || !sendingAirportId || !receivingAirportId) { setFwGroundLegs(null); return; }
    const sendApt   = AIRPORTS.find(a => a.id === sendingAirportId);
    const recvApt   = AIRPORTS.find(a => a.id === receivingAirportId);
    const isBgrBoth = sendingAirportId === "bgr" && receivingAirportId === "bgr";
    const calls = [
      computeRoute({ lat: sendApt.lat, lng: sendApt.lng }, [], { lat: sending.lat,  lng: sending.lng  }).then(r => ["aptToSend", r]),
      computeRoute({ lat: receiving.lat, lng: receiving.lng }, [], { lat: recvApt.lat, lng: recvApt.lng }).then(r => ["recvToApt", r]),
      ...(isBgrBoth
        ? [computeRoute({ lat: sending.lat, lng: sending.lng }, [], { lat: receiving.lat, lng: receiving.lng }).then(r => ["sendToRecv", r])]
        : [
            computeRoute({ lat: sending.lat, lng: sending.lng }, [], { lat: sendApt.lat, lng: sendApt.lng }).then(r => ["sendToApt", r]),
            computeRoute({ lat: recvApt.lat, lng: recvApt.lng }, [], { lat: receiving.lat, lng: receiving.lng }).then(r => ["aptToRecv", r]),
          ]
      ),
    ];
    Promise.all(calls).then(results => {
      const legs = {};
      results.forEach(([key, route]) => {
        const apiLeg = route?.legs?.[0];
        legs[key] = {
          time:     apiLeg ? Math.round(parseSecs(apiLeg.duration) / 60) : null,
          miles:    apiLeg ? Math.round((apiLeg.distanceMeters ?? 0) / 1609.34) : null,
          polyline: apiLeg?.polyline?.encodedPolyline ?? null,
        };
      });
      setFwGroundLegs(legs);
    });
  }, [mode, baseId, sendingId, receivingId, sendingAirportId, receivingAirportId]);

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
    // Force Maps to re-measure the container — fixes blank map on mobile
    window.google.maps.event.trigger(mapInstanceRef.current, "resize");
    setMapReady(true);
  }, [isLoaded, result, fwResult]);

  // Update map styles when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setOptions({ styles: isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT });
  }, [isDark]);

  // Weather tile overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;
    map.overlayMapTypes.clear();
    if (!weatherLayer) return;
    const tileTypes = {
      precip: "US_PRECIPITATION_CURRENT",
    };
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    const type = tileTypes[weatherLayer];
    if (!weatherLayerRef.current || weatherLayerRef.current._type !== weatherLayer) {
      const layer = new window.google.maps.ImageMapType({
        getTileUrl: (coord, zoom) =>
          `https://weather.googleapis.com/v1/mapTypes/${type}/mapTiles/${zoom}/${coord.x}/${coord.y}?key=${key}`,
        tileSize: new window.google.maps.Size(256, 256),
        opacity: 0.65,
        name: weatherLayer,
      });
      layer._type = weatherLayer;
      weatherLayerRef.current = layer;
    }
    map.overlayMapTypes.push(weatherLayerRef.current);
  }, [weatherLayer, mapReady]);

  // Traffic layer
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    if (!trafficLayerRef.current)
      trafficLayerRef.current = new window.google.maps.TrafficLayer();
    trafficLayerRef.current.setMap(showTraffic ? mapInstanceRef.current : null);
  }, [showTraffic, mapReady]);

  // Temperature labels on map
  useEffect(() => {
    tempLabelsRef.current.forEach(l => l.setMap(null));
    tempLabelsRef.current = [];
    if (!mapInstanceRef.current || !window.google || !valid) return;
    const map = mapInstanceRef.current;
    const labels = [];
    if (base && hospitalWeather[base.id] != null)
      labels.push(makeTempLabel({ lat: base.lat, lng: base.lng }, `${hospitalWeather[base.id]}°F`, "sending", map));
    if (hospitalWeather[sending.id] != null)
      labels.push(makeTempLabel({ lat: sending.lat, lng: sending.lng }, `${hospitalWeather[sending.id]}°F`, "sending", map));
    if (hospitalWeather[receiving.id] != null)
      labels.push(makeTempLabel({ lat: receiving.lat, lng: receiving.lng }, `${hospitalWeather[receiving.id]}°F`, "receiving", map));
    tempLabelsRef.current = labels;
  }, [hospitalWeather, baseId, sendingId, receivingId, valid, mapReady]);

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
          fillColor, fillOpacity: 1, strokeColor, strokeWeight: 2 },
      });
      markersRef.current.push(m);
    };
    mkr({ lat: base.lat, lng: base.lng }, "#2e5a72", "#4a8aaa");
    mkr({ lat: sending.lat, lng: sending.lng }, "#d4a820", "#f0c840");
    mkr({ lat: receiving.lat, lng: receiving.lng }, "#1e7a48", "#2eb868");

    let path;
    let strokeColor = "#d4a820";

    if (mode === "fw" && fwResult) {
      strokeColor = "#3060b0";
      const sendApt = AIRPORTS.find(a => a.id === sendingAirportId);
      const recvApt = AIRPORTS.find(a => a.id === receivingAirportId);
      const bgrApt  = AIRPORTS.find(a => a.id === "bgr");
      if (sendApt) mkr({ lat: sendApt.lat, lng: sendApt.lng }, "#3060b0", "#6090d0");
      if (recvApt && recvApt.id !== sendApt?.id) mkr({ lat: recvApt.lat, lng: recvApt.lng }, "#3060b0", "#6090d0");
      // Build continuous path: road geometry for ground legs, straight lines for flights
      const pts = [{ lat: bgrApt.lat, lng: bgrApt.lng }];
      for (const leg of fwResult.legs) {
        if (leg.type === "lift" || leg.type === "bedside") continue;
        if (leg.type === "flight") {
          pts.push(leg.toCoord);
        } else if (leg.type === "ground") {
          const enc = fwGroundLegs?.[leg.key]?.polyline;
          if (enc) {
            pts.push(...decodePolyline(enc));
          } else {
            pts.push(leg.toCoord);
          }
        }
      }
      path = pts;
    } else if (mode === "ground" && groundRoute) {
      strokeColor = "#d4a820";
      path = (groundRoute.legs ?? []).flatMap(leg =>
        leg.polyline?.encodedPolyline ? decodePolyline(leg.polyline.encodedPolyline) : []
      );
    } else {
      strokeColor = mode === "air" ? "#1e9a58" : "#d4a820";
      const fsa = fuelStop?.airport;
      if (fsa) mkr({ lat: fsa.lat, lng: fsa.lng }, "#1e9a58", "#2eb868");
      path = [
        { lat: base.lat, lng: base.lng },
        { lat: sending.lat, lng: sending.lng },
        ...(fsa ? [{ lat: fsa.lat, lng: fsa.lng }] : []),
        { lat: receiving.lat, lng: receiving.lng },
        ...(base.restockId ? [CMMC_COORDS] : []),
        { lat: base.lat, lng: base.lng },
      ];
    }

    polylineRef.current = new window.google.maps.Polyline({
      path, map: mapInstanceRef.current,
      strokeColor, strokeOpacity: 0.85, strokeWeight: 3,
    });

    const bounds = new window.google.maps.LatLngBounds();
    path.forEach(pt => bounds.extend(pt));
    mapInstanceRef.current.fitBounds(bounds, 60);
  }, [valid, baseId, sendingId, receivingId, mode, groundRoute, sendingAirportId, receivingAirportId, fwGroundLegs, fuelStop]);

  const toggleTheme = () => setIsDark(v => { const n = !v; localStorage.setItem("theme", n ? "dark" : "light"); return n; });

  return (
    <div className={`app-root${isDark ? " night" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira:wght@300;400;600;700&family=Spline+Sans+Mono:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100%; margin: 0; }

        .app-root {
          --bg: #e9eef3;
          --surface: #f6f8fa;
          --surface-2: #eef2f6;
          --inset: #ffffff;
          --border: #d9e1e9;
          --border-strong: #c4d1dd;
          --text: #1b2a3d;
          --text-2: #4a6076;
          --text-muted: #8b9fb2;
          --green: #1f7a44;
          --green-deep: #155c33;
          --green-tint: #ebf4ef;
          --gold: #bb8e10;
          --gold-deep: #8a6800;
          --gold-tint: #f9f1da;
          --red: #c0432f;
          --red-tint: #faecea;
          --shadow: 0 1px 2px rgba(20,40,60,.05), 0 8px 20px -14px rgba(20,40,60,.22);
          --r: 14px;
          --r-sm: 11px;
          font-family: 'Saira', sans-serif;
          color: var(--text);
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 48px;
          background-color: #e4e8ec;
          background-image:
            radial-gradient(ellipse at 0% 0%, rgba(190,210,230,.55) 0%, transparent 48%),
            radial-gradient(ellipse at 100% 0%, rgba(190,210,230,.55) 0%, transparent 48%);
        }
        .app-root.night {
          --bg: #0c131b;
          --surface: #131d27;
          --surface-2: #0f1822;
          --inset: #0a121b;
          --border: #233240;
          --border-strong: #324456;
          --text: #e6edf3;
          --text-2: #a8bccd;
          --text-muted: #7a8ea0;
          --green: #3fae6c;
          --green-deep: #2f9159;
          --green-tint: #0f241a;
          --gold: #e0b341;
          --gold-deep: #c4982c;
          --gold-tint: #211a08;
          --red: #e2624a;
          --red-tint: #2a120d;
          --shadow: 0 1px 2px rgba(0,0,0,.4), 0 12px 30px -16px rgba(0,0,0,.6);
          background-color: #05090d;
          background-image:
            radial-gradient(ellipse at 0% 0%, rgba(10,30,55,.7) 0%, transparent 48%),
            radial-gradient(ellipse at 100% 0%, rgba(10,30,55,.7) 0%, transparent 48%);
        }

        .wrap { width: 100%; max-width: 580px; }
        .layout { display: flex; flex-direction: column; gap: 0; }

        /* HEADER */
        .header { margin-bottom: 24px; }
        .header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .logo { height: 48px; width: auto; }
        .header-left { flex: 1; }
        .title { font-family: 'Saira', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.005em; color: var(--text); line-height: 1; }
        .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .clock { font-family: 'Spline Sans Mono', monospace; font-size: 22px; font-weight: 600; color: var(--text); letter-spacing: 0.04em; line-height: 1; }
        .header-actions { display: flex; align-items: center; gap: 6px; }
        /* THEME SWITCH */
        .theme-switch { display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 0; cursor: pointer; }
        .ts-label { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); transition: color 0.2s; user-select: none; }
        .theme-switch:not(.night) .ts-day  { color: var(--gold); font-weight: 600; }
        .theme-switch.night .ts-night { color: var(--green); font-weight: 600; }
        .ts-track { width: 30px; height: 17px; border-radius: 99px; background: var(--border-strong); border: 1px solid var(--border-strong); position: relative; transition: background 0.25s, border-color 0.25s; flex-shrink: 0; }
        .theme-switch.night .ts-track { background: var(--green-tint); border-color: var(--green); }
        .ts-knob { position: absolute; top: 2px; left: 2px; width: 11px; height: 11px; border-radius: 50%; background: var(--text-muted); transition: transform 0.25s, background 0.25s; }
        .theme-switch.night .ts-knob { transform: translateX(13px); background: var(--green); }
        .reset-pill {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
          background: transparent; border: 1px solid var(--border-strong);
          color: var(--text-muted); border-radius: 99px; padding: 5px 12px;
          cursor: pointer; transition: all 0.18s;
        }
        .reset-pill:hover { border-color: var(--red); color: var(--red); background: var(--red-tint); }

        /* CARD */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 22px;
          position: relative;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--green));
          border-radius: var(--r) var(--r) 0 0;
        }

        /* SECTION LABEL */
        .sec-label {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 9px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        /* SELECTS */
        .fields { display: flex; flex-direction: column; gap: 14px; }
        .field { display: flex; flex-direction: column; }
        .sel-wrap { position: relative; }
        select {
          width: 100%;
          background: var(--inset);
          border: 1px solid var(--border-strong);
          color: var(--text);
          font-family: 'Saira', sans-serif;
          font-size: 15px;
          padding: 9px 34px 9px 12px;
          border-radius: var(--r-sm);
          appearance: none;
          cursor: pointer;
          outline: none;
          transition: border-color 0.18s;
        }
        select:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(187,142,16,.12); }
        select option { background: var(--inset); color: var(--text); }
        .sel-wrap::after {
          content: '▾';
          position: absolute;
          right: 10px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          font-size: 13px;
        }

        /* MODE TOGGLE */
        .mode-row { display: flex; gap: 0; margin-top: 14px; }
        .mode-btn {
          flex: 1;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          padding: 8px 0;
          cursor: pointer;
          transition: all 0.18s;
        }
        .mode-btn:first-child { border-radius: var(--r-sm) 0 0 var(--r-sm); }
        .mode-btn:last-child { border-radius: 0 var(--r-sm) var(--r-sm) 0; }
        .mode-btn:not(:first-child) { border-left: none; }
        .mode-btn.active.ground { background: var(--gold-tint); box-shadow: inset 0 0 0 1.5px var(--gold); border-color: var(--gold); color: var(--gold-deep); }
        .mode-btn.active.air    { background: var(--green-tint); box-shadow: inset 0 0 0 1.5px var(--green); border-color: var(--green); color: var(--green-deep); }
        .mode-btn.active.fw     { background: #eef2ff; box-shadow: inset 0 0 0 1.5px #3060b0; border-color: #3060b0; color: #1a3a80; }
        .mode-btn:not(.active):not(:disabled):hover { border-color: var(--border-strong); color: var(--text-2); }
        .mode-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* FIXED WING LEGS */
        .leg-dot.fw   { border-color: #3060b0; }
        .leg-dot.lift { border-color: #3060b0; background: #3060b0; width: 11px; height: 11px; border-radius: 2px; }
        .leg-dot.flight-dot { border-color: #3060b0; background: #d0e0ff; }
        .leg-meta.fw { color: #3060b0; }
        .leg-time.fw { color: #1a3a70; }
        .total-box.highlight.fw { border-color: #3060b0; background: #eef2ff; }
        .total-label.blue { color: #3060b0; }
        .app-root.night .mode-btn.active.fw     { background: #080e1e; box-shadow: inset 0 0 0 1.5px #3a6ad4; border-color: #3a6ad4; color: #3a6ad4; }
        .app-root.night .leg-dot.fw             { border-color: #3a6ad4; }
        .app-root.night .leg-dot.lift           { border-color: #3a6ad4; background: #3a6ad4; }
        .app-root.night .leg-dot.flight-dot     { border-color: #3a6ad4; background: #0a1830; }
        .app-root.night .leg-meta.fw            { color: #3a6ad4; }
        .app-root.night .leg-time.fw            { color: #aac0e8; }
        .app-root.night .total-box.highlight.fw { border-color: #3a6ad4; background: #080e1e; }
        .app-root.night .total-label.blue       { color: #3a6ad4; }

        /* FUEL STOP */
        .fuel-stop-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .fuel-stop-toggle {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
          background: var(--surface-2); border: 1px solid var(--border);
          color: var(--text-2); border-radius: var(--r-sm);
          padding: 6px 12px; cursor: pointer; transition: all 0.18s; white-space: nowrap;
        }
        .fuel-stop-toggle.active { background: var(--green-tint); border-color: var(--green); color: var(--green); }
        .fuel-stop-toggle:not(.active):hover { border-color: var(--border-strong); }
        .fuel-stop-apt { flex: 1; }
        .fuel-stop-apt .sel-wrap select { font-size: 15px; padding: 6px 34px 6px 10px; }
        .fuel-stop-stop { display: flex; align-items: stretch; gap: 0; }
        .fuel-stop-connector { display: flex; flex-direction: column; align-items: center; width: 28px; flex-shrink: 0; padding: 2px 0; }
        .fuel-stop-dot { width: 11px; height: 11px; border-radius: 50%; border: 2px solid var(--green); background: var(--green-tint); flex-shrink: 0; z-index: 1; }
        .fuel-stop-content { flex: 1; padding: 4px 0 8px 8px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .fuel-stop-text { flex: 1; min-width: 0; }
        .fuel-stop-label { font-size: 11px; font-family: 'Spline Sans Mono', monospace; letter-spacing: .14em; color: var(--green); text-transform: uppercase; }
        .fuel-stop-name { font-family: 'Saira', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-2); margin-top: 1px; }
        .fuel-stop-time { font-family: 'Spline Sans Mono', monospace; font-size: 18px; font-weight: 600; color: var(--text); white-space: nowrap; padding-top: 1px; flex-shrink: 0; }

        /* SHIFT INDICATOR */
        .shift-indicator {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px; padding: 7px 12px; border-radius: var(--r-sm); border: 1px solid;
          font-family: 'Spline Sans Mono', monospace; font-size: 10px;
          letter-spacing: .14em; text-transform: uppercase;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .si-left { display: flex; align-items: center; gap: 6px; }
        .si-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
        .si-return { font-weight: 600; }
        .si-legend { display: flex; gap: 12px; margin-top: 5px; padding-left: 2px; font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; }
        .si-legend-item.green  { color: var(--green); }
        .si-legend-item.yellow { color: var(--gold); }
        .si-legend-item.red    { color: var(--red); }
        .shift-indicator.si-none   { background: var(--surface-2); border-color: var(--border); color: var(--text-muted); }
        .shift-indicator.si-idle   { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-2); }
        .shift-indicator.si-green  { background: var(--green-tint); border-color: var(--green); color: var(--green); }
        .shift-indicator.si-yellow { background: var(--gold-tint); border-color: var(--gold); color: var(--gold-deep); }
        .shift-indicator.si-red    { background: var(--red-tint); border-color: var(--red); color: var(--red); }

        /* DIVIDER */
        .divider {
          display: flex; align-items: center; gap: 10px;
          margin: 20px 0 16px;
          font-family: 'Spline Sans Mono', monospace; font-size: 9px;
          letter-spacing: .22em; color: var(--text-muted);
        }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* MISSION PROFILE */
        .profile { animation: fadeUp 0.28s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* LEGS */
        .legs { display: flex; flex-direction: column; gap: 0; }
        .leg { display: flex; align-items: stretch; gap: 0; position: relative; }
        .leg-connector { display: flex; flex-direction: column; align-items: center; width: 28px; flex-shrink: 0; padding: 2px 0; }
        .leg-dot { width: 9px; height: 9px; border-radius: 50%; border: 2px solid var(--gold); background: var(--bg); flex-shrink: 0; z-index: 1; }
        .leg-dot.green { border-color: var(--green); }
        .leg-dot.dim   { border-color: var(--border-strong); }
        .leg-line { flex: 1; width: 1px; background: var(--border); margin: 2px 0; }
        .leg-content { flex: 1; padding: 4px 0 8px 8px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .leg-text { flex: 1; min-width: 0; }
        .leg-route { font-family: 'Saira', sans-serif; font-size: 14px; font-weight: 600; color: var(--text); letter-spacing: .04em; }
        .leg-meta { font-family: 'Spline Sans Mono', monospace; font-size: 10px; color: var(--text-muted); margin-top: 2px; }
        .leg-time { font-family: 'Spline Sans Mono', monospace; font-size: 18px; font-weight: 600; color: var(--text); white-space: nowrap; padding-top: 1px; flex-shrink: 0; }

        /* BEDSIDE STOPS */
        .bedside-stop { display: flex; align-items: stretch; gap: 0; }
        .bedside-connector { display: flex; flex-direction: column; align-items: center; width: 28px; flex-shrink: 0; padding: 2px 0; }
        .bedside-dot {
          width: 13px; height: 13px; border-radius: 4px;
          background: var(--gold-tint); border: 2px solid var(--gold);
          flex-shrink: 0; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          font-size: 7px; color: var(--gold-deep);
        }
        .bedside-dot.receiving { background: var(--green-tint); border-color: var(--green); color: var(--green-deep); }
        .bedside-line { flex: 1; width: 1px; background: var(--border); margin: 2px 0; }
        .bedside-content { flex: 1; padding: 4px 0 8px 8px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .bedside-text { flex: 1; min-width: 0; }
        .bedside-label { font-size: 11px; font-family: 'Spline Sans Mono', monospace; letter-spacing: .14em; color: var(--gold-deep); text-transform: uppercase; }
        .bedside-label.receiving { color: var(--green); }
        .bedside-name { font-family: 'Saira', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-2); margin-top: 1px; }
        .bedside-time { font-family: 'Spline Sans Mono', monospace; font-size: 18px; font-weight: 600; color: var(--text); white-space: nowrap; padding-top: 1px; flex-shrink: 0; }

        /* RESTOCK BADGE */
        .restock-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--surface-2); border: 1px solid var(--border-strong);
          border-radius: var(--r-sm); padding: 3px 8px;
          font-family: 'Spline Sans Mono', monospace; font-size: 9px;
          letter-spacing: .18em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;
        }

        /* TOTALS */
        .totals { margin-bottom: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .total-box { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 14px; }
        .total-box.highlight { border-color: var(--gold); background: var(--gold-tint); }
        .total-box.highlight.air { border-color: var(--green); background: var(--green-tint); }
        .total-label { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; }
        .total-label.gold  { color: var(--gold-deep); }
        .total-label.green { color: var(--green); }
        .total-value { font-family: 'Spline Sans Mono', monospace; font-size: 38px; font-weight: 600; line-height: 1; color: var(--text); letter-spacing: -0.01em; }
        .total-breakdown { font-family: 'Spline Sans Mono', monospace; font-size: 10px; color: var(--text-muted); margin-top: 6px; }

        .hint { text-align: center; color: var(--text-muted); font-family: 'Spline Sans Mono', monospace; font-size: 11px; letter-spacing: .14em; padding: 28px 0 8px; border-top: 1px dashed var(--border-strong); margin-top: 18px; }
        .disclaimer { margin-top: 14px; font-family: 'Spline Sans Mono', monospace; font-size: 9px; color: var(--text-muted); letter-spacing: .06em; border-top: 1px solid var(--border); padding-top: 10px; }

        /* LIVE BADGE */
        .live-status { margin-bottom: 14px; }
        .live-badge { display: inline-flex; align-items: center; gap: 4px; border-radius: var(--r-sm); padding: 3px 8px; font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; background: var(--green-tint); border: 1px solid var(--green); color: var(--green); }

        /* BEDSIDE SELECTOR */
        .bedside-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .bedside-left { display: flex; align-items: center; padding-top: 18px; }
        .bedside-selector { width: 162px; }
        .bedside-hint { font-family: 'Spline Sans Mono', monospace; font-size: 8px; letter-spacing: .12em; color: var(--text-muted); margin-top: 4px; text-align: right; }

        /* HOSPITAL CUSTOM SELECT */
        /* HOSPITAL CUSTOM SELECT */
        .hsel { position: relative; }
        .hsel-trigger { width: 100%; background: var(--inset); border: 1px solid var(--border-strong); color: var(--text); font-family: 'Saira', sans-serif; font-size: 15px; padding: 9px 34px 9px 12px; border-radius: var(--r-sm); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; outline: none; transition: border-color 0.18s; }
        .hsel-trigger:focus, .hsel-trigger:hover { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(187,142,16,.12); }
        .hsel-trigger.placeholder { color: var(--text-muted); }
        .hsel-arrow { color: var(--text-muted); font-size: 13px; flex-shrink: 0; margin-left: 8px; }
        .hsel-panel { position: absolute; top: calc(100% + 2px); left: 0; right: 0; background: var(--surface); border: 1px solid var(--border-strong); border-radius: var(--r-sm); max-height: 300px; overflow-y: auto; z-index: 200; box-shadow: var(--shadow); }
        .hsel-state-label { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: var(--text-muted); padding: 7px 12px 5px; background: var(--surface-2); border-bottom: 1px solid var(--border); position: sticky; top: 0; }
        .hsel-state-toggle { width: 100%; font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: var(--text-2); padding: 7px 12px 5px; background: var(--surface-2); border: none; border-top: 1px solid var(--border); cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; }
        .hsel-state-toggle:hover { background: var(--bg); color: var(--text); }
        .hsel-option { width: 100%; background: none; border: none; border-bottom: 1px solid var(--border); padding: 8px 12px; text-align: left; font-family: 'Saira', sans-serif; font-size: 14px; color: var(--text-2); cursor: pointer; display: flex; align-items: baseline; justify-content: space-between; gap: 8px; min-height: 36px; }
        .hsel-option:hover { background: var(--surface-2); color: var(--text); }
        .hsel-option.active { background: var(--gold-tint); color: var(--gold-deep); }
        .hsel-city { font-family: 'Spline Sans Mono', monospace; font-size: 10px; color: var(--text-muted); flex-shrink: 0; }
        .hsel-option.active .hsel-city { color: var(--gold); }

        /* MAP TEMPERATURE LABELS */
        .temp-label { position: absolute; background: rgba(246,248,250,.92); border: 1px solid var(--border-strong); border-radius: 4px; padding: 1px 5px; font-family: 'Spline Sans Mono', monospace; font-size: 10px; letter-spacing: .08em; color: var(--text-2); white-space: nowrap; pointer-events: none; transform: translate(-50%, -210%); }
        .temp-label.sending   { border-color: var(--gold); color: var(--gold-deep); background: rgba(249,241,218,.92); }
        .temp-label.receiving { border-color: var(--green); color: var(--green); background: rgba(235,244,239,.92); }
        .app-root.night .temp-label { background: rgba(10,18,27,.92); }
        .app-root.night .temp-label.sending   { background: rgba(33,26,8,.92); }
        .app-root.night .temp-label.receiving { background: rgba(15,36,26,.92); }

        /* MAP */
        .map-wrap { position: relative; margin-top: 16px; }
        .map-canvas { display: block; width: 100%; height: 320px; border-radius: var(--r); overflow: hidden; border: 1px solid var(--border); }

        @media (min-width: 960px) {
          .wrap { max-width: 1160px; }
          .layout { flex-direction: row; align-items: flex-start; gap: 20px; }
          .layout > .card { flex: 0 0 540px; }
          .layout > .map-wrap {
            flex: 1;
            position: sticky;
            top: 28px;
            margin-top: 0;
          }
          .map-canvas { height: calc(100vh - 120px); min-height: 500px; }
        }
        .map-controls { position: absolute; top: 8px; right: 8px; z-index: 10; display: flex; gap: 4px; align-items: center; }
        .weather-controls { display: flex; }
        .traffic-toggle { border-radius: var(--r-sm) !important; }
        .traffic-toggle.active.traffic { background: rgba(255,245,235,.96); border-color: #c06020; color: #c06020; }
        .weather-btn { background: rgba(246,248,250,.92); border: 1px solid var(--border-strong); padding: 5px 9px; font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--text-muted); cursor: pointer; transition: all 0.18s; }
        .weather-btn:not(:last-child) { border-right: none; }
        .weather-btn:first-child { border-radius: var(--r-sm) 0 0 var(--r-sm); }
        .weather-btn:last-child  { border-radius: 0 var(--r-sm) var(--r-sm) 0; }
        .weather-btn.active { background: rgba(235,244,239,.96); border-color: var(--green); color: var(--green); border-right: 1px solid var(--green); }
        .weather-btn.active + .weather-btn { border-left: none; }
        .weather-btn:hover:not(.active) { color: var(--text); border-color: var(--border-strong); }
        .app-root.night .weather-btn { background: rgba(19,29,39,.92); }
        .app-root.night .weather-btn.active { background: rgba(15,36,26,.92); }
        .app-root.night .traffic-toggle.active.traffic { background: rgba(40,20,5,.92); }

        /* ADMIN LINK */
        .admin-link-row { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); text-align: right; }
        .admin-link { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--text-muted); text-decoration: none; }
        .admin-link:hover { color: var(--text-2); }

        /* WIND INPUT */
        .wind-row { display: flex; gap: 10px; margin-top: 10px; }
        .wind-field { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .wind-input {
          width: 100%; background: var(--inset); border: 1px solid var(--border-strong);
          color: var(--text); font-family: 'Spline Sans Mono', monospace; font-size: 15px;
          padding: 7px 10px; border-radius: var(--r-sm); outline: none;
          transition: border-color 0.18s; -moz-appearance: textfield;
        }
        .wind-input::-webkit-inner-spin-button,
        .wind-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .wind-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(31,122,68,.1); }
        .wind-active .wind-input { border-color: var(--green); }

        /* TRANSITIONS */
        .app-root, .card, select, .mode-btn, .total-box, .leg-dot, .bedside-dot {
          transition: background 0.4s, color 0.4s, border-color 0.4s;
        }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="header-row">
            <img src="/lifeflight-logo.svg" className="logo" alt="LifeFlight of Maine" />
            <div className="header-left">
              <div className="title">Mission Time Calculator</div>
            </div>
            <div className="header-right">
              <div className="clock">{String(now.getHours()).padStart(2,"0")}{String(now.getMinutes()).padStart(2,"0")}</div>
              <button className="reset-pill" onClick={() => window.location.reload()}>Reset</button>
            </div>
          </div>
        </div>

        <div className="layout">
        <div className="card">
          <div className="bedside-row">
            <div className="bedside-left">
              <button className={`theme-switch${isDark ? " night" : ""}`} onClick={toggleTheme} aria-label="Toggle day/night mode">
                <span className="ts-label ts-day">Day</span>
                <span className="ts-track"><span className="ts-knob" /></span>
                <span className="ts-label ts-night">Night</span>
              </button>
            </div>
            <div className="bedside-selector">
              <div className="sec-label">Bedside Time</div>
              <div className="sel-wrap">
                <select value={bedsideMin} onChange={e => setBedsideMin(Number(e.target.value))}>
                  {cfg.bedsidePresets.map(p => (
                    <option key={p.min} value={p.min}>{p.label}</option>
                  ))}
                </select>
              </div>
              {bedsideMin === 60 && (
                <div className="bedside-hint">ECMO · Balloon · Impella · Isolette</div>
              )}
            </div>
          </div>
          <div className="fields">
            <div className="field">
              <div className="sec-label">Originating Base</div>
              <div className="sel-wrap">
                <select value={baseId} onChange={e => { setBaseId(e.target.value); setCrewBaseId(""); }}>
                  <option value="">— Select base —</option>
                  <option value="current">{locating ? "Locating..." : "Current Location (GPS)"}</option>
                  {BASES.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>
            </div>

            {baseId === "current" && (
              <div className="field">
                <div className="sec-label">Assigned Base (for shift)</div>
                <div className="sel-wrap">
                  <select value={crewBaseId} onChange={e => setCrewBaseId(e.target.value)}>
                    <option value="">— Select your base —</option>
                    {BASES.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="field">
              <div className="sec-label">Sending Hospital</div>
              <HospitalSelect
                value={sendingId}
                onChange={setSendingId}
                placeholder="— Select sending hospital —"
                hospitals={allHospitals}
              />
            </div>

            {mode === "fw" && (
              <div className="field">
                <div className="sec-label">Sending Airport</div>
                <div className="sel-wrap">
                  <select value={sendingAirportId} onChange={e => setSendingAirportId(e.target.value)}>
                    <option value="">— Select airport —</option>
                    {AIRPORT_STATES.map(s => (
                      <optgroup key={s.code} label={s.name}>
                        {allAirports.filter(a => a.state === s.code).map(a => (
                          <option key={a.id} value={a.id}>{a.code} — {a.city}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="field">
              <div className="sec-label">Receiving Hospital</div>
              <HospitalSelect
                value={receivingId}
                onChange={setReceivingId}
                placeholder="— Select receiving hospital —"
                exclude={sendingId}
                pinnedIds={["mmmc", "emmc", "cmmc"]}
                hospitals={allHospitals}
              />
            </div>

            {mode === "fw" && (
              <div className="field">
                <div className="sec-label">Receiving Airport</div>
                <div className="sel-wrap">
                  <select value={receivingAirportId} onChange={e => setReceivingAirportId(e.target.value)}>
                    <option value="">— Select airport —</option>
                    {AIRPORT_STATES.map(s => (
                      <optgroup key={s.code} label={s.name}>
                        {allAirports.filter(a => a.state === s.code).map(a => (
                          <option key={a.id} value={a.id}>{a.code} — {a.city}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="mode-row">
            <button
              className={`mode-btn ground${mode === "ground" ? " active ground" : ""}`}
              onClick={() => setMode("ground")}
            >Ground</button>
            <button
              className={`mode-btn air${mode === "air" ? " active air" : ""}`}
              onClick={() => setMode("air")}
            >Rotor</button>
            <button
              className={`mode-btn fw${mode === "fw" ? " active fw" : ""}`}
              onClick={() => setMode("fw")}
              disabled={baseId !== "bangor_hangar"}
              title={baseId !== "bangor_hangar" ? "Fixed wing departs from 600 Hangar only" : ""}
            >Fixed Wing</button>
          </div>

          {(mode === "air" || mode === "fw") && (
            <div className={`wind-row${windSpeedKts > 0 ? " wind-active" : ""}`}>
              <div className="wind-field">
                <div className="sec-label">Wind Speed (kts)</div>
                <input
                  type="number" className="wind-input" min="0" max="150"
                  value={windSpeedKts || ""}
                  placeholder="0"
                  onChange={e => setWindSpeedKts(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="wind-field">
                <div className="sec-label">Wind From (°)</div>
                <input
                  type="number" className="wind-input" min="0" max="360"
                  value={windDirDeg || ""}
                  placeholder="0"
                  onChange={e => setWindDirDeg(((Number(e.target.value) || 0) % 360 + 360) % 360)}
                />
              </div>
            </div>
          )}

          {isRodman && mode !== "fw" && (
            <div className="fuel-stop-row">
              <button
                className={`fuel-stop-toggle${includeCmmcStop ? " active" : ""}`}
                onClick={() => setIncludeCmmcStop(v => !v)}
              >{includeCmmcStop ? `⬤ End Shift at CMMC +${cfg.cmmcStopMin} min` : "End Shift at CMMC?"}</button>
            </div>
          )}

          {mode === "air" && (
            <div className="fuel-stop-row">
              <button
                className={`fuel-stop-toggle${hasFuelStop ? " active" : ""}`}
                onClick={() => { setHasFuelStop(v => !v); setFuelStopAirportId(""); }}
              >{hasFuelStop ? "⬤ Fuel Stop" : "Add Fuel Stop"}</button>
              {hasFuelStop && (
                <div className="fuel-stop-apt">
                  <div className="sel-wrap">
                    <select value={fuelStopAirportId} onChange={e => setFuelStopAirportId(e.target.value)}>
                      <option value="">— Select airport —</option>
                      {AIRPORT_STATES.map(s => (
                        <optgroup key={s.code} label={s.name}>
                          {allAirports.filter(a => a.state === s.code).map(a => (
                            <option key={a.id} value={a.id}>{a.code} — {a.city}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {shiftInfo && (
            <div>
            <div className="sec-label" style={{ marginTop: 14, marginBottom: 6 }}>Shift Consideration</div>
            <div className={`shift-indicator si-${shiftInfo.status}`}>
              <div className="si-left">
                <div className="si-dot" />
                <span>
                  {shiftInfo.status === "none"
                    ? "No active shift"
                    : `Shift ${shiftInfo.label}`}
                </span>
              </div>
              {shiftInfo.returnStr && (
                <span className="si-return">Est. return {shiftInfo.returnStr}</span>
              )}
            </div>
            <div className="si-legend">
              <span className="si-legend-item green">● &lt;12h</span>
              <span className="si-legend-item yellow">● &lt;14h</span>
              <span className="si-legend-item red">● &gt;14h</span>
            </div>
            </div>
          )}

          {mode === "fw" ? (
            fwResult ? (
              <div className="profile" key={`fw-${sendingId}-${receivingId}-${sendingAirportId}-${receivingAirportId}`}>
                <div className="divider">Mission Profile</div>

                <div className="totals">
                  <div className="total-box">
                    <div className="total-label">Transit Only</div>
                    <div className="total-value">{formatTime(fwResult.transit)}</div>
                    <div className="total-breakdown">Lift + flights + ground</div>
                  </div>
                  <div className="total-box highlight fw">
                    <div className="total-label blue">Total Mission</div>
                    <div className="total-value">{formatTime(fwResult.total)}</div>
                    <div className="total-breakdown">Transit + {bedsideTotal} min bedside</div>
                  </div>
                </div>

                <div className="legs">
                  {fwResult.legs.map((leg, i) => {
                    const isLast = i === fwResult.legs.length - 1;
                    const nextIsBedside = fwResult.legs[i + 1]?.type === "bedside";
                    if (leg.type === "bedside") {
                      const isSending = leg.side === "sending";
                      return (
                        <div key={i} className="bedside-stop">
                          <div className="bedside-connector">
                            <div className={`bedside-dot${isSending ? "" : " receiving"}`}>+</div>
                            <div className="bedside-line" />
                          </div>
                          <div className="bedside-content">
                            <div className="bedside-text">
                              <div className={`bedside-label${isSending ? "" : " receiving"}`}>Bedside · {isSending ? "Sending" : "Receiving"}</div>
                              <div className="bedside-name">{leg.hospital.name}</div>
                            </div>
                            <div className="bedside-time">{formatTime(leg.time)}</div>
                          </div>
                        </div>
                      );
                    }
                    if (leg.type === "lift") {
                      return (
                        <div key={i} className="leg">
                          <div className="leg-connector">
                            <div className="leg-dot lift" />
                            <div className="leg-line" />
                          </div>
                          <div className="leg-content">
                            <div className="leg-text">
                              <div className="leg-route">{leg.label}</div>
                              <div className="leg-meta fw">Crew ready · pre-mission setup</div>
                            </div>
                            <div className="leg-time fw">{formatTime(leg.time)}</div>
                          </div>
                        </div>
                      );
                    }
                    if (leg.type === "flight") {
                      return (
                        <div key={i} className="leg">
                          <div className="leg-connector">
                            <div className="leg-dot flight-dot" />
                            {(!isLast && !nextIsBedside) && <div className="leg-line" />}
                            {nextIsBedside && <div className="leg-line" />}
                          </div>
                          <div className="leg-content">
                            <div className="leg-text">
                              <div className="leg-route">{leg.label}</div>
                              <div className="leg-meta fw">{leg.miles} nm · {leg.gs ?? cfg.fwSpeedKts} kts GS</div>
                            </div>
                            <div className="leg-time fw">{formatTime(leg.time)}</div>
                          </div>
                        </div>
                      );
                    }
                    // ground
                    return (
                      <div key={i} className="leg">
                        <div className="leg-connector">
                          <div className="leg-dot fw" />
                          {(!isLast) && <div className="leg-line" />}
                        </div>
                        <div className="leg-content">
                          <div className="leg-text">
                            <div className="leg-route">{leg.label}</div>
                            <div className="leg-meta">{leg.miles} mi · {leg.live ? "road routing" : "transit"}</div>
                          </div>
                          <div className="leg-time">{formatTime(leg.time)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="disclaimer">
                  ⚠ Fixed Wing: straight-line {cfg.fwSpeedKts} kts + {cfg.fwOpsMin} min ops per leg · Ground transfers via Google Routes API · Estimates only — not for clinical decision-making
                </div>
              </div>
            ) : (
              <div className="hint">
                {!valid ? "Select sending and receiving hospitals"
                  : !sendingAirportId || !receivingAirportId ? "Select sending and receiving airports to calculate"
                  : ""}
              </div>
            )
          ) : activeResult ? (
            <div className="profile" key={`${baseId}-${sendingId}-${receivingId}-${mode}`}>
              <div className="divider">Mission Profile</div>

              {mode === "ground" && groundRoute && (
                <div className="live-status">
                  <span className="live-badge">● Road Routing</span>
                </div>
              )}

              <div className="totals">
                <div className="total-box">
                  <div className="total-label">Transit Only</div>
                  <div className="total-value">{formatTime(activeResult.transit)}</div>
                  <div className="total-breakdown">Driving/flight time</div>
                </div>
                <div className={`total-box highlight${mode === "air" ? " air" : ""}`}>
                  <div className={`total-label ${mode === "air" ? "green" : "gold"}`}>Total Mission</div>
                  <div className="total-value">{formatTime(activeResult.total)}</div>
                  <div className="total-breakdown">Transit + {bedsideTotal} min bedside{isRodman && includeCmmcStop ? ` + ${cfg.cmmcStopMin} min CMMC` : ""}{activeResult.fuelStop ? ` + ${cfg.fuelStopMin} min fuel` : ""}</div>
                </div>
              </div>

              <div className="legs">
                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    <div className="leg-line" />
                  </div>
                  <div className="leg-content">
                    <div className="leg-text">
                      <div className="leg-route">{result.legs[0].label}</div>
                      <div className="leg-meta">{result.legs[0].miles} mi · {result.legs[0].gs ? `${result.legs[0].gs} kts GS · +${cfg.rotorOpsMin}m lift` : legMeta}</div>
                    </div>
                    <div className="leg-time">{formatTime(result.legs[0].time)}</div>
                  </div>
                </div>

                <div className="bedside-stop">
                  <div className="bedside-connector">
                    <div className="bedside-dot">+</div>
                    <div className="bedside-line" />
                  </div>
                  <div className="bedside-content">
                    <div className="bedside-text">
                      <div className="bedside-label">Bedside · Sending</div>
                      <div className="bedside-name">{sending.name}</div>
                    </div>
                    <div className="bedside-time">{formatTime(bedsideMin)}</div>
                  </div>
                </div>

                {activeResult?.fuelStop ? (<>
                  <div className="leg">
                    <div className="leg-connector">
                      <div className="leg-dot dim" />
                      <div className="leg-line" />
                    </div>
                    <div className="leg-content">
                      <div className="leg-text">
                        <div className="leg-route">{activeResult.fuelStop.leg1.label}</div>
                        <div className="leg-meta">{activeResult.fuelStop.leg1.miles} mi · {activeResult.fuelStop.leg1.gs ? `${activeResult.fuelStop.leg1.gs} kts GS` : "rotor"}</div>
                      </div>
                      <div className="leg-time">{formatTime(activeResult.fuelStop.leg1.time)}</div>
                    </div>
                  </div>
                  <div className="fuel-stop-stop">
                    <div className="fuel-stop-connector">
                      <div className="fuel-stop-dot" />
                      <div className="leg-line" />
                    </div>
                    <div className="fuel-stop-content">
                      <div className="fuel-stop-text">
                        <div className="fuel-stop-label">Fuel Stop · {activeResult.fuelStop.airport.code}</div>
                        <div className="fuel-stop-name">{activeResult.fuelStop.airport.city}</div>
                      </div>
                      <div className="fuel-stop-time">{formatTime(activeResult.fuelStop.stopMin)}</div>
                    </div>
                  </div>
                  <div className="leg">
                    <div className="leg-connector">
                      <div className="leg-dot dim" />
                      <div className="leg-line" />
                    </div>
                    <div className="leg-content">
                      <div className="leg-text">
                        <div className="leg-route">{activeResult.fuelStop.leg2.label}</div>
                        <div className="leg-meta">{activeResult.fuelStop.leg2.miles} mi · {activeResult.fuelStop.leg2.gs ? `${activeResult.fuelStop.leg2.gs} kts GS` : "rotor"}</div>
                      </div>
                      <div className="leg-time">{formatTime(activeResult.fuelStop.leg2.time)}</div>
                    </div>
                  </div>
                </>) : (
                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    <div className="leg-line" />
                  </div>
                  <div className="leg-content">
                    <div className="leg-text">
                      <div className="leg-route">{result.legs[1].label}</div>
                      <div className="leg-meta">{result.legs[1].miles} mi · {result.legs[1].gs ? `${result.legs[1].gs} kts GS` : legMeta}</div>
                    </div>
                    <div className="leg-time">{formatTime(result.legs[1].time)}</div>
                  </div>
                </div>
                )}

                <div className="bedside-stop">
                  <div className="bedside-connector">
                    <div className="bedside-dot receiving">+</div>
                    <div className="bedside-line" />
                  </div>
                  <div className="bedside-content">
                    <div className="bedside-text">
                      <div className="bedside-label receiving">Bedside · Receiving</div>
                      <div className="bedside-name">{receiving.name}</div>
                    </div>
                    <div className="bedside-time">{formatTime(bedsideMin)}</div>
                  </div>
                </div>

                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    {isRodman && <div className="leg-line" />}
                  </div>
                  <div className="leg-content">
                    <div className="leg-text">
                      <div className="leg-route">{result.legs[2].label}</div>
                      <div className="leg-meta">{result.legs[2].miles} mi · {result.legs[2].gs ? `${result.legs[2].gs} kts GS` : legMeta}</div>
                      {isRodman && <div className="restock-badge">⟳ Restock at CMMC</div>}
                    </div>
                    <div className="leg-time">{formatTime(result.legs[2].time)}</div>
                  </div>
                </div>

                {isRodman && result.legs[3] && (
                  <div className="leg">
                    <div className="leg-connector">
                      <div className="leg-dot green" />
                    </div>
                    <div className="leg-content">
                      <div className="leg-text">
                        <div className="leg-route">{result.legs[3].label}</div>
                        <div className="leg-meta">{result.legs[3].miles} mi · {result.legs[3].gs ? `${result.legs[3].gs} kts GS` : "return to base"}</div>
                      </div>
                      <div className="leg-time">{formatTime(result.legs[3].time)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="disclaimer">
                ⚠ Ground: road routing via Google Routes API (traffic-aware) · Rotor: straight-line {cfg.rotorSpeedKts} kts + {cfg.rotorOpsMin} min ops · Estimates only — not for clinical decision-making
              </div>
            </div>
          ) : (
            <div className="hint">
              {baseId && sendingId && receivingId && sendingId === receivingId
                ? "Sending and receiving hospitals must differ"
                : "Select base, sending hospital, and receiving hospital"}
            </div>
          )}
          <div className="admin-link-row">
            <a href="#/admin" className="admin-link">⚙ Admin Settings</a>
          </div>
        </div>

        {isLoaded && (activeResult || fwResult) && (
          <div className="map-wrap">
            <div
              ref={mapDivRefCallback}
              className="map-canvas"
            />
            <div className="map-controls">
              <div className="weather-controls">
                {[["", "Off"], ["precip", "Precip"]].map(([val, label]) => (
                  <button
                    key={val}
                    className={`weather-btn${weatherLayer === val ? " active" : ""}`}
                    onClick={() => setWeatherLayer(val)}
                  >{label}</button>
                ))}
              </div>
              <button
                className={`weather-btn traffic-toggle${showTraffic ? " active traffic" : ""}`}
                onClick={() => setShowTraffic(t => !t)}
              >Traffic</button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
