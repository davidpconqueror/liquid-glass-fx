# Liquid Glass FX (`liquid-glass-fx`) — Library Modernization Specification

This specification outlines the architectural and API changes required in the `liquid-glass-fx` library codebase to eliminate adapter boilerplate in consuming applications (such as Next.js, Vite, and Remix).

---

## 1. Executive Goal

Currently, consuming applications write large adapter files (e.g. `src/components/ui/liquid-glass.tsx` at ~262 lines) to bridge gaps in preset registration, SVG def injection, SSR/theme synchronization, and default CSS styling.

**Target Result:** Consuming applications should be able to either:

1. Import and use `<LiquidGlassPanel />` directly from `liquid-glass-fx/react` with zero adapter code, OR
2. Write a minimal `< 20 line` adapter file strictly for application-specific custom preset declarations.

---

## 2. Required Changes in `liquid-glass-fx`

### A. Core Engine & Presets (`src/presets.ts`, `src/config.ts`)

#### 1. Dynamic Preset Registration API

Currently, `GLASS_PRESETS` is a closed dictionary and `resolveGlassConfig` only recognizes static built-in string keys.

- **Requirement:** Add an API to register and extend presets at runtime or application boot:
  ```ts
  export function registerGlassPresets(
    customPresets: Record<string, Partial<GlassConfig>>
  ): void;

  export function getGlassPresets(): Record<string, GlassConfig>;
  ```
- **Type-Safety Enhancement:** Support TypeScript declaration merging so developers get autocompletion for custom preset keys:
  ```ts
  // In liquid-glass-fx:
  export interface CustomGlassPresetsRegistry {}
  export type GlassPresetKey =
    | "default"
    | "crystal"
    | "frosted"
    | "obsidian"
    | "pill"
    | "magnifier"
    | "liquid-glass"
    | (keyof CustomGlassPresetsRegistry & string);
  ```

#### 2. Preset Name Normalization (Case-Insensitive & Alias Tollerance)

Applications frequently use kebab-case (`liquid-glass`), camelCase (`liquidGlass`), or snake_case (`liquid_glass`).

- **Requirement:** Normalize preset names before lookup:
  ```ts
  function normalizePresetKey(key: string): string {
    return key.toLowerCase().replace(/[-_]/g, "");
  }
  ```
  Map `liquidglass` -> `liquid-glass`, `skillgrid` -> `skill_grid`, etc., so users never encounter silent fallback bugs due to casing discrepancies.

#### 3. Allow `preset` to Accept Direct Config Objects

- **Requirement:** In both `resolveGlassConfig` and the React component props, allow `preset` to be:
  ```ts
  preset?: GlassPresetKey | Partial<GlassConfig>;
  ```
  If an object is passed, merge it directly over `DEFAULT_GLASS_CONFIG` without forcing the user to create a named preset.

#### 4. Bundle Common UI Presets Out-of-the-Box

Consider adding the presets that UI applications consistently need:

- **`input` / `search_field`:** Form field pill preset (optimized for embedded inputs without text blur distortion).
- **`card` / `grid`:** Low-distortion optical panel for cards and grids (subtle refraction, high readability).

---

### B. DOM & SVG Filter Management (`src/dom/svg-defs.ts`)

#### Auto-Injection of SVG Defs on First Mount

Currently, applications either have to render `<LiquidGlassDefs />` or manually invoke `injectGlassSvgDefs()`.

- **Requirement:** Automatically inject SVG defs on first component mount or DOM initialization:
  ```ts
  let defsInjected = false;

  export function ensureGlassSvgDefs(doc: Document = document): SVGElement | null {
    if (defsInjected || typeof document === "undefined") return null;
    const existing = doc.getElementById("liquid-glass-svg-defs");
    if (existing) {
      defsInjected = true;
      return existing as unknown as SVGElement;
    }
    const svg = injectGlassSvgDefs(doc);
    if (svg) defsInjected = true;
    return svg;
  }
  ```
