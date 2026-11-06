import type { BackgroundSource } from "../types";

let cachedBackdropCanvas: HTMLCanvasElement | null = null;
let lastBackdropParams = "";

/**
 * Generates an optimized procedural backdrop canvas:
 * High-contrast cyber-gradient mesh, aurora radial glow orbs, and coordinate grid lines.
 * Provides rich high-frequency optical information for Snell refraction and chromatic aberration.
 */
export function generateProceduralBackdrop(
  width: number,
  height: number,
  isDark = true
): HTMLCanvasElement {
  if (typeof document === "undefined") {
    return {} as HTMLCanvasElement;
  }

  const w = Math.max(256, Math.min(1920, Math.ceil(width / 64) * 64));
  const h = Math.max(128, Math.min(1080, Math.ceil(height / 64) * 64));
  const cacheKey = `${w}x${h}_${isDark ? "dark" : "light"}`;

  if (cachedBackdropCanvas && lastBackdropParams === cacheKey) {
    return cachedBackdropCanvas;
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  cachedBackdropCanvas = canvas;
  lastBackdropParams = cacheKey;

  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext("2d");
  } catch {
    ctx = null;
  }
  if (!ctx) return canvas;

  // 1. Deep Space Base
  ctx.fillStyle = isDark ? "#090d16" : "#f8fafc";
  ctx.fillRect(0, 0, w, h);

  // 2. Ambient Aurora Radial Orbs
  if (typeof ctx.createRadialGradient === "function") {
    // Emerald / Lime Glow
    const limeGrad = ctx.createRadialGradient(
      w * 0.4,
      h * 0.3,
      0,
      w * 0.4,
      h * 0.3,
      w * 0.45
    );
    limeGrad.addColorStop(
      0,
      isDark ? "rgba(16, 185, 129, 0.45)" : "rgba(16, 185, 129, 0.35)"
    );
    limeGrad.addColorStop(
      0.6,
      isDark ? "rgba(6, 95, 70, 0.25)" : "rgba(20, 184, 166, 0.2)"
    );
    limeGrad.addColorStop(1, "transparent");
    ctx.fillStyle = limeGrad;
    ctx.fillRect(0, 0, w, h);

    // Electric Cyan / Cobalt Glow
    const cobaltGrad = ctx.createRadialGradient(
      w * 0.75,
      h * 0.65,
      0,
      w * 0.75,
      h * 0.65,
      w * 0.5
    );
    cobaltGrad.addColorStop(
      0,
      isDark ? "rgba(56, 189, 248, 0.4)" : "rgba(14, 165, 233, 0.3)"
    );
    cobaltGrad.addColorStop(
      0.6,
      isDark ? "rgba(30, 58, 138, 0.2)" : "rgba(56, 189, 248, 0.15)"
    );
    cobaltGrad.addColorStop(1, "transparent");
    ctx.fillStyle = cobaltGrad;
    ctx.fillRect(0, 0, w, h);

    // Rose / Violet Accent Glow
    const roseGrad = ctx.createRadialGradient(
      w * 0.15,
      h * 0.75,
      0,
      w * 0.15,
      h * 0.75,
      w * 0.35
    );
    roseGrad.addColorStop(
      0,
      isDark ? "rgba(244, 63, 94, 0.35)" : "rgba(244, 63, 94, 0.25)"
    );
    roseGrad.addColorStop(1, "transparent");
    ctx.fillStyle = roseGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // 3. Crisp Optical Grid Lines
  ctx.strokeStyle = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(15, 23, 42, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 48;

  ctx.beginPath();
  for (let x = 0; x <= w; x += gridSize) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  for (let y = 0; y <= h; y += gridSize) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();

  cachedBackdropCanvas = canvas;
  lastBackdropParams = cacheKey;
  return canvas;
}

/**
 * Generates an optical backdrop texture matching specific themes:
 * - checker: High-contrast optical test checkerboard + spectrum beam (ideal for Snell ray bending)
 * - blueprint: Engineering cyan grid lines & target concentric rings
 * - fluid: Saturated multi-color radial prism gradients
 * - neon: Vivid laser beam vectors & cyberpunk grid
 * - aurora: Glowing aurora mesh & coordinate grid
 */
export function generateThemeBackdrop(
  themeName: string = "aurora",
  width = 800,
  height = 600,
  isDark = true
): HTMLCanvasElement {
  if (typeof document === "undefined") {
    return {} as HTMLCanvasElement;
  }
  const w = Math.max(256, Math.min(1920, Math.ceil(width / 64) * 64));
  const h = Math.max(128, Math.min(1080, Math.ceil(height / 64) * 64));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext("2d");
  } catch {
    ctx = null;
  }
  if (!ctx) return canvas;

  if (themeName === "checker") {
    const tileSize = 36;
    const c1 = isDark ? "#090d16" : "#f1f5f9";
    const c2 = isDark ? "#1e293b" : "#cbd5e1";
    for (let x = 0; x < w; x += tileSize) {
      for (let y = 0; y < h; y += tileSize) {
        ctx.fillStyle = ((x / tileSize) + (y / tileSize)) % 2 === 0 ? c1 : c2;
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
    // High-contrast spectrum gradient beam across middle
    if (typeof ctx.createLinearGradient === "function") {
      const grad = ctx.createLinearGradient(0, h * 0.45, w, h * 0.55);
      grad.addColorStop(0, "rgba(236, 72, 153, 0.75)");
      grad.addColorStop(0.25, "rgba(139, 92, 246, 0.75)");
      grad.addColorStop(0.5, "rgba(59, 130, 246, 0.75)");
      grad.addColorStop(0.75, "rgba(16, 185, 129, 0.75)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0.75)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.45, w, 28);
    }
    // Concentric test rings
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.5)" : "rgba(14, 165, 233, 0.5)";
    ctx.lineWidth = 2;
    for (let r = 60; r <= 260; r += 60) {
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (themeName === "blueprint") {
    ctx.fillStyle = isDark ? "#030816" : "#e2e8f0";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(14, 165, 233, 0.3)";
    ctx.lineWidth = 1;
    const gs = 32;
    ctx.beginPath();
    for (let x = 0; x <= w; x += gs) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (let y = 0; y <= h; y += gs) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();
    // Target circles
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.6)" : "rgba(14, 165, 233, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, 120, 0, Math.PI * 2);
    ctx.arc(w * 0.5, h * 0.5, 60, 0, Math.PI * 2);
    ctx.stroke();
  } else if (themeName === "fluid") {
    ctx.fillStyle = isDark ? "#090d16" : "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    if (typeof ctx.createRadialGradient === "function") {
      const colors = [
        { x: 0.25, y: 0.3, r: 0.45, c: "rgba(236, 72, 153, 0.8)" },
        { x: 0.75, y: 0.3, r: 0.45, c: "rgba(6, 182, 212, 0.8)" },
        { x: 0.5, y: 0.7, r: 0.5, c: "rgba(139, 92, 246, 0.8)" },
        { x: 0.2, y: 0.8, r: 0.4, c: "rgba(16, 185, 129, 0.8)" },
      ];
      for (const blob of colors) {
        const rad = ctx.createRadialGradient(w * blob.x, h * blob.y, 0, w * blob.x, h * blob.y, w * blob.r);
        rad.addColorStop(0, blob.c);
        rad.addColorStop(1, "transparent");
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, w, h);
      }
    }
  } else if (themeName === "neon") {
    ctx.fillStyle = isDark ? "#070b14" : "#f1f5f9";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    ctx.lineTo(w, h * 0.35);
    ctx.stroke();
    ctx.strokeStyle = "#06b6d4";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w, h * 0.55);
    ctx.stroke();
  } else {
    return generateProceduralBackdrop(width, height, isDark);
  }

  return canvas;
}

const loadedImageCache = new Map<string, HTMLImageElement>();

/**
 * Resolves any background source into an HTMLCanvasElement or HTMLImageElement
 * ready for WebGL texture upload.
 */
export async function resolveBackgroundTexture(
  source?: BackgroundSource,
  width = 800,
  height = 600,
  isDark = true
): Promise<HTMLCanvasElement | HTMLImageElement> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {} as HTMLCanvasElement;
  }

  if (source instanceof HTMLCanvasElement || source instanceof HTMLImageElement) {
    return source;
  }

  if (typeof source === "string" && source.trim().length > 0) {
    const cleanUrl = source.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");

    // Built-in theme strings
    if (["checker", "blueprint", "fluid", "neon", "aurora"].includes(cleanUrl)) {
      return generateThemeBackdrop(cleanUrl, width, height, isDark);
    }

    if (loadedImageCache.has(cleanUrl)) {
      const cached = loadedImageCache.get(cleanUrl)!;
      if (cached.complete && cached.naturalWidth > 0) {
        return cached;
      }
    }

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = cleanUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${cleanUrl}`));
      });

      loadedImageCache.set(cleanUrl, img);
      return img;
    } catch {
      // Fall through to procedural backdrop on image load error
    }
  }

  return generateProceduralBackdrop(width, height, isDark);
}
