import React from "react";

const LINKS = [
  { title: "U.S. Student Visa (F-1) overview", url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html", tag: "Visa" },
  { title: "SEVIS I-901 payment & status", url: "https://fmjfee.com", tag: "Visa" },
  { title: "FAFSA (Aid for eligible students)", url: "https://studentaid.gov/h/apply-for-aid/fafsa", tag: "Financial Aid" },
  { title: "Net price calculator finder", url: "https://collegecost.ed.gov/net-price", tag: "Budgeting" },
  { title: "Full-ride scholarship search", url: "https://www.scholarships.com", tag: "Scholarships" },
  { title: "Common App essay prompts", url: "https://www.commonapp.org/apply/essay-prompts", tag: "Essays" },
  { title: "Statement of purpose tips (CMU GCC)", url: "https://www.cmu.edu/gcc/", tag: "Essays" },
  { title: "IELTS / TOEFL prep roadmap", url: "https://takeielts.britishcouncil.org/take-ielts/prepare", tag: "Testing" },
  { title: "Campus safety & Clery reports", url: "https://ope.ed.gov/campussafety/#/", tag: "Campus Life" },
  { title: "Find on-campus employment (CareerOneStop)", url: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx", tag: "Jobs" }
];

export default function Resources() {
  return (
    <div className="grid" style={{ gap:14 }}>
      <div className="notice">
        <h2 style={{ marginTop:0 }}>Graduate & international friendly resources</h2>
        <p className="meta">Bookmark the essentials for visas, funding, essays, testing, and campus life. All links open in a new tab.</p>
      </div>
      <section className="grid cols-3">
        {LINKS.map((l) => (
          <article key={l.title} className="card card-pad">
            <header style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <h3 style={{ margin:0 }}>{l.title}</h3>
              <span className="tag">{l.tag}</span>
            </header>
            <p className="meta">Curated external resource</p>
            <div className="tags">
              <a className="tag" href={l.url} target="_blank" rel="noreferrer">Open ↗</a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
