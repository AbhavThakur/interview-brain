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

export interface ResourceItem {
  id: string;
  title: string;
  category: 'dsa' | 'frontend' | 'mobile' | 'system-design' | 'behavioral' | string;
  platform: string;
  url: string;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  description: string;
  whyItMatters: string;
}

export interface CodingProblem {
  id: string;
  group: string;
  title: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  leetcodeUrl?: string;
  ahHaInsight?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  content: string;
}

export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
  group?: string; // subfolder name if any
  category?: string;
  difficulty?: string;
  tags?: string[];
}

export interface SearchItem {
  id: string;
  title: string;
  type: 'qa' | 'topic' | 'coding' | 'system-design' | 'story' | 'resource';
  subtitle: string;
  href: string;
  tags: string[];
  isExternal?: boolean;
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
const SYSTEM_DESIGN_DIR = resolveDir('06-system-design');
const COMPANIES_DIR = resolveDir('04-companies');

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

export function getAllResources(): ResourceItem[] {
  const possiblePaths = [
    path.join(process.cwd(), 'content', 'resources.json'),
    path.join(process.cwd(), '..', 'resources.json'),
    path.join(process.cwd(), 'resources.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw) as ResourceItem[];
      } catch (e) {
        console.error('Error parsing resources.json:', e);
      }
    }
  }
  return [];
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
  return getAllEnhancedCodes();
}

export function getAllEnhancedCodes(): CodingProblem[] {
  const files = getCodingFiles();
  return files.map(filePath => {
    const relativePath = path.relative(CODING_DIR, filePath);
    const id = relativePath.replace(/\.md$/, '').replace(new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g'), '-');
    
    const parts = relativePath.split(path.sep);
    const group = parts.length > 1 ? parts[0] : 'General';
    
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    let content = rawContent;
    let title = id.replace(/-/g, ' ');
    let pattern = group.replace(/-/g, ' ');
    let difficulty: 'Easy' | 'Medium' | 'Hard' | string = 'Medium';
    let leetcodeUrl = '';
    let ahHaInsight = '';
    let timeComplexity = '';
    let spaceComplexity = '';
    
    const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (fmMatch) {
      const frontmatter = fmMatch[1];
      content = fmMatch[2].trim();

      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      if (titleMatch) title = titleMatch[1].trim();

      const patternMatch = frontmatter.match(/pattern:\s*(.+)/);
      if (patternMatch) pattern = patternMatch[1].trim();

      const diffMatch = frontmatter.match(/difficulty:\s*(.+)/);
      if (diffMatch) difficulty = diffMatch[1].trim();

      const urlMatch = frontmatter.match(/leetcodeUrl:\s*(.+)/);
      if (urlMatch) leetcodeUrl = urlMatch[1].trim();

      const insightMatch = frontmatter.match(/ahHaInsight:\s*(.+)/);
      if (insightMatch) ahHaInsight = insightMatch[1].trim();

      const timeMatch = frontmatter.match(/timeComplexity:\s*(.+)/);
      if (timeMatch) timeComplexity = timeMatch[1].trim();

      const spaceMatch = frontmatter.match(/spaceComplexity:\s*(.+)/);
      if (spaceMatch) spaceComplexity = spaceMatch[1].trim();
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

    return { 
      id, 
      group, 
      title, 
      pattern, 
      difficulty, 
      leetcodeUrl, 
      ahHaInsight, 
      timeComplexity, 
      spaceComplexity, 
      content 
    };
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
    const sections = content.split('## Q: ').slice(1);

    sections.forEach((section, index) => {
      const lines = section.split('\n');
      const question = lines[0].trim();
      
      let tags: string[] = [];
      let askedAt = '';
      let answerStartIndex = 1;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

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
          break;
        } else {
          answerStartIndex = i;
          break;
        }
      }

      const answer = lines.slice(answerStartIndex).join('\n').trim();
      
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

export function getMarkdownDocuments(baseDir: string): MarkdownDocument[] {
  const files = getFilesRecursively(baseDir);
  return files.map(filePath => {
    const relativePath = path.relative(baseDir, filePath);
    const parts = relativePath.split(path.sep);
    const fileName = parts.pop() || '';
    const group = parts.length > 0 ? parts[0] : undefined;
    
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const id = relativePath.replace(/\.md$/, '').replace(new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g'), '-');
    
    let content = rawContent;
    let title = fileName.replace('.md', '');
    let category = group;
    let difficulty: string | undefined;
    let tags: string[] = [];

    const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (fmMatch) {
      const frontmatter = fmMatch[1];
      content = fmMatch[2].trim();

      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      if (titleMatch) title = titleMatch[1].trim();

      const catMatch = frontmatter.match(/category:\s*(.+)/);
      if (catMatch) category = catMatch[1].trim();

      const diffMatch = frontmatter.match(/difficulty:\s*(.+)/);
      if (diffMatch) difficulty = diffMatch[1].trim();

      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
      }
    }
    
    if (title === fileName.replace('.md', '')) {
      for (const line of content.split('\n')) {
        if (line.startsWith('# ')) {
          title = line.replace('# ', '').trim();
          break;
        }
      }
    }

    return {
      id,
      title,
      group,
      category,
      difficulty,
      tags,
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

export function getAllPrepDocs(): MarkdownDocument[] {
  return getMarkdownDocuments(COMPANIES_DIR);
}

export function getAllSystemDesign(): MarkdownDocument[] {
  return getMarkdownDocuments(SYSTEM_DESIGN_DIR);
}

export function getAllSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // 1. QA Questions
  getAllQuestions().forEach(q => {
    items.push({
      id: `qa-${q.id}`,
      title: q.question,
      type: 'qa',
      subtitle: `QA Bank · ${q.topic} ${q.askedAt ? `· Asked at ${q.askedAt}` : ''}`,
      href: `/qa#${q.id}`,
      tags: [q.topic, ...q.tags]
    });
  });

  // 2. Evergreen Topics
  getAllTopics().forEach(t => {
    items.push({
      id: `topic-${t.id}`,
      title: t.title,
      type: 'topic',
      subtitle: `Topic · ${t.group || 'General'}`,
      href: `/topics#${t.id}`,
      tags: [t.group || 'general', ...(t.tags || [])]
    });
  });

  // 3. Coding Problems
  getAllEnhancedCodes().forEach(c => {
    items.push({
      id: `coding-${c.id}`,
      title: `${c.title} (${c.difficulty})`,
      type: 'coding',
      subtitle: `Coding · ${c.pattern}`,
      href: `/coding#${c.id}`,
      tags: [c.pattern, c.difficulty, c.group]
    });
  });

  // 4. System Design
  getAllSystemDesign().forEach(sd => {
    items.push({
      id: `sd-${sd.id}`,
      title: sd.title,
      type: 'system-design',
      subtitle: `System Design · ${sd.category || 'Architecture'}`,
      href: `/system-design#${sd.id}`,
      tags: [sd.category || 'architecture', ...(sd.tags || [])]
    });
  });

  // 5. Stories
  getAllStories().forEach(s => {
    items.push({
      id: `story-${s.id}`,
      title: s.title,
      type: 'story',
      subtitle: `STAR Story · Behavioral`,
      href: `/stories#${s.id}`,
      tags: ['behavioral', 'star']
    });
  });

  // 6. Resources
  getAllResources().forEach(r => {
    items.push({
      id: `res-${r.id}`,
      title: r.title,
      type: 'resource',
      subtitle: `External Resource · ${r.platform} · ${r.difficulty}`,
      href: r.url,
      tags: [r.category, r.platform, ...r.tags],
      isExternal: true
    });
  });

  return items;
}
