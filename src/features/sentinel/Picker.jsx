import { useEffect, useRef } from 'react';
import { Glyph, Icon } from './Controls.jsx';
import { catalog, firstOpen, newId } from './model.js';
export default function Picker({ state, dispatch, onClose, id }) {
  const search = useRef(null);
  const rows = useRef([]);
  useEffect(() => { search.current?.focus(); }, []);
  const widgets = catalog.widgets.filter(widget => (state.picker.category === 'All' || widget.category === state.picker.category) && widget.name.toLowerCase().includes(state.picker.query.toLowerCase()));
  const onKey = event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const index = rows.current.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown' ? (index + 1) % widgets.length : (index - 1 + widgets.length) % widgets.length;
    rows.current[next]?.focus();
  };
  return <div id={id} className="sn-picker" role="dialog" aria-label="Add widget" onKeyDown={onKey}>
    <div className="sn-picker-controls"><label className="sn-search"><Icon name="search" /><input ref={search} type="search" aria-label="Search widgets" placeholder="Search widgets" value={state.picker.query} onChange={event => dispatch({ type: 'FILTER', patch: { query: event.target.value } })} /></label>
      <div className="sn-filters" role="group" aria-label="Filter by category">{['All', ...catalog.categories].map(category => <button key={category} type="button" aria-pressed={state.picker.category === category} onClick={() => dispatch({ type: 'FILTER', patch: { category } })}>{category}</button>)}</div>
    </div>
    <div className="sn-picker-list">{widgets.length === 0 ? <p className="sn-no-results body-m">No widgets match</p> : catalog.categories.map(category => {
      const group = widgets.filter(widget => widget.category === category);
      return group.length > 0 && <div key={category} className="sn-picker-group"><div className="sn-picker-group-title"><span className="label-s">{category}</span><span className="data-s">{group.length}</span></div>{group.map(widget => {
        const position = firstOpen(state.draft.widgets, widget.defaultSize);
        return <button ref={element => { rows.current[widgets.indexOf(widget)] = element; }} key={widget.type} type="button" className={`sn-picker-row${state.picker.preview === widget.type ? ' is-previewed' : ''}`}
          onMouseEnter={() => dispatch({ type: 'PREVIEW', widgetType: widget.type })} onMouseLeave={event => { if (document.activeElement !== event.currentTarget) dispatch({ type: 'PREVIEW', widgetType: null }); }}
          onFocus={() => dispatch({ type: 'PREVIEW', widgetType: widget.type })} onBlur={() => dispatch({ type: 'PREVIEW', widgetType: null })}
          onClick={() => { if (position) dispatch({ type: 'ADD', widgetType: widget.type, id: newId() }); }}>
          <Glyph kind={widget.icon} /><span className="label-m sn-picker-name">{widget.name}</span><span className={`data-s${!position ? ' sn-status--caution' : ''}`}>{position ? `${widget.defaultSize.w}×${widget.defaultSize.h}` : 'No room'}</span>
        </button>;
      })}</div>;
    })}</div><div className="sn-picker-footer data-s">{widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'}</div>
  </div>;
}
