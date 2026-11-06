export interface DragPhysicsOptions {
  initialPosition?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  bounds?: { minX?: number; maxX?: number; minY?: number; maxY?: number };
}

export class DragPhysicsController {
  private pos = { x: 0, y: 0 };
  private dragging = false;
  private startPoint = { startX: 0, startY: 0, origX: 0, origY: 0 };
  private attachedElement: HTMLElement | null = null;
  private options: DragPhysicsOptions;

  constructor(options: DragPhysicsOptions = {}) {
    this.options = options;
    if (options.initialPosition) {
      this.pos = { ...options.initialPosition };
    }
  }

  public getPosition(): { x: number; y: number } {
    return { ...this.pos };
  }

  public isDragging(): boolean {
    return this.dragging;
  }

  public setPosition(x: number, y: number): void {
    let targetX = x;
    let targetY = y;

    if (this.options.bounds) {
      const { minX, maxX, minY, maxY } = this.options.bounds;
      if (typeof minX === "number") targetX = Math.max(minX, targetX);
      if (typeof maxX === "number") targetX = Math.min(maxX, targetX);
      if (typeof minY === "number") targetY = Math.max(minY, targetY);
      if (typeof maxY === "number") targetY = Math.min(maxY, targetY);
    }

    this.pos = { x: targetX, y: targetY };
    this.options.onPositionChange?.(this.getPosition());
  }

  public attach(element: HTMLElement): void {
    this.detach();
    this.attachedElement = element;
    element.style.cursor = "grab";
    element.style.userSelect = "none";
    element.style.touchAction = "none";

    element.addEventListener("pointerdown", this.handlePointerDown);
  }

  public detach(): void {
    if (this.attachedElement) {
      this.attachedElement.removeEventListener("pointerdown", this.handlePointerDown);
      this.attachedElement = null;
    }
    this.removeWindowListeners();
    this.dragging = false;
  }

  public destroy(): void {
    this.detach();
  }

  private handlePointerDown = (e: Event): void => {
    const mouseEvt = e as MouseEvent;
    e.preventDefault?.();
    this.dragging = true;

    if (this.attachedElement) {
      this.attachedElement.style.cursor = "grabbing";
    }

    this.startPoint = {
      startX: mouseEvt.clientX,
      startY: mouseEvt.clientY,
      origX: this.pos.x,
      origY: this.pos.y,
    };

    if (typeof window !== "undefined") {
      window.addEventListener("pointermove", this.handlePointerMove);
      window.addEventListener("pointerup", this.handlePointerUp);
      window.addEventListener("pointercancel", this.handlePointerUp);
    }
  };

  private handlePointerMove = (e: Event): void => {
    if (!this.dragging) return;
    const mouseEvt = e as MouseEvent;
    const dx = mouseEvt.clientX - this.startPoint.startX;
    const dy = mouseEvt.clientY - this.startPoint.startY;

    this.setPosition(this.startPoint.origX + dx, this.startPoint.origY + dy);
  };

  private handlePointerUp = (): void => {
    this.dragging = false;
    if (this.attachedElement) {
      this.attachedElement.style.cursor = "grab";
    }
    this.removeWindowListeners();
  };

  private removeWindowListeners(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("pointermove", this.handlePointerMove);
      window.removeEventListener("pointerup", this.handlePointerUp);
      window.removeEventListener("pointercancel", this.handlePointerUp);
    }
  }
}
