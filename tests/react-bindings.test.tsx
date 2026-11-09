import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LiquidGlassPanel, LiquidGlassLens, useDragPhysics } from "../src/react";

// @ts-expect-error - tells React 18/19 we are running in an act-supported environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("React Bindings", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
  });

  it("should render LiquidGlassPanel with children, custom props, and forwarded ref", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <LiquidGlassPanel
          ref={ref}
          as="div"
          preset="crystal"
          className="custom-glass-card"
          data-testid="panel"
        >
          <span>Card Content</span>
        </LiquidGlassPanel>
      );
    });

    const panel = container.querySelector('[data-testid="panel"]') as HTMLElement;
    expect(panel).toBeDefined();
    expect(panel.textContent).toBe("Card Content");
    expect(panel.className).toContain("custom-glass-card");
    expect(panel.getAttribute("data-liquid-glass")).toBe("true");
    expect(panel.getAttribute("data-preset")).toBe("crystal");
    expect(ref.current).toBe(panel);

    await act(async () => {
      root.unmount();
    });
  });

  it("should support polymorphic 'as' prop on LiquidGlassPanel", async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <LiquidGlassPanel as="button" preset="pill" data-testid="button-panel">
          Click Me
        </LiquidGlassPanel>
      );
    });

    const btn = container.querySelector('[data-testid="button-panel"]') as HTMLElement;
    expect(btn.tagName.toLowerCase()).toBe("button");
    expect(btn.getAttribute("type")).toBe("button");

    await act(async () => {
      root.unmount();
    });
  });

  it("should mount and unmount LiquidGlassLens cleanly with ref", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <LiquidGlassLens ref={ref} preset="magnifier" draggable={true} data-testid="lens" />
      );
    });

    const lens = container.querySelector('[data-testid="lens"]') as HTMLElement;
    expect(lens).toBeDefined();
    expect(ref.current).toBe(lens);
    expect(lens.querySelector("canvas")).not.toBeNull();

    await act(async () => {
      root.unmount();
    });
  });

  it("should update LiquidGlassLens options without remounting or replacing the canvas element", async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <LiquidGlassLens
          preset="magnifier"
          config={{ refraction: 1.0 }}
          data-testid="lens-update"
        />
      );
    });

    const lens = container.querySelector('[data-testid="lens-update"]') as HTMLElement;
    const initialCanvas = lens.querySelector("canvas");
    expect(initialCanvas).not.toBeNull();

    // Rerender with new parameter
    await act(async () => {
      root.render(
        <LiquidGlassLens
          preset="magnifier"
          config={{ refraction: 2.0 }}
          data-testid="lens-update"
        />
      );
    });

    const updatedCanvas = lens.querySelector("canvas");
    expect(updatedCanvas).toBe(initialCanvas);

    await act(async () => {
      root.unmount();
    });
  });

  it("should provide useDragPhysics hook", async () => {
    function TestComponent() {
      const { position, isDragging } = useDragPhysics({
        initialPosition: { x: 50, y: 75 },
      });
      return (
        <div>
          <span data-testid="pos-x">{position.x}</span>
          <span data-testid="pos-y">{position.y}</span>
          <span data-testid="is-dragging">{isDragging ? "yes" : "no"}</span>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => {
      root.render(<TestComponent />);
    });

    expect(container.querySelector('[data-testid="pos-x"]')?.textContent).toBe("50");
    expect(container.querySelector('[data-testid="pos-y"]')?.textContent).toBe("75");
    expect(container.querySelector('[data-testid="is-dragging"]')?.textContent).toBe("no");

    await act(async () => {
      root.unmount();
    });
  });

  it("should dynamically react to theme changes when theme='auto'", async () => {
    document.documentElement.classList.remove("dark");
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassPanel preset="default" theme="auto" data-testid="auto-panel">
          Content
        </LiquidGlassPanel>
      );
    });

    const panel = container.querySelector('[data-testid="auto-panel"]') as HTMLElement;
    expect(panel.style.backgroundColor).toContain("255, 255, 255");

    // Toggle dark class
    await act(async () => {
      document.documentElement.classList.add("dark");
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(panel.style.backgroundColor).toContain("15, 23, 42");

    // Toggle back to light
    await act(async () => {
      document.documentElement.classList.remove("dark");
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(panel.style.backgroundColor).toContain("255, 255, 255");

    await act(async () => {
      root.unmount();
    });
  });

  it("should auto-inject SVG defs on mount and apply baseline structural styles", async () => {
    document.getElementById("liquid-glass-svg-defs")?.remove();
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassPanel data-testid="structural-panel">
          Structural
        </LiquidGlassPanel>
      );
    });

    expect(document.getElementById("liquid-glass-svg-defs")).not.toBeNull();
    const panel = container.querySelector('[data-testid="structural-panel"]') as HTMLElement;
    expect(panel.style.position).toBe("relative");
    expect(panel.style.isolation).toBe("isolate");
    expect(panel.style.overflow).toBe("hidden");

    await act(async () => {
      root.unmount();
    });
  });

  it("should apply borderRadius: 9999px for pill presets or cornerRadius >= 9999", async () => {
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassPanel preset="pill" data-testid="pill-panel">
          Pill
        </LiquidGlassPanel>
      );
    });

    const panel = container.querySelector('[data-testid="pill-panel"]') as HTMLElement;
    expect(panel.style.borderRadius).toBe("9999px");

    await act(async () => {
      root.unmount();
    });
  });

  it("should support flat parameter tweaks and not leak them to DOM attributes", async () => {
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassPanel
          preset="frosted"
          blurAmount={0.35}
          refraction={1.2}
          cornerRadius={25}
          data-testid="tweaked-panel"
        >
          Tweaked
        </LiquidGlassPanel>
      );
    });

    const panel = container.querySelector('[data-testid="tweaked-panel"]') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute("bluramount")).toBeNull();
    expect(panel.getAttribute("blurAmount")).toBeNull();
    expect(panel.getAttribute("refraction")).toBeNull();
    expect(panel.getAttribute("cornerRadius")).toBeNull();

    await act(async () => {
      root.unmount();
    });
  });

  it("should support tweaks and overrides object prop and prioritize flat props", async () => {
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassPanel
          preset="frosted"
          tweaks={{ blurAmount: 0.1, refraction: 0.5 }}
          refraction={0.88}
          data-testid="hybrid-panel"
        >
          Hybrid
        </LiquidGlassPanel>
      );
    });

    const panel = container.querySelector('[data-testid="hybrid-panel"]') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute("tweaks")).toBeNull();

    await act(async () => {
      root.unmount();
    });
  });

  it("should apply button tactile styles when button={true} or as='button'", async () => {
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassPanel button={true} data-testid="tactile-button">
          Press Me
        </LiquidGlassPanel>
      );
    });

    const btn = container.querySelector('[data-testid="tactile-button"]') as HTMLElement;
    expect(btn.style.cursor).toBe("pointer");
    expect(btn.style.userSelect).toBe("none");

    await act(async () => {
      root.unmount();
    });
  });

  it("should support backgroundSource alias, tweaks, and auto-defs on LiquidGlassLens", async () => {
    document.getElementById("liquid-glass-svg-defs")?.remove();
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LiquidGlassLens
          backgroundSource="viewport"
          refraction={1.5}
          tweaks={{ blurAmount: 0.2 }}
          data-testid="lens-aliased"
        >
          Lens Child
        </LiquidGlassLens>
      );
    });

    expect(document.getElementById("liquid-glass-svg-defs")).not.toBeNull();
    const lens = container.querySelector('[data-testid="lens-aliased"]') as HTMLElement;
    expect(lens).not.toBeNull();
    expect(lens.getAttribute("backgroundSource")).toBeNull();
    expect(lens.getAttribute("backgroundsource")).toBeNull();
    expect(lens.getAttribute("refraction")).toBeNull();
    expect(lens.getAttribute("tweaks")).toBeNull();

    await act(async () => {
      root.unmount();
    });
  });
});
