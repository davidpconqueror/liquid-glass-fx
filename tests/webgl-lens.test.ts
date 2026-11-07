import { describe, it, expect, beforeEach } from "vitest";
import { createLiquidGlassLens } from "../src/webgl/lens";

describe("Vanilla WebGL Lens Engine", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    container.style.width = "300px";
    container.style.height = "300px";
    document.body.appendChild(container);
  });

  it("should instantiate lens and mount canvas element", () => {
    const handle = createLiquidGlassLens(container, {
      preset: "magnifier",
      draggable: true,
    });

    expect(handle).toBeDefined();
    expect(typeof handle.setPosition).toBe("function");
    expect(typeof handle.update).toBe("function");
    expect(typeof handle.refresh).toBe("function");
    expect(typeof handle.destroy).toBe("function");

    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();

    handle.destroy();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("should update position and options cleanly", () => {
    const handle = createLiquidGlassLens(container, {
      preset: "pill",
      initialPosition: { x: 10, y: 20 },
    });

    handle.setPosition(80, 90);
    handle.update({ preset: "crystal" });
    handle.refresh();

    handle.destroy();
  });

  it("should observe custom liquid-glass:redraw events on backgroundSelector element", () => {
    const bgCanvas = document.createElement("canvas");
    bgCanvas.id = "test-bg-canvas";
    document.body.appendChild(bgCanvas);

    const handle = createLiquidGlassLens(container, {
      backgroundSelector: "#test-bg-canvas",
    });

    // Dispatch redraw event
    bgCanvas.dispatchEvent(new CustomEvent("liquid-glass:redraw"));

    handle.destroy();
  });
});
