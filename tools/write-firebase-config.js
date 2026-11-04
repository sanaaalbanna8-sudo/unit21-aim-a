const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "..", "unit11", "js", "firebase-config.js");
const raw = process.env.FIREBASE_CONFIG;

if (!raw) {
  console.log("FIREBASE_CONFIG is not set. The existing firebase-config.js stays.");
  process.exit(0);
}

let cfg;
try {
  cfg = JSON.parse(raw);
} catch (err) {
  console.error("FIREBASE_CONFIG is not valid JSON.");
  process.exit(1);
}

if (!cfg.apiKey || !cfg.projectId) {
  console.error("FIREBASE_CONFIG needs apiKey and projectId.");
  process.exit(1);
}

const safe = {
  apiKey: cfg.apiKey,
  authDomain: cfg.authDomain || "",
  projectId: cfg.projectId,
  storageBucket: cfg.storageBucket || "",
  messagingSenderId: cfg.messagingSenderId || "",
  appId: cfg.appId || ""
};

fs.writeFileSync(out, "window.U11_FIREBASE = " + JSON.stringify(safe) + ";\n");
console.log("Wrote unit11/js/firebase-config.js");
