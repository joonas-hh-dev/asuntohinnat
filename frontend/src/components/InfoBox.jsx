import { Box, Typography } from "@mui/material";

const InfoBox = ({
  selectedArea,
  year,
  nameLookup,
  selectedMetric,
  avgSeries,
  yearsSorted,
  areaSeries,
  showComparison = true,
}) => {
  if (!selectedArea) return null;

  const current = areaSeries?.find((r) => String(r.Vuosi) === String(year));

  const currentValue = selectedMetric === "Keskihinta"
  ? current?.Keskihinta ?? null
  : current?.Kauppojen_lkm ?? null;

  const hasValue = currentValue !== null && currentValue !== undefined && currentValue !== 0;

  const cityAvg = avgSeries
    ? avgSeries[yearsSorted?.indexOf(Number(year))] ?? null
    : null;

  const diff = hasValue && cityAvg ? currentValue - cityAvg : null;

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: 2.5,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* Alueen nimi näkyy AINA */}
      <Typography variant="h6">
        {nameLookup[selectedArea] || selectedArea}
      </Typography>

      {/* Arvo tai "Ei dataa" */}
      {hasValue ? (
        <Typography variant="body1">
          {selectedMetric === "Keskihinta"
            ? `${Math.round(currentValue)} €/m²`
            : `${currentValue} kpl`}
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ color: "gray" }}>
          Ei dataa tälle alueelle
        </Typography>
      )}

      {/* Vertailu vain jos molemmilla arvoilla on dataa */}
      {showComparison && hasValue && cityAvg && (
        <Typography
          variant="body2"
          sx={{
            color:
              diff > 0 ? "green" : diff < 0 ? "red" : "gray",
            fontWeight: 500,
          }}
        >
          {diff === 0
            ? "sama kuin keskiarvo"
            : `${diff > 0 ? "+" : ""}${Math.round(diff)} ${
                selectedMetric === "Keskihinta" ? "€/m²" : "kpl"
              } ${diff > 0 ? "yli" : "alle"} keskiarvon`}
        </Typography>
      )}

      <Typography variant="body2" sx={{ color: "gray" }}>
        Vuosi: {year}
      </Typography>
    </Box>
  );
};

export default InfoBox;