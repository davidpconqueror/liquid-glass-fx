import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  LiquidGlassPanel,
  LiquidGlassLens,
  useDragPhysics,
} from "../src/react";

describe("React Bindings", () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("should render LiquidGlassPanel with children, custom props, and forwarded ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
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

    const panel = screen.getByTestId("panel");
    expect(panel).toBeDefined();
    expect(panel.textContent).toBe("Card Content");
    expect(panel.className).toContain("custom-glass-card");
    expect(panel.getAttribute("data-liquid-glass")).toBe("true");
    expect(panel.getAttribute("data-preset")).toBe("crystal");
    expect(ref.current).toBe(panel);
  });

  it("should support polymorphic 'as' prop on LiquidGlassPanel", () => {
    render(
      <LiquidGlassPanel as="button" preset="pill" data-testid="button-panel">
        Click Me
      </LiquidGlassPanel>
    );

    const btn = screen.getByTestId("button-panel");
    expect(btn.tagName.toLowerCase()).toBe("button");
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("should mount and unmount LiquidGlassLens cleanly with ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { unmount } = render(
      <LiquidGlassLens
        ref={ref}
        preset="magnifier"
        draggable={true}
        data-testid="lens"
      />
    );

    const lens = screen.getByTestId("lens");
    expect(lens).toBeDefined();
    expect(ref.current).toBe(lens);
    expect(lens.querySelector("canvas")).not.toBeNull();

    unmount();
  });

  it("should provide useDragPhysics hook", () => {
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

    render(<TestComponent />);
    expect(screen.getByTestId("pos-x").textContent).toBe("50");
    expect(screen.getByTestId("pos-y").textContent).toBe("75");
    expect(screen.getByTestId("is-dragging").textContent).toBe("no");
  });
});

