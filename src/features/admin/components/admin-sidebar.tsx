"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, LogOut } from "lucide-react";
import { useMe } from "@/features/auth/queries";
import { useLogout } from "@/features/auth/mutations";

export function AdminSidebar() {
  const router = useRouter();
  const { data: admin } = useMe("ADMIN");
  const logout = useLogout("ADMIN");

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => router.push("/admin/login") });
  }

  return (
    <aside className="shadow-ring hidden w-64 shrink-0 flex-col bg-card px-4 py-6 md:flex">
      <Link href="/" className="px-2 text-xl font-medium tracking-[-0.01em] text-foreground">
        roova<span className="text-primary">.</span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium tracking-[-0.01em] text-primary">
          <ClipboardCheck className="h-4 w-4" />
          Properties
        </div>
      </nav>

      {admin && (
        <p className="px-3 pb-2 text-xs text-muted-foreground">Signed in as {admin.name}</p>
      )}

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
