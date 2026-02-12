import { useState, useEffect } from "react";

export default function useSelectionState({ years, talotyypit }) {
  const [year, setYear] = useState(null);
  const [talotyyppi, setTalotyyppi] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("Keskihinta");

  useEffect(() => {
    if (years.length && year == null) {
      setYear(years[years.length - 1]);
    }
    if (talotyypit.length && talotyyppi == null) {
      setTalotyyppi(talotyypit[0]);
    }
  }, [years, talotyypit]);

  return {
    year, setYear,
    talotyyppi, setTalotyyppi,
    selectedArea, setSelectedArea,
    selectedMetric, setSelectedMetric,
  };
}
