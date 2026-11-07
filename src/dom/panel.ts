import type { PanelOptions, LiquidGlassPanelHandle } from "../types";
import { resolveGlassConfig } from "../config";
import { computeGlassStyle } from "./styles";
import { injectGlassSvgDefs } from "./svg-filter-manager";
import { subscribeToAutoTheme } from "./theme-observer";

export function createLiquidGlassPanel(
  element: HTMLElement,
  options: PanelOptions = {}
): LiquidGlassPanelHandle {
  if (typeof window === "undefined" || !element) {
    return {
      update: () => {},
      destroy: () => {},
    };
  }

  // Ensure SVG filters are present
  injectGlassSvgDefs();

  // Save original style keys to restore on destroy
  const appliedStyleKeys: string[] = [];
  const appliedCamelKeys: string[] = [];
  let currentOptions = { ...options };
  let unsubscribeTheme: (() => void) | null = null;

  const syncThemeSubscription = () => {
    const isAutoTheme = currentOptions.theme === "auto" || !currentOptions.theme;
    if (isAutoTheme) {
      if (!unsubscribeTheme) {
        unsubscribeTheme = subscribeToAutoTheme(() => {
          applyStyles(currentOptions);
        });
      }
    } else if (unsubscribeTheme) {
      unsubscribeTheme();
      unsubscribeTheme = null;
    }
  };

  const clearAppliedStyles = () => {
    for (const key of appliedStyleKeys) {
      element.style.removeProperty(key);
    }
    for (const camel of appliedCamelKeys) {
      try {
        (element.style as any)[camel] = "";
      } catch {
        // ignore
      }
    }
    appliedStyleKeys.length = 0;
    appliedCamelKeys.length = 0;
  };

  const applyStyles = (opts: PanelOptions) => {
    const config = resolveGlassConfig(opts.preset, opts.config);
    const computed = computeGlassStyle(config, opts.theme);

    element.setAttribute("data-liquid-glass", "true");
    element.setAttribute("data-preset", opts.preset ?? "default");

    clearAppliedStyles();

    // Apply new styles
    for (const [prop, val] of Object.entries(computed)) {
      const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      element.style.setProperty(cssProp, val);
      try {
        (element.style as any)[prop] = val;
      } catch {
        // ignore if read-only in some environments
      }
      appliedStyleKeys.push(cssProp);
      appliedCamelKeys.push(prop);
    }

    // Set base container styles without clobbering existing user overflow/position
    if (!element.style.position) {
      element.style.position = "relative";
      appliedStyleKeys.push("position");
      appliedCamelKeys.push("position");
    }
    if (!element.style.overflow && !element.style.overflowY && !element.style.overflowX) {
      element.style.overflow = "hidden";
      appliedStyleKeys.push("overflow");
      appliedCamelKeys.push("overflow");
    }

    // Interactive button physics
    const isInteractive = opts.interactive || opts.button || config.button;
    if (isInteractive) {
      element.style.cursor = "pointer";
      element.style.userSelect = "none";
      element.style.transition = "transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease";
      appliedStyleKeys.push("cursor", "user-select", "transition");
      appliedCamelKeys.push("cursor", "userSelect", "transition");
    }
  };

  const onPointerDown = () => {
    element.style.transform = "scale(0.985)";
  };

  const onPointerUp = () => {
    element.style.transform = "scale(1)";
  };

  const onMouseEnter = () => {
    element.style.filter = "brightness(1.04)";
  };

  const onMouseLeave = () => {
    element.style.filter = "brightness(1.0)";
    element.style.transform = "scale(1)";
  };

  const isInteractive = options.interactive || options.button;
  if (isInteractive) {
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
  }

  applyStyles(currentOptions);
  syncThemeSubscription();

  return {
    update(newOptions: Partial<PanelOptions>) {
      currentOptions = { ...currentOptions, ...newOptions };
      syncThemeSubscription();
      applyStyles(currentOptions);
    },
    destroy() {
      if (unsubscribeTheme) {
        unsubscribeTheme();
        unsubscribeTheme = null;
      }

      element.removeAttribute("data-liquid-glass");
      element.removeAttribute("data-preset");

      clearAppliedStyles();

      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
    },
  };
}
