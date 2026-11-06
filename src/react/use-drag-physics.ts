import * as React from "react";
import { DragPhysicsController, type DragPhysicsOptions } from "../webgl/drag-physics";

export function useDragPhysics(options: DragPhysicsOptions = {}) {
  const [position, setPosition] = React.useState(options.initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const controllerRef = React.useRef<DragPhysicsController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new DragPhysicsController({
      ...options,
      onPositionChange: (pos) => {
        setPosition(pos);
        options.onPositionChange?.(pos);
      },
    });
  }

  const bindElement = React.useCallback((node: HTMLElement | null) => {
    if (node) {
      controllerRef.current?.attach(node);
    } else {
      controllerRef.current?.detach();
    }
  }, []);

  React.useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    const checkDrag = () => {
      setIsDragging(controller.isDragging());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("pointerdown", checkDrag);
      window.addEventListener("pointerup", checkDrag);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("pointerdown", checkDrag);
        window.removeEventListener("pointerup", checkDrag);
      }
      controller.destroy();
    };
  }, []);

  return {
    position,
    isDragging,
    bindElement,
    setPosition: (x: number, y: number) => controllerRef.current?.setPosition(x, y),
  };
}

