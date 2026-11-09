import * as React from "react";
import type { BackgroundSource, GlassConfig, GlassPresetKey } from "../types";
import { createLiquidGlassLens } from "../webgl/lens";
import { ensureGlassSvgDefs } from "../dom/svg-filter-manager";
import { GLASS_CONFIG_KEYS } from "./liquid-glass-panel";

const GLASS_CONFIG_SET = new Set<string>(GLASS_CONFIG_KEYS);

export interface LiquidGlassLensProps extends Partial<GlassConfig> {
  preset?: GlassPresetKey | Partial<GlassConfig>;
  config?: Partial<GlassConfig>;
  tweaks?: Partial<GlassConfig>;
  overrides?: Partial<GlassConfig>;
  background?: BackgroundSource;
  /** Alias for background */
  backgroundSource?: BackgroundSource;
  backgroundSelector?: string;
  draggable?: boolean;
  floating?: boolean;
  initialPosition?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  refreshKey?: unknown;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LiquidGlassLens = React.forwardRef<HTMLDivElement, LiquidGlassLensProps>(
  function LiquidGlassLens(
    {
      preset = "magnifier",
      config,
      tweaks,
      overrides,
      background,
      backgroundSource,
      backgroundSelector,
      draggable,
      floating,
      initialPosition,
      onPositionChange,
      refreshKey,
      className,
      style,
      children,
      ...restProps
    },
    forwardedRef
  ) {
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const handleRef = React.useRef<ReturnType<typeof createLiquidGlassLens> | null>(null);

    const resolvedBackground = background ?? backgroundSource;

    // Extract flat glass configuration props and strip them from DOM attributes
    const { flatGlassOverrides, domProps } = React.useMemo(() => {
      const flatOverrides: Partial<GlassConfig> = {};
      const cleanProps: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(restProps)) {
        if (GLASS_CONFIG_SET.has(key)) {
          if (value !== undefined) {
            (flatOverrides as any)[key] = value;
          }
        } else if (key !== "tweaks" && key !== "overrides" && key !== "backgroundSource") {
          cleanProps[key] = value;
        }
      }

      return { flatGlassOverrides: flatOverrides, domProps: cleanProps };
    }, [restProps]);

    const mergedOverrides = React.useMemo<Partial<GlassConfig>>(() => {
      return {
        ...(config || {}),
        ...(tweaks || {}),
        ...(overrides || {}),
        ...flatGlassOverrides,
      };
    }, [config, tweaks, overrides, flatGlassOverrides]);

    React.useEffect(() => {
      ensureGlassSvgDefs();
    }, []);

    // Mount lens once on the container
    React.useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const handle = createLiquidGlassLens(el, {
        preset: typeof preset === "string" ? preset : "default",
        config: mergedOverrides,
        background: resolvedBackground,
        backgroundSelector,
        draggable,
        floating,
        initialPosition,
        onPositionChange,
      });
      handleRef.current = handle;
      (el as any).__liquidGlassLens = handle;

      return () => {
        handle.destroy();
        handleRef.current = null;
        delete (el as any).__liquidGlassLens;
      };
    }, []);

    // Efficiently update options without unmounting or resetting position
    React.useEffect(() => {
      if (handleRef.current) {
        handleRef.current.update({
          preset: typeof preset === "string" ? preset : "default",
          config: mergedOverrides,
          background: resolvedBackground,
          backgroundSelector,
          draggable,
          floating,
          onPositionChange,
        });
        handleRef.current.refresh();
      }
    }, [
      preset,
      mergedOverrides,
      resolvedBackground,
      backgroundSelector,
      draggable,
      floating,
      onPositionChange,
      refreshKey,
    ]);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    return (
      <div
        ref={setRefs}
        data-liquid-glass-lens="true"
        data-preset={typeof preset === "string" ? preset : "custom"}
        className={className}
        style={{
          position: "relative",
          display: "inline-block",
          overflow: "hidden",
          ...style,
        }}
        {...(domProps as any)}
      >
        {children}
      </div>
    );
  }
);
