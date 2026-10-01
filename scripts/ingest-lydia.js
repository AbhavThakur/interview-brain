#!/usr/bin/env node

/**
 * Ingestion script to parse all 155 JavaScript interview questions
 * from Lydia Hallie's open-source repository (https://github.com/lydiahallie/javascript-questions)
 * into a structured, 100% offline JSON asset.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const RAW_URL = 'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';
const ROOT_OUTPUT = path.join(__dirname, '..', 'javascript-questions.json');
const WEB_OUTPUT = path.join(__dirname, '..', 'web', 'content', 'javascript-questions.json');

function inferTags(title, code, explanation) {
  const combined = `${title} ${code || ''} ${explanation}`.toLowerCase();
  const tags = [];

  if (/event loop|macrotask|microtask|settimeout|setinterval|queue/.test(combined)) tags.push('event-loop');
  if (/hoist|temporal dead zone|tdz|var\s+|let\s+|const\s+/.test(combined)) tags.push('hoisting');
  if (/closure|lexical scope|enclosing scope/.test(combined)) tags.push('closures');
  if (/\bthis\b|call\(|apply\(|bind\(|arrow function/.test(combined)) tags.push('this-binding');
  if (/prototype|__proto__|inheritance|\bclass\b|constructor/.test(combined)) tags.push('prototypes');
  if (/promise|async\s+|await|resolve|reject|\.then\(/.test(combined)) tags.push('async-promises');
  if (/coercion|implicit|typeof|instanceof|nan|boolean\(|number\(|string\(|==|===/.test(combined)) tags.push('type-coercion');
  if (/object\.freeze|object\.seal|object\.assign|destructur|object key|shallow copy|deep copy/.test(combined)) tags.push('objects');
  if (/reduce|array|\.map\(|\.filter\(|\.push\(|\.pop\(|\.slice\(|\.splice\(|spread/.test(combined)) tags.push('arrays');
  if (/generator|yield\*?|iterator|iterable/.test(combined)) tags.push('generators');
  if (/garbage collection|memory leak|reference count/.test(combined)) tags.push('memory');
  if (/import\s+|export\s+|module/.test(combined)) tags.push('modules');

  if (tags.length === 0) tags.push('fundamentals');
  return tags;
}

function inferDifficulty(id, tags) {
  if (['generators', 'memory', 'prototypes'].some(t => tags.includes(t))) return 'Hard';
  if (['event-loop', 'closures', 'this-binding', 'async-promises'].some(t => tags.includes(t))) return 'Medium';
  return 'Easy';
}

console.log('Fetching Lydia Hallie JavaScript questions from upstream GitHub...');

https.get(RAW_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to fetch: HTTP ${res.statusCode}`);
    process.exit(1);
  }

  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const rawQuestions = data.match(/######\s+[0-9]+\.\s+[\s\S]*?(?=(?:######\s+[0-9]+\.|$))/g) || [];
    console.log(`Found ${rawQuestions.length} raw question blocks.`);

    const questions = [];

    rawQuestions.forEach((qText, idx) => {
      const idMatch = qText.match(/######\s+([0-9]+)\.\s+(.*)/);
      const id = idMatch ? parseInt(idMatch[1], 10) : idx + 1;
      const title = idMatch ? idMatch[2].trim() : "What's the output?";

      const codeMatch = qText.match(/```(?:javascript|js)?\r?\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : null;

      const optionMatches = [...qText.matchAll(/-\s+([A-Z]):\s+(.*)/g)];
      const options = optionMatches.map(m => ({
        key: m[1],
        text: m[2].trim()
      }));

      const ansMatch = qText.match(/####\s+Answer(?::\s*|\s+)([A-Z])/i);
      const answer = ansMatch ? ansMatch[1].toUpperCase() : 'A';

      const detailsMatch = qText.match(/<details>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/details>/i);
      let explanation = detailsMatch ? detailsMatch[1].trim() : '';
      explanation = explanation.replace(/^####\s+Answer.*?\r?\n+/i, '').trim();

      // Normalize HTML tags to markdown
      explanation = explanation
        .replace(/<img[^>]+src="([^">]+)"[^>]*>/gi, '\n\n![]($1)\n\n')
        .replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
        .replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
        .trim();

      const tags = inferTags(title, code, explanation);
      const difficulty = inferDifficulty(id, tags);

      questions.push({
        id,
        title,
        code,
        options,
        answer,
        explanation,
        tags,
        difficulty,
        source: 'https://github.com/lydiahallie/javascript-questions'
      });
    });

    console.log(`Successfully parsed ${questions.length} questions.`);

    const jsonContent = JSON.stringify(questions, null, 2);

    fs.writeFileSync(ROOT_OUTPUT, jsonContent, 'utf-8');
    console.log(`Saved to ${ROOT_OUTPUT} (${(jsonContent.length / 1024).toFixed(1)} KB)`);

    const webDir = path.dirname(WEB_OUTPUT);
    if (!fs.existsSync(webDir)) {
      fs.mkdirSync(webDir, { recursive: true });
    }
    fs.writeFileSync(WEB_OUTPUT, jsonContent, 'utf-8');
    console.log(`Synchronized to ${WEB_OUTPUT}`);

    // Summary stats
    const tagCounts = {};
    questions.forEach(q => q.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
    console.log('Top Topics:', Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).slice(0, 8));
  });
}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
  process.exit(1);
});
