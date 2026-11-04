const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "site");
const onlyUnit11 = process.env.SITE_NAME === "unit11-cyber";
const skip = new Set(["site", ".git", "node_modules"]);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (onlyUnit11) {
  copyDir(path.join(root, "unit11"), out);
  console.log("Published Unit 11 at the site root.");
} else {
  copyDir(root, out);
  console.log("Published the repository root. Unit 21 stays at / and Unit 11 at /unit11/.");
}
