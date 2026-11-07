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
      refresh: () => {},
      destroy: () => {},
    };
  }

  let currentOptions = { ...options };
  let currentPos = options.initialPosition || { x: 0, y: 0 };
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
      let bgW = targetW;
      let bgH = targetH;

      if (currentOptions.backgroundSelector) {
        const selected = document.querySelector(currentOptions.backgroundSelector);
        if (selected instanceof HTMLCanvasElement || selected instanceof HTMLImageElement) {
          bgTexture = selected;
          bgW = selected instanceof HTMLCanvasElement ? selected.width : selected.naturalWidth;
          bgH = selected instanceof HTMLCanvasElement ? selected.height : selected.naturalHeight;
        } else {
          bgTexture = await resolveBackgroundTexture(
            currentOptions.background,
            targetW,
            targetH,
            isDark
          );
          bgW = bgTexture instanceof HTMLCanvasElement ? bgTexture.width : targetW;
          bgH = bgTexture instanceof HTMLCanvasElement ? bgTexture.height : targetH;
        }
      } else if (
        currentOptions.background instanceof HTMLCanvasElement ||
        currentOptions.background instanceof HTMLImageElement
      ) {
        bgTexture = currentOptions.background;
        bgW = bgTexture instanceof HTMLCanvasElement ? bgTexture.width : bgTexture.naturalWidth;
        bgH = bgTexture instanceof HTMLCanvasElement ? bgTexture.height : bgTexture.naturalHeight;
      } else {
        const parent = container.parentElement;
        const pW = parent ? Math.round((parent.offsetWidth || 800) * dpr) : targetW;
        const pH = parent ? Math.round((parent.offsetHeight || 500) * dpr) : targetH;
        bgTexture = await resolveBackgroundTexture(currentOptions.background, pW, pH, isDark);
        bgW = bgTexture instanceof HTMLCanvasElement ? bgTexture.width : pW;
        bgH = bgTexture instanceof HTMLCanvasElement ? bgTexture.height : pH;
      }

      if (!isMounted) return;

      renderer.uploadSourceAndBlur(bgTexture, bgW, bgH, config.blurAmount);
      renderer.renderGlass(canvas, config, w, h, dpr, currentPos, {
        width: bgW / dpr,
        height: bgH / dpr,
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
        currentPos = { ...pos };
        container.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        currentOptions.onPositionChange?.(pos);
        scheduleRender();
      },
    });
    dragController.attach(container);
    if (currentOptions.initialPosition) {
      container.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`;
    }
  }

  // Listeners
  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("resize", scheduleRender, { passive: true });

  let backgroundTargetEl: Element | null = null;
  const attachBackgroundListener = (selector?: string) => {
    if (backgroundTargetEl) {
      backgroundTargetEl.removeEventListener("liquid-glass:redraw", scheduleRender);
      backgroundTargetEl = null;
    }
    if (selector && typeof document !== "undefined") {
      const el = document.querySelector(selector);
      if (el) {
        backgroundTargetEl = el;
        el.addEventListener("liquid-glass:redraw", scheduleRender);
      }
    }
  };

  if (currentOptions.backgroundSelector) {
    attachBackgroundListener(currentOptions.backgroundSelector);
  }

  const resizeObserver =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => scheduleRender()) : null;

  if (resizeObserver) {
    resizeObserver.observe(container);
  }

  // Trigger initial frame
  renderFrame();

  return {
    setPosition(x: number, y: number) {
      currentPos = { x, y };
      container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (dragController) {
        dragController.setPosition(x, y);
      } else {
        scheduleRender();
      }
    },
    update(newOptions: Partial<LensOptions>) {
      currentOptions = { ...currentOptions, ...newOptions };
      if ("backgroundSelector" in newOptions) {
        attachBackgroundListener(currentOptions.backgroundSelector);
      }
      const wantsDrag = currentOptions.draggable || currentOptions.floating;
      if (wantsDrag && !dragController) {
        dragController = new DragPhysicsController({
          initialPosition: currentPos,
          onPositionChange: (pos) => {
            currentPos = { ...pos };
            container.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            currentOptions.onPositionChange?.(pos);
            scheduleRender();
          },
        });
        dragController.attach(container);
      } else if (!wantsDrag && dragController) {
        dragController.destroy();
        dragController = null;
      }
      renderFrame();
      scheduleRender();
    },
    refresh() {
      scheduleRender();
    },
    destroy() {
      isMounted = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      if (backgroundTargetEl) {
        backgroundTargetEl.removeEventListener("liquid-glass:redraw", scheduleRender);
        backgroundTargetEl = null;
      }
      resizeObserver?.disconnect();
      dragController?.destroy();
      dragController = null;

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    },
  };
}
