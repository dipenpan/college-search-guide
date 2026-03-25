import React from "react";
import { Link } from "react-router-dom";

export default function ProgramCard({ p }) {
  return (
    <article className="card">
      <div className="card-pad" style={{ display:"grid", gap:8 }}>
        <header style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
          <h3 style={{ margin:0, fontSize:18 }}>{p.title}</h3>
          <span className="tag">{p.level}</span>
        </header>
        <div className="meta">{p.institutionName} • {p.state}</div>
        <div className="tags">
          <span className="tag">CIP: {p.cip}</span>
          <Link to={`/u/${p.institutionId}`} className="tag">View university →</Link>
        </div>
      </div>
    </article>
  );
}
