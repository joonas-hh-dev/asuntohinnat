import MapViewPrototype from "../components/MapViewPrototype";
import useLoadData from "../hooks/useLoadData";

export default function PrototypeMapPage() {
  const { data, geojson, loading } = useLoadData();

  if (loading) return <p>Ladataan...</p>;
  if (!geojson) return <p>GeoJSON puuttuu.</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

      <MapViewPrototype
        data={data}
        geojson={geojson}
        selectedMetric="Keskihinta"
      />
    </div>
  );
}
