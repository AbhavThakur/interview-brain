const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_URL = 'https://github.com/BaffinLee/leetcode-javascript.git';
const TEMP_DIR = path.join('/tmp', 'baffinlee-repo-' + Date.now());
const ROOT_DIR = path.resolve(__dirname, '..');
const ROOT_OUT = path.join(ROOT_DIR, 'leetcode-solutions.json');
const WEB_OUT = path.join(ROOT_DIR, 'web', 'content', 'leetcode-solutions.json');

console.log('🚀 Cloning BaffinLee/leetcode-javascript shallow repository...');
try {
  execSync(`git clone --depth 1 ${REPO_URL} ${TEMP_DIR}`, { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to clone repository:', err.message);
  process.exit(1);
}

console.log('📦 Parsing problem markdown files...');
const folders = fs.readdirSync(TEMP_DIR).filter(f => /^\d+-\d+$/.test(f));
const problems = [];

folders.forEach(folder => {
  const folderPath = path.join(TEMP_DIR, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const raw = fs.readFileSync(path.join(folderPath, file), 'utf8');

    const idMatch = raw.match(/#\s*(\d+)\./);
    const titleMatch = raw.match(/#\s*\d+\.\s*(.+)/);
    const diffMatch = raw.match(/-\s*Difficulty:\s*([^.\n]+)/i);
    const topicsMatch = raw.match(/-\s*Related Topics:\s*([^.\n]+)/i);
    const similarMatch = raw.match(/-\s*Similar Questions:\s*([^.\n]+)/i);
    const probMatch = raw.match(/## Problem([\s\S]*?)## Solution/);
    const codeMatch = raw.match(/```javascript([\s\S]*?)```/);
    const explainMatch = raw.match(/\*\*Explain:\*\*([\s\S]*?)\*\*Complexity:\*\*/);
    const timeMatch = raw.match(/Time complexity\s*:\s*([^.\n]+)/i);
    const spaceMatch = raw.match(/Space complexity\s*:\s*([^.\n]+)/i);

    if (idMatch && titleMatch) {
      const id = parseInt(idMatch[1], 10);
      const title = titleMatch[1].trim();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      let difficulty = 'Medium';
      if (diffMatch) {
        const d = diffMatch[1].trim().toLowerCase();
        if (d.includes('easy')) difficulty = 'Easy';
        else if (d.includes('hard')) difficulty = 'Hard';
        else if (d.includes('medium')) difficulty = 'Medium';
      }

      const topics = topicsMatch 
        ? topicsMatch[1].split(',').map(t => t.trim().replace(/\.$/, '')).filter(Boolean)
        : [];

      const similarQuestions = similarMatch
        ? similarMatch[1].split(',').map(t => t.trim().replace(/\.$/, '')).filter(Boolean)
        : [];

      const problemText = probMatch ? probMatch[1].trim() : '';
      const solutionCode = codeMatch ? codeMatch[1].trim() : '';
      const explanation = explainMatch 
        ? explainMatch[1].replace(/nope\./gi, '').trim() 
        : '';

      const timeComplexity = timeMatch ? timeMatch[1].trim().replace(/\.$/, '') : '';
      const spaceComplexity = spaceMatch ? spaceMatch[1].trim().replace(/\.$/, '') : '';

      problems.push({
        id,
        title,
        slug,
        difficulty,
        topics,
        similarQuestions,
        problemText,
        solutionCode,
        explanation,
        timeComplexity,
        spaceComplexity,
        leetcodeUrl: `https://leetcode.com/problems/${slug}/`,
        baffinleeUrl: `https://baffinlee.com/leetcode-javascript/problem/${slug}.html`,
        githubUrl: `https://github.com/BaffinLee/leetcode-javascript/blob/master/${folder}/${encodeURIComponent(file)}`
      });
    }
  });
});

// Sort by ID ascending
problems.sort((a, b) => a.id - b.id);

console.log(`✅ Parsed ${problems.length} problems successfully!`);

// Statistics
const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
const allTopics = new Set();
problems.forEach(p => {
  diffCounts[p.difficulty] = (diffCounts[p.difficulty] || 0) + 1;
  p.topics.forEach(t => allTopics.add(t));
});

console.log('📊 Breakdown:', diffCounts);
console.log(`🏷️ Unique Topic Tags: ${allTopics.size}`);

// Write JSON files
const jsonStr = JSON.stringify(problems, null, 2);
fs.writeFileSync(ROOT_OUT, jsonStr, 'utf8');
console.log(`💾 Saved to ${ROOT_OUT} (${(Buffer.byteLength(jsonStr) / 1024).toFixed(1)} KB)`);

// Ensure web/content exists
const webContentDir = path.dirname(WEB_OUT);
if (!fs.existsSync(webContentDir)) {
  fs.mkdirSync(webContentDir, { recursive: true });
}
fs.writeFileSync(WEB_OUT, jsonStr, 'utf8');
console.log(`💾 Saved to ${WEB_OUT}`);

// Cleanup temporary clone
console.log('🧹 Cleaning up temporary repository...');
try {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
} catch (err) {
  // ignore
}

console.log('🎉 Done! LeetCode solutions offline database is ready.');
