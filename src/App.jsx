import { useEffect, useRef, useState } from "react";
import FadeIn from "./components/FadeIn.jsx";
import { site, hero, resume, contact } from "./content.js";

/* ─────────────────────────────────────────────────────────
 * EMAIL MORPH STORYBOARD
 *
 *    0ms   email address begins lifting away character by character
 *   80ms   confirmation begins settling in character by character
 * 2200ms   confirmation returns to the email address
 * ───────────────────────────────────────────────────────── */
const EMAIL_MORPH = {
  confirmationDuration: 2200,
  characterStagger: 16,
};

function MorphText({ copied }) {
  const layers = [
    { text: site.email, state: "address" },
    { text: site.emailCopied, state: "confirmation" },
  ];

  return (
    <span className={`email-morph${copied ? " is-copied" : ""}`} aria-hidden="true">
      {layers.map((layer) => (
        <span
          className={`email-morph-layer email-morph-layer--${layer.state}`}
          key={layer.state}
        >
          {[...layer.text].map((character, index) => (
            <span
              className="email-morph-character"
              key={`${layer.state}-${index}`}
              style={{ "--character-delay": `${index * EMAIL_MORPH.characterStagger}ms` }}
            >
              {character === " " ? "\u00a0" : character}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function EmailMoment({ className, variant }) {
  const [stage, setStage] = useState(0);
  const resetTimer = useRef();
  const copied = stage >= 1;

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copyEmail = async () => {
    if (!navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(site.email);
      setStage(1);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(
        () => setStage(0),
        EMAIL_MORPH.confirmationDuration,
      );
    } catch {
      // The mailto link remains the fallback when clipboard access is unavailable.
    }
  };

  return (
    <span className={`email-moment email-moment--${variant}`}>
      <a
        className={className}
        href={`mailto:${site.email}`}
        onClick={variant === "additive" ? copyEmail : undefined}
      >
        <MorphText copied={copied} />
        <span className="visually-hidden">{site.email}</span>
      </a>
      {variant === "split" ? (
        <button
          className="email-copy-button mono"
          type="button"
          aria-label={site.copyEmailLabel}
          onClick={copyEmail}
        >
          {site.copyEmail}
        </button>
      ) : null}
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {copied ? site.emailCopied : ""}
      </span>
    </span>
  );
}

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
        <br />
        {hero.contactPrompt}
        <EmailMoment className="mail-link" variant="additive" />
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
          <a
            className="resume-download mono"
            href={site.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        </FadeIn>
        <ul className="resume">
          {resume.map((entry) => (
            <FadeIn as="li" key={`${entry.org}-${entry.dates}`}>
              <span className="dates micro">{entry.dates}</span>
              <div>
                <h3 className="title">
                  {entry.org} <span className="role-tag">{entry.role}</span>
                </h3>
                {entry.bullets?.length ? (
                  <ul className="resume-bullets">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {entry.subentries?.map((subentry) => (
                  <div className="resume-subentry" key={`${subentry.org}-${subentry.role}`}>
                    <h3 className="title">
                      {subentry.org} <span className="role-tag">{subentry.role}</span>
                    </h3>
                  </div>
                ))}
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
          <EmailMoment className="big-mail" variant="split" />
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
