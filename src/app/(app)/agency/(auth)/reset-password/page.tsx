import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password — Roova",
};

export default async function AgencyResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/agency/login" className="font-medium text-primary hover:text-primary/80">
          Back to log in
        </Link>
      }
    >
      <ResetPasswordForm role="AGENCY" token={token ?? ""} />
    </AuthCard>
  );
}
