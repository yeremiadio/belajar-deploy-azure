export const numberWithCommas = (value: number) => {
  const result = value
    .toString()
    .split("-")[0]
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return result;
};
