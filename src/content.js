// Single source of truth for site content. No location anywhere, by design.

export const site = {
  name: "Jonathan Jraiche",
  email: "jraichej@gmail.com",
  resumePdf: "./Jonathan-Jraiche-Resume.pdf",
};

export const hero = {
  headline:
    "I'm Jonathan Jraiche, a senior product designer focused on complex enterprise software, product strategy, and systems thinking.",
  // The email is rendered as a mailto link after this text.
  lede:
    "I design experiences for products that differentiate, clarify, and delight. While most of my recent work is classified and/or proprietary, I am always happy to discuss my process and answer any questions you have.",
  contactPrompt: "Reach out at ",
};

export const resume = [
  {
    dates: "Aug 2021 · Jul 2026",
    org: "Leidos",
    role: "User Experience Design Engineer",
    bullets: [
      "Served as the lead (and often sole) product designer across 10+ mission-critical programs for the DoD, NATO, TSA, and CDC, translating complex operator needs into interfaces that shipped across defense, aviation security, and public health.",
      "Drove the team’s adoption of a micro-frontend architecture that the entire system was built around by leading end-to-end research on a greenfield defense program that surfaced a previously unmapped range of operator roles and workflows.",
      "Sped screening and reduced operator errors, as validated by operator feedback, by redesigning the operator interface on TSA baggage-screening systems used by security agents worldwide.",
      "Reduced design-to-dev handoff time and rework tickets by building an enterprise design system from the ground up, adopted by 3+ engineer teams, including component libraries, interaction patterns, design tokens, and governance.",
      "Met customer specifications and earned positive operator feedback by delivering interfaces for demanding operator environments including ruggedized and sunlight-readable displays, glove operation, and enclosed shelters across form factors from mobile to wall-mounted monitors.",
      "Moved several products from failing to passing compliance by conducting Section 508 / WCAG 2.1 AA accessibility audits using JAWS, Deque axe DevTools, and Acrobat Pro.",
      "Reduced implementation ambiguity and improved build quality by partnering with engineers in Figma Dev Mode to deliver production-ready specs.",
      "Owned the end-to-end UX for artifact submission, discovery, and AI interaction as the designer of an internal database of thousands of artifacts powered by AI search and chat.",
      "Improved operator decision-making by designing an AI-enabled interface for a defense application.",
    ],
  },
  {
    dates: "May 2021 · Aug 2021",
    org: "Landvoice",
    role: "UX/UI Intern",
    bullets: [
      "Partnered with product and engineering teams to deliver user-centered solutions ahead of development schedule.",
      "Developed onboarding processes and redefined design standards to create cohesive, scalable design systems across products.",
      "Increased engagement and improved customer success rates by contributing to interaction design improvements.",
    ],
  },
  {
    dates: "May 2020 · Apr 2021",
    org: "Southwest Market",
    role: "Lead Web Designer & Site Manager",
    bullets: [
      "Led design strategy and implementation using Shopify CMS for the flagship e-commerce marketplace.",
      "Enhanced site navigation and user satisfaction by conducting in-depth user research including cognitive walkthroughs and KPI analysis.",
      "Generated $2K in revenue in 3 months as the lead designer and site manager for the e-commerce marketplace.",
    ],
  },
  {
    dates: "May 2017 · Aug 2017",
    org: "Valeo",
    role: "Comfort & Driving Assistance Co-op",
    bullets: [
      "Prototyped and tested autonomous parking aid/braking for 2020-2023 vehicles with the smart mobility team.",
      "Presented human-centered design insights to management regarding parking aid development, resulting in an unambiguous collision detection system for the end-user.",
    ],
  },
  {
    dates: "Education",
    org: "Michigan State University",
    role: "BA, Experience Architecture",
  },
  {
    dates: "Certification",
    org: "Scaled Agile, Inc.",
    role: "SAFe 6.0 Practitioner (SP)",
  },
];

export const contact = {
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathanjraiche/", arrow: "↗", external: true },
    {
      label: "Résumé, PDF",
      href: site.resumePdf,
      arrow: "↗",
      external: true,
    },
  ],
};
