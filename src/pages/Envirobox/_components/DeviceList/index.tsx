import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { FC, useEffect, useRef } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Spinner from '@/components/Spinner';

import { TGatewayDevice } from '@/types/api/socket';

import DeviceCard from '../DeviceCard';

type Props = {
  devices: TGatewayDevice[];
  toggleSelectedDevice: (device: TGatewayDevice) => void;
  selectedDevice?: TGatewayDevice;
  isLoading: boolean;
  gatewayId?: string;
};

const DeviceList: FC<Props> = ({
  devices,
  toggleSelectedDevice,
  selectedDevice,
  isLoading,
  gatewayId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <OverlayScrollbarsComponent
      className="h-full w-full"
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
      defer
    >
      <div ref={containerRef} data-testid="device-list-envirobox">
        {isLoading ? (
          <Spinner
            isFullWidthAndHeight={false}
            containerClassName="h-[calc(100vh-105px)]"
          />
        ) : (
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              750: 1,
              1400: 2,
              1800: 3,
              1900: 3,
            }}
          >
            <Masonry gutter="20px" className="lg:ps-5">
              {devices?.map((item, index) => {
                const isSelected = selectedDevice?.name === item?.name;
                return (
                  <DeviceCard
                    key={index}
                    deviceData={item}
                    selected={isSelected}
                    onClick={() => {
                      toggleSelectedDevice(item);
                    }}
                    gatewayId={gatewayId}
                  />
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
    </OverlayScrollbarsComponent>
  );
};

export default DeviceList;
