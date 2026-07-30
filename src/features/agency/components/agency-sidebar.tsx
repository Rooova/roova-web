"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Wallet, Bell, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutations";

const NAV_ITEMS = [
  { href: "/agency", label: "Overview", icon: LayoutDashboard },
  { href: "/agency/properties", label: "Properties", icon: Building2 },
  { href: "/agency/earnings", label: "Earnings", icon: Wallet },
  { href: "/agency/notifications", label: "Notifications", icon: Bell },
  { href: "/agency/settings", label: "Settings", icon: Settings },
];

export function AgencySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout("AGENCY");

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => router.push("/agency/login") });
  }

  return (
    <aside className="shadow-ring hidden w-64 shrink-0 flex-col bg-card px-4 py-6 md:flex">
      <Link href="/" className="px-2 text-xl font-medium tracking-[-0.01em] text-foreground">
        roova<span className="text-primary">.</span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/agency" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-[-0.01em] transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-[-0.01em] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}
