import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { FC, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import MachineCard from '@/pages/MachineMonitoring/_components/MachineCard';

import { TMachineDevice, TMachineDevicesList } from '@/types/api/machineMonitoring';

import { ROUTES } from '@/utils/configs/route';




type Props = {
  devices: TMachineDevicesList;
  toggleSelectedDevice?: (device: TMachineDevice) => void;
  selectedDevice?: TMachineDevice;
};

const MachineCardList: FC<Props> = ({ devices, selectedDevice }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { gatewayId } = useParams<'gatewayId'>();

  const checkIfInView = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    const scrollToSelected = () => {
      const selectedElement =
        containerRef.current?.querySelector('.env-selected');
      if (selectedElement && !checkIfInView(selectedElement)) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    scrollToSelected();
  }, [selectedDevice]);

  const isAlert = (data: any[]) => {
    return data.some((sensor) => sensor.alert);
  };

  const sortedDevices = [...devices].sort((a, b) => {
    const aActive = a.status === 1;
    const bActive = b.status === 1;

    if (!aActive && bActive) return 1;
    if (aActive && !bActive) return -1;

    const aAlert = isAlert(a.sensorlog?.data);
    const bAlert = isAlert(b.sensorlog?.data);

    if (aActive && bActive) {
      if (aAlert && !bAlert) return -1;
      if (!aAlert && bAlert) return 1;

      const aPercent = a.oee.oee ?? 0;
      const bPercent = b.oee.oee ?? 0;

      return aPercent - bPercent;
    }
    return 0;
  });

  return (
    <OverlayScrollbarsComponent
      className="w-full h-full"
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
      defer
    >
      <div ref={containerRef}>
          <ResponsiveMasonry 
            columnsCountBreakPoints={{
              350: 1,
              400: 1,
              500: 1,
              650: 2,
              800: 2,
              900: 3,
              1100: 3,
              1250: 4,
              1500: 5,
            }}
          >
            <Masonry gutter="20px" className="pr-4">
              {sortedDevices?.map((item, index) => {
                const isSelected = selectedDevice?.name === item?.name;
                const isHaveAlert = isAlert(item.sensorlog?.data);
                return (
                  <MachineCard
                    key={index}
                    deviceData={item}
                    selected={isSelected}
                    onClick={() =>
                      navigate(
                        gatewayId
                          ? ROUTES.machineMonitoringGatewayDetail(
                              gatewayId,
                              item.machineId.toString(),
                            )
                          : ROUTES.machineMonitoringDetail +
                              `?id=${item.machineId.toString()}`,
                      )
                    }
                    isHaveAlert={isHaveAlert}
                  />
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
      </div>
    </OverlayScrollbarsComponent>
  );
};

export default MachineCardList;
