import { describe, it, expect } from "vitest";
import { computeGlassStyle } from "../src/dom/styles";
import { GLASS_PRESETS } from "../src/presets";

describe("CSS Style Generator", () => {
  it("should generate backdropFilter with blur, saturate, and brightness", () => {
    const style = computeGlassStyle(GLASS_PRESETS.crystal, "dark");

    expect(style.backdropFilter).toContain("blur(");
    expect(style.WebkitBackdropFilter).toBe(style.backdropFilter);
    expect(style.backdropFilter).toContain("saturate(");
    expect(style.backdropFilter).toContain("brightness(");
  });

  it("should generate 6-tier composite box-shadow with specular rim and dispersion", () => {
    const style = computeGlassStyle(GLASS_PRESETS.crystal, "dark");
    const shadow = style.boxShadow;

    // Contact and ambient shadows
    expect(shadow).toContain("rgba(0, 0, 0,");
    // Top specular crest inset
    expect(shadow).toContain("inset 0 1.5px 1px rgba(255, 255, 255,");
    // Curved bevel inset
    expect(shadow).toContain("rgba(255, 255, 255,");
    // Prismatic chromatic dispersion rim (cyan & magenta)
    expect(shadow).toContain("rgba(56, 189, 248,");
    expect(shadow).toContain("rgba(244, 63, 94,");
  });

  it("should omit chromatic dispersion rim when chromAberration is very low", () => {
    const style = computeGlassStyle({ ...GLASS_PRESETS.default, chromAberration: 0.005 }, "dark");
    expect(style.boxShadow).not.toContain("rgba(56, 189, 248,");
  });

  it("should apply correct borderRadius and opacity", () => {
    const stylePill = computeGlassStyle(GLASS_PRESETS.pill, "dark");
    expect(stylePill.borderRadius).toBe("9999px");

    const styleDefault = computeGlassStyle(GLASS_PRESETS.default, "dark");
    expect(styleDefault.borderRadius).toBe("40px");
    expect(styleDefault.opacity).toBe("1");
  });

  it("should apply theme-specific background substrates", () => {
    const lightStyle = computeGlassStyle(GLASS_PRESETS.crystal, "light");
    const darkStyle = computeGlassStyle(GLASS_PRESETS.crystal, "dark");

    expect(lightStyle.backgroundColor).not.toBe(darkStyle.backgroundColor);
    expect(lightStyle.backgroundColor).toContain("255, 255, 255");
    expect(darkStyle.backgroundColor).toContain("15, 23, 42");
  });
});
