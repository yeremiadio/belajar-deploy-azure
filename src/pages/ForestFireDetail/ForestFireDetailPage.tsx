import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import dayjs from 'dayjs';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import { ROUTES } from '@/utils/configs/route';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import DeviceInformation from './_components/DeviceInformation';
import MapPosition from './_components/MapPosition';
import AlertHistory from './_components/AlertHistory';
import ChartContainer from './_components/ChartContainer';

import { TBreadcrumbItem } from '@/types/topbar';

import {
  updateEwsForestFireQueryData,
  useGetForestFireDevicesQuery,
} from '@/stores/ewsStore/ewsForestFireStoreApi';

const ForestFireDetailPage = () => {
  const htmlId = 'forestFireDetailId';
  const dispatch = useAppDispatch();
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { gatewayId } = useParams<'gatewayId'>();
  const { id: deviceId } = useParams<'id'>();

  const { data } = useGetForestFireDevicesQuery(
    {
      gatewayId: Number(gatewayId),
    },
    {
      skip: !gatewayId,
    },
  );

  const selectedDevice = data?.find(
    (device) => device?.id?.toString() === deviceId,
  );

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    // api/ews/devices
    dispatch(
      updateEwsForestFireQueryData(
        'getForestFireDevices',
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

    // api/ews/devices/{id}
    dispatch(
      updateEwsForestFireQueryData(
        'getForestFireDeviceDetailSensorlog',
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

    /**
     * @todo: update alert logs data
     */
  }, [gatewayDevice, gatewayId]);

  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: 'Forest Fire',
      path: gatewayId
        ? ROUTES.ewsFireForestGateway(gatewayId)
        : ROUTES.ewsFireForest,
      clickable: true,
    },
    {
      label: 'Detail Forest Fire',
      path: gatewayId
        ? ROUTES.ewsFireForestGatewayDetail(gatewayId, deviceId as string)
        : ROUTES.ewsFireForestDetail(deviceId as string),
    },
  ]);

  return (
    <PageWrapper>
      <TopBar
        title="EWS - Forest Fire"
        topBarRef={topBarRef}
        breadcrumb={breadcrumb}
      />
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
            data-testid="forest-fire-detail-page"
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

export default ForestFireDetailPage;
