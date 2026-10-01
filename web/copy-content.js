/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const dirs = [
  "01-topics",
  "02-qa-bank",
  "03-stories",
  "04-companies",
  "05-coding",
  "06-system-design",
];
const srcRoot = path.join(__dirname, "..");
const destRoot = path.join(__dirname, "content");

if (!fs.existsSync(destRoot)) {
  fs.mkdirSync(destRoot, { recursive: true });
}

dirs.forEach((dir) => {
  const src = path.join(srcRoot, dir);
  const dest = path.join(destRoot, dir);
  if (fs.existsSync(src)) {
    console.log(`Copying ${dir} to ${dest}...`);
    fs.cpSync(src, dest, { recursive: true, force: true });
  } else {
    console.log(`Source directory ${src} not found, skipping.`);
  }
});

// Also copy root resources.json if it exists
const rootResources = path.join(srcRoot, "resources.json");
const destResources = path.join(destRoot, "resources.json");
if (fs.existsSync(rootResources)) {
  fs.copyFileSync(rootResources, destResources);
  console.log(`Copied resources.json to ${destResources}`);
}

// Also copy root leetcode-solutions.json if it exists
const rootSolutions = path.join(srcRoot, "leetcode-solutions.json");
const destSolutions = path.join(destRoot, "leetcode-solutions.json");
if (fs.existsSync(rootSolutions)) {
  fs.copyFileSync(rootSolutions, destSolutions);
  console.log(`Copied leetcode-solutions.json to ${destSolutions}`);
}

// Also copy root javascript-questions.json if it exists
const rootLydia = path.join(srcRoot, "javascript-questions.json");
const destLydia = path.join(destRoot, "javascript-questions.json");
if (fs.existsSync(rootLydia)) {
  fs.copyFileSync(rootLydia, destLydia);
  console.log(`Copied javascript-questions.json to ${destLydia}`);
}

// Also copy root classic-algorithms.json if it exists
const rootClassic = path.join(srcRoot, "classic-algorithms.json");
const destClassic = path.join(destRoot, "classic-algorithms.json");
if (fs.existsSync(rootClassic)) {
  fs.copyFileSync(rootClassic, destClassic);
  console.log(`Copied classic-algorithms.json to ${destClassic}`);
}
