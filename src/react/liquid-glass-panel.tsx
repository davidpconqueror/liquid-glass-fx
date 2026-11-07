import * as React from "react";
import type { GlassConfig, GlassPresetKey } from "../types";
import { resolveGlassConfig } from "../config";
import { computeGlassStyle } from "../dom/styles";
import { createLiquidGlassPanel } from "../dom/panel";
import { resolveIsDark, subscribeToAutoTheme } from "../dom/theme-observer";

const noopSubscribe = () => () => {};

export interface LiquidGlassPanelProps<T extends React.ElementType = "div"> {
  as?: T;
  preset?: GlassPresetKey;
  config?: Partial<GlassConfig>;
  theme?: "dark" | "light" | "auto";
  interactive?: boolean;
  button?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type PolymorphicLiquidGlassPanelProps<T extends React.ElementType> =
  LiquidGlassPanelProps<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof LiquidGlassPanelProps<T>>;

export const LiquidGlassPanel = React.forwardRef(function LiquidGlassPanel<
  T extends React.ElementType = "div",
>(
  {
    as,
    preset = "default",
    config,
    theme = "auto",
    interactive,
    button,
    className,
    style,
    children,
    ...props
  }: PolymorphicLiquidGlassPanelProps<T>,
  forwardedRef: React.ForwardedRef<any>
) {
  const Component = as || "div";
  const internalRef = React.useRef<HTMLElement | null>(null);

  const activeConfig = React.useMemo(() => resolveGlassConfig(preset, config), [preset, config]);

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
    const el = internalRef.current;
    if (!el) return;

    const handle = createLiquidGlassPanel(el, {
      preset,
      config,
      theme,
      interactive,
      button,
    });

    return () => {
      handle.destroy();
    };
  }, [preset, config, theme, interactive, button]);

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

  return (
    <Component
      ref={setRefs}
      data-liquid-glass="true"
      data-preset={preset}
      className={className}
      style={{
        ...ssrStyle,
        ...style,
      }}
      {...(isButton && !("type" in props) ? { type: "button" } : {})}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}) as <T extends React.ElementType = "div">(
  props: PolymorphicLiquidGlassPanelProps<T> & { ref?: React.ForwardedRef<any> }
) => React.ReactElement | null;
