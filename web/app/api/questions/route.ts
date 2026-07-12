import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/markdown';

export async function GET() {
  try {
    const questions = getAllQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
