import { Button, Icon, Panel, StatusChip } from './Controls.jsx';
import { diagnostics } from './model.js';

function Trend({ trend }) {
  if (!trend) return <Panel title="Trend · 6h"><div className="sn-no-data body-m">No data</div></Panel>;
  const values = [...trend.points, trend.threshold];
  const min = Math.floor(Math.min(...values) / 10) * 10 - 10;
  const max = Math.ceil(Math.max(...values) / 10) * 10;
  const y = value => 164 - ((value - min) / (max - min)) * 144;
  const points = trend.points.map((value, index) => `${48 + index / (trend.points.length - 1) * 936},${y(value)}`).join(' ');
  const last = trend.points.at(-1);
  const direction = last < trend.points[0] ? 'declining' : last > trend.points[0] ? 'rising' : 'steady';
  const relation = last < trend.threshold ? 'below' : last > trend.threshold ? 'above' : 'at';
  return <Panel title={trend.label}><div className="sn-trend"><svg viewBox="0 0 1000 200" role="img" aria-label={`${trend.label}: ${direction}, ending at ${last} ${trend.unit}, ${relation} the threshold of ${trend.threshold} ${trend.unit}.`}>
    {[0, 1, 2, 3].map(index => { const value = max - index * (max - min) / 3; return <g key={index}><line className="sn-chart-grid" x1="48" x2="984" y1={y(value)} y2={y(value)} /><text className="data-s sn-tertiary" x="36" y={y(value) + 4} textAnchor="end">{Number(value.toFixed(1))}</text></g>; })}
    <line className="sn-chart-threshold" x1="48" x2="984" y1={y(trend.threshold)} y2={y(trend.threshold)} /><text className="data-s sn-status--caution" textAnchor="end" x="984" y={y(trend.threshold) - 8}>THRESHOLD {trend.threshold}</text>
    <polyline className="sn-chart-line" points={points} />
    {trend.xLabels.map((label, index) => <text className="data-s sn-tertiary" key={label} x={48 + index / (trend.xLabels.length - 1) * 936} y="192" textAnchor={index === 0 ? 'start' : index === trend.xLabels.length - 1 ? 'end' : 'middle'}>{label}</text>)}
  </svg></div></Panel>;
}
export default function Diagnostics({ state, dispatch, onLibrary }) {
  const selected = diagnostics.subsystems.find(subsystem => subsystem.id === state.maintainer.selectedId);
  const faults = [...(state.maintainer.logs[selected.id] || []), ...selected.faults];
  return <>
    <div className="sn-diagnostics-bar"><a href="#/work/sentinel" onClick={event => { event.preventDefault(); onLibrary?.(); dispatch({ type: 'LIBRARY' }); }}>Dashboard</a><Icon name="chevron" /><h2 className="heading-m">Diagnostics</h2><span className="sn-spacer" /><span className="data-s sn-tertiary">Refreshed {state.maintainer.refreshedAt}</span><Button disabled={!!state.maintainer.runningId} onClick={() => dispatch({ type: 'TEST_START', id: selected.id })}>{state.maintainer.runningId ? 'Running…' : 'Run self-test'}</Button></div>
    <div className="sn-diagnostics"><Panel className="sn-subsystems" title="Subsystems" count={diagnostics.subsystems.length}><div className="sn-subsystem-list">{diagnostics.subsystems.map(subsystem => <button key={subsystem.id} type="button" aria-current={selected.id === subsystem.id ? 'true' : undefined} onClick={() => dispatch({ type: 'SUBSYSTEM', id: subsystem.id })}>
      <span className={`sn-status-dot sn-status--${subsystem.status}`} aria-hidden="true" /><span className="label-m">{subsystem.name}</span><StatusChip status={subsystem.status} />
    </button>)}</div></Panel>
    <div className="sn-diagnostic-detail"><div className="sn-detail-heading"><h3 className="heading-l">{selected.name}</h3><StatusChip status={selected.status} /><span className="data-s sn-tertiary">{selected.id}</span></div>
      <div className="sn-kpis">{selected.kpis.map(kpi => <div className="sn-kpi sn-panel" key={kpi.label}><span className="label-s sn-tertiary">{kpi.label}</span><span className="sn-kpi-value"><span className={`data-xl${kpi.status ? ` sn-status--${kpi.status}` : ''}`}>{kpi.value}</span><span className="data-s sn-tertiary">{kpi.unit}</span></span><span className="data-s sn-tertiary">{kpi.note}</span></div>)}</div>
      <Trend trend={selected.trend} />
      <div className="sn-diagnostic-lower"><Panel title="Components" count={selected.components.length}><div className="sn-table-scroll" tabIndex={0} role="region" aria-label={`${selected.name} component readings`}><table className="sn-table"><caption className="visually-hidden">{selected.name} components</caption><thead><tr>{['Component', 'Status', 'Reading', 'Last check'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{selected.components.map(component => <tr key={component.name}><th scope="row">{component.name}</th><td><StatusChip status={component.status} /></td><td className={`data-s${component.status === 'caution' ? ' sn-status--caution' : ''}`}>{component.reading}</td><td className="data-s sn-tertiary">{component.lastCheck}</td></tr>)}</tbody></table></div></Panel>
      <Panel title="Fault log" count={faults.length}><ol className="sn-fault-log">{faults.map((fault, index) => <li key={`${fault.time}-${index}`}><span className={`sn-status-dot sn-status--${fault.severity}`} aria-hidden="true" /><span className="data-s sn-tertiary">{fault.time}</span><span className="body-s"><span className="visually-hidden">{fault.severity}: </span>{fault.message}</span></li>)}</ol></Panel></div>
    </div></div>
  </>;
}
