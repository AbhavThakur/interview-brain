import { getAllStories } from '@/lib/markdown';
import StoriesClient from './StoriesClient';

export const metadata = {
  title: 'STAR Stories & Behavioral Questions | Interview Brain',
  description: 'Master FAANG behavioral interviews with the STAR method and Amazon 16 Leadership Principles.',
};

export default function StoriesPage() {
  const stories = getAllStories();
  return <StoriesClient initialStories={stories} />;
}
