import * as React from "react";
import type { BackgroundSource, GlassConfig, GlassPresetKey } from "../types";
import { createLiquidGlassLens } from "../webgl/lens";

export interface LiquidGlassLensProps {
  preset?: GlassPresetKey;
  config?: Partial<GlassConfig>;
  background?: BackgroundSource;
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
      background,
      backgroundSelector,
      draggable,
      floating,
      initialPosition,
      onPositionChange,
      refreshKey,
      className,
      style,
      children,
      ...props
    },
    forwardedRef
  ) {
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const handleRef = React.useRef<ReturnType<typeof createLiquidGlassLens> | null>(null);

    // Mount lens once on the container
    React.useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const handle = createLiquidGlassLens(el, {
        preset,
        config,
        background,
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
          preset,
          config,
          background,
          backgroundSelector,
          draggable,
          floating,
          onPositionChange,
        });
        handleRef.current.refresh();
      }
    }, [
      preset,
      config,
      background,
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
        data-preset={preset}
        className={className}
        style={{
          position: "relative",
          display: "inline-block",
          overflow: "hidden",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
