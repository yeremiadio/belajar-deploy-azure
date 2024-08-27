import { FormEvent } from "react";

export const replaceInputTextToNumberOnly = (
    e: FormEvent<HTMLInputElement>,
    options?: { isDecimal?: boolean },
  ) => {
    const isDecimal = options?.isDecimal ?? false;
    const regex = isDecimal ? /^[0-9]*([.][0-9]*)?$/ : /^[0-9]*$/;
    const value = e.currentTarget.value;
    const isCorrect = regex.test(value);
  
    if (isCorrect) {
      return value;
    }
    e.currentTarget.value = value.slice(0, value.length - 1);
    return e.currentTarget.value;
  };