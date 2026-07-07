import FadeIn from "./components/FadeIn.jsx";
import { site, hero, resume, strengths, contact, footer } from "./content.js";

function Header() {
  return (
    <header className="strip">
      <div className="container strip-inner mono">
        <a className="name" href="/">
          Jonathan&nbsp;Jraiche
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="container hero">
      <FadeIn as="h1">{hero.headline}</FadeIn>
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
    <section aria-labelledby="resume-title">
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
        <FadeIn as="ul" className="tags micro" aria-label="Core strengths">
          {strengths.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section aria-labelledby="contact-title">
      <div className="container">
        <FadeIn className="section-head">
          <h2 id="contact-title">Let's talk</h2>
        </FadeIn>
        <FadeIn as="p" className="contact-blurb">
          {contact.blurb}
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

function Footer() {
  return (
    <footer>
      <FadeIn className="container foot-inner micro">
        <span>{footer.copyright}</span>
        <span>{footer.type}</span>
        <span>{footer.note}</span>
      </FadeIn>
    </footer>
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
      <Footer />
    </>
  );
}
