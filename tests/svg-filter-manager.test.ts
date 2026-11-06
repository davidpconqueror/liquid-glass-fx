import { describe, it, expect, beforeEach } from "vitest";
import { injectGlassSvgDefs, SVG_FILTER_ID } from "../src/dom/svg-filter-manager";

describe("SVG Filter Manager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should inject SVG defs element into document.body", () => {
    const svg = injectGlassSvgDefs();
    expect(svg).not.toBeNull();
    expect(svg?.id).toBe("liquid-glass-svg-defs");
    expect(document.getElementById("liquid-glass-svg-defs")).toBe(svg);

    // Verify filter element
    const filter = document.getElementById(SVG_FILTER_ID);
    expect(filter).not.toBeNull();
    expect(filter?.tagName.toLowerCase()).toBe("filter");
  });

  it("should be idempotent and not inject duplicate SVG elements", () => {
    const svg1 = injectGlassSvgDefs();
    const svg2 = injectGlassSvgDefs();

    expect(svg1).toBe(svg2);
    const elements = document.querySelectorAll("#liquid-glass-svg-defs");
    expect(elements.length).toBe(1);
  });
});
