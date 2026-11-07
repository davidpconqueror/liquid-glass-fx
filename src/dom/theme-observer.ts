/**
 * Theme observer and detector for liquid-glass-fx.
 *
 * Provides shared, singleton-based observation of DOM theme changes
 * (such as <html class="dark"> or <html data-theme="dark">) and
 * system prefers-color-scheme media queries.
 */

export function resolveIsDark(theme: "dark" | "light" | "auto" = "auto"): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  const docEl = document.documentElement;
  if (docEl.classList.contains("dark")) return true;
  if (docEl.getAttribute("data-theme") === "dark") return true;

  if (typeof window.matchMedia === "function") {
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      // ignore matchMedia errors in non-browser environments
    }
  }

  return false;
}

type ThemeListener = () => void;

const listeners = new Set<ThemeListener>();
let observer: MutationObserver | null = null;
let mediaQuery: MediaQueryList | null = null;
let mediaListener: (() => void) | null = null;

function notifyListeners() {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      // ignore
    }
  }
}

/**
 * Subscribes to document and system theme changes for "auto" theme mode.
 * Uses a single shared MutationObserver on document.documentElement
 * and a single MediaQueryList listener.
 */
export function subscribeToAutoTheme(listener: ThemeListener): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  listeners.add(listener);

  if (!observer && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(() => {
      notifyListeners();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
  }

  if (!mediaQuery && typeof window.matchMedia === "function") {
    try {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaListener = () => {
        notifyListeners();
      };
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", mediaListener);
      } else if (typeof (mediaQuery as any).addListener === "function") {
        (mediaQuery as any).addListener(mediaListener);
      }
    } catch {
      // ignore
    }
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (mediaQuery && mediaListener) {
        if (typeof mediaQuery.removeEventListener === "function") {
          mediaQuery.removeEventListener("change", mediaListener);
        } else if (typeof (mediaQuery as any).removeListener === "function") {
          (mediaQuery as any).removeListener(mediaListener);
        }
        mediaQuery = null;
        mediaListener = null;
      }
    }
  };
}
