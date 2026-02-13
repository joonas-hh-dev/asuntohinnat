// src/hooks/useLoadData.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useLoadData() {
  const [data, setData] = useState([]);
  const [geojson, setGeojson] = useState(null);

  const [years, setYears] = useState([]);
  const [year, setYear] = useState(null);

  const [talotyypit, setTalotyypit] = useState([]);
  const [talotyyppi, setTalotyyppi] = useState(null);

  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("Keskihinta");

  const [nameLookup, setNameLookup] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        // GeoJSON
        const geoRes = await fetch(`${import.meta.env.BASE_URL}finland-postal-codes.geojson`);
        const geo = await geoRes.json();

        const filteredGeo = {
          type: "FeatureCollection",
          features: geo.features.filter((f) =>
            String(f.properties.postinumeroalue).startsWith("00")
          ),
        };
        setGeojson(filteredGeo);

        // API
        const res = await axios.get("https://asuntohinnat-backend.onrender.com/api/hinnat");
        let rows = res.data;
        if (typeof rows === "string") rows = JSON.parse(rows);
        if (!Array.isArray(rows)) rows = [];

        // Nimi lookup
        const lookup = {};
        rows.forEach((r) => {
        const code = r.PostinumeroAlue; // normalisoitu
        if (!lookup[code] && r.Nimi) lookup[code] = r.Nimi;
        });

        filteredGeo.features.forEach((f) => {
        const code = String(f.properties.postinumeroalue).padStart(5, "0");
        if (!lookup[code]) {
            lookup[code] = code;
        }
        });

        setNameLookup(lookup);
        setData(rows);

        // Vuodet
        const yrs = [...new Set(rows.map((r) => String(r.Vuosi)))].sort();
        setYears(yrs);
        setYear(yrs[yrs.length - 1] || null); // viimeisin vuosi

        // Talotyypit
        const tyypit = [...new Set(rows.map((r) => r.Talotyyppi))]
          .filter(Boolean)
          .sort();
        setTalotyypit(tyypit);
        setTalotyyppi(tyypit[0] || null);

      } catch (err) {
        console.error("Virhe ladattaessa dataa:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return {
    // Data
    data,
    geojson,

    // Vuodet
    years,
    year,
    setYear,

    // Talotyypit
    talotyypit,
    talotyyppi,
    setTalotyyppi,

    // Alue
    selectedArea,
    setSelectedArea,

    // Tieto (€/m2 vs kaupat)
    selectedMetric,
    setSelectedMetric,

    // Nimet
    nameLookup,

    // Lataus
    loading,
  };
}
