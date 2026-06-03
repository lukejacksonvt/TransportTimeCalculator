import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadConfig, saveConfig, resetConfig, DEFAULT_CONFIG } from "./config";

const BASES = [
  { id: "sanford",       name: "Sanford Base" },
  { id: "cmmc_base",     name: "CMMC Base" },
  { id: "rodman",        name: "Rodman Road Base" },
  { id: "emmc_base",     name: "EMMC Base" },
  { id: "bangor_hangar", name: "600 Hangar" },
];
const STATES = ["ME", "NH", "MA", "VT", "NY", "Other"];

const toDisplay = n => `${String(Math.floor(n / 100)).padStart(2, "0")}:${String(n % 100).padStart(2, "0")}`;
const fromDisplay = s => { const [h, m = 0] = s.split(":").map(Number); return h * 100 + m; };

function NumField({ label, value, onChange, min, max, step = 1, unit = "" }) {
  return (
    <div className="ad-field">
      <label className="ad-label">{label}</label>
      <div className="ad-input-wrap">
        <input
          type="number" className="ad-input" value={value} min={min} max={max} step={step}
          onChange={e => onChange(Number(e.target.value))}
        />
        {unit && <span className="ad-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [isDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [cfg, setCfg] = useState(() => loadConfig());
  const [toast, setToast] = useState("");
  const [newHosp, setNewHosp] = useState({ state: "ME", name: "", city: "", lat: "", lng: "" });
  const [newApt,  setNewApt]  = useState({ state: "ME", code: "", city: "", lat: "", lng: "" });

  const set = (key, val) => setCfg(prev => ({ ...prev, [key]: val }));

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleSave = () => { saveConfig(cfg); showToast("Saved — reload calculator to apply"); };
  const handleReset = () => {
    if (!window.confirm("Reset all admin settings to defaults?")) return;
    resetConfig();
    setCfg(loadConfig());
    showToast("Reset to defaults");
  };

  // Bedside presets
  const setPreset = (i, field, val) =>
    set("bedsidePresets", cfg.bedsidePresets.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  // Shift windows
  const setShift = (baseId, si, field, rawVal) => {
    const val = fromDisplay(rawVal);
    set("baseShifts", {
      ...cfg.baseShifts,
      [baseId]: (cfg.baseShifts[baseId] || []).map((s, idx) => idx === si ? { ...s, [field]: val } : s),
    });
  };
  const addShift = baseId =>
    set("baseShifts", { ...cfg.baseShifts, [baseId]: [...(cfg.baseShifts[baseId] || []), { start: 700, end: 1900 }] });
  const removeShift = (baseId, si) =>
    set("baseShifts", { ...cfg.baseShifts, [baseId]: (cfg.baseShifts[baseId] || []).filter((_, i) => i !== si) });

  // Custom hospitals
  const addHospital = () => {
    const { state, name, city, lat, lng } = newHosp;
    if (!name || !city || !lat || !lng) return showToast("Fill in all hospital fields");
    const id = `custom_${Date.now()}`;
    set("customHospitals", [...cfg.customHospitals, { id, state, name, city, lat: Number(lat), lng: Number(lng) }]);
    setNewHosp({ state: "ME", name: "", city: "", lat: "", lng: "" });
  };
  const removeHospital = id => set("customHospitals", cfg.customHospitals.filter(h => h.id !== id));

  // Custom airports
  const addAirport = () => {
    const { state, code, city, lat, lng } = newApt;
    if (!code || !city || !lat || !lng) return showToast("Fill in all airport fields");
    const id = `custom_${Date.now()}`;
    set("customAirports", [...cfg.customAirports, { id, state, code, city, lat: Number(lat), lng: Number(lng) }]);
    setNewApt({ state: "ME", code: "", city: "", lat: "", lng: "" });
  };
  const removeAirport = id => set("customAirports", cfg.customAirports.filter(a => a.id !== id));

  return (
    <div className={`app-root${isDark ? " night" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira:wght@300;400;600;700&family=Spline+Sans+Mono:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100%; margin: 0; }
        .app-root {
          --bg:#e9eef3; --surface:#f6f8fa; --surface-2:#eef2f6; --inset:#ffffff;
          --border:#d9e1e9; --border-strong:#c4d1dd;
          --text:#1b2a3d; --text-2:#4a6076; --text-muted:#8b9fb2;
          --green:#1f7a44; --green-deep:#155c33; --green-tint:#ebf4ef;
          --gold:#bb8e10; --gold-deep:#8a6800; --gold-tint:#f9f1da;
          --red:#c0432f; --red-tint:#faecea;
          --shadow:0 1px 2px rgba(20,40,60,.05),0 8px 20px -14px rgba(20,40,60,.22);
          --r:14px; --r-sm:11px;
          font-family:'Saira',sans-serif; color:var(--text);
          min-height:100vh; padding:28px 16px 48px;
          background:#e4e8ec;
        }
        .app-root.night {
          --bg:#0c131b; --surface:#131d27; --surface-2:#0f1822; --inset:#0a121b;
          --border:#233240; --border-strong:#324456;
          --text:#e6edf3; --text-2:#a8bccd; --text-muted:#7a8ea0;
          --green:#3fae6c; --green-deep:#2f9159; --green-tint:#0f241a;
          --gold:#e0b341; --gold-deep:#c4982c; --gold-tint:#211a08;
          --red:#e2624a; --red-tint:#2a120d;
          --shadow:0 1px 2px rgba(0,0,0,.4),0 12px 30px -16px rgba(0,0,0,.6);
          background:#05090d;
        }
        .ad-wrap { max-width: 640px; margin: 0 auto; }
        .ad-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:10px; }
        .ad-title { font-size:22px; font-weight:600; letter-spacing:-.005em; color:var(--text); }
        .ad-header-actions { display:flex; gap:8px; align-items:center; }
        .ad-back { font-family:'Spline Sans Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; background:transparent; border:1px solid var(--border-strong); color:var(--text-muted); border-radius:99px; padding:5px 12px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; transition:all .18s; }
        .ad-back:hover { border-color:var(--text-2); color:var(--text-2); }
        .ad-save { font-family:'Spline Sans Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; background:var(--green-tint); border:1px solid var(--green); color:var(--green); border-radius:99px; padding:5px 14px; cursor:pointer; transition:all .18s; }
        .ad-save:hover { background:var(--green); color:var(--inset); }
        .ad-reset { font-family:'Spline Sans Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; background:transparent; border:1px solid var(--border-strong); color:var(--text-muted); border-radius:99px; padding:5px 12px; cursor:pointer; transition:all .18s; }
        .ad-reset:hover { border-color:var(--red); color:var(--red); background:var(--red-tint); }
        .ad-toast { font-family:'Spline Sans Mono',monospace; font-size:10px; letter-spacing:.12em; color:var(--green); background:var(--green-tint); border:1px solid var(--green); border-radius:var(--r-sm); padding:4px 12px; }
        .ad-section { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:20px; margin-bottom:16px; box-shadow:var(--shadow); overflow:hidden; position:relative; }
        .ad-section::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,var(--gold),var(--green)); border-radius:var(--r) var(--r) 0 0; }
        .ad-section-title { font-size:13px; font-weight:600; letter-spacing:.01em; color:var(--text); margin-bottom:16px; }
        .ad-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .ad-field { display:flex; flex-direction:column; gap:4px; }
        .ad-label { font-family:'Spline Sans Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-muted); }
        .ad-input-wrap { display:flex; align-items:center; gap:6px; }
        .ad-input { width:100%; background:var(--inset); border:1px solid var(--border-strong); color:var(--text); font-family:'Spline Sans Mono',monospace; font-size:14px; padding:7px 10px; border-radius:var(--r-sm); outline:none; transition:border-color .18s; }
        .ad-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(187,142,16,.12); }
        .ad-unit { font-family:'Spline Sans Mono',monospace; font-size:10px; color:var(--text-muted); white-space:nowrap; }
        .ad-select { width:100%; background:var(--inset); border:1px solid var(--border-strong); color:var(--text); font-family:'Saira',sans-serif; font-size:14px; padding:7px 10px; border-radius:var(--r-sm); outline:none; appearance:none; }
        .ad-row { display:flex; gap:8px; align-items:flex-end; margin-bottom:8px; flex-wrap:wrap; }
        .ad-row .ad-field { flex:1; min-width:80px; }
        .ad-row-label { font-family:'Spline Sans Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-2); min-width:100px; padding-bottom:2px; }
        .ad-time-input { width:80px; background:var(--inset); border:1px solid var(--border-strong); color:var(--text); font-family:'Spline Sans Mono',monospace; font-size:14px; padding:7px 8px; border-radius:var(--r-sm); outline:none; }
        .ad-time-input:focus { border-color:var(--gold); }
        .ad-icon-btn { background:none; border:none; cursor:pointer; color:var(--text-muted); font-size:16px; padding:4px 6px; border-radius:6px; line-height:1; transition:color .18s; }
        .ad-icon-btn:hover { color:var(--red); }
        .ad-add-btn { font-family:'Spline Sans Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; background:var(--surface-2); border:1px solid var(--border); color:var(--text-2); border-radius:var(--r-sm); padding:6px 12px; cursor:pointer; transition:all .18s; }
        .ad-add-btn:hover { border-color:var(--green); color:var(--green); background:var(--green-tint); }
        .ad-shift-block { margin-bottom:14px; }
        .ad-shift-base { font-size:13px; font-weight:600; color:var(--text); margin-bottom:6px; }
        .ad-shift-row { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
        .ad-shift-sep { font-family:'Spline Sans Mono',monospace; font-size:10px; color:var(--text-muted); }
        .ad-divider { height:1px; background:var(--border); margin:14px 0; }
        .ad-custom-list { display:flex; flex-direction:column; gap:6px; margin-top:12px; }
        .ad-custom-item { display:flex; align-items:center; justify-content:space-between; background:var(--surface-2); border:1px solid var(--border); border-radius:var(--r-sm); padding:8px 12px; gap:8px; }
        .ad-custom-item-text { flex:1; }
        .ad-custom-name { font-size:13px; font-weight:600; color:var(--text); }
        .ad-custom-sub { font-family:'Spline Sans Mono',monospace; font-size:10px; color:var(--text-muted); margin-top:1px; }
        .ad-note { font-family:'Spline Sans Mono',monospace; font-size:9px; color:var(--text-muted); letter-spacing:.06em; margin-top:8px; }
        .ad-empty { font-family:'Spline Sans Mono',monospace; font-size:10px; color:var(--text-muted); letter-spacing:.1em; text-align:center; padding:16px; }
        .ad-preset-row { display:grid; grid-template-columns:1fr auto; gap:8px; align-items:end; margin-bottom:8px; }
        .ad-preset-min { font-family:'Spline Sans Mono',monospace; font-size:22px; font-weight:600; color:var(--text); padding:4px 0; }
      `}</style>

      <div className="ad-wrap">
        <div className="ad-header">
          <div className="ad-title">Admin Settings</div>
          <div className="ad-header-actions">
            {toast && <span className="ad-toast">{toast}</span>}
            <button className="ad-reset" onClick={handleReset}>Reset Defaults</button>
            <button className="ad-save" onClick={handleSave}>Save</button>
            <button className="ad-back" onClick={() => navigate("/")}>← Back</button>
          </div>
        </div>

        {/* ── TIMING CONSTANTS ── */}
        <div className="ad-section">
          <div className="ad-section-title">Timing Constants</div>
          <div className="ad-grid">
            <NumField label="CMMC Restock Stop" value={cfg.cmmcStopMin} unit="min" min={0} max={60} onChange={v => set("cmmcStopMin", v)} />
            <NumField label="Fuel Stop Duration" value={cfg.fuelStopMin} unit="min" min={0} max={60} onChange={v => set("fuelStopMin", v)} />
          </div>
          <div className="ad-divider" />
          <div className="ad-section-title" style={{ fontSize: 11 }}>Rotor Wing</div>
          <div className="ad-grid">
            <NumField label="Speed" value={cfg.rotorSpeedKts} unit="kts" min={50} max={300} onChange={v => set("rotorSpeedKts", v)} />
            <NumField label="Ops Overhead / Leg" value={cfg.rotorOpsMin} unit="min" min={0} max={30} onChange={v => set("rotorOpsMin", v)} />
          </div>
          <div className="ad-divider" />
          <div className="ad-section-title" style={{ fontSize: 11 }}>Fixed Wing (King Air)</div>
          <div className="ad-grid">
            <NumField label="Cruise Speed" value={cfg.fwSpeedKts} unit="kts" min={100} max={500} onChange={v => set("fwSpeedKts", v)} />
            <NumField label="Ops Overhead / Leg" value={cfg.fwOpsMin} unit="min" min={0} max={30} onChange={v => set("fwOpsMin", v)} />
            <NumField label="Lift / Pre-Mission Setup" value={cfg.fwLiftMin} unit="min" min={0} max={90} onChange={v => set("fwLiftMin", v)} />
          </div>
          <div className="ad-divider" />
          <div className="ad-section-title" style={{ fontSize: 11 }}>Ground Routing (fallback)</div>
          <div className="ad-grid">
            <NumField label="Speed" value={cfg.groundSpeedMph} unit="mph" min={20} max={120} onChange={v => set("groundSpeedMph", v)} />
            <NumField label="Winding Factor" value={cfg.groundWindingFactor} step={0.05} min={1} max={2} onChange={v => set("groundWindingFactor", v)} />
            <NumField label="Ops Overhead / Leg" value={cfg.groundOpsMin} unit="min" min={0} max={20} onChange={v => set("groundOpsMin", v)} />
          </div>
        </div>

        {/* ── BEDSIDE PRESETS ── */}
        <div className="ad-section">
          <div className="ad-section-title">Bedside Time Presets</div>
          {cfg.bedsidePresets.map((p, i) => (
            <div key={i} className="ad-preset-row">
              <div className="ad-field">
                <label className="ad-label">Label</label>
                <input className="ad-input" value={p.label} onChange={e => setPreset(i, "label", e.target.value)} />
              </div>
              <div className="ad-field" style={{ width: 90 }}>
                <label className="ad-label">Minutes</label>
                <input className="ad-input" type="number" min={5} max={240} value={p.min} onChange={e => setPreset(i, "min", Number(e.target.value))} />
              </div>
            </div>
          ))}
        </div>

        {/* ── SHIFT WINDOWS ── */}
        <div className="ad-section">
          <div className="ad-section-title">Shift Windows</div>
          {BASES.map(base => (
            <div key={base.id} className="ad-shift-block">
              <div className="ad-shift-base">{base.name}</div>
              {(cfg.baseShifts[base.id] || []).map((shift, si) => (
                <div key={si} className="ad-shift-row">
                  <input
                    className="ad-time-input" type="time" value={toDisplay(shift.start)}
                    onChange={e => setShift(base.id, si, "start", e.target.value)}
                  />
                  <span className="ad-shift-sep">→</span>
                  <input
                    className="ad-time-input" type="time" value={toDisplay(shift.end)}
                    onChange={e => setShift(base.id, si, "end", e.target.value)}
                  />
                  <button className="ad-icon-btn" onClick={() => removeShift(base.id, si)} title="Remove shift">✕</button>
                </div>
              ))}
              <button className="ad-add-btn" onClick={() => addShift(base.id)}>+ Add Shift</button>
              {BASES.indexOf(base) < BASES.length - 1 && <div className="ad-divider" />}
            </div>
          ))}
        </div>

        {/* ── CUSTOM HOSPITALS ── */}
        <div className="ad-section">
          <div className="ad-section-title">Custom Hospitals</div>
          <div className="ad-row">
            <div className="ad-field" style={{ flex: "0 0 80px" }}>
              <label className="ad-label">State</label>
              <select className="ad-select" value={newHosp.state} onChange={e => setNewHosp(h => ({ ...h, state: e.target.value }))}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ad-field" style={{ flex: 3 }}>
              <label className="ad-label">Name</label>
              <input className="ad-input" value={newHosp.name} placeholder="Full hospital name" onChange={e => setNewHosp(h => ({ ...h, name: e.target.value }))} />
            </div>
            <div className="ad-field" style={{ flex: 1.5 }}>
              <label className="ad-label">City</label>
              <input className="ad-input" value={newHosp.city} onChange={e => setNewHosp(h => ({ ...h, city: e.target.value }))} />
            </div>
          </div>
          <div className="ad-row">
            <div className="ad-field">
              <label className="ad-label">Latitude</label>
              <input className="ad-input" type="number" step="0.0001" value={newHosp.lat} placeholder="e.g. 44.3106" onChange={e => setNewHosp(h => ({ ...h, lat: e.target.value }))} />
            </div>
            <div className="ad-field">
              <label className="ad-label">Longitude</label>
              <input className="ad-input" type="number" step="0.0001" value={newHosp.lng} placeholder="e.g. -69.7795" onChange={e => setNewHosp(h => ({ ...h, lng: e.target.value }))} />
            </div>
            <div className="ad-field" style={{ flex: "0 0 auto", justifyContent: "flex-end" }}>
              <label className="ad-label">&nbsp;</label>
              <button className="ad-add-btn" onClick={addHospital}>Add Hospital</button>
            </div>
          </div>
          <p className="ad-note">Tip: find lat/lng by right-clicking a location in Google Maps → "What's here?"</p>
          <div className="ad-custom-list">
            {cfg.customHospitals.length === 0
              ? <div className="ad-empty">No custom hospitals added</div>
              : cfg.customHospitals.map(h => (
                <div key={h.id} className="ad-custom-item">
                  <div className="ad-custom-item-text">
                    <div className="ad-custom-name">{h.name}</div>
                    <div className="ad-custom-sub">{h.city}, {h.state} · {h.lat}, {h.lng}</div>
                  </div>
                  <button className="ad-icon-btn" onClick={() => removeHospital(h.id)} title="Remove">✕</button>
                </div>
              ))
            }
          </div>
        </div>

        {/* ── CUSTOM AIRPORTS ── */}
        <div className="ad-section">
          <div className="ad-section-title">Custom Airports</div>
          <div className="ad-row">
            <div className="ad-field" style={{ flex: "0 0 80px" }}>
              <label className="ad-label">State</label>
              <select className="ad-select" value={newApt.state} onChange={e => setNewApt(a => ({ ...a, state: e.target.value }))}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ad-field" style={{ flex: "0 0 110px" }}>
              <label className="ad-label">ICAO Code</label>
              <input className="ad-input" value={newApt.code} placeholder="KXXX" style={{ textTransform: "uppercase" }} onChange={e => setNewApt(a => ({ ...a, code: e.target.value.toUpperCase() }))} />
            </div>
            <div className="ad-field">
              <label className="ad-label">City</label>
              <input className="ad-input" value={newApt.city} onChange={e => setNewApt(a => ({ ...a, city: e.target.value }))} />
            </div>
          </div>
          <div className="ad-row">
            <div className="ad-field">
              <label className="ad-label">Latitude</label>
              <input className="ad-input" type="number" step="0.0001" value={newApt.lat} placeholder="e.g. 44.8074" onChange={e => setNewApt(a => ({ ...a, lat: e.target.value }))} />
            </div>
            <div className="ad-field">
              <label className="ad-label">Longitude</label>
              <input className="ad-input" type="number" step="0.0001" value={newApt.lng} placeholder="e.g. -68.8281" onChange={e => setNewApt(a => ({ ...a, lng: e.target.value }))} />
            </div>
            <div className="ad-field" style={{ flex: "0 0 auto", justifyContent: "flex-end" }}>
              <label className="ad-label">&nbsp;</label>
              <button className="ad-add-btn" onClick={addAirport}>Add Airport</button>
            </div>
          </div>
          <div className="ad-custom-list">
            {cfg.customAirports.length === 0
              ? <div className="ad-empty">No custom airports added</div>
              : cfg.customAirports.map(a => (
                <div key={a.id} className="ad-custom-item">
                  <div className="ad-custom-item-text">
                    <div className="ad-custom-name">{a.code} — {a.city}</div>
                    <div className="ad-custom-sub">{a.state} · {a.lat}, {a.lng}</div>
                  </div>
                  <button className="ad-icon-btn" onClick={() => removeAirport(a.id)} title="Remove">✕</button>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}
