import { Button, Icon } from './Controls.jsx';
import { layouts, newId } from './model.js';

function Thumbnail({ widgets }) {
  const rows = Math.max(10, ...widgets.map(widget => widget.y + widget.h));
  return <span className="sn-thumbnail" aria-hidden="true" style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
    {widgets.map(widget => <span key={widget.i} style={{ gridColumn: `${widget.x + 1} / span ${widget.w}`, gridRow: `${widget.y + 1} / span ${widget.h}` }} />)}
  </span>;
}
function Card({ config, source, dispatch }) {
  return <button type="button" className="sn-config-card" onClick={() => dispatch({ type: 'LOAD', config: { description: '', ...config, source } })}>
    <Thumbnail widgets={config.widgets} /><span className="sn-card-content"><span className="sn-card-name"><span className="heading-m">{config.name}</span>{config.persona && <span className="label-s sn-tertiary">{config.persona}</span>}</span>
    <span className="data-s sn-tertiary">{config.widgets.length} widgets · {source === 'library' ? '12×10' : `edited ${config.editedAt}`}</span></span>
  </button>;
}
export default function Library({ state, dispatch }) {
  const create = () => dispatch({ type: 'NEW', id: newId() });
  return <div className="sn-library">
    <div className="sn-library-heading"><h2 className="heading-l">Configurations</h2><Button variant="primary" icon="plus" onClick={create}>New configuration</Button></div>
    <section className="sn-library-section" aria-label="Layout library"><div className="sn-section-label"><h3 className="label-s">Layout library</h3><span className="data-s sn-tertiary">{layouts.library.length}</span></div>
      <div className="sn-card-grid">{layouts.library.map(config => <Card key={config.id} config={config} source="library" dispatch={dispatch} />)}</div>
    </section>
    <section className="sn-library-section" aria-label="Saved configurations"><div className="sn-section-label"><h3 className="label-s">Saved on this console</h3><span className="data-s sn-tertiary">{state.saved.length}</span></div>
      <div className="sn-card-grid"><button type="button" className="sn-config-card" onClick={create}><span className="sn-blank-well" aria-hidden="true"><Icon name="plus" /></span><span className="sn-card-content heading-m">Blank configuration</span></button>
        {state.saved.map(config => <Card key={config.id} config={config} source="saved" dispatch={dispatch} />)}</div>
    </section>
  </div>;
}
