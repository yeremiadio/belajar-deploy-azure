import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useParams, useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  updateSmartPoleQueryData,
  useGetDeviceLocationSmartPoleQuery,
  useGetDevicesSmartPoleQuery,
} from '@/stores/smartPoleStore/smartPoleStoreApi';

import { TDeviceDetail } from '@/types/api/smartPole';
import { EStatusAlertEnum, TGatewayDevice } from '@/types/api/socket';

import { DEFAULT_CENTER_GOOGLE_MAPS_POS } from '@/utils/constants/defaultValues/googleMapsDefaultValues';
import { generateMapDescription } from '@/utils/functions/tuningCopilot/mapDescription';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import { StatisticCard } from './_components/StatisticCard';
import { Tooltip } from './_components/Tooltip';

export default function SmartPolePage() {
  const [selectedDevice, setSelectedDevice] = useState<TGatewayDevice>();
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceParams = searchParams.get('device');

  const { gatewayId } = useParams<'gatewayId'>();
  const dispatch = useAppDispatch();
  const htmlId = 'smartPoleId';

  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { data } = useGetDeviceLocationSmartPoleQuery({
    gatewayId: Number(gatewayId),
  });

  const { data: deviceSmartPole } = useGetDevicesSmartPoleQuery({
    gatewayId: Number(gatewayId),
  });

  useEffect(() => {
    if (!deviceParams || !deviceSmartPole) return;
    setSelectedDevice(
      deviceSmartPole.find((item) => item.id === Number(deviceParams)),
    );
  }, [deviceParams, deviceSmartPole]);

  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    dispatch(
      updateSmartPoleQueryData(
        'getDevicesSmartPole',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (dev.id === gatewayDevice.id) {
              Object.assign(arr[idx], gatewayDevice);
            }
          });
        },
      ),
    );

    dispatch(
      updateSmartPoleQueryData(
        'getDevicesSmartPoleChartV2',
        {
          gatewayId: Number(gatewayId),
          timeRangeHours: 24,
          id: gatewayDevice.id,
        },
        (ret) => {
          const time = dayjs(gatewayDevice.sensorlog.receivedon).valueOf();

          if (!ret) return;
          if (ret.length === 0) {
            gatewayDevice.sensorlog.data.forEach((item) => {
              ret.push({
                sensorcode: item.sensorcode,
                values: [Number(item.value)],
                times: [time],
              });
            });
            return;
          }

          ret.forEach((dev, idx, arr) => {
            const existingSensor = gatewayDevice.sensorlog.data.find(
              (item) => item.sensorcode === dev.sensorcode,
            );

            const notExistingSensor = gatewayDevice.sensorlog.data.filter(
              (item) => item.sensorcode !== dev.sensorcode,
            );

            if (existingSensor) {
              arr[idx].values.push(Number(existingSensor.value));
              arr[idx].times.push(time);
            } else {
              notExistingSensor.forEach((item) => {
                arr.push({
                  sensorcode: item.sensorcode,
                  values: [Number(item.value)],
                  times: [time],
                });
              });
            }
          });
        },
      ),
    );
  }, [gatewayDevice, gatewayId]);

  const [centerMaps, setCenterMaps] = useState({
    ...DEFAULT_CENTER_GOOGLE_MAPS_POS,
  });

  const markers = deviceSmartPole?.map((item) => ({
    lat: parseFloat(item.location.coordinate.lat.toString()),
    lng: parseFloat(item.location.coordinate.lng.toString()),
  }));

  useEffect(() => {
    const len = markers?.length;
    if (len) {
      let lat = 0;
      let lng = 0;
      markers.forEach((e) => {
        lat += e.lat;
        lng += e.lng;
      });
      lat /= len;
      lng /= len;
      if (!(isEqual(lat, centerMaps.lat) && isEqual(lng, centerMaps.lng))) {
        setCenterMaps({ lat, lng });
      }
    }
  }, [markers, centerMaps]);
  const tooltipDescription = (item: TDeviceDetail) => {
    return `Device Information: ID: ${item.id}, Name: ${item.name}, Status: ${
      item.device_status
    },Is Active: ${item.is_active ? 'Yes' : 'No'}, Alert Times: ${
      item.alert_times
    }, Alert Start: ${item.alert_start}, Location: Latitude: ${
      item.lattitude
    }, Longitude: ${item.longtitude}`;
  };

  return (
    <PageWrapper>
      <TopBar title="Smartpole" isFloating={true} />
      <ContentWrapper id={htmlId}>
        <StatisticCard />
        <div className="absolute left-0 top-0 h-screen w-screen bg-rs-v2-thunder-blue">
          <span className="hidden">
            {generateMapDescription({
              center: centerMaps,
              data: data,
              getTooltipDescription: tooltipDescription,
            })}
          </span>
          <GoogleMaps center={centerMaps} zoom={8} markers={markers}>
            {deviceSmartPole?.map((device) => {
              const isConfirmed =
                device.userConfirmed && device.userConfirmed.length > 0;
              return (
                <PointMarker
                  useBigMarker={true}
                  key={device.id}
                  position={{
                    lat: device.location.coordinate.lat,
                    lng: device.location.coordinate.lng,
                  }}
                  isOverThreshold={
                    device.alert_status === EStatusAlertEnum.CRITICAL
                  }
                  isWarning={device.alert_status === EStatusAlertEnum.WARNING}
                  isActive={device.status === 1}
                  isConfirmedAlert={isConfirmed}
                  forceShowDetail={selectedDevice?.id === device.id}
                  additionalAction={() => {
                    searchParams.set('device', `${device.id}`);
                    setSearchParams(searchParams);
                  }}
                >
                  <Tooltip
                    deviceData={device}
                    className="absolute left-[-70px] top-10 transition-all ease-in-out"
                  />
                </PointMarker>
              );
            })}
          </GoogleMaps>
        </div>
        <Copilot className="absolute right-5" />
      </ContentWrapper>
    </PageWrapper>
  );
}
