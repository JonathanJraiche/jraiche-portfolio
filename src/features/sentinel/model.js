import layouts from '../../../sentinel-handoff/prototype/data/layouts.json';
import catalog from '../../../sentinel-handoff/prototype/data/widgets.json';
import diagnostics from '../../../sentinel-handoff/prototype/data/maintainer.json';

export { layouts, catalog, diagnostics };
export const storageKey = 'sentinel.savedConfigs';
export const widgetByType = Object.fromEntries(catalog.widgets.map(widget => [widget.type, widget]));
export const titleOf = widget => widget.title || widgetByType[widget.type].name;
export const clone = value => JSON.parse(JSON.stringify(value));
export const newId = () => globalThis.crypto.randomUUID();
export const emptyPicker = () => ({ open: false, query: '', category: 'All', preview: null });
export const utcTime = (seconds = false) => `${new Date().toISOString().slice(11, seconds ? 19 : 16)}Z`;
export const ordered = widgets => [...widgets].sort((a, b) => a.y - b.y || a.x - b.x);
export const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
export function fits(candidate, widgets) {
  const minimum = widgetByType[candidate.type]?.minSize || { w: 1, h: 1 };
  return ['x', 'y', 'w', 'h'].every(key => Number.isInteger(candidate[key])) &&
    candidate.x >= 0 && candidate.y >= 0 && candidate.x + candidate.w <= 12 &&
    candidate.w >= minimum.w && candidate.h >= minimum.h &&
    !widgets.some(other => other.i !== candidate.i && overlaps(candidate, other));
}
export function firstOpen(widgets, size) {
  if (size.w > 12 || size.w < 1 || size.h < 1) return null;
  const bottom = Math.max(0, ...widgets.map(widget => widget.y + widget.h));
  for (let y = 0; y <= bottom + size.h; y++) {
    for (let x = 0; x <= 12 - size.w; x++) {
      if (!widgets.some(widget => overlaps({ x, y, ...size }, widget))) return { x, y };
    }
  }
  return null;
}
function validConfig(config) {
  return config && typeof config.id === 'string' && typeof config.name === 'string' &&
    typeof config.description === 'string' && Array.isArray(config.widgets) &&
    new Set(config.widgets.map(widget => widget.i)).size === config.widgets.length &&
    config.widgets.every(widget => widgetByType[widget.type] && typeof widget.i === 'string' &&
      ['nominal', 'caution', 'critical', 'info', 'unknown'].includes(widget.status) && fits(widget, config.widgets));
}
export function readSaved(storage) {
  try {
    const parsed = JSON.parse((storage || globalThis.localStorage).getItem(storageKey));
    if (Array.isArray(parsed) && parsed.every(validConfig)) return parsed.map(config => ({ ...config, source: 'saved' }));
  } catch { /* An unavailable or invalid store uses the supplied seeds. */ }
  return clone(layouts.saved).map(config => ({ ...config, source: 'saved' }));
}
export function initialState(saved = readSaved(), scenario = 'build') {
  return {
    scenario, screen: scenario === 'build' ? 'library' : 'maintainer', mode: 'view',
    config: null, draft: null, picker: emptyPicker(), selectedId: null, menuFor: null,
    renamingId: null, dialog: null, toast: null, saved, announcement: '',
    maintainer: { selectedId: diagnostics.subsystems.find(item => item.selectedByDefault).id,
      refreshedAt: diagnostics.refreshedAt, logs: {}, runningId: null },
  };
}
function updateDraft(state, widgets, extras = {}) {
  return { ...state, draft: { ...state.draft, widgets }, ...extras };
}
export function reducer(state, action) {
  const widgets = state.draft?.widgets || [];
  switch (action.type) {
    case 'SYNC_SAVED': return { ...state, saved: action.saved };
    case 'SCENARIO': return initialState(state.saved, action.scenario);
    case 'LIBRARY': return { ...initialState(state.saved), maintainer: state.maintainer };
    case 'LOAD': return { ...state, screen: 'console', mode: 'view', config: clone(action.config), draft: null, picker: emptyPicker(), selectedId: null, menuFor: null };
    case 'NEW': {
      const config = { id: action.id, name: 'New configuration', description: '', source: 'new', widgets: [] };
      return { ...state, screen: 'console', mode: 'edit', config: null, draft: config, selectedId: null, picker: { ...emptyPicker(), open: true } };
    }
    case 'PICKER': {
      if (state.picker.open) return { ...state, picker: emptyPicker() };
      if (!state.config && !state.draft) return reducer(state, { type: 'NEW', id: action.id });
      return { ...state, mode: 'edit', draft: state.draft || clone(state.config), menuFor: null, picker: { ...emptyPicker(), open: true } };
    }
    case 'CLOSE_PICKER': return { ...state, picker: emptyPicker() };
    case 'FILTER': return { ...state, picker: { ...state.picker, ...action.patch, preview: null } };
    case 'PREVIEW': return { ...state, picker: { ...state.picker, preview: action.widgetType } };
    case 'ADD': {
      const definition = widgetByType[action.widgetType];
      const position = firstOpen(widgets, definition.defaultSize);
      if (!position) return state;
      const widget = { i: action.id, type: action.widgetType, ...position, ...definition.defaultSize, status: 'nominal' };
      return updateDraft(state, [...widgets, widget], { picker: emptyPicker(), selectedId: widget.i, announcement: `${definition.name} added` });
    }
    case 'SELECT': return { ...state, selectedId: state.mode === 'edit' ? action.id : null };
    case 'TRANSFORM': {
      const old = widgets.find(widget => widget.i === action.id);
      if (!old) return state;
      const candidate = { ...old, ...action.patch };
      if (!fits(candidate, widgets)) return state;
      const resized = old.w !== candidate.w || old.h !== candidate.h;
      const announcement = resized ? `${titleOf(candidate)} resized to ${candidate.w} by ${candidate.h}` : `${titleOf(candidate)} moved to column ${candidate.x + 1}, row ${candidate.y + 1}`;
      return updateDraft(state, widgets.map(widget => widget.i === action.id ? candidate : widget), { selectedId: action.id, announcement });
    }
    case 'MENU': return { ...state, menuFor: action.id };
    case 'START_RENAME': return { ...state, menuFor: null, renamingId: action.id, selectedId: action.id };
    case 'RENAME': return updateDraft(state, widgets.map(widget => widget.i === action.id ? { ...widget, title: action.title.trim().slice(0, 32) || titleOf(widget) } : widget), { renamingId: null });
    case 'CANCEL_RENAME': return { ...state, renamingId: null };
    case 'DUPLICATE': {
      const widget = widgets.find(item => item.i === action.id);
      if (!widget) return state;
      const position = firstOpen(widgets, { w: widget.w, h: widget.h });
      if (!position) return state;
      return updateDraft(state, [...widgets, { ...widget, i: action.newId, ...position }], { selectedId: action.newId, menuFor: null });
    }
    case 'REMOVE': {
      const draft = state.draft || (state.config && clone(state.config));
      const widget = draft?.widgets.find(item => item.i === action.id);
      if (!widget) return state;
      return updateDraft({ ...state, mode: 'edit', draft, picker: emptyPicker() }, draft.widgets.filter(item => item.i !== action.id), { menuFor: null, renamingId: null, selectedId: null, toast: { text: `${titleOf(widget)} removed`, undo: widget, index: draft.widgets.indexOf(widget) }, announcement: `${titleOf(widget)} removed. Undo available.` });
    }
    case 'UNDO': {
      if (!state.toast || !state.draft) return state;
      let widget = state.toast.undo;
      if (!fits(widget, widgets)) widget = { ...widget, ...firstOpen(widgets, { w: widget.w, h: widget.h }) };
      const restored = [...widgets];
      restored.splice(state.toast.index ?? restored.length, 0, widget);
      return updateDraft(state, restored, { toast: null, selectedId: widget.i, announcement: `${titleOf(widget)} restored` });
    }
    case 'CLEAR_TOAST': return { ...state, toast: null };
    case 'DIALOG': return { ...state, menuFor: null, picker: emptyPicker(), dialog: action.dialog };
    case 'EXIT': {
      const original = state.config?.widgets || [];
      if (state.mode === 'edit' && JSON.stringify(widgets) !== JSON.stringify(original)) {
        return { ...state, picker: emptyPicker(), menuFor: null, dialog: 'exit' };
      }
      return reducer(state, { type: 'LIBRARY' });
    }
    case 'CANCEL': {
      const original = state.config?.widgets || [];
      if (JSON.stringify(widgets) !== JSON.stringify(original)) return { ...state, picker: emptyPicker(), dialog: 'discard' };
      return reducer(state, { type: 'DISCARD' });
    }
    case 'DISCARD': return { ...state, screen: state.config ? 'console' : 'library', mode: 'view', draft: null, picker: emptyPicker(), selectedId: null, menuFor: null, dialog: null, toast: null };
    case 'SAVE': {
      if (!action.name.trim() || !state.draft) return state;
      const config = { ...clone(state.draft), id: state.draft.source === 'saved' ? state.draft.id : action.id, source: 'saved', name: action.name.trim(), description: action.description, editedAt: action.time };
      const exists = state.saved.some(item => item.id === config.id);
      const saved = exists ? state.saved.map(item => item.id === config.id ? config : item) : [...state.saved, config];
      return { ...state, saved, config, draft: null, mode: 'view', picker: emptyPicker(), selectedId: null, dialog: null, toast: null, announcement: `${config.name} saved` };
    }
    case 'SUBSYSTEM': return { ...state, maintainer: { ...state.maintainer, selectedId: action.id } };
    case 'TEST_START': return { ...state, maintainer: { ...state.maintainer, runningId: action.id } };
    case 'TEST_FINISH': return { ...state, maintainer: { ...state.maintainer, runningId: null, refreshedAt: action.time, logs: { ...state.maintainer.logs, [action.id]: [{ severity: 'info', time: action.time, message: 'Self-test passed' }, ...(state.maintainer.logs[action.id] || [])] } }, announcement: 'Self-test passed' };
    default: return state;
  }
}
