"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { firstFieldErrors } from "@/lib/utils";
import { useResetPassword } from "@/features/auth/mutations";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schemas";
import type { SelfServeRole } from "@/features/auth/api";
import { roleAuthPaths } from "@/features/auth/role-paths";

export function ResetPasswordForm({ role, token }: { role: SelfServeRole; token: string }) {
  const router = useRouter();
  const resetPassword = useResetPassword(role);
  const paths = roleAuthPaths(role);
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = resetPasswordSchema.safeParse({ ...values, token });
    if (!result.success) {
      setErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    resetPassword.mutate(result.data, { onSuccess: () => router.push(paths.login) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.token && <p className="text-sm text-red-600">{errors.token}</p>}

      <FormField label="New password" htmlFor="password" error={errors.password}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => setValues((v) => ({ ...v, password: event.target.value }))}
        />
      </FormField>

      <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) =>
            setValues((v) => ({ ...v, confirmPassword: event.target.value }))
          }
        />
      </FormField>

      <Button type="submit" size="lg" className="w-full" disabled={resetPassword.isPending}>
        {resetPassword.isPending ? "Updating password…" : "Update password"}
      </Button>
    </form>
  );
}
