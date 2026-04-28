import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useLogin,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";
import { Mail, Lock, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("amina@suuqlink.app");
  const [password, setPassword] = useState("demo");
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const login = useLogin({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        setLocation("/");
      },
    },
  });

  return (
    <div className="min-h-screen bg-background safe-pt safe-pb flex flex-col">
      <div className="mx-auto w-full max-w-[480px] px-6 pt-12 pb-8 flex-1 flex flex-col">
        <div className="space-y-2">
          <span className="grid h-12 w-12 place-items-center rounded-2xl brand-gradient text-white shadow-lg shadow-primary/20">
            <ShoppingBag className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight pt-4">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue shopping with your favorite vendors.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login.mutate({ data: { email, password } });
          }}
          className="space-y-3 mt-8"
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </span>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Password
            </span>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full h-12 rounded-xl brand-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          New to SuuqLink?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
        </div>

        <div className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          Demo: any email/password works — try{" "}
          <span className="font-mono">amina@suuqlink.app</span>
        </div>
      </div>
    </div>
  );
}
