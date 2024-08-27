import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { cn } from '@/lib/utils';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  updateWaterLevelQueryData,
  useGetWaterlevelDeviceStatisticQuery,
} from '@/stores/waterLevelStore/waterLevelStoreApi';

import useWindowDimensions from '@/utils/hooks/useWindowDimension';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import { IDeviceLocationEwsFloodObj } from '@/types/api/ews';

import { Devices } from './_components/Devices';
import { Map } from './_components/Map';
import TrendsChartCard from './_components/TrendsChart';

export default function WaterLevelPage() {
  const dispatch = useAppDispatch();
  const htmlId = 'waterLevelId';
  const { gatewayId } = useParams<'gatewayId'>();

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const [heightTopBar, setHeightTopBar] = useState<number>(0);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (topBarRef.current) {
      setHeightTopBar(topBarRef.current.getBoundingClientRect().height);
    }
  }, [topBarRef]);

  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  const { data: deviceLocationList, isLoading } =
    useGetWaterlevelDeviceStatisticQuery({
      gatewayId: gatewayId ? Number(gatewayId) : undefined,
    });

  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    const wlvlSensor = gatewayDevice?.sensorlog?.data?.find(
      (sensor) => sensor.sensorcode === 'wlvl',
    );
    const wlvlAlert = wlvlSensor?.alert;

    dispatch(
      updateWaterLevelQueryData(
        'getWaterlevelDeviceStatistic',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (Number(dev.device_summary.id) === gatewayDevice.id) {
              Object.assign(arr[idx].device_summary, {
                ...gatewayDevice,
                receivedon: new Date().toISOString(),
                current_water_level: wlvlSensor?.value,
                device_status: gatewayDevice?.alert_status,
                alert: wlvlAlert ? { alert: wlvlAlert } : null,
              });
            }
          });
        },
      ),
    );
  }, [gatewayDevice, gatewayId]);

  const { width } = useWindowDimensions();

  const [selectedDevice, setSelectedDevice] =
    useState<IDeviceLocationEwsFloodObj>();

  const toggleSelectedDevice = (device: IDeviceLocationEwsFloodObj) => {
    if (selectedDevice === device) {
      setSelectedDevice(undefined);
    } else {
      setSelectedDevice(device);
    }
  };

  return (
    <PageWrapper>
      <TopBar title="Aquasense - Water Level" topBarRef={topBarRef} />
      <ContentWrapper id={htmlId}>
        <div
          className={cn(
            `content box-border flex w-full flex-col-reverse gap-y-6 md:flex-row md:gap-6`,
          )}
          style={{
            height:
              width <= 768
                ? 'fit-content'
                : `calc(100vh - (${heightTopBar}px + 42px))`,
          }}
        >
          <Devices
            selectedDevice={selectedDevice}
            toggleSelectedDevice={toggleSelectedDevice}
            socket={gatewayDevice}
            deviceLocationList={deviceLocationList}
            isLoading={isLoading}
          />
          <div
            ref={rightContentRef}
            className={cn(
              'box-border grid w-full grid-cols-1 gap-y-6 overflow-hidden md:grid-rows-2 lg:h-full lg:gap-6',
              'min-w-[35%]',
            )}
          >
            <Map
              isLoading={isLoading}
              deviceLocationList={deviceLocationList}
              selectedDevice={selectedDevice}
              toggleSelectedDevice={toggleSelectedDevice}
              socket={gatewayDevice}
            />
            <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-1 lg:gap-6">
              <TrendsChartCard
                socket={gatewayDevice}
                deviceLocationList={deviceLocationList}
              />
            </div>
          </div>
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
}
