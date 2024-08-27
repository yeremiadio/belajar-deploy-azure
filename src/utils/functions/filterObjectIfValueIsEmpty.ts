

const isEmptyObject = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
}

const filterObjectIfValueIsEmpty = <T extends Record<string, any>>(
    obj: T,
): Partial<T & object> => {
    const result: Partial<T[Extract<keyof T, string>] & object> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (
                // value !== 0 &&
                value !== undefined &&
                value !== null &&
                value !== "{}" &&
                value !== "" &&
                !((value as any) instanceof File)
            ) {
                if (typeof value === "object" && !Array.isArray(value)) {
                    const filteredValue = filterObjectIfValueIsEmpty(value);
                    if (!isEmptyObject(filteredValue)) {
                        result[key] = filteredValue;
                    }
                } else {
                    result[key] = value;
                }
            }
        }
    }
    return result;
}

export default filterObjectIfValueIsEmpty;