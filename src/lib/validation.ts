/**
 * Validation for the demo enquiry form. Pure functions, no dependencies, so it
 * can be checked on its own. Nothing here sends data anywhere.
 */

export type EnquiryValues = {
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
};

/** `contact` is the group-level error: neither a phone number nor an email was given. */
export type EnquiryField = "name" | "contact" | "phone" | "email" | "type";
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

const phoneCharacters = /^[+\d\s().-]+$/;
const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(
  values: EnquiryValues,
  allowedTypes: readonly string[],
): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const email = values.email.trim();

  if (name.length === 0) errors.name = "Enter your name.";
  else if (name.length < 2) errors.name = "Enter your name using at least 2 characters.";

  if (!phone && !email) {
    errors.contact = "Enter a phone number or an email address. One is enough.";
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!phoneCharacters.test(phone) || digits.length < 10 || digits.length > 13) {
      errors.phone = "Enter a phone number with 10 to 13 digits. You can include +91 and spaces.";
    }
  }

  if (email && !emailShape.test(email)) {
    errors.email = "Enter an email address like name@example.com.";
  }

  if (!allowedTypes.includes(values.type)) {
    errors.type = "Choose what your enquiry is about.";
  }

  return errors;
}
