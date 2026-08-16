import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = fs.existsSync(path.join(process.cwd(), 'content'))
  ? path.join(process.cwd(), 'content')
  : path.join(process.cwd(), '..');

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Creating files is disabled in production static deployments.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { type, name, group } = body;

    if (!type || !name) {
      return NextResponse.json({ error: 'Missing type or name' }, { status: 400 });
    }

    // Sanitize name for filename
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const safeGroup = group ? group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
    
    const fileName = `${safeName}.md`;
    let absolutePath = '';
    let initialContent = '';

    if (type === 'qa') {
      // For QA, 'name' acts as the topic file (e.g. javascript.md)
      absolutePath = path.join(REPO_ROOT, '02-qa-bank', fileName);
      const boilerplate = `\n\n## Q: New Question\n\n**Tags:** \n\nType your answer here...\n`;
      
      if (fs.existsSync(absolutePath)) {
        fs.appendFileSync(absolutePath, boilerplate, 'utf-8');
      } else {
        initialContent = `# Q&A Bank — ${name}\n${boilerplate}`;
        fs.writeFileSync(absolutePath, initialContent, 'utf-8');
      }
    } else {
      let targetDir = '';
      if (type === 'topic') targetDir = path.join(REPO_ROOT, '01-topics');
      else if (type === 'story') targetDir = path.join(REPO_ROOT, '03-stories');
      else if (type === 'code') targetDir = path.join(REPO_ROOT, '05-coding');
      else if (type === 'system-design') targetDir = path.join(REPO_ROOT, '06-system-design');
      else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

      if (safeGroup) {
        targetDir = path.join(targetDir, safeGroup);
      }

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      absolutePath = path.join(targetDir, fileName);
      if (fs.existsSync(absolutePath)) {
        return NextResponse.json({ error: 'File already exists' }, { status: 400 });
      }

      initialContent = `---\ntitle: ${name}\ncategory: ${safeGroup || 'architecture'}\ndifficulty: Senior\n---\n\n# ${name}\n\nStart writing here...\n`;
      fs.writeFileSync(absolutePath, initialContent, 'utf-8');
    }

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}
