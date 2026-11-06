# liquid-glass-fx

> **Production-grade, framework-agnostic liquid glass effect library for JavaScript and TypeScript web applications.**
>
> Deliver authentic optical glass refraction, dynamic Gaussian blur, RGB chromatic aberration, and studio Blinn-Phong specular glints using a high-performance **Dual-Engine Architecture** (pure CSS/SVG substrate for UI components and GLSL ES 1.0 shaders for interactive lenses).

[![npm version](https://img.shields.io/badge/npm-v0.1.0-blue.svg)](https://www.npmjs.com/package/liquid-glass-fx)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![bundle size](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)
[![tests](https://img.shields.io/badge/tests-29%20passing-brightgreen.svg)](tests/)

---

## Table of Contents

- [Why liquid-glass-fx?](#why-liquid-glass-fx)
- [Architecture & Dual-Engine System](#architecture--dual-engine-system)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Vanilla JavaScript / TypeScript](#1-vanilla-javascript--typescript)
  - [React / Next.js](#2-react--nextjs-app-router--pages)
  - [Vue 3 / Nuxt](#3-vue-3--nuxt)
  - [Svelte / SvelteKit](#4-svelte--sveltekit)
- [API Reference](#api-reference)
  - [Vanilla Core APIs](#vanilla-core-apis)
  - [React Components & Hooks](#react-components--hooks)
- [The 16 Optical Parameters (`GlassConfig`)](#the-16-optical-parameters-glassconfig)
- [Curated Presets](#curated-presets)
- [Background Sampler & Texture Sources](#background-sampler--texture-sources)
- [SSR & Next.js Compatibility](#ssr--nextjs-compatibility)
- [Interactive Playground](#interactive-playground)
- [Testing & Build Toolchain](#testing--build-toolchain)
- [License](#license)

---

## Why liquid-glass-fx?

Traditional glassmorphism effects rely on simple `backdrop-filter: blur()`, missing the physical depth, chromatic fringe dispersion, and specular bevel glints of real glass. Meanwhile, existing WebGL refraction libraries introduce critical bottlenecks:

1. **DOM Serialization Lag:** Rasterizing live DOM trees (`html-to-image` / SVG `foreignObject`) causes 30ms–150ms frame drops, font rendering flashes, and CORS breaks.
2. **WebGL Context Exhaustion:** Creating a new WebGL canvas per card quickly breaches the browser limit (8–16 contexts), crashing host apps with `webglcontextlost`.
3. **Framework Lock-in:** Many solutions are coupled to a single framework or require Tailwind CSS.

### The `liquid-glass-fx` Solution:
- **Zero Runtime Dependencies for Core:** Pure vanilla TypeScript and raw WebGL ES 1.0.
- **Dual-Engine Architecture:** Zero-overhead CSS/SVG substrate for UI panels (navbars, cards, buttons) + a shared singleton WebGL shader engine for interactive lenses.
- **Locked 120 FPS:** Zero DOM rasterization overhead and zero context exhaustion.
- **Tailwind-Free:** Works out-of-the-box with or without Tailwind CSS.
- **First-Class React Adapter:** Available via `liquid-glass-fx/react` with polymorphic components and SSR safety.

---

## Architecture & Dual-Engine System

```
                           liquid-glass-fx
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
         Core Panel Engine               WebGL Lens Engine
   (`createLiquidGlassPanel`)       (`createLiquidGlassLens`)
                 │                               │
   • Hardware-accelerated CSS       • GLSL ES 1.0 custom shader
     `backdrop-filter` substrate    • Signed Distance Field (SDF) bevel
   • Meniscus SVG displacement      • Dual-surface Snell's law refraction
   • 6-tier composite shadow        • Physical RGB chromatic dispersion
   • Prismatic chromatic rim        • 2-light Blinn-Phong specular glints
   • Tactile hover/click physics    • Drag physics & spring momentum
   • Zero WebGL contexts            • Single shared WebGL canvas (no leaks)
```

---

## Installation

Install via your package manager of choice:

```bash
# npm
npm install liquid-glass-fx

# pnpm
pnpm add liquid-glass-fx

# yarn
yarn add liquid-glass-fx
```

If you are using React, install `react` and `react-dom` (peer dependencies):

```bash
npm install liquid-glass-fx react react-dom
```

---

## Quick Start

### 1. Vanilla JavaScript / TypeScript

#### UI Glass Panel (Navbar, Card, Modal, or Button)
```typescript
import { createLiquidGlassPanel } from "liquid-glass-fx";

const cardElement = document.querySelector<HTMLElement>("#my-card")!;

// Attach glass effect
const panel = createLiquidGlassPanel(cardElement, {
  preset: "crystal", // 'crystal' | 'frosted' | 'obsidian' | 'pill' | 'magnifier' | 'default'
  interactive: true, // Enables tactile hover lift & active click depression
});

// Dynamically update options
panel.update({ preset: "frosted" });

// Clean up styles and observers when element is unmounted
panel.destroy();
```

#### Interactive Draggable WebGL Refraction Lens
```typescript
import { createLiquidGlassLens } from "liquid-glass-fx";

const container = document.querySelector<HTMLElement>("#lens-container")!;

const lens = createLiquidGlassLens(container, {
  preset: "magnifier",
  draggable: true,
  background: "url(/hero-mesh.jpg)", // URL, canvas, image, or video
  initialPosition: { x: 120, y: 150 },
  onPositionChange: (pos) => console.log("Lens position:", pos),
});

// Programmatically set position
lens.setPosition(250, 300);

// Clean up
lens.destroy();
```

---

### 2. React / Next.js (App Router & Pages)

Import components from the subpath export `liquid-glass-fx/react`:

```tsx
"use client";

import React from "react";
import { LiquidGlassPanel, LiquidGlassLens } from "liquid-glass-fx/react";

export function GlassShowcase() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: 32 }}>
      {/* Polymorphic Glass Navigation Bar */}
      <LiquidGlassPanel
        as="nav"
        preset="crystal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <span style={{ fontWeight: 700 }}>Brand</span>

        {/* Glass Action Button with tactile press scale */}
        <LiquidGlassPanel
          as="button"
          preset="pill"
          interactive
          style={{ padding: "8px 20px", color: "inherit", border: "none" }}
        >
          Connect
        </LiquidGlassPanel>
      </LiquidGlassPanel>

      {/* Glass UI Card */}
      <LiquidGlassPanel
        preset="frosted"
        style={{ maxWidth: 480, margin: "40px auto", padding: 32 }}
      >
        <h3>Refractive UI Card</h3>
        <p>Zero DOM serialization stutter, locked 120 FPS.</p>
      </LiquidGlassPanel>

      {/* Draggable Optical Magnifier Lens */}
      <LiquidGlassLens
        preset="magnifier"
        draggable
        initialPosition={{ x: 100, y: 120 }}
        style={{ width: 220, height: 220, borderRadius: "50%" }}
      />
    </div>
  );
}
```

---

### 3. Vue 3 / Nuxt

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { createLiquidGlassPanel, createLiquidGlassLens } from "liquid-glass-fx";

const cardRef = ref<HTMLElement | null>(null);
const lensRef = ref<HTMLElement | null>(null);
let panelHandle: any = null;
let lensHandle: any = null;

onMounted(() => {
  if (cardRef.value) {
    panelHandle = createLiquidGlassPanel(cardRef.value, { preset: "crystal", interactive: true });
  }
  if (lensRef.value) {
    lensHandle = createLiquidGlassLens(lensRef.value, { preset: "magnifier", draggable: true });
  }
});

onUnmounted(() => {
  panelHandle?.destroy();
  lensHandle?.destroy();
});
</script>

<template>
  <div ref="cardRef" class="glass-card">
    <h2>Vue 3 Liquid Glass</h2>
  </div>
  <div ref="lensRef" class="glass-lens" style="width: 200px; height: 200px;" />
</template>
```

---

### 4. Svelte / SvelteKit

```svelte
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createLiquidGlassPanel } from "liquid-glass-fx";

  let cardEl: HTMLElement;
  let handle: any;

  onMount(() => {
    handle = createLiquidGlassPanel(cardEl, { preset: "frosted" });
  });

  onDestroy(() => {
    handle?.destroy();
  });
</script>

<div bind:this={cardEl} class="card">
  <h2>Svelte Liquid Glass</h2>
</div>
```

---

## API Reference

### Vanilla Core APIs

#### `createLiquidGlassPanel(element: HTMLElement, options?: PanelOptions): LiquidGlassPanelHandle`
Attaches hardware-accelerated CSS backdrop filters, 6-tier composite shadows, chromatic rim splitting, and meniscus SVG displacement filters to any HTML element.

- **Parameters (`PanelOptions`):**
  - `preset?: GlassPresetKey` — Preset name (`'default' | 'crystal' | 'frosted' | 'obsidian' | 'pill' | 'magnifier'`).
  - `config?: Partial<GlassConfig>` — Custom overrides for any of the 16 optical parameters.
  - `theme?: 'dark' | 'light' | 'auto'` — Theme substrate mode (defaults to `'auto'`, reading `.dark` class on `document.documentElement`).
  - `interactive?: boolean` — Enables hover brightness and active click depression.
  - `button?: boolean` — Shorthand for button styling.
- **Returns (`LiquidGlassPanelHandle`):**
  - `update(newOptions: Partial<PanelOptions>): void` — Updates options with instant transition.
  - `destroy(): void` — Removes applied styles, restores original element style, and detaches event listeners.

#### `createLiquidGlassLens(container: HTMLElement, options?: LensOptions): LiquidGlassLensHandle`
Mounts a WebGL refractive lens with SDF bevel curvature, Snell refraction, RGB dispersion, Blinn-Phong specular glints, and pointer physics.

- **Parameters (`LensOptions`):**
  - `preset?: GlassPresetKey` — Optical preset (defaults to `'magnifier'`).
  - `config?: Partial<GlassConfig>` — Overrides for optical shader parameters.
  - `background?: BackgroundSource` — Image URL, `HTMLCanvasElement`, `HTMLImageElement`, or `HTMLVideoElement`. If omitted, generates an optimized procedural cyber mesh backdrop automatically.
  - `backgroundSelector?: string` — CSS selector to sample from.
  - `draggable?: boolean` — Enables pointer drag and touch physics.
  - `floating?: boolean` — Enables floating spring dynamics.
  - `initialPosition?: { x: number; y: number }` — Starting lens coordinates.
  - `onPositionChange?: (pos: { x: number; y: number }) => void` — Drag movement callback.
- **Returns (`LiquidGlassLensHandle`):**
  - `setPosition(x: number, y: number): void` — Programmatic repositioning.
  - `update(newOptions: Partial<LensOptions>): void` — Update lens options.
  - `destroy(): void` — Cancels animation loop, detaches listeners, and removes mounted canvas.

#### `injectGlassSvgDefs(doc?: Document): SVGElement | null`
Idempotently injects the `<filter id="liquid-meniscus-refract">` definition element into `document.body`. Automatically called by `createLiquidGlassPanel`.

#### `resolveGlassConfig(preset?: GlassPresetKey, overrides?: Partial<GlassConfig>): GlassConfig`
Validates, clamps, and resolves optical configuration against default boundaries.

#### `computeGlassStyle(config: GlassConfig, theme?: 'dark' | 'light' | 'auto'): Record<string, string>`
Pure function returning the CSS property map for inline style application without DOM manipulation.

#### `DragPhysicsController`
Vanilla pointer tracking class handling mouse and touch drag, boundary clamping, and velocity inertia.

---

### React Components & Hooks

Exported from `liquid-glass-fx/react`:

#### `<LiquidGlassPanel />`
Polymorphic React component for UI glass substrates.

```tsx
<LiquidGlassPanel
  as="section"                 // 'div' | 'button' | 'nav' | 'article' | any custom component
  preset="crystal"             // Named preset
  config={{ blurAmount: 0.3 }} // Custom optical overrides
  theme="dark"                 // 'dark' | 'light' | 'auto'
  interactive={true}           // Hover & active depression
  className="my-panel"
  style={{ padding: 24 }}
>
  {children}
</LiquidGlassPanel>
```

#### `<LiquidGlassLens />`
Interactive refractive WebGL lens component.

```tsx
<LiquidGlassLens
  preset="magnifier"
  background="/assets/background.jpg"
  draggable={true}
  initialPosition={{ x: 50, y: 50 }}
  onPositionChange={(pos) => console.log(pos)}
  style={{ width: 200, height: 200, borderRadius: "50%" }}
/>
```

#### `useDragPhysics(options?: DragPhysicsOptions)`
React hook returning `{ position, isDragging, bindElement, setPosition }`.

---

## The 16 Optical Parameters (`GlassConfig`)

Every glass element in `liquid-glass-fx` is governed by a unified physical optical model:

| Parameter | Type | Default | Range | Physical Meaning |
|---|---|---|---|---|
| `blurAmount` | `number` | `0.19` | `0.00 – 1.00` | Background Gaussian blur radius (0 = completely sharp, 1 = maximum blur). |
| `refraction` | `number` | `0.69` | `0.00 – 2.00` | Snell's law refraction bending strength through front and rear glass boundaries. |
| `chromAberration` | `number` | `0.05` | `0.00 – 0.50` | RGB wavelength dispersion (prismatic color fringing splitting red, green, and blue). |
| `edgeHighlight` | `number` | `0.05` | `0.00 – 2.00` | Intensity of the inner meniscus rim lighting and grazing edge reflection. |
| `specular` | `number` | `0.00` | `0.00 – 1.00` | Intensity of 2-light studio Blinn-Phong specular glints. |
| `fresnel` | `number` | `1.00` | `0.00 – 2.00` | Schlick Fresnel reflection coefficient at grazing view angles. |
| `distortion` | `number` | `0.00` | `0.00 – 1.00` | Micro-surface procedural noise distortion. |
| `cornerRadius` | `number` | `40` | `0 – 9999` | Corner rounding in pixels (set `9999` for stadium pill shape). |
| `zRadius` | `number` | `40` | `0 – 100` | Bevel thickness and lens cross-section curvature. |
| `opacity` | `number` | `1.00` | `0.00 – 1.00` | Overall glass panel transparency. |
| `saturation` | `number` | `0.00` | `-1.00 – 1.00` | Vibrancy and saturation adjustment for refracted light. |
| `tintStrength` | `number` | `0.00` | `0.00 – 1.00` | Cool optical glass tint. |
| `brightness` | `number` | `0.00` | `-0.50 – 0.50` | Exposure boost/cut. |
| `shadowOpacity` | `number` | `0.30` | `0.00 – 1.00` | Drop shadow darkness. |
| `shadowSpread` | `number` | `10` | `0 – 50` | Drop shadow blur spread radius. |
| `shadowOffsetY` | `number` | `1` | `-10 – 30` | Drop shadow vertical light offset in pixels. |
| `bevelMode` | `0 \| 1` | `0` | `0` or `1` | `0` = Biconvex pill lens (flat center, curved bevel); `1` = Dome magnifier (continuous spherical magnification). |
| `floating` | `boolean` | `false` | `boolean` | Enables pointer drag & inertia physics. |
| `button` | `boolean` | `false` | `boolean` | Tactile hover lift and click active scale. |

---

## Curated Presets

`liquid-glass-fx` includes 6 carefully calibrated presets:

```typescript
import { GLASS_PRESETS } from "liquid-glass-fx";
```

### 1. `crystal`
- **Characteristics:** Ultra-clear optical crown glass with high refraction, crisp specular glints, and visible chromatic dispersion.
- **Best for:** Hero showcases, floating cards, navigation bars.
- **Key values:** `refraction: 0.95`, `chromAberration: 0.12`, `edgeHighlight: 1.15`, `fresnel: 1.4`, `specular: 0.45`.

### 2. `frosted`
- **Characteristics:** Soft sand-blasted diffuse glass with high blur and subdued edge reflections.
- **Best for:** Modals, dialogs, sidebar panels, content backgrounds where text readability is paramount.
- **Key values:** `blurAmount: 0.45`, `refraction: 0.35`, `chromAberration: 0.02`, `fresnel: 0.8`.

### 3. `obsidian`
- **Characteristics:** Deep tinted smoky black glass with strong contrast and rich shadows.
- **Best for:** Dark mode UI, luxury dark aesthetics, code blocks.
- **Key values:** `brightness: -0.15`, `shadowOpacity: 0.6`, `specular: 0.6`, `fresnel: 1.2`.

### 4. `pill`
- **Characteristics:** Stadium-rounded geometry (`cornerRadius: 9999`) with subtle bevel and tactile interactive press dynamics.
- **Best for:** Buttons, floating badges, segmented pills, search bars.
- **Key values:** `cornerRadius: 9999`, `zRadius: 20`, `button: true`.

### 5. `magnifier`
- **Characteristics:** Spherical dome magnifier (`bevelMode: 1`) that physically magnifies typography and graphics underneath with radial Snell dispersion.
- **Best for:** Interactive Hero showcases, image zooming, lens inspection tools.
- **Key values:** `bevelMode: 1`, `refraction: 1.5`, `chromAberration: 0.18`, `floating: true`.

### 6. `default`
- **Characteristics:** Balanced everyday UI glass substrate providing immediate glassmorphic depth.

---

## Background Sampler & Texture Sources

When using the WebGL lens engine (`createLiquidGlassLens` or `<LiquidGlassLens />`), the background can be provided in several ways:

1. **Image URL:**
   ```typescript
   createLiquidGlassLens(el, { background: "url(/hero.jpg)" });
   ```
2. **HTML Canvas / Video / Image Element:**
   ```typescript
   const canvas = document.querySelector<HTMLCanvasElement>("#threejs-canvas")!;
   createLiquidGlassLens(el, { background: canvas });
   ```
3. **CSS Selector:**
   ```typescript
   createLiquidGlassLens(el, { backgroundSelector: "#background-canvas" });
   ```
4. **Built-in Procedural Backdrop (Zero-Config):**
   If no background is provided, the engine automatically generates an optimized procedural backdrop featuring radial cyber aurora orbs and coordinate blueprint gridlines for high-contrast refraction demonstration.

---

## SSR & Next.js Compatibility

`liquid-glass-fx` is 100% safe for Server-Side Rendering (Next.js App Router, React Server Components, Nuxt, SvelteKit, Astro):
- All DOM and WebGL operations guard on `typeof window !== "undefined"` and `typeof document !== "undefined"`.
- `<LiquidGlassPanel />` renders valid semantic HTML with inline fallback substrate styles during SSR, ensuring zero layout shift and hydration mismatches.
- WebGL contexts are initialized exclusively on the client inside lifecycle hooks.

---

## Interactive Playground

To experiment with live sliders for all 16 parameters, preset switching, theme toggling, and draggable WebGL lenses:

```bash
npm run playground
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Build Toolchain

`liquid-glass-fx` is thoroughly tested and verified:

```bash
# Run unit & integration tests (Vitest)
npm test

# Run strict TypeScript type check
npm run typecheck

# Build ESM, CommonJS, and TypeScript declaration bundles (tsup)
npm run build
```

---

## License

[MIT](LICENSE) © 2026
