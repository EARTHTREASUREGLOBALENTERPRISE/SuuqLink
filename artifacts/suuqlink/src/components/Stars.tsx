import { Star } from "lucide-react";

export function Stars({
  rating,
  size = 14,
  showNumber = false,
  count,
}: {
  rating: number;
  size?: number;
  showNumber?: boolean;
  count?: number;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className={
                filled
                  ? "fill-saffron text-saffron"
                  : "text-muted-foreground/40"
              }
              strokeWidth={1.6}
            />
          );
        })}
      </span>
      {showNumber && (
        <span className="text-xs font-semibold tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
      {count != null && (
        <span className="text-xs text-muted-foreground tabular-nums">
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  );
}
