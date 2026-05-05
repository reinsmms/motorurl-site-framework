#!/usr/bin/env node
/**
 * MotorURL hybrid nav generator
 * Generates scripts/nav-data.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, 'scripts', 'nav-data.js');

const CONTENT_SECTIONS = [
  { title: '3D Printing Fundamentals', folder: 'pages/3d-printing-fundamentals' },
  { title: 'Printers', folder: 'pages/printers', fallbackFile: 'pages/printers.html' },
  { title: 'Filament', folder: 'pages/filament', fallbackFile: 'pages/filament.html' },
  { title: 'Projects', folder: 'pages/projects', fallbackFile: 'pages/projects.html' },
  { title: 'Troubleshooting', folder: 'pages/troubleshooting', fallbackFile: 'pages/troubleshooting.html' }
];

const SOFTWARE_SECTIONS = [
  { title: 'Bambu Studio', folder: 'pages/software/bambu-studio' },
  { title: 'FreeCAD', folder: 'pages/software/freecad' },
  { title: 'Autodesk Fusion', folder: 'pages/software/autodesk-fusion' }
];

const TITLE_OVERRIDES = {
  '3mf': '3MF',
  'a1': 'A1',
  'ams': 'AMS',
  'api': 'API',
  'cad': 'CAD',
  'css': 'CSS',
  'gcode': 'G-code',
  'html': 'HTML',
  'lan': 'LAN',
  'pc': 'PC',
  'petg': 'PETG',
  'pla': 'PLA',
  'ptfe': 'PTFE',
  'stl': 'STL',
  'toc': 'TOC',
  'tpu': 'TPU',
  'ui': 'UI',
  'usb': 'USB',
  'xy': 'X-Y',
  'z': 'Z'
};

const FOLDER_TITLE_OVERRIDES = {
  'quick-reference': 'Quick Reference',
  'menus-preferences': 'Menus & Preferences',
  'main-mode-tabs': 'Main Mode Tabs',
  'key-features': 'Key Features',
  'update-history': 'Update History',
  'core-concepts': 'Core Concepts',
  'getting-started': 'Getting Started',
  'mesh-stl': 'Mesh / STL',
  'process-settings': 'Process Settings',
  '3d-printing-fundamentals': '3D Printing Fundamentals'
};

const IGNORED_DIRS = new Set(['.git', '.github', '_archive', '_Archive', 'archive', 'Archive']);

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function isHtmlFile(name) {
  return name.toLowerCase().endsWith('.html');
}

function toUrl(absPath) {
  return path.relative(ROOT, absPath).replace(/\\/g, '/');
}

function titleFromSlug(slug) {
  const base = slug.replace(/\.html$/i, '');
  if (base.toLowerCase() === 'index') return 'Overview';

  return base
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (TITLE_OVERRIDES[lower]) return TITLE_OVERRIDES[lower];
      if (/^\d+$/.test(word)) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function titleFromFolder(folderName) {
  const lower = folderName.toLowerCase();
  if (FOLDER_TITLE_OVERRIDES[lower]) return FOLDER_TITLE_OVERRIDES[lower];
  return titleFromSlug(folderName);
}

function readDirSafe(absDir) {
  if (!fs.existsSync(absDir)) return [];
  return fs.readdirSync(absDir, { withFileTypes: true });
}

function sortNavItems(a, b) {
  if (a.title === 'Overview') return -1;
  if (b.title === 'Overview') return 1;
  return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
}

function scanRecursiveFolder(relFolder) {
  const absDir = path.join(ROOT, relFolder);
  const entries = readDirSafe(absDir);

  const files = entries
    .filter((entry) => entry.isFile() && isHtmlFile(entry.name))
    .map((entry) => {
      const absPath = path.join(absDir, entry.name);
      return {
        title: titleFromSlug(entry.name),
        url: toUrl(absPath)
      };
    });

  const folders = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && !IGNORED_DIRS.has(entry.name))
    .map((entry) => {
      const childRel = path.join(relFolder, entry.name).replace(/\\/g, '/');
      const children = scanRecursiveFolder(childRel);
      return {
        title: titleFromFolder(entry.name),
        children
      };
    })
    .filter((item) => item.children && item.children.length > 0);

  return [...files, ...folders].sort(sortNavItems);
}

function buildContentSection(section) {
  const children = scanRecursiveFolder(section.folder);
  if (children.length > 0) {
    return { title: section.title, children };
  }
  if (section.fallbackFile && exists(section.fallbackFile)) {
    return { title: section.title, url: section.fallbackFile.replace(/\\/g, '/') };
  }
  return { title: section.title, children: [] };
}

function buildSoftwareSection(section) {
  const children = scanRecursiveFolder(section.folder);
  if (children.length > 0) {
    return { title: section.title, children };
  }
  const indexFile = `${section.folder}/index.html`;
  if (exists(indexFile)) {
    return { title: section.title, url: indexFile };
  }
  return { title: section.title, children: [] };
}

function buildNavData() {
  const nav = [];
  if (exists('pages/home.html')) {
    nav.push({ title: 'Home', url: 'pages/home.html' });
  }
  CONTENT_SECTIONS.forEach((section) => {
    nav.push(buildContentSection(section));
  });
  nav.push({
    title: 'Software',
    children: SOFTWARE_SECTIONS.map(buildSoftwareSection)
  });
  return nav;
}

function writeNavData(nav) {
  const content = 'const NAV_DATA = ' + JSON.stringify(nav, null, 2) + ';\n';
  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_FILE)}`);
}

const nav = buildNavData();
writeNavData(nav);
