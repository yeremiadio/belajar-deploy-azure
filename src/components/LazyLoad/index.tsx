import React, { Suspense } from "react";

import Spinner from "@/components/Spinner";

interface Props<T> {
  component: React.FC<T>;
  props?: T;
  fallback?: React.ReactNode;
}

const LazyLoad = <T extends Record<string, unknown>>({
  component: Component,
  fallback,
  props = {} as T,
  ...rest
}: Props<T>) => {
  return (
    <Suspense fallback={fallback ?? <Spinner />}>
      <Component {...props} {...rest} />
    </Suspense>
  );
};

export default LazyLoad;
