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

export const formatTime = (time: string): string => {
  if (!time) return "";

  try {
    const [hours, minutes] = time.split("T")[1].split(":");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }

  return time;
};
