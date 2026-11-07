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
      container.style.getPropertyValue("backdrop-filter") || container.style.backdropFilter;
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
      container.style.getPropertyValue("backdrop-filter") || container.style.backdropFilter;
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

  it("should dynamically adapt styles when document class changes in auto theme", async () => {
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");

    const handle = createLiquidGlassPanel(container, { theme: "auto" });
    expect(container.style.backgroundColor).toContain("255, 255, 255"); // Light mode

    // Toggle to dark mode via class
    document.documentElement.classList.add("dark");
    // Allow MutationObserver microtask to flush
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.style.backgroundColor).toContain("15, 23, 42"); // Dark mode

    // Toggle back to light mode
    document.documentElement.classList.remove("dark");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.style.backgroundColor).toContain("255, 255, 255"); // Light mode

    handle.destroy();
  });

  it("should dynamically adapt styles when data-theme changes in auto theme", async () => {
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");

    const handle = createLiquidGlassPanel(container, { theme: "auto" });
    expect(container.style.backgroundColor).toContain("255, 255, 255");

    // Toggle to dark mode via data-theme
    document.documentElement.setAttribute("data-theme", "dark");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.style.backgroundColor).toContain("15, 23, 42");

    document.documentElement.removeAttribute("data-theme");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.style.backgroundColor).toContain("255, 255, 255");

    handle.destroy();
  });

  it("should not react to DOM mutations when theme is explicitly specified", async () => {
    document.documentElement.classList.remove("dark");

    const handle = createLiquidGlassPanel(container, { theme: "light" });
    expect(container.style.backgroundColor).toContain("255, 255, 255");

    // Add dark class - should remain light because theme is explicitly 'light'
    document.documentElement.classList.add("dark");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.style.backgroundColor).toContain("255, 255, 255");

    handle.destroy();
    document.documentElement.classList.remove("dark");
  });
});
