import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import {
  updateEwsFloodQueryData,
  useGetFloodDevicesQuery,
} from '@/stores/ewsStore/ewsFloodStoreApi';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { EStatusAlertEnum, TGatewayDevice } from '@/types/api/socket';
import { DEFAULT_CENTER_GOOGLE_MAPS_POS } from '@/utils/constants/defaultValues/googleMapsDefaultValues';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
// import { generateMapDescription } from '@/utils/functions/tuningCopilot/mapDescription';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import { FloodCard } from './_components/FloodCard';
import { StatisticCard } from './_components/StatisticCard';

const TIME_RANGE_HOURS_FF = 24;

export default function FloodPage() {
  const htmlId = 'floodId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { gatewayId } = useParams<'gatewayId'>();

  const [searchParams, setSearchParams] = useSearchParams();
  const deviceParams = searchParams.get('device');

  const [selectedDevice, setSelectedDevice] = useState<
    TGatewayDevice | undefined
  >(undefined);

  const { data } = useGetFloodDevicesQuery({
    gatewayId: Number(gatewayId),
  });

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    // api/ews-flood/devices
    dispatch(
      updateEwsFloodQueryData(
        'getFloodDevices',
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

    // api/ews-flood/devices/{id}
    dispatch(
      updateEwsFloodQueryData(
        'getFloodDeviceDetailSensorlog',
        {
          gatewayId: Number(gatewayId),
          timeRangeHours: TIME_RANGE_HOURS_FF,
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

  // init
  useEffect(() => {
    if (!deviceParams || !data) return;
    setSelectedDevice(data.find((item) => item.id === Number(deviceParams)));
  }, [deviceParams, data]);

  const [centerMaps, setCenterMaps] = useState({
    ...DEFAULT_CENTER_GOOGLE_MAPS_POS,
  });

  const markers = data?.map((item) => ({
    lat: item.location.coordinate.lat,
    lng: item.location.coordinate.lng,
  }));

  useEffect(() => {
    const len = markers?.length;
    // center is the avg of lat and avg of lng
    if (len) {
      let lat = 0;
      let lng = 0;
      markers.forEach((e) => {
        lat += e.lat;
        lng += e.lng;
      });
      lat /= len;
      lng /= len;
      // only set center when the center changes
      !(isEqual(lat, centerMaps.lat) && isEqual(lng, centerMaps.lng)) &&
        setCenterMaps({
          lat,
          lng,
        });
    }
  }, [markers, centerMaps]);

  /**
   * @description TUNING COPILOT NEED ADJUSTMENT AFFECTED OF NEW RESPONSE GATEWAY DEVICE
   */
  // const tooltipDescription = (item: TDeviceObject<TEwsForestFireResponse>) => {
  //   return `Device Information: ID: ${item.id}, Name: ${item.name}, Status: ${
  //     item.device_status
  //   }, Is Active: ${item.is_active ? 'Yes' : 'No'}, Alert Times: ${
  //     item.alert_times
  //   }, Alert Start: ${item.alert_start}, Location: Latitude: ${
  //     item.lattitude
  //   }, Longitude: ${item.longtitude}`;
  // };

  return (
    <PageWrapper>
      <TopBar title="EWS - Flood" isFloating={true} />
      <ContentWrapper id={htmlId}>
        <StatisticCard socket={gatewayDevice} />
        <div className="absolute left-0 top-0 h-screen w-screen bg-rs-v2-thunder-blue">
          {/* <span className="hidden">
            {generateMapDescription({
              center: centerMaps,
              data: data,
              getTooltipDescription: tooltipDescription,
            })}
          </span> */}
          <GoogleMaps center={centerMaps} zoom={8} markers={markers}>
            {data?.map((device, idx) => {
              const isConfirmed =
                device.userConfirmed && device.userConfirmed.length > 0
                  ? true
                  : false;

              return (
                <PointMarker
                  useBigMarker={true}
                  key={idx}
                  position={{
                    lat: device.location.coordinate.lat,
                    lng: device.location.coordinate.lng,
                  }}
                  isOverThreshold={
                    device.alert_status === EStatusAlertEnum.CRITICAL
                  }
                  isWarning={device.alert_status === EStatusAlertEnum.WARNING}
                  isConfirmedAlert={isConfirmed}
                  isActive={device.status === 1}
                  forceShowDetail={selectedDevice === device}
                  additionalAction={() => {
                    searchParams.set('device', `${device.id}`);
                    setSearchParams(searchParams);
                  }}
                >
                  <FloodCard
                    socket={gatewayDevice}
                    selectedDevice={device}
                    timeRangeHours={TIME_RANGE_HOURS_FF}
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
