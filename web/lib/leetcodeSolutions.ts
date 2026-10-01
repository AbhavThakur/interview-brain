import fs from 'fs';
import path from 'path';

export interface LeetCodeSolution {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  similarQuestions: string[];
  problemText: string;
  solutionCode: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  leetcodeUrl: string;
  baffinleeUrl: string;
  githubUrl: string;
}

let cachedSolutions: LeetCodeSolution[] | null = null;
let cachedSlugMap: Map<string, LeetCodeSolution> | null = null;
let cachedIdMap: Map<number, LeetCodeSolution> | null = null;

function loadSolutions(): LeetCodeSolution[] {
  if (cachedSolutions) return cachedSolutions;

  const candidatePaths = [
    path.join(process.cwd(), 'content', 'leetcode-solutions.json'),
    path.join(process.cwd(), 'web', 'content', 'leetcode-solutions.json'),
    path.join(process.cwd(), '..', 'leetcode-solutions.json'),
    path.join(process.cwd(), 'leetcode-solutions.json')
  ];

  let raw = '';
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        raw = fs.readFileSync(p, 'utf8');
        break;
      } catch (err) {
        // try next
      }
    }
  }

  if (!raw) {
    return [];
  }

  try {
    cachedSolutions = JSON.parse(raw);
    cachedSlugMap = new Map();
    cachedIdMap = new Map();

    (cachedSolutions || []).forEach(s => {
      cachedSlugMap!.set(s.slug, s);
      // Also register stripped slug (without dashes) for fuzzy matching
      cachedSlugMap!.set(s.slug.replace(/-/g, ''), s);
      cachedIdMap!.set(s.id, s);
    });

    return cachedSolutions || [];
  } catch (err) {
    console.error('Failed to parse leetcode-solutions.json:', err);
    return [];
  }
}

export function getAllLeetCodeSolutions(): LeetCodeSolution[] {
  return loadSolutions();
}

export function getLeetCodeSolutionById(id: number): LeetCodeSolution | undefined {
  loadSolutions();
  return cachedIdMap?.get(id);
}

export function getLeetCodeSolutionBySlug(slug: string): LeetCodeSolution | undefined {
  loadSolutions();
  if (!slug) return undefined;
  const direct = cachedSlugMap?.get(slug);
  if (direct) return direct;
  return cachedSlugMap?.get(slug.replace(/-/g, ''));
}

/**
 * Pre-computes mapping of Grind 75 problem IDs to their BaffinLee reference solution.
 */
export function getGrind75SolutionMap(grindIds: string[]): Record<string, LeetCodeSolution> {
  loadSolutions();
  const result: Record<string, LeetCodeSolution> = {};
  if (!cachedSlugMap) return result;

  grindIds.forEach(id => {
    const sol = cachedSlugMap?.get(id) || cachedSlugMap?.get(id.replace(/-/g, ''));
    if (sol) {
      result[id] = sol;
    }
  });

  return result;
}
