import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRegister,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";
import { Mail, Lock, User as UserIcon, ShoppingBag } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const register = useRegister({
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
        <span className="grid h-12 w-12 place-items-center rounded-2xl brand-gradient text-white shadow-lg shadow-primary/20">
          <ShoppingBag className="h-6 w-6" />
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight pt-4">
          Join SuuqLink
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create an account to shop, sell, and chat with vendors.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-6 p-1 rounded-xl bg-muted">
          {(["buyer", "seller"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`h-10 rounded-lg text-sm font-semibold capitalize transition ${role === r ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              I'm a {r}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            register.mutate({ data: { name, email, password, role } });
          }}
          className="space-y-3 mt-5"
        >
          <Field icon={UserIcon} label="Full name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amina Yusuf"
              className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>
          <Field icon={Mail} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>
          <Field icon={Lock} label="Password">
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>
          <button
            type="submit"
            disabled={register.isPending}
            className="w-full h-12 rounded-xl brand-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
          >
            {register.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative mt-1.5">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}
