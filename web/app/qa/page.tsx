import { getAllQuestions } from '@/lib/markdown';
import QABankClient from './QABankClient';

export default function QAPage() {
  const questions = getAllQuestions();
  return <QABankClient initialQuestions={questions} />;
}
