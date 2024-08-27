import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import Copilot from '@/components/Copilot';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import { ROUTES } from '@/utils/configs/route';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';
import { useWebSocketNotification } from '@/utils/hooks/useWebSocketNotification';

import { TBreadcrumbItem } from '@/types/topbar';

import {
  updateSmartPoleQueryData,
  useGetDevicesSmartPoleQuery,
} from '@/stores/smartPoleStore/smartPoleStoreApi';
import { updateDeviceQueryData } from '@/stores/managementStore/deviceStore/deviceStoreApi';

import InformationCard from './_components/InformationCard';
import Map from './_components/Map';
import CCTV from './_components/CCTV';
import ChartCard from './_components/ChartCard';
import AlertHistory from './_components/AlertHistory';

const SmartPoleDetailV2Page = () => {
  const { id: deviceId } = useParams<'id'>();
  const { gatewayId: gatewayId } = useParams<'gatewayId'>();

  const { data: deviceSmartPole } = useGetDevicesSmartPoleQuery({
    gatewayId: Number(gatewayId),
  });

  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  const { notif } = useWebSocketNotification();

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

    /**
     * @todo: update chart data for other time range
     */
  }, [gatewayDevice, gatewayId]);

  useEffect(() => {
    if (!notif || !deviceId) return;

    const isNotifGatewayExist = notif?.device?.id === Number(deviceId);
    if (!isNotifGatewayExist) return;

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

  const selectedDeviceData = useMemo(() => {
    if (!deviceSmartPole) return;

    return deviceSmartPole.find((item) => item.id === Number(deviceId));
  }, [deviceSmartPole, deviceId]);

  const htmlId = 'smartPoleDetailId';
  const dispatch = useAppDispatch();
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: 'Smart Pole',
      path: gatewayId ? ROUTES.smartPoleGateway(gatewayId) : ROUTES.smartPole,
      clickable: true,
    },
    {
      label: 'Detail Smart Pole',
      path: gatewayId
        ? ROUTES.smartPoleGatewayDetail(gatewayId, deviceId as string)
        : ROUTES.smartPoleDetail(deviceId as string),
    },
  ]);

  return (
    <PageWrapper>
      <TopBar
        title="Smart Pole"
        breadcrumb={breadcrumb}
        topBarRef={topBarRef}
      />
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
            <AlertHistory deviceData={selectedDeviceData} />
          </div>
        </div>

        <Copilot className="absolute right-5 md:static" />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default SmartPoleDetailV2Page;
