/**
 * Membership configuration.
 *
 * No plans, durations or prices have been supplied, so none are invented. While
 * `pricingStatus` is "unconfirmed" (or `plans` is empty) the memberships page
 * must show an enquiry call to action instead of prices.
 *
 * To add a plan later, push an entry into `plans` and set `pricingStatus` to
 * "confirmed" once the owner has approved the figures.
 */

export type MembershipPlan = {
  id: string;
  name: string;
  /** Free text, e.g. "1 month". Must come from the owner. */
  duration: string;
  /** Whole rupees (INR). `null` means the price is not confirmed. */
  priceInr: number | null;
  benefits: string[];
  featured?: boolean;
};

export type MembershipConfig = {
  pricingStatus: "unconfirmed" | "confirmed";
  plans: MembershipPlan[];
};

export const membershipConfig: MembershipConfig = {
  pricingStatus: "unconfirmed",
  plans: [],
};