- **React Integration:** Call `ensureGlassSvgDefs()` in the `useEffect` of `LiquidGlassPanel` and `LiquidGlassLens`.
- **Backwards Compatibility:** Keep `LiquidGlassDefs` and `injectGlassSvgDefs()` as exports, but make them safe no-ops if already injected.

---

### C. React Components (`src/react/LiquidGlassPanel.tsx`)

#### 1. Native Base Layout Styling

Currently, `LiquidGlassPanel` applies computed inline styles (box-shadow, backdrop-filter) but leaves out essential container mechanics.

- **Requirement:** Include essential baseline structural styles directly in the component's inline styles or base class:
  ```ts
  const baseStructuralStyle: React.CSSProperties = {
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
  };
  ```
- **Full Radius Detection:** If `activeConfig.cornerRadius >= 9999` or `preset === "pill"`, automatically apply `borderRadius: "9999px"`.

#### 2. Interactive / Button States

When `as="button"` or `button={true}`:

- **Requirement:** Provide built-in tactile styles:
  - `cursor: pointer`
  - `userSelect: "none"`
  - Subtle hover/active micro-transitions (e.g. active press scale `0.985`, brightness boost `1.03`), or provide an `interactive?: boolean` prop that defaults to `true` when `button` is true.

#### 3. Instance Parameter Tweaks (Flat Props + Tweaks Object)

Consuming applications frequently want to adopt a preset (e.g. `preset="frosted"`) but slightly tweak a specific parameter for a single component instance (e.g. adjust `blurAmount` or `cornerRadius` on a navbar) without defining an entirely new preset.

- **Requirement (Hybrid Approach):** Support both flat top-level props and a dedicated `tweaks` / `overrides` object prop:
  ```tsx
  // Option 1: Direct flat props (Maximum DX & JSX Ergonomics)
  <LiquidGlassPanel
    preset="frosted"
    blurAmount={0.12}
    refraction={0.85}
    cornerRadius={9999}
  >
    <Navbar />
  </LiquidGlassPanel>

  // Option 2: Tweaks / overrides object
  <LiquidGlassPanel
    preset="frosted"
    tweaks={{ blurAmount: 0.12, refraction: 0.85 }}
  />
  ```
- **Resolution Priority:**
  `DEFAULT_GLASS_CONFIG` $\rightarrow$ `Base Preset` $\rightarrow$ `tweaks` / `overrides` / `config` $\rightarrow$ `Flat Props`
- **DOM Attribute Sanitization:** All `GlassConfig` parameter keys (`blurAmount`, `refraction`, `chromAberration`, `edgeHighlight`, `specular`, `fresnel`, `distortion`, `cornerRadius`, `zRadius`, `opacity`, `saturation`, `tintStrength`, `brightness`, `shadowOpacity`, `shadowSpread`, `shadowOffsetY`, `bevelMode`, `floating`, `button`) must be stripped before spreading props to the underlying DOM element (`<div />` or `<Component />`) to avoid React unknown DOM attribute console warnings.

#### 4. Theme Detection Documentation & SSR Safety

- `liquid-glass-fx` already uses `useSyncExternalStore` and `subscribeToAutoTheme` observing `.dark` and `[data-theme="dark"]`.
- Ensure that SSR hydration defaults gracefully to light or auto without hydration mismatch warnings.
- Add documentation noting that Next.js + `next-themes` works out of the box with `theme="auto"` so consumers don't write redundant `useTheme()` wrappers.

---

### D. React Components (`src/react/LiquidGlassLens.tsx`)

#### 1. Prop Aliasing & Symmetry

- **Prop Name Conflict:** The adapter had to map `backgroundSource` to `background`.
- **Requirement:** Support both `background` and `backgroundSource`:
  ```ts
  export interface LiquidGlassLensProps {
    background?: BackgroundSource;
    /** Alias for background */
    backgroundSource?: BackgroundSource;
    // ...
  }
  ```
  Inside the component:
  ```ts
  const resolvedBg = background ?? backgroundSource;
  ```

