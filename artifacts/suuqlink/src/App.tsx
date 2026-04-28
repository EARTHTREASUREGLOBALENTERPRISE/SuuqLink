import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import OnboardingPage from "@/pages/onboarding";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import SearchPage from "@/pages/search";
import CategoryPage from "@/pages/category";
import VendorsPage from "@/pages/vendors";
import VendorPage from "@/pages/vendor";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import OrdersPage from "@/pages/orders";
import OrderPage from "@/pages/order";
import ChatListPage from "@/pages/chat-list";
import ChatThreadPage from "@/pages/chat-thread";
import AdminPage from "@/pages/admin";
import AccountPage from "@/pages/account";
import { useLocation } from "wouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <PageTransition>
      <Switch>
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/vendors" component={VendorsPage} />
        <Route path="/vendor/:id" component={VendorPage} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/orders/:id" component={OrderPage} />
        <Route path="/chat" component={ChatListPage} />
        <Route path="/chat/:id" component={ChatThreadPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/account" component={AccountPage} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("suuqlink-onboarded");
    if (!seen && (location === "/" || location === "")) {
      setLocation("/onboarding");
    }
    setChecked(true);
  }, [location, setLocation]);
  if (!checked) return null;
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <OnboardingGate>
            <Router />
          </OnboardingGate>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
