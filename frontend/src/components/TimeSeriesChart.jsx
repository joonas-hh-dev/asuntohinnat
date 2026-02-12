import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const TimeSeriesChart = ({
  plotData,
  yearsSorted,
  selectedMetric,
  yMax,
  isMobile,
  years,
  setYear,
}) => {
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setRenderKey(k => k + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <Plot
      key={renderKey}
      data={plotData}
      layout={{
        margin: { t: 20, r: 10, l: 40, b: 40 },
        height: isMobile ? 400 : 600,
        xaxis: {
          title: "Vuosi",
          range: [yearsSorted[0] - 0.5, yearsSorted[yearsSorted.length - 1] + 0.5],
          fixedrange: true,
        },
        yaxis: {
          title: selectedMetric === "Keskihinta" ? "€/m²" : "Kauppojen määrä",
          range: [0, yMax || 1],
          fixedrange: true,
        },
        showlegend: true,
        legend: { orientation: "h", y: -0.3 },
        hovermode: isMobile ? "closest" : "x unified",
      }}
      config={{
        displayModeBar: false,
        responsive: false,
      }}
      style={{ width: "100%", height: "100%" }}
      onClick={(e) => {
        const clickedYear = e.points?.[0]?.x;
        if (clickedYear && years.includes(String(clickedYear))) {
          setYear(String(clickedYear));
        }
      }}
    />
  );
};

export default TimeSeriesChart;