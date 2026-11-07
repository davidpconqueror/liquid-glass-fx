import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

describe("CLI Playground Runner", () => {
  const cliPath = path.resolve(__dirname, "../bin/cli.mjs");
  const pkgPath = path.resolve(__dirname, "../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  it("should have executable CLI file", () => {
    expect(fs.existsSync(cliPath)).toBe(true);
  });

  it("should return version with --version", () => {
    const output = execFileSync(process.execPath, [cliPath, "--version"], {
      encoding: "utf-8",
      timeout: 10000,
    });
    expect(output.trim()).toBe(`v${pkg.version}`);
  }, 15000);

  it("should return help message with --help", () => {
    const output = execFileSync(process.execPath, [cliPath, "--help"], {
      encoding: "utf-8",
      timeout: 10000,
    });
    expect(output).toContain("Usage:");
    expect(output).toContain("playground");
    expect(output).toContain("--port");
  }, 15000);

  it("should declare bin entry in package.json", () => {
    expect(pkg.bin).toBeDefined();
    expect(pkg.bin["liquid-glass-fx"]).toBe("./bin/cli.mjs");
    expect(pkg.files).toContain("bin");
  });
});
