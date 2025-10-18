import { DATE_FORMATS } from "@/config/app";

export const formatDate = (
  date: string | Date,
  format: keyof typeof DATE_FORMATS = "DISPLAY"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  switch (format) {
    case "INPUT":
      return dateObj.toISOString().split("T")[0];
    case "DISPLAY":
      return dateObj.toLocaleDateString("fr-FR");
    case "DATETIME":
      return dateObj.toLocaleString("fr-FR");
    default:
      return dateObj.toLocaleDateString("fr-FR");
  }
};

export const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow, "INPUT");
};

export const isDateInFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj > today;
};

export const calculateWorkingDays = (
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0) {
      // Exclude Sundays
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
};

export const formatTime = (time: string | null): string => {
  if (!time) return "";

  try {
    const [hours, minutes] = time.split("T")[1].split(":");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
};

/**
 * Calculate difference between two times (HH:mm)
 * Returns decimal hours as string (e.g. "7.92") or null if invalid.
 */
export function diffHours(
  heureDebut: string | null | undefined,
  heureFin: string | null | undefined
): string | null {
  if (!heureDebut || !heureFin) return null;

  const diffMs =
    new Date(`1970-01-01T${heureFin}:00`).getTime() -
    new Date(`1970-01-01T${heureDebut}:00`).getTime();

  if (diffMs <= 0) return null;

  const diffHours = diffMs / (1000 * 60 * 60);
  const roundedHours = Math.round(diffHours * 100) / 100;
  return roundedHours.toString();
}

/**
 * Convert decimal hours (e.g. "7.92") into a formatted string (e.g. "7h55").
 */
export function formatDecimalHours(
  decimalString: string | number | null | undefined
): string {
  if (!decimalString) return "0h00";

  const decimal =
    typeof decimalString === "string"
      ? parseFloat(decimalString)
      : decimalString;

  if (isNaN(decimal)) return "0h00";

  const totalMinutes = Math.round(decimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes.toString().padStart(2, "0")}`;
}
