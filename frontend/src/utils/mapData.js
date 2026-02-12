import { THREE_STEP_COLORSCALE } from "./colors.js";
import { classifyByTertiiles } from "./classification.js";

export function buildMapData({
  data,
  geojson,
  year,
  talotyyppi,
  selectedMetric,
  selectedArea,
  nameLookup,
}) {
  const filtered = data.filter(
    (r) =>
      String(r.Vuosi) === String(year) &&
      String(r.Talotyyppi) === String(talotyyppi)
  );

  const allValues = filtered
    .map((r) =>
      selectedMetric === "Keskihinta" ? r.Keskihinta : r.Kauppojen_lkm
    )
    .filter((v) => v > 0);

  const sorted = [...allValues].sort((a, b) => a - b);

  const t33 = sorted[Math.floor(sorted.length * 0.33)] || 0;
  const t66 = sorted[Math.floor(sorted.length * 0.66)] || 0;

  const legendRanges = { lowMax: t33, midMax: t66 };

  const lookup = {};

  filtered.forEach((r) => {
    const code = String(r.PostinumeroAlue).padStart(5, "0");
    const val =
      selectedMetric === "Keskihinta" ? r.Keskihinta : r.Kauppojen_lkm;
    lookup[code] = val > 0 ? val : null;
  });

  const locations = geojson.features.map((f) =>
    String(f.properties.postinumeroalue).padStart(5, "0")
  );

  const z = locations.map((code) => {
    const val = lookup[code];
    const cls = classifyByTertiiles(val, t33, t66);
    return cls / 3;
  });

  const hoverTexts = locations.map((code) => {
    const name = nameLookup[code] || code;
    const val = lookup[code];
    if (!val) return `${name}: ei dataa`;
    const unit = selectedMetric === "Keskihinta" ? "€/m²" : "kpl";
    return `${name}: ${Math.round(val)} ${unit}`;
  });

  const mapData = [
    {
      type: "choropleth",
      geojson,
      locations,
      z,
      featureidkey: "properties.postinumeroalue",
      colorscale: THREE_STEP_COLORSCALE,
      zmin: 0,
      zmax: 1,
      autocolorscale: false,
      showscale: false,
      text: hoverTexts,
      hoverinfo: "text",
      hovertemplate: "%{text}<extra></extra>",
      marker: { line: { color: "rgba(0,0,0,0.35)", width: 0.6 } },
    },
  ];

  // Piirrä valittu alue kartalla
  if (selectedArea) {
    const feature = geojson.features.find(
      (f) => String(f.properties.postinumeroalue) === selectedArea
    );

    if (feature) {
      const geom = feature.geometry;
      const polygons =
        geom.type === "Polygon"
          ? [geom.coordinates]
          : geom.type === "MultiPolygon"
          ? geom.coordinates
          : [];

      polygons.forEach((poly) =>
        poly.forEach((ring) => {
          const lons = ring.map((p) => p[0]);
          const lats = ring.map((p) => p[1]);
          lons.push(ring[0][0]);
          lats.push(ring[0][1]);

          mapData.push({
            type: "scattergeo",
            lon: lons,
            lat: lats,
            mode: "lines",
            line: { color: "black", width: 2 },
            hoverinfo: "skip",
            showlegend: false,
          });
        })
      );
    }
  }

  return { mapData, lookup, nameLookup, legendRanges };
}
