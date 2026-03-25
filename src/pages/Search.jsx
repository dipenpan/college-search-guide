import React from "react";
import { fetchUniversities } from "../api/collegeScorecard.js";
import Filters from "../components/Filters.jsx";
import UniversityCard from "../components/UniversityCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { filterRows, sortRows, paginate } from "../utils/filter.js";

const KEYS = {
  favorites: "cg:favorites",
  lastFilters: "cg:lastFilters:v2",
};

const readJSON = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

const writeJSON = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const DEFAULT_FILTERS = {
  q: "",
  state: "",
  type: "",
  tuitionMin: 0,
  tuitionMax: 60000,
  acceptanceMin: 0,
  acceptanceMax: 1,
  sort: "name",
};

export default function Search() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [source, setSource] = React.useState("sample");
  const [filters, setFilters] = React.useState(() =>
    readJSON(KEYS.lastFilters, DEFAULT_FILTERS)
  );
  const [page, setPage] = React.useState(1);
  const [favorites, setFavorites] = React.useState(() =>
    readJSON(KEYS.favorites, [])
  );
  const [compare, setCompare] = React.useState([]);

  React.useEffect(() => {
    setFilters((f) => {
      const normalized = { ...DEFAULT_FILTERS, ...f };

      if (normalized.tuitionMax <= 0) {
        normalized.tuitionMax = DEFAULT_FILTERS.tuitionMax;
      }
      if (normalized.acceptanceMax <= 0) {
        normalized.acceptanceMax = DEFAULT_FILTERS.acceptanceMax;
      }
      if (normalized.acceptanceMin < 0) {
        normalized.acceptanceMin = 0;
      }
      if (normalized.acceptanceMax > 1) {
        normalized.acceptanceMax = 1;
      }

      return normalized;
    });
  }, []);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    fetchUniversities()
      .then(({ results, source }) => {
        if (!mounted) return;
        setRows(results);
        setSource(source || "sample");
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "Failed to load");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    writeJSON(KEYS.lastFilters, filters);
  }, [filters]);

  React.useEffect(() => {
    writeJSON(KEYS.favorites, favorites);
  }, [favorites]);

  React.useEffect(() => {
    setPage(1);
  }, [filters]);

  const onToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id) => {
    setCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const onResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filtered = React.useMemo(() => {
    return sortRows(filterRows(rows, filters), filters.sort);
  }, [rows, filters]);

  const { page: pg, totalPages, slice } = React.useMemo(() => {
    return paginate(filtered, page, 9);
  }, [filtered, page]);

  const stats = React.useMemo(() => {
    if (!filtered.length) return null;

    const mean = (key) => {
      const defined = filtered.filter((u) => u[key] != null);
      if (!defined.length) return null;
      return defined.reduce((acc, u) => acc + u[key], 0) / defined.length;
    };

    return {
      avgCost: mean("avgCost"),
      satAvg: mean("satAvg"),
      acceptance: mean("admissionRate"),
      earnings: mean("medianEarnings"),
    };
  }, [filtered]);

  const comparedRows = React.useMemo(() => {
    return compare
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean);
  }, [compare, rows]);

  const compareBenchmarks = React.useMemo(() => {
    if (comparedRows.length < 2) return null;

    return {
      minAcceptance: Math.min(
        ...comparedRows.map((u) => u.admissionRate ?? Infinity)
      ),
      minCost: Math.min(...comparedRows.map((u) => u.avgCost ?? Infinity)),
      maxSat: Math.max(...comparedRows.map((u) => u.satAvg ?? 0)),
      maxEarnings: Math.max(
        ...comparedRows.map((u) => u.medianEarnings ?? 0)
      ),
    };
  }, [comparedRows]);

  const exportPDF = React.useCallback(() => {
    if (!filtered.length) return;

    const rowsHtml = filtered
      .map(
        (u) => `
      <tr>
        <td>${u.name}</td>
        <td>${u.city}, ${u.state}</td>
        <td>${u.ownership}</td>
        <td>${
          u.admissionRate != null
            ? Math.round(u.admissionRate * 100) + "%"
            : "—"
        }</td>
        <td>${u.avgCost != null ? "$" + u.avgCost.toLocaleString() : "—"}</td>
        <td>${u.satAvg ?? "—"}</td>
        <td>${
          u.medianEarnings != null
            ? "$" + u.medianEarnings.toLocaleString()
            : "—"
        }</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>College list export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; color: #0b1b2c; }
            h1 { margin-top: 0; font-size: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #c8ddf3; padding: 6px; text-align: left; }
            th { background: #e6f4ff; }
          </style>
        </head>
        <body>
          <h1>College list (${filtered.length})</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Type</th>
                <th>Acceptance</th>
                <th>Avg Net Cost</th>
                <th>SAT Avg</th>
                <th>Median Earnings</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }, [filtered]);

  return (
    <div className="grid" style={{ gap: 14 }}>
      <Filters value={filters} onChange={setFilters} disabled={loading} />

      <div className="bar">
        <div className="tags" aria-live="polite">
          <span className="pill">
            {source === "live"
              ? "Live College Scorecard data"
              : "Curated sample data (offline-friendly)"}
          </span>
          <span className="pill">{rows.length} universities loaded</span>
          {favorites.length > 0 && (
            <span className="pill">{favorites.length} favorite(s)</span>
          )}
          {compare.length > 0 && (
            <span className="pill">{compare.length}/3 in compare</span>
          )}
        </div>

        <div className="bar-actions">
          <button
            className="btn secondary"
            onClick={onResetFilters}
            disabled={loading}
            type="button"
          >
            Reset filters
          </button>

          <button
            className="btn tertiary"
            onClick={exportPDF}
            disabled={!filtered.length || loading}
            type="button"
          >
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="notice" role="alert">
          {error}
        </div>
      )}

      {comparedRows.length >= 2 && compareBenchmarks && (
        <div className="card card-pad">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0 }}>Compare Universities</h3>

            <button
              className="btn secondary"
              onClick={() => setCompare([])}
              type="button"
            >
              Clear
            </button>
          </div>

          <div className="grid cols-3" style={{ marginTop: 12 }}>
            {comparedRows.map((u) => (
              <div key={u.id} className="card card-pad">
                <strong style={{ fontSize: 16 }}>{u.name}</strong>
                <div className="meta" style={{ marginBottom: 8 }}>
                  {u.city}, {u.state}
                </div>

                <div className="kpi" style={{ marginTop: 8 }}>
                  <strong
                    style={{
                      color:
                        u.admissionRate != null &&
                        u.admissionRate === compareBenchmarks.minAcceptance
                          ? "green"
                          : "inherit",
                    }}
                  >
                    {u.admissionRate != null
                      ? `${Math.round(u.admissionRate * 100)}%`
                      : "—"}
                  </strong>
                  <span>Acceptance</span>
                </div>

                <div className="kpi">
                  <strong
                    style={{
                      color:
                        u.avgCost != null &&
                        u.avgCost === compareBenchmarks.minCost
                          ? "green"
                          : "inherit",
                    }}
                  >
                    {u.avgCost != null ? `$${u.avgCost.toLocaleString()}` : "—"}
                  </strong>
                  <span>Cost</span>
                </div>

                <div className="kpi">
                  <strong
                    style={{
                      color:
                        u.satAvg != null && u.satAvg === compareBenchmarks.maxSat
                          ? "green"
                          : "inherit",
                    }}
                  >
                    {u.satAvg ?? "—"}
                  </strong>
                  <span>SAT</span>
                </div>

                <div className="kpi">
                  <strong
                    style={{
                      color:
                        u.medianEarnings != null &&
                        u.medianEarnings === compareBenchmarks.maxEarnings
                          ? "green"
                          : "inherit",
                    }}
                  >
                    {u.medianEarnings != null
                      ? `$${u.medianEarnings.toLocaleString()}`
                      : "—"}
                  </strong>
                  <span>Earnings</span>
                </div>

                <button
                  className="btn tertiary"
                  onClick={() => toggleCompare(u.id)}
                  style={{ marginTop: 10 }}
                  type="button"
                >
                  ✖ Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <section aria-live="polite" className="meta">
        Showing <strong>{filtered.length}</strong> result(s)
        {filters.q && <> for “{filters.q}”</>}
      </section>

      {stats && (
        <section className="grid cols-3">
          <div className="card card-pad">
            <div className="meta">Avg. net price</div>
            <div className="kpi">
              <strong>
                {stats.avgCost != null
                  ? `$${Math.round(stats.avgCost).toLocaleString()}`
                  : "—"}
              </strong>
              <span>Across current results</span>
            </div>
          </div>

          <div className="card card-pad">
            <div className="meta">Avg. acceptance</div>
            <div className="kpi">
              <strong>
                {stats.acceptance != null
                  ? `${Math.round(stats.acceptance * 100)}%`
                  : "—"}
              </strong>
              <span>Across current results</span>
            </div>
          </div>

          <div className="card card-pad">
            <div className="meta">Avg. earnings (10 yrs)</div>
            <div className="kpi">
              <strong>
                {stats.earnings != null
                  ? `$${Math.round(stats.earnings).toLocaleString()}`
                  : "—"}
              </strong>
              <span>Median across results</span>
            </div>
          </div>
        </section>
      )}

      <section className="grid cols-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="card card-pad"
                style={{ opacity: 0.5, minHeight: 140 }}
              >
                Loading…
              </div>
            ))
          : slice.map((u) => (
              <UniversityCard
                key={u.id}
                uni={u}
                isFavorite={favorites.includes(u.id)}
                onToggleFavorite={onToggleFavorite}
                isCompared={compare.includes(u.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
      </section>

      {!loading && filtered.length > 0 && (
        <Pagination page={pg} totalPages={totalPages} onPage={setPage} />
      )}

      {!loading && filtered.length === 0 && (
        <div className="notice">
          No results. Try broadening your filters.
          <div style={{ marginTop: 10 }}>
            <button
              className="btn secondary"
              type="button"
              onClick={onResetFilters}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <section>
          <h3>Favorites</h3>
          <div className="tags">
            {favorites.map((id) => {
              const uni = rows.find((r) => r.id === id);
              return uni ? (
                <span key={id} className="tag">
                  {uni.name}
                </span>
              ) : null;
            })}
          </div>
        </section>
      )}
    </div>
  );
}