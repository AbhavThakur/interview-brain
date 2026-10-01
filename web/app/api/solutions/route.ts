import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllLeetCodeSolutions, 
  getLeetCodeSolutionById, 
  getLeetCodeSolutionBySlug,
  getGrind75SolutionMap 
} from '@/lib/leetcodeSolutions';
import { GRIND_75_PROBLEMS } from '@/lib/grind75Data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Single problem lookup by slug
    const slug = searchParams.get('slug');
    if (slug) {
      const solution = getLeetCodeSolutionBySlug(slug);
      if (!solution) {
        return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
      }
      return NextResponse.json(solution);
    }

    // 2. Single problem lookup by numeric ID
    const idParam = searchParams.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid problem ID' }, { status: 400 });
      }
      const solution = getLeetCodeSolutionById(id);
      if (!solution) {
        return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
      }
      return NextResponse.json(solution);
    }

    // 3. Grind 75 solution mapping dictionary
    const isGrindMap = searchParams.get('grindMap') === 'true';
    if (isGrindMap) {
      const grindIds = GRIND_75_PROBLEMS.map(p => p.id);
      const map = getGrind75SolutionMap(grindIds);
      return NextResponse.json(map);
    }

    // 4. Query / Filter across all 519 solutions
    const search = searchParams.get('q')?.toLowerCase() || '';
    const topic = searchParams.get('topic') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const limit = parseInt(searchParams.get('limit') || '500', 10);

    let all = getAllLeetCodeSolutions();

    if (search) {
      all = all.filter(s => 
        s.title.toLowerCase().includes(search) ||
        s.id.toString() === search.replace(/^#/, '') ||
        s.topics.some(t => t.toLowerCase().includes(search))
      );
    }

    if (topic && topic !== 'All') {
      all = all.filter(s => s.topics.includes(topic));
    }

    if (difficulty && difficulty !== 'All') {
      all = all.filter(s => s.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    return NextResponse.json(all.slice(0, limit));
  } catch (error) {
    console.error('Failed to query LeetCode solutions:', error);
    return NextResponse.json({ error: 'Failed to query solutions' }, { status: 500 });
  }
}
