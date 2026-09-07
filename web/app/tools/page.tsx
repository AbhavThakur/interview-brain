import { Metadata } from 'next';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
  title: 'In-Browser Developer Tools & Sandboxes | Interview Brain',
  description: '100% free, zero-signup developer tools: System design capacity estimator, interactive latency visualizer, client-side JWT/Base64/JSON utilities, and instant sandboxes.',
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolsClient />
    </div>
  );
}
