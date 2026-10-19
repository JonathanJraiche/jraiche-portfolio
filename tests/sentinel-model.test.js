import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalog, firstOpen, fits, initialState, layouts, overlaps, readSaved, reducer, storageKey } from '../src/features/sentinel/model.js';
const fresh = () => initialState(readSaved({ getItem: () => null }));
const act = (state, type, rest = {}) => reducer(state, { type, ...rest });
test('supplied layouts and seeds satisfy catalog sizes, bounds, and collision rules', () => {
  for (const config of [...layouts.library, ...layouts.saved]) for (const widget of config.widgets) assert.ok(fits(widget, config.widgets), `${config.name}: ${widget.type}`);
});
test('placement scans rows then columns, and grows below occupied rows', () => {
  const occupied = [{ i: 'a', x: 0, y: 0, w: 9, h: 10 }];
  assert.deepEqual(firstOpen(occupied, { w: 3, h: 4 }), { x: 9, y: 0 });
  assert.deepEqual(firstOpen(occupied, { w: 4, h: 4 }), { x: 0, y: 10 });
  assert.equal(firstOpen(occupied, { w: 13, h: 1 }), null);
});
test('complete builder flow preserves changes and supports undo after intervening placement', () => {
  let state = act(fresh(), 'NEW', { id: 'new' });
  for (const [id, type] of [['plot','situation-plot'],['health','system-health'],['alert','alert-queue']]) state = act(state, 'ADD', { id, widgetType: type });
  assert.equal(state.draft.widgets.length, 3);
  state = act(state, 'TRANSFORM', { id: 'plot', patch: { x: 0, y: 7 } });
  state = act(state, 'TRANSFORM', { id: 'plot', patch: { w: 7, h: 7 } });
  state = act(state, 'RENAME', { id: 'plot', title: 'My plot' });
  assert.equal(state.draft.widgets[0].w, 7);
  state = act(state, 'REMOVE', { id: 'plot' });
  state = act(state, 'ADD', { id: 'other', widgetType: 'situation-plot' });
  state = act(state, 'UNDO');
  assert.equal(state.draft.widgets.length, 4);
  for (const widget of state.draft.widgets) assert.ok(fits(widget,state.draft.widgets));
  state = act(state, 'SAVE', { id: 'saved-flow', name: 'Watch', description: 'Test', time: '10:42Z' });
  const reloaded = readSaved({ getItem: key => { assert.equal(key, storageKey); return JSON.stringify(state.saved); } });
  assert.equal(reloaded.at(-1).widgets.find(widget => widget.i === 'plot').title, 'My plot');
  assert.equal(state.mode, 'view');
});
test('cannot overlap, exceed column twelve, go above row one, or resize below catalog minimum', () => {
  let state = act(fresh(), 'NEW', { id: 'new' });
  state = act(state, 'ADD', { id: 'a', widgetType: 'situation-plot' });
  state = act(state, 'ADD', { id: 'b', widgetType: 'system-health' });
  for (const patch of [{ x: 1 }, { x: 7 }, { x: -1 }, { y: -1 }, { w: 3 }, { h: 3 }, { x: 0.5 }]) assert.equal(act(state,'TRANSFORM',{ id:'a',patch }), state);
});
test('library presets are immutable, saved configurations overwrite, and scenarios preserve saved entries', () => {
  let state = act(fresh(), 'LOAD', { config: { ...layouts.library[0], description: '', source: 'library' } });
  state = act(state, 'PICKER');
  state = act(state, 'SAVE', { id:'copy', name:'Copy', description:'',time:'12:00Z' });
  assert.equal(state.saved.length,3); assert.equal(layouts.library[0].name,'Standard watch');
  state = act(state,'PICKER');
  state = act(state,'SAVE',{id:'unused',name:'Copy updated',description:'',time:'12:01Z'});
  assert.equal(state.saved.length,3);assert.equal(state.saved.at(-1).id,'copy');
  state = act(state,'SCENARIO',{scenario:'maintainer'});assert.equal(state.saved.length,3);assert.equal(state.maintainer.selectedId,'SUB-07');
});
test('cancel requires discard only when changed', () => {
  let state = act(fresh(),'NEW',{id:'new'});
  assert.equal(act(state,'CANCEL').screen,'library');
  state = act(state,'ADD',{id:'a',widgetType:'situation-plot'});
  assert.equal(act(state,'CANCEL').dialog,'discard');
  assert.equal(act(act(state,'CANCEL'),'DISCARD').screen,'library');
});
test('closing unchanged consoles returns to the library and preserves saved layouts and diagnostics', () => {
  const base = fresh();
  const loaded = act(base, 'LOAD', { config: { ...layouts.saved[0], source: 'saved' } });
  for (const state of [loaded, act(loaded, 'PICKER'), act(base, 'NEW', { id: 'empty' })]) {
    const closed = act(state, 'EXIT');
    assert.equal(closed.screen, 'library');
    assert.equal(closed.dialog, null);
    assert.equal(closed.draft, null);
    assert.deepEqual(closed.saved, base.saved);
  }
  let maintainer = act(base, 'SCENARIO', { scenario: 'maintainer' });
  maintainer = act(maintainer, 'TEST_FINISH', { id: 'SUB-07', time: '18:00:00Z' });
  const closed = act(maintainer, 'EXIT');
  assert.equal(closed.scenario, 'build');
  assert.equal(closed.screen, 'library');
  assert.deepEqual(closed.maintainer.logs, maintainer.maintainer.logs);
});
test('closing a changed console preserves the draft until the user confirms or keeps editing', () => {
  const base = fresh();
  const drafts = [
    act(base, 'NEW', { id: 'new' }),
    act(act(base, 'LOAD', { config: { ...layouts.saved[0], source: 'saved' } }), 'PICKER'),
  ];
  for (const draft of drafts) {
    const edited = act(draft, 'ADD', { id: 'extra', widgetType: 'system-health' });
    const pending = act(edited, 'EXIT');
    assert.equal(pending.dialog, 'exit');
    assert.equal(pending.picker.open, false);
    assert.deepEqual(pending.draft, edited.draft);
    const kept = act(pending, 'DIALOG', { dialog: null });
    assert.equal(kept.mode, 'edit');
    assert.deepEqual(kept.draft, edited.draft);
    const closed = act(pending, 'LIBRARY');
    assert.equal(closed.screen, 'library');
    assert.equal(closed.draft, null);
    assert.deepEqual(closed.saved, base.saved);
  }
});
test('self-test completion is attached to the tested subsystem when selection changes', () => {
  let state = act(fresh(),'TEST_START',{id:'SUB-07'});
  state = act(state,'SUBSYSTEM',{id:'SUB-10'});
  state = act(state,'TEST_FINISH',{id:'SUB-07',time:'18:00:00Z'});
  assert.equal(state.maintainer.logs['SUB-07'][0].message,'Self-test passed');
  assert.equal(state.maintainer.logs['SUB-10'],undefined);
});
test('storage errors, corrupted JSON, and invalid layouts fall back to seeds; an empty saved list is respected', () => {
  assert.equal(readSaved({getItem:()=>{throw new Error('unavailable');}}).length,2);
  assert.equal(readSaved({getItem:()=>'{bad'}).length,2);
  assert.equal(readSaved({getItem:()=>JSON.stringify([{id:'bad',name:'Bad',widgets:[]}])}).length,2);
  assert.deepEqual(readSaved({getItem:()=>'[]'}),[]);
});
test('first-open placement stays valid through a large mixed-widget session', () => {
  const widgets=[];
  for(let i=0;i<200;i++) {
    const definition=catalog.widgets[i % catalog.widgets.length];
    const position=firstOpen(widgets,definition.defaultSize);
    const widget={i:String(i),type:definition.type,...position,...definition.defaultSize};
    assert.ok(fits(widget,widgets)); widgets.push(widget);
  }
});
