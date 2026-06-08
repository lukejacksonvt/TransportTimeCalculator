export const DEFAULT_CONFIG = {
  // Ground routing
  groundSpeedMph: 55,
  groundWindingFactor: 1.35,
  groundOpsMin: 5,
  // Rotor
  rotorSpeedKts: 145,
  rotorOpsMin: 12,
  // Fixed Wing
  fwSpeedKts: 270,
  fwLiftMin: 30,
  fwOpsMin: 10,
  // Stop times
  cmmcStopMin: 15,
  fuelStopMin: 12,
  // Bedside presets
  bedsidePresets: [
    { label: "20 min", min: 20 },
    { label: "40 min", min: 40 },
    { label: "60 min", min: 60 },
  ],
  // Shift windows per base (HHMM integers)
  baseShifts: {
    sanford:       [{ start: 800,  end: 2000 }, { start: 2000, end: 800  }],
    cmmc_base:     [{ start: 1000, end: 2200 }],
    rodman:        [{ start: 1000, end: 2200 }],
    emmc_base:     [{ start: 1900, end: 700  }, { start: 700,  end: 1900 }],
    bangor_hangar: [{ start: 1900, end: 700  }, { start: 700,  end: 1900 }],
  },
  customHospitals: [],
  customAirports: [],
};

const KEY = "lfm-config";

export function loadConfig() {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return structuredClone(DEFAULT_CONFIG);
    const saved = JSON.parse(s);
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      bedsidePresets: saved.bedsidePresets ?? DEFAULT_CONFIG.bedsidePresets,
      baseShifts: { ...DEFAULT_CONFIG.baseShifts, ...(saved.baseShifts ?? {}) },
      customHospitals: saved.customHospitals ?? [],
      customAirports:  saved.customAirports  ?? [],
    };
  } catch {
    return structuredClone(DEFAULT_CONFIG);
  }
}

export function saveConfig(cfg) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
}

export function resetConfig() {
  localStorage.removeItem(KEY);
}
