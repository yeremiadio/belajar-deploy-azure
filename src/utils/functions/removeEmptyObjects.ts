export const removeEmptyObjects = (
  obj: Record<string, string | number | null | undefined | boolean>,
  ignoreBoolean: boolean = false
): Record<string, string | number | null | undefined | boolean> => {
  const newObj: Record<string, string | number | null | undefined | boolean> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
      if (!ignoreBoolean || (ignoreBoolean && typeof obj[key] !== 'boolean')) {
        newObj[key] = obj[key];
      } else if (typeof obj[key] === 'boolean') {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};
