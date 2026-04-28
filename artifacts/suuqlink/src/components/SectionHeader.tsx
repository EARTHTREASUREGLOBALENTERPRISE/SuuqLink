import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  hrefLabel = "See all",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-4">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            {hrefLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
      )}
    </div>
  );
}
