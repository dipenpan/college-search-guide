export function filterRows(rows, f) {
  const q = (f.q || "").trim().toLowerCase();
  const tuitionMin = f.tuitionMin ?? 0;
  const tuitionMax = f.tuitionMax ?? Infinity;
  const acceptanceMin = f.acceptanceMin ?? 0;
  const acceptanceMax = f.acceptanceMax ?? 1;

  return rows.filter((r) => {
    const matchesQ =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.city?.toLowerCase().includes(q) ||
      r.state?.toLowerCase().includes(q);

    const matchesState = !f.state || r.state === f.state;
    const matchesType = !f.type || r.ownership === f.type;

    const matchesTuition =
      r.avgCost == null || (r.avgCost >= tuitionMin && r.avgCost <= tuitionMax);

    const matchesAcceptance =
      r.admissionRate == null ||
      (r.admissionRate >= acceptanceMin && r.admissionRate <= acceptanceMax);

    return (
      matchesQ &&
      matchesState &&
      matchesType &&
      matchesTuition &&
      matchesAcceptance
    );
  });
}

export function sortRows(rows, sortKey) {
  const copy = [...rows];
  const dir = sortKey.startsWith("-") ? -1 : 1;
  const key = sortKey.replace(/^-/, "");
  const safe = (v) => (v == null ? Infinity : v);

  copy.sort((a, b) => {
    if (key === "name") return dir * a.name.localeCompare(b.name);
    return dir * (safe(a[key]) - safe(b[key]));
  });

  return copy;
}

export function paginate(rows, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;

  return {
    page: current,
    totalPages,
    slice: rows.slice(start, start + pageSize),
  };
}

export const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN",
  "KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ",
  "NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA",
  "WI","WV","WY"
];

export const TYPES = ["Public", "Private nonprofit", "Private for-profit"];