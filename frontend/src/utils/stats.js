// stats.js
// -------------------------------------------------
// Y-akselin maksimin laskeminen
// -------------------------------------------------

export function calculateGlobalYMax(data, selectedMetric) {
  const vals = data
    .map((r) =>
      selectedMetric === "Keskihinta" ? r.Keskihinta : r.Kauppojen_lkm
    )
    .filter((v) => v && v > 0);

  return vals.length ? Math.max(...vals) * 1.1 : 1;
}
