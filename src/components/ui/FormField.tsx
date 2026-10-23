import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";

export function FieldHint({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="type-caption mt-2 text-ink-muted">
      {children}
    </p>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

type FieldProps = {
  label: string;
  /** Helper text shown under the control. */
  hint?: string;
  /** Error message. Its presence marks the control invalid. */
  error?: string;
  /**
   * Mark the control invalid without its own message, for example when an
   * error is shown once for a group of fields and referenced through
   * `aria-describedby`.
   */
  invalid?: boolean;
};

/** Wires the label, hint and error to a control through ids and aria attributes. */
function useFieldIds(
  id: string | undefined,
  hint: string | undefined,
  error: string | undefined,
  extraDescribedBy: string | undefined,
) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [extraDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
  return { controlId, hintId, errorId, describedBy };
}

export function TextField({
  label,
  hint,
  error,
  invalid,
  id,
  required,
  className,
  "aria-describedby": extraDescribedBy,
  ...inputProps
}: FieldProps & Omit<ComponentProps<"input">, "aria-invalid">) {
  const ids = useFieldIds(id, hint, error, extraDescribedBy);
  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={ids.controlId} required={required}>
        {label}
      </Label>
      <Input
        {...inputProps}
        id={ids.controlId}
        required={required}
        invalid={Boolean(error) || invalid}
        aria-describedby={ids.describedBy}
      />
      {hint && <FieldHint id={ids.hintId}>{hint}</FieldHint>}
      {error && <FieldError id={ids.errorId}>{error}</FieldError>}
    </div>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  invalid,
  id,
  required,
  className,
  "aria-describedby": extraDescribedBy,
  ...textareaProps
}: FieldProps & Omit<ComponentProps<"textarea">, "aria-invalid">) {
  const ids = useFieldIds(id, hint, error, extraDescribedBy);
  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={ids.controlId} required={required}>
        {label}
      </Label>
      <Textarea
        {...textareaProps}
        id={ids.controlId}
        required={required}
        invalid={Boolean(error) || invalid}
        aria-describedby={ids.describedBy}
      />
      {hint && <FieldHint id={ids.hintId}>{hint}</FieldHint>}
      {error && <FieldError id={ids.errorId}>{error}</FieldError>}
    </div>
  );
}

export function SelectField({
  label,
  hint,
  error,
  invalid,
  id,
  required,
  className,
  children,
  "aria-describedby": extraDescribedBy,
  ...selectProps
}: FieldProps & Omit<ComponentProps<"select">, "aria-invalid">) {
  const ids = useFieldIds(id, hint, error, extraDescribedBy);
  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={ids.controlId} required={required}>
        {label}
      </Label>
      <Select
        {...selectProps}
        id={ids.controlId}
        required={required}
        invalid={Boolean(error) || invalid}
        aria-describedby={ids.describedBy}
      >
        {children}
      </Select>
      {hint && <FieldHint id={ids.hintId}>{hint}</FieldHint>}
      {error && <FieldError id={ids.errorId}>{error}</FieldError>}
    </div>
  );
}
