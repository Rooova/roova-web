import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Agency log in — Roova",
};

export default function AgencyLoginPage() {
  return (
    <AuthCard title="Agency log in" subtitle="Welcome back. Enter your details to continue.">
      <LoginForm role="AGENCY" />
    </AuthCard>
  );
}
