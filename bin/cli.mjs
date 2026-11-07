#!/usr/bin/env node

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import net from "node:net";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  liquid-glass-fx v${pkg.version}

  Usage:
    liquid-glass-fx [command] [options]

  Commands:
    playground          Launch the interactive Liquid Glass FX playground (default)

  Options:
    -p, --port <port>   Port to listen on (default: 5173)
    --host <host>       Host to bind to (default: localhost)
    --no-open           Do not automatically open the browser
    -v, --version       Display version
    -h, --help          Display this help message
  `);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log(`v${pkg.version}`);
  process.exit(0);
}

const command = args[0] && !args[0].startsWith("-") ? args[0] : "playground";

if (command !== "playground") {
  console.error(`Unknown command: "${command}". Available commands: playground`);
  process.exit(1);
}

// Parse options
let preferredPort = 5173;
let host = "localhost";
let autoOpen = true;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "-p" || arg === "--port") {
    const val = parseInt(args[i + 1], 10);
    if (!isNaN(val)) preferredPort = val;
    i++;
  } else if (arg === "--host") {
    host = args[i + 1] || "localhost";
    i++;
  } else if (arg === "--no-open") {
    autoOpen = false;
  }
}

const playgroundDir = path.resolve(__dirname, "../dist/playground");

if (!fs.existsSync(playgroundDir) || !fs.existsSync(path.join(playgroundDir, "index.html"))) {
  console.error(`
Error: Playground bundle not found at ${playgroundDir}.
If developing locally, run "yarn build" or "npm run build" first to compile the playground assets.
  `);
  process.exit(1);
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function getAvailablePort(startPort, hostToTest) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(getAvailablePort(startPort + 1, hostToTest));
      } else {
        reject(err);
      }
    });
    server.listen(startPort, hostToTest, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
}

function openBrowser(url) {
  const platform = process.platform;
  let cmd = "";
  if (platform === "darwin") {
    cmd = `open "${url}"`;
  } else if (platform === "win32") {
    cmd = `start "" "${url}"`;
  } else {
    cmd = `xdg-open "${url}"`;
  }
  exec(cmd, () => {
    // Ignore error if browser cannot be launched
  });
}

async function startServer() {
  const port = await getAvailablePort(preferredPort, host);

  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Normalize path to prevent directory traversal
    let safePath = path.normalize(path.join(playgroundDir, pathname));
    if (!safePath.startsWith(playgroundDir)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    // Check if path is a directory or doesn't exist
    let stat = null;
    try {
      if (fs.existsSync(safePath)) {
        stat = fs.statSync(safePath);
      }
    } catch {
      stat = null;
    }

    if (stat && stat.isDirectory()) {
      safePath = path.join(safePath, "index.html");
      stat = fs.existsSync(safePath) ? fs.statSync(safePath) : null;
    }

    // SPA fallback: if file does not exist, serve index.html
    if (!stat || !stat.isFile()) {
      safePath = path.join(playgroundDir, "index.html");
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache");

    const stream = fs.createReadStream(safePath);
    stream.on("error", () => {
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
    stream.pipe(res);
  });

  server.listen(port, host, () => {
    const url = `http://${host}:${port}`;
    console.log(`
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   ✨ Liquid Glass FX — Interactive Optical Playground    │
  │                                                          │
  │   Local:   ${url.padEnd(46)}│
  │                                                          │
  │   Press Ctrl+C to exit                                   │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
`);
    if (autoOpen) {
      openBrowser(url);
    }
  });

  const cleanup = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

startServer().catch((err) => {
  console.error("Failed to start playground server:", err);
  process.exit(1);
});

