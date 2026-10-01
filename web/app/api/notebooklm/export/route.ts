import { NextRequest } from 'next/server';
import { 
  getAllSystemDesign, 
  getAllStories, 
  getAllQuestions, 
  getAllTopics, 
  getAllPrepDocs,
  getAllEnhancedCodes 
} from '@/lib/markdown';
import { GRIND_75_PROBLEMS } from '@/lib/grind75Data';
import { TOP_30_BEHAVIORAL_QUESTIONS, REVERSE_INTERVIEW_QUESTIONS } from '@/lib/behavioralData';
import { getAllLeetCodeSolutions } from '@/lib/leetcodeSolutions';
import { getAllJavaScriptQuestions } from '@/lib/javascriptQuestions';
import { getAllClassicAlgorithms } from '@/lib/classicAlgorithms';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pack = searchParams.get('pack') || 'master';

  let content = '';
  let filename = 'interview-brain-source-pack.md';

  if (pack === 'system-design') {
    filename = 'interview-brain-system-design-pack.md';
    const docs = getAllSystemDesign();
    
    content = `# 📐 Interview Brain: Complete System Design & Distributed Architecture Grounding Pack\n\n`;
    content += `> Generated for Google NotebookLM Grounded AI Research & Audio Overview Podcasts.\n`;
    content += `> Total Architecture Blueprints: ${docs.length}\n\n`;
    content += `---\n\n`;

    docs.forEach(doc => {
      content += `## Blueprint: ${doc.title}\n`;
      content += `**Category:** ${doc.category || 'Architecture'} | **Difficulty:** ${doc.difficulty || 'Senior / Staff'}\n`;
      if (doc.tags && doc.tags.length > 0) {
        content += `**Tags:** ${doc.tags.join(', ')}\n`;
      }
      content += `\n${doc.content}\n\n`;
      content += `---\n\n`;
    });

  } else if (pack === 'grind75') {
    filename = 'interview-brain-grind75-pack.md';
    
    content = `# 🧠 Interview Brain: Grind 75 & Defensive Corner Cases Grounding Pack\n\n`;
    content += `> Generated for Google NotebookLM Grounded AI Code Review & Socratic DSA Drills.\n`;
    content += `> Total Curated Problems: ${GRIND_75_PROBLEMS.length}\n\n`;
    content += `---\n\n`;

    content += `## 1. Complete Grind 75 Algorithmic Problem Index\n\n`;
    GRIND_75_PROBLEMS.forEach((p, idx) => {
      content += `### ${idx + 1}. ${p.title} (${p.difficulty})\n`;
      content += `- **Pattern / Category:** ${p.pattern}\n`;
      content += `- **Estimated Time:** ${p.timeMinutes} mins\n`;
      if (p.leetcodeUrl) content += `- **LeetCode URL:** ${p.leetcodeUrl}\n`;
      if (p.ahHaInsight) content += `- **💡 Ah-Ha Mental Model:** ${p.ahHaInsight}\n`;
      content += `\n`;
    });

    content += `\n---\n\n`;
    content += `## 2. Complete Algorithmic Corner Cases & Defensive Coding Matrix\n\n`;
    content += `### 📦 Arrays & Strings Corner Cases:\n`;
    content += `- **Empty Array / Null:** nums.length === 0 or empty string "".\n`;
    content += `- **Single Element:** Array with 1 item, string with 1 char.\n`;
    content += `- **Two Elements:** Minimum required for two-pointer or interval overlaps.\n`;
    content += `- **All Duplicates:** Array with identical elements (e.g. [1, 1, 1, 1]).\n`;
    content += `- **Negative & Zero Values:** Subarray products, target sums, and division operations.\n`;
    content += `- **String Whitespaces & Cases:** Leading/trailing spaces, non-alphanumeric chars, uppercase vs lowercase.\n\n`;

    content += `### 🔗 Linked Lists Corner Cases:\n`;
    content += `- **Empty List:** head === null.\n`;
    content += `- **Single Node List:** head.next === null.\n`;
    content += `- **Cycles in List:** Circular reference causing infinite while loops (use fast/slow pointers).\n`;
    content += `- **Odd vs Even Length:** Finding middle element behavior (fast !== null && fast.next !== null).\n`;
    content += `- **Modifying Head:** Always use a dummyHead when insertion/deletion might alter head.\n\n`;

    content += `### 🌲 Binary Trees & BSTs Corner Cases:\n`;
    content += `- **Empty Tree:** root === null.\n`;
    content += `- **Skewed Tree:** Tree degenerates into linked list (all nodes only have right or only left child -> stack overflow risk).\n`;
    content += `- **BST Validation:** Subtree values violating ancestor boundaries (carry min/max bounds in recursion).\n`;
    content += `- **Negative Node Values:** Initializing max path sum to 0 instead of -Infinity.\n\n`;

    content += `### 🕸️ Graphs & Grid Matrix Corner Cases:\n`;
    content += `- **Disconnected Graph:** Multiple isolated components (loop over all vertices 0 to V-1).\n`;
    content += `- **Cycles in Directed Graph:** Infinite recursion during DFS without 3-state visited tracking.\n`;
    content += `- **1x1 Matrix / 1xN Matrix:** Single row or single column boundary cases.\n`;
    content += `- **Start Equals Target:** Flood fill when starting color is already equal to target color.\n\n`;

    content += `### 🔢 Dynamic Programming & Math Corner Cases:\n`;
    content += `- **Target is Zero:** Base case dp[0] = 0 or dp[0] = 1.\n`;
    content += `- **Integer Overflow:** Sum exceeding 32-bit signed integer (2^31 - 1 = 2147483647).\n`;
    content += `- **Safe Midpoint:** Use low + Math.floor((high - low) / 2) instead of (low + high) / 2.\n`;
    content += `- **Division by Zero:** Check denominator before modulo or division operations.\n\n`;

  } else if (pack === 'behavioral') {
    filename = 'interview-brain-behavioral-pack.md';
    const stories = getAllStories();

    content = `# ⭐ Interview Brain: STAR Stories, FAANG Questions & Reverse Interview Pack\n\n`;
    content += `> Generated for Google NotebookLM Grounded Behavioral Audits & Mock Manager Interviews.\n\n`;
    content += `---\n\n`;

    content += `## 1. Personal STAR Project Stories (${stories.length})\n\n`;
    if (stories.length === 0) {
      content += `*(No personal stories written yet. Use the STAR Story Builder in Interview Brain to add project stories.)*\n\n`;
    } else {
      stories.forEach(s => {
        content += `### Project: ${s.title}\n\n`;
        content += `${s.content}\n\n`;
        content += `---\n\n`;
      });
    }

    content += `## 2. Top 30 FAANG Behavioral Questions Bank\n\n`;
    TOP_30_BEHAVIORAL_QUESTIONS.forEach((q, idx) => {
      content += `### ${idx + 1}. ${q.question}\n`;
      content += `- **Category:** ${q.category}\n`;
      content += `- **Leadership Principle:** ${q.principle}\n`;
      content += `- **Interviewer Evaluation Rationale:** ${q.whyItMatters}\n`;
      content += `- **Key Tips:**\n`;
      q.tips.forEach(t => {
        content += `  - ${t}\n`;
      });
      content += `\n`;
    });

    content += `\n---\n\n`;
    content += `## 3. Reverse Interview Questions (Questions to Ask the Company)\n\n`;
    REVERSE_INTERVIEW_QUESTIONS.forEach((q, idx) => {
      content += `### ${idx + 1}. "${q.question}"\n`;
      content += `- **Category:** ${q.category}\n`;
      content += `- **What this reveals:** ${q.whatItReveals}\n`;
      content += `- **✅ Green Flags:** ${q.greenFlags}\n`;
      content += `- **🚩 Red Flags:** ${q.redFlags}\n\n`;
    });

    content += `\n---\n\n`;
    content += `## 4. FAANG Behavioral Rubric & Google X-Y-Z Formula\n\n`;
    content += `- **Situation (15% time ~ 30-45s):** Set context: company scale, team size, baseline metric.\n`;
    content += `- **Task (15% time ~ 30-45s):** Define explicit problem, deadline, or architectural risk assigned to you.\n`;
    content += `- **Action (50% time ~ 1.5-2m):** What YOU personally did: technical choices, tradeoffs, code written, stakeholder persuasion.\n`;
    content += `- **Result (20% time ~ 45s):** Quantified metrics using Google X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]".\n`;

  } else if (pack === 'leetcode-solutions') {
    filename = 'interview-brain-leetcode-500-solutions.md';
    const solutions = getAllLeetCodeSolutions();

    content = `# ⚡ Interview Brain: 500+ LeetCode JavaScript Solutions Grounding Binder\n\n`;
    content += `> Generated for Google NotebookLM Grounded AI Code Reviews, Complexity Grilling & Audio Podcasts.\n`;
    content += `> Total Solved Problems: ${solutions.length} | Source: BaffinLee/leetcode-javascript (MIT License)\n\n`;
    content += `---\n\n`;

    solutions.forEach(s => {
      content += `## LeetCode #${s.id}: ${s.title} (${s.difficulty})\n`;
      if (s.topics.length > 0) content += `**Topics:** ${s.topics.join(', ')}\n`;
      if (s.timeComplexity || s.spaceComplexity) {
        content += `**Complexity:** Time: ${s.timeComplexity || 'O(n)'} | Space: ${s.spaceComplexity || 'O(1)'}\n`;
      }
      if (s.problemText) {
        content += `\n### Problem Statement\n${s.problemText}\n`;
      }
      if (s.solutionCode) {
        content += `\n### JavaScript Solution\n\`\`\`javascript\n${s.solutionCode}\n\`\`\`\n`;
      }
      content += `\n---\n\n`;
    });

  } else if (pack === 'javascript-tricky-questions') {
    filename = 'interview-brain-lydia-hallie-155-js-questions.md';
    const jsQuestions = getAllJavaScriptQuestions();

    content = `# 🎯 Interview Brain: 155 Tricky JavaScript Questions & Deep Explanations Grounding Binder\n\n`;
    content += `> Generated for Google NotebookLM Grounded Socratic Drills, Quirks Grilling & Commute Audio Podcasts.\n`;
    content += `> Total Questions: ${jsQuestions.length} | Source: Lydia Hallie (https://github.com/lydiahallie/javascript-questions) (MIT License)\n\n`;
    content += `---\n\n`;

    jsQuestions.forEach(q => {
      content += `## Question #${q.id}: ${q.title} [${q.difficulty}]\n`;
      if (q.tags.length > 0) content += `**Topics:** ${q.tags.join(', ')}\n\n`;
      if (q.code) {
        content += `\`\`\`javascript\n${q.code}\n\`\`\`\n\n`;
      }
      content += `### Multiple Choice Options:\n`;
      q.options.forEach(opt => {
        content += `- **${opt.key}:** ${opt.text}\n`;
      });
      content += `\n### Correct Answer: ${q.answer}\n\n`;
      content += `### Conceptual Explanation:\n${q.explanation}\n\n`;
      content += `---\n\n`;
    });

  } else if (pack === 'classic-algorithms') {
    filename = 'interview-brain-trekhleb-classic-algorithms.md';
    const algos = getAllClassicAlgorithms();

    content = `# 🏛️ Interview Brain: Classic CS Algorithms & Data Structures Grounding Binder\n\n`;
    content += `> Generated for Google NotebookLM Grounded Computer Science & Algorithm Study.\n`;
    content += `> Total Implementations: ${algos.length} | Source: Oleksii Trekhleb (https://github.com/trekhleb/javascript-algorithms) (MIT License)\n\n`;
    content += `---\n\n`;

    algos.forEach(a => {
      content += `## ${a.title} [${a.category} - ${a.difficulty}]\n`;
      content += `**Time Complexity:** ${a.timeComplexity} | **Space Complexity:** ${a.spaceComplexity}\n`;
      content += `**Entry Function/Class:** \`${a.entryFunction}\`\n\n`;
      if (a.readme) {
        content += `### Conceptual Overview & Architecture:\n${a.readme}\n\n`;
      }
      content += `### Standalone Implementation:\n\`\`\`javascript\n${a.code}\n\`\`\`\n\n`;
      if (a.testCases && a.testCases.length > 0) {
        content += `### Built-in Test Cases:\n`;
        a.testCases.forEach((tc, idx) => {
          content += `- **Test ${idx + 1}:** \`${tc.input}\` ➔ Expected: \`${tc.expectedOutput}\`${tc.description ? ` (${tc.description})` : ''}\n`;
        });
        content += `\n`;
      }
      content += `---\n\n`;
    });

  } else {
    // Master Unified Pack
    filename = 'interview-brain-master-grounding-binder.md';
    const systemDesignDocs = getAllSystemDesign();
    const stories = getAllStories();
    const questions = getAllQuestions();
    const topics = getAllTopics();
    const prepDocs = getAllPrepDocs();

    content = `# 👑 Interview Brain: Complete Master Grounding Binder\n\n`;
    content += `> The comprehensive, unified knowledge base for Google NotebookLM Grounded Multi-Source Intelligence.\n`;
    content += `> Includes System Design, Grind 75, QA Bank (${questions.length} Q&As), STAR Stories, and Evergreen Topics.\n\n`;
    content += `---\n\n`;

    content += `# SECTION 1: SYSTEM DESIGN & DISTRIBUTED ARCHITECTURE\n\n`;
    systemDesignDocs.forEach(doc => {
      content += `## ${doc.title}\n`;
      content += `**Category:** ${doc.category || 'Architecture'} | **Difficulty:** ${doc.difficulty || 'Senior / Staff'}\n\n`;
      content += `${doc.content}\n\n---\n\n`;
    });

    content += `# SECTION 2: GRIND 75 & ALGORITHMIC CORNER CASES\n\n`;
    GRIND_75_PROBLEMS.forEach((p, idx) => {
      content += `### Problem ${idx + 1}: ${p.title} (${p.difficulty})\n`;
      content += `- **Pattern:** ${p.pattern}\n`;
      content += `- **Time:** ${p.timeMinutes} mins\n`;
      if (p.ahHaInsight) content += `- **💡 Ah-Ha Insight:** ${p.ahHaInsight}\n\n`;
    });

    content += `\n---\n\n`;
    content += `# SECTION 3: TOP FAANG BEHAVIORAL QUESTIONS & STAR RUBRIC\n\n`;
    TOP_30_BEHAVIORAL_QUESTIONS.forEach((q, idx) => {
      content += `### Q${idx + 1}: ${q.question} [${q.principle}]\n`;
      content += `${q.whyItMatters}\n\n`;
    });

    content += `\n---\n\n`;
    content += `# SECTION 4: CORE QA BANK SOLUTIONS (${questions.length} QUESTIONS)\n\n`;
    questions.forEach((q, idx) => {
      content += `### [${q.topic.toUpperCase()}] ${q.question}\n`;
      content += `${q.answer}\n\n---\n\n`;
    });

    content += `\n---\n\n`;
    content += `# SECTION 5: TARGET COMPANY INTERVIEW PREPARATION GUIDES\n\n`;
    prepDocs.forEach(doc => {
      content += `## ${doc.title}\n\n${doc.content}\n\n---\n\n`;
    });
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache, no-store'
    }
  });
}
