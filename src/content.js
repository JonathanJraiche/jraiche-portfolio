// Single source of truth for site content. No location anywhere, by design.

export const site = {
  name: "Jonathan Jraiche",
  email: "jraichej@gmail.com",
};

export const hero = {
  headline:
    "I'm Jonathan Jraiche, a product designer focused on enterprise software, product strategy, and systems thinking.",
  // The email is rendered as a mailto link after this text.
  lede:
    "I design experiences for products that differentiate, clarify, and delight. While most of my recent work is classified and/or proprietary, I am always happy to discuss my process and answer any questions you have.",
  contactPrompt: "Reach out at ",
};

export const resume = [
  {
    dates: "Aug 2021 · Present",
    org: "Leidos",
    role: "UX Software Design Engineer",
    bullets: [
      "Led the strategy, architecture, and documentation of a scalable design system for defense enterprise applications, establishing reusable components and interaction standards.",
      "Defined reusable component libraries, interaction patterns, and governance guidelines to reduce design rework and improve cross-team implementation.",
      "Designed high-fidelity prototypes and complex workflow solutions for mission-critical tools operating within strict technical and regulatory constraints.",
      "Directed the complete user research process from study design and stakeholder alignment to execution, analysis, and insight delivery, driving system architecture decisions.",
      "Applied advanced information architecture and journey mapping techniques to simplify high-density workflows and support long-term product scalability.",
    ],
  },
  {
    dates: "May 2021 · Aug 2021",
    org: "Landvoice",
    role: "UX/UI Intern",
    bullets: [
      "Developed onboarding processes and redefined design standards to create cohesive, scalable design systems across products.",
      "Partnered with product and engineering teams to deliver user-centered solutions ahead of development schedule.",
      "Contributed to interaction design improvements that increased engagement and improved customer that success rates.",
    ],
  },
  {
    dates: "May 2020 · Apr 2021",
    org: "Southwest Market",
    role: "Lead Web Designer",
    bullets: [
      "Led design strategy and implementation using Shopify CMS for flagship ecommerce marketplace",
      "Conducted in-depth user research, including cognitive walkthroughs and KPI analysis, to inform design decisions that enhanced site navigation and user satisfaction.",
    ],
  },
  {
    dates: "May 2017 · Aug 2017",
    org: "Valeo",
    role: "Comfort & Driving Assistance Co-op",
    bullets: [
      "Prototyped and tested autonomous parking aid/braking for 2020-2023 vehicles with smart mobility team",
      "Presented human-centered design insights to management regarding parking aid development, resulting in an unambiguous collision detection system for end user",
      "Presented cost analysis for acquisition of testing materials to management decreasing testing costs by 20%",
    ],
  },
  {
    dates: "2016 · 2021",
    org: "Michigan State University",
    role: "BA, Experience Architecture",
    bullets: [
      "Major GPA: 3.93",
      "Dean's List all applicable semesters",
    ],
  },
];

export const contact = {
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathanjraiche/", arrow: "↗", external: true },
    {
      label: "Résumé, PDF",
      href: "/Jonathan-Jraiche-Resume.pdf",
      arrow: "↓",
      external: false,
    },
  ],
};
