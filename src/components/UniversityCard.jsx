import React from "react";
import { Link } from "react-router-dom";

function summarize(uni) {
  const bits = [];
  if (uni.region) bits.push(uni.region);
  if (uni.ownership) bits.push(uni.ownership);
  if (uni.admissionRate != null) {
    bits.push(`${Math.round(uni.admissionRate * 100)}% admit`);
  }
  if (uni.avgCost != null) {
    bits.push(`~$${uni.avgCost.toLocaleString()} avg cost`);
  }
  return bits.join(" • ");
}

function FavButton({ id, isActive, onToggle }) {
  return (
    <button
      type="button"
      aria-label={isActive ? "Remove favorite" : "Save to favorites"}
      className={`fav ${isActive ? "active" : ""}`}
      onClick={() => onToggle(id)}
      title={isActive ? "Remove from favorites" : "Save to favorites"}
    >
      {isActive ? "★" : "☆"}
    </button>
  );
}

export default function UniversityCard({
  uni,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) {
  return (
    <article className="card">
      <div className="card-pad" style={{ display: "grid", gap: 10 }}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.3 }}>
            <Link
              to={`/u/${uni.id}`}
              style={{
                color: "var(--text)",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              {uni.name}
            </Link>
          </h3>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <FavButton
              id={uni.id}
              isActive={isFavorite}
              onToggle={onToggleFavorite}
            />

            <button
              type="button"
              className="btn tertiary"
              onClick={() => onToggleCompare(uni.id)}
              style={{ fontSize: 12, padding: "6px 10px" }}
            >
              {isCompared ? "✓ Added" : "Compare"}
            </button>
          </div>
        </header>

        <div className="meta">
          {uni.city}, {uni.state} · {uni.ownership}
        </div>

        <div className="meta">{summarize(uni)}</div>

        <div className="grid cols-3">
          <div className="kpi">
            <strong>
              {uni.admissionRate != null
                ? `${Math.round(uni.admissionRate * 100)}%`
                : "—"}
            </strong>
            <span>Acceptance</span>
          </div>

          <div className="kpi">
            <strong>
              {uni.avgCost != null ? `$${uni.avgCost.toLocaleString()}` : "—"}
            </strong>
            <span>Avg. Net Cost</span>
          </div>

          <div className="kpi">
            <strong>{uni.satAvg ?? "—"}</strong>
            <span>SAT Avg</span>
          </div>
        </div>

        <div className="tags" style={{ marginTop: 6 }}>
          {uni.medianEarnings != null && (
            <span className="tag">
              Earnings: ${uni.medianEarnings.toLocaleString()}
            </span>
          )}

          {uni.studentSize != null && (
            <span className="tag">
              Students: {uni.studentSize.toLocaleString()}
            </span>
          )}

          {uni.popularMajors && uni.popularMajors.length > 0 && (
            <span className="tag">
              Majors: {uni.popularMajors.slice(0, 2).join(", ")}
              {uni.popularMajors.length > 2 ? " +" : ""}
            </span>
          )}

          {uni.url && (
            <a
              className="tag"
              href={uni.url}
              target="_blank"
              rel="noreferrer"
            >
              Website ↗
            </a>
          )}

          <Link className="tag" to={`/u/${uni.id}`}>
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}