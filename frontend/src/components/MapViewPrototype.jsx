// MapViewPrototype.jsx (varhainen versio kartasta)
import Plot from "react-plotly.js";

export default function MapViewPrototype({ data, geojson, selectedMetric }) {
  // Valitaan arvoja kartalle (vuosi ja talotyyppi eivät tärkeät demonstraatiossa)
  const values = {};
  data.forEach((row) => {
    const code = String(row.PostinumeroAlue).padStart(5, "0");
    const val =
      selectedMetric === "Keskihinta" ? row.Keskihinta : row.Kauppojen_lkm;
    values[code] = val > 0 ? val : null;
  });

  const locations = geojson.features.map((f) =>
    String(f.properties.postinumeroalue).padStart(5, "0")
  );

  const z = locations.map((code) => values[code] ?? null);

  const hoverTexts = locations.map((code) => {
    const val = values[code];
    if (!val) return `${code}: ei dataa`;
    const unit = selectedMetric === "Keskihinta" ? "€/m²" : "kpl";
    return `${code}: ${Math.round(val)} ${unit}`;
  });

  return (
    <Plot
      data={[
        {
          type: "choropleth",
          geojson,
          locations,
          z,
          featureidkey: "properties.postinumeroalue",
          colorscale: "Viridis",     // Plotlyn jatkuva väriskaala
          autocolorscale: true,
          showscale: true,           // Näytä väripalkki
          text: hoverTexts,
          hovertemplate: "%{text}<extra></extra>",
          marker: { line: { color: "rgba(0,0,0,0.25)", width: 0.5 } },
        },
      ]}
      layout={{
        geo: {
          fitbounds: "locations",
          projection: { type: "mercator" },
          showcoastlines: false,      // TAUSTAKARTTA PÄÄLLÄ
          showland: false,
        },
        dragmode: "zoom",            // Vapaa zoom ja drag
        margin: { r: 0, t: 0, l: 0, b: 0 },
        height: 500,
      }}
      config={{
        scrollZoom: true,
        displayModeBar: false,
        displaylogo: false,
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}