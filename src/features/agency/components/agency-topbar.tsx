"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/features/agency/queries";
import { useMarkAllNotificationsRead, useMarkNotificationRead } from "@/features/agency/mutations";
import { useMe } from "@/features/auth/queries";
import { cn } from "@/lib/utils";

export function AgencyTopbar() {
  const { data: notifications } = useNotifications();
  const { data: agency } = useMe("AGENCY");
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();

  const unread = notifications?.filter((n) => !n.read) ?? [];
  const recent = notifications?.slice(0, 5) ?? [];

  return (
    <header className="shadow-ring flex h-16 items-center justify-between bg-card px-6">
      <p className="text-sm font-medium tracking-[-0.01em] text-muted-foreground">
        {agency ? `${agency.name} · ${String(agency.tier)}` : ""}
      </p>

      <Popover>
        <PopoverTrigger asChild>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/5">
            <Bell className="h-5 w-5 text-foreground" />
            {unread.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {unread.length}
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-medium text-foreground">Notifications</p>
            {unread.length > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
              </button>
            )}
          </div>

          <div className="mt-1 space-y-1">
            {recent.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                You&apos;re all caught up.
              </p>
            )}
            {recent.map((notification) => (
              <button
                key={notification.id}
                onClick={() => !notification.read && markRead.mutate(notification.id)}
                className={cn(
                  "flex w-full flex-col gap-0.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-foreground/5",
                  !notification.read && "bg-primary/5",
                )}
              >
                <span className="text-sm font-medium text-foreground">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.message}</span>
              </button>
            ))}
          </div>

          <Link
            href="/agency/notifications"
            className="mt-1 block rounded-xl px-2 py-2 text-center text-sm font-medium text-primary hover:bg-foreground/5"
          >
            View all
          </Link>
        </PopoverContent>
      </Popover>
    </header>
  );
}
