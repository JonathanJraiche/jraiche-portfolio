import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Icon, IconButton } from './Controls.jsx';
import { firstOpen, fits, newId, ordered, titleOf, widgetByType } from './model.js';

const ResizeHandle = forwardRef(function ResizeHandle({ handleAxis, ...props }, ref) {
  return <button ref={ref} type="button" tabIndex={-1} className={`react-resizable-handle react-resizable-handle-${handleAxis} sn-resize-handle`} aria-label="Resize widget using Shift and arrow keys on its title" {...props} />;
});
function WidgetMenu({ widget, edit, canDuplicate, dispatch, close }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.querySelector('button:not(:disabled)')?.focus(); }, []);
  const onKey = event => {
    if (event.key === 'Escape') { event.stopPropagation(); event.preventDefault(); close(); }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const items = [...ref.current.querySelectorAll('button:not(:disabled)')];
    const index = items.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };
  return <div ref={ref} className="sn-widget-menu" role="menu" aria-label={`${titleOf(widget)} options`} onClick={event => event.stopPropagation()} onKeyDown={onKey}>
    {edit && <><button type="button" role="menuitem" onClick={() => dispatch({ type: 'START_RENAME', id: widget.i })}><Icon name="rename" />Rename</button>
      <button type="button" role="menuitem" disabled={!canDuplicate} onClick={() => dispatch({ type: 'DUPLICATE', id: widget.i, newId: newId() })}><Icon name="duplicate" />Duplicate</button></>}
    <button type="button" role="menuitem" onClick={() => dispatch({ type: 'DIALOG', dialog: { settingsFor: titleOf(widget) } })}><Icon name="settings" />Widget settings</button>
    {edit && <><hr /><button type="button" role="menuitem" className="sn-remove" onClick={() => dispatch({ type: 'REMOVE', id: widget.i })}><Icon name="remove" />Remove widget</button></>}
  </div>;
}
function Widget({ widget, state, dispatch, focusWidget, helpId }) {
  const optionsRef = useRef(null);
  const menuWrap = useRef(null);
  const rename = useRef(null);
  const cancelRename = useRef(false);
  const edit = state.mode === 'edit';
  const selected = edit && state.selectedId === widget.i;
  const renaming = state.renamingId === widget.i;
  const [name, setName] = useState(titleOf(widget));
  useEffect(() => { if (renaming) { setName(titleOf(widget)); cancelRename.current = false; rename.current?.focus(); rename.current?.select(); } }, [renaming, widget]);
  useEffect(() => {
    if (state.menuFor !== widget.i) return;
    const outside = event => { if (!menuWrap.current?.contains(event.target) && !optionsRef.current?.contains(event.target)) dispatch({ type: 'MENU', id: null }); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [state.menuFor, widget.i, dispatch]);
  const commit = () => { if (!cancelRename.current) { dispatch({ type: 'RENAME', id: widget.i, title: name }); focusWidget(widget.i); } };
  const keyboard = event => {
    if (event.target !== event.currentTarget || !edit) return;
    const deltas = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (deltas[event.key]) {
      event.preventDefault();
      const [dx, dy] = deltas[event.key];
      dispatch({ type: 'TRANSFORM', id: widget.i, patch: event.shiftKey ? { w: widget.w + dx, h: widget.h + dy } : { x: widget.x + dx, y: widget.y + dy } });
    } else if (['Delete', 'Backspace'].includes(event.key)) { event.preventDefault(); dispatch({ type: 'REMOVE', id: widget.i }); }
    else if (event.key === 'Escape') { event.preventDefault(); dispatch({ type: 'SELECT', id: null }); }
  };
  return <div className={`sn-widget${selected ? ' is-selected' : ''}`} data-widget={widget.i} data-x={widget.x} data-y={widget.y} data-w={widget.w} data-h={widget.h} onClick={() => edit && dispatch({ type: 'SELECT', id: widget.i })}>
    <div className="sn-widget-header">
      {renaming ? <input ref={rename} aria-label="Widget name" className="sn-rename" maxLength={32} value={name} onChange={event => setName(event.target.value)} onBlur={commit} onKeyDown={event => {
        if (event.key === 'Enter') { event.preventDefault(); commit(); }
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelRename.current = true; dispatch({ type: 'CANCEL_RENAME' }); focusWidget(widget.i); }
      }} /> : edit ? <button type="button" data-widget-focus={widget.i} className="sn-widget-drag" onFocus={() => dispatch({ type: 'SELECT', id: widget.i })} onKeyDown={keyboard} aria-describedby={helpId}>
        {selected && <Icon name="grip" />}<span className={`sn-status-dot sn-status--${widget.status}`} aria-hidden="true" /><span className="label-s">{titleOf(widget)}</span><span className="visually-hidden">, {widget.status}</span>
      </button> : <span className="sn-widget-view-title"><span className={`sn-status-dot sn-status--${widget.status}`} aria-hidden="true" /><span className="label-s">{titleOf(widget)}</span><span className="visually-hidden">, {widget.status}</span></span>}
      {widget.count !== undefined && <span className="data-s sn-tertiary">{widget.count}</span>}
      <IconButton ref={optionsRef} icon="more" label={`${titleOf(widget)} options`} aria-haspopup="menu" aria-expanded={state.menuFor === widget.i} onClick={event => { event.stopPropagation(); dispatch({ type: 'MENU', id: state.menuFor === widget.i ? null : widget.i }); }} />
    </div>
    <div className="sn-widget-body"><span className="body-s sn-tertiary">[{widgetByType[widget.type].name.toUpperCase()} CONTENT]</span></div>
    {state.menuFor === widget.i && <div ref={menuWrap}><WidgetMenu widget={widget} edit={edit} canDuplicate={!!firstOpen(state.draft?.widgets || [], { w: widget.w, h: widget.h })} dispatch={dispatch} close={() => { dispatch({ type: 'MENU', id: null }); optionsRef.current?.focus(); }} /></div>}
  </div>;
}
export default function WidgetCanvas({ state, dispatch, gridSettings, helpId }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(1024);
  const [gesture, setGesture] = useState(null);
  const lastValid = useRef(null);
  const edit = state.mode === 'edit';
  const widgets = (edit ? state.draft : state.config)?.widgets || [];
  const { columns, rowHeight, gap, padding } = gridSettings;
  const focusWidget = id => ref.current?.querySelector(`[data-widget-focus="${id}"]`)?.focus();
  const prevSelected = useRef(null);
  const prevRenaming = useRef(null);
  useLayoutEffect(() => {
    if (state.selectedId && state.selectedId !== prevSelected.current && !state.renamingId && !state.menuFor && !gesture) focusWidget(state.selectedId);
    if (prevRenaming.current && !state.renamingId) focusWidget(prevRenaming.current);
    prevRenaming.current = state.renamingId;
    prevSelected.current = state.selectedId;
  }, [state.selectedId, state.renamingId, state.menuFor, gesture]);
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(ref.current); return () => observer.disconnect();
  }, []);
  const bottom = Math.max(10, ...widgets.map(widget => widget.y + widget.h));
  const reserve = Math.max(4, ...widgets.map(widget => widget.h));
  const height = (bottom + (edit ? reserve : 0)) * (rowHeight + gap) - gap + padding * 2;
  const rectangle = item => ({ left: padding + item.x * ((width - padding * 2 + gap) / columns), top: padding + item.y * (rowHeight + gap), width: item.w * ((width - padding * 2 + gap) / columns) - gap, height: item.h * (rowHeight + gap) - gap });
  const definition = widgetByType[state.picker.preview];
  const position = definition && firstOpen(widgets, definition.defaultSize);
  const preview = position && { ...position, ...definition.defaultSize };
  const start = kind => (layout, old, item) => {
    const original = widgets.find(widget => widget.i === item.i);
    lastValid.current = { ...original }; setGesture({ kind, origin: { ...original }, target: { ...original } });
    dispatch({ type: 'SELECT', id: item.i }); dispatch({ type: 'MENU', id: null });
  };
  const during = kind => (layout, old, item, placeholder) => {
    const widget = widgets.find(entry => entry.i === item.i);
    const candidate = { ...widget, x: item.x, y: item.y, w: item.w, h: item.h };
    if (fits(candidate, widgets)) lastValid.current = candidate;
    else Object.assign(item, { x: lastValid.current.x, y: lastValid.current.y, w: lastValid.current.w, h: lastValid.current.h });
    if (placeholder) Object.assign(placeholder, { x: item.x, y: item.y, w: item.w, h: item.h });
    setGesture(previous => previous && ({ ...previous, kind, target: { ...lastValid.current } }));
  };
  const stop = (layout, old, item) => {
    const original = widgets.find(widget => widget.i === item.i);
    const candidate = { ...original, x: item.x, y: item.y, w: item.w, h: item.h };
    const final = fits(candidate, widgets) ? candidate : lastValid.current;
    if (final) dispatch({ type: 'TRANSFORM', id: item.i, patch: { x: final.x, y: final.y, w: final.w, h: final.h } });
    setGesture(null);
  };
  return <div ref={ref} className={`sn-canvas${edit ? ' is-editing' : ''}`} style={gesture?.kind === 'resize' ? { '--sn-origin-width': `${rectangle(gesture.origin).width}px`, '--sn-origin-height': `${rectangle(gesture.origin).height}px` } : undefined} onClick={event => { if (!event.target.closest('.sn-widget, .react-resizable-handle, .sn-toast')) dispatch({ type: 'SELECT', id: null }); }}>
    {edit && <p id={helpId} className="visually-hidden">Arrow keys move a widget. Shift and arrow keys resize it. Delete removes it. Escape clears selection.</p>}
    <GridLayout width={width} cols={columns} rowHeight={rowHeight} margin={[gap, gap]} containerPadding={[padding, padding]} compactType={null} preventCollision isBounded
      isDraggable={edit} isResizable={edit} draggableHandle=".sn-widget-drag" draggableCancel="input, .sn-icon-btn" resizeHandles={['se']} resizeHandle={<ResizeHandle />}
      layout={widgets.map(widget => ({ ...widget, minW: widgetByType[widget.type].minSize.w, minH: widgetByType[widget.type].minSize.h, isResizable: edit && widget.i === state.selectedId }))}
      onDragStart={start('move')} onDrag={during('move')} onDragStop={stop} onResizeStart={start('resize')} onResize={during('resize')} onResizeStop={stop} style={{ minHeight: height }}>
      {ordered(widgets).map(widget => <div key={widget.i}><Widget widget={widget} state={state} dispatch={dispatch} focusWidget={focusWidget} helpId={helpId} /></div>)}
    </GridLayout>
    {edit && widgets.length === 0 && !preview && <div className="sn-empty"><Icon name="layout" /><p className="heading-m">This configuration is empty</p></div>}
    {edit && preview && <div className="sn-footprint" style={rectangle(preview)} aria-hidden="true"><span className="sn-footprint-tag data-s">{definition.name} · {preview.w}×{preview.h}</span></div>}
    {gesture && <><div className="sn-origin" style={rectangle(gesture.origin)} aria-hidden="true" /><div className={`sn-footprint${gesture.kind === 'resize' ? ' is-resizing' : ''}`} style={rectangle(gesture.target)} aria-hidden="true"><span className="sn-footprint-tag data-s">{gesture.kind === 'resize' ? `${gesture.target.w}×${gesture.target.h}` : `Col ${gesture.target.x + 1} · Row ${gesture.target.y + 1}`}</span></div></>}
  </div>;
}
