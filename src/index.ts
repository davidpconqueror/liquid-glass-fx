// Types
export type {
  GlassConfig,
  GlassPresetKey,
  CustomGlassPresetsRegistry,
  PresetStyleDefinition,
  PanelOptions,
  LiquidGlassPanelHandle,
  BackgroundSource,
  LensOptions,
  LiquidGlassLensHandle,
} from "./types";

// Optical configuration & presets
export { DEFAULT_GLASS_CONFIG, resolveGlassConfig } from "./config";
export {
  GLASS_PRESETS,
  PRESET_STYLES,
  registerGlassPresets,
  getGlassPresets,
  normalizePresetKey,
} from "./presets";

// DOM & CSS substrate engine
export { createLiquidGlassPanel } from "./dom/panel";
export { computeGlassStyle } from "./dom/styles";
export { resolveIsDark, subscribeToAutoTheme } from "./dom/theme-observer";
export { injectGlassSvgDefs, SVG_DEFS_ID, SVG_FILTER_ID } from "./dom/svg-filter-manager";

// WebGL optical engine
export { createLiquidGlassLens } from "./webgl/lens";
export { LensRenderer } from "./webgl/lens-renderer";
export { resolveBackgroundTexture, generateProceduralBackdrop } from "./webgl/background-sampler";
export { DragPhysicsController, type DragPhysicsOptions } from "./webgl/drag-physics";
export { VS_QUAD, FS_BLIT, FS_BLUR, VS_GLASS, FS_GLASS } from "./webgl/shaders";
