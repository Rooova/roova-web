"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { firstFieldErrors } from "@/lib/utils";
import { useCreateOffer } from "@/features/marketplace/mutations";
import { createOfferInputSchema, type Listing, type CreateOfferInput } from "@/features/marketplace/schemas";

export function MakeOfferForm({ listing }: { listing: Listing }) {
  const createOffer = useCreateOffer();
  const canInstallment = listing.paymentPlanType !== "FULL_PAYMENT";
  const canFull = listing.paymentPlanType !== "INSTALLMENT";

  const [values, setValues] = useState({
    paymentPlan: canFull ? "FULL_PAYMENT" : "INSTALLMENT",
    downPaymentPct: listing.downPaymentPct ? String(listing.downPaymentPct) : "",
    installmentDurationMonths: listing.installmentDurationMonths[0]
      ? String(listing.installmentDurationMonths[0])
      : "",
    offerAmount: String(listing.price),
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOfferInput, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = createOfferInputSchema.safeParse({ ...values, listingId: listing.id });
    if (!result.success) {
      setErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    createOffer.mutate(result.data, { onSuccess: () => setSubmitted(true) });
  }

  if (submitted) {
    return (
      <p className="shadow-soft rounded-2xl bg-card p-6 text-sm text-muted-foreground">
        Your offer has been sent to the agency. Track its status from your{" "}
        <a href="/investor/marketplace-offers" className="font-medium text-primary hover:text-primary/80">
          offers page
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="shadow-soft space-y-5 rounded-2xl bg-card p-6">
      <h3 className="font-medium tracking-[-0.01em] text-foreground">Make an offer</h3>

      {canInstallment && canFull && (
        <FormField label="Payment plan" htmlFor="paymentPlan">
          <Select
            id="paymentPlan"
            value={values.paymentPlan}
            onChange={(event) => setValues((v) => ({ ...v, paymentPlan: event.target.value }))}
          >
            <option value="FULL_PAYMENT">Full payment</option>
            <option value="INSTALLMENT">Installments</option>
          </Select>
        </FormField>
      )}

      {values.paymentPlan === "INSTALLMENT" && listing.installmentDurationMonths.length > 0 && (
        <FormField label="Duration (months)" htmlFor="installmentDurationMonths">
          <Select
            id="installmentDurationMonths"
            value={values.installmentDurationMonths}
            onChange={(event) =>
              setValues((v) => ({ ...v, installmentDurationMonths: event.target.value }))
            }
          >
            {listing.installmentDurationMonths.map((months) => (
              <option key={months} value={months}>
                {months} months
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <FormField label="Offer amount (₦)" htmlFor="offerAmount" error={errors.offerAmount}>
        <Input
          id="offerAmount"
          type="number"
          min="0"
          value={values.offerAmount}
          onChange={(event) => setValues((v) => ({ ...v, offerAmount: event.target.value }))}
        />
      </FormField>

      <FormField label="Message (optional)" htmlFor="message" error={errors.message}>
        <Textarea
          id="message"
          value={values.message}
          onChange={(event) => setValues((v) => ({ ...v, message: event.target.value }))}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={createOffer.isPending}>
        {createOffer.isPending ? "Submitting…" : "Submit offer"}
      </Button>
    </form>
  );
}
