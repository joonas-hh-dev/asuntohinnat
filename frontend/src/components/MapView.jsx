// src/components/MapView.jsx
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "../styles/charts.css";

export default function MapView({ mapData, isMobile, setSelectedArea }) {
  const [renderKey, setRenderKey] = useState(0);

  // Uudelleenrenderöi kartta aina kun ikkuna tai isMobile muuttuu
  useEffect(() => {
    const handleResize = () => {
      setRenderKey((k) => k + 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <Plot
      key={renderKey}
      data={mapData}
      layout={{
        geo: {
          fitbounds: "locations",
          projection: { type: "mercator" },
          visible: false,
        },
        dragmode: false,
        height: isMobile ? 320 : 480,
        margin: { r: 0, t: 0, l: 0, b: 0 },
        clickmode: "event",
      }}
      style={{ width: "100%", height: "100%" }}
      config={{
        responsive: false,
        displayModeBar: false,
        scrollZoom: false,
        doubleClick: false,
        displaylogo: false,
        editable: false,
      }}
      onClick={(e) => {
        const loc = e?.points?.[0]?.location;
        if (loc) setSelectedArea(loc);
      }}
    />
  );
}
