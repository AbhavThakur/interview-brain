import { getAllEnhancedCodes } from '@/lib/markdown';
import CodingClient from './CodingClient';

export default function CodingPage() {
  const codes = getAllEnhancedCodes();
  return <CodingClient initialCodes={codes} />;
}
