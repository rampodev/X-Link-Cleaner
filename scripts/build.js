const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const zip = "dist/x-link-cleaner.zip";
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const files = ["manifest.json", ...manifest.content_scripts.flatMap((script) => script.js)];

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.rmSync(path.join(root, zip), { force: true });

if (process.platform === "win32") {
  const tar = path.join(process.env.SystemRoot, "System32", "tar.exe");
  execFileSync(tar, ["-a", "-c", "-f", zip, ...files], { cwd: root });
} else {
  execFileSync("zip", ["-q", zip, ...files], { cwd: root });
}

console.log(`Wrote ${zip}`);
