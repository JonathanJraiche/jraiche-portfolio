import FadeIn from "./components/FadeIn.jsx";
import { site, hero, resume, contact } from "./content.js";

function Header() {
  const navItems = [
    { href: "#resume", label: "Résumé" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="strip">
      <div className="container strip-inner mono">
        <a className="name" href="#hero">
          Jonathan&nbsp;Jraiche
        </a>
        <nav className="section-nav" aria-label="Section navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div id="hero" className="container hero">
      <FadeIn as="h1" id="hero-title">
        {hero.headline}
      </FadeIn>
      <FadeIn as="p" className="lede">
        {hero.lede}
        <a className="mail-link" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </FadeIn>
    </div>
  );
}

function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-title">
      <div className="container">
        <FadeIn className="section-head">
          <h2 id="resume-title">Résumé</h2>
        </FadeIn>
        <ul className="resume">
          {resume.map((entry) => (
            <FadeIn as="li" key={`${entry.org}-${entry.dates}`}>
              <span className="dates micro">{entry.dates}</span>
              <div>
                <h3 className="title">
                  {entry.org} <span className="role-tag">{entry.role}</span>
                </h3>
                {entry.summary && <p>{entry.summary}</p>}
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="container">
        <FadeIn className="section-head">
          <h2 id="contact-title">Let's talk</h2>
        </FadeIn>
        <FadeIn>
          <a className="big-mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </FadeIn>
        <FadeIn as="ul" className="links mono">
          {contact.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}{" "}
                <span className="arrow" aria-hidden="true">
                  {link.arrow}
                </span>
              </a>
            </li>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Resume />
        <Contact />
      </main>
    </>
  );
}
