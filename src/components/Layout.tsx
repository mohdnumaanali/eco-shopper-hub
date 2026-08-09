import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Menu, Moon, Sun, LogOut, Heart } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/tips", label: "Eco Tips" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const links = (onClick?: () => void) =>
    NAV.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClick}
        activeOptions={{ exact: item.to === "/" }}
        activeProps={{ className: "text-primary" }}
        inactiveProps={{ className: "text-muted-foreground" }}
        className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
      >
        {item.label}
      </Link>
    ));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="EcoShopper home">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="truncate font-display text-lg font-semibold">EcoShopper</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav aria-label="Main" className="hidden items-center md:flex">
              {links()}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full"
            >
              {dark ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
            </Button>

            {user ? (
              <>
                <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Favorites">
                  <Link to="/favorites">
                    <Heart aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={signOut} aria-label="Sign out">
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                  <Menu aria-hidden="true" className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetTitle className="px-3 pb-2">Menu</SheetTitle>
                <nav aria-label="Mobile" className="flex flex-col gap-1 p-2">
                  {links(() => setOpen(false))}
                  {!user && (
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="rounded-full px-3 py-2 text-sm font-medium text-primary"
                    >
                      Sign in
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2">
          <div>
            <p className="font-display text-lg font-semibold">EcoShopper</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Shop Smarter, Shop Greener. Compare everyday products with lower-impact alternatives.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
            {links()}
          </nav>
        </div>
        <p className="pb-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoShopper. Photography auto-sourced from open web libraries.
        </p>
      </footer>
    </div>
  );
}
