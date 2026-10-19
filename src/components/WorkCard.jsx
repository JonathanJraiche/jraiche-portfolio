import { useEffect, useRef, useState } from "react";

/* WORK CARD STORYBOARD
 *    0ms   hover or focus lifts the frame and starts the underline
 *   80ms   the image settles closer and the arrow moves up and right
 *  450ms   the underline rests at full width
 *           pointer and focus leaving return everything to rest
 */
const TIMING = {
  frame:        180, // frame lift and color response
  detailReveal:  80, // image and arrow follow the initial response
  image:        450, // restrained image zoom
  underline:    450, // matches the home-page email underline
  arrow:        280, // arrow settles into its active position
  touchReveal:  750, // matches the email link's touch reveal delay
};

const FRAME = { lift: 2 };
const IMAGE = { activeScale: 1.015 };
const ARROW = { offset: 3 };

const motionStyle = {
  "--work-frame-duration": `${TIMING.frame}ms`,
  "--work-image-duration": `${TIMING.image}ms`,
  "--work-underline-duration": `${TIMING.underline}ms`,
  "--work-arrow-duration": `${TIMING.arrow}ms`,
  "--work-touch-delay": `${TIMING.touchReveal}ms`,
  "--work-lift": `${FRAME.lift}px`,
  "--work-image-scale": IMAGE.activeScale,
  "--work-arrow-offset": `${ARROW.offset}px`,
};

export default function WorkCard({ project }) {
  const [stage, setStage] = useState(0);
  const interaction = useRef({ pointer: false, focus: false });

  useEffect(() => {
    if (stage !== 1) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(2);
      return undefined;
    }
    const timer = window.setTimeout(() => setStage(2), TIMING.detailReveal);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const engage = (kind) => {
    const wasActive = interaction.current.pointer || interaction.current.focus;
    interaction.current[kind] = true;
    if (!wasActive) setStage(1);
  };

  const disengage = (kind) => {
    interaction.current[kind] = false;
    if (!interaction.current.pointer && !interaction.current.focus) setStage(0);
  };

  return (
    <a
      className="work-card"
      href={project.href}
      aria-labelledby={`work-${project.id}-title`}
      aria-describedby={`work-${project.id}-description`}
      data-stage={stage}
      style={motionStyle}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") engage("pointer");
      }}
      onPointerLeave={() => disengage("pointer")}
      onPointerCancel={() => disengage("pointer")}
      onFocus={() => engage("focus")}
      onBlur={() => disengage("focus")}
    >
      <span className="work-card-media">
        <img
          className="work-card-image"
          src={project.image}
          alt={project.imageAlt}
          width="1440"
          height="900"
          loading="lazy"
          decoding="async"
        />
      </span>
      <div className="work-card-content">
        <h3 id={`work-${project.id}-title`}>{project.title}</h3>
        <p id={`work-${project.id}-description`}>{project.description}</p>
        <span className="work-card-action mono" aria-hidden="true">
          <span className="work-card-action-label">View case study</span>
          <span className="work-card-arrow">↗</span>
        </span>
      </div>
    </a>
  );
}
