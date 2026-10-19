import { createContext, useContext, useEffect, useId, useReducer, useRef, useState } from 'react';
import { Button, Dialog, IconButton } from './Controls.jsx';
import Library from './Library.jsx';
import Picker from './Picker.jsx';
import WidgetCanvas from './WidgetCanvas.jsx';
import Diagnostics from './Diagnostics.jsx';
import { clone, initialState, layouts, newId, readSaved, reducer, storageKey, utcTime } from './model.js';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import './tokens.scoped.css';
import './sentinel.css';

const SavedContext = createContext(null);
export function SentinelSavedProvider({ children }) {
  const [saved, setSaved] = useState(readSaved);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [saved]);
  return <SavedContext.Provider value={{ saved, setSaved, storageError }}>{children}</SavedContext.Provider>;
}
function SaveDialog({ state, dispatch, onSave }) {
  const [name, setName] = useState(state.draft.name);
  const [description, setDescription] = useState('');
  const input = useRef(null);
  const id = useId();
  const close = () => dispatch({ type: 'DIALOG', dialog: null });
  const save = () => { if (name.trim()) onSave(name, description); };
  return <Dialog title="Save configuration" onClose={close} initialFocus={input} footer={<><Button onClick={close}>Cancel</Button><Button variant="primary" type="submit" form={`${id}-form`} disabled={!name.trim()}>Save</Button></>}>
    <form id={`${id}-form`} onSubmit={event => { event.preventDefault(); save(); }}><label className="sn-field" htmlFor={`${id}-name`}><span className="label-s">Name</span><input id={`${id}-name`} ref={input} required value={name} onChange={event => setName(event.target.value)} /></label>
    <label className="sn-field" htmlFor={`${id}-description`}><span className="label-s">Description · optional</span><textarea id={`${id}-description`} rows={3} value={description} onChange={event => setDescription(event.target.value)} /></label></form>
  </Dialog>;
}
export function SentinelConsole({ scenario, resetKey, initialConsoleState, onScenarioChange }) {
  const { saved, setSaved } = useContext(SavedContext);
  const [state, dispatch] = useReducer(reducer, null, () => initialConsoleState || initialState(saved, scenario));
  const [gridSettings, setGridSettings] = useState({ columns: 12, rowHeight: 56, gap: 12, padding: 16 });
  const root = useRef(null); const add = useRef(null); const pickerArea = useRef(null); const content = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const pickerId = useId(); const helpId = useId();
  useEffect(() => { if (!initialConsoleState) dispatch({ type: 'SCENARIO', scenario }); }, [scenario, resetKey, initialConsoleState]);
  useEffect(() => { dispatch({ type: 'SYNC_SAVED', saved }); }, [saved]);
  useEffect(() => {
    const style = getComputedStyle(root.current);
    setGridSettings({ columns: Number(style.getPropertyValue('--grid-columns')), rowHeight: parseFloat(style.getPropertyValue('--grid-row-height')), gap: parseFloat(style.getPropertyValue('--grid-gap')), padding: parseFloat(style.getPropertyValue('--grid-padding')) });
  }, []);
  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 8000);
    return () => clearTimeout(timer);
  }, [state.toast]);
  useEffect(() => {
    if (!tooltip) return;
    const timer = setTimeout(() => setTooltip(null), 2500);
    return () => clearTimeout(timer);
  }, [tooltip]);
  useEffect(() => {
    if (!state.maintainer.runningId) return;
    const id = state.maintainer.runningId;
    const timer = setTimeout(() => dispatch({ type: 'TEST_FINISH', id, time: utcTime(true) }), 2000);
    return () => clearTimeout(timer);
  }, [state.maintainer.runningId]);
  const closePicker = () => { dispatch({ type: 'CLOSE_PICKER' }); add.current?.focus(); };
  useEffect(() => {
    if (!state.picker.open) return;
    const outside = event => { if (!pickerArea.current?.contains(event.target)) { dispatch({ type: 'CLOSE_PICKER' }); add.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [state.picker.open]);
  const save = (name, description) => {
    const action = { type: 'SAVE', name, description, id: newId(), time: utcTime() };
    const next = reducer(state, action);
    dispatch(action); setSaved(next.saved);
    requestAnimationFrame(() => add.current?.focus());
  };
  const previousScreen = useRef(state.screen);
  useEffect(() => { if (previousScreen.current !== state.screen) content.current?.scrollTo(0, 0); previousScreen.current = state.screen; }, [state.screen]);
  const edit = state.mode === 'edit';
  return <div ref={root} className="sentinel-scope sn-console" data-screen={state.screen} data-mode={state.mode}>
    <div className="sn-console-content" ref={content} inert={state.dialog ? '' : undefined}>
      <header className="sn-topbar"><div className="sn-topbar-brand"><span className="sn-wordmark">SENTINEL</span></div>
        <div className="sn-topbar-status"><span className="sn-tooltip-anchor"><Button variant="danger" className="sn-stop" onClick={() => setTooltip('stop')} aria-describedby={tooltip === 'stop' ? `${pickerId}-stop-tip` : undefined}>STOP</Button>{tooltip === 'stop' && <span className="sn-tooltip body-s" role="tooltip" id={`${pickerId}-stop-tip`}>Not active in this prototype</span>}</span>
        <span className="sn-system-status label-s"><span aria-hidden="true" />System nominal</span></div>
        <div className="sn-topbar-actions" ref={pickerArea}><span className="data-m sn-secondary">14:07:22Z</span><span className="sn-divider" aria-hidden="true" />
          {state.screen !== 'maintainer' && <Button ref={add} icon="plus" aria-expanded={state.picker.open} aria-controls={state.picker.open ? pickerId : undefined} onClick={() => { if (state.picker.open) closePicker(); else dispatch({ type: 'PICKER', id: newId() }); }}>Add widget</Button>}
          <IconButton icon="save" label="Save configuration" disabled={!edit} onClick={() => dispatch({ type: 'DIALOG', dialog: 'save' })} />
          <span className="sn-tooltip-anchor"><IconButton icon="settings" label="Console settings" onClick={() => setTooltip('settings')} aria-describedby={tooltip === 'settings' ? `${pickerId}-settings-tip` : undefined} />{tooltip === 'settings' && <span className="sn-tooltip body-s" role="tooltip" id={`${pickerId}-settings-tip`}>Not active in this prototype</span>}</span>
          {state.picker.open && <Picker state={state} dispatch={dispatch} onClose={closePicker} id={pickerId} />}
        </div>
      </header>
      {state.screen === 'library' && <Library state={state} dispatch={dispatch} />}
      {state.screen === 'console' && <>{edit && <div className="sn-editbar"><h2 className="heading-m">{state.draft.name}</h2><span className="sn-spacer" /><Button variant="ghost" onClick={() => dispatch({ type: 'CANCEL' })}>Cancel</Button><Button variant="primary" onClick={() => dispatch({ type: 'DIALOG', dialog: 'save' })}>Save configuration</Button></div>}
        <WidgetCanvas state={state} dispatch={dispatch} gridSettings={gridSettings} helpId={helpId} /></>}
      {state.screen === 'maintainer' && <Diagnostics state={state} dispatch={dispatch} onLibrary={() => onScenarioChange?.('build')} />}
    </div>
    {state.toast && edit && <div className="sn-toast"><span className="body-m">{state.toast.text}</span><Button autoFocus variant="ghost" onClick={() => dispatch({ type: 'UNDO' })}>Undo</Button></div>}
    {state.dialog === 'save' && <SaveDialog state={state} dispatch={dispatch} onSave={save} />}
    {state.dialog === 'discard' && <Dialog title="Discard changes?" onClose={() => dispatch({ type: 'DIALOG', dialog: null })} footer={<><Button onClick={() => dispatch({ type: 'DIALOG', dialog: null })}>Keep editing</Button><Button variant="danger" onClick={() => dispatch({ type: 'DISCARD' })}>Discard</Button></>}></Dialog>}
    {state.dialog?.settingsFor && <Dialog title={`${state.dialog.settingsFor} settings`} onClose={() => dispatch({ type: 'DIALOG', dialog: null })} footer={<Button onClick={() => dispatch({ type: 'DIALOG', dialog: null })}>Close</Button>}><p className="body-m">Settings arrive with widget content.</p></Dialog>}
    <span role="status" aria-live="polite" aria-atomic="true" className="visually-hidden">{state.announcement}</span>
  </div>;
}
export default function SentinelPrototype({ initialScenario = 'build', fallback }) {
  const [scenario, setScenario] = useState(initialScenario);
  const [resetKey, setResetKey] = useState(0);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const { setSaved, storageError } = useContext(SavedContext);
  const label = useId();
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setWide(media.matches);
    media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);
  const reset = event => { event.preventDefault(); setSaved(clone(layouts.saved).map(config => ({ ...config, source: 'saved' }))); setScenario(initialScenario); setResetKey(key => key + 1); };
  return <div className="sentinel-embed">
    {wide ? <><div className="case-prototype-controls"><label htmlFor={label}>Scenario</label><select id={label} value={scenario} onChange={event => setScenario(event.target.value)}><option value="build">Build a dashboard</option><option value="maintainer">Maintainer diagnostics</option></select><a href="#/work/sentinel" onClick={reset}>Reset prototype</a></div>
      <SentinelConsole scenario={scenario} resetKey={resetKey} onScenarioChange={setScenario} />{storageError && <p className="case-note" role="status">Saved for this visit. Your browser could not save configurations for a page reload.</p>}</> : <><p className="case-note">The prototype runs on screens 1024px wide and above.</p>{fallback}</>}
  </div>;
}
