// Development-only fixtures. Vite's production build does not include this HTML entry.
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '../src/styles/global.css';
import { SentinelConsole, SentinelSavedProvider } from '../src/features/sentinel/SentinelPrototype.jsx';
import { initialState, layouts, readSaved, reducer } from '../src/features/sentinel/model.js';
const kind = new URLSearchParams(location.search).get('state') || 'library';
const saved = readSaved({getItem:()=>null});
let state = initialState(saved);
const dispatch = action => { state = reducer(state, action); };
if (!['library','view','close-widget','maintainer','unknown'].includes(kind)) {
  dispatch({type:'NEW',id:'audit'});
  if(kind === 'hover-plot') dispatch({type:'PREVIEW',widgetType:'situation-plot'});
  if(kind === 'hover-log') { dispatch({type:'FILTER',patch:{category:'Logs'}}); dispatch({type:'PREVIEW',widgetType:'event-log'}); }
  if(!['picker','hover-plot','hover-log'].includes(kind)) {
    dispatch({type:'ADD',id:'plot',widgetType:'situation-plot'});
    if(kind === 'move') dispatch({type:'TRANSFORM',id:'plot',patch:{x:3}});
    if(kind === 'resize') dispatch({type:'TRANSFORM',id:'plot',patch:{w:9,h:7}});
    if(kind === 'menu') dispatch({type:'MENU',id:'plot'});
    if(kind === 'save') dispatch({type:'DIALOG',dialog:'save'});
    if(kind === 'discard') dispatch({type:'CANCEL'});
    if(kind === 'exit') dispatch({type:'EXIT'});
    if(kind === 'rename') dispatch({type:'START_RENAME',id:'plot'});
    if(kind === 'undo') dispatch({type:'REMOVE',id:'plot'});
  }
}
if(['view','close-widget'].includes(kind)) {
  dispatch({type:'LOAD',config:{...layouts.saved[0],source:'saved'}});
  if(kind === 'close-widget') dispatch({type:'REMOVE',id:state.config.widgets[0].i});
}
if(['maintainer','unknown'].includes(kind)) { dispatch({type:'SCENARIO',scenario:'maintainer'}); if(kind === 'unknown')dispatch({type:'SUBSYSTEM',id:'SUB-10'}); }
createRoot(document.getElementById('root')).render(<SentinelSavedProvider><main><h1 className="visually-hidden">Sentinel state audit</h1><SentinelConsole scenario={state.scenario} initialConsoleState={state} /></main></SentinelSavedProvider>);
