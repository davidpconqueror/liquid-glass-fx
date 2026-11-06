import { VS_QUAD, FS_BLIT, FS_BLUR, VS_GLASS, FS_GLASS } from "./shaders";
import type { GlassConfig } from "../types";

interface FBO {
  fbo: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
}

interface FBOSet {
  bg: FBO;
  blurA: FBO;
  blurB: FBO;
}

type UniformMap = Record<string, WebGLUniformLocation | null>;

/**
 * Singleton WebGL pipeline for high-fidelity Liquid Glass Lens rendering.
 * Eliminates WebGL context exhaustion by reusing a single WebGL context across all lenses.
 */
export class LensRenderer {
  private static instance: LensRenderer | null = null;

  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;

  private blitP!: WebGLProgram;
  private blitU!: UniformMap;
  private blurP!: WebGLProgram;
  private blurU!: UniformMap;
  private glassP!: WebGLProgram;
  private glassU!: UniformMap;

  private quadBuf!: WebGLBuffer;
  private panelBuf!: WebGLBuffer;

  private readonly fboCache = new Map<string, FBOSet>();
  private activeFBOs: FBOSet | null = null;
  private bgTex: WebGLTexture | null = null;

  width = 0;
  height = 0;
  contextLost = false;

  static isSupported(): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }

  static getInstance(): LensRenderer {
    if (!LensRenderer.instance) {
      LensRenderer.instance = new LensRenderer();
    }
    return LensRenderer.instance;
  }

  private constructor() {
    if (typeof document === "undefined") {
      throw new Error("LensRenderer cannot be instantiated in non-DOM environments.");
    }

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "none";
    if (document.body) {
      document.body.appendChild(this.canvas);
    }

    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      throw new Error("LiquidGlass: WebGL 1.0 is not supported in this environment.");
    }
    this.gl = gl;

    this.initPrograms();
    this.initBuffers();

    this.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.contextLost = true;
    });

    this.canvas.addEventListener("webglcontextrestored", () => {
      this.contextLost = false;
      this.initPrograms();
      this.initBuffers();
      this.fboCache.clear();
      this.activeFBOs = null;
      this.bgTex = null;
    });
  }

  private initPrograms(): void {
    this.blitP = this.linkProgram(VS_QUAD, FS_BLIT);
    this.blitU = this.getUniforms(this.blitP, ["u_tex", "u_scale", "u_offset"]);

    this.blurP = this.linkProgram(VS_QUAD, FS_BLUR);
    this.blurU = this.getUniforms(this.blurP, ["u_tex", "u_dir"]);

    this.glassP = this.linkProgram(VS_GLASS, FS_GLASS);
    this.glassU = this.getUniforms(this.glassP, [
      "u_bgTex",
      "u_blurTex",
      "u_center",
      "u_size",
      "u_radius",
      "u_res",
      "u_pad",
      "u_scroll",
      "u_refract",
      "u_chroma",
      "u_edgeHL",
      "u_spec",
      "u_fresnel",
      "u_distort",
      "u_alpha",
      "u_sat",
      "u_tint",
      "u_zRadius",
      "u_brightness",
      "u_shadowAlpha",
      "u_shadowSpread",
      "u_shadowOffY",
      "u_bevelMode",
    ]);
  }

  private initBuffers(): void {
    const gl = this.gl;
    this.quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    this.panelBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.panelBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]),
      gl.STATIC_DRAW
    );
  }

  uploadSourceAndBlur(
    source: HTMLCanvasElement | HTMLImageElement,
    width: number,
    height: number,
    blurAmount: number
  ): void {
    if (this.contextLost || width <= 0 || height <= 0) return;
    const gl = this.gl;
    if (!this.setActiveSize(width, height)) return;
    const fboSet = this.activeFBOs!;

    if (!this.bgTex) {
      this.bgTex = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

    // Blit to bgFBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.bg.fbo);
    gl.viewport(0, 0, width, height);
    gl.useProgram(this.blitP);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.uniform1i(this.blitU.u_tex, 0);
    gl.uniform2f(this.blitU.u_scale, 1, 1);
    gl.uniform2f(this.blitU.u_offset, 0, 0);
    this.drawQuad(this.blitP, this.quadBuf);

    // Copy to blurA
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.blurA.fbo);
    gl.viewport(0, 0, fboSet.blurA.w, fboSet.blurA.h);
    gl.bindTexture(gl.TEXTURE_2D, fboSet.bg.tex);
    this.drawQuad(this.blitP, this.quadBuf);

    // Multi-pass Gaussian blur
    if (blurAmount > 0) {
      const spread = blurAmount * 2.5;
      gl.useProgram(this.blurP);
      gl.uniform1i(this.blurU.u_tex, 0);
      for (let i = 0; i < 4; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.blurB.fbo);
        gl.viewport(0, 0, fboSet.blurA.w, fboSet.blurA.h);
        gl.bindTexture(gl.TEXTURE_2D, fboSet.blurA.tex);
        gl.uniform2f(this.blurU.u_dir, spread / fboSet.blurA.w, 0);
        this.drawQuad(this.blurP, this.quadBuf);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.blurA.fbo);
        gl.bindTexture(gl.TEXTURE_2D, fboSet.blurB.tex);
        gl.uniform2f(this.blurU.u_dir, 0, spread / fboSet.blurA.h);
        this.drawQuad(this.blurP, this.quadBuf);
      }
    }
  }

  renderGlass(
    targetCanvas: HTMLCanvasElement,
    config: GlassConfig,
    width: number,
    height: number,
    dpr: number,
    scrollOffset: { x: number; y: number } = { x: 0, y: 0 }
  ): void {
    if (this.contextLost || !this.activeFBOs) return;
    const gl = this.gl;
    const fboSet = this.activeFBOs;

    const w = Math.round(width * dpr);
    const h = Math.round(height * dpr);
    if (w <= 0 || h <= 0) return;
    this.setActiveSize(w, h);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.glassP);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fboSet.bg.tex);
    gl.uniform1i(this.glassU.u_bgTex, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fboSet.blurA.tex);
    gl.uniform1i(this.glassU.u_blurTex, 1);

    gl.uniform2f(this.glassU.u_res, w, h);
    gl.uniform2f(this.glassU.u_center, w * 0.5, h * 0.5);
    gl.uniform2f(this.glassU.u_size, w, h);
    gl.uniform1f(this.glassU.u_radius, config.cornerRadius * dpr);
    gl.uniform1f(this.glassU.u_pad, 0);
    gl.uniform2f(this.glassU.u_scroll, scrollOffset.x * dpr, scrollOffset.y * dpr);
    gl.uniform1f(this.glassU.u_refract, config.refraction);
    gl.uniform1f(this.glassU.u_chroma, config.chromAberration);
    gl.uniform1f(this.glassU.u_edgeHL, config.edgeHighlight);
    gl.uniform1f(this.glassU.u_spec, config.specular);
    gl.uniform1f(this.glassU.u_fresnel, config.fresnel);
    gl.uniform1f(this.glassU.u_distort, config.distortion);
    gl.uniform1f(this.glassU.u_alpha, config.opacity);
    gl.uniform1f(this.glassU.u_sat, config.saturation);
    gl.uniform1f(this.glassU.u_tint, config.tintStrength);
    gl.uniform1f(this.glassU.u_zRadius, config.zRadius * dpr);
    gl.uniform1f(this.glassU.u_brightness, config.brightness);
    gl.uniform1f(this.glassU.u_shadowAlpha, config.shadowOpacity);
    gl.uniform1f(this.glassU.u_shadowSpread, config.shadowSpread * dpr);
    gl.uniform1f(this.glassU.u_shadowOffY, config.shadowOffsetY * dpr);
    gl.uniform1f(this.glassU.u_bevelMode, config.bevelMode);

    this.drawQuad(this.glassP, this.panelBuf);
    gl.disable(gl.BLEND);
    gl.flush();

    // Blit onto target canvas
    const ctx = targetCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(
        this.canvas,
        0,
        this.canvas.height - h,
        w,
        h,
        0,
        0,
        targetCanvas.width,
        targetCanvas.height
      );
    }
  }

  private setActiveSize(w: number, h: number): boolean {
    if (w <= 0 || h <= 0) return false;
    this.width = w;
    this.height = h;

    if (this.canvas.width < w || this.canvas.height < h) {
      this.canvas.width = Math.max(this.canvas.width, w);
      this.canvas.height = Math.max(this.canvas.height, h);
    }

    const key = `${w}x${h}`;
    let fboSet = this.fboCache.get(key);
    if (!fboSet) {
      fboSet = {
        bg: this.makeFBO(w, h),
        blurA: this.makeFBO(w, h),
        blurB: this.makeFBO(w, h),
      };
      this.fboCache.set(key, fboSet);
    }
    this.activeFBOs = fboSet;
    return true;
  }

  private makeFBO(w: number, h: number): FBO {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return { fbo, tex, w, h };
  }

  private drawQuad(prog: WebGLProgram, buf: WebGLBuffer): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const loc = gl.getAttribLocation(prog, "a_pos");
    if (loc !== -1) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disableVertexAttribArray(loc);
    }
  }

  private linkProgram(vsSrc: string, fsSrc: string): WebGLProgram {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSrc);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSrc);
    gl.compileShader(fs);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return prog;
  }

  private getUniforms(prog: WebGLProgram, names: string[]): UniformMap {
    const gl = this.gl;
    const map: UniformMap = {};
    for (const name of names) {
      map[name] = gl.getUniformLocation(prog, name);
    }
    return map;
  }
}
