"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Info, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldError, SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import { enquiryTypes } from "@/data/enquiry";
import { siteConfig } from "@/data/site";
import { telHref } from "@/lib/contact";
import { validateEnquiry } from "@/lib/validation";
import type { EnquiryErrors, EnquiryField, EnquiryValues } from "@/lib/validation";

/**
 * DEMO ENQUIRY FORM. Client-side only.
 *
 * It checks the details in the browser and then tells the visitor, plainly,
 * that nothing was sent. There is no backend, no network request, no storage
 * and no success message: Fitness World never receives anything from this form.
 * Wire it to a real, owner-approved channel before it is used for real.
 */

type Status = "editing" | "invalid" | "reviewed";

/** True only once the page has hydrated in the browser. False on the server and with JS off. */
const subscribeNever = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(subscribeNever, () => true, () => false);
type ControlChange = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const fieldLabels: Record<EnquiryField, string> = {
  name: "Name",
  contact: "Phone or email",
  phone: "Phone number",
  email: "Email address",
  type: "Enquiry type",
};

type EnquiryFormProps = {
  /** Pre-selects an enquiry type, e.g. "membership" on the memberships page. */
  defaultType?: string;
};

export function EnquiryForm({ defaultType = "" }: EnquiryFormProps) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    type: `${uid}-type`,
    message: `${uid}-message`,
    contactError: `${uid}-contact-error`,
  };

  const [values, setValues] = useState<EnquiryValues>({
    name: "",
    phone: "",
    email: "",
    type: defaultType,
    message: "",
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("editing");
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  // Until hydrated the submit button is disabled. Without this, pressing Enter
  // or the button before the script loads (or with JS off) would make the
  // browser send the typed details to the server as a GET query string.
  const hydrated = useHydrated();

  // After a valid check, move focus to the explanation so it is announced.
  useEffect(() => {
    if (status === "reviewed") resultHeadingRef.current?.focus();
  }, [status]);

  function update(field: keyof EnquiryValues) {
    return (event: ControlChange) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      // Clear the message for a field as soon as the visitor edits it.
      setErrors((current) => {
        const next = { ...current };
        delete next[field as EnquiryField];
        if (field === "phone" || field === "email") delete next.contact;
        return next;
      });
    };
  }

  function controlIdFor(field: EnquiryField): string {
    return field === "contact" ? ids.phone : ids[field];
  }

  function focusField(field: EnquiryField) {
    document.getElementById(controlIdFor(field))?.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Always prevented: this form never submits anywhere.
    event.preventDefault();
    const found = validateEnquiry(values, enquiryTypes.map((type) => type.value));
    setErrors(found);

    const order: EnquiryField[] = ["name", "contact", "phone", "email", "type"];
    const firstInvalid = order.find((field) => found[field]);
    if (firstInvalid) {
      setStatus("invalid");
      focusField(firstInvalid);
      return;
    }
    setStatus("reviewed");
  }

  if (status === "reviewed") {
    return (
      <Card tone="canvas" padding="lg" highlighted>
        <Badge tone="accent">Demo form</Badge>
        <h2
          ref={resultHeadingRef}
          tabIndex={-1}
          className="type-section mt-5 focus:outline-none"
        >
          Nothing has been sent
        </h2>
        <p className="type-lead mt-5">
          Your details look complete, but this is a demonstration. It checked them in your browser
          only. Nothing was sent to {siteConfig.name}, and the gym has not received an enquiry.
        </p>
        <p className="type-body mt-4 text-ink-muted">
          To ask about membership, equipment or visiting, please call the gym directly.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button href={telHref()} className="w-full sm:w-auto">
            <Phone aria-hidden="true" className="size-4" />
            Call {siteConfig.contact.phoneDisplay}
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              setStatus("editing");
              requestAnimationFrame(() => focusField("name"));
            }}
          >
            Edit Details
          </Button>
        </div>
      </Card>
    );
  }

  const errorEntries = (Object.keys(errors) as EnquiryField[])
    .filter((field) => errors[field])
    .map((field) => ({ field, message: errors[field] as string }));

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Demo enquiry form" className="space-y-6">
      <div className="rounded-card border border-accent/40 bg-accent/10 p-5">
        <p className="flex items-center gap-2">
          <Info aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <Badge tone="accent">Demo form</Badge>
        </p>
        <p className="type-body mt-3">
          This form is a demonstration. It checks your details in your browser and does{" "}
          <strong>not</strong> send them to {siteConfig.name} or anyone else. To reach the gym, call{" "}
          <a
            href={telHref()}
            className="font-semibold text-accent underline underline-offset-4"
          >
            {siteConfig.contact.phoneDisplay}
          </a>
          .
        </p>
      </div>

      <noscript>
        <p className="rounded-card border border-line-strong p-5 text-[0.9375rem]">
          JavaScript is turned off, so this demo form cannot check your details. Nothing is sent. To
          reach the gym, call{" "}
          <a href={telHref()} className="font-semibold text-accent underline underline-offset-4">
            {siteConfig.contact.phoneDisplay}
          </a>
          .
        </p>
      </noscript>

      {status === "invalid" && errorEntries.length > 0 && (
        <div role="alert" className="rounded-card border border-danger/60 p-5">
          <p className="font-semibold text-danger">
            Please check {errorEntries.length} {errorEntries.length === 1 ? "field" : "fields"}:
          </p>
          <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
            {errorEntries.map(({ field, message }) => (
              <li key={field}>
                <a
                  href={`#${controlIdFor(field)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                  className="underline underline-offset-4"
                >
                  {fieldLabels[field]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <TextField
        id={ids.name}
        label="Name"
        name="name"
        autoComplete="name"
        required
        value={values.name}
        onChange={update("name")}
        error={errors.name}
      />

      <fieldset className="min-w-0">
        <legend className="type-label mb-1">
          Phone or email{" "}
          <span className="font-normal text-ink-muted">(at least one)</span>
        </legend>
        {errors.contact && (
          <div className="mb-3">
            <FieldError id={ids.contactError}>{errors.contact}</FieldError>
          </div>
        )}
        <div className="mt-2 grid gap-6 md:grid-cols-2">
          <TextField
            id={ids.phone}
            label="Phone number"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update("phone")}
            error={errors.phone}
            invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? ids.contactError : undefined}
          />
          <TextField
            id={ids.email}
            label="Email address"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            error={errors.email}
            invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? ids.contactError : undefined}
          />
        </div>
      </fieldset>

      <SelectField
        id={ids.type}
        label="What is your enquiry about?"
        name="type"
        required
        value={values.type}
        onChange={update("type")}
        error={errors.type}
      >
        <option value="">Choose one</option>
        {enquiryTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </SelectField>

      <TextAreaField
        id={ids.message}
        label="Message (optional)"
        name="message"
        maxLength={1000}
        value={values.message}
        onChange={update("message")}
        hint="Optional. For example, your experience level or what you want to ask."
      />

      <div>
        <Button type="submit" disabled={!hydrated} className="w-full sm:w-auto">
          Check My Details
        </Button>
        <p className="type-caption mt-3 text-ink-muted">
          Nothing is sent when you press this button.
        </p>
      </div>
    </form>
  );
}
