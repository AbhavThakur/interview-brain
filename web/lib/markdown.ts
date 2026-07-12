import fs from 'fs';
import path from 'path';

export interface Question {
  id: string;
  topic: string; // e.g., 'javascript'
  question: string;
  tags: string[];
  askedAt: string;
  answer: string;
}

function resolveDir(dirName: string) {
  const vercelPath = path.join(process.cwd(), 'content', dirName);
  if (fs.existsSync(vercelPath)) {
    return vercelPath;
  }
  return path.join(process.cwd(), '..', dirName);
}

const TOPICS_DIR = resolveDir('01-topics');
const QA_DIR = resolveDir('02-qa-bank');
const STORIES_DIR = resolveDir('03-stories');
const CODING_DIR = resolveDir('05-coding');

export function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.md') && file.toLowerCase() !== 'readme.md') {
      results.push(filePath);
    }
  });
  return results;
}

export function getCodingFiles(): string[] {
  return getFilesRecursively(CODING_DIR);
}

export interface CodeDocument {
  id: string;
  group: string;
  title: string;
  content: string;
}

export function getAllCodes(): CodeDocument[] {
  const files = getCodingFiles();
  return files.map(filePath => {
    const relativePath = path.relative(CODING_DIR, filePath);
    const id = relativePath.replace(/\.md$/, '').replace(new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g'), '-');
    
    // Determine group from folder structure (e.g. 05-coding/arrays/two-sum.md -> arrays)
    const parts = relativePath.split(path.sep);
    const group = parts.length > 1 ? parts[0] : 'General';
    
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    // Strip frontmatter if present
    let content = rawContent;
    let title = id.replace(/-/g, ' ');
    
    const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (fmMatch) {
      const frontmatter = fmMatch[1];
      content = fmMatch[2].trim();
      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      if (titleMatch) title = titleMatch[1].trim();
    }
    
    // Fallback: extract title from first heading
    if (title === id.replace(/-/g, ' ')) {
      for (const line of content.split('\n')) {
        if (line.startsWith('# ')) {
          title = line.replace('# ', '').trim();
          break;
        }
      }
    }

    return { id, group, title, content };
  });
}

export function getQAFiles(): string[] {
  return getFilesRecursively(QA_DIR);
}

export function getAllQuestions(): Question[] {
  const files = getQAFiles();
  const allQuestions: Question[] = [];

  files.forEach(filePath => {
    const fileName = path.basename(filePath);
    const topic = fileName.replace('.md', '');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by "## Q: "
    const sections = content.split('## Q: ').slice(1); // skip everything before first question

    sections.forEach((section, index) => {
      // Find the end of the question (first newline)
      const lines = section.split('\n');
      const question = lines[0].trim();
      
      let tags: string[] = [];
      let askedAt = '';
      let answerStartIndex = 1;

      // Extract metadata if present
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue; // Skip empty lines between question and metadata/answer

        // Check if line contains metadata: **Tags:** ... · **Asked at:** ...
        if (line.includes('**Tags:**') || line.includes('**Asked at:**')) {
          const tagsMatch = line.match(/\*\*Tags:\*\*\s*([^·]+)/);
          if (tagsMatch) {
            tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
          }
          
          const askedMatch = line.match(/\*\*Asked at:\*\*\s*(.+)/);
          if (askedMatch) {
            askedAt = askedMatch[1].trim();
          }
          answerStartIndex = i + 1;
          break; // Found metadata, answer starts after
        } else {
          // If the first non-empty line is NOT metadata, it must be the start of the answer
          answerStartIndex = i;
          break;
        }
      }

      const answer = lines.slice(answerStartIndex).join('\n').trim();
      
      // Create a deterministic ID based on topic and index (or a hash of the question)
      // For now, slugify the question (first 30 chars) + index
      const idStr = question.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
      const id = `${topic}-${index}-${idStr}`;

      allQuestions.push({
        id,
        topic,
        question,
        tags,
        askedAt,
        answer
      });
    });
  });

  return allQuestions;
}

export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
  group?: string; // subfolder name if any
}

export function getMarkdownDocuments(baseDir: string): MarkdownDocument[] {
  const files = getFilesRecursively(baseDir);
  return files.map(filePath => {
    const relativePath = path.relative(baseDir, filePath);
    const parts = relativePath.split(path.sep);
    const fileName = parts.pop() || '';
    const group = parts.length > 0 ? parts[0] : undefined;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = relativePath.replace(/\.md$/, '').replace(new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g'), '-');
    
    // Extract title from the first heading # 
    const lines = content.split('\n');
    let title = fileName.replace('.md', '');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace('# ', '').trim();
        break;
      }
    }

    return {
      id,
      title,
      group,
      content
    };
  });
}

export function getAllTopics(): MarkdownDocument[] {
  return getMarkdownDocuments(TOPICS_DIR);
}

export function getAllStories(): MarkdownDocument[] {
  return getMarkdownDocuments(STORIES_DIR);
}

const COMPANIES_DIR = resolveDir('04-companies');

export function getAllPrepDocs(): MarkdownDocument[] {
  return getMarkdownDocuments(COMPANIES_DIR);
}
