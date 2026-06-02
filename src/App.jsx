import { useState, useRef, useEffect } from "react";

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

function groundMin(miles) {
  return Math.round((miles * 1.35 / 55) * 60 + 5);
}

function flightMin(miles) {
  return Math.round((miles / 145) * 60 + 10);
}

function formatTime(mins) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// Parse Routes API duration string e.g. "3600s" → 3600
const parseSecs = s => parseInt(s) || 0;

// Fixed Wing — King Air B200 with Raisbeck EPIC Platinum
const FW_SPEED_KTS = 270;
const FW_LIFT_MIN  = 30;
const FW_OPS_MIN   = 10; // per flight leg overhead (departure + arrival)

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

function fwFlightMin(lat1, lng1, lat2, lng2) {
  const nm = haversine(lat1, lng1, lat2, lng2) * 0.868976; // statute → nautical miles
  return Math.round((nm / FW_SPEED_KTS) * 60 + FW_OPS_MIN);
}

const BASE_SHIFTS = {
  sanford:       [{ start: 800,  end: 2000 }, { start: 2000, end: 800  }],
  cmmc_base:     [{ start: 1000, end: 2200 }],
  rodman:        [{ start: 1000, end: 2200 }],
  emmc_base:     [{ start: 1900, end: 700  }, { start: 700,  end: 1900 }],
  bangor_hangar: [{ start: 1900, end: 700  }, { start: 700,  end: 1900 }],
};

