import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LiquidGlassPanel, LiquidGlassLens, useDragPhysics } from "../src/react";

// @ts-expect-error - tells React 18/19 we are running in an act-supported environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("React Bindings", () => {
  let container: HTMLDivElement;

  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
  });

  it("should render LiquidGlassPanel with children, custom props, and forwarded ref", async () => {
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
    const btn = container.querySelector('[data-testid="button-panel"]') as HTMLElement;
    expect(btn.tagName.toLowerCase()).toBe("button");
    expect(btn.getAttribute("type")).toBe("button");

    await act(async () => {
      root.unmount();
    });

    await act(async () => {
      root.unmount();
    });
  });

  it("should mount and unmount LiquidGlassLens cleanly with ref", async () => {
  it("should mount and unmount LiquidGlassLens cleanly with ref", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <LiquidGlassLens ref={ref} preset="magnifier" draggable={true} data-testid="lens" />
      );
    });

    const lens = container.querySelector('[data-testid="lens"]') as HTMLElement;
    const lens = container.querySelector('[data-testid="lens"]') as HTMLElement;
    expect(lens).toBeDefined();
    expect(ref.current).toBe(lens);
    expect(lens.querySelector("canvas")).not.toBeNull();

    await act(async () => {
      root.unmount();
    });
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

    await act(async () => {
      root.unmount();
    });
  });

  it("should provide useDragPhysics hook", async () => {
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
});
