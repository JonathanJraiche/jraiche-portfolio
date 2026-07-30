import { useEffect, useRef } from "react";

// One shared IntersectionObserver for every FadeIn on the page.
// Stagger applies only within each revealed batch, so someone
// scrolling fast never waits on rows that appeared long ago.
let observer = null;
let queue = 0;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty("--stagger", `${queue++ * 90}ms`);
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
        queue = 0;
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
  }
  return observer;
}

/**
 * Scroll-triggered fade. Renders `as` (default div) with the fade-item
 * class; global.css keeps the hidden state gated on html.js and shows
 * everything instantly under prefers-reduced-motion.
 */
export default function FadeIn({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return undefined;
    }
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag ref={ref} className={`fade-item ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
