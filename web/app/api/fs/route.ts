import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the root of the interview-brain repository
const REPO_ROOT = fs.existsSync(path.join(process.cwd(), 'content'))
  ? path.join(process.cwd(), 'content')
  : path.join(process.cwd(), '..');

// Directories to search in for markdown files
const SEARCH_DIRS = [
  '.', // root directory
  '01-topics',
  '02-qa-bank',
  '03-stories',
  '04-companies',
  '05-coding',
  '06-system-design'
];

/**
 * Helper to find a file by name in the specified directories
 */
function findFile(fileName: string): string | null {
  for (const dir of SEARCH_DIRS) {
    const dirPath = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;

    // First check if it's directly in the directory
    const directPath = path.join(dirPath, fileName);
    if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
      return directPath;
    }

    // Search 1-level deep for nested folders
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const nestedPath = path.join(dirPath, entry.name, fileName);
        if (fs.existsSync(nestedPath) && fs.statSync(nestedPath).isFile()) {
          return nestedPath;
        }
      }
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileParam = searchParams.get('file');

  if (!fileParam) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
  }

  const fileName = path.basename(fileParam);
  
  if (!fileName.endsWith('.md')) {
    return NextResponse.json({ error: 'Only .md files can be edited' }, { status: 400 });
  }

  const absolutePath = findFile(fileName);

  if (!absolutePath) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return NextResponse.json({
      absolutePath,
      content
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Editing files is disabled in production static deployments.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { absolutePath, content } = body;

    if (!absolutePath || content === undefined) {
      return NextResponse.json({ error: 'Missing absolutePath or content' }, { status: 400 });
    }

    const resolvedPath = path.resolve(absolutePath);
    if (!resolvedPath.startsWith(path.resolve(REPO_ROOT))) {
      return NextResponse.json({ error: 'Unauthorized path' }, { status: 403 });
    }

    if (!resolvedPath.endsWith('.md')) {
      return NextResponse.json({ error: 'Only .md files can be edited' }, { status: 400 });
    }

    fs.writeFileSync(resolvedPath, content, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
