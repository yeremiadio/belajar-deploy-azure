import { useLayoutEffect, useState } from "react";

import useWindowDimensions from "@/utils/hooks/useWindowDimension";

const useElementDimensions = (elementRef: React.RefObject<HTMLDivElement>) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [elementDimensions, setElementDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (elementRef.current) {
      setElementDimensions({
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight,
      });
    }
  }, [elementRef, windowWidth, windowHeight]);

  return elementDimensions;
};

export default useElementDimensions;
