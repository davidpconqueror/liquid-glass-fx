# liquid-glass-fx

High-performance, framework-agnostic optical liquid glass effect system for the modern web. Apply realistic Snell's law glass refraction, dynamic Gaussian blur, RGB chromatic aberration, and studio Blinn-Phong specular highlights using pure CSS and WebGL ES 1.0 shaders.

- **Zero Runtime Dependencies for Core:** Pure vanilla TypeScript and raw WebGL.
- **Dual-Engine Architecture:** High-performance CSS `backdrop-filter` and SVG meniscus displacement for UI panels + WebGL biconvex/dome lens engine for interactive magnification.
- **120 FPS Performance:** Zero CPU rasterization stutter (`html-to-image` / SVG `foreignObject` free) and zero WebGL context exhaustion (singleton context architecture).
- **First-Class React Adapter:** Optional peer dependency exporting polymorphic `<LiquidGlassPanel />` and draggable `<LiquidGlassLens />`.
- **Framework Agnostic:** Seamlessly works with Vanilla JS, React, Vue, Svelte, Astro, Next.js, and more.
- **Tailwind-Free:** Works out-of-the-box with or without Tailwind CSS.

---

## Installation

```bash
npm install liquid-glass-fx
```

If you are using React:

```bash
npm install liquid-glass-fx react react-dom
```

---

## Quick Start

### 1. Vanilla JavaScript / TypeScript

#### UI Glass Panel (Navbar, Cards, Buttons)
```typescript
import { createLiquidGlassPanel } from 'liquid-glass-fx';

const card = document.querySelector<HTMLElement>('#my-card');

const handle = createLiquidGlassPanel(card, {
  preset: 'crystal', // 'crystal' | 'frosted' | 'obsidian' | 'pill' | 'magnifier' | 'default'
  interactive: true, // Enables tactile hover & click depression
});

// Dynamically update options
handle.update({ preset: 'frosted' });

// Clean up
handle.destroy();
```

#### Interactive Draggable WebGL Refraction Lens
```typescript
import { createLiquidGlassLens } from 'liquid-glass-fx';

const container = document.querySelector<HTMLElement>('#lens-container');

const lens = createLiquidGlassLens(container, {
  preset: 'magnifier',
  draggable: true,
  background: 'url(/hero-background.jpg)', // or HTMLCanvasElement / HTMLImageElement
  initialPosition: { x: 100, y: 150 },
  onPositionChange: (pos) => console.log('Lens pos:', pos),
});

lens.setPosition(200, 250);
lens.destroy();
```

---

### 2. React Applications (`liquid-glass-fx/react`)

```tsx
import React from 'react';
import { LiquidGlassPanel, LiquidGlassLens } from 'liquid-glass-fx/react';

export function Showcase() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: 40 }}>
      {/* Polymorphic Glass Navigation */}
      <LiquidGlassPanel as="nav" preset="crystal" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>Brand Logo</strong>
        <LiquidGlassPanel as="button" preset="pill" interactive style={{ padding: '8px 20px', border: 'none', color: '#fff' }}>
          Connect
        </LiquidGlassPanel>
      </LiquidGlassPanel>

      {/* Glass UI Card */}
      <LiquidGlassPanel preset="frosted" style={{ maxWidth: 480, margin: '40px auto', padding: 32 }}>
        <h2>Refractive UI Card</h2>
        <p>Zero DOM serialization stutter, locked 120 FPS.</p>
      </LiquidGlassPanel>

      {/* Interactive Draggable WebGL Lens */}
      <LiquidGlassLens
        preset="magnifier"
        draggable
        initialPosition={{ x: 80, y: 120 }}
        style={{ width: 200, height: 200, borderRadius: '50%' }}
      />
    </div>
  );
}
```

---

## Curated Presets

| Preset | Description |
|---|---|
| `crystal` | High refraction (`0.95`), visible chromatic aberration (`0.12`), and crisp specular highlights (`1.15`). |
| `frosted` | Soft diffuse blur (`0.45`), low refraction (`0.35`), low color fringing, and subtle edge glow. |
| `obsidian` | Dark smoky glass with deep shadows and high specular reflections. |
| `pill` | Stadium rounded borders (`cornerRadius: 9999`) with tactile press physics. |
| `magnifier` | Dome optical magnifier (`bevelMode: 1`, `refraction: 1.5`, `chromAberration: 0.18`, `floating: true`). |
| `default` | Balanced everyday UI glass substrate. |

---

## 16 Optical Parameters (`GlassConfig`)

You can override any parameter individually:

```typescript
import { resolveGlassConfig, type GlassConfig } from 'liquid-glass-fx';

const customConfig: Partial<GlassConfig> = {
  blurAmount: 0.25,      // Background blur [0.00 – 1.00]
  refraction: 0.85,      // Lens displacement bending strength [0.00 – 2.00]
  chromAberration: 0.08, // RGB chromatic dispersion [0.00 – 0.50]
  edgeHighlight: 1.2,    // Rim lighting & inner glow [0.00 – 2.00]
  specular: 0.5,         // Blinn-Phong specular glints [0.00 – 1.00]
  fresnel: 1.2,          // Grazing-angle surface reflection [0.00 – 2.00]
  distortion: 0.05,      // Micro-surface noise distortion [0.00 – 1.00]
  cornerRadius: 32,      // Corner radius in pixels [0 – 9999]
  zRadius: 40,           // Bevel depth curvature [0 – 100]
  opacity: 0.95,         // Overall glass transparency [0.00 – 1.00]
  saturation: 0.1,       // Vibrant color boost under glass [-1.00 – 1.00]
  brightness: 0.02,      // Exposure boost [-0.50 – 0.50]
  shadowOpacity: 0.35,   // Drop shadow intensity [0.00 – 1.00]
  shadowSpread: 12,      // Drop shadow spread [0 – 50]
  shadowOffsetY: 2,      // Vertical shadow offset [-10 – 30]
  bevelMode: 0,          // 0 = Biconvex pill lens; 1 = Dome magnifier
};
```

---

## Interactive Playground

Run the included Vite playground to experiment with live parameter sliders and draggable WebGL lenses:

```bash
npm run playground
```

---

## License

MIT
