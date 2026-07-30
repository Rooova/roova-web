"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { firstFieldErrors } from "@/lib/utils";
import { useSignup } from "@/features/auth/mutations";
import { signupSchema, type SignupInput } from "@/features/auth/schemas";
import type { SelfServeRole } from "@/features/auth/api";
import { roleAuthPaths } from "@/features/auth/role-paths";

export function SignupForm({ role }: { role: SelfServeRole }) {
  const router = useRouter();
  const signup = useSignup(role);
  const paths = roleAuthPaths(role);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupInput, string>>>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = signupSchema.safeParse(values);
    if (!result.success) {
      setErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    signup.mutate(result.data, { onSuccess: () => router.push(paths.dashboard) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField label="Full name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setValues((v) => ({ ...v, email: event.target.value }))}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => setValues((v) => ({ ...v, password: event.target.value }))}
        />
      </FormField>

      <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
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

      <Button type="submit" size="lg" className="w-full" disabled={signup.isPending}>
        {signup.isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={paths.login} className="font-medium text-primary hover:text-primary/80">
          Log in
        </Link>
      </p>
    </form>
  );
}
