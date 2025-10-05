// src/modules/common/utils/dateUtils.ts

/**
 * Renders a datetime value in local timezone format
 * @param value - ISO datetime string or null/undefined
 * @returns Formatted datetime string or "N/A" if invalid
 */
export const renderDateTime = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
};
