export const formatCurrency = (
  amount: number | string,
  currency = "€"
): string => {
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `0.00 ${currency}`;
  }

  return `${numAmount.toFixed(2)} ${currency}`;
};

export const formatNumber = (num: number, locale = "fr-FR"): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
    sizes[i]
  }`;
};
