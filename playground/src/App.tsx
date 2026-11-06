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

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        padding: "32px 24px",
        overflow: "hidden",
      }}
    >
      {/* Background Aurora Orbs for optical depth */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "25%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "40%",
          right: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
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
            marginBottom: 40,
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
            gridTemplateColumns: "1fr 340px",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Showcase Area */}
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button
                onClick={() => setActiveTab("panel")}
                style={{
                  padding: "10px 24px",
                  borderRadius: 24,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  background:
                    activeTab === "panel" ? "rgba(56, 189, 248, 0.25)" : "rgba(255,255,255,0.06)",
                  color: "inherit",
                }}
              >
                UI Glass Panels (CSS Substrate)
              </button>
              <button
                onClick={() => setActiveTab("lens")}
                style={{
                  padding: "10px 24px",
                  borderRadius: 24,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  background:
                    activeTab === "lens" ? "rgba(56, 189, 248, 0.25)" : "rgba(255,255,255,0.06)",
                  color: "inherit",
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
                  style={{ padding: "40px 36px" }}
                >
                  <h1 style={{ fontSize: 36, marginBottom: 12, fontWeight: 700 }}>
                    Physical Optical Glass in Pure Web Standards
                  </h1>
                  <p
                    style={{
                      fontSize: 18,
                      opacity: 0.85,
                      lineHeight: 1.6,
                      maxWidth: 650,
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
                    gap: 20,
                  }}
                >
                  <LiquidGlassPanel
                    preset={selectedPreset}
                    config={config}
                    theme={theme}
                    style={{ padding: 24 }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>💎</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600 }}>Zero Overhead</h3>
                    <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
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
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🌈</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600 }}>RGB Dispersion</h3>
                    <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
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
                    <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600 }}>Any JS App</h3>
                    <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
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
                  height: 480,
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
                <div style={{ userSelect: "none", pointerEvents: "none", maxWidth: 450 }}>
                  <h2 style={{ fontSize: 28, marginBottom: 12 }}>Draggable Optical Magnifier</h2>
                  <p style={{ fontSize: 15, opacity: 0.8, lineHeight: 1.6 }}>
                    Drag the glass lens across this canvas. Notice real-time Snell refraction, RGB
                    color fringing at the rim, and Blinn-Phong specular glints running at 120 FPS.
                  </p>
                </div>

                {/* Draggable WebGL Lens */}
                <LiquidGlassLens
                  preset="magnifier"
                  config={config}
                  draggable={true}
                  initialPosition={{ x: 120, y: 140 }}
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                  }}
                />
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <LiquidGlassPanel
            preset="default"
            theme={theme}
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Optical Parameters</h3>

            {/* Presets */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, textTransform: "uppercase" }}>
                Preset
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                {(Object.keys(GLASS_PRESETS) as GlassPresetKey[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePresetChange(p)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 12,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      background:
                        selectedPreset === p
                          ? "rgba(56, 189, 248, 0.35)"
                          : "rgba(255,255,255,0.08)",
                      color: "inherit",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Blur Amount", key: "blurAmount", min: 0, max: 1, step: 0.01 },
                { label: "Refraction", key: "refraction", min: 0, max: 2, step: 0.02 },
                { label: "Chromatic Aberration", key: "chromAberration", min: 0, max: 0.5, step: 0.01 },
                { label: "Edge Highlight", key: "edgeHighlight", min: 0, max: 2, step: 0.05 },
                { label: "Specular Glints", key: "specular", min: 0, max: 1, step: 0.05 },
                { label: "Fresnel Falloff", key: "fresnel", min: 0, max: 2, step: 0.05 },
                { label: "Corner Radius", key: "cornerRadius", min: 0, max: 100, step: 1 },
                { label: "Bevel Depth (zRadius)", key: "zRadius", min: 0, max: 100, step: 1 },
                { label: "Opacity", key: "opacity", min: 0, max: 1, step: 0.02 },
                { label: "Shadow Spread", key: "shadowSpread", min: 0, max: 50, step: 1 },
                { label: "Shadow Opacity", key: "shadowOpacity", min: 0, max: 1, step: 0.02 },
              ].map(({ label, key, min, max, step }) => (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{label}</span>
                    <span style={{ opacity: 0.6 }}>{(config as any)[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={(config as any)[key]}
                    onChange={(e) => updateParam(key as keyof GlassConfig, parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          </LiquidGlassPanel>
        </div>
      </div>
    </div>
  );
}
