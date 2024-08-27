export const getFormattedFullDate = (date: Date) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const day = date.getDate();
  const monthString = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthString} ${year}`;
};

// Convert string to Date or null
export const convertToDateOrNull = (val: unknown): Date | null => {
  if (val instanceof Date) {
    return val;
  }
  if (typeof val === "string") {
    const dateValue = new Date(val);
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }
  return null;
};

export const convertToIsoString = (val:string) => {
  return new Date(val).toISOString()
}