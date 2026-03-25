// Toggle live API vs local samples. Why: works offline, easy to swap.
import uniSample from "../data/universities.sample.json";
import programSample from "../data/programs.sample.json";

const mapUni = (d, i) => ({
  id: d.id ?? String(i + 1),
  name: d.name,
  city: d.city,
  state: d.state,
  region: d.region ?? "",
  ownership: d.ownership ?? "Public",
  url: d.url ?? "",
  admissionRate: d.admissionRate ?? null,
  satAvg: d.satAvg ?? null,
  avgCost: d.avgCost ?? null,
  medianEarnings: d.medianEarnings ?? null,
  studentSize: d.studentSize ?? null,
  latitude: d.latitude ?? null,
  longitude: d.longitude ?? null,
  popularMajors: d.popularMajors ?? [],
  summary: d.summary ?? "",
});

const mapProgram = (d, i) => ({
  id: d.id ?? `p-${i + 1}`,
  cip: d.cip,
  title: d.title,
  level: d.level, // e.g., Bachelor, Master
  institutionId: d.institutionId,
  institutionName: d.institutionName,
  state: d.state,
});

export async function fetchUniversities() {
  const useLive = Boolean(import.meta.env.VITE_SCORECARD_KEY && import.meta.env.VITE_USE_LIVE === "true");
  if (!useLive) return { results: uniSample.map(mapUni), total: uniSample.length, source: "sample" };

  const key = import.meta.env.VITE_SCORECARD_KEY || "";
  if (!key) throw new Error("Missing VITE_SCORECARD_KEY");
  const base = "https://api.data.gov/ed/collegescorecard/v1/schools";
  const params = new URLSearchParams({
    api_key: key,
    per_page: "100",
    fields:
      "id,school.name,school.city,school.state,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.cost.avg_net_price.public,latest.cost.avg_net_price.private,latest.earnings.10_yrs_after_entry.median,latest.student.size,school.school_url,location.lat,location.lon,school.ownership",
  });
  const res = await fetch(`${base}?${params.toString()}`);
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  const results = json.results.map((r) =>
    mapUni({
      id: r.id,
      name: r["school.name"],
      city: r["school.city"],
      state: r["school.state"],
      admissionRate: r["latest.admissions.admission_rate.overall"],
      satAvg: r["latest.admissions.sat_scores.average.overall"],
      avgCost:
        r["latest.cost.avg_net_price.public"] ??
        r["latest.cost.avg_net_price.private"],
      medianEarnings: r["latest.earnings.10_yrs_after_entry.median"],
      studentSize: r["latest.student.size"],
      url: r["school.school_url"],
      latitude: r["location.lat"],
      longitude: r["location.lon"],
      ownership:
        r["school.ownership"] === 1
          ? "Public"
          : r["school.ownership"] === 2
          ? "Private nonprofit"
          : "Private for-profit",
    })
  );
  return { results, total: json.metadata?.total ?? results.length, source: "live" };
}

export async function fetchPrograms() {
  const useLive = false; // roll your own to call /fields=... for programs
  if (!useLive) return { results: programSample.map(mapProgram), source: "sample" };
  // Placeholder: implement live query if you have a programs endpoint.
  return { results: [], source: "live" };
}
