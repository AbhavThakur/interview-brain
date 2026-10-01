import fs from 'fs';
import path from 'path';

export interface JavaScriptMCQuestion {
  id: number;
  title: string;
  code: string | null;
  options: { key: string; text: string }[];
  answer: string;
  explanation: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source: string;
}

let cachedQuestions: JavaScriptMCQuestion[] | null = null;

export function getAllJavaScriptQuestions(): JavaScriptMCQuestion[] {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  const primaryPath = path.join(process.cwd(), 'content', 'javascript-questions.json');
  const fallbackPath = path.join(process.cwd(), '..', 'javascript-questions.json');

  let filePath = primaryPath;
  if (!fs.existsSync(filePath)) {
    filePath = fallbackPath;
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`[getAllJavaScriptQuestions] Questions JSON not found at ${filePath}`);
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedQuestions = JSON.parse(raw) as JavaScriptMCQuestion[];
    return cachedQuestions;
  } catch (error) {
    console.error('[getAllJavaScriptQuestions] Failed to load questions JSON:', error);
    return [];
  }
}

export function getJavaScriptQuestionById(id: number): JavaScriptMCQuestion | undefined {
  const all = getAllJavaScriptQuestions();
  return all.find(q => q.id === id);
}

export function getJavaScriptQuestionsByTag(tag: string): JavaScriptMCQuestion[] {
  const all = getAllJavaScriptQuestions();
  if (!tag || tag === 'All') return all;
  return all.filter(q => q.tags.includes(tag.toLowerCase()));
}

export function getJavaScriptQuestionTags(): string[] {
  const all = getAllJavaScriptQuestions();
  const tagSet = new Set<string>();
  all.forEach(q => q.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
