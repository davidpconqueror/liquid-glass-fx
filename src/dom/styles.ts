import type { GlassConfig } from "../types";
import { resolveIsDark } from "./theme-observer";

export function computeGlassStyle(
  config: GlassConfig,
  theme: "dark" | "light" | "auto" = "auto"
): Record<string, string> {
  const {
    blurAmount,
    saturation,
    brightness,
    refraction,
    chromAberration,
    edgeHighlight,
    fresnel,
    shadowOpacity,
    shadowSpread,
    shadowOffsetY,
    cornerRadius,
    zRadius,
    opacity,
    tintStrength,
  } = config;

  // 1. Hardware-accelerated backdrop filter
  const filterParts: string[] = [];
  if (blurAmount > 0) {
    filterParts.push(`blur(${(blurAmount * 28).toFixed(1)}px)`);
  }
  if (saturation !== 0) {
    filterParts.push(`saturate(${Math.max(0, 1 + saturation).toFixed(2)})`);
  }
  if (brightness !== 0) {
    filterParts.push(`brightness(${Math.max(0, 1 + brightness).toFixed(2)})`);
  }
  const backdropFilter = filterParts.length > 0 ? filterParts.join(" ") : "none";

  // 2. Optical box-shadow system
  const edgeScale = Math.min(2.5, Math.max(0.1, edgeHighlight));
  const fresnelScale = Math.min(2.5, Math.max(0.2, fresnel));
  const chromaScale = Math.min(3.0, Math.max(0, chromAberration * 5.0));
  const refrScale = Math.min(3.0, Math.max(0, refraction));
  const bevelDepth = Math.max(2, Math.min(24, Math.round(zRadius * 0.3)));
  // Subtle internal glass reflection: keep delicate, not an opaque white border
  const internalBevelOpacity = Math.min(0.08, 0.035 * fresnelScale * edgeScale).toFixed(3);

  const shadowBox = [
    // 1. Sharp Contact Shadow
    `0 ${shadowOffsetY}px ${Math.round(shadowSpread * 0.8)}px rgba(0, 0, 0, ${(shadowOpacity * 0.45).toFixed(3)})`,
    // 2. Ambient Outer Shadow
    `0 ${(shadowOffsetY * 2.5).toFixed(1)}px ${Math.round(shadowSpread * 2)}px rgba(0, 0, 0, ${(shadowOpacity * 0.25).toFixed(3)})`,
    // 3. Top Specular Meniscus Crest (crisp studio glint)
    `inset 0 1.5px 1px rgba(255, 255, 255, ${(0.45 * fresnelScale * edgeScale).toFixed(3)})`,
    // 4. Subtle Internal Bevel Contour (depth contour, never an opaque white border)
    `inset 0 0 ${bevelDepth}px 0px rgba(255, 255, 255, ${internalBevelOpacity})`,
    // 5. Bottom Bevel Return (physical glass reflection)
    `inset 0 -1.5px 1px rgba(255, 255, 255, ${(0.15 * fresnelScale * edgeScale).toFixed(3)})`,
    // 6. Chromatic Dispersion Rim (cyan & magenta prismatic splitting driven by refraction)
    ...(chromaScale > 0.05
      ? [
          `inset ${Math.max(1, 1.5 * refrScale).toFixed(1)}px 0 1px rgba(56, 189, 248, ${(0.22 * chromaScale * Math.min(1.5, Math.max(0.4, refrScale))).toFixed(3)})`,
          `inset -${Math.max(1, 1.5 * refrScale).toFixed(1)}px 0 1px rgba(244, 63, 94, ${(0.18 * chromaScale * Math.min(1.5, Math.max(0.4, refrScale))).toFixed(3)})`,
        ]
      : []),
  ].join(", ");

  // 3. Theme substrate background
  const isDark = resolveIsDark(theme);

  const bgSubstrate = isDark
    ? `rgba(15, 23, 42, ${(0.35 + tintStrength * 0.2).toFixed(2)})`
    : `rgba(255, 255, 255, ${(0.45 + tintStrength * 0.15).toFixed(2)})`;

  const styles: Record<string, string> = {
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    boxShadow: shadowBox,
    backgroundColor: bgSubstrate,
    opacity: opacity.toString(),
  };

  if (cornerRadius > 0) {
    styles.borderRadius = cornerRadius >= 9999 ? "9999px" : `${cornerRadius}px`;
  }

  return styles;
}
