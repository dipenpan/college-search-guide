import React from "react";
import { Link } from "react-router-dom";

const steps = [
  { title: "Search smart", body: "Filter by state, cost, admission rate, SAT, and outcomes in seconds." },
  { title: "Compare clearly", body: "View acceptance, net price, student size, and median earnings side-by-side." },
  { title: "Decide confidently", body: "Save favorites locally, export PDFs, and click through to official websites." },
];

const stats = [
  { value: "13", label: "Full-ride wins", sub: "Nepali students guided with structured shortlists" },
  { value: "30+", label: "Universities", sub: "Curated profiles ready to filter, compare, and export" },
  { value: "30+", label: "Programs", sub: "Search by degree level, state, and school" }
];

const playbook = [
  "Start with Universities to filter by acceptance, cost, SAT, earnings, and see popular majors.",
  "Hop to Programs to find majors, then jump into the matching university profile.",
  "Export PDFs for counseling sessions and keep Favorites saved locally for quick revisit.",
  "Use Guides & Resources for visas, funding, essays, and testing checklists tailored to Nepali students."
];

const nepaliFocus = [
  {
    title: "Community hubs to feel at home",
    schools: "Northeast Urban University (NY), Capital City University (DC), Bay Area College (CA)",
    note: "Dense South Asian communities, Nepali student groups, and direct/1-stop routes from KTM."
  },
  {
    title: "Affordable public options with STEM",
    schools: "State University A (TX), Sunrise Polytechnic (NC), Mountain View University (CO)",
    note: "Balanced acceptance + aid potential with strong CS/Engineering pipelines."
  },
  {
    title: "Scholarship-friendly liberal arts picks",
    schools: "Capital Midwest College (WI), Maple Leaf College (VT), Prairie State College (KS)",
    note: "Smaller campuses, higher merit odds, easier housing transition with close-knit communities."
  }
];

export default function Home() {
  return (
    <div className="hero">
      <section className="grid cols-2">
        <div className="card card-pad" style={{ display:"grid", gap:14 }}>
          <div>
            <p className="pill" style={{ width:"fit-content" }}>Built for Nepali undergraduates heading to the U.S.</p>
            <h1>Find the right college fast and confidently.</h1>
            <p>A professional-grade explorer to shortlist universities, compare outcomes, and stay organized. Tuned for Nepali students seeking strong academics, community, and affordable paths.</p>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link to="/search" className="btn">Search Universities</Link>
            <Link to="/programs" className="btn secondary">Explore Programs</Link>
            <Link to="/resources" className="nav-link" style={{ padding:10 }}>Guides & Resources →</Link>
          </div>
          <div className="tags">
            <span className="pill">30+ curated universities</span>
            <span className="pill">PDF export ready</span>
            <span className="pill">Nepali-friendly community picks</span>
          </div>
        </div>
        <div className="card card-pad">
          <div className="grid" style={{ gap:16 }}>
            {steps.map((s) => (
              <article key={s.title} className="notice">
                <strong>{s.title}</strong>
                <p style={{ margin:6, color:"var(--muted)" }}>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid cols-3" style={{ marginTop:14 }}>
        {stats.map((s) => (
          <article key={s.label} className="card card-pad stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <p className="meta" style={{ margin:0 }}>{s.sub}</p>
          </article>
        ))}
      </section>

      <section className="card card-pad" style={{ marginTop:16, display:"grid", gap:12 }}>
        <header style={{ display:"flex", alignItems:"baseline", gap:10, justifyContent:"space-between", flexWrap:"wrap" }}>
          <div>
            <h2 style={{ margin:0 }}>International student playbook</h2>
            <p className="meta" style={{ margin:0 }}>Built for clarity: shortlist, compare, export, and act.</p>
          </div>
          <Link to="/resources" className="btn tertiary">Open guides</Link>
        </header>
        <ul className="checklist">
          {playbook.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </div>
  );
}
