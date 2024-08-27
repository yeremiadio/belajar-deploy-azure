import { FC, useEffect, useMemo, useState } from 'react';

import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';

import { Card } from '@/pages/WaterLevel/_components/Card';

import { IDeviceLocationEwsFloodObj, TDeviceLocation } from '@/types/api/ews';
import { TSocketGateway } from '@/types/api/socket';

import { generateMapDescription } from '@/utils/functions/tuningCopilot/mapDescription';

import { Tooltip } from './Tooltip';

interface Props {
  toggleSelectedDevice: (device: IDeviceLocationEwsFloodObj) => void;
  selectedDevice?: IDeviceLocationEwsFloodObj;
  socket: TSocketGateway | null;
  deviceLocationList?: IDeviceLocationEwsFloodObj[];
  isLoading: boolean;
}

export const Map: FC<Props> = ({
  selectedDevice,
  toggleSelectedDevice,
  deviceLocationList,
  isLoading,
}) => {
  const [currentFocus, setCurrentFocus] = useState({
    lat: deviceLocationList
      ? parseFloat(deviceLocationList?.[0]?.device_summary.lattitude)
      : 0,
    lng: deviceLocationList
      ? parseFloat(deviceLocationList?.[0]?.device_summary.longtitude)
      : 0,
  });

  const markers = deviceLocationList?.map((item) => ({
    lat: parseFloat(item.device_summary.lattitude),
    lng: parseFloat(item.device_summary.longtitude),
  }));

  useEffect(() => {
    if (selectedDevice) {
      setCurrentFocus({
        lat: selectedDevice?.device_summary?.lattitude
          ? // -0.02 is to adjust the focus on tooltip
            parseFloat(selectedDevice?.device_summary.lattitude) - 0.02
          : 0,
        lng: selectedDevice?.device_summary?.longtitude
          ? parseFloat(selectedDevice?.device_summary.longtitude)
          : 0,
      });
    }
  }, [selectedDevice]);

  const dataMemo = useMemo(() => {
    if (!deviceLocationList || deviceLocationList.length === 0) return [];

    const data = deviceLocationList.slice();
    return data;
  }, [deviceLocationList]);

  // this because uses the ews flood data
  const mapEwsFloodToDeviceLocation = (
    item: IDeviceLocationEwsFloodObj,
  ): TDeviceLocation => {
    const { device_summary, ...rest } = item;
    return { ...device_summary, ...rest };
  };

  const ewsFloodDeviceLocationData =
    dataMemo?.map(mapEwsFloodToDeviceLocation) || [];

  const tooltipDescription = (item: TDeviceLocation) => {
    return `Device Information: ID: ${item.id}, Name: ${item.name}, Status: ${
      item.device_status
    },Is Active: ${item.is_active ? 'Yes' : 'No'}, Alert Times: ${
      item.alert_times
    }, Alert Start: ${item.alert_start}, Location: Latitude: ${
      item.lattitude
    }, Longitude: ${item.longtitude}`;
  };

  return (
    <Card
      border={false}
      title="Location"
      className="px-0 pb-0 pt-0 md:h-full md:pt-6 lg:px-3"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-2xl">
        <span className="hidden">
          {generateMapDescription({
            center: currentFocus,
            data: ewsFloodDeviceLocationData,
            getTooltipDescription: tooltipDescription,
          })}
        </span>
        <GoogleMaps
          zoom={15}
          markers={markers}
          center={currentFocus}
          enableSmallZoomCtrl={true}
        >
          {!isLoading &&
            dataMemo?.map((item, index) => (
              <PointMarker
                key={index}
                position={{
                  lat: parseFloat(item.device_summary.lattitude),
                  lng: parseFloat(item.device_summary.longtitude),
                }}
                isOverThreshold={
                  item?.device_summary?.alert?.alert?.threatlevel === 2
                }
                isWarning={
                  item?.device_summary?.alert?.alert?.threatlevel === 1
                }
                forceShowDetail={
                  selectedDevice?.device_summary?.name ===
                  item?.device_summary?.name
                }
                useBigMarkerOnShowDetail={true}
                additionalAction={() => toggleSelectedDevice(item)}
              >
                <Tooltip
                  deviceData={item.device_summary}
                  isOverThreshold={
                    item?.device_summary?.alert?.alert?.threatlevel === 2
                  }
                  isWarning={
                    item?.device_summary?.alert?.alert?.threatlevel === 1
                  }
                />
              </PointMarker>
            ))}
        </GoogleMaps>
      </div>
    </Card>
  );
};
