import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#properties", label: "Properties" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "#diaspora", label: "Diaspora" },
  { href: "#agencies", label: "For agencies" },
];

export function SiteHeader() {
  return (
    <header className="shadow-ring sticky top-0 z-40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-medium tracking-[-0.01em] text-foreground">
          roova<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium tracking-[-0.01em] text-foreground/70 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-foreground/80 hover:text-foreground sm:inline"
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Start investing
          </Link>
        </div>
      </div>
    </header>
  );
}
