import React, { useState } from "react";
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

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [bgTheme, setBgTheme] = useState<BackgroundKey>("aurora");
  const [selectedPreset, setSelectedPreset] = useState<GlassPresetKey>("crystal");
  const [config, setConfig] = useState<GlassConfig>(GLASS_PRESETS.crystal);
  const [activeTab, setActiveTab] = useState<"panel" | "lens">("panel");

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
              style={{
                padding: "8px 20px",
                color: "inherit",
                fontWeight: 600,
                border: "none",
              }}
            >
              Get Started
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
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <button
                onClick={() => setActiveTab("panel")}
                style={{
                  padding: "10px 22px",
                  borderRadius: 24,
                  border: "none",
                  fontWeight: 600,
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
                  padding: "10px 22px",
                  borderRadius: 24,
                  border: "none",
                  fontWeight: 600,
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
                      style={{ padding: "12px 28px", color: "inherit", fontWeight: 600 }}
                    >
                      Explore Shaders
                    </LiquidGlassPanel>
                    <LiquidGlassPanel
                      as="button"
                      preset={selectedPreset}
                      interactive
                      style={{ padding: "12px 28px", color: "inherit", fontWeight: 600 }}
                    >
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
                  height: 540,
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background:
                    bgTheme === "blueprint"
                      ? "repeating-linear-gradient(0deg, rgba(56,189,248,0.2) 0px, rgba(56,189,248,0.2) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(56,189,248,0.2) 0px, rgba(56,189,248,0.2) 1px, transparent 1px, transparent 32px)"
                      : bgTheme === "fluid"
                      ? "radial-gradient(circle at 30% 40%, #ec4899 0%, #8b5cf6 35%, #06b6d4 70%, #10b981 100%)"
                      : bgTheme === "checker"
                      ? "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 40px 40px"
                      : "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #064e3b 100%)",
                  overflow: "hidden",
                  padding: 32,
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ userSelect: "none", pointerEvents: "none", maxWidth: 460 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 12,
                      background: "rgba(56, 189, 248, 0.2)",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    120 FPS WebGL Engine
                  </span>
                  <h2 style={{ fontSize: 28, marginBottom: 12, fontWeight: 800 }}>
                    Draggable Refraction Lens
                  </h2>
                  <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.6 }}>
                    Grab and drag the optical lens across the backdrop. Watch real-time Snell's law
                    light ray bending, RGB chromatic dispersion, and studio Blinn-Phong specular glints!
                  </p>
                </div>

                {/* Draggable WebGL Lens (True Snell Refraction) */}
                <LiquidGlassLens
                  preset={selectedPreset === "magnifier" ? "magnifier" : "default"}
                  config={config}
                  background={bgTheme}
                  draggable={true}
                  initialPosition={{ x: 140, y: 160 }}
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: `${config.cornerRadius}px`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Controls Panel (Sticky & Fully Scrollable) */}
          <div
            style={{
              position: "sticky",
              top: 24,
              maxHeight: "calc(100vh - 48px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <LiquidGlassPanel
              preset="default"
              theme={theme}
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                height: "100%",
                maxHeight: "calc(100vh - 48px)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Optical Parameters</h3>
                <button
                  onClick={resetPreset}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: "inherit",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Reset
                </button>
              </div>

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
            </LiquidGlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
