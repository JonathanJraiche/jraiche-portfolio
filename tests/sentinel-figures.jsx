// Development-only image fixture, excluded from the production entry point.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Figure } from '../src/pages/SentinelCaseStudy.jsx';
import '../src/styles/global.css';

const requested = new URLSearchParams(location.search).get('screen');
const screens = Object.keys(import.meta.glob('../src/assets/sentinel/*.png'))
  .map(path => path.split('/').at(-1).replace('.png', ''))
  .filter(screen => !requested || screen === requested);

createRoot(document.getElementById('root')).render(<main>
  <h1 className="visually-hidden">Sentinel figure audit</h1>
  {screens.map(screen => <div key={screen} data-figure={screen}><Figure screen={screen} eager /></div>)}
</main>);
