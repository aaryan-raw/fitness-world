/**
 * Homepage copy. Everything here is grounded in the business details and
 * review themes supplied for the demo. Do not add claims about results,
 * safety, certifications, equipment, prices or statistics.
 */
import { HeartHandshake, Target, Zap, DoorOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { images } from "@/data/images";
import { routes } from "@/data/navigation";

/** "Built by consistency." is a proposed creative direction, not a verified slogan. */
export const heroContent = {
  eyebrow: "Fitness World, Vazhayila, Enikkara",
  headline: "Built by consistency.",
  copy: "A motivating place to train in Vazhayila, with trainers who help you get your technique right and keep your progress moving.",
} as const;

export const trustPoints = [
  {
    title: "Supportive trainers",
    description: "Members describe patient, knowledgeable guidance.",
  },
  {
    title: "Form comes first",
    description: "Reviewers mention attention to technique and progress.",
  },
  {
    title: "A motivating space",
    description: "A clean, welcoming place to put in the work.",
  },
] as const;

export const introContent = {
  eyebrow: "Your training space",
  heading: "A better environment to show up and put in the work.",
  lead: "Members describe Fitness World as a welcoming, well-kept gym with knowledgeable, patient trainers who keep an eye on form and progress.",
  body: "Whether you are just starting or getting back into a routine, it is a space to focus on the work, with support when you want it.",
} as const;

export type TrainingCategory = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: keyof typeof images;
  /** Grid placement at the `lg` breakpoint (literal classes so Tailwind detects them). */
  span: string;
};

/**
 * A proposed overview, NOT a verified inventory of the gym's equipment,
 * classes or services. The section says so, and links to the facilities page
 * (Stage 4) so visitors can ask what is available.
 */
export const trainingContent = {
  eyebrow: "Training overview",
  heading: "Find your way to stronger.",
  note: "A proposed overview of how members can train. Equipment and services are still being confirmed, so ask the gym what is available.",
  linkLabel: "Ask about availability",
} as const;

export const trainingCategories: TrainingCategory[] = [
  {
    id: "strength",
    title: "Strength training",
    description: "Build strength with structured sessions and trainer guidance on technique.",
    href: routes.facilities,
    image: "strength",
    span: "lg:col-span-5",
  },
  {
    id: "free-weights",
    title: "Free-weight training",
    description: "Free-weight work for lifters who want to focus on control and form.",
    href: routes.facilities,
    image: "freeWeights",
    span: "lg:col-span-7",
  },
  {
    id: "cardio",
    title: "Cardio and conditioning",
    description: "Raise your heart rate and build stamina as part of a balanced routine.",
    href: routes.facilities,
    image: "cardio",
    span: "lg:col-span-7",
  },
  {
    id: "general",
    title: "General fitness",
    description: "A place to start if you are getting active, with support to find a routine that fits.",
    href: routes.facilities,
    image: "general",
    span: "lg:col-span-5",
  },
];

export type WhyPoint = { title: string; description: string; icon: LucideIcon };

export const whyContent = {
  eyebrow: "Why Fitness World",
  heading: "What members appreciate.",
  intro: "Themes that stand out in member feedback.",
} as const;

export const whyPoints: WhyPoint[] = [
  {
    title: "Trainers who guide you",
    description: "Members mention knowledgeable, patient trainers who take the time to support them.",
    icon: HeartHandshake,
  },
  {
    title: "Attention to technique",
    description: "Reviewers point to a focus on form and progress, so you are not left guessing.",
    icon: Target,
  },
  {
    title: "An atmosphere that motivates",
    description: "The energy in the gym is part of the appeal, in a clean and focused space.",
    icon: Zap,
  },
  {
    title: "A welcoming place to train",
    description: "Members describe feeling comfortable and respected while they work out.",
    icon: DoorOpen,
  },
];

export const membershipContent = {
  eyebrow: "Membership",
  heading: "Your next chapter starts here.",
  copy: "Get in touch with the gym to find out which membership plans are available and what suits the way you want to train.",
  panelTitle: "Membership plans and prices available on enquiry",
  panelNote: "Plan details are confirmed directly with the gym.",
} as const;

export type Review = {
  id: string;
  title: string;
  /** A paraphrase in our own words, never a verbatim quote. */
  summary: string;
  themes: string[];
};

export const reviewsContent = {
  eyebrow: "Member feedback",
  heading: "What members say.",
  disclosure: "Paraphrased from customer reviews on Google. These are summaries, not verbatim quotes.",
  contactLabel: "Get in Touch with the Gym",
} as const;

export const reviews: Review[] = [
  {
    id: "trainers",
    title: "Knowledgeable trainers",
    summary:
      "One member points to trainers who know their craft and keep an eye on form and progress. They also mention structured workouts, a clean gym and a motivating environment.",
    themes: ["Trainer knowledge", "Form and progress", "Structured workouts", "Cleanliness", "Motivation"],
  },
  {
    id: "welcoming",
    title: "A welcoming atmosphere",
    summary:
      "After two months of training, another member describes a welcoming atmosphere and patient trainers, and says they feel comfortable and respected as a woman.",
    themes: ["Welcoming", "Patient trainers", "Respect"],
  },
  {
    id: "motivating",
    title: "A motivating trainer",
    summary: "A third reviewer appreciates the training environment and highlights a trainer who keeps them motivated.",
    themes: ["Training environment", "Motivating trainer"],
  },
];

export const locationContent = {
  eyebrow: "Find the gym",
  heading: "Visit Fitness World in Vazhayila.",
  hoursNote: "Opening hours are still being confirmed. Please call before you visit.",
} as const;

export const finalCtaContent = {
  heading: "Ready to make room for progress?",
  copy: "Get in touch to ask about membership, or call the gym to arrange a visit.",
} as const;
