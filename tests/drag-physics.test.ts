import { describe, it, expect, vi } from "vitest";
import { DragPhysicsController } from "../src/webgl/drag-physics";

describe("Drag Physics Controller", () => {
  it("should initialize at specified initial position", () => {
    const controller = new DragPhysicsController({
      initialPosition: { x: 50, y: 100 },
    });

    expect(controller.getPosition()).toEqual({ x: 50, y: 100 });
    expect(controller.isDragging()).toBe(false);
  });

  it("should track pointer down, move, and update position", () => {
    const onPositionChange = vi.fn();
    const controller = new DragPhysicsController({
      initialPosition: { x: 0, y: 0 },
      onPositionChange,
    });

    const targetElement = document.createElement("div");
    controller.attach(targetElement);

    // Simulate pointer down
    const downEvent = new MouseEvent("pointerdown", {
      clientX: 100,
      clientY: 100,
    });
    targetElement.dispatchEvent(downEvent);
    expect(controller.isDragging()).toBe(true);

    // Simulate pointer move
    const moveEvent = new MouseEvent("pointermove", {
      clientX: 130,
      clientY: 140,
    });
    window.dispatchEvent(moveEvent);

    expect(controller.getPosition()).toEqual({ x: 30, y: 40 });
    expect(onPositionChange).toHaveBeenCalledWith({ x: 30, y: 40 });

    // Simulate pointer up
    const upEvent = new MouseEvent("pointerup");
    window.dispatchEvent(upEvent);
    expect(controller.isDragging()).toBe(false);

    controller.destroy();
  });

  it("should allow programmatically setting position", () => {
    const controller = new DragPhysicsController();
    controller.setPosition(250, 350);
    expect(controller.getPosition()).toEqual({ x: 250, y: 350 });
  });
});

