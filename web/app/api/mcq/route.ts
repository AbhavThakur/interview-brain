import { NextRequest, NextResponse } from 'next/server';
import {
  getAllJavaScriptQuestions,
  getJavaScriptQuestionById,
  getJavaScriptQuestionsByTag,
  getJavaScriptQuestionTags,
} from '@/lib/javascriptQuestions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const tagParam = searchParams.get('tag');
    const tagsOnly = searchParams.get('tags');
    const limitParam = searchParams.get('limit');
    const randomParam = searchParams.get('random');

    if (tagsOnly === 'true') {
      const tags = getJavaScriptQuestionTags();
      return NextResponse.json(tags);
    }

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
      }
      const question = getJavaScriptQuestionById(id);
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json(question);
    }

    let questions = tagParam ? getJavaScriptQuestionsByTag(tagParam) : getAllJavaScriptQuestions();

    if (randomParam === 'true') {
      questions = [...questions].sort(() => 0.5 - Math.random());
    }

    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        questions = questions.slice(0, limit);
      }
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('[API /api/mcq] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch MCQ questions' }, { status: 500 });
  }
}
