import { describe, it, expect } from "vitest";
import {
  generateProceduralBackdrop,
  resolveBackgroundTexture,
} from "../src/webgl/background-sampler";

describe("Background Sampler", () => {
  it("should generate a procedural canvas backdrop with valid dimensions", () => {
    const canvas = generateProceduralBackdrop(400, 300, true);
    expect(canvas).toBeDefined();
    expect(canvas.width).toBeGreaterThanOrEqual(256);
    expect(canvas.height).toBeGreaterThanOrEqual(128);
  });

  it("should cache procedural canvas backdrop for matching dimensions and theme", () => {
    const canvas1 = generateProceduralBackdrop(500, 400, true);
    const canvas2 = generateProceduralBackdrop(500, 400, true);
    expect(canvas1).toBe(canvas2);

    const canvasDark = generateProceduralBackdrop(500, 400, true);
    const canvasLight = generateProceduralBackdrop(500, 400, false);
    expect(canvasDark).not.toBe(canvasLight);
  });

  it("should resolve an HTMLCanvasElement directly", async () => {
    const customCanvas = document.createElement("canvas");
    customCanvas.width = 100;
    customCanvas.height = 100;

    const texture = await resolveBackgroundTexture(customCanvas, 200, 200, true);
    expect(texture).toBe(customCanvas);
  });

  it("should fall back to procedural backdrop when source is null or empty", async () => {
    const texture = await resolveBackgroundTexture(undefined, 300, 200, true);
    expect(texture).toBeDefined();
    expect(texture instanceof HTMLCanvasElement).toBe(true);
  });
});
