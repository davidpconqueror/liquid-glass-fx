export const SVG_DEFS_ID = "liquid-glass-svg-defs";
export const SVG_FILTER_ID = "liquid-meniscus-refract";

export function injectGlassSvgDefs(doc: Document = document): SVGElement | null {
  if (typeof doc === "undefined" || !doc.body) {
    return null;
  }

  const existing = doc.getElementById(SVG_DEFS_ID);
  if (existing) {
    return existing as unknown as SVGElement;
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = doc.createElementNS(svgNS, "svg");
  svg.setAttribute("id", SVG_DEFS_ID);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute(
    "style",
    "position: absolute; width: 0; height: 0; pointer-events: none; overflow: hidden;"
  );

  const defs = doc.createElementNS(svgNS, "defs");

  // Meniscus Refraction Filter
  const filter = doc.createElementNS(svgNS, "filter");
  filter.setAttribute("id", SVG_FILTER_ID);
  filter.setAttribute("x", "-20%");
  filter.setAttribute("y", "-20%");
  filter.setAttribute("width", "140%");
  filter.setAttribute("height", "140%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  // Turbulence for micro-surface ripple
  const feTurbulence = doc.createElementNS(svgNS, "feTurbulence");
  feTurbulence.setAttribute("type", "fractalNoise");
  feTurbulence.setAttribute("baseFrequency", "0.04 0.04");
  feTurbulence.setAttribute("numOctaves", "2");
  feTurbulence.setAttribute("result", "noise");
  filter.appendChild(feTurbulence);

  // Displacement Map for ray bending
  const feDisplacementMap = doc.createElementNS(svgNS, "feDisplacementMap");
  feDisplacementMap.setAttribute("in", "SourceGraphic");
  feDisplacementMap.setAttribute("in2", "noise");
  feDisplacementMap.setAttribute("scale", "7");
  feDisplacementMap.setAttribute("xChannelSelector", "R");
  feDisplacementMap.setAttribute("yChannelSelector", "G");
  feDisplacementMap.setAttribute("result", "displaced");
  filter.appendChild(feDisplacementMap);

  // Composite with original
  const feBlend = doc.createElementNS(svgNS, "feBlend");
  feBlend.setAttribute("mode", "normal");
  feBlend.setAttribute("in", "displaced");
  feBlend.setAttribute("in2", "SourceGraphic");
  filter.appendChild(feBlend);

  defs.appendChild(filter);
  svg.appendChild(defs);

  doc.body.appendChild(svg);
  return svg;
}

