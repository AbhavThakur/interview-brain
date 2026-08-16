import { NextResponse } from 'next/server';
import { getAllSearchIndex } from '@/lib/markdown';

export async function GET() {
  try {
    const items = getAllSearchIndex();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to load search index:', error);
    return NextResponse.json({ error: 'Failed to load search index' }, { status: 500 });
  }
}
