export interface GlassConfig {
  blurAmount: number;
  refraction: number;
  chromAberration: number;
  edgeHighlight: number;
  specular: number;
  fresnel: number;
  distortion: number;
  cornerRadius: number;
  zRadius: number;
  opacity: number;
  saturation: number;
  tintStrength: number;
  brightness: number;
  shadowOpacity: number;
  shadowSpread: number;
  shadowOffsetY: number;
  bevelMode: 0 | 1;
  floating?: boolean;
  button?: boolean;
}

export type GlassPresetKey =
  | "default"
  | "crystal"
  | "frosted"
  | "obsidian"
  | "pill"
  | "magnifier";

export interface PresetStyleDefinition {
  substrateLight: string;
  substrateDark: string;
}

export interface PanelOptions {
  preset?: GlassPresetKey;
  config?: Partial<GlassConfig>;
  theme?: "dark" | "light" | "auto";
  interactive?: boolean;
  button?: boolean;
}

export interface LiquidGlassPanelHandle {
  update: (newOptions: Partial<PanelOptions>) => void;
  destroy: () => void;
}

export type BackgroundSource =
  | string
  | HTMLCanvasElement
  | HTMLImageElement
  | HTMLVideoElement;

export interface LensOptions {
  preset?: GlassPresetKey;
  config?: Partial<GlassConfig>;
  background?: BackgroundSource;
  backgroundSelector?: string;
  draggable?: boolean;
  floating?: boolean;
  initialPosition?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

export interface LiquidGlassLensHandle {
  setPosition: (x: number, y: number) => void;
  update: (newOptions: Partial<LensOptions>) => void;
  destroy: () => void;
}
