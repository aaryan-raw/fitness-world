/** Site navigation. Shared by the header and footer. Every route here exists. */

export type NavItem = {
  label: string;
  href: string;
};

/**
 * Named destinations used by buttons across the site. `enquire` points at the
 * enquiry form section (id="enquire") on the memberships page.
 */
export const routes = {
  memberships: "/memberships",
  enquire: "/memberships#enquire",
  contact: "/contact",
  facilities: "/facilities",
  about: "/about",
  reviews: "/reviews",
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: routes.about },
  { label: "Facilities", href: routes.facilities },
  { label: "Memberships", href: routes.memberships },
  { label: "Reviews", href: routes.reviews },
  { label: "Contact", href: routes.contact },
];

/** Primary call to action shown in the header and mobile menu. */
export const enquiryAction: NavItem = {
  label: "Membership Enquiry",
  href: routes.enquire,
};
