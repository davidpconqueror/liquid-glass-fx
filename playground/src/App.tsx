import React, { useState } from "react";
import {
  LiquidGlassPanel,
  LiquidGlassLens,
} from "../../src/react";
import {
  GLASS_PRESETS,
  DEFAULT_GLASS_CONFIG,
  type GlassPresetKey,
  type GlassConfig,
} from "../../src";

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
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
        padding: "24px 20px",
        overflowX: "hidden",
      }}
    >
      {/* Background Aurora Orbs for optical depth */}
      <div
        style={{
          position: "fixed",
          top: "8%",
          left: "22%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "38%",
          right: "12%",
          width: 580,
          height: 580,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

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
            marginBottom: 32,
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
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              v0.1.0
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: 20,
                color: "inherit",
                cursor: "pointer",
                fontWeight: 500,
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
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button
                onClick={() => setActiveTab("panel")}
                style={{
                  padding: "10px 22px",
                  borderRadius: 24,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  background:
                    activeTab === "panel" ? "rgba(56, 189, 248, 0.28)" : "rgba(255,255,255,0.06)",
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
                    activeTab === "lens" ? "rgba(56, 189, 248, 0.28)" : "rgba(255,255,255,0.06)",
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
                  style={{ padding: "36px 32px" }}
                >
                  <h1 style={{ fontSize: 32, marginBottom: 12, fontWeight: 700 }}>
                    Physical Optical Glass in Pure Web Standards
                  </h1>
                  <p
                    style={{
                      fontSize: 16,
                      opacity: 0.85,
                      lineHeight: 1.6,
                      maxWidth: 620,
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
                      style={{ padding: "10px 24px", color: "inherit", fontWeight: 600 }}
                    >
                      Explore Shaders
                    </LiquidGlassPanel>
                    <LiquidGlassPanel
                      as="button"
                      preset={selectedPreset}
                      interactive
                      style={{ padding: "10px 24px", color: "inherit", fontWeight: 600 }}
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
                    style={{ padding: 22 }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>💎</div>
                    <h3 style={{ fontSize: 17, marginBottom: 8, fontWeight: 600 }}>Zero Overhead</h3>
                    <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.5 }}>
                      Pure CSS hardware acceleration and SVG meniscus filters for UI cards without
                      WebGL context exhaustion.
                    </p>
                  </LiquidGlassPanel>

                  <LiquidGlassPanel
                    preset={selectedPreset}
                    config={config}
                    theme={theme}
                    style={{ padding: 22 }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>🌈</div>
                    <h3 style={{ fontSize: 17, marginBottom: 8, fontWeight: 600 }}>RGB Dispersion</h3>
                    <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.5 }}>
                      True chromatic fringe aberration splitting along normal vectors at curved
                      glass bevel rims.
                    </p>
                  </LiquidGlassPanel>

                  <LiquidGlassPanel
                    preset={selectedPreset}
                    config={config}
                    theme={theme}
                    style={{ padding: 22 }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>⚡</div>
                    <h3 style={{ fontSize: 17, marginBottom: 8, fontWeight: 600 }}>Any JS App</h3>
                    <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.5 }}>
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
                  height: 520,
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)"
                      : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                  overflow: "hidden",
                  padding: 32,
                }}
              >
                <div style={{ userSelect: "none", pointerEvents: "none", maxWidth: 460 }}>
                  <h2 style={{ fontSize: 26, marginBottom: 12 }}>Draggable Optical Lens</h2>
                  <p style={{ fontSize: 14.5, opacity: 0.8, lineHeight: 1.6 }}>
                    Drag the glass lens across this canvas. Notice real-time Snell refraction, RGB
                    color fringing at the rim, and Blinn-Phong specular glints running at 120 FPS.
                  </p>
                </div>

                {/* Draggable WebGL Lens */}
                <LiquidGlassLens
                  preset={selectedPreset === "magnifier" ? "magnifier" : "default"}
                  config={config}
                  draggable={true}
                  initialPosition={{ x: 100, y: 130 }}
                  style={{
                    width: 220,
                    height: 220,
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
              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 20 }}>
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
