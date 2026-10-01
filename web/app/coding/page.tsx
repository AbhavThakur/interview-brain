import { getAllEnhancedCodes } from '@/lib/markdown';
import { getAllLeetCodeSolutions } from '@/lib/leetcodeSolutions';
import { getAllClassicAlgorithms } from '@/lib/classicAlgorithms';
import CodingClient from './CodingClient';

export default function CodingPage() {
  const codes = getAllEnhancedCodes();
  const allSolutions = getAllLeetCodeSolutions();
  const classicAlgorithms = getAllClassicAlgorithms();
  return (
    <CodingClient
      initialCodes={codes}
      allSolutions={allSolutions}
      classicAlgorithms={classicAlgorithms}
    />
  );
}
