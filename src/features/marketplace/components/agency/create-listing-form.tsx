"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { firstFieldErrors } from "@/lib/utils";
import { useCreateListing } from "@/features/marketplace/mutations";
import { createListingInputSchema, type CreateListingInput } from "@/features/marketplace/schemas";

export function CreateListingForm() {
  const router = useRouter();
  const createListing = useCreateListing();
  const [values, setValues] = useState<Record<string, string>>({
    title: "",
    location: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    paymentPlanType: "FULL_PAYMENT",
    downPaymentPct: "",
    installmentDurationMonths: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateListingInput, string>>>({});

  const needsInstallmentFields = values.paymentPlanType !== "FULL_PAYMENT";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = createListingInputSchema.safeParse(values);
    if (!result.success) {
      setErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    createListing.mutate(result.data, {
      onSuccess: (listing) => router.push(`/agency/marketplace/${listing.id}`),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="shadow-soft space-y-5 rounded-2xl bg-card p-6"
    >
      <FormField label="Property name" htmlFor="title" error={errors.title}>
        <Input
          id="title"
          placeholder="e.g. 3-Bed Duplex, Ikoyi"
          value={values.title}
          onChange={(event) => setValues((v) => ({ ...v, title: event.target.value }))}
        />
      </FormField>

      <FormField label="Location" htmlFor="location" error={errors.location}>
        <Input
          id="location"
          placeholder="e.g. Ikoyi, Lagos"
          value={values.location}
          onChange={(event) => setValues((v) => ({ ...v, location: event.target.value }))}
        />
      </FormField>

      <FormField label="Description (optional)" htmlFor="description" error={errors.description}>
        <Textarea
          id="description"
          value={values.description}
          onChange={(event) => setValues((v) => ({ ...v, description: event.target.value }))}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Bedrooms" htmlFor="bedrooms" error={errors.bedrooms}>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            value={values.bedrooms}
            onChange={(event) => setValues((v) => ({ ...v, bedrooms: event.target.value }))}
          />
        </FormField>
        <FormField label="Bathrooms" htmlFor="bathrooms" error={errors.bathrooms}>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            value={values.bathrooms}
            onChange={(event) => setValues((v) => ({ ...v, bathrooms: event.target.value }))}
          />
        </FormField>
        <FormField label="Size (sqm)" htmlFor="sizeSqm" error={errors.sizeSqm}>
          <Input
            id="sizeSqm"
            type="number"
            min="0"
            value={values.sizeSqm}
            onChange={(event) => setValues((v) => ({ ...v, sizeSqm: event.target.value }))}
          />
        </FormField>
      </div>

      <FormField label="Price (₦)" htmlFor="price" error={errors.price}>
        <Input
          id="price"
          type="number"
          min="0"
          value={values.price}
          onChange={(event) => setValues((v) => ({ ...v, price: event.target.value }))}
        />
      </FormField>

      <FormField label="Payment plan" htmlFor="paymentPlanType" error={errors.paymentPlanType}>
        <Select
          id="paymentPlanType"
          value={values.paymentPlanType}
          onChange={(event) => setValues((v) => ({ ...v, paymentPlanType: event.target.value }))}
        >
          <option value="FULL_PAYMENT">Full payment only</option>
          <option value="INSTALLMENT">Installments only</option>
          <option value="BOTH">Full payment or installments</option>
        </Select>
      </FormField>

      {needsInstallmentFields && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Down payment (%)"
            htmlFor="downPaymentPct"
            error={errors.downPaymentPct}
          >
            <Input
              id="downPaymentPct"
              type="number"
              min="0"
              max="100"
              value={values.downPaymentPct}
              onChange={(event) =>
                setValues((v) => ({ ...v, downPaymentPct: event.target.value }))
              }
            />
          </FormField>
          <FormField
            label="Duration options (months, comma-separated)"
            htmlFor="installmentDurationMonths"
            error={errors.installmentDurationMonths}
          >
            <Input
              id="installmentDurationMonths"
              placeholder="6, 12, 24"
              value={values.installmentDurationMonths}
              onChange={(event) =>
                setValues((v) => ({ ...v, installmentDurationMonths: event.target.value }))
              }
            />
          </FormField>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/agency/marketplace")}>
          Cancel
        </Button>
        <Button type="submit" disabled={createListing.isPending}>
          {createListing.isPending ? "Creating…" : "Create listing"}
        </Button>
      </div>
    </form>
  );
}
