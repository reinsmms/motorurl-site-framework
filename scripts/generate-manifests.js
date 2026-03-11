// scripts/generate-manifests.js
// Generate per-subject manifest.json files + assets/index.json for Gallery Index.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogg"]);

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name);
}

function sortCaseInsensitive(a, b) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function buildManifest(subjectDirName) {
  const subjectDir = path.join(ASSETS, subjectDirName);
  const rootFiles = listFiles(subjectDir);
  const videosDir = path.join(subjectDir, "videos");
  const videoFiles = listFiles(videosDir).map(f => `videos/${f}`);

  const all = rootFiles.concat(videoFiles).sort(sortCaseInsensitive);

  const items = all.flatMap((file) => {
    const ext = path.extname(file).toLowerCase();
    if (IMAGE_EXT.has(ext)) return [{ type: "image", file }];
    if (VIDEO_EXT.has(ext)) return [{ type: "video", file }];
    return [];
  });

  return { basePath: `assets/${subjectDirName}`, items };
}

function main() {
  if (!fs.existsSync(ASSETS)) {
    console.error("No assets folder found.");
    process.exit(1);
  }

  const subjects = fs.readdirSync(ASSETS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => !name.startsWith("."))
    .sort(sortCaseInsensitive);

  // assets/index.json for Gallery Index page
  const index = { subjects: subjects.map(name => ({ name, path: `assets/${name}` })) };
  fs.writeFileSync(path.join(ASSETS, "index.json"), JSON.stringify(index, null, 2), "utf8");

  // per-subject manifests
  let count = 0;
  for (const subject of subjects) {
    const manifest = buildManifest(subject);
    fs.writeFileSync(path.join(ASSETS, subject, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
    count++;
  }

  console.log(`Generated ${count} manifest(s) + assets/index.json.`);
}

main();
