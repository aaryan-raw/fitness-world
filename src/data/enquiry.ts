/**
 * Enquiry form options. Deliberately generic: none of these implies a service
 * the gym has not confirmed.
 */
export const enquiryTypes = [
  { value: "membership", label: "Membership options" },
  { value: "facilities", label: "Equipment and facilities" },
  { value: "visit", label: "Visiting the gym" },
  { value: "other", label: "Something else" },
] as const;

export type EnquiryTypeValue = (typeof enquiryTypes)[number]["value"];
