import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <span className="grid h-16 w-16 place-items-center rounded-2xl brand-gradient text-white mx-auto shadow-xl shadow-primary/20">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h1 className="font-display text-3xl font-extrabold mt-4">
          Lost in the suuq
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          The page you were looking for has wandered off. Let's get you back home.
        </p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-xl brand-gradient text-white font-semibold">
            Back to home
          </Link>
      </div>
    </div>
  );
}
