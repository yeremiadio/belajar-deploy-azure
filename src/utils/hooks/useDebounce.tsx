import { useEffect, useState } from "react";

export const useDebounce = <D,>(value: D, delay = 1000) => {
  const [debouncedVal, setDebounceVal] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedVal;
};
