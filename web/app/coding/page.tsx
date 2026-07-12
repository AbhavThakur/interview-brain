import { getAllCodes } from '@/lib/markdown';
import CodingClient from './CodingClient';

export default function CodingPage() {
  const codes = getAllCodes();
  return <CodingClient initialCodes={codes} />;
}
