/**
 * GLSL ES 1.0 Shaders for the Liquid Glass WebGL Lens Engine.
 * Features:
 *   - Rounded-rect SDF with analytical circular bevel heightfield
 *   - Dual-surface Snell's law refraction (Biconvex Pill & Dome Magnifier modes)
 *   - RGB channel dispersion (chromatic aberration)
 *   - Edge-weighted blur/sharp texture blending
 *   - 2-light studio Blinn-Phong specular glints + Schlick Fresnel
 *   - Analytical exponential drop shadow
 */

export const VS_QUAD = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FS_BLIT = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_scale;
uniform vec2 u_offset;
varying vec2 v_uv;
void main() {
  gl_FragColor = texture2D(u_tex, v_uv * u_scale + u_offset);
}
`;

export const FS_BLUR = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_dir;
varying vec2 v_uv;
void main() {
  vec4 s  = texture2D(u_tex, v_uv) * 0.227027;
  s += texture2D(u_tex, v_uv + u_dir * 1.0) * 0.194594;
  s += texture2D(u_tex, v_uv - u_dir * 1.0) * 0.194594;
  s += texture2D(u_tex, v_uv + u_dir * 2.0) * 0.121622;
  s += texture2D(u_tex, v_uv - u_dir * 2.0) * 0.121622;
  s += texture2D(u_tex, v_uv + u_dir * 3.0) * 0.054054;
  s += texture2D(u_tex, v_uv - u_dir * 3.0) * 0.054054;
  s += texture2D(u_tex, v_uv + u_dir * 4.0) * 0.016216;
  s += texture2D(u_tex, v_uv - u_dir * 4.0) * 0.016216;
  gl_FragColor = s;
}
`;

export const VS_GLASS = `
attribute vec2 a_pos;
uniform vec2 u_center;
uniform vec2 u_size;
uniform vec2 u_res;
uniform float u_pad;
uniform vec2 u_scroll;
varying vec2 v_localPx;
varying vec2 v_screenUV;

void main() {
  vec2 total = u_size + vec2(u_pad * 2.0);
  v_localPx = a_pos * total;
  vec2 px = u_center + a_pos * total;
  vec2 scrolledPx = px + u_scroll;
  v_screenUV = vec2(scrolledPx.x / u_res.x, 1.0 - scrolledPx.y / u_res.y);
  vec2 ndc = (px / u_res) * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
}
`;

