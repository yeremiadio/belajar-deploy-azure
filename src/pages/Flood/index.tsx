import React from "react";
import Lazyload from "@/components/LazyLoad";

const FloodLazy = React.lazy(() => import("@/pages/Flood/Flood"));

const FloodPage = () => {
  return <Lazyload component={FloodLazy} />;
};

export default FloodPage;