function getActiveShift(baseId, now) {
  const shifts = BASE_SHIFTS[baseId];
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
  const total = transit + BEDSIDE_TOTAL + (base.restockId ? CMMC_STOP_MIN : 0);

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

const LOAD_TIME = (() => { const d = new Date(); return `${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}`; })();

function HospitalSelect({ value, onChange, placeholder, exclude, pinnedIds }) {
  const [open, setOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const [nhOpen, setNhOpen] = useState(false);
  const [maOpen, setMaOpen] = useState(false);
  const ref = useRef(null);

  const available = exclude ? HOSPITALS.filter(h => h.id !== exclude) : HOSPITALS;
  const pinnedSet = new Set(pinnedIds || []);
  const pinned = pinnedIds ? pinnedIds.map(id => available.find(h => h.id === id)).filter(Boolean) : [];
  const me = available.filter(h => h.state === "ME" && !pinnedSet.has(h.id));
  const nh = available.filter(h => h.state === "NH");
  const ma = available.filter(h => h.state === "MA");
  const selected = HOSPITALS.find(h => h.id === value);

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

  // --- all state up front ---
  const [isDark, setIsDark] = useState(isDarkHour);
  const [now, setNow] = useState(() => new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [groundRoute, setGroundRoute] = useState(null);
  const [fwGroundLegs, setFwGroundLegs] = useState(null);
  const [sendingAirportId, setSendingAirportId] = useState("");
  const [receivingAirportId, setReceivingAirportId] = useState("");
  const [currentPos, setCurrentPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [bedsideMin, setBedsideMin] = useState(40);
  const [weatherLayer, setWeatherLayer] = useState("precip");
  const [showTraffic, setShowTraffic] = useState(true);
  const [hospitalWeather, setHospitalWeather] = useState({});

  const fixedBase = BASES.find(b => b.id === baseId);
  const base = baseId === "current"
    ? (currentPos ? { id: "current", name: "Current Location", city: "Current Location", lat: currentPos.lat, lng: currentPos.lng, restockId: null } : null)
    : fixedBase;
  const sending = HOSPITALS.find(h => h.id === sendingId);
  const receiving = HOSPITALS.find(h => h.id === receivingId);

  // --- derived values ---
  const valid = base && sending && receiving && sendingId !== receivingId;
  const isRodman = base?.restockId != null;
  const legMeta = groundRoute ? "road routing" : "transit";

  const bedsideTotal = bedsideMin * 2;
  const haverResult = (valid && mode !== "fw") ? calcLegs(base, sending, receiving, mode) : null;
  const result = (() => {
    if (!haverResult) return null;
    if (mode !== "ground" || !groundRoute) {
      return { ...haverResult, total: haverResult.transit + bedsideTotal + (base.restockId ? CMMC_STOP_MIN : 0) };
    }
    const apiLegs = groundRoute.legs;
    const updatedLegs = haverResult.legs.map((leg, i) => ({
      ...leg,
      time: apiLegs[i] ? Math.round(parseSecs(apiLegs[i].duration) / 60) : leg.time,
      miles: apiLegs[i] ? Math.round((apiLegs[i].distanceMeters ?? 0) / 1609.34) : leg.miles,
    }));
    const transit = updatedLegs.reduce((sum, l) => sum + l.time, 0);
    return { ...haverResult, legs: updatedLegs, transit, total: transit + bedsideTotal + (base.restockId ? CMMC_STOP_MIN : 0) };
  })();

  const fwResult = (() => {
    if (mode !== "fw" || !valid || !sendingAirportId || !receivingAirportId) return null;
    const sendApt  = AIRPORTS.find(a => a.id === sendingAirportId);
    const recvApt  = AIRPORTS.find(a => a.id === receivingAirportId);
    const bgrApt   = AIRPORTS.find(a => a.id === "bgr");
    const isBgrBoth = sendingAirportId === "bgr" && receivingAirportId === "bgr";
    const sameApt   = sendingAirportId === receivingAirportId;
    const gl = fwGroundLegs;

    const gLeg = (key, from, to, fLat, fLng, tLat, tLng) => ({
      type: "ground",
      key,
      toCoord: { lat: tLat, lng: tLng },
      label: `Ground · ${from} → ${to}`,
      time:  gl?.[key]?.time  ?? groundMin(haversine(fLat, fLng, tLat, tLng)),
      miles: gl?.[key]?.miles ?? Math.round(haversine(fLat, fLng, tLat, tLng)),
      live: !!gl?.[key]?.time,
    });
    const fLeg = (a, b) => ({
      type: "flight",
      toCoord: { lat: b.lat, lng: b.lng },
      label: `Flight · ${a.code} → ${b.code}`,
      time:  fwFlightMin(a.lat, a.lng, b.lat, b.lng),
      miles: Math.round(haversine(a.lat, a.lng, b.lat, b.lng) * 0.868976),
    });

    const legs = [];
    legs.push({ type: "lift", label: "Lift · 600 Hangar (KBGR)", time: FW_LIFT_MIN });
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
    const active = getActiveShift(shiftBaseId, now);
    if (!active) return { status: "none" };
    const activeResult = mode === "fw" ? fwResult : result;
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

  useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    const id = setInterval(() => { setIsDark(isDarkHour()); setNow(new Date()); }, 60_000);
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
  }, [sendingId, receivingId]);

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
    // Defer by one frame so mobile browsers finish layout before Maps measures the container
    const raf = requestAnimationFrame(() => {
      if (!mapDivRef.current || mapInstanceRef.current) return;
      mapInstanceRef.current = new window.google.maps.Map(mapDivRef.current, {
        center: { lat: 44.5, lng: -69.5 },
        zoom: 7,
        styles: isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });
      // Trigger resize so Maps re-measures the container — fixes blank map on mobile
      window.google.maps.event.trigger(mapInstanceRef.current, "resize");
      setMapReady(true);
    });
    return () => cancelAnimationFrame(raf);
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
    if (hospitalWeather[sending.id] != null)
      labels.push(makeTempLabel({ lat: sending.lat, lng: sending.lng }, `${hospitalWeather[sending.id]}°F`, "sending", map));
    if (hospitalWeather[receiving.id] != null)
      labels.push(makeTempLabel({ lat: receiving.lat, lng: receiving.lng }, `${hospitalWeather[receiving.id]}°F`, "receiving", map));
    tempLabelsRef.current = labels;
  }, [hospitalWeather, sendingId, receivingId, valid, mapReady]);

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
      path = [
        { lat: base.lat, lng: base.lng },
        { lat: sending.lat, lng: sending.lng },
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
  }, [valid, baseId, sendingId, receivingId, mode, groundRoute, sendingAirportId, receivingAirportId, fwGroundLegs]);

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
        .header-row { display: flex; align-items: center; gap: 16px; }
        .logo { height: 48px; width: auto; }
        .title { font-size: 24px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1a2d40; line-height: 1; }
        .sub { font-family: 'Share Tech Mono', monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; color: #1a2d40; margin-top: 5px; }

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
          font-size: 17px;
          padding: 12px 34px 12px 12px;
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
        .mode-btn:last-child { border-radius: 0 2px 2px 0; }
        .mode-btn:not(:first-child) { border-left: none; }
        .mode-btn.active.ground { background: #fffbeb; border-color: #c49a00; color: #a07800; }
        .mode-btn.active.air    { background: #f0fdf4; border-color: #1a7040; color: #1a7040; }
        .mode-btn.active.fw     { background: #f0f4ff; border-color: #3060b0; color: #3060b0; }
        .mode-btn:not(.active):not(:disabled):hover { border-color: #b0c8e0; color: #4a6a8a; }
        .mode-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* FIXED WING LEGS */
        .leg-dot.fw   { border-color: #3060b0; }
        .leg-dot.lift { border-color: #3060b0; background: #3060b0; width: 11px; height: 11px; border-radius: 2px; }
        .leg-dot.flight-dot { border-color: #3060b0; background: #d0e0ff; }
        .leg-meta.fw { color: #3060b0; }
        .leg-time.fw { color: #1a3a70; }
        .total-box.highlight.fw { border-color: #3060b0; background: #f0f4ff; }
        .total-label.blue { color: #3060b0; }
        body[data-theme="dark"] .mode-btn.active.fw     { background: #080e1e; border-color: #3a6ad4; color: #3a6ad4; }
        body[data-theme="dark"] .leg-dot.fw             { border-color: #3a6ad4; }
        body[data-theme="dark"] .leg-dot.lift           { border-color: #3a6ad4; background: #3a6ad4; }
        body[data-theme="dark"] .leg-dot.flight-dot     { border-color: #3a6ad4; background: #0a1830; }
        body[data-theme="dark"] .leg-meta.fw            { color: #3a6ad4; }
        body[data-theme="dark"] .leg-time.fw            { color: #aac0e8; }
        body[data-theme="dark"] .total-box.highlight.fw { border-color: #3a6ad4; background: #080e1e; }
        body[data-theme="dark"] .total-label.blue       { color: #3a6ad4; }

        /* SHIFT INDICATOR */
        .shift-indicator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 7px 12px;
          border-radius: 2px;
          border: 1px solid;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .si-left { display: flex; align-items: center; gap: 6px; }
        .si-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
        .si-return { font-weight: 600; }
        .shift-indicator.si-none { background: #f8fafc; border-color: #cddbe8; color: #8aaac4; }
        .shift-indicator.si-idle { background: #f8fafc; border-color: #cddbe8; color: #4a6a8a; }
        .shift-indicator.si-green  { background: #f0fdf4; border-color: #1a7040; color: #1a7040; }
        .shift-indicator.si-yellow { background: #fffbeb; border-color: #c49a00; color: #a07800; }
        .shift-indicator.si-red    { background: #fff2f2; border-color: #c02020; color: #a01010; }
        body[data-theme="dark"] .shift-indicator.si-none   { background: #060f18; border-color: #152434; color: #2e5a72; }
        body[data-theme="dark"] .shift-indicator.si-idle   { background: #060f18; border-color: #2a4a60; color: #5a8a9a; }
        body[data-theme="dark"] .shift-indicator.si-green  { background: #001810; border-color: #1e7a48; color: #1e9a58; }
        body[data-theme="dark"] .shift-indicator.si-yellow { background: #1a1400; border-color: #d4a820; color: #d4a820; }
        body[data-theme="dark"] .shift-indicator.si-red    { background: #1a0000; border-color: #c04040; color: #e05050; }

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

        /* LIVE TRAFFIC BADGE */
        .live-status { margin-bottom: 14px; }
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 2px;
          padding: 3px 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: #f0fdf4;
          border: 1px solid #1a7040;
          color: #1a7040;
        }
        body[data-theme="dark"] .live-badge { background: #001810; border-color: #1e7a48; color: #1e9a58; }

        /* BEDSIDE PRESET SELECTOR */
        .bedside-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .reset-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid #cddbe8;
          color: #8aaac4;
          border-radius: 99px;
          padding: 5px 14px;
          cursor: pointer;
          transition: all 0.18s;
          margin-top: 16px;
        }
        .reset-pill:hover { border-color: #c02020; color: #c02020; background: #fff2f2; }
        body[data-theme="dark"] .reset-pill { border-color: #152434; color: #2e5a72; }
        body[data-theme="dark"] .reset-pill:hover { border-color: #c04040; color: #e05050; background: #1a0000; }
        .bedside-selector {
          width: 162px;
        }
        .bedside-hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.12em;
          color: #8aaac4;
          margin-top: 4px;
          text-align: right;
        }
        body[data-theme="dark"] .bedside-hint { color: #2e5a72; }

        /* HOSPITAL CUSTOM SELECT */
        .hsel { position: relative; }
        .hsel-trigger {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #cddbe8;
          color: #2a4060;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          padding: 9px 34px 9px 12px;
          border-radius: 2px;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          outline: none;
          transition: border-color 0.18s;
        }
        .hsel-trigger:focus, .hsel-trigger:hover { border-color: #c49a00; }
        .hsel-trigger.placeholder { color: #8aaac4; }
        .hsel-arrow { color: #8aaac4; font-size: 13px; flex-shrink: 0; margin-left: 8px; }
        .hsel-panel {
          position: absolute;
          top: calc(100% + 2px);
          left: 0; right: 0;
          background: #ffffff;
          border: 1px solid #cddbe8;
          border-radius: 2px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 200;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .hsel-state-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #8aaac4;
          padding: 7px 12px 5px;
          background: #f0f4f8;
          border-bottom: 1px solid #e8eff6;
          position: sticky;
          top: 0;
        }
        .hsel-state-toggle {
          width: 100%;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4a6a8a;
          padding: 7px 12px 5px;
          background: #f0f4f8;
          border: none;
          border-top: 1px solid #e8eff6;
          cursor: pointer;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hsel-state-toggle:hover { background: #e4ecf4; color: #2a4060; }
        .hsel-option {
          width: 100%;
          background: none;
          border: none;
          border-bottom: 1px solid #f0f4f8;
          padding: 8px 12px;
          text-align: left;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          color: #2a4060;
          cursor: pointer;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          min-height: 36px;
        }
        .hsel-option:hover { background: #f0f4f8; }
        .hsel-option.active { background: #fffbeb; color: #a07800; }
        .hsel-city {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #8aaac4;
          flex-shrink: 0;
        }
        .hsel-option.active .hsel-city { color: #c49a00; }

        body[data-theme="dark"] .hsel-trigger { background: #060f18; border-color: #152434; color: #b8ccd8; }
        body[data-theme="dark"] .hsel-trigger.placeholder { color: #2e5a72; }
        body[data-theme="dark"] .hsel-arrow { color: #2e5a72; }
        body[data-theme="dark"] .hsel-panel { background: #0b1520; border-color: #152434; box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
        body[data-theme="dark"] .hsel-state-label { color: #2e5a72; background: #060f18; border-color: #0d2030; }
        body[data-theme="dark"] .hsel-state-toggle { color: #5a8a9a; background: #060f18; border-color: #0d2030; }
        body[data-theme="dark"] .hsel-state-toggle:hover { background: #0d2030; color: #8aacbe; }
        body[data-theme="dark"] .hsel-option { color: #8aacbe; border-color: #0d2030; }
        body[data-theme="dark"] .hsel-option:hover { background: #0d2030; }
        body[data-theme="dark"] .hsel-option.active { background: #1a1400; color: #d4a820; }
        body[data-theme="dark"] .hsel-city { color: #2e5a72; }
        body[data-theme="dark"] .hsel-option.active .hsel-city { color: #a07820; }

        /* MAP TEMPERATURE LABELS */
        .temp-label {
          position: absolute;
          background: rgba(255,255,255,0.92);
          border: 1px solid #cddbe8;
          border-radius: 2px;
          padding: 1px 5px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #4a6a8a;
          white-space: nowrap;
          pointer-events: none;
          transform: translate(-50%, -210%);
        }
        .temp-label.sending   { border-color: #c49a00; color: #a07800; background: rgba(255,251,235,0.92); }
        .temp-label.receiving { border-color: #1a7040; color: #1a7040; background: rgba(240,253,244,0.92); }
        body[data-theme="dark"] .temp-label { background: rgba(7,13,20,0.92); border-color: #152434; color: #5a8a9a; }
        body[data-theme="dark"] .temp-label.sending   { border-color: #d4a820; color: #d4a820; background: rgba(26,20,0,0.92); }
        body[data-theme="dark"] .temp-label.receiving { border-color: #1e7a48; color: #1e9a58; background: rgba(0,24,16,0.92); }

        /* MAP LAYER CONTROLS */
        .map-wrap { position: relative; margin-top: 16px; }
        .map-controls {
          position: absolute;
          top: 8px; right: 8px;
          z-index: 10;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .weather-controls {
          display: flex;
        }
        .traffic-toggle { border-radius: 2px !important; }
        .traffic-toggle.active.traffic { background: rgba(255,245,235,0.96); border-color: #c06020; color: #c06020; }
        .weather-btn {
          background: rgba(255,255,255,0.92);
          border: 1px solid #cddbe8;
          padding: 5px 9px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6a8aaa;
          cursor: pointer;
          transition: all 0.18s;
        }
        .weather-btn:not(:last-child) { border-right: none; }
        .weather-btn:first-child { border-radius: 2px 0 0 2px; }
        .weather-btn:last-child  { border-radius: 0 2px 2px 0; }
        .weather-btn.active { background: rgba(240,253,244,0.96); border-color: #1a7040; color: #1a7040; border-right: 1px solid #1a7040; }
        .weather-btn.active + .weather-btn { border-left: none; }
        .weather-btn:hover:not(.active) { color: #2a4060; border-color: #b0c8e0; }
        body[data-theme="dark"] .weather-btn { background: rgba(11,21,32,0.92); border-color: #152434; color: #3a6080; }
        body[data-theme="dark"] .weather-btn.active { background: rgba(0,24,16,0.92); border-color: #1e7a48; color: #1e9a58; }

        /* THEME TRANSITIONS */
        body, .card, select, .mode-btn, .total-box, .leg-dot, .bedside-dot {
          transition: background 0.4s, color 0.4s, border-color 0.4s;
        }

        /* DARK THEME OVERRIDES */
        body[data-theme="dark"] { background: #070d14; color: #b8ccd8; }
        body[data-theme="dark"] .title { color: #deeaf2; }
        body[data-theme="dark"] .sub { color: #7aaabb; }
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
            <img src="/lifeflight-logo.svg" className="logo" alt="LifeFlight of Maine" />
            <div>
              <div className="title">Mission Time Calculator</div>
              <div className="sub">{LOAD_TIME}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="bedside-row">
            <button
              className="reset-pill"
              onClick={() => { setBaseId(""); setCrewBaseId(""); setSendingId(""); setReceivingId(""); setMode("ground"); setBedsideMin(40); }}
            >Reset</button>
            <div className="bedside-selector">
              <div className="sec-label">Bedside Time</div>
              <div className="sel-wrap">
                <select value={bedsideMin} onChange={e => setBedsideMin(Number(e.target.value))}>
                  {BEDSIDE_PRESETS.map(p => (
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
                        {AIRPORTS.filter(a => a.state === s.code).map(a => (
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
                        {AIRPORTS.filter(a => a.state === s.code).map(a => (
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
            </div>
          )}

          {mode === "fw" ? (
            fwResult ? (
              <div className="profile" key={`fw-${sendingId}-${receivingId}-${sendingAirportId}-${receivingAirportId}`}>
                <div className="divider">Mission Profile</div>
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
                            <div className={`bedside-label${isSending ? "" : " receiving"}`}>Bedside · {isSending ? "Sending" : "Receiving"}</div>
                            <div className="bedside-name">{leg.hospital.name}</div>
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
                            <div className="leg-route">{leg.label}</div>
                            <div className="leg-meta fw">Crew ready · pre-mission setup</div>
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
                            <div className="leg-route">{leg.label}</div>
                            <div className="leg-meta fw">{leg.miles} nm · {FW_SPEED_KTS} kts</div>
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
                          <div className="leg-route">{leg.label}</div>
                          <div className="leg-meta">{leg.miles} mi · {leg.live ? "road routing" : "transit"}</div>
                          <div className="leg-time">{formatTime(leg.time)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

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

                <div className="disclaimer">
                  ⚠ Fixed Wing: straight-line {FW_SPEED_KTS} kts + {FW_OPS_MIN} min ops per leg · Ground transfers via Google Routes API · Estimates only — not for clinical decision-making
                </div>
              </div>
            ) : (
              <div className="hint">
                {!valid ? "Select sending and receiving hospitals"
                  : !sendingAirportId || !receivingAirportId ? "Select sending and receiving airports to calculate"
                  : ""}
              </div>
            )
          ) : result ? (
            <div className="profile" key={`${baseId}-${sendingId}-${receivingId}-${mode}`}>
              <div className="divider">Mission Profile</div>

              {mode === "ground" && groundRoute && (
                <div className="live-status">
                  <span className="live-badge">● Road Routing</span>
                </div>
              )}

              <div className="legs">
                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    <div className="leg-line" />
                  </div>
                  <div className="leg-content">
                    <div className="leg-route">{result.legs[0].label}</div>
                    <div className="leg-meta">{result.legs[0].miles} mi · {legMeta}</div>
                    <div className="leg-time">{formatTime(result.legs[0].time)}</div>
                  </div>
                </div>

                <div className="bedside-stop">
                  <div className="bedside-connector">
                    <div className="bedside-dot">+</div>
                    <div className="bedside-line" />
                  </div>
                  <div className="bedside-content">
                    <div className="bedside-label">Bedside · Sending</div>
                    <div className="bedside-name">{sending.name}</div>
                    <div className="bedside-time">{formatTime(bedsideMin)}</div>
                  </div>
                </div>

                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    <div className="leg-line" />
                  </div>
                  <div className="leg-content">
                    <div className="leg-route">{result.legs[1].label}</div>
                    <div className="leg-meta">{result.legs[1].miles} mi · {legMeta}</div>
                    <div className="leg-time">{formatTime(result.legs[1].time)}</div>
                  </div>
                </div>

                <div className="bedside-stop">
                  <div className="bedside-connector">
                    <div className="bedside-dot receiving">+</div>
                    <div className="bedside-line" />
                  </div>
                  <div className="bedside-content">
                    <div className="bedside-label receiving">Bedside · Receiving</div>
                    <div className="bedside-name">{receiving.name}</div>
                    <div className="bedside-time">{formatTime(bedsideMin)}</div>
                  </div>
                </div>

                <div className="leg">
                  <div className="leg-connector">
                    <div className="leg-dot dim" />
                    {isRodman && <div className="leg-line" />}
                  </div>
                  <div className="leg-content">
                    <div className="leg-route">{result.legs[2].label}</div>
                    <div className="leg-meta">{result.legs[2].miles} mi · {legMeta}</div>
                    <div className="leg-time">{formatTime(result.legs[2].time)}</div>
                    {isRodman && <div className="restock-badge">⟳ Restock at CMMC</div>}
                  </div>
                </div>

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
                  <div className="total-breakdown">Transit + {bedsideTotal} min bedside{isRodman ? " + 15 min CMMC" : ""}</div>
                </div>
              </div>

              <div className="disclaimer">
                ⚠ Ground: road routing via Google Routes API (traffic-aware) · Rotor: straight-line 145 kts + 10 min ops · Estimates only — not for clinical decision-making
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

        {isLoaded && (result || fwResult) && (
          <div className="map-wrap">
            <div
              ref={mapDivRef}
              style={{ display: "block", width: "100%", borderRadius: 4, overflow: "hidden", height: 320,
                border: `1px solid ${isDark ? "#152434" : "#dde6ef"}` }}
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
    </>
  );
}
