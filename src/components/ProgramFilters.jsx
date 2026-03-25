import React from "react";
import { STATES } from "../utils/filter.js";

export default function ProgramFilters({ value, onChange, disabled }) {
  const set = (p) => onChange({ ...value, ...p });
  const [q, setQ] = React.useState(value.q);
  React.useEffect(() => setQ(value.q), [value.q]);
  React.useEffect(() => { const t = setTimeout(()=>set({ q }), 250); return ()=>clearTimeout(t); }, [q]);

  return (
    <section className="card card-pad" aria-label="Program filters">
      <div className="toolbar" style={{ gridTemplateColumns: "1.2fr .6fr .6fr .6fr" }}>
        <label>
          Program / major
          <input className="input" placeholder="e.g., Computer Science" value={q}
                 onChange={(e)=>setQ(e.target.value)} disabled={disabled}/>
        </label>
        <label>
          Degree level
          <select value={value.level} onChange={(e)=>set({ level:e.target.value })} disabled={disabled}>
            <option value="">Any</option>
            <option>Bachelor</option>
            <option>Master</option>
            <option>Doctorate</option>
          </select>
        </label>
        <label>
          State
          <select value={value.state} onChange={(e)=>set({ state:e.target.value })} disabled={disabled}>
            <option value="">Any</option>
            {STATES.map((s)=><option value={s} key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Sort
          <select value={value.sort} onChange={(e)=>set({ sort:e.target.value })} disabled={disabled}>
            <option value="title">Title (A→Z)</option>
            <option value="-title">Title (Z→A)</option>
            <option value="institutionName">Institution (A→Z)</option>
            <option value="-institutionName">Institution (Z→A)</option>
          </select>
        </label>
      </div>
    </section>
  );
}
