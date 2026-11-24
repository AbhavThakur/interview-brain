import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  badge?: string;
  estimatedTime?: string;
}

export default function Breadcrumbs({
  items,
  badge,
  estimatedTime,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center justify-between gap-2 py-2 px-3 sm:px-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-foreground/60 mb-5 flex-wrap backdrop-blur-md"
    >
      <ol className="flex items-center gap-1.5 flex-wrap min-w-0">
        <li>
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <span>🏠</span>
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 min-w-0">
              <span className="text-foreground/30 font-mono">/</span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors font-medium truncate max-w-[140px] sm:max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-semibold truncate max-w-[180px] sm:max-w-[320px]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-2 shrink-0">
        {estimatedTime && (
          <span className="text-[11px] font-mono text-foreground/50 flex items-center gap-1">
            <span>⏱️</span>
            <span>{estimatedTime}</span>
          </span>
        )}
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
            {badge}
          </span>
        )}
      </div>
    </nav>
  );
}
