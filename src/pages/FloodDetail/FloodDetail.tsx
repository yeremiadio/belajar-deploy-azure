import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import {
  updateEwsFloodQueryData,
  useGetFloodDevicesQuery,
} from '@/stores/ewsStore/ewsFloodStoreApi';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { TBreadcrumbItem } from '@/types/topbar';
import { ROUTES } from '@/utils/configs/route';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import { AlertHistory } from './_components/AlertHistory';
import { CCTV } from './_components/CCTV';
import { ChartCard } from './_components/ChartCard';
import { InformationCard } from './_components/InformationCard';
import { Map } from './_components/Map';
import { updateDeviceQueryData } from '@/stores/managementStore/deviceStore/deviceStoreApi';
import { useWebSocketNotification } from '@/utils/hooks/useWebSocketNotification';

const TIME_RANGE_HOURS_FF = 24;

const FloodDetailPage = () => {
  const htmlId = 'floodDetailId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  const { id: deviceId } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: 'Flood',
      path: gatewayId ? ROUTES.ewsFloodGateway(gatewayId) : ROUTES.ewsFlood,
      clickable: true,
    },
    {
      label: 'Detail Flood',
      path: gatewayId
        ? ROUTES.ewsFloodGatewayDetail(gatewayId, deviceId as string)
        : ROUTES.ewsFloodDetail(deviceId as string),
    },
  ]);

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  // websocket
  const { notif } = useWebSocketNotification();

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

    /**
     * @todo: update chart data for other time range
     */
  }, [gatewayDevice, gatewayId]);

  // re-assign value notif socket to redux
  useEffect(() => {
    if (!notif || !deviceId) return;

    const isNotifGatewayExist = notif?.device?.id === Number(deviceId);
    if (!isNotifGatewayExist) return;

    // api/device/{id}/alert-logs
    dispatch(
      updateDeviceQueryData(
        'getDeviceAlertLogs',
        { id: Number(deviceId) },
        (ret) => {
          if (ret.length >= 20) {
            ret.unshift(notif);
            ret.slice(0, 19);
            return;
          } else {
            ret.unshift(notif);
            return;
          }
        },
      ),
    );
  }, [notif, deviceId]);

  const { data: deviceFlood } = useGetFloodDevicesQuery({
    gatewayId: Number(gatewayId),
  });

  const selectedDeviceData = useMemo(() => {
    if (!deviceFlood) return;

    return deviceFlood.find((item) => item.id === Number(deviceId));
  }, [deviceFlood, deviceId]);

  return (
    <PageWrapper>
      <TopBar title="Flood" breadcrumb={breadcrumb} topBarRef={topBarRef} />
      <ContentWrapper
        className="overflow-auto lg:overflow-hidden"
        style={{
          maxHeight: `calc(100vh - ${occupiedHeight}px)`,
        }}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 h-[360px] md:col-span-1">
            <InformationCard deviceData={selectedDeviceData} />
          </div>
          <div className="col-span-2 h-[360px] md:col-span-1">
            <Map deviceData={selectedDeviceData} />
          </div>
          <div className="col-span-2 h-[360px] lg:col-span-1">
            <CCTV deviceData={selectedDeviceData} />
          </div>
          <div className="col-span-2 h-full w-full lg:min-h-[300px]">
            <ChartCard deviceData={selectedDeviceData} gatewayId={gatewayId} />
          </div>
          <div className="col-span-2 h-full w-full lg:col-span-1 lg:min-h-[300px]">
            <AlertHistory />
          </div>
        </div>

        <Copilot className="absolute right-5 md:static" />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default FloodDetailPage;
