import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Rocket,
  BookOpen,
  Waves,
  Palette,
  Grid,
  Zap,
  LayoutGrid,
  Gem,
  Rainbow,
  Sliders,
  RotateCcw,
  X,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Building2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { LiquidGlassPanel, LiquidGlassLens } from "../../src/react";
import { GLASS_PRESETS, type GlassPresetKey, type GlassConfig } from "../../src";

type BackgroundKey = "aurora" | "blueprint" | "fluid" | "neon" | "checker";
type LensSceneKey = "pattern" | "poster" | "architecture" | "art" | "photo" | "custom";

function drawStageBackdrop(
  canvas: HTMLCanvasElement,
  bgTheme: BackgroundKey,
  theme: "dark" | "light",
  lensScene: LensSceneKey = "pattern",
  customImg: HTMLImageElement | null = null,
  photoImg: HTMLImageElement | null = null
) {
  const dpr = window.devicePixelRatio || 1;
  const parent = canvas.parentElement;
  const cssW = parent?.clientWidth || canvas.clientWidth || 800;
  const cssH = parent?.clientHeight || canvas.clientHeight || 550;
  const targetW = Math.round(cssW * dpr);
  const targetH = Math.round(cssH * dpr);

  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.scale(dpr, dpr);
  const w = cssW;
  const h = cssH;
  const isDark = theme === "dark";

  // Helper for drawing image with cover aspect ratio
  const drawImageCover = (img: HTMLImageElement) => {
    const imgRatio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
    const canvasRatio = w / h;
    let dw = w;
    let dh = h;
    let dx = 0;
    let dy = 0;
    if (imgRatio > canvasRatio) {
      dw = h * imgRatio;
      dx = (w - dw) / 2;
    } else {
      dh = w / imgRatio;
      dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // 1. CUSTOM USER IMAGE
  if (lensScene === "custom" && customImg && customImg.complete && customImg.naturalWidth > 0) {
    drawImageCover(customImg);
    ctx.fillStyle = isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)";
    ctx.fillRect(20, h - 42, 380, 26);
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    ctx.font = "bold 11px monospace";
    ctx.fillText("CUSTOM USER IMAGE  •  DRAG LENS TO TEST PHYSICAL REFRACTION", 28, h - 25);
    ctx.restore();
    return;
  }

  // 2. CURATED PHOTO SCENE
  if (lensScene === "photo") {
    if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
      drawImageCover(photoImg);
    } else {
      // High-detail procedural landscape fallback (Sunset Lake & Mountain Peaks)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (isDark) {
        skyGrad.addColorStop(0, "#0b0f19");
        skyGrad.addColorStop(0.35, "#1e1b4b");
        skyGrad.addColorStop(0.65, "#831843");
        skyGrad.addColorStop(1, "#f97316");
      } else {
        skyGrad.addColorStop(0, "#0284c7");
        skyGrad.addColorStop(0.35, "#38bdf8");
        skyGrad.addColorStop(0.65, "#f472b6");
        skyGrad.addColorStop(1, "#fbbf24");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Glowing Sun Disc
      const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, 120);
      sunGrad.addColorStop(0, "#ffffff");
      sunGrad.addColorStop(0.3, isDark ? "#fef08a" : "#fef9c3");
      sunGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.45, 120, 0, Math.PI * 2);
      ctx.fill();

      // Mountain Ridges
      ctx.fillStyle = isDark ? "#111827" : "#1e293b";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.lineTo(w * 0.25, h * 0.48);
      ctx.lineTo(w * 0.5, h * 0.6);
      ctx.lineTo(w * 0.75, h * 0.42);
      ctx.lineTo(w, h * 0.65);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Water Reflection
      const waterGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
      waterGrad.addColorStop(0, isDark ? "#0f172a" : "#0284c7");
      waterGrad.addColorStop(1, isDark ? "#020617" : "#0369a1");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);

      // Shimmer lines across water
      ctx.strokeStyle = isDark ? "rgba(254, 240, 138, 0.4)" : "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 20; i++) {
        const y = h * 0.68 + i * 8;
        const lineW = 30 + i * 12 + Math.sin(i * 1.5) * 20;
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - lineW / 2, y);
        ctx.lineTo(w * 0.5 + lineW / 2, y);
        ctx.stroke();
      }
    }
    // Overlay text badge
    ctx.fillStyle = isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)";
    ctx.fillRect(20, 20, 250, 30);
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    ctx.font = "800 12px system-ui, -apple-system, sans-serif";
    ctx.fillText("HIGH-RES PHOTOGRAPHIC SCENE", 32, 40);
    ctx.restore();
    return;
  }

  // 3. EDITORIAL SWISS TYPOGRAPHY POSTER (Unsurpassed for testing magnification & dispersion)
  if (lensScene === "poster") {
    ctx.fillStyle = isDark ? "#090d16" : "#ffffff";
    ctx.fillRect(0, 0, w, h);

    // Warm high-contrast accent blocks
    ctx.fillStyle = isDark ? "#e11d48" : "#dc2626";
    ctx.fillRect(28, 28, 12, h - 56);

    ctx.fillStyle = isDark ? "#0284c7" : "#2563eb";
    ctx.fillRect(w - 40, 28, 12, h - 56);

    // Swiss Grid Header
    ctx.fillStyle = isDark ? "#ffffff" : "#090a0f";
    ctx.font = "900 36px system-ui, -apple-system, sans-serif";
    ctx.fillText("OPTICAL DISPERSION", 56, 72);

    ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "#475569";
    ctx.font = "700 13.5px system-ui, -apple-system, sans-serif";
    ctx.fillText("INTERNATIONAL TYPOGRAPHIC & PHYSICAL GLASS JOURNAL  •  VOL. 26", 56, 96);

    // Color Swatch Bar (CMYK + RGB)
    const swatches = [
      "#000000",
      "#e11d48",
      "#2563eb",
      "#facc15",
      "#059669",
      "#7c3aed",
      "#06b6d4",
      "#ffffff",
    ];
    swatches.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.fillRect(56 + idx * 48, 112, 44, 16);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(56 + idx * 48, 112, 44, 16);
    });

    // Three Editorial Text Columns (Ideal for physical dome magnifier testing!)
    const colW = (w - 140) / 3;
    const colY = 154;

    // Column 1: Snell's Law
    ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7";
    ctx.font = "800 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("01 / SNELL'S LAW", 56, colY);

    ctx.fillStyle = isDark ? "rgba(255,255,255,0.85)" : "#1e293b";
    ctx.font = "500 12px system-ui, -apple-system, sans-serif";
    const col1Lines = [
      "Light ray propagation across interfaces:",
      "n₁ · sin(θ₁) = n₂ · sin(θ₂)",
      "",
      "When rays penetrate curved optical glass,",
      "the local surface normal vector determines",
      "the angle of incidence and refracted exit",
      "trajectory across both glass air boundaries.",
    ];
    col1Lines.forEach((line, i) => {
      ctx.fillText(line, 56, colY + 24 + i * 19);
    });

    // Column 2: Chromatic Dispersion
    const col2X = 56 + colW + 20;
    ctx.fillStyle = isDark ? "#f43f5e" : "#e11d48";
    ctx.font = "800 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("02 / CHROMATIC FRINGE", col2X, colY);

    ctx.fillStyle = isDark ? "rgba(255,255,255,0.85)" : "#1e293b";
    const col2Lines = [
      "Wavelength-dependent refraction:",
      "n(λ) = A + B / λ² + C / λ⁴",
      "",
      "Shorter wavelengths (blue 450nm) bend",
      "sharper than longer wavelengths (red 650nm),",
      "producing prismatic spectral rims along",
      "the curved bevel perimeter of physical lenses.",
    ];
    col2Lines.forEach((line, i) => {
      ctx.fillText(line, col2X, colY + 24 + i * 19);
    });

    // Column 3: High-Density Optical Barcode & Test Ladder
    const col3X = col2X + colW + 20;
    ctx.fillStyle = isDark ? "#10b981" : "#059669";
    ctx.font = "800 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("03 / FREQUENCY CALIBRATION", col3X, colY);

    // Fine Barcode Lines (Dramatic magnification target!)
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    const barWidths = [
      2, 1, 4, 1, 3, 2, 5, 1, 2, 4, 1, 3, 2, 1, 5, 2, 3, 1, 4, 2, 1, 3, 5, 2, 1, 4,
    ];
    let barX = col3X;
    barWidths.forEach((bw) => {
      ctx.fillRect(barX, colY + 22, bw, 46);
      barX += bw + 3;
    });

    // Microtext Size Ladder (6pt to 16pt)
    const ladder = [
      { text: "MAGNIFY 6PT MICROTEXT: 0123456789", size: 9 },
      { text: "MAGNIFY 10PT BODY: Snell Dispersion", size: 11 },
      { text: "MAGNIFY 14PT HEADER: Optical Glass", size: 13 },
      { text: "MAGNIFY 18PT DISPLAY: 120 FPS", size: 16 },
    ];
    let ladderY = colY + 88;
    ladder.forEach((item) => {
      ctx.font = `700 ${item.size}px monospace`;
      ctx.fillStyle = isDark ? "#ffffff" : "#000000";
      ctx.fillText(item.text, col3X, ladderY);
      ladderY += item.size + 9;
    });

    // Bottom Decorative Graphic Footprint
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    ctx.fillRect(56, h - 68, w - 112, 34);

    ctx.fillStyle = isDark ? "#ffffff" : "#090a0f";
    ctx.font = "bold 12.5px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      "DRAG LENS OVER THE ARTICLE, BARCODE & MICROTEXT TO TEST MAGNIFICATION",
      72,
      h - 46
    );

    ctx.restore();
    return;
  }

  // 4. ARCHITECTURAL CITY & PERSPECTIVE GEOMETRY
  if (lensScene === "architecture") {
    ctx.fillStyle = isDark ? "#060b17" : "#f1f5f9";
    ctx.fillRect(0, 0, w, h);

    // Isometric / Perspective Lines
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(37, 99, 235, 0.35)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(w * 0.5 + (x - w * 0.5) * 2.2, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Modern High-Rise Geometric Tower Facades
    const towers = [
      {
        x: 60,
        w: 140,
        h: 360,
        color1: isDark ? "#1e293b" : "#cbd5e1",
        color2: isDark ? "#334155" : "#e2e8f0",
        tint: "#0284c7",
      },
      {
        x: 230,
        w: 180,
        h: 420,
        color1: isDark ? "#0f172a" : "#94a3b8",
        color2: isDark ? "#1e293b" : "#cbd5e1",
        tint: "#2563eb",
      },
      {
        x: 440,
        w: 160,
        h: 320,
        color1: isDark ? "#1e293b" : "#cbd5e1",
        color2: isDark ? "#334155" : "#e2e8f0",
        tint: "#db2777",
      },
      {
        x: 630,
        w: 130,
        h: 380,
        color1: isDark ? "#0f172a" : "#94a3b8",
        color2: isDark ? "#1e293b" : "#cbd5e1",
        tint: "#059669",
      },
    ];

    towers.forEach((t) => {
      const topY = h - t.h;
      ctx.fillStyle = t.color1;
      ctx.fillRect(t.x, topY, t.w, t.h);

      const winW = 10;
      const winH = 14;
      const gapX = 8;
      const gapY = 12;
      for (let wx = t.x + 14; wx < t.x + t.w - 14; wx += winW + gapX) {
        for (let wy = topY + 20; wy < h - 40; wy += winH + gapY) {
          ctx.fillStyle = (wx + wy) % 5 === 0 ? t.tint : isDark ? "#fef08a" : "#ffffff";
          ctx.fillRect(wx, wy, winW, winH);
        }
      }

      ctx.fillStyle = t.tint;
      ctx.fillRect(t.x + t.w / 2 - 2, topY - 30, 4, 30);
    });

    ctx.fillStyle = isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)";
    ctx.fillRect(40, 30, 290, 40);
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    ctx.font = "800 15px system-ui, -apple-system, sans-serif";
    ctx.fillText("GEOMETRIC GLASS ARCHITECTURE", 54, 55);

    ctx.restore();
    return;
  }

  // 5. CHROMATIC PRISMATIC ART
  if (lensScene === "art") {
    ctx.fillStyle = isDark ? "#080c16" : "#fdf4ff";
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const colors = [
      "#e11d48",
      "#f43f5e",
      "#fb923c",
      "#facc15",
      "#10b981",
      "#06b6d4",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ];

    for (let r = 240; r >= 20; r -= 24) {
      const colIdx = Math.floor(r / 24) % colors.length;
      ctx.strokeStyle = colors[colIdx];
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 280, cy + Math.sin(angle) * 280);
      ctx.stroke();
    }

    ctx.fillStyle = isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)";
    ctx.fillRect(36, 32, 230, 36);
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    ctx.font = "800 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("CHROMATIC SPECTRUM ART", 48, 55);

    ctx.restore();
    return;
  }

  // 6. DEFAULT PROCEDURAL OPTICAL PATTERNS (VIBRANT & HIGH CONTRAST IN BOTH LIGHT & DARK MODES!)
  if (bgTheme === "checker") {
    const size = 36;
    // High-contrast in both modes! In light mode, deep slate-navy vs pure white
    const c1 = isDark ? "#090d16" : "#ffffff";
    const c2 = isDark ? "#1e293b" : "#334155";
    for (let x = 0; x < w; x += size) {
      for (let y = 0; y < h; y += size) {
        ctx.fillStyle = (x / size + y / size) % 2 === 0 ? c1 : c2;
        ctx.fillRect(x, y, size, size);
      }
    }
    // High-contrast saturated spectrum beam
    const grad = ctx.createLinearGradient(0, h * 0.45, w, h * 0.55);
    grad.addColorStop(0, "#ec4899");
    grad.addColorStop(0.25, "#8b5cf6");
    grad.addColorStop(0.5, "#3b82f6");
    grad.addColorStop(0.75, "#10b981");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.42, w, 34);

    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.75)" : "rgba(37, 99, 235, 0.85)";
    ctx.lineWidth = 2.5;
    for (let r = 50; r <= 250; r += 50) {
      ctx.beginPath();
      ctx.arc(w * 0.55, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (bgTheme === "blueprint") {
    // Rich engineering cyan/navy in dark mode, vibrant cobalt technical drafting in light mode
    ctx.fillStyle = isDark ? "#030816" : "#dbeafe";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(30, 64, 175, 0.45)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.85)" : "rgba(29, 78, 216, 0.85)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(w * 0.55, h * 0.5, 130, 0, Math.PI * 2);
    ctx.arc(w * 0.55, h * 0.5, 65, 0, Math.PI * 2);
    ctx.stroke();
  } else if (bgTheme === "fluid") {
    // Rich color density in both modes
    ctx.fillStyle = isDark ? "#090d16" : "#fdf4ff";
    ctx.fillRect(0, 0, w, h);
    const blobs = isDark
      ? [
          { x: 0.2, y: 0.3, r: 0.45, c: "#ec4899" },
          { x: 0.75, y: 0.35, r: 0.5, c: "#06b6d4" },
          { x: 0.5, y: 0.75, r: 0.45, c: "#8b5cf6" },
          { x: 0.85, y: 0.8, r: 0.4, c: "#10b981" },
        ]
      : [
          { x: 0.2, y: 0.3, r: 0.5, c: "#db2777" },
          { x: 0.75, y: 0.35, r: 0.52, c: "#0284c7" },
          { x: 0.5, y: 0.75, r: 0.48, c: "#7c3aed" },
          { x: 0.85, y: 0.8, r: 0.44, c: "#059669" },
        ];
    for (const b of blobs) {
      const g = ctx.createRadialGradient(w * b.x, h * b.y, 0, w * b.x, h * b.y, w * b.r);
      g.addColorStop(0, b.c);
      g.addColorStop(1, isDark ? "transparent" : "rgba(253, 244, 255, 0.1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  } else if (bgTheme === "neon") {
    ctx.fillStyle = isDark ? "#070b14" : "#f8fafc";
    ctx.fillRect(0, 0, w, h);

    if (!isDark) {
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(0, h * 0.85, w, 40);
      ctx.fillStyle = "#1e293b";
      for (let x = -40; x < w + 40; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.85);
        ctx.lineTo(x + 18, h * 0.85);
        ctx.lineTo(x - 2, h * 0.85 + 40);
        ctx.lineTo(x - 20, h * 0.85 + 40);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.strokeStyle = isDark ? "#ec4899" : "#e11d48";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.25);
    ctx.lineTo(w, h * 0.4);
    ctx.stroke();

    ctx.strokeStyle = isDark ? "#06b6d4" : "#0284c7";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.lineTo(w, h * 0.55);
    ctx.stroke();
  } else {
    // aurora: Saturated & vibrant in both modes
    const baseGrad = ctx.createLinearGradient(0, 0, w, h);
    if (!isDark) {
      baseGrad.addColorStop(0, "#fed7aa");
      baseGrad.addColorStop(1, "#bae6fd");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);
    }

    const g1 = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.45);
    g1.addColorStop(0, isDark ? "rgba(168, 85, 247, 0.85)" : "rgba(124, 58, 237, 0.75)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 0, w * 0.7, h * 0.6, w * 0.48);
    g2.addColorStop(0, isDark ? "rgba(16, 185, 129, 0.8)" : "rgba(5, 150, 105, 0.7)");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    const g3 = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, w * 0.35);
    g3.addColorStop(0, isDark ? "rgba(236, 72, 153, 0.7)" : "rgba(225, 29, 72, 0.65)");
    g3.addColorStop(1, "transparent");
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, w, h);
  }

  // Draw optical test typography & graphics right on the backdrop!
  ctx.fillStyle = isDark ? "#ffffff" : "#090a0f";
  ctx.font = "800 24px system-ui, -apple-system, sans-serif";
  ctx.fillText("PHYSICAL OPTICAL LENS", 36, 60);

  ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "#334155";
  ctx.font = "600 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("Snell's Law: n₁·sin(θ₁) = n₂·sin(θ₂)  |  RGB Dispersion  |  120 FPS", 36, 88);

  ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7";
  ctx.font = "bold 13px monospace";
  ctx.fillText("DRAG LENS OVER THIS TEXT & PATTERNS TO WATCH REFRACTION", 36, 116);

  // Geometric test grid bars
  ctx.fillStyle = "#ec4899";
  ctx.fillRect(36, 134, 70, 8);
  ctx.fillStyle = "#8b5cf6";
  ctx.fillRect(114, 134, 70, 8);
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(192, 134, 70, 8);
  ctx.fillStyle = "#10b981";
  ctx.fillRect(270, 134, 70, 8);
  ctx.restore();
}

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [bgTheme, setBgTheme] = useState<BackgroundKey>("aurora");
  const [selectedPreset, setSelectedPreset] = useState<GlassPresetKey>("crystal");
  const [config, setConfig] = useState<GlassConfig>(GLASS_PRESETS.crystal);
  const [activeTab, setActiveTab] = useState<"panel" | "lens">("panel");
  const [activeModal, setActiveModal] = useState<"docs" | "quickstart" | null>(null);
  const [copied, setCopied] = useState(false);
  const [lensScene, setLensScene] = useState<LensSceneKey>("pattern");
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);
  const [curatedPhoto, setCuratedPhoto] = useState<HTMLImageElement | null>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const copyInstallCommand = () => {
    try {
      navigator.clipboard.writeText("npm install liquid-glass-fx");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Preload curated high-res photo for lens stage
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80";
    img.onload = () => {
      setCuratedPhoto(img);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "lens" && stageCanvasRef.current) {
      drawStageBackdrop(
        stageCanvasRef.current,
        bgTheme,
        theme,
        lensScene,
        customImage,
        curatedPhoto
      );
      const handleResize = () => {
        if (stageCanvasRef.current) {
          drawStageBackdrop(
            stageCanvasRef.current,
            bgTheme,
            theme,
            lensScene,
            customImage,
            curatedPhoto
          );
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [activeTab, bgTheme, theme, lensScene, customImage, curatedPhoto]);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          setCustomImage(img);
          setLensScene("custom");
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  };

  const handlePresetChange = (preset: GlassPresetKey) => {
    setSelectedPreset(preset);
    setConfig(GLASS_PRESETS[preset]);
  };

  const updateParam = (key: keyof GlassConfig, val: number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const resetPreset = () => {
    setConfig(GLASS_PRESETS[selectedPreset]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        padding: "24px 20px 48px",
        overflowX: "hidden",
        background:
          theme === "dark"
            ? bgTheme === "blueprint"
              ? "#030816"
              : "#070b14"
            : bgTheme === "blueprint"
              ? "#eff6ff"
              : "#f8fafc",
      }}
    >
      {/* =========================================================================
          BACKGROUND LAYER SYSTEM (Shows off physical glass refraction & blur)
         ========================================================================= */}

      {/* 1. Cyber Aurora Mesh with Animated High-Contrast Blobs */}
      {bgTheme === "aurora" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {/* Dot Matrix Pattern for sharp refraction edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? "radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)"
                  : "radial-gradient(rgba(15, 23, 42, 0.22) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.8,
            }}
          />
          {/* Animated Neon Violet Orb */}
          <div
            className="anim-orb-1"
            style={{
              position: "absolute",
              top: "10%",
              left: "15%",
              width: 580,
              height: 580,
              borderRadius: "50%",
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(168, 85, 247, 0.65) 0%, rgba(99, 102, 241, 0.45) 45%, transparent 70%)"
                  : "radial-gradient(circle, rgba(147, 51, 234, 0.55) 0%, rgba(79, 70, 229, 0.4) 45%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          {/* Animated Emerald & Lime Orb */}
          <div
            className="anim-orb-2"
            style={{
              position: "absolute",
              top: "35%",
              right: "10%",
              width: 620,
              height: 620,
              borderRadius: "50%",
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(6, 182, 212, 0.4) 50%, transparent 70%)"
                  : "radial-gradient(circle, rgba(5, 150, 105, 0.5) 0%, rgba(14, 165, 233, 0.4) 50%, transparent 70%)",
              filter: "blur(55px)",
            }}
          />
          {/* Animated Hot Pink & Orange Orb */}
          <div
            className="anim-orb-3"
            style={{
              position: "absolute",
              bottom: "5%",
              left: "30%",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(236, 72, 153, 0.55) 0%, rgba(249, 115, 22, 0.4) 50%, transparent 70%)"
                  : "radial-gradient(circle, rgba(225, 29, 72, 0.5) 0%, rgba(234, 88, 12, 0.4) 50%, transparent 70%)",
              filter: "blur(45px)",
            }}
          />
        </div>
      )}

      {/* 2. Engineering Blueprint & Telemetry Grid (Lines bend dramatically under glass) */}
      {bgTheme === "blueprint" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {/* 36px Coordinate Blueprint Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? `linear-gradient(rgba(56, 189, 248, 0.18) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(56, 189, 248, 0.18) 1px, transparent 1px)`
                  : `linear-gradient(rgba(30, 64, 175, 0.3) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(30, 64, 175, 0.3) 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
          />
          {/* Blueprint Concentric Target Rings */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "45%",
              width: 480,
              height: 480,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border:
                theme === "dark"
                  ? "1px dashed rgba(56, 189, 248, 0.35)"
                  : "1px dashed rgba(37, 99, 235, 0.45)",
              boxShadow:
                theme === "dark"
                  ? "0 0 0 80px rgba(56, 189, 248, 0.05), 0 0 0 160px rgba(56, 189, 248, 0.03)"
                  : "0 0 0 80px rgba(37, 99, 235, 0.08), 0 0 0 160px rgba(37, 99, 235, 0.04)",
            }}
          />
          {/* Glowing Cobalt & Cyan Underglow */}
          <div
            style={{
              position: "absolute",
              top: "25%",
              right: "20%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
      )}

      {/* 3. Vibrant Fluid 3D Rainbow Ribbon (High dynamic range optical prism) */}
      {bgTheme === "fluid" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-20%",
              background:
                theme === "dark"
                  ? `radial-gradient(circle at 20% 30%, #ec4899 0%, transparent 35%),
                     radial-gradient(circle at 80% 25%, #06b6d4 0%, transparent 35%),
                     radial-gradient(circle at 40% 80%, #8b5cf6 0%, transparent 40%),
                     radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 35%),
                     radial-gradient(circle at 50% 50%, #10b981 0%, transparent 40%)`
                  : `radial-gradient(circle at 20% 30%, #db2777 0%, transparent 35%),
                     radial-gradient(circle at 80% 25%, #0284c7 0%, transparent 35%),
                     radial-gradient(circle at 40% 80%, #7c3aed 0%, transparent 40%),
                     radial-gradient(circle at 75% 75%, #d97706 0%, transparent 35%),
                     radial-gradient(circle at 50% 50%, #059669 0%, transparent 40%)`,
              filter: "blur(40px)",
              opacity: theme === "dark" ? 0.75 : 0.82,
            }}
          />
          {/* Subtle Diagonal Scanlines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 2px, transparent 2px, transparent 8px)",
            }}
          />
        </div>
      )}

      {/* 4. Neon Cyberpunk Laser Grid */}
      {bgTheme === "neon" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "10%",
              width: "80%",
              height: 4,
              background: "linear-gradient(90deg, transparent, #ec4899, #06b6d4, transparent)",
              boxShadow: "0 0 25px #ec4899, 0 0 45px #06b6d4",
              transform: "rotate(-12deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "5%",
              width: "90%",
              height: 3,
              background: "linear-gradient(90deg, transparent, #10b981, #3b82f6, transparent)",
              boxShadow: "0 0 20px #10b981, 0 0 40px #3b82f6",
              transform: "rotate(8deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "15%",
              width: "70%",
              height: 4,
              background: "linear-gradient(90deg, transparent, #f59e0b, #ec4899, transparent)",
              boxShadow: "0 0 25px #f59e0b, 0 0 50px #ec4899",
              transform: "rotate(-5deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? "linear-gradient(rgba(236, 72, 153, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.12) 1px, transparent 1px)"
                  : "linear-gradient(rgba(225, 29, 72, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.15) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>
      )}

      {/* 5. Optical Checkerboard & Contrast Bars (Maximum refraction contrast) */}
      {bgTheme === "checker" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? "repeating-conic-gradient(#1e293b 0% 25%, #070b14 0% 50%)"
                  : "repeating-conic-gradient(#334155 0% 25%, #ffffff 0% 50%)",
              backgroundSize: "48px 48px",
              opacity: theme === "dark" ? 0.75 : 0.85,
            }}
          />
          {/* Saturated Spectrum Beam across center behind cards */}
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: 0,
              right: 0,
              height: 180,
              background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b)",
              filter: "blur(60px)",
              opacity: theme === "dark" ? 0.6 : 0.8,
            }}
          />
        </div>
      )}

      {/* =========================================================================
          FOREGROUND CONTENT & GLASS SHOWCASE
         ========================================================================= */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto" }}>
        {/* Navigation Bar */}
        <LiquidGlassPanel
          as="nav"
          preset={selectedPreset}
          config={config}
          theme={theme}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 28px",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <strong style={{ fontSize: 20, letterSpacing: "-0.5px" }}>liquid-glass-fx</strong>
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              v0.1.1
            </span>
          </div>

          {/* Theme & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={toggleTheme}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "8px 16px",
                borderRadius: 20,
                color: "inherit",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              {theme === "dark" ? (
                <>
                  <Sun size={14} /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={14} /> Dark Mode
                </>
              )}
            </button>
            <LiquidGlassPanel
              as="button"
              preset="pill"
              interactive={true}
              onClick={() => setActiveModal("quickstart")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                color: "inherit",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Get Started <Rocket size={15} />
            </LiquidGlassPanel>
          </div>
        </LiquidGlassPanel>

        {/* Background Switcher Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            padding: "10px 18px",
            borderRadius: 18,
            background: theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
            border:
              theme === "dark"
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                opacity: 0.8,
              }}
            >
              Backdrop Style:
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "aurora", label: "Cyber Aurora", Icon: Waves },
                { key: "fluid", label: "3D Fluid Rainbow", Icon: Palette },
                { key: "blueprint", label: "Blueprint Grid", Icon: Grid },
                { key: "neon", label: "Neon Laser", Icon: Zap },
                { key: "checker", label: "Optical Checker", Icon: LayoutGrid },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setBgTheme(key as BackgroundKey)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 14,
                    fontSize: 12.5,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: bgTheme === key ? 600 : 400,
                    background:
                      bgTheme === key ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.08)",
                    color: "inherit",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} style={{ opacity: bgTheme === key ? 1 : 0.75 }} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Showcase Area */}
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <button
                onClick={() => setActiveTab("panel")}
                style={{
                  padding: "9px 20px",
                  borderRadius: 20,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  background:
                    activeTab === "panel" ? "rgba(56, 189, 248, 0.32)" : "rgba(255,255,255,0.08)",
                  color: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                UI Glass Panels (CSS Substrate)
              </button>
              <button
                onClick={() => setActiveTab("lens")}
                style={{
                  padding: "9px 20px",
                  borderRadius: 20,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  background:
                    activeTab === "lens" ? "rgba(56, 189, 248, 0.32)" : "rgba(255,255,255,0.08)",
                  color: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                Interactive WebGL Lens (Draggable)
              </button>
            </div>

            {activeTab === "panel" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Hero Feature Card */}
                <LiquidGlassPanel
                  preset={selectedPreset}
                  config={config}
                  theme={theme}
                  style={{ padding: "38px 36px" }}
                >
                  <h1
                    style={{
                      fontSize: 34,
                      marginBottom: 14,
                      fontWeight: 800,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Physical Optical Glass in Pure Web Standards
                  </h1>
                  <p
                    style={{
                      fontSize: 16.5,
                      opacity: 0.9,
                      lineHeight: 1.65,
                      maxWidth: 640,
                      marginBottom: 24,
                    }}
                  >
                    Biconvex SDF bevel heightfields, Snell's law optical refraction, RGB channel
                    dispersion, and Blinn-Phong specular highlights. Zero DOM serialization stutter,
                    locked 120 FPS.
                  </p>
                  <div style={{ display: "flex", gap: 16 }}>
                    <LiquidGlassPanel
                      as="button"
                      preset="pill"
                      interactive
                      onClick={() => setActiveTab("lens")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 28px",
                        color: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Sparkles size={16} />
                      Explore Shaders
                    </LiquidGlassPanel>
                    <LiquidGlassPanel
                      as="button"
                      preset={selectedPreset}
                      interactive
                      onClick={() => setActiveModal("docs")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 28px",
                        color: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <BookOpen size={16} />
                      Documentation
                    </LiquidGlassPanel>
                  </div>
                </LiquidGlassPanel>

                {/* 3-Column Glass Cards Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 18,
                  }}
                >
                  <LiquidGlassPanel
                    preset={selectedPreset}
                    config={config}
                    theme={theme}
                    style={{ padding: 24 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38bdf8",
                        marginBottom: 14,
                      }}
                    >
                      <Gem size={24} />
                    </div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>
                      Zero Overhead
                    </h3>
                    <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.55 }}>
                      Pure CSS hardware acceleration and SVG meniscus filters for UI cards without
                      WebGL context exhaustion.
                    </p>
                  </LiquidGlassPanel>

                  <LiquidGlassPanel
                    preset={selectedPreset}
                    config={config}
                    theme={theme}
                    style={{ padding: 24 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(236, 72, 153, 0.15)",
                        color: "#ec4899",
                        marginBottom: 14,
                      }}
                    >
                      <Rainbow size={24} />
                    </div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>
                      RGB Dispersion
                    </h3>
                    <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.55 }}>
                      True chromatic fringe aberration splitting along normal vectors at curved
                      glass bevel rims.
                    </p>
                  </LiquidGlassPanel>

                  <LiquidGlassPanel
                    preset={selectedPreset}
                    config={config}
                    theme={theme}
                    style={{ padding: 24 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(250, 204, 21, 0.15)",
                        color: "#facc15",
                        marginBottom: 14,
                      }}
                    >
                      <Zap size={24} />
                    </div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>Any JS App</h3>
                    <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.55 }}>
                      Zero runtime dependencies for vanilla JS, Vue, Svelte, and a first-class React
                      adapter export.
                    </p>
                  </LiquidGlassPanel>
                </div>
              </div>
            ) : (
              /* WebGL Interactive Lens Area */
              <div
                style={{
                  position: "relative",
                  height: 550,
                  borderRadius: 24,
                  border:
                    theme === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "1px solid rgba(0, 0, 0, 0.12)",
                  overflow: "hidden",
                  boxShadow:
                    theme === "dark"
                      ? "inset 0 0 100px rgba(0,0,0,0.5)"
                      : "inset 0 0 80px rgba(0,0,0,0.06)",
                }}
              >
                {/* Floating Lens Stage Scene & Image Selector */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    right: 12,
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 16,
                    background:
                      theme === "dark" ? "rgba(9, 13, 22, 0.82)" : "rgba(255, 255, 255, 0.88)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border:
                      theme === "dark"
                        ? "1px solid rgba(255, 255, 255, 0.12)"
                        : "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  {/* Left: Preset Scenes */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        opacity: 0.75,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginRight: 4,
                      }}
                    >
                      <ImageIcon size={12} /> Stage:
                    </span>
                    {[
                      { key: "pattern", label: "Optics Pattern", Icon: Waves },
                      { key: "poster", label: "Editorial Poster", Icon: FileText },
                      { key: "architecture", label: "Architecture", Icon: Building2 },
                      { key: "art", label: "Chromatic Art", Icon: Palette },
                      { key: "photo", label: "Photo Scene", Icon: Sparkles },
                    ].map(({ key, label, Icon }) => {
                      const isActive = lensScene === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setLensScene(key as LensSceneKey)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 10,
                            fontSize: 11.5,
                            border: "none",
                            cursor: "pointer",
                            fontWeight: isActive ? 600 : 400,
                            background: isActive
                              ? "rgba(56, 189, 248, 0.35)"
                              : theme === "dark"
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.05)",
                            color: "inherit",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Icon size={12} style={{ opacity: isActive ? 1 : 0.75 }} />
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Upload Custom Image */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleCustomImageUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload custom image from your device"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 12px",
                        borderRadius: 10,
                        fontSize: 11.5,
                        border:
                          theme === "dark"
                            ? "1px solid rgba(56, 189, 248, 0.4)"
                            : "1px solid rgba(2, 132, 199, 0.4)",
                        cursor: "pointer",
                        fontWeight: 600,
                        background:
                          lensScene === "custom"
                            ? "rgba(56, 189, 248, 0.35)"
                            : theme === "dark"
                              ? "rgba(56, 189, 248, 0.15)"
                              : "rgba(2, 132, 199, 0.1)",
                        color: "inherit",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Upload size={12} />
                      {lensScene === "custom" && customImage
                        ? "Custom Image Active"
                        : "Upload Image"}
                    </button>
                    {lensScene === "custom" && (
                      <button
                        onClick={() => {
                          setLensScene("pattern");
                          setCustomImage(null);
                        }}
                        title="Reset to patterns"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "none",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "inherit",
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Backdrop Stage Canvas that the lens physically refracts */}
                <canvas
                  id="lens-stage-canvas"
                  ref={stageCanvasRef}
                  width={800}
                  height={550}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />

                {/* Draggable WebGL Lens (True Snell Refraction over the stage) */}
                <LiquidGlassLens
                  preset={selectedPreset === "magnifier" ? "magnifier" : "default"}
                  config={config}
                  backgroundSelector="#lens-stage-canvas"
                  background={`${bgTheme}-${theme}-${lensScene}-${customImage ? "cust" : ""}`}
                  draggable={true}
                  initialPosition={{ x: 260, y: 150 }}
                  style={{
                    position: "absolute",
                    width: 240,
                    height: 240,
                    borderRadius: `${config.cornerRadius}px`,
                    zIndex: 10,
                  }}
                />
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div
            style={{
              height: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <LiquidGlassPanel
              preset="default"
              theme={theme}
              style={{
                height: 600,
                borderRadius: 24,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                padding: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px 14px",
                  borderBottom:
                    theme === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(0, 0, 0, 0.06)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sliders size={16} style={{ color: "#38bdf8" }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Optical Parameters</h3>
                </div>
                <button
                  onClick={resetPreset}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: "inherit",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                  }}
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
              </div>

              {/* Scrollable Sliders & Presets Area with Internal Glass Scrollbar */}
              <div
                className="glass-scrollbar"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  padding: "16px 20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Presets */}
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Curated Presets
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    {(Object.keys(GLASS_PRESETS) as GlassPresetKey[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePresetChange(p)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 10,
                          fontSize: 12,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: selectedPreset === p ? 600 : 400,
                          background:
                            selectedPreset === p
                              ? "rgba(56, 189, 248, 0.35)"
                              : "rgba(255,255,255,0.08)",
                          color: "inherit",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bevel Mode Toggle */}
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Bevel Geometry Mode
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    <button
                      onClick={() => updateParam("bevelMode", 0)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 10,
                        fontSize: 12,
                        border: "none",
                        cursor: "pointer",
                        background:
                          config.bevelMode === 0
                            ? "rgba(56, 189, 248, 0.35)"
                            : "rgba(255,255,255,0.08)",
                        color: "inherit",
                      }}
                    >
                      0: Biconvex Pill
                    </button>
                    <button
                      onClick={() => updateParam("bevelMode", 1)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 10,
                        fontSize: 12,
                        border: "none",
                        cursor: "pointer",
                        background:
                          config.bevelMode === 1
                            ? "rgba(56, 189, 248, 0.35)"
                            : "rgba(255,255,255,0.08)",
                        color: "inherit",
                      }}
                    >
                      1: Dome Magnifier
                    </button>
                  </div>
                </div>

                {/* All 16 Optical Sliders Grouped */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 }}
                >
                  {[
                    // Refraction & Optics
                    { label: "Blur Amount", key: "blurAmount", min: 0, max: 1, step: 0.01 },
                    { label: "Refraction Strength", key: "refraction", min: 0, max: 2, step: 0.02 },
                    {
                      label: "Chromatic Aberration",
                      key: "chromAberration",
                      min: 0,
                      max: 0.5,
                      step: 0.01,
                    },
                    { label: "Surface Distortion", key: "distortion", min: 0, max: 1, step: 0.01 },

                    // Lighting & Specular
                    { label: "Edge Highlight", key: "edgeHighlight", min: 0, max: 2, step: 0.05 },
                    { label: "Specular Glints", key: "specular", min: 0, max: 1, step: 0.05 },
                    { label: "Fresnel Falloff", key: "fresnel", min: 0, max: 2, step: 0.05 },

                    // Geometry & Bevel
                    { label: "Corner Radius", key: "cornerRadius", min: 0, max: 100, step: 1 },
                    { label: "Bevel Depth (zRadius)", key: "zRadius", min: 0, max: 100, step: 1 },
                    { label: "Panel Opacity", key: "opacity", min: 0, max: 1, step: 0.02 },

                    // Color & Exposure
                    { label: "Color Saturation", key: "saturation", min: -1, max: 1, step: 0.05 },
                    {
                      label: "Optical Tint Strength",
                      key: "tintStrength",
                      min: 0,
                      max: 1,
                      step: 0.02,
                    },
                    {
                      label: "Exposure / Brightness",
                      key: "brightness",
                      min: -0.5,
                      max: 0.5,
                      step: 0.02,
                    },

                    // Shadow System
                    { label: "Shadow Spread", key: "shadowSpread", min: 0, max: 50, step: 1 },
                    { label: "Shadow Opacity", key: "shadowOpacity", min: 0, max: 1, step: 0.02 },
                    { label: "Shadow Offset Y", key: "shadowOffsetY", min: -10, max: 30, step: 1 },
                  ].map(({ label, key, min, max, step }) => (
                    <div key={key}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12.5,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ opacity: 0.9 }}>{label}</span>
                        <span style={{ opacity: 0.6, fontFamily: "monospace" }}>
                          {typeof (config as any)[key] === "number"
                            ? ((config as any)[key] as number).toFixed(step < 1 ? 2 : 0)
                            : (config as any)[key]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={(config as any)[key]}
                        onChange={(e) =>
                          updateParam(key as keyof GlassConfig, parseFloat(e.target.value))
                        }
                        style={{
                          width: "100%",
                          accentColor: "#38bdf8",
                          cursor: "pointer",
                          height: 4,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </LiquidGlassPanel>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE DOCUMENTATION & GET STARTED MODAL
         ========================================================================= */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setActiveModal(null)}
        >
          <LiquidGlassPanel
            preset="crystal"
            theme={theme}
            style={{
              maxWidth: 720,
              width: "100%",
              maxHeight: "85vh",
              borderRadius: 24,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              padding: 0,
              boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header with Title and Close Button (Pinned) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 28px 18px",
                borderBottom:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "1px solid rgba(0, 0, 0, 0.06)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(56, 189, 248, 0.15)",
                    color: "#38bdf8",
                    flexShrink: 0,
                  }}
                >
                  {activeModal === "quickstart" ? <Rocket size={24} /> : <BookOpen size={24} />}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                    {activeModal === "quickstart"
                      ? "Getting Started with liquid-glass-fx"
                      : "Documentation & API Reference"}
                  </h2>
                  <p style={{ fontSize: 12.5, opacity: 0.7, margin: "3px 0 0" }}>
                    Physical optical glass in pure web standards (zero runtime dependencies)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s ease",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Content with Sleek Internal Glass Scrollbar */}
            <div
              className="glass-scrollbar"
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "24px 28px 28px",
              }}
            >
              {/* Quickstart Tab Content */}
              {activeModal === "quickstart" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* 1. Install Box */}
                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        opacity: 0.7,
                      }}
                    >
                      1. Package Installation
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(0,0,0,0.35)",
                        padding: "12px 18px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        marginTop: 8,
                        fontFamily: "monospace",
                        fontSize: 14,
                      }}
                    >
                      <span>npm install liquid-glass-fx</span>
                      <button
                        onClick={copyInstallCommand}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: copied ? "#10b981" : "rgba(56, 189, 248, 0.25)",
                          border: "1px solid rgba(56, 189, 248, 0.4)",
                          color: "inherit",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {copied ? (
                          <>
                            <Check size={13} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2. React Example */}
                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        opacity: 0.7,
                      }}
                    >
                      2. React Component Usage
                    </label>
                    <pre
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        padding: "16px 20px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        fontFamily: "monospace",
                        fontSize: 13,
                        lineHeight: 1.6,
                        marginTop: 8,
                        overflowX: "auto",
                      }}
                    >
                      {`import { LiquidGlassPanel, LiquidGlassLens } from "liquid-glass-fx/react";

export function GlassHero() {
  return (
    <>
      {/* Hardware-accelerated UI card */}
      <LiquidGlassPanel preset="crystal" style={{ padding: 28, borderRadius: 24 }}>
        <h1>Liquid Optics</h1>
      </LiquidGlassPanel>

      {/* 120 FPS Draggable Snell's law WebGL lens */}
      <LiquidGlassLens preset="magnifier" draggable={true} />
    </>
  );
}`}
                    </pre>
                  </div>

                  {/* 3. Vanilla JS Example */}
                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        opacity: 0.7,
                      }}
                    >
                      3. Vanilla JS / Vue / Svelte Usage
                    </label>
                    <pre
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        padding: "16px 20px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        fontFamily: "monospace",
                        fontSize: 13,
                        lineHeight: 1.6,
                        marginTop: 8,
                        overflowX: "auto",
                      }}
                    >
                      {`import { createLiquidGlassPanel, createLiquidGlassLens } from "liquid-glass-fx";

// Bind to any DOM element
createLiquidGlassPanel(document.querySelector("#my-card"), { preset: "crystal" });
createLiquidGlassLens(document.querySelector("#my-lens"), { draggable: true });`}
                    </pre>
                  </div>

                  {/* Modal Footer Actions */}
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button
                      onClick={() => setActiveModal("docs")}
                      style={{
                        flex: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "12px",
                        borderRadius: 12,
                        border: "none",
                        background: "rgba(56, 189, 248, 0.35)",
                        color: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <BookOpen size={16} />
                      View Full API Reference
                    </button>
                    <a
                      href="https://github.com/davidpconqueror/liquid-glass-fx"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "12px 20px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.08)",
                        color: "inherit",
                        textDecoration: "none",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      GitHub <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {/* Documentation Tab Content */}
              {activeModal === "docs" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Package Exports */}
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                      Dual Package Exports
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          padding: "14px 16px",
                          borderRadius: 12,
                        }}
                      >
                        <strong style={{ fontSize: 13.5, color: "#38bdf8" }}>
                          liquid-glass-fx (Core)
                        </strong>
                        <p
                          style={{
                            fontSize: 12.5,
                            opacity: 0.8,
                            margin: "6px 0 0",
                            lineHeight: 1.5,
                          }}
                        >
                          Vanilla JS & CSS substrate (&lt; 8 KB, zero runtime dependencies). Exports{" "}
                          <code>createLiquidGlassPanel</code>, <code>createLiquidGlassLens</code>,
                          and presets.
                        </p>
                      </div>
                      <div
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          padding: "14px 16px",
                          borderRadius: 12,
                        }}
                      >
                        <strong style={{ fontSize: 13.5, color: "#38bdf8" }}>
                          liquid-glass-fx/react
                        </strong>
                        <p
                          style={{
                            fontSize: 12.5,
                            opacity: 0.8,
                            margin: "6px 0 0",
                            lineHeight: 1.5,
                          }}
                        >
                          First-class React 18 & 19 components with full TypeScript declarations:{" "}
                          <code>&lt;LiquidGlassPanel /&gt;</code> and{" "}
                          <code>&lt;LiquidGlassLens /&gt;</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6 Curated Presets */}
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                      6 Curated Optical Presets
                    </h3>
                    <div
                      style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}
                    >
                      {[
                        { name: "default", desc: "Balanced everyday frosted glass for UI layouts" },
                        { name: "crystal", desc: "Ultra-sharp biconvex glass with chromatic rim" },
                        { name: "frosted", desc: "Heavy Gaussian diffusion with low specular" },
                        { name: "obsidian", desc: "High-contrast dark smoky optical glass" },
                        { name: "pill", desc: "Fully rounded pill button meniscus" },
                        { name: "magnifier", desc: "High-magnification Dome lens mode" },
                      ].map((p) => (
                        <div
                          key={p.name}
                          style={{
                            background: "rgba(0,0,0,0.3)",
                            padding: "12px 14px",
                            borderRadius: 10,
                          }}
                        >
                          <strong style={{ fontSize: 13, textTransform: "capitalize" }}>
                            {p.name}
                          </strong>
                          <p style={{ fontSize: 11.5, opacity: 0.75, margin: "4px 0 0" }}>
                            {p.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* The 16 Parameters Summary */}
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                      Optical Parameter Reference
                    </h3>
                    <div
                      style={{
                        maxHeight: 220,
                        overflowY: "auto",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 12,
                          textAlign: "left",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.1)",
                              opacity: 0.7,
                            }}
                          >
                            <th style={{ padding: "8px 12px" }}>Parameter</th>
                            <th style={{ padding: "8px 12px" }}>Range</th>
                            <th style={{ padding: "8px 12px" }}>Effect</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { p: "blurAmount", r: "0.0 - 1.0", d: "Frosted Gaussian blur radius" },
                            {
                              p: "refraction",
                              r: "0.0 - 2.0",
                              d: "Snell's law ray deflection strength",
                            },
                            {
                              p: "chromAberration",
                              r: "0.0 - 0.2",
                              d: "RGB prismatic splitting at rim",
                            },
                            {
                              p: "edgeHighlight",
                              r: "0.0 - 2.0",
                              d: "Meniscus crest specular highlight",
                            },
                            {
                              p: "specular",
                              r: "0.0 - 1.0",
                              d: "2-light Blinn-Phong studio glints",
                            },
                            { p: "fresnel", r: "0.0 - 2.0", d: "Grazing angle reflection falloff" },
                            { p: "zRadius", r: "2 - 80px", d: "Bevel heightfield depth" },
                            {
                              p: "bevelMode",
                              r: "0 or 1",
                              d: "0: Biconvex Pill | 1: Dome Magnifier",
                            },
                            { p: "distortion", r: "0.0 - 1.0", d: "Micro-surface liquid noise" },
                            {
                              p: "cornerRadius",
                              r: "0 - 9999px",
                              d: "SDF rounded-rectangle radius",
                            },
                          ].map((row) => (
                            <tr
                              key={row.p}
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              <td
                                style={{
                                  padding: "6px 12px",
                                  fontFamily: "monospace",
                                  color: "#38bdf8",
                                }}
                              >
                                {row.p}
                              </td>
                              <td style={{ padding: "6px 12px", opacity: 0.75 }}>{row.r}</td>
                              <td style={{ padding: "6px 12px", opacity: 0.85 }}>{row.d}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    <button
                      onClick={() => setActiveModal("quickstart")}
                      style={{
                        flex: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "12px",
                        borderRadius: 12,
                        border: "none",
                        background: "rgba(56, 189, 248, 0.35)",
                        color: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Rocket size={16} />
                      Quick Start & Installation
                    </button>
                    <a
                      href="https://github.com/davidpconqueror/liquid-glass-fx"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "12px 24px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.08)",
                        color: "inherit",
                        textDecoration: "none",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      View on GitHub <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </LiquidGlassPanel>
        </div>
      )}
    </div>
  );
}
