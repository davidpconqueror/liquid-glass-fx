import type { GlassConfig, GlassPresetKey } from "./types";
import { GLASS_PRESETS, getGlassPresets, normalizePresetKey } from "./presets";

export const DEFAULT_GLASS_CONFIG: GlassConfig = {
  blurAmount: 0.19,
  refraction: 0.69,
  chromAberration: 0.05,
  edgeHighlight: 0.05,
  specular: 0.0,
  fresnel: 1.0,
  distortion: 0.0,
  cornerRadius: 40,
  zRadius: 40,
  opacity: 1.0,
  saturation: 0.0,
  tintStrength: 0.0,
  brightness: 0.0,
  shadowOpacity: 0.3,
  shadowSpread: 10,
  shadowOffsetY: 1,
  bevelMode: 0,
  floating: false,
  button: false,
};

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

export function resolveGlassConfig(
  preset?: GlassPresetKey | Partial<GlassConfig>,
  overrides?: Partial<GlassConfig>
): GlassConfig {
  let basePreset: GlassConfig;

  if (preset && typeof preset === "object") {
    basePreset = { ...DEFAULT_GLASS_CONFIG, ...preset };
  } else {
    const rawKey = typeof preset === "string" ? preset : "default";
    const normalized = normalizePresetKey(rawKey);
    const presets = getGlassPresets();

    if (presets[rawKey]) {
      basePreset = presets[rawKey];
    } else if (presets[normalized]) {
      basePreset = presets[normalized];
    } else {
      const matchedKey = Object.keys(presets).find(
        (k) => normalizePresetKey(k) === normalized
      );
      basePreset = matchedKey ? presets[matchedKey] : (presets.default ?? DEFAULT_GLASS_CONFIG);
    }
  }

  const merged: GlassConfig = {
    ...basePreset,
    ...(overrides || {}),
  };

  return {
    blurAmount: clamp(merged.blurAmount, 0, 1, DEFAULT_GLASS_CONFIG.blurAmount),
    refraction: clamp(merged.refraction, 0, 2, DEFAULT_GLASS_CONFIG.refraction),
    chromAberration: clamp(merged.chromAberration, 0, 0.5, DEFAULT_GLASS_CONFIG.chromAberration),
    edgeHighlight: clamp(merged.edgeHighlight, 0, 2, DEFAULT_GLASS_CONFIG.edgeHighlight),
    specular: clamp(merged.specular, 0, 1, DEFAULT_GLASS_CONFIG.specular),
    fresnel: clamp(merged.fresnel, 0, 2, DEFAULT_GLASS_CONFIG.fresnel),
    distortion: clamp(merged.distortion, 0, 1, DEFAULT_GLASS_CONFIG.distortion),
    cornerRadius: clamp(merged.cornerRadius, 0, 9999, DEFAULT_GLASS_CONFIG.cornerRadius),
    zRadius: clamp(merged.zRadius, 0, 100, DEFAULT_GLASS_CONFIG.zRadius),
    opacity: clamp(merged.opacity, 0, 1, DEFAULT_GLASS_CONFIG.opacity),
    saturation: clamp(merged.saturation, -1, 1, DEFAULT_GLASS_CONFIG.saturation),
    tintStrength: clamp(merged.tintStrength, 0, 1, DEFAULT_GLASS_CONFIG.tintStrength),
    brightness: clamp(merged.brightness, -0.5, 0.5, DEFAULT_GLASS_CONFIG.brightness),
    shadowOpacity: clamp(merged.shadowOpacity, 0, 1, DEFAULT_GLASS_CONFIG.shadowOpacity),
    shadowSpread: clamp(merged.shadowSpread, 0, 50, DEFAULT_GLASS_CONFIG.shadowSpread),
    shadowOffsetY: clamp(merged.shadowOffsetY, -10, 30, DEFAULT_GLASS_CONFIG.shadowOffsetY),
    bevelMode: merged.bevelMode === 1 ? 1 : 0,
    floating: Boolean(merged.floating),
    button: Boolean(merged.button),
  };
}
