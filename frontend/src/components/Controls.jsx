// src/components/Controls.jsx

import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import Help from "./Help";

export default function Controls({
  year,
  years,
  setYear,
  talotyypit,
  talotyyppi,
  setTalotyyppi,
  selectedMetric,
  setSelectedMetric,
  nameLookup,
  selectedArea,
  setSelectedArea,
  lookup, // sisältää alueet joissa on dataa
}) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        p: { xs: 1, sm: 2 },
        backgroundColor: "rgba(255,255,255,0.95)",
      }}
    >
      <CardContent
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, minmax(180px, 1fr))",
          },
          gap: { xs: 2, sm: 3 },
          alignItems: "center",
        }}
      >
        {/* Vuosi */}
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", height: "100%", }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <span>Vuosi: {year}</span>
            <Help>Voit vaihtaa vuotta liukusäätimellä tai klikkaamalla datapistettä aikasarjasta.</Help>
          </Box>

          <Slider
            value={years.indexOf(String(year))}
            onChange={(e, val) => setYear(years[val])}
            min={0}
            max={years.length - 1}
            step={1}
            marks
          />
        </Box>

        {/* Talotyyppi */}
        <FormControl fullWidth>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <span>Talotyyppi</span>
          </Box>
          <Select
            value={talotyyppi || ""}
            onChange={(e) => setTalotyyppi(e.target.value)}
            label=""
          >
            {talotyypit.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Näytettävä tieto */}
        <FormControl fullWidth>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <span>Näytettävä tieto</span>
          </Box>
          <Select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            label=""
          >
            <MenuItem value="Keskihinta">Keskihinta (€/m²)</MenuItem>
            <MenuItem value="Kauppojen_lkm">Kauppojen lukumäärä</MenuItem>
          </Select>
        </FormControl>

        {/* Postinumeroalue – näytetään kaikki, myös alueet ilman dataa */}
        {nameLookup && (
          <FormControl fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <span>Postinumeroalue</span>
              <Help>
                Voit valita postinumeroalueen pudotusvalikosta tai klikkaamalla aluetta kartasta.
              </Help>
            </Box>
            <Select
              value={selectedArea || ""}
              onChange={(e) => setSelectedArea(e.target.value)}
              label=""
            >
              {Object.entries(nameLookup)
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map(([code, name]) => {
                  const hasData = lookup?.[code] != null;
                  return (
                    <MenuItem key={code} value={code}>
                      {name} ({code}) {!hasData && "– ei dataa"}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        )}
      </CardContent>
    </Card>
  );
}