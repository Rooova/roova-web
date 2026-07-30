import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "List your properties — Roova",
};

export default function AgencySignupPage() {
  return (
    <AuthCard title="Create your agency account" subtitle="List properties and raise funding on Roova.">
      <SignupForm role="AGENCY" />
    </AuthCard>
  );
}
