import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import { ROUTES } from '@/utils/configs/route';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';
import { useWebSocketNotification } from '@/utils/hooks/useWebSocketNotification';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  updateEnviroboxQueryData,
  useGetEnviroboxDevicesListQuery,
} from '@/stores/enviroboxStore/enviroboxStoreApi';
import { updateDeviceQueryData } from '@/stores/managementStore/deviceStore/deviceStoreApi';

import DeviceInformation from './_components/DeviceInformation';
import MapPosition from './_components/MapPosition';
import ChartContainer from './_components/ChartContainer';
import AlertHistory from './_components/AlertHistory';

import { TBreadcrumbItem } from '@/types/topbar';

const EnviroboxDetailPage = () => {
  const htmlId = 'enviroboxDetailId';
  const dispatch = useAppDispatch();
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { gatewayId } = useParams<'gatewayId'>();
  const { id: deviceId } = useParams<'id'>();

  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: 'Envirobox',
      path: gatewayId ? ROUTES.enviroboxGateway(gatewayId) : ROUTES.envirobox,
      clickable: true,
    },
    {
      label: 'Detail Envirobox',
      path: gatewayId
        ? ROUTES.enviroboxGatewayDetail(gatewayId, deviceId as string)
        : ROUTES.enviroboxDetail(deviceId as string),
    },
  ]);

  const { data } = useGetEnviroboxDevicesListQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const selectedDevice = data?.find((device) => device.id === Number(deviceId));

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  // websocket
  const { notif } = useWebSocketNotification();

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    dispatch(
      updateEnviroboxQueryData(
        'getEnviroboxDevicesList',
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
      updateEnviroboxQueryData(
        'getEnviroboxDeviceChart',
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

  // re-assign value notif socket to redux
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

  return (
    <PageWrapper>
      <TopBar title="Envirobox" topBarRef={topBarRef} breadcrumb={breadcrumb} />
      <ContentWrapper
        className="overflow-hidden"
        style={{
          maxHeight: `calc(100vh - ${occupiedHeight}px)`,
        }}
      >
        <OverlayScrollbarsComponent
          className="h-full w-full"
          options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
          defer
        >
          <div
            id={htmlId}
            className="flex flex-grow flex-col gap-7 overflow-auto lg:h-full lg:flex-row lg:gap-5 lg:overflow-hidden"
            data-testid="envirobox-detail-page"
          >
            <div className="h-full flex-shrink-0 lg:w-[500px]">
              <DeviceInformation deviceData={selectedDevice} />
            </div>
            <div className="flex h-full w-full flex-wrap gap-5 overflow-y-auto">
              <div className="h-[390px] min-w-[48.5%] flex-grow">
                <MapPosition deviceData={selectedDevice} />
              </div>
              <div className="h-[390px] min-w-[48.5%] flex-grow">
                <AlertHistory deviceData={selectedDevice} />
              </div>
              <div className="h-[400px] flex-grow basis-[100%]">
                <ChartContainer
                  deviceData={selectedDevice}
                  gatewayId={gatewayId}
                />
              </div>
            </div>
          </div>
        </OverlayScrollbarsComponent>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default EnviroboxDetailPage;
