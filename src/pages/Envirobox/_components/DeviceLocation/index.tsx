import { FC, useEffect, useMemo, useState } from 'react';
import { IoTriangle } from 'react-icons/io5';
import { MdOutlineLocationOn } from 'react-icons/md';

import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { TGatewayDevice } from '@/types/api/socket';

import { DEFAULT_CENTER_GOOGLE_MAPS_POS } from '@/utils/constants/defaultValues/googleMapsDefaultValues';
import { localization } from '@/utils/functions/localization';
import { generateMapDescription } from '@/utils/functions/tuningCopilot/mapDescription';
import useAppSelector from '@/utils/hooks/useAppSelector';

type Props = {
  devices: TGatewayDevice[];
  toggleSelectedDevice: (device: TGatewayDevice) => void;
  selectedDevice?: TGatewayDevice;
};

const DeviceLocation: FC<Props> = ({
  devices,
  selectedDevice,
  toggleSelectedDevice,
}) => {
  const language = useAppSelector(selectLanguage);

  const [currentFocus, setCurrentFocus] = useState({
    lat:
      devices?.[0]?.location?.coordinate?.lat ??
      DEFAULT_CENTER_GOOGLE_MAPS_POS.lat,
    lng:
      devices?.[0]?.location?.coordinate?.lng ??
      DEFAULT_CENTER_GOOGLE_MAPS_POS.lng,
  });

  useEffect(() => {
    if (selectedDevice) {
      setCurrentFocus({
        lat:
          selectedDevice?.location?.coordinate?.lat ??
          DEFAULT_CENTER_GOOGLE_MAPS_POS.lat,
        lng:
          selectedDevice?.location?.coordinate?.lng ??
          DEFAULT_CENTER_GOOGLE_MAPS_POS.lng,
      });
    }
  }, [selectedDevice]);

  const devicesMemo = useMemo(() => {
    if (!devices) return [];

    return devices.map((item) => ({
      ...item,
      lattitude:
        item?.location?.coordinate?.lat?.toString() ??
        DEFAULT_CENTER_GOOGLE_MAPS_POS.lat,
      longtitude:
        item?.location?.coordinate?.lng?.toString() ??
        DEFAULT_CENTER_GOOGLE_MAPS_POS.lng,
    }));
  }, [devices]) as (TGatewayDevice & {
    lattitude: string;
    longtitude: string;
  })[];

  const markers = devicesMemo?.map((item) => ({
    lat: parseFloat(item.lattitude),
    lng: parseFloat(item.longtitude),
  }));

  const tooltipDescription = (
    item: TGatewayDevice & { lattitude: string; longtitude: string },
  ) => {
    return `Device Name: ${item.name}, Location: Latitude: ${item.lattitude}, Longitude: ${item.longtitude}`;
  };

  return (
    <div
      className="flex h-[500px] flex-col lg:h-full"
      data-testid="device-location-envirobox"
    >
      <h2 className="mb-4 text-xl">
        {localization('Device Location', language)}
      </h2>

      <span className="hidden">
        {generateMapDescription({
          center: currentFocus,
          data: devicesMemo,
          getTooltipDescription: tooltipDescription,
        })}
      </span>

      <div className="h-full">
        <div className="h-full overflow-hidden rounded-2xl">
          <GoogleMaps
            enableSmallZoomCtrl={true}
            center={currentFocus}
            markers={markers}
            zoom={15}
          >
            {devices?.map((item, index) => {
              const haveThreatLevel2 = item?.sensorlog?.data?.some(
                (sensor) => sensor?.alert?.threatlevel === 2,
              );
              const haveThreatLevel1 = item?.sensorlog?.data?.some(
                (sensor) => sensor?.alert?.threatlevel === 1,
              );

              return (
                <PointMarker
                  key={index}
                  position={{
                    lat:
                      item?.location?.coordinate?.lat ??
                      DEFAULT_CENTER_GOOGLE_MAPS_POS.lat,
                    lng:
                      item?.location?.coordinate?.lng ??
                      DEFAULT_CENTER_GOOGLE_MAPS_POS.lng,
                  }}
                  isActive={item?.status === 1}
                  isOverThreshold={haveThreatLevel2}
                  isWarning={haveThreatLevel1}
                  forceShowDetail={selectedDevice === item}
                  useBigMarkerOnShowDetail={true}
                  className={selectedDevice === item ? 'z-10' : ''}
                  additionalAction={() => toggleSelectedDevice(item)}
                >
                  <div className="relative mt-32 flex h-fit w-fit flex-col items-center rounded-lg bg-black/90 p-3 text-sm">
                    <div>
                      <p className="mb-2 text-nowrap font-bold">{item.name}</p>
                      <div className="flex items-center gap-1 text-rs-neutral-chromium">
                        <MdOutlineLocationOn size={16} />
                        <p className="text-nowrap">
                          {item?.location?.name ?? '-'}
                        </p>
                      </div>
                    </div>
                    <IoTriangle className="absolute top-[-.8rem] text-black/90" />
                  </div>
                </PointMarker>
              );
            })}
          </GoogleMaps>
        </div>
      </div>
    </div>
  );
};

export default DeviceLocation;
