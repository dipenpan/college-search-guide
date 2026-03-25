import React from "react";
import { STATES, TYPES } from "../utils/filter.js";

export default function Filters({ value, onChange, disabled }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const [q, setQ] = React.useState(value.q);
  React.useEffect(() => setQ(value.q), [value.q]);
  React.useEffect(() => { const t = setTimeout(() => set({ q }), 250); return () => clearTimeout(t); }, [q]);

  return (
    <section className="card card-pad" aria-label="Search filters">
      <div className="toolbar">
        <label>
          Keyword (name, city, state)
          <input className="input" placeholder="e.g., Tennessee State University" value={q}
                 onChange={(e) => setQ(e.target.value)} disabled={disabled}/>
        </label>
        <label>
          State
          <select value={value.state} onChange={(e) => set({ state: e.target.value })} disabled={disabled}>
            <option value="">Any</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Type
          <select value={value.type} onChange={(e) => set({ type: e.target.value })} disabled={disabled}>
            <option value="">Any</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Tuition (min)
          <input type="number" className="input" min={0} value={value.tuitionMin}
                 onChange={(e) => set({ tuitionMin: Number(e.target.value || 0) })} disabled={disabled}/>
        </label>
        <label>
          Tuition (max)
          <input type="number" className="input" min={0} value={value.tuitionMax}
                 onChange={(e) => set({ tuitionMax: Number(e.target.value || 0) })} disabled={disabled}/>
        </label>
      </div>

      <div style={{ display:"flex", gap:12, marginTop:12, alignItems:"center" }}>
        <label style={{ maxWidth:250 }}>
          Acceptance ≥
          <input type="number" className="input" min={0} max={100}
                 value={Math.round(value.acceptanceMin*100)}
                 onChange={(e)=>set({ acceptanceMin: Math.min(1, Math.max(0, Number(e.target.value)/100)) })}
                 disabled={disabled}/>
        </label>
        <label style={{ maxWidth:250 }}>
          Acceptance ≤
          <input type="number" className="input" min={0} max={100}
                 value={Math.round(value.acceptanceMax*100)}
                 onChange={(e)=>set({ acceptanceMax: Math.min(1, Math.max(0, Number(e.target.value)/100)) })}
                 disabled={disabled}/>
        </label>
        <label style={{ maxWidth:220, marginLeft:"auto" }}>
          Sort by
          <select value={value.sort} onChange={(e)=>set({ sort:e.target.value })} disabled={disabled}>
            <option value="name">Name (A→Z)</option>
            <option value="-name">Name (Z→A)</option>
            <option value="-medianEarnings">Earnings (high→low)</option>
            <option value="-satAvg">SAT (high→low)</option>
            <option value="avgCost">Cost (low→high)</option>
            <option value="-avgCost">Cost (high→low)</option>
            <option value="-admissionRate">Acceptance (high→low)</option>
          </select>
        </label>
      </div>
    </section>
  );
}
