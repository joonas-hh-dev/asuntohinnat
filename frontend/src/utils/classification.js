// classification.js
// --------------------------------------------
// Arvojen luokittelu (tertiilit ym.)
// --------------------------------------------

/**
 * Luokittelee arvon tertiileihin:
 * 0 = ei arvoa
 * 1 = alin kolmannes
 * 2 = keskikolmannes
 * 3 = ylin kolmannes
 */
export function classifyByTertiiles(value, t33, t66) {
  if (value == null || isNaN(value)) return 0;
  if (value <= t33) return 1;
  if (value <= t66) return 2;
  return 3;
}
