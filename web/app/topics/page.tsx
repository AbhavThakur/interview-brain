import { getAllTopics } from '@/lib/markdown';
import TopicsClient from './TopicsClient';

export default function TopicsPage() {
  const topics = getAllTopics();
  return <TopicsClient initialTopics={topics} />;
}
