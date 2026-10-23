/**
 * Single source of truth for business details.
 *
 * Only information supplied for this demo is recorded here. Anything that has
 * not been confirmed with the owner is `null`, an "unconfirmed" status, or
 * absent. Do not fill gaps with guesses.
 */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHours =
  /** Gym is closed all day. */
  | { day: DayOfWeek; status: "closed" }
  /** Opening time is known; closing time is not. */
  | { day: DayOfWeek; status: "opens-at"; opensAt: string }
  /** Nothing has been confirmed for this day. */
  | { day: DayOfWeek; status: "unconfirmed" };

export type SocialLinks = {
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
};

export const siteConfig = {
  name: "Fitness World",
  category: "Gym and fitness centre",

  address: {
    lines: ["Aramkallu Road", "Vazhayila, Enikkara"],
    city: "Thiruvananthapuram",
    state: "Kerala",
    postalCode: "695564",
    country: "India",
    /** Google Maps plus code, as listed on Google Maps. */
    plusCode: "HX4H+62",
  },

  contact: {
    phoneDisplay: "+91 98956 44060",
    /** International format, digits only, no "+". Used for tel: and wa.me links. */
    phoneDigits: "919895644060",
    /**
     * Whether this number is confirmed to be on WhatsApp. Not confirmed yet, so
     * confirm with the owner before presenting the WhatsApp button as working.
     */
    whatsappConfirmed: false,
    email: null as string | null,
  },

  /**
   * Directions link, built from the plus code on the Google Maps listing rather
   * than the business name, because a gym with the same name is listed elsewhere
   * in the city. The link has not been confirmed to open the right pin. Open it
   * on a phone, check it, then set `verified` to true to show Directions buttons.
   */
  maps: {
    query: "HX4H+62 Thiruvananthapuram, Kerala",
    verified: false,
  },

  rating: {
    source: "Google",
    value: 4.5,
    outOf: 5,
    reviewCount: 102,
  },

  /**
   * The listing shows a 5:30 AM Monday opening and a Sunday closure. The rest
   * of the week and all closing times are unconfirmed.
   */
  hours: [
    { day: "Monday", status: "opens-at", opensAt: "5:30 AM" },
    { day: "Tuesday", status: "unconfirmed" },
    { day: "Wednesday", status: "unconfirmed" },
    { day: "Thursday", status: "unconfirmed" },
    { day: "Friday", status: "unconfirmed" },
    { day: "Saturday", status: "unconfirmed" },
    { day: "Sunday", status: "closed" },
  ] satisfies OpeningHours[],

  /** No official social media accounts have been supplied. */
  social: {
    instagram: null,
    facebook: null,
    youtube: null,
  } as SocialLinks,
} as const;

export type SiteConfig = typeof siteConfig;
