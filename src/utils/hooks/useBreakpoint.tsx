import { useEffect, useState } from "react";

export const useBreakPoint = (breakpoint: number) => {
  const [lowerThanBreakpoint, setLowerThanBreakpoint] = useState(false);
  const [greaterThanBreakpoint, setGreaterThanBreakpoint] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoint) {
        setLowerThanBreakpoint(true);
        setGreaterThanBreakpoint(false);
      }

      if (window.innerWidth > breakpoint) {
        setGreaterThanBreakpoint(true);
        setLowerThanBreakpoint(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return { lowerThanBreakpoint, greaterThanBreakpoint };
};
