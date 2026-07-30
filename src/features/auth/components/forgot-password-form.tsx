"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { firstFieldErrors } from "@/lib/utils";
import { useForgotPassword } from "@/features/auth/mutations";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas";
import type { SelfServeRole } from "@/features/auth/api";
import { roleAuthPaths } from "@/features/auth/role-paths";

export function ForgotPasswordForm({ role }: { role: SelfServeRole }) {
  const forgotPassword = useForgotPassword(role);
  const paths = roleAuthPaths(role);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordInput, string>>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    forgotPassword.mutate(result.data, { onSuccess: () => setSent(true) });
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MailCheck className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          If an account exists for <span className="font-medium text-foreground">{email}</span>,
          we&apos;ve sent a link to reset your password.
        </p>
        <Link href={paths.login} className="text-sm font-medium text-primary hover:text-primary/80">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField label="Email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>

      <Button type="submit" size="lg" className="w-full" disabled={forgotPassword.isPending}>
        {forgotPassword.isPending ? "Sending link…" : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Log in
        </Link>
      </p>
    </form>
  );
}
