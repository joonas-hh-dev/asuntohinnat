// colors.js
// --------------------------------------------
// Värikonfiguraatiot ja 3-portainen väriskaala
// --------------------------------------------

export const COLOR_MISSING = "#cccccc";
export const COLOR_LOW = "#c6dbef";
export const COLOR_MID = "#6baed6";
export const COLOR_HIGH = "#2171b5";

export const THREE_STEP_COLORSCALE = [
  [0.0, COLOR_MISSING],
  [0.25, COLOR_LOW],
  [0.5, COLOR_MID],
  [1.0, COLOR_HIGH],
];
