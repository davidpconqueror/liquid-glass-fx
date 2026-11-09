import * as React from "react";
import type { GlassConfig, GlassPresetKey } from "../types";
import { resolveGlassConfig } from "../config";
import { computeGlassStyle } from "../dom/styles";
import { createLiquidGlassPanel } from "../dom/panel";
import { resolveIsDark, subscribeToAutoTheme } from "../dom/theme-observer";
import { ensureGlassSvgDefs } from "../dom/svg-filter-manager";

const noopSubscribe = () => () => {};

export const GLASS_CONFIG_KEYS: (keyof GlassConfig)[] = [
  "blurAmount",
  "refraction",
  "chromAberration",
  "edgeHighlight",
  "specular",
  "fresnel",
  "distortion",
  "cornerRadius",
  "zRadius",
  "opacity",
  "saturation",
  "tintStrength",
  "brightness",
  "shadowOpacity",
  "shadowSpread",
  "shadowOffsetY",
  "bevelMode",
  "floating",
  "button",
];

const GLASS_CONFIG_SET = new Set<string>(GLASS_CONFIG_KEYS);

export interface LiquidGlassPanelProps<T extends React.ElementType = "div">
  extends Partial<GlassConfig> {
  as?: T;
  preset?: GlassPresetKey | Partial<GlassConfig>;
  config?: Partial<GlassConfig>;
  tweaks?: Partial<GlassConfig>;
  overrides?: Partial<GlassConfig>;
  theme?: "dark" | "light" | "auto";
  interactive?: boolean;
  button?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type PolymorphicLiquidGlassPanelProps<T extends React.ElementType> =
  LiquidGlassPanelProps<T> &
    Omit<
      React.ComponentPropsWithoutRef<T>,
      | keyof LiquidGlassPanelProps<T>
      | keyof GlassConfig
      | "tweaks"
      | "overrides"
    >;

export const LiquidGlassPanel = React.forwardRef(function LiquidGlassPanel<
  T extends React.ElementType = "div",
>(
  {
    as,
    preset = "default",
    config,
    tweaks,
    overrides,
    theme = "auto",
    interactive,
    button,
    className,
    style,
    children,
    ...restProps
  }: PolymorphicLiquidGlassPanelProps<T>,
  forwardedRef: React.ForwardedRef<any>
) {
  const Component = as || "div";
  const internalRef = React.useRef<HTMLElement | null>(null);

  // Extract flat glass configuration props and strip them from DOM attributes
  const { flatGlassOverrides, domProps } = React.useMemo(() => {
    const flatOverrides: Partial<GlassConfig> = {};
    const cleanProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(restProps)) {
      if (GLASS_CONFIG_SET.has(key)) {
        if (value !== undefined) {
          (flatOverrides as any)[key] = value;
        }
      } else if (key !== "tweaks" && key !== "overrides") {
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

  const activeConfig = React.useMemo(
    () => resolveGlassConfig(preset, mergedOverrides),
    [preset, mergedOverrides]
  );

  const isAutoDark = React.useSyncExternalStore(
    theme === "auto" ? subscribeToAutoTheme : noopSubscribe,
    () => resolveIsDark("auto"),
    () => false
  );

  const effectiveTheme = theme === "auto" ? (isAutoDark ? "dark" : "light") : theme;

  const ssrStyle = React.useMemo(() => {
    return computeGlassStyle(activeConfig, effectiveTheme);
  }, [activeConfig, effectiveTheme]);

  React.useEffect(() => {
    ensureGlassSvgDefs();
  }, []);

  React.useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    const handle = createLiquidGlassPanel(el, {
      preset: typeof preset === "string" ? preset : "default",
      config: mergedOverrides,
      theme,
      interactive,
      button,
    });

    return () => {
      handle.destroy();
    };
  }, [preset, mergedOverrides, theme, interactive, button]);

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [forwardedRef]
  );

  const isButton = Component === "button" || button || activeConfig.button;

  const baseStructuralStyle: React.CSSProperties = {
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
    ...(activeConfig.cornerRadius >= 9999 ? { borderRadius: "9999px" } : {}),
    ...(isButton ? { cursor: "pointer", userSelect: "none" } : {}),
  };

  return (
    <Component
      ref={setRefs}
      data-liquid-glass="true"
      data-preset={typeof preset === "string" ? preset : "custom"}
      className={className}
      style={{
        ...baseStructuralStyle,
        ...ssrStyle,
        ...style,
      }}
      {...(isButton && !("type" in domProps) ? { type: "button" } : {})}
      {...(domProps as any)}
    >
      {children}
    </Component>
  );
}) as <T extends React.ElementType = "div">(
  props: PolymorphicLiquidGlassPanelProps<T> & { ref?: React.ForwardedRef<any> }
) => React.ReactElement | null;
