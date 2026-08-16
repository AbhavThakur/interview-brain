'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreateContentModal from './CreateContentModal';
import CommandPalette from './CommandPalette';

const navLinks = [
  { href: '/resources', label: 'Resources' },
  { href: '/coding', label: 'Coding' },
  { href: '/system-design', label: 'System Design' },
  { href: '/cheatsheets', label: 'Cheat Sheets' },
  { href: '/qa', label: 'QA Bank' },
  { href: '/topics', label: 'Topics' },
  { href: '/stories', label: 'Stories' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                IB
              </div>
              <span className="font-bold text-base md:text-lg tracking-tight hidden sm:inline-block">Interview Brain</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop & Tablet) */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs md:text-sm font-medium px-2.5 md:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <CommandPalette />

            <div className="w-[1px] h-4 bg-white/10 hidden md:block"></div>

            <Link
              href="/quiz"
              className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                pathname === '/quiz'
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              ⚡ Quiz
            </Link>

            <div className="w-[1px] h-4 bg-white/10 hidden sm:block"></div>

            <div className="flex items-center justify-center">
              <CreateContentModal />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
