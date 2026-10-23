/**
 * Copy for the supporting pages. Like src/data/home.ts, everything here is
 * grounded in the supplied business details and review themes.
 *
 * Do not add: a history, owner or founder, qualifications, awards, trainer
 * profiles, transformation claims, equipment or services, prices, plans,
 * opening hours, policies, or verbatim review quotes. Where something is
 * unknown, phrase it as a question to ask the gym.
 */
import { trainingCategories } from "@/data/home";

export const aboutPage = {
  hero: {
    eyebrow: "About Fitness World",
    title: "Consistency, with support behind it.",
    lead: "Fitness World is a gym in Vazhayila, Enikkara, Thiruvananthapuram. Members describe a welcoming place to train, with trainers who pay attention to form and progress.",
  },
  approach: {
    eyebrow: "How members describe it",
    heading: "What training here is about.",
    note: "Drawn from member feedback. This is not an official statement from the gym.",
    principles: [
      {
        word: "Consistency",
        text: "Progress comes from turning up regularly. Members describe an atmosphere that helps them stay motivated.",
      },
      {
        word: "Guidance",
        text: "Reviewers mention knowledgeable, patient trainers who take the time to support them.",
      },
      {
        word: "Form",
        text: "Attention to technique comes up in member feedback, with trainers who help get the details right.",
      },
      {
        word: "Progress",
        text: "Members mention trainers who keep an eye on progress, and workouts with a clear structure.",
      },
      {
        word: "Welcome",
        text: "A clean, welcoming space where members say they feel comfortable and respected.",
      },
    ],
  },
  expect: {
    eyebrow: "Before you visit",
    heading: "What to expect when you get in touch.",
    intro:
      "Details such as opening hours, fees and equipment are confirmed directly with the gym. Here is a sensible way to start the conversation.",
    steps: [
      {
        title: "Ask",
        text: "Call the gym to ask about current membership options, fees and opening hours.",
      },
      {
        title: "Check",
        text: "Ask which equipment and services are available, so you know what to expect when you arrive.",
      },
      {
        title: "Share",
        text: "Mention your experience level and what you want to achieve, so the conversation starts in the right place.",
      },
    ],
  },
  cta: {
    heading: "Ready to find out more?",
    copy: "Make an enquiry about membership, or call the gym to ask your questions directly.",
  },
} as const;

/** Questions to put to the gym for each proposed category. Questions, not claims. */
const categoryQuestions: Record<string, string[]> = {
  strength: [
    "Which strength equipment is available?",
    "Can a trainer help me with my technique?",
  ],
  "free-weights": [
    "Which free weights are available?",
    "Is there guidance for people who are new to lifting?",
  ],
  cardio: [
    "What cardio and conditioning options are available?",
    "How do I fit them into a balanced routine?",
  ],
  general: [
    "What is a good way to start if I am new to the gym?",
    "Can the trainers suggest a routine that fits my goals?",
  ],
};

export const facilitiesPage = {
  hero: {
    eyebrow: "Facilities and training",
    title: "Find the training that fits.",
    lead: "A proposed overview of how members can train at Fitness World. Equipment and services are still being confirmed, so check with the gym before you visit.",
  },
  legend: {
    heading: "How to read this page",
    items: [
      {
        badge: "Illustrative artwork",
        text: "The images are original illustrations. They are not photographs of the gym or its equipment, and they do not show what is available there.",
      },
      {
        badge: "Proposed category",
        text: "The categories are a suggested way to describe training. They are not a verified list of what the gym has.",
      },
    ],
  },
  categories: {
    eyebrow: "Training overview",
    heading: "Four ways to train.",
    questionsLabel: "Questions to ask the gym",
    askLabel: "Ask the Gym",
    badge: "Proposed category",
    items: trainingCategories.map((category) => ({
      ...category,
      questions: categoryQuestions[category.id] ?? [],
    })),
  },
  confirm: {
    eyebrow: "Before you visit",
    heading: "Confirm what is available.",
    copy: "None of the above has been verified with the gym, and equipment and services can change. Call or get in touch to confirm what is available today.",
  },
} as const;

export const membershipsPage = {
  hero: {
    eyebrow: "Membership",
    title: "Start with a conversation.",
    lead: "Membership options, fees and terms are best confirmed directly with the gym. Get in touch to hear what is currently available and what suits the way you want to train.",
  },
  status: {
    title: "Membership plans and prices available on enquiry",
    text: "No plans or prices are listed on this website. The gym can tell you what is available, what it costs and what the terms are.",
  },
  questions: {
    eyebrow: "Before you enquire",
    heading: "Questions worth asking.",
    items: [
      "Which membership options are available?",
      "What do they cost, and how long do they last?",
      "What are the terms, including joining and renewal?",
      "What are the opening hours?",
      "Can I visit the gym before I decide?",
      "Which equipment and services does membership include?",
    ],
  },
  enquire: {
    eyebrow: "Enquire",
    heading: "Make an enquiry.",
    copy: "Use the form to prepare your enquiry, then call the gym to ask it. The form is a demonstration and does not send anything.",
  },
} as const;

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    title: "Get in touch with the gym.",
    lead: "The quickest way to reach Fitness World is to call. The form on this page is a demonstration and does not send messages.",
  },
  quick: {
    heading: "Call the gym",
    hoursNote: "Opening hours are still being confirmed. Please call before you visit.",
    mapsNote:
      "The map link is a general Google Maps search for the plus code. It is not an official business pin or confirmed directions.",
  },
  happens: {
    heading: "What happens when you use the form",
    steps: [
      "Your browser checks that the required details are filled in.",
      "Nothing is sent. No server receives your details, and Fitness World does not receive an enquiry.",
      "You are shown the gym's phone number so you can call and ask directly.",
    ],
  },
  form: {
    eyebrow: "Enquiry form",
    heading: "Prepare an enquiry.",
  },
} as const;

export const reviewsPage = {
  hero: {
    eyebrow: "Member feedback",
    title: "What members say.",
  },
  ratingNote:
    "From the Google listing information supplied for this demo. This is not a live figure, and the count may have changed.",
  summaries: {
    eyebrow: "In summary",
    heading: "Three things members mention.",
    items: [
      {
        id: "upkeep",
        title: "Well-kept equipment and facilities",
        summary:
          "Members mention a clean gym and equipment that is looked after, which is part of what makes it a good place to train.",
        themes: ["Cleanliness", "Equipment upkeep"],
      },
      {
        id: "trainers",
        title: "Supportive trainers",
        summary:
          "Reviewers describe knowledgeable, patient trainers who keep an eye on form and progress, with workouts that have a clear structure.",
        themes: ["Trainer knowledge", "Form and progress", "Structured workouts"],
      },
      {
        id: "atmosphere",
        title: "A motivating, welcoming environment",
        summary:
          "Members say the atmosphere keeps them motivated. One member, speaking as a woman, says they feel comfortable and respected here.",
        themes: ["Motivating", "Welcoming", "Respect"],
      },
    ],
  },
  howToRead: {
    heading: "How to read these summaries",
    items: [
      "They are paraphrases written for this demo. They are not verbatim reviews.",
      "They are not shown as individual Google review cards. Reviewer names, dates, photos and ratings for single reviews are left out on purpose.",
      "The 4.5 rating and review count are not live figures.",
    ],
    readMore:
      "To read the original reviews, search for Fitness World, Vazhayila on Google. This website does not link to them because no verified listing link is available.",
  },
  cta: {
    heading: "Want to hear it from the gym?",
    copy: "Get in touch to ask about membership, equipment or visiting, or call the gym directly.",
  },
} as const;
