'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreateContentModal from './CreateContentModal';

const navLinks = [
  { href: '/qa', label: 'QA Bank' },
  { href: '/topics', label: 'Topics' },
  { href: '/stories', label: 'Stories' },
  { href: '/coding', label: 'Coding' },
  { href: '/prep', label: 'Prep' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                IB
              </div>
              <span className="font-semibold text-lg tracking-tight">Interview Brain</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-primary/15 text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-[1px] h-4 bg-white/10 mx-2"></div>
            <Link
              href="/quiz"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/quiz'
                  ? 'bg-primary/15 text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
              }`}
            >
              Quiz
            </Link>
            <div className="w-[1px] h-4 bg-white/10 mx-2"></div>
            <div className="flex items-center justify-center">
              <CreateContentModal />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