export const FS_GLASS = `
precision highp float;

uniform sampler2D u_bgTex;
uniform sampler2D u_blurTex;
uniform vec2 u_size;
uniform float u_radius;
uniform vec2 u_res;

uniform float u_refract;
uniform float u_chroma;
uniform float u_edgeHL;
uniform float u_spec;
uniform float u_fresnel;
uniform float u_distort;
uniform float u_alpha;
uniform float u_sat;
uniform float u_tint;
uniform float u_zRadius;
uniform float u_brightness;
uniform float u_shadowAlpha;
uniform float u_shadowSpread;
uniform float u_shadowOffY;
uniform float u_bevelMode;
uniform float u_pad;

varying vec2 v_localPx;
varying vec2 v_screenUV;

float rrSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

float bevelHeight(float d, float bW) {
  if (d <= 0.0) return 0.0;
  if (d >= bW) return bW;
  float t = clamp(d / bW, 0.0, 1.0);
  return sin(t * 1.5707963) * bW;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 half_ = u_size * 0.5;
  float r = min(u_radius, min(half_.x, half_.y));
  float sdf = rrSDF(v_localPx, half_, r);

  // Drop Shadow / Outside boundary
  if (sdf > 0.5) {
    if (u_pad > 0.5) {
      float sdfShadow = rrSDF(v_localPx - vec2(0.0, u_shadowOffY), half_, r);
      float d = max(sdfShadow - 1.0, 0.0);
      float spread = max(u_shadowSpread, 1.0);
      float falloff = 1.0 / (spread * spread);
      float outerShadow = exp(-d * d * falloff) * 0.65;
      float contactShadow = exp(-d * 0.08 / max(spread * 0.04, 0.01)) * 0.35;
      float shadow = (outerShadow + contactShadow) * u_shadowAlpha;
      gl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
    } else {
      gl_FragColor = vec4(0.0);
    }
    return;
  }

  // Anti-aliased boundary mask
  float mask = 1.0 - smoothstep(-1.0, 0.5, sdf);
  float maxD = min(half_.x, half_.y);
  float inside = -sdf;

  // Bevel perimeter curvature width
  float bW = min(max(u_zRadius * 0.35, 6.0), maxD * 0.45);
  float edge = 1.0 - smoothstep(0.0, bW, inside);

  // Analytical bevel surface normal via gradient finite differences
  float e = 1.5;
  float dC = inside;
  float dR = -rrSDF(v_localPx + vec2(e, 0.0), half_, r);
  float dL = -rrSDF(v_localPx - vec2(e, 0.0), half_, r);
  float dU = -rrSDF(v_localPx + vec2(0.0, e), half_, r);
  float dD = -rrSDF(v_localPx - vec2(e, 0.0), half_, r);
  float hC = bevelHeight(dC, bW);
  float hR = bevelHeight(dR, bW);
  float hL = bevelHeight(dL, bW);
  float hU = bevelHeight(dU, bW);
  float hD = bevelHeight(dD, bW);
  vec2 hGrad = vec2(hR - hL, hU - hD) / (2.0 * e);
  vec3 N = normalize(vec3(-hGrad, 1.0));

  float depth = smoothstep(0.0, bW, inside);

  // Dual-surface Snell's law refraction approximation
  vec2 pxToUV = vec2(1.0, -1.0) / max(u_res, vec2(1.0));
  float ior = 1.5;
  float refrPow = 1.0 - 1.0 / ior;
  vec2 refrPx;

  if (u_bevelMode < 0.5) {
    // Mode 0: Biconvex pill lens
    vec2 exitRefr = hGrad * refrPow;
    refrPx = exitRefr * u_refract * min(bW * 0.65, 10.0);
    vec2 centerDir = -v_localPx / max(half_, vec2(1.0));
    refrPx += centerDir * u_refract * 1.5 * (1.0 - depth);
  } else {
    // Mode 1: Dome magnifier
    refrPx = -v_localPx * u_refract * depth * 0.25;
  }
  vec2 refr = refrPx * pxToUV;

  // Subtle micro-surface distortion
  vec2 ns = v_localPx * 0.08;
  vec2 micro = (vec2(hash(ns), hash(ns + vec2(37.0))) - 0.5) * u_distort * 2.0 * pxToUV;

  // Chromatic dispersion (RGB offset along surface normal)
  float caS = u_chroma * 8.0 * edge;
  vec2 caD = N.xy * caS * pxToUV;
  vec2 base = clamp(v_screenUV + refr + micro, 0.001, 0.999);

  vec3 sharp = vec3(
    texture2D(u_bgTex, clamp(base + caD, 0.001, 0.999)).r,
    texture2D(u_bgTex, base).g,
    texture2D(u_bgTex, clamp(base - caD, 0.001, 0.999)).b
  );
  vec3 blur = vec3(
    texture2D(u_blurTex, clamp(base + caD, 0.001, 0.999)).r,
    texture2D(u_blurTex, base).g,
    texture2D(u_blurTex, clamp(base - caD, 0.001, 0.999)).b
  );

  // Edge-weighted blur mix
  float edgeMix = 1.0 - edge * 0.35;
  vec3 col = mix(sharp, blur, edgeMix);

  // Exposure & Saturation
  col *= 1.0 + u_brightness;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 1.0 + u_sat);

  // Optical glass tint
  col = mix(col, col * vec3(0.92, 0.95, 1.05), u_tint);
  col *= 1.0 + 0.03 * depth;

  // Schlick Fresnel at grazing angles
  float fres = pow(1.0 - abs(N.z), 3.5) * u_fresnel;

  // 2-light studio Blinn-Phong specular glints
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(0.45, 0.65, 0.75));
  float sp1 = pow(max(dot(N, normalize(L1 + V)), 0.0), 36.0) * 0.55;
  vec3 L2 = normalize(vec3(-0.45, 0.55, 0.70));
  float sp2 = pow(max(dot(N, normalize(L2 + V)), 0.0), 24.0) * 0.35;
  float totalSpec = (sp1 + sp2) * u_spec;

  // Perimeter rim sheen
  float rim = edge * u_edgeHL * 0.15;
  float innerGlow = smoothstep(3.0, 0.0, -sdf) * u_edgeHL * 0.10;
  float envRefl = (N.y * 0.5 + 0.5) * fres * 0.05;

  // Final optical composite
  vec3 fin = col;
  fin += vec3(totalSpec);
  fin += vec3(rim + innerGlow);
  fin += vec3(envRefl);
  fin = mix(fin, vec3(1.0), fres * 0.12);

  gl_FragColor = vec4(fin, mask * u_alpha);
}
`;
