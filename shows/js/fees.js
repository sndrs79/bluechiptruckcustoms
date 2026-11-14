/**
 * Fee display rules from the v1 brief and AutoShowList's documented failure:
 * unknown prices must never be shown as "Free".
 * "Not listed" is the only label for missing / unknown / TBA values.
 * An organizer may still explicitly list the fee as "Free" or "$0".
 */
const UNKNOWN = /^(unknown|unlisted|n\/?a|none|not listed|tbd|tba|temp|—|--|\u2014)?$/i;

export function displayFee(value) {
  if (value == null) return "Not listed";
  const v = String(value).trim();
  if (!v || UNKNOWN.test(v)) return "Not listed";
  return v;
}

export function isExplicitFree(value) {
  const shown = displayFee(value);
  if (shown === "Not listed") return false;
  return /^(free|\$0(?:\.00)?|0(?:\.00)?)$/i.test(shown.trim());
}

export function feeOrNull(value) {
  const shown = displayFee(value);
  return shown === "Not listed" ? null : String(value).trim();
}
