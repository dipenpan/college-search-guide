import React from "react";

export default function Pagination({ page, totalPages, onPage }) {
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));
  return (
    <div className="pager" role="navigation" aria-label="Pagination">
      <button onClick={() => onPage(1)} disabled={page === 1} aria-label="First page">« First</button>
      <button onClick={prev} disabled={page === 1} aria-label="Previous page">‹ Prev</button>
      <span aria-live="polite">Page {page} of {totalPages}</span>
      <button onClick={next} disabled={page === totalPages} aria-label="Next page">Next ›</button>
      <button onClick={() => onPage(totalPages)} disabled={page === totalPages} aria-label="Last page">Last »</button>
    </div>
  );
}
