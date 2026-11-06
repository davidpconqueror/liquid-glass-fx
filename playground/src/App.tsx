import React, { useState, useEffect, useRef } from "react";
import {
  LiquidGlassPanel,
  LiquidGlassLens,
} from "../../src/react";
import {
  GLASS_PRESETS,
  type GlassPresetKey,
  type GlassConfig,
} from "../../src";

type BackgroundKey = "aurora" | "blueprint" | "fluid" | "neon" | "checker";

function drawStageBackdrop(
  canvas: HTMLCanvasElement,
  bgTheme: BackgroundKey,
  theme: "dark" | "light"
) {
  const dpr = window.devicePixelRatio || 1;
  const parent = canvas.parentElement;
  const cssW = parent?.clientWidth || canvas.clientWidth || 800;
  const cssH = parent?.clientHeight || canvas.clientHeight || 540;
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

  ctx.fillStyle = isDark ? "#070b14" : "#f8fafc";
  ctx.fillRect(0, 0, w, h);

  if (bgTheme === "checker") {
    const size = 36;
    const c1 = isDark ? "#090d16" : "#ffffff";
    const c2 = isDark ? "#1e293b" : "#e2e8f0";
    for (let x = 0; x < w; x += size) {
      for (let y = 0; y < h; y += size) {
        ctx.fillStyle = ((x / size) + (y / size)) % 2 === 0 ? c1 : c2;
        ctx.fillRect(x, y, size, size);
      }
    }
    const grad = ctx.createLinearGradient(0, h * 0.45, w, h * 0.55);
    grad.addColorStop(0, "rgba(236, 72, 153, 0.85)");
    grad.addColorStop(0.25, "rgba(139, 92, 246, 0.85)");
    grad.addColorStop(0.5, "rgba(59, 130, 246, 0.85)");
    grad.addColorStop(0.75, "rgba(16, 185, 129, 0.85)");
    grad.addColorStop(1, "rgba(245, 158, 11, 0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.42, w, 32);

    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.6)" : "rgba(14, 165, 233, 0.6)";
    ctx.lineWidth = 2;
    for (let r = 50; r <= 250; r += 50) {
      ctx.beginPath();
      ctx.arc(w * 0.55, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (bgTheme === "blueprint") {
    ctx.fillStyle = isDark ? "#030816" : "#e2e8f0";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.3)" : "rgba(14, 165, 233, 0.35)";
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
    ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.55, h * 0.5, 130, 0, Math.PI * 2);
    ctx.arc(w * 0.55, h * 0.5, 65, 0, Math.PI * 2);
    ctx.stroke();
  } else if (bgTheme === "fluid") {
    ctx.fillStyle = isDark ? "#090d16" : "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.45, c: "#ec4899" },
      { x: 0.75, y: 0.35, r: 0.5, c: "#06b6d4" },
      { x: 0.5, y: 0.75, r: 0.45, c: "#8b5cf6" },
      { x: 0.85, y: 0.8, r: 0.4, c: "#10b981" },
    ];
    for (const b of blobs) {
      const g = ctx.createRadialGradient(w * b.x, h * b.y, 0, w * b.x, h * b.y, w * b.r);
      g.addColorStop(0, b.c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  } else if (bgTheme === "neon") {
    ctx.fillStyle = isDark ? "#070b14" : "#f1f5f9";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.25);
    ctx.lineTo(w, h * 0.4);
    ctx.stroke();
    ctx.strokeStyle = "#06b6d4";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.lineTo(w, h * 0.55);
    ctx.stroke();
  } else {
    // aurora
    const g1 = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.4);
    g1.addColorStop(0, "rgba(168, 85, 247, 0.8)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 0, w * 0.7, h * 0.6, w * 0.45);
    g2.addColorStop(0, "rgba(16, 185, 129, 0.75)");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
  }

  // Draw optical test typography & graphics right on the backdrop!
  ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
  ctx.font = "800 24px system-ui, -apple-system, sans-serif";
  ctx.fillText("PHYSICAL OPTICAL LENS", 36, 60);

  ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(15, 23, 42, 0.75)";
  ctx.font = "600 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("Snell's Law: n₁·sin(θ₁) = n₂·sin(θ₂)  |  RGB Dispersion  |  120 FPS", 36, 88);

  ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.9)" : "rgba(14, 165, 233, 0.9)";
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
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const copyInstallCommand = () => {
    try {
      navigator.clipboard.writeText("npm install liquid-glass-fx");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (activeTab === "lens" && stageCanvasRef.current) {
      drawStageBackdrop(stageCanvasRef.current, bgTheme, theme);
      const handleResize = () => {
        if (stageCanvasRef.current) {
          drawStageBackdrop(stageCanvasRef.current, bgTheme, theme);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [activeTab, bgTheme, theme]);

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
            ? "#e2e8f0"
            : "#f8fafc",
      }}
    >
      {/* =========================================================================
          BACKGROUND LAYER SYSTEM (Shows off physical glass refraction & blur)
         ========================================================================= */}

      {/* 1. Cyber Aurora Mesh with Animated High-Contrast Blobs */}
      {bgTheme === "aurora" && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          {/* Dot Matrix Pattern for sharp refraction edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? "radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)"
                  : "radial-gradient(rgba(15, 23, 42, 0.16) 1px, transparent 1px)",
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
                  : "radial-gradient(circle, rgba(192, 132, 252, 0.5) 0%, rgba(129, 140, 248, 0.35) 45%, transparent 70%)",
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
                  : "radial-gradient(circle, rgba(52, 211, 153, 0.45) 0%, rgba(34, 211, 238, 0.3) 50%, transparent 70%)",
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
                  : "radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(251, 146, 60, 0.3) 50%, transparent 70%)",
              filter: "blur(45px)",
            }}
          />
        </div>
      )}

      {/* 2. Engineering Blueprint & Telemetry Grid (Lines bend dramatically under glass) */}
      {bgTheme === "blueprint" && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          {/* 36px Coordinate Blueprint Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? `linear-gradient(rgba(56, 189, 248, 0.18) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(56, 189, 248, 0.18) 1px, transparent 1px)`
                  : `linear-gradient(rgba(14, 165, 233, 0.22) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(14, 165, 233, 0.22) 1px, transparent 1px)`,
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
              border: "1px dashed rgba(56, 189, 248, 0.35)",
              boxShadow: "0 0 0 80px rgba(56, 189, 248, 0.05), 0 0 0 160px rgba(56, 189, 248, 0.03)",
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
              background: "radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
      )}

      {/* 3. Vibrant Fluid 3D Rainbow Ribbon (High dynamic range optical prism) */}
      {bgTheme === "fluid" && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
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
                  : `radial-gradient(circle at 20% 30%, #f472b6 0%, transparent 35%),
                     radial-gradient(circle at 80% 25%, #38bdf8 0%, transparent 35%),
                     radial-gradient(circle at 40% 80%, #a78bfa 0%, transparent 40%),
                     radial-gradient(circle at 75% 75%, #fbbf24 0%, transparent 35%),
                     radial-gradient(circle at 50% 50%, #34d399 0%, transparent 40%)`,
              filter: "blur(40px)",
              opacity: theme === "dark" ? 0.75 : 0.65,
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
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
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
                "linear-gradient(rgba(236, 72, 153, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.12) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>
      )}

      {/* 5. Optical Checkerboard & Contrast Bars (Maximum refraction contrast) */}
      {bgTheme === "checker" && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                theme === "dark"
                  ? "repeating-conic-gradient(#1e293b 0% 25%, #070b14 0% 50%)"
                  : "repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%)",
              backgroundSize: "48px 48px",
              opacity: 0.75,
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
              opacity: 0.6,
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>✨</span>
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
              v0.1.0
            </span>
          </div>

          {/* Theme & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={toggleTheme}
              style={{
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
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <LiquidGlassPanel
              as="button"
              preset="pill"
              interactive={true}
              onClick={() => setActiveModal("quickstart")}
              style={{
                padding: "8px 20px",
                color: "inherit",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Get Started 🚀
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
            border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>
              Backdrop Style:
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "aurora", label: "🌈 Cyber Aurora" },
                { key: "fluid", label: "🎨 3D Fluid Rainbow" },
                { key: "blueprint", label: "📐 Blueprint Grid" },
                { key: "neon", label: "⚡ Neon Laser" },
                { key: "checker", label: "🏁 Optical Checker" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setBgTheme(key as BackgroundKey)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 14,
                    fontSize: 12.5,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: bgTheme === key ? 600 : 400,
                    background:
                      bgTheme === key
                        ? "rgba(56, 189, 248, 0.35)"
                        : "rgba(255, 255, 255, 0.08)",
                    color: "inherit",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <span style={{ fontSize: 12, opacity: 0.65 }}>
            Switch backdrops to see Snell refraction & chromatic edge splitting
          </span>
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
                  <h1 style={{ fontSize: 34, marginBottom: 14, fontWeight: 800, letterSpacing: "-0.5px" }}>
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
                      style={{ padding: "12px 28px", color: "inherit", fontWeight: 600, cursor: "pointer" }}
                    >
                      Explore Shaders ⚡
                    </LiquidGlassPanel>
                    <LiquidGlassPanel
                      as="button"
                      preset={selectedPreset}
                      interactive
                      onClick={() => setActiveModal("docs")}
                      style={{ padding: "12px 28px", color: "inherit", fontWeight: 600, cursor: "pointer" }}
                    >
                      Documentation 📚
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
                    <div style={{ fontSize: 30, marginBottom: 10 }}>💎</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>Zero Overhead</h3>
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
                    <div style={{ fontSize: 30, marginBottom: 10 }}>🌈</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>RGB Dispersion</h3>
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
                    <div style={{ fontSize: 30, marginBottom: 10 }}>⚡</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>Any JS App</h3>
                    <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.55 }}>
                      Zero runtime dependencies for vanilla JS, Vue, Svelte, and a first-class
                      React adapter export.
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
                  border: "1px solid rgba(255,255,255,0.15)",
                  overflow: "hidden",
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
                }}
              >
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
                  <span style={{ fontSize: 16 }}>⚙️</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Optical Parameters</h3>
                </div>
                <button
                  onClick={resetPreset}
                  style={{
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
                <label style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Curated Presets
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 8 }}>
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
                <label style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Bevel Geometry Mode
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 }}>
                {[
                  // Refraction & Optics
                  { label: "Blur Amount", key: "blurAmount", min: 0, max: 1, step: 0.01 },
                  { label: "Refraction Strength", key: "refraction", min: 0, max: 2, step: 0.02 },
                  { label: "Chromatic Aberration", key: "chromAberration", min: 0, max: 0.5, step: 0.01 },
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
                  { label: "Optical Tint Strength", key: "tintStrength", min: 0, max: 1, step: 0.02 },
                  { label: "Exposure / Brightness", key: "brightness", min: -0.5, max: 0.5, step: 0.02 },

                  // Shadow System
                  { label: "Shadow Spread", key: "shadowSpread", min: 0, max: 50, step: 1 },
                  { label: "Shadow Opacity", key: "shadowOpacity", min: 0, max: 1, step: 0.02 },
                  { label: "Shadow Offset Y", key: "shadowOffsetY", min: -10, max: 30, step: 1 },
                ].map(({ label, key, min, max, step }) => (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
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
                      onChange={(e) => updateParam(key as keyof GlassConfig, parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer", height: 4 }}
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
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>
                  {activeModal === "quickstart" ? "🚀" : "📚"}
                </span>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                    {activeModal === "quickstart" ? "Getting Started with liquid-glass-fx" : "Documentation & API Reference"}
                  </h2>
                  <p style={{ fontSize: 12.5, opacity: 0.7, margin: "3px 0 0" }}>
                    Physical optical glass in pure web standards (zero runtime dependencies)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  color: "inherit",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s ease",
                }}
              >
                ✕
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
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.7 }}>
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
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* 2. React Example */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.7 }}>
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
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.7 }}>
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
                      padding: "12px",
                      borderRadius: 12,
                      border: "none",
                      background: "rgba(56, 189, 248, 0.35)",
                      color: "inherit",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View Full API Reference 📚
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
                    GitHub ↗
                  </a>
                </div>
              </div>
            )}

            {/* Documentation Tab Content */}
            {activeModal === "docs" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Package Exports */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Dual Package Exports</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px 16px", borderRadius: 12 }}>
                      <strong style={{ fontSize: 13.5, color: "#38bdf8" }}>liquid-glass-fx (Core)</strong>
                      <p style={{ fontSize: 12.5, opacity: 0.8, margin: "6px 0 0", lineHeight: 1.5 }}>
                        Vanilla JS & CSS substrate (&lt; 8 KB, zero runtime dependencies). Exports <code>createLiquidGlassPanel</code>, <code>createLiquidGlassLens</code>, and presets.
                      </p>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px 16px", borderRadius: 12 }}>
                      <strong style={{ fontSize: 13.5, color: "#38bdf8" }}>liquid-glass-fx/react</strong>
                      <p style={{ fontSize: 12.5, opacity: 0.8, margin: "6px 0 0", lineHeight: 1.5 }}>
                        First-class React 18 & 19 components with full TypeScript declarations: <code>&lt;LiquidGlassPanel /&gt;</code> and <code>&lt;LiquidGlassLens /&gt;</code>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6 Curated Presets */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>6 Curated Optical Presets</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[
                      { name: "default", desc: "Balanced everyday frosted glass for UI layouts" },
                      { name: "crystal", desc: "Ultra-sharp biconvex glass with chromatic rim" },
                      { name: "frosted", desc: "Heavy Gaussian diffusion with low specular" },
                      { name: "obsidian", desc: "High-contrast dark smoky optical glass" },
                      { name: "pill", desc: "Fully rounded pill button meniscus" },
                      { name: "magnifier", desc: "High-magnification Dome lens mode" },
                    ].map((p) => (
                      <div key={p.name} style={{ background: "rgba(0,0,0,0.3)", padding: "12px 14px", borderRadius: 10 }}>
                        <strong style={{ fontSize: 13, textTransform: "capitalize" }}>{p.name}</strong>
                        <p style={{ fontSize: 11.5, opacity: 0.75, margin: "4px 0 0" }}>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The 16 Parameters Summary */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Optical Parameter Reference</h3>
                  <div
                    style={{
                      maxHeight: 220,
                      overflowY: "auto",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", opacity: 0.7 }}>
                          <th style={{ padding: "8px 12px" }}>Parameter</th>
                          <th style={{ padding: "8px 12px" }}>Range</th>
                          <th style={{ padding: "8px 12px" }}>Effect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { p: "blurAmount", r: "0.0 - 1.0", d: "Frosted Gaussian blur radius" },
                          { p: "refraction", r: "0.0 - 2.0", d: "Snell's law ray deflection strength" },
                          { p: "chromAberration", r: "0.0 - 0.2", d: "RGB prismatic splitting at rim" },
                          { p: "edgeHighlight", r: "0.0 - 2.0", d: "Meniscus crest specular highlight" },
                          { p: "specular", r: "0.0 - 1.0", d: "2-light Blinn-Phong studio glints" },
                          { p: "fresnel", r: "0.0 - 2.0", d: "Grazing angle reflection falloff" },
                          { p: "zRadius", r: "2 - 80px", d: "Bevel heightfield depth" },
                          { p: "bevelMode", r: "0 or 1", d: "0: Biconvex Pill | 1: Dome Magnifier" },
                          { p: "distortion", r: "0.0 - 1.0", d: "Micro-surface liquid noise" },
                          { p: "cornerRadius", r: "0 - 9999px", d: "SDF rounded-rectangle radius" },
                        ].map((row) => (
                          <tr key={row.p} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <td style={{ padding: "6px 12px", fontFamily: "monospace", color: "#38bdf8" }}>{row.p}</td>
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
                      padding: "12px",
                      borderRadius: 12,
                      border: "none",
                      background: "rgba(56, 189, 248, 0.35)",
                      color: "inherit",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Quick Start & Installation 🚀
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
                    View on GitHub ↗
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
