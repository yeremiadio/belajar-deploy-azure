/**
 * @description function that can filters out NaN and undefined values
 * from an object in TypeScript with generic type checking
 * @param obj
 * @returns
 */
export const filterNaNAndUndefined = <T extends { [key: string]: any }>(
    obj: T,
  ): T => {
    const filteredObj: { [key: string]: any } = {};
  
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
  
        // Check for `NaN` or `undefined` or `empty string`
        if (value !== undefined && value !== "" && !Number.isNaN(value)) {
          filteredObj[key] = value;
        }
      }
    }
    //casting filtered object
    return filteredObj as T;
  };