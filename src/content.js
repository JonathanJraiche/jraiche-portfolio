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
    summary:
      "Design system strategy, research, and high-fidelity prototyping for mission-critical defense enterprise applications, built to strict technical and regulatory constraints.",
  },
  {
    dates: "May 2021 · Aug 2021",
    org: "Landvoice",
    role: "UX/UI Intern",
    summary:
      "Redefined design standards and onboarding flows to create cohesive, scalable design systems across products.",
  },
  {
    dates: "May 2020 · Apr 2021",
    org: "Southwest Market",
    role: "Lead Web Designer",
    summary:
      "Led design strategy and Shopify implementation for a flagship ecommerce marketplace, informed by cognitive walkthroughs and KPI analysis.",
  },
  {
    dates: "May 2017 · Aug 2017",
    org: "Valeo",
    role: "Comfort & Driving Assistance Co-op",
    summary:
      "Prototyped and tested autonomous parking assistance for 2020 to 2023 vehicles with the smart mobility team.",
  },
  {
    dates: "2016 · 2021",
    org: "Michigan State University",
    role: "BA, Experience Architecture",
    summary: null,
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
