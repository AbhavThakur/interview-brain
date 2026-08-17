import { getAllPrepDocs } from '@/lib/markdown';
import PrepClient from './PrepClient';

export const metadata = {
  title: 'Company-Specific Interview Prep | Interview Brain',
  description: 'Company-specific interview guides, job description alignment, and question archives.',
};

export default function PrepPage() {
  const docs = getAllPrepDocs();
  return <PrepClient initialDocs={docs} />;
}
