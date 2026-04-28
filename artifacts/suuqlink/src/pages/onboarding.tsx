import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Compass,
  Store,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const slides = [
  {
    icon: ShoppingBag,
    eyebrow: "Welcome to SuuqLink",
    title: "The bazaar in your pocket",
    body: "Discover thousands of vetted vendors from Mogadishu to Lagos. Shop fashion, electronics, fresh coffee and more — all in one place.",
    color: "from-emerald-700 via-teal-700 to-teal-900",
  },
  {
    icon: Compass,
    eyebrow: "Built for your way",
    title: "Pay how you live",
    body: "Mobile money, card, bank transfer, or cash on delivery. Choose what works for your wallet and your trust.",
    color: "from-amber-600 via-orange-600 to-rose-700",
  },
  {
    icon: Store,
    eyebrow: "Your storefront, ready",
    title: "Sell to thousands today",
    body: "Open your own shop in minutes, list products with photos, chat directly with buyers, and grow with us.",
    color: "from-indigo-700 via-violet-700 to-fuchsia-800",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();
  const slide = slides[step];
  const Icon = slide.icon;

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("suuqlink-onboarded", "1");
      setLocation("/");
    }
  };
  const prev = () => step > 0 && setStep(step - 1);
  const skip = () => {
    localStorage.setItem("suuqlink-onboarded", "1");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background safe-pt safe-pb">
      <div className="mx-auto max-w-[560px] px-6 pt-10 pb-8 flex min-h-screen flex-col">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold tracking-tight">
            SuuqLink
          </span>
          <button
            onClick={skip}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div
                className={`relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-gradient-to-br ${slide.color} shadow-2xl shadow-black/30`}
              >
                <div className="absolute inset-0 grain opacity-50" />
                <div className="absolute inset-0 p-8 flex flex-col text-white">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="mt-auto space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                      {slide.eyebrow}
                    </p>
                    <h1 className="font-display text-3xl font-extrabold leading-tight text-balance">
                      {slide.title}
                    </h1>
                    <p className="text-sm text-white/90 leading-relaxed text-balance">
                      {slide.body}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={prev}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card hover:bg-muted"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl brand-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition"
          >
            {step < slides.length - 1 ? "Next" : "Start shopping"}
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to SuuqLink's Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
