import { getAllSystemDesign } from '@/lib/markdown';
import SystemDesignClient from './SystemDesignClient';

export default function SystemDesignPage() {
  const docs = getAllSystemDesign();
  return <SystemDesignClient initialDocs={docs} />;
}
