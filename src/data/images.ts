/**
 * Image slots for the homepage.
 *
 * No licensed photography of the gym (or any suitable stock photography) was
 * available when the homepage was built, so these are original illustrations
 * made for the demo, with `illustrative: true`. To use real photos, drop
 * optimised files into public/images/, then update `src`, `alt` and
 * `illustrative` here. Nothing else needs to change.
 *
 * Do not present stock photos as the real Fitness World premises, trainers or
 * members. Keep `illustrative: true` for any photo that is not of the gym.
 */

export type SiteImage = {
  /** Path under /public. If the file is missing, a hatched fallback shows instead. */
  src: string;
  alt: string;
  /** CSS object-position, used to keep the subject in frame when cropped. */
  position?: string;
  illustrative: boolean;
};

export const images = {
  hero: {
    src: "/images/hero.webp",
    alt: "Illustration of a loaded barbell, lit from the side against a dark background.",
    position: "82% 50%",
    illustrative: true,
  },
  intro: {
    src: "/images/intro.webp",
    alt: "Illustration of three dumbbells of increasing size resting on a rack.",
    illustrative: true,
  },
  strength: {
    src: "/images/training-strength.webp",
    alt: "Illustration of a weight plate seen face-on.",
    illustrative: true,
  },
  freeWeights: {
    src: "/images/training-free-weights.webp",
    alt: "Illustration of a single dumbbell resting at an angle.",
    illustrative: true,
  },
  cardio: {
    src: "/images/training-cardio.webp",
    alt: "Illustration of a kettlebell with swing arcs behind it.",
    illustrative: true,
  },
  general: {
    src: "/images/training-general.webp",
    alt: "Illustration of a rolled exercise mat beside a ball.",
    illustrative: true,
  },
} satisfies Record<string, SiteImage>;
