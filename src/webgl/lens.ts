import type { LensOptions, LiquidGlassLensHandle } from "../types";
import { resolveGlassConfig } from "../config";
import { LensRenderer } from "./lens-renderer";
import { resolveBackgroundTexture } from "./background-sampler";
import { DragPhysicsController } from "./drag-physics";
import { computeGlassStyle } from "../dom/styles";

export function createLiquidGlassLens(
  container: HTMLElement,
  options: LensOptions = {}
): LiquidGlassLensHandle {
  if (typeof window === "undefined" || !container) {
    return {
      setPosition: () => {},
      update: () => {},
      destroy: () => {},
    };
  }

  let currentOptions = { ...options };
  let isMounted = true;
  let rafId: number | null = null;
  let dragController: DragPhysicsController | null = null;

  // Create WebGL target canvas
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  container.appendChild(canvas);

  let renderer: LensRenderer | null = null;
  const webglSupported = LensRenderer.isSupported();
  if (webglSupported) {
    try {
      renderer = LensRenderer.getInstance();
    } catch {
      renderer = null;
    }
  }

  const renderFrame = async () => {
    if (!isMounted || !container) return;

    const w = container.offsetWidth || 200;
    const h = container.offsetHeight || 200;
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const config = resolveGlassConfig(currentOptions.preset ?? "magnifier", currentOptions.config);

    if (renderer && !renderer.contextLost) {
      const isDark = document.documentElement.classList.contains("dark");
      let bgTexture: HTMLCanvasElement | HTMLImageElement;

      if (currentOptions.backgroundSelector) {
        const selected = document.querySelector(currentOptions.backgroundSelector);
        if (selected instanceof HTMLCanvasElement || selected instanceof HTMLImageElement) {
          bgTexture = selected;
        } else {
          bgTexture = await resolveBackgroundTexture(
            currentOptions.background,
            targetW,
            targetH,
            isDark
          );
        }
      } else {
        bgTexture = await resolveBackgroundTexture(
          currentOptions.background,
          targetW,
          targetH,
          isDark
        );
      }

      if (!isMounted) return;

      renderer.uploadSourceAndBlur(bgTexture, targetW, targetH, config.blurAmount);
      renderer.renderGlass(canvas, config, w, h, dpr, {
        x: window.scrollX,
        y: window.scrollY,
      });
    } else {
      // Fallback: apply CSS styles directly to container if WebGL is unavailable
      const styles = computeGlassStyle(config);
      for (const [prop, val] of Object.entries(styles)) {
        container.style.setProperty(
          prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
          val
        );
      }
    }
  };

  const scheduleRender = () => {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        renderFrame();
      });
    }
  };

  // Setup drag physics if requested
  const isDraggable = currentOptions.draggable || currentOptions.floating;
  if (isDraggable) {
    dragController = new DragPhysicsController({
      initialPosition: currentOptions.initialPosition,
      onPositionChange: (pos) => {
        container.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        currentOptions.onPositionChange?.(pos);
        scheduleRender();
      },
    });
    dragController.attach(container);
  }

  // Listeners
  window.addEventListener("scroll", scheduleRender, { passive: true });
  const resizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(() => scheduleRender())
    : null;

  if (resizeObserver) {
    resizeObserver.observe(container);
  }

  // Trigger initial frame
  renderFrame();

  return {
    setPosition(x: number, y: number) {
      if (dragController) {
        dragController.setPosition(x, y);
      } else {
        container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        scheduleRender();
      }
    },
    update(newOptions: Partial<LensOptions>) {
      currentOptions = { ...currentOptions, ...newOptions };
      scheduleRender();
    },
    destroy() {
      isMounted = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener("scroll", scheduleRender);
      resizeObserver?.disconnect();
      dragController?.destroy();
      dragController = null;

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    },
  };
}

