const fs = require('fs');
const path = require('path');

const dirs = ['01-topics', '02-qa-bank', '03-stories', '04-companies', '05-coding'];
const srcRoot = path.join(__dirname, '..');
const destRoot = path.join(__dirname, 'content');

if (!fs.existsSync(destRoot)) {
  fs.mkdirSync(destRoot, { recursive: true });
}

dirs.forEach(dir => {
  const src = path.join(srcRoot, dir);
  const dest = path.join(destRoot, dir);
  if (fs.existsSync(src)) {
    console.log(`Copying ${dir} to ${dest}...`);
    fs.cpSync(src, dest, { recursive: true, force: true });
  } else {
    console.log(`Source directory ${src} not found, skipping.`);
  }
});
