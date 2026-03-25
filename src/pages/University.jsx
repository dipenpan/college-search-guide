import React from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUniversities } from "../api/collegeScorecard.js";

export default function University() {
  const { id } = useParams();
  const [u, setU] = React.useState(null);
  const [err, setErr] = React.useState("");
  const summarize = (uni) => {
    const bits = [];
    if (uni.region) bits.push(`${uni.region} region`);
    if (uni.ownership) bits.push(uni.ownership);
    if (uni.admissionRate != null) bits.push(`${Math.round(uni.admissionRate * 100)}% admit`);
    if (uni.avgCost != null) bits.push(`~$${uni.avgCost.toLocaleString()} avg net price`);
    if (uni.medianEarnings != null) bits.push(`$${uni.medianEarnings.toLocaleString()} 10yr earnings`);
    return bits.join(" • ");
  };

  React.useEffect(() => {
    let alive = true;
    fetchUniversities()
      .then(({ results }) => {
        if (!alive) return;
        const uni = results.find((x) => String(x.id) === String(id));
        if (!uni) setErr("University not found.");
        setU(uni || null);
      })
      .catch((e) => setErr(e.message || "Failed"));
    return () => (alive = false);
  }, [id]);

  if (err) return <div className="notice" role="alert">{err} <div><Link className="nav-link" to="/search">Back to search</Link></div></div>;
  if (!u) return <div className="card card-pad">Loading…</div>;

  const mapUrl = u.latitude && u.longitude ? `https://www.google.com/maps/search/?api=1&query=${u.latitude},${u.longitude}` : null;

  return (
    <article className="grid" style={{ gap:14 }}>
      <div className="card card-pad">
        <header style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12 }}>
          <div>
            <h1 style={{ margin:0 }}>{u.name}</h1>
            <div className="meta">{u.city}, {u.state} · {u.ownership}</div>
            <p className="meta" style={{ margin:0 }}>{summarize(u)}</p>
            {u.summary && <p style={{ margin:"8px 0 0 0", color:"var(--muted)" }}>{u.summary}</p>}
          </div>
          <div className="tags">
            {mapUrl && <a className="tag" href={mapUrl} target="_blank" rel="noreferrer">Open Map ↗</a>}
            {u.url && <a className="tag" href={u.url} target="_blank" rel="noreferrer">Website ↗</a>}
            <Link to="/search" className="tag">Back</Link>
          </div>
        </header>
      </div>

      <section className="grid cols-3">
        <div className="card card-pad">
          <h3 style={{ marginTop:0 }}>Admissions</h3>
          <p>Acceptance: <strong>{u.admissionRate != null ? `${Math.round(u.admissionRate*100)}%` : "—"}</strong></p>
          <p>SAT Average: <strong>{u.satAvg ?? "—"}</strong></p>
          <p>Student Size: <strong>{u.studentSize?.toLocaleString?.() ?? "—"}</strong></p>
        </div>
        <div className="card card-pad">
          <h3 style={{ marginTop:0 }}>Costs</h3>
          <p>Average Net Price: <strong>{u.avgCost != null ? `$${u.avgCost.toLocaleString()}` : "—"}</strong></p>
        </div>
        <div className="card card-pad">
          <h3 style={{ marginTop:0 }}>Outcomes</h3>
          <p>Median Earnings (10 yrs): <strong>{u.medianEarnings != null ? `$${u.medianEarnings.toLocaleString()}` : "—"}</strong></p>
        </div>
      </section>

      {u.popularMajors && u.popularMajors.length > 0 && (
        <section className="card card-pad">
          <h3 style={{ marginTop:0 }}>Popular majors</h3>
          <div className="tags">
            {u.popularMajors.map((m) => <span key={m} className="tag">{m}</span>)}
          </div>
        </section>
      )}
    </article>
  );
}
