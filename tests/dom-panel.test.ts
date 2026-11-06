import { describe, it, expect, beforeEach } from "vitest";
import { createLiquidGlassPanel } from "../src/dom/panel";

describe("Vanilla DOM Panel Engine", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    container.textContent = "Glass Card Content";
    document.body.appendChild(container);
  });

  it("should mount liquid glass panel styles and dataset attributes", () => {
    const handle = createLiquidGlassPanel(container, {
      preset: "crystal",
    });

    expect(container.getAttribute("data-liquid-glass")).toBe("true");
    expect(container.getAttribute("data-preset")).toBe("crystal");
    const filter =
      container.style.getPropertyValue("backdrop-filter") ||
      container.style.backdropFilter;
    expect(filter).toContain("blur(");
    expect(container.style.boxShadow).toContain("rgba(0, 0, 0,");

    handle.destroy();
  });

  it("should update panel options dynamically", () => {
    const handle = createLiquidGlassPanel(container, {
      preset: "frosted",
    });

    expect(container.getAttribute("data-preset")).toBe("frosted");

    handle.update({ preset: "obsidian" });
    expect(container.getAttribute("data-preset")).toBe("obsidian");

    handle.destroy();
  });

  it("should clean up styles and dataset on destroy", () => {
    const handle = createLiquidGlassPanel(container, {
      preset: "pill",
    });

    expect(container.getAttribute("data-liquid-glass")).toBe("true");
    expect(container.style.borderRadius).toBe("9999px");

    handle.destroy();

    expect(container.getAttribute("data-liquid-glass")).toBeNull();
    expect(container.getAttribute("data-preset")).toBeNull();
    const filter =
      container.style.getPropertyValue("backdrop-filter") ||
      container.style.backdropFilter;
    expect(!filter || filter === "").toBe(true);
  });

  it("should support interactive hover and click scale", () => {
    const handle = createLiquidGlassPanel(container, {
      preset: "pill",
      interactive: true,
    });

    expect(container.style.cursor).toBe("pointer");
    expect(container.style.transition).toContain("transform");

    handle.destroy();
  });

  it("should respect user-specified overflow and not clobber it", () => {
    container.style.overflowY = "auto";
    const handle = createLiquidGlassPanel(container, {
      preset: "default",
    });

    expect(container.style.overflowY).toBe("auto");
    expect(container.style.overflow).not.toBe("hidden");

    handle.destroy();
  });
});
