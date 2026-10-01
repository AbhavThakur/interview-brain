import fs from 'fs';
import path from 'path';

export interface ClassicAlgorithm {
  id: string;
  title: string;
  category: 'Data Structures' | 'Sorting' | 'Search' | 'Graph' | 'Tree' | 'String' | 'Dynamic Programming' | 'Math' | 'JavaScript Polyfills';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  readmePath?: string;
  readme?: string;
  timeComplexity: string;
  spaceComplexity: string;
  entryFunction: string;
  code: string;
  starterCode: string;
  testCases: {
    id?: string;
    input: string;
    expectedOutput: string;
    description?: string;
  }[];
  author: string;
}

let cachedAlgorithms: ClassicAlgorithm[] | null = null;
let cachedAlgoMap: Map<string, ClassicAlgorithm> | null = null;

export function getAllClassicAlgorithms(): ClassicAlgorithm[] {
  if (cachedAlgorithms) return cachedAlgorithms;

  const candidatePaths = [
    path.join(process.cwd(), 'content', 'classic-algorithms.json'),
    path.join(process.cwd(), 'web', 'content', 'classic-algorithms.json'),
    path.join(process.cwd(), '..', 'classic-algorithms.json'),
    path.join(process.cwd(), 'classic-algorithms.json')
  ];

  let raw = '';
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        raw = fs.readFileSync(p, 'utf8');
        break;
      } catch {
        // try next
      }
    }
  }

  if (!raw) return [];

  try {
    cachedAlgorithms = JSON.parse(raw);
    cachedAlgoMap = new Map();
    cachedAlgorithms!.forEach(a => cachedAlgoMap!.set(a.id, a));
    return cachedAlgorithms!;
  } catch (err) {
    console.error('Failed to parse classic-algorithms.json:', err);
    return [];
  }
}

export function getClassicAlgorithmById(id: string): ClassicAlgorithm | null {
  if (!cachedAlgoMap) {
    getAllClassicAlgorithms();
  }
  return cachedAlgoMap?.get(id) || null;
}
