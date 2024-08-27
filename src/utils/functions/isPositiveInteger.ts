export const isPositiveInteger = (str: string) => {
  const pattern = /^[1-9]\d*$/;
  return pattern.test(str);
};
