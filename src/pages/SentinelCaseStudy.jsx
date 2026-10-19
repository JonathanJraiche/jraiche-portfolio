import { useEffect } from 'react';
import copy from '../../sentinel-handoff/case-study/content.md?raw';
import SentinelPrototype, { SentinelSavedProvider } from '../features/sentinel/SentinelPrototype.jsx';
import { Button, Panel, StatusChip } from '../features/sentinel/Controls.jsx';
import { sentinelFigureUrl } from '../features/sentinel/figures.js';
import '../styles/sentinel-case-study.css';

const sections = Object.fromEntries(copy.split(/^## /m).slice(1).map(section => { const newline = section.indexOf('\n'); return [section.slice(0, newline), section.slice(newline + 1).trim()]; }));
const hero = sections.Hero;
const value = key => hero.match(new RegExp(`\\*\\*${key}:\\*\\* (.+)`))?.[1] || '';
function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') ? <strong key={index}>{part.slice(2,-2)}</strong> : part);
}
function Copy({ text, personas = false }) {
  const clean = text.split('\n').filter(line => !line.startsWith('**Figure:') && line !== '---').join('\n').trim();
  return clean.split(/\n\s*\n/).filter(Boolean).map((block, index) => {
    if (block.startsWith('* ')) return <ul key={index} className={personas ? 'case-personas' : undefined}>{block.split('\n').map((line, i) => <li key={i}><Inline text={line.replace(/^\* /,'')} /></li>)}</ul>;
    if (block.startsWith('### ')) return <h3 key={index}>{block.slice(4)}</h3>;
    return <p key={index}><Inline text={block.replace(/\n/g,' ')} /></p>;
  });
}
const alt = {
  Main: 'Configuration library with three persona presets, a blank configuration, and two saved configurations.',
  'Explored-Tabs': 'Explored approach: five separate tabs, with only the Situation view visible.',
  'Explored-RoleLogin': 'Explored approach: fixed layouts for operators, supervisors, and maintainers.',
  Picker: 'Searchable widget picker grouped into Plots, Health, Scheduler, and Logs.',
  'Hover-Plot': 'Situation Plot shows a six-column by six-row placement preview on an empty grid.',
  'Hover-Log': 'Event Log shows its three-column by ten-row placement preview.',
  Move: 'Situation Plot moves from column one to column four while Event Log stays in place.',
  Resize: 'Situation Plot previews resizing to nine columns by seven rows beside Event Log.',
  Menu: 'Widget options: Rename, Duplicate, Widget settings, and Remove widget.',
  Save: 'Save configuration dialog with Name and optional Description fields.',
  Populated: 'Saved console with Situation Plot, System Health, Alert Queue, Task Schedule, Event Log, and Timeline widgets.',
  Maintainer: 'Secondary sensor diagnostics with ten subsystems, four metrics, a declining return-rate trend, components, and fault history.',
};
export function Figure({ screen, caption, eager = false }) {
  return <figure className="case-figure"><div className="sentinel-scope case-screen"><img src={sentinelFigureUrl(screen)} width="1440" height={screen === 'Maintainer' ? '1040' : '900'} alt={alt[screen] || screen} loading={eager ? 'eager' : 'lazy'} decoding="async" /></div>{caption && <figcaption>{caption}</figcaption>}</figure>;
}
function Section({ name, children, wide = false, id }) {
  return <section className={`case-section${wide ? ' case-section--wide' : ''}`} id={id}><div className="case-section-heading"><h2>{name}</h2></div>{children}</section>;
}
function DesignSystem() {
  return <div className="sentinel-scope"><div className="sn-showcase">
    <div className="sn-showcase-row" aria-label="Button variants"><Button variant="primary">Primary</Button><Button>Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button></div>
    <div className="sn-showcase-row" aria-label="Status chips">{['nominal', 'caution', 'critical', 'info', 'unknown', 'priority'].map(status => <StatusChip status={status} key={status} />)}</div>
    <div className="sn-alert"><div><h3 className="heading-m">Secondary sensor</h3><p className="body-s">Receiver B return rate below 90 %</p></div><span className="data-s sn-tertiary">14:02:11Z</span></div>
    <div className="sn-track-row"><span className="data-m">SUB-07</span><span className="label-m">Secondary sensor</span><span className="data-s">82.4 %</span><span className="sn-spacer" /><StatusChip status="caution" /></div>
    <Panel title="Situation Plot" count={24}><div className="sn-widget-body"><span className="body-s sn-tertiary">[SITUATION PLOT CONTENT]</span></div></Panel>
  </div></div>;
}
export default function SentinelCaseStudy() {
  useEffect(() => {
    const oldTitle = document.title; const description = document.querySelector('meta[name=description]'); const oldDescription = description?.content;
    document.title = 'Sentinel | Jonathan Jraiche';
    if (description) description.content = value('One-line summary');
    window.scrollTo(0,0);
    return () => { document.title = oldTitle; if (description) description.content = oldDescription; };
  }, []);
  const tried = sections['What I tried first'].split('### Fixed layouts by sign-in role');
  const walkthrough = [...sections['How the builder works'].matchAll(/`([^`]+)\.html`: `([^`]+)`/g)];
  return <SentinelSavedProvider><article className="sentinel-case-study" aria-labelledby="sentinel-title">
    <div className="case-intro"><a className="case-back mono" href="#hero">← Back to portfolio</a><p className="micro">Case study · Sentinel</p><h1 id="sentinel-title">{value('Title')}</h1><p className="case-summary">{value('One-line summary')}</p><p className="case-meta"><Inline text={value('Meta row')} /></p><p className="case-overview"><Inline text={value('Project summary')} /></p></div>
    <div className="case-wide"><Figure screen="Populated" eager /></div>
    <div className="case-body">
      <Section name="The problem"><Copy text={sections['The problem']} personas /></Section>
      <Section name="My role and the study"><Copy text={sections['My role and the study']} /></Section>
      <Section name="What I tried first"><Copy text={tried[0]} /><Figure screen="Explored-Tabs" caption="Tabbed views: clean, but one view at a time." /><h3>Fixed layouts by sign-in role</h3><Copy text={tried[1]} /><Figure screen="Explored-RoleLogin" caption="An early concept with fixed layouts for operators, supervisors, and maintainers." /></Section>
      <Section name="The decision"><Copy text={sections['The decision']} /></Section>
      <Section name="Try it" wide id="sentinel-builder"><p>Load a layout or start blank, add a few widgets, then move, resize, and save.</p><SentinelPrototype fallback={<div className="case-mobile-sequence">{['Main', 'Hover-Plot', 'Move', 'Populated'].map(screen => <Figure key={screen} screen={screen} />)}</div>} /></Section>
      <Section name="How the builder works" wide><div className="case-walkthrough">{walkthrough.map(([match, screen, caption], index) => <Figure key={screen} screen={screen} caption={<><span className="micro">{String(index + 1).padStart(2, '0')}</span> {caption}</>} />)}</div></Section>
      <Section name="The exception: maintainers" wide><div className="case-prose"><Copy text={sections['The exception: maintainers'].split('**Embed:')[0]} /></div><SentinelPrototype initialScenario="maintainer" fallback={<Figure screen="Maintainer" />} /></Section>
      <Section name="The design system" wide><div className="case-prose"><Copy text={sections['The design system']} /></div><DesignSystem /></Section>
      <Section name="Outcome"><Copy text={sections.Outcome} /></Section>
      <div className="case-end"><a className="mono" href="#hero">← Back to portfolio</a><a className="mono" href="#contact">Let's talk ↗</a></div>
    </div>
  </article></SentinelSavedProvider>;
}
