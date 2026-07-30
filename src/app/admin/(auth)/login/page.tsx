import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Admin log in — Roova",
};

export default function AdminLoginPage() {
  return (
    <AuthCard title="Admin log in" subtitle="Roova operations access.">
      <LoginForm role="ADMIN" />
    </AuthCard>
  );
}
