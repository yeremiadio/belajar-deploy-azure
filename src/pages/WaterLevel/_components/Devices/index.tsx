import { FC, HTMLProps, useEffect, useMemo, useRef } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { cn } from '@/lib/utils';

import Spinner from '@/components/Spinner';

import { IDeviceLocationEwsFloodObj } from '@/types/api/ews';
import { TSocketGateway } from '@/types/api/socket';

import { DeviceCard } from './DeviceCard';

interface Props extends HTMLProps<HTMLDivElement> {
  toggleSelectedDevice: (device: IDeviceLocationEwsFloodObj) => void;
  selectedDevice?: IDeviceLocationEwsFloodObj;
  socket: TSocketGateway | null;
  deviceLocationList?: IDeviceLocationEwsFloodObj[];
  isLoading: boolean;
}

export const Devices: FC<Props> = ({
  className,
  selectedDevice,
  toggleSelectedDevice,
  deviceLocationList,
  isLoading,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    if (!deviceLocationList || deviceLocationList.length === 0) return [];

    const data = deviceLocationList.slice();
    return data;
  }, [deviceLocationList]);

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
      <div
        ref={containerRef}
        className={cn(
          `grid flex-grow auto-rows-max grid-cols-[repeat(auto-fit,minmax(190px,_1fr))] gap-6 lg:overflow-auto`,
          className,
        )}
        {...rest}
      >
        {!isLoading ? (
          data?.map((item, index) => {
            const isSelected =
              selectedDevice?.device_summary.id === item.device_summary.id;
            return (
              <DeviceCard
                key={index}
                selected={isSelected}
                onClick={() => {
                  toggleSelectedDevice(item);
                }}
                data={item}
                className="h-full w-full"
              />
            );
          })
        ) : (
          <Spinner
            isFullWidthAndHeight={false}
            containerClassName="h-[calc(100vh-105px)]"
          />
        )}
      </div>
    </OverlayScrollbarsComponent>
  );
};
