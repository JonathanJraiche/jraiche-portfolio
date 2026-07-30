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
      "Led research across 10+ mission-critical programs for the DoD, NATO, TSA, and CDC, uncovering operator needs that drove system architecture, interface design, and shipped products across defense, aviation security, and public health.",
      "Led end-to-end research on a greenfield defense program that surfaced a previously unmapped range of operator roles and workflows, directly driving the team's adoption of a micro-frontend architecture built around those findings.",
      "Identified operator error patterns through research on TSA baggage-screening systems, then validated redesign impact via operator feedback, resulting in faster screening and fewer errors for security agents worldwide.",
      "Conducted field and contextual research into demanding operator environments (ruggedized and sunlight-readable displays, glove operation, enclosed shelters across mobile to wall-mounted form factors), translating constraints into requirements that met customer specs and earned positive operator feedback.",
      "Ran Section 508 / WCAG 2.1 AA accessibility evaluations using JAWS, Deque axe DevTools, and Acrobat Pro, moving several products from failing to passing compliance.",
      "Established research-informed patterns and documentation in an enterprise design system adopted by 3+ engineering teams, reducing design-to-dev handoff time and rework.",
      "Owned research and end-to-end UX for artifact submission, discovery, and AI interaction across an internal database of thousands of artifacts powered by AI search and chat.",
      "Researched operator decision-making needs to inform an AI-enabled interface for a defense application.",
    ],
  },
  {
    dates: "May 2021 · Aug 2021",
    org: "Landvoice",
    role: "UX/UI Intern",
    bullets: [
      "Partnered with product and engineering teams to deliver user-centered solutions ahead of development schedule.",
      "Researched and redefined onboarding processes and design standards to create cohesive, scalable systems across products.",
      "Contributed research-driven interaction improvements that increased engagement and customer success rates.",
    ],
  },
  {
    dates: "May 2020 · Apr 2021",
    org: "Southwest Market",
    role: "Lead Web Designer & Site Manager",
    bullets: [
      "Led design strategy and implementation using Shopify CMS for the flagship e-commerce marketplace.",
      "Conducted in-depth user research including cognitive walkthroughs and KPI analysis, enhancing site navigation and user satisfaction.",
      "Generated $2K in revenue in 3 months as lead designer and site manager for the e-commerce marketplace.",
    ],
  },
  {
    dates: "May 2017 · Aug 2017",
    org: "Valeo",
    role: "Comfort & Driving Assistance Co-op",
    bullets: [
      "Prototyped and tested autonomous parking aid/braking for 2020-2023 vehicles with the smart mobility team.",
      "Presented human-centered research insights on parking aid development to management, resulting in an unambiguous collision detection system for the end user.",
    ],
  },
  {
    dates: "Education",
    org: "Michigan State University",
    role: "Bachelor of Arts in Experience Architecture",
  },
  {
    dates: "May 2023",
    org: "SAFe Scaled Agile Certification",
    role: "",
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
