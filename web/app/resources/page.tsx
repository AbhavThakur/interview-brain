import { getAllResources } from '@/lib/markdown';
import ResourcesClient from './ResourcesClient';

export default function ResourcesPage() {
  const resources = getAllResources();
  return <ResourcesClient initialResources={resources} />;
}
