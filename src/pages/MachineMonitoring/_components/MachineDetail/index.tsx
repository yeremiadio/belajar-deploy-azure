import { lazy } from "react";
import Lazyload from "@/components/LazyLoad";

const MachineMonitoringDetailLazy = lazy(
  () => import("@/pages/MachineMonitoring/_components/MachineDetail/MachineMonitoringDetail")
);

const MachineMonitoringDetailPage = () => {
  return <Lazyload component={MachineMonitoringDetailLazy} />;
};

export default MachineMonitoringDetailPage;