#### 2. Default Lens Display Style

- Ensure `LiquidGlassLens` includes `display: "inline-block"`, `position: "relative"`, and `overflow: "hidden"` so it doesn't collapse if no Tailwind class is supplied.

---

### E. Type Definitions & Polymorphism (`src/react/index.ts`)

#### Preserve Polymorphic ForwardRef

Ensure polymorphic ref forwarding works cleanly without requiring consumers to cast `as any`:

```ts
export type PolymorphicLiquidGlassPanelProps<T extends React.ElementType = "div"> = {
  as?: T;
  preset?: GlassPresetKey | Partial<GlassConfig>;
  config?: Partial<GlassConfig>;
  tweaks?: Partial<GlassConfig>;
  overrides?: Partial<GlassConfig>;
  theme?: "dark" | "light" | "auto";
  button?: boolean;
  interactive?: boolean;
} & Partial<GlassConfig> &
  Omit<
    React.ComponentPropsWithRef<T>,
    | "as"
    | "preset"
    | "config"
    | "tweaks"
    | "overrides"
    | "theme"
    | "button"
    | keyof GlassConfig
  >;
```

---

## 3. The Future Application Adapter

Once the above changes are published in `liquid-glass-fx` (e.g. v0.2.0), the application adapter file (`src/components/ui/liquid-glass.tsx`) simplifies down to this:

```tsx
"use client";

import { registerGlassPresets } from "liquid-glass-fx";
export {
  LiquidGlassPanel,
  LiquidGlassLens,
  type LiquidGlassPanelProps,
  type LiquidGlassLensProps,
  type GlassConfig,
  type GlassPresetKey,
} from "liquid-glass-fx/react";

// Optional: Register bespoke domain presets for this portfolio
registerGlassPresets({
  skill_grid: {
    blurAmount: 0.12,
    refraction: 0.92,
    chromAberration: 0.08,
    edgeHighlight: 0.15,
    specular: 0.55,
    fresnel: 0.3,
    opacity: 0.94,
    brightness: 0.34,
    saturation: 0.12,
    shadowSpread: 10,
    shadowOpacity: 0.25,
    zRadius: -6,
    cornerRadius: 36,
  },
  search_field: {
    cornerRadius: 50,
    zRadius: 18,
    blurAmount: 0.09,
    refraction: 0.45,
    chromAberration: 0.24,
    edgeHighlight: 0.15,
    specular: 0.35,
    fresnel: 0.39,
    opacity: 0.95,
    shadowSpread: 8,
    shadowOffsetY: 1,
    shadowOpacity: 0.2,
    brightness: 0.3,
  },
});
```

---

## 4. Implementation Checklist for the Library

- [ ] **Presets Module:** Implement `registerGlassPresets` and export `getGlassPresets`.
- [ ] **Normalizer:** Add case-insensitive matching for preset keys (`liquid_glass`, `liquid-glass`, `liquidGlass`).
- [ ] **Direct Config:** Allow passing `Partial<GlassConfig>` directly to `preset` prop.
- [ ] **Hybrid Preset Tweaks:** Support flat `GlassConfig` props (e.g. `blurAmount`, `cornerRadius`) and `tweaks`/`overrides` object prop with proper priority resolution and DOM prop filtering.
- [ ] **SVG Defs:** Add `ensureGlassSvgDefs()` and call it automatically on mount in React components.
- [ ] **Base Styles:** Add `position: relative`, `isolation: isolate`, `overflow: hidden`, and `borderRadius: 9999px` (when `cornerRadius >= 9999`).
- [ ] **Lens Props:** Support `backgroundSource` as an alias for `background`, along with flat tweaks and structural styles.
- [ ] **Type Exports:** Ensure polymorphic `as` props and ref forwarding are clean and require zero `as any` casting.
- [ ] **Documentation:** Update `README.md` with complete examples for preset registration, direct instance tweaking (flat props & `tweaks`), and zero-adapter quickstart.
- [ ] **Bump Version & Publish:** Publish new version to npm / local link.
