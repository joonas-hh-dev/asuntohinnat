import { Box, Card, CardContent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Controls from "./Controls";
import MapView from "./MapView";
import TimeSeriesChart from "./TimeSeriesChart";
import InfoBox from "./InfoBox";
import Legend from "./Legend";
import { buildMapData } from "../utils/mapData";
import { buildChartData } from "../utils/chartData.js";
import { calculateGlobalYMax } from "../utils/stats";
import "../styles/charts.css";
import useLoadData from "../hooks/useLoadData";
import useSelectionState from "../hooks/useSelectionState";

const PriceMap = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const { data, geojson, years, talotyypit, loading, nameLookup } = useLoadData();

  const { year, setYear, talotyyppi, setTalotyyppi, selectedArea, setSelectedArea, selectedMetric, setSelectedMetric, } = useSelectionState({ years, talotyypit });

  if (loading) return <p>Ladataan...</p>;
  if (!geojson) return <p>Karttapohjan lataaminen epäonnistui. Yritä ladata sivu uudelleen</p>;
  if (!data.length) return <p>Näkymälle ei löytynyt dataa.</p>;

  const globalYMax = calculateGlobalYMax(data, selectedMetric);

  const { mapData, lookup, legendRanges } = buildMapData({
    data,
    geojson,
    year,
    talotyyppi,
    selectedMetric,
    selectedArea,
    nameLookup,
  });

  const { plotData, yearsSorted, avgSeries, areaSeries } =
    buildChartData({
      data,
      selectedArea,
      talotyyppi,
      selectedMetric,
      year,
      years,
      isMobile,
    });

  return (
    <Box
      sx={{
        bgcolor: "#f5f6f8",
        minHeight: "100vh",
        py: { xs: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >

        <Controls
          year={year}
          years={years}
          setYear={setYear}
          talotyypit={talotyypit}
          talotyyppi={talotyyppi}
          setTalotyyppi={setTalotyyppi}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          nameLookup={nameLookup}
          lookup={lookup}
        />

        <Card className="card">
          <CardContent>
            {isMobile && (
              <InfoBox
                selectedArea={selectedArea}
                lookup={lookup}
                nameLookup={nameLookup}
                year={year}
                selectedMetric={selectedMetric}
                areaSeries={areaSeries}
                showComparison={false}
                avgSeries={avgSeries}
                yearsSorted={yearsSorted}
              />
            )}
            <MapView
              mapData={mapData}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              isMobile={isMobile}
              areasWithData={Object.keys(lookup)}
            />
            <Legend
              legendRanges={legendRanges}
              selectedMetric={selectedMetric}
            />
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            {isMobile && (
              <InfoBox
                selectedArea={selectedArea}
                year={year}
                nameLookup={nameLookup}
                lookup={lookup}
                selectedMetric={selectedMetric}
                avgSeries={avgSeries}
                yearsSorted={yearsSorted}
                areaSeries={areaSeries}
              />
            )}
            <TimeSeriesChart
              plotData={plotData}
              yearsSorted={yearsSorted}
              selectedMetric={selectedMetric}
              yMax={globalYMax}
              isMobile={isMobile}
              year={year}
              years={years}
              setYear={setYear}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PriceMap;