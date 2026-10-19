import { forwardRef, useEffect, useRef } from 'react';

const paths = {
  plus: 'M12 5v14M5 12h14', save: 'M5 3h11l3 3v15H5z M8 3v5h7V3 M8 21v-7h8v7',
  search: 'M20 20l-4-4', close: 'M6 6l12 12M18 6L6 18', grip: 'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
  more: 'M5 12h.01M12 12h.01M19 12h.01', layout: 'M3 4h18v16H3zM10 4v16M10 12h11',
  chevron: 'M9 5l7 7-7 7', rename: 'M4 20l4-1 12-12-3-3L5 16z', duplicate: 'M9 9h12v12H9zM15 9V3H3v12h6',
  remove: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  settings: 'M9 3h6l1 4 4 1 1 6-4 2-1 4-6 1-2-4-4-1-1-6 4-2z',
};
export function Icon({ name, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sn-icon" {...props}>
    <path d={paths[name] || paths.layout} />
    {name === 'search' && <circle cx="10.5" cy="10.5" r="6.5" />}
    {name === 'settings' && <circle cx="12" cy="12" r="3" />}
  </svg>;
}
export const Button = forwardRef(function Button({ variant = 'secondary', icon, children, className = '', ...props }, ref) {
  return <button ref={ref} type="button" className={`sn-btn sn-btn--${variant} ${className}`} {...props}>{icon && <Icon name={icon} />}{children}</button>;
});
export const IconButton = forwardRef(function IconButton({ icon, label, className = '', ...props }, ref) {
  return <button ref={ref} type="button" className={`sn-icon-btn ${className}`} aria-label={label} {...props}><Icon name={icon} /></button>;
});
export function StatusChip({ status }) {
  return <span className={`sn-chip sn-status--${status}`}><span aria-hidden="true" className="sn-chip-dot" />{status}</span>;
}
export function Panel({ title, count, children, className = '' }) {
  return <div className={`sn-panel ${className}`}><div className="sn-panel-header"><span className="label-s">{title}</span>{count !== undefined && <span className="data-s sn-tertiary">{count}</span>}</div>{children}</div>;
}
export function Glyph({ kind }) {
  const glyphs = {
    plot: <><circle cx="18" cy="14" r="9" /><circle cx="18" cy="14" r="4" /><path className="sn-accent" d="M18 14l6-6" /></>,
    trend: <><path d="M5 22V6M5 22h26" /><path className="sn-accent" d="M7 18l6-5 5 3 6-8 5 4" /></>,
    health: <><path d="M7 9h4M7 15h4M7 21h4M15 9h14M15 15h14M15 21h14" /><circle className="sn-status--caution" cx="29" cy="15" r="1.5" fill="currentColor" /></>,
    detail: <><rect x="6" y="6" width="24" height="16" rx="2" /><path className="sn-accent" d="M10 18v-4M15 18v-8M20 18v-6M25 18v-9" /></>,
    sched: <><path d="M6 8h24M6 14h24M6 20h24" /><path className="sn-accent" d="M6 14h10" /></>,
    timeline: <><path d="M4 14h28" /><rect className="sn-accent" x="7" y="9" width="8" height="4" rx="1" /><rect x="18" y="15" width="10" height="4" rx="1" /></>,
    log: <path d="M6 7h24M6 12h18M6 17h24M6 22h16" />,
    alerts: <><path className="sn-status--caution" d="M18 4l13 20H5z" /><path d="M18 11v5M18 20h.01" /></>,
  };
  return <span className="sn-glyph"><svg viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">{glyphs[kind]}</svg></span>;
}
export function Dialog({ title, children, footer, onClose, initialFocus }) {
  const ref = useRef(null);
  const returnFocus = useRef(null);
  useEffect(() => {
    returnFocus.current = document.activeElement;
    const target = initialFocus?.current || ref.current.querySelector('input, button, textarea');
    target?.focus();
    return () => { if (returnFocus.current?.isConnected) returnFocus.current.focus(); };
  }, [initialFocus]);
  const trap = event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    if (event.key !== 'Tab') return;
    const controls = [...ref.current.querySelectorAll('button:not(:disabled), input, textarea, a[href]')];
    const first = controls[0]; const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <div className="sn-scrim" onKeyDown={trap}><div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="sn-dialog">
    <div className="sn-dialog-header"><h2 className="heading-m">{title}</h2><IconButton icon="close" label={`Close ${title}`} onClick={onClose} /></div>
    <div className="sn-dialog-body">{children}</div><div className="sn-dialog-footer">{footer}</div>
  </div></div>;
}
