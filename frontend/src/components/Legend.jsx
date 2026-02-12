// Legend.jsx
import {
  COLOR_MISSING,
  COLOR_LOW,
  COLOR_MID,
  COLOR_HIGH,
} from "../utils/colors";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Legend({ legendRanges, selectedMetric }) {
  if (!legendRanges) return null;

  const isMobile = useMediaQuery("(max-width:600px)");

  const unit = selectedMetric === "Keskihinta" ? "€/m²" : "kpl";
  const { lowMax, midMax } = legendRanges;

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 0",
    whiteSpace: "nowrap",
  };

  const boxStyle = (color) => ({
    width: 18,
    height: 18,
    borderRadius: 3,
    background: color,
    border: "1px solid #999",
    flexShrink: 0,
  });

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : "repeat(4, max-content)",
          columnGap: "24px",
          rowGap: "6px",
          fontSize: "14px",
          lineHeight: "20px",
          marginTop: "12px",
          marginBottom: "4px",
        }}
      >
        <div style={rowStyle}>
          <div style={boxStyle(COLOR_MISSING)} />
          <span>Ei dataa</span>
        </div>

        <div style={rowStyle}>
          <div style={boxStyle(COLOR_LOW)} />
          <span>≤ {Math.round(lowMax)} {unit}</span>
        </div>

        <div style={rowStyle}>
          <div style={boxStyle(COLOR_MID)} />
          <span>
            {Math.round(lowMax)}–{Math.round(midMax)} {unit}
          </span>
        </div>

        <div style={rowStyle}>
          <div style={boxStyle(COLOR_HIGH)} />
          <span>≥ {Math.round(midMax)} {unit}</span>
        </div>
      </div>
    </div>
  );
}
