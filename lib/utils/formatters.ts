export const DASHBOARD_CURRENCY_CODE = "USD";
export const DASHBOARD_CURRENCY_SYMBOL = "$";
export const DASHBOARD_DISTANCE_UNIT = "mi";

const toFiniteNumber = (value: unknown): number => {
  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const addCommas = (value: string): string => {
  const [integerPart, decimalPart] = value.split(".");
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined ? `${withCommas}.${decimalPart}` : withCommas;
};

export const formatDashboardPrice = (value: unknown): string => {
  const numericValue = toFiniteNumber(value);
  return `${DASHBOARD_CURRENCY_SYMBOL}${addCommas(numericValue.toFixed(2))}`;
};

export const getDashboardCurrencyLabel = (): string =>
  `${DASHBOARD_CURRENCY_CODE} (${DASHBOARD_CURRENCY_SYMBOL})`;

export const formatDashboardCompactCurrency = (value: unknown): string => {
  const numericValue = toFiniteNumber(value);
  if (numericValue >= 1000000) {
    return `${DASHBOARD_CURRENCY_SYMBOL}${(numericValue / 1000000).toFixed(1)}M`;
  }
  if (numericValue >= 1000) {
    return `${DASHBOARD_CURRENCY_SYMBOL}${(numericValue / 1000).toFixed(1)}K`;
  }
  return `${DASHBOARD_CURRENCY_SYMBOL}${numericValue.toFixed(0)}`;
};

export const formatDashboardCurrencyLocale = (
  value: unknown,
  minDecimals: number = 2,
  maxDecimals: number = 2
): string => {
  const numericValue = toFiniteNumber(value);
  const safeMin = Math.max(0, minDecimals);
  const safeMax = Math.max(safeMin, maxDecimals);
  const rounded =
    safeMax === 0 ? Math.round(numericValue).toString() : numericValue.toFixed(safeMax);

  if (safeMax === safeMin) {
    return `${DASHBOARD_CURRENCY_SYMBOL}${addCommas(rounded)}`;
  }

  const [intPart, rawDecimals = ""] = rounded.split(".");
  const trimmedDecimals = rawDecimals.replace(/0+$/, "");
  const effectiveDecimals =
    trimmedDecimals.length >= safeMin
      ? trimmedDecimals
      : `${trimmedDecimals}${"0".repeat(safeMin - trimmedDecimals.length)}`;

  const result =
    effectiveDecimals.length > 0 ? `${intPart}.${effectiveDecimals}` : intPart;

  return `${DASHBOARD_CURRENCY_SYMBOL}${addCommas(result)}`;
};

export const formatDashboardDistance = (
  value: unknown,
  options?: { withUnit?: boolean; maxFractionDigits?: number }
): string => {
  const numericValue = toFiniteNumber(value);
  const withUnit = options?.withUnit ?? true;
  const maxFractionDigits = options?.maxFractionDigits ?? 2;
  const safeMax = Math.max(0, maxFractionDigits);
  const rounded =
    safeMax === 0 ? Math.round(numericValue).toString() : numericValue.toFixed(safeMax);
  const [intPart, rawDecimals = ""] = rounded.split(".");
  const trimmedDecimals = rawDecimals.replace(/0+$/, "");
  const result =
    trimmedDecimals.length > 0 ? `${intPart}.${trimmedDecimals}` : intPart;
  const formatted = addCommas(result);

  return withUnit ? `${formatted} ${DASHBOARD_DISTANCE_UNIT}` : formatted;
};

export const getDistanceUnitLabel = (): string => "Miles";

export const getDistanceUnitShortLabel = (): string => DASHBOARD_DISTANCE_UNIT;
