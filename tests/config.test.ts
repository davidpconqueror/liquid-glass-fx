import { describe, it, expect } from "vitest";
import { DEFAULT_GLASS_CONFIG, resolveGlassConfig } from "../src/config";
import { GLASS_PRESETS } from "../src/presets";
import type { GlassConfig, GlassPresetKey } from "../src/types";

describe("Optical Configuration & Presets", () => {
  it("should provide exact DEFAULT_GLASS_CONFIG with all 16 parameters", () => {
    expect(DEFAULT_GLASS_CONFIG).toEqual({
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
    });
  });

  it("should define all 6 curated presets with valid keys", () => {
    const keys: GlassPresetKey[] = [
      "default",
      "crystal",
      "frosted",
      "obsidian",
      "pill",
      "magnifier",
    ];
    for (const key of keys) {
      expect(GLASS_PRESETS[key]).toBeDefined();
      expect(typeof GLASS_PRESETS[key].blurAmount).toBe("number");
    }

    // Check specific preset values from spec
    expect(GLASS_PRESETS.crystal.refraction).toBe(0.95);
    expect(GLASS_PRESETS.crystal.chromAberration).toBe(0.12);
    expect(GLASS_PRESETS.frosted.blurAmount).toBe(0.45);
    expect(GLASS_PRESETS.obsidian.brightness).toBe(-0.15);
    expect(GLASS_PRESETS.pill.cornerRadius).toBe(9999);
    expect(GLASS_PRESETS.magnifier.bevelMode).toBe(1);
    expect(GLASS_PRESETS.magnifier.floating).toBe(true);
  });

  it("should resolve config using preset and apply partial overrides", () => {
    const resolved = resolveGlassConfig("crystal", {
      blurAmount: 0.5,
      opacity: 0.8,
    });

    expect(resolved.blurAmount).toBe(0.5);
    expect(resolved.opacity).toBe(0.8);
    expect(resolved.refraction).toBe(GLASS_PRESETS.crystal.refraction);
    expect(resolved.chromAberration).toBe(GLASS_PRESETS.crystal.chromAberration);
  });

  it("should clamp out-of-bounds parameters safely", () => {
    const resolved = resolveGlassConfig("default", {
      blurAmount: -5,
      refraction: 10,
      chromAberration: 2,
      edgeHighlight: -1,
      specular: 5,
      fresnel: -2,
      distortion: 3,
      opacity: 2,
      saturation: 5,
      brightness: 10,
      shadowOpacity: -1,
      shadowSpread: 100,
      shadowOffsetY: 50,
      zRadius: -10,
    });

    expect(resolved.blurAmount).toBe(0.0);
    expect(resolved.refraction).toBe(2.0);
    expect(resolved.chromAberration).toBe(0.5);
    expect(resolved.edgeHighlight).toBe(0.0);
    expect(resolved.specular).toBe(1.0);
    expect(resolved.fresnel).toBe(0.0);
    expect(resolved.distortion).toBe(1.0);
    expect(resolved.opacity).toBe(1.0);
    expect(resolved.saturation).toBe(1.0);
    expect(resolved.brightness).toBe(0.5);
    expect(resolved.shadowOpacity).toBe(0.0);
    expect(resolved.shadowSpread).toBe(50);
    expect(resolved.shadowOffsetY).toBe(30);
    expect(resolved.zRadius).toBe(0);
  });

  it("should handle undefined or unknown preset gracefully", () => {
    // @ts-expect-error testing invalid preset
    const resolved = resolveGlassConfig("nonexistent", { opacity: 0.7 });
    expect(resolved.opacity).toBe(0.7);
    expect(resolved.blurAmount).toBe(DEFAULT_GLASS_CONFIG.blurAmount);
  });
});
