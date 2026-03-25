import React from "react";
import { fetchPrograms } from "../api/collegeScorecard.js";
import ProgramFilters from "../components/ProgramFilters.jsx";
import ProgramCard from "../components/ProgramCard.jsx";

const DEFAULT = { q: "", level: "", state: "", sort: "title" };

function filterPrograms(rows, f) {
  const q = f.q.trim().toLowerCase();
  return rows
    .filter((p) =>
      (!q || p.title.toLowerCase().includes(q)) &&
      (!f.level || p.level === f.level) &&
      (!f.state || p.state === f.state)
    )
    .sort((a, b) => {
      const dir = f.sort.startsWith("-") ? -1 : 1;
      const key = f.sort.replace(/^-/, "");
      return dir * String(a[key]).localeCompare(String(b[key]));
    });
}

export default function Programs() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [source, setSource] = React.useState("sample");
  const [filters, setFilters] = React.useState(DEFAULT);

  React.useEffect(() => {
    let alive = true;
    fetchPrograms()
      .then(({ results, source }) => {
        if (!alive) return;
        setRows(results);
        setSource(source || "sample");
      })
      .finally(() => setLoading(false));
    return () => (alive = false);
  }, []);

  const onReset = () => setFilters(DEFAULT);
  const exportPDF = React.useCallback(() => {
    if (!rows.length) return;
    const data = filterPrograms(rows, filters);
    const rowsHtml = data.map((p) => `
      <tr>
        <td>${p.title}</td>
        <td>${p.level}</td>
        <td>${p.institutionName}</td>
        <td>${p.state}</td>
        <td>${p.cip}</td>
      </tr>
    `).join("");
    const html = `
      <html><head><title>Programs export</title>
      <style>
        body{font-family:Arial,sans-serif;padding:16px;color:#0b1b2c;}
        h1{margin-top:0;font-size:20px;}
        table{width:100%;border-collapse:collapse;font-size:12px;}
        th,td{border:1px solid #c8ddf3;padding:6px;text-align:left;}
        th{background:#e6f4ff;}
      </style></head>
      <body>
        <h1>Programs list (${data.length})</h1>
        <table>
          <thead><tr><th>Program</th><th>Level</th><th>Institution</th><th>State</th><th>CIP</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }, [rows, filters]);

  const filtered = filterPrograms(rows, filters);
  const levelCounts = React.useMemo(() => filtered.reduce((acc, p) => {
    acc[p.level] = (acc[p.level] || 0) + 1;
    return acc;
  }, {}), [filtered]);

  return (
    <div className="grid" style={{ gap:14 }}>
      <ProgramFilters value={filters} onChange={setFilters} disabled={loading} />
      <div className="bar">
        <div className="tags">
          <span className="pill">{source === "live" ? "Live data" : "Curated sample data"}</span>
          <span className="pill">{filtered.length} program(s) match</span>
        </div>
        <div className="bar-actions">
          <button className="btn secondary" onClick={onReset} disabled={loading}>Reset filters</button>
          <button className="btn tertiary" onClick={exportPDF} disabled={!filtered.length || loading}>Export PDF</button>
        </div>
      </div>
      <section aria-live="polite" className="meta">Showing <strong>{filtered.length}</strong> program(s)</section>
      {filtered.length > 0 && (
        <div className="tags">
          {Object.entries(levelCounts).map(([lvl, count]) => (
            <span className="pill" key={lvl}>{lvl}: {count}</span>
          ))}
        </div>
      )}
      <section className="grid cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="card card-pad" style={{ opacity:.5, minHeight:120 }}>Loading…</div>)
          : filtered.map((p) => <ProgramCard key={p.id} p={p} />)}
      </section>
    </div>
  );
}
