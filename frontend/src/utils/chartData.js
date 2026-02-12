// src/utils/chartData.js
// -------------------------------------------------
// VIIVAKAAVIO (buildChartData) — säilytetään ennallaan
// -------------------------------------------------

export function buildChartData({
  data,
  selectedArea,
  talotyyppi,
  selectedMetric,
  year,
  years,
  isMobile = false,
}) {
  const yearsSorted = years.map((y) => Number(y)).sort((a, b) => a - b);

  const areaSeries = data
    .filter(
      (r) =>
        String(r.PostinumeroAlue) === String(selectedArea) &&
        String(r.Talotyyppi) === String(talotyyppi)
    )
    .sort((a, b) => Number(a.Vuosi) - Number(b.Vuosi));

  const avgSeries = yearsSorted.map((y) => {
    const subset = data.filter(
      (r) =>
        String(r.Vuosi) === String(y) &&
        String(r.Talotyyppi) === String(talotyyppi)
    );
    const vals = subset
      .map((r) =>
        selectedMetric === "Keskihinta" ? r.Keskihinta : r.Kauppojen_lkm
      )
      .filter((v) => v && v > 0);

    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });

  const unit =
    selectedMetric === "Keskihinta"
      ? "€/m²"
      : selectedMetric === "Kauppojen_lkm"
      ? "kpl"
      : "";

  const plotData = [
    {
      x: yearsSorted,
      y: avgSeries,
      mode: "lines",
      name: "Koko kaupunki",
      line: { color: "gray", dash: "dot" },
      hovertemplate: isMobile
        ? null
        : `%{y:,.0f} ${unit}<extra>Koko kaupunki</extra>`,
    },
  ];

  if (areaSeries.length > 0) {
    const areaY = areaSeries.map((r) =>
      selectedMetric === "Keskihinta" ? r.Keskihinta : r.Kauppojen_lkm
    );

    plotData.unshift({
      x: areaSeries.map((r) => r.Vuosi),
      y: areaY,
      mode: "lines+markers",
      name: areaSeries[0]?.Nimi || selectedArea,
      line: { color: "black" },
      hovertemplate: isMobile
        ? null
        : `%{y:,.0f} ${unit}<extra>${
            areaSeries[0]?.Nimi || selectedArea
          }</extra>`,
    });

    const current = areaSeries.find(
      (r) => String(r.Vuosi) === String(year)
    );
    if (current) {
      plotData.push({
        x: [Number(year)],
        y: [
          selectedMetric === "Keskihinta"
            ? current.Keskihinta
            : current.Kauppojen_lkm,
        ],
        mode: "markers",
        marker: { size: 10, color: "red" },
        name: "Valittu vuosi",
        hoverinfo: "skip",
      });
    }
  }

  return { plotData, yearsSorted, avgSeries, areaSeries };
}




// -------------------------------------------------
// KARTTA – makeMapData (täysin uusi, EI koske viivakaaviota)
// -------------------------------------------------

import {
  COLOR_MISSING,
  COLOR_LOW,
  COLOR_MID,
  COLOR_HIGH,
} from "./colors";

import { classifyByTertiiles } from "./classification";

/**
 * Luo Plotlyn tarvitsemat karttadatat (mapData)
 *
 * @param {Array} areaSeries – [{ id, name, value }]
 * @param {Object} geojson
 * @param {Object} legendRanges – { t33, t66 }
 */
export function makeMapData(areaSeries, geojson, legendRanges) {
  if (!areaSeries || !geojson || !legendRanges) return [];

  const { t33, t66 } = legendRanges;

  // 1) Luokittele arvot
  const classes = areaSeries.map((area) =>
    classifyByTertiiles(area.value, t33, t66)
  );

  // 2) Värit luokan mukaan
  const colors = classes.map((cls) => {
    switch (cls) {
      case 1:
        return COLOR_LOW;
      case 2:
        return COLOR_MID;
      case 3:
        return COLOR_HIGH;
      default:
        return COLOR_MISSING;
    }
  });

  // 3) Plotlyn trace
  return [
    {
      type: "choroplethmapbox",
      geojson,
      locations: areaSeries.map((a) => a.id),
      z: classes,
      zmin: 0,
      zmax: 3,
      marker: { line: { width: 0 } },
      colorscale: [
        [0.0, COLOR_MISSING],
        [0.25, COLOR_LOW],
        [0.5, COLOR_MID],
        [1.0, COLOR_HIGH],
      ],
      showscale: false,
      hovertext: areaSeries.map((a) =>
        `${a.name} (${a.id})<br>${a.value != null ? a.value : "Ei dataa"}`
      ),
      hoverinfo: "text",
    },
  ];
}
