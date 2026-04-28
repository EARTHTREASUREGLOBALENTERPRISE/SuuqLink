const SYMBOLS: Record<string, string> = {
  USD: "$",
  KES: "KSh",
  ETB: "Br",
  NGN: "₦",
  BDT: "৳",
  PKR: "₨",
  UGX: "USh",
  SOS: "Sh",
  TZS: "TSh",
};

export function formatPrice(amount: number, currency = "USD"): string {
  const sym = SYMBOLS[currency] ?? currency + " ";
  if (amount >= 1000) {
    return `${sym}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  return `${sym}${amount.toFixed(2)}`;
}

export function formatRelativeTime(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatDate(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
