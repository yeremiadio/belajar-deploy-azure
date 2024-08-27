import { useEffect, useRef, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useParams, useSearchParams } from 'react-router-dom';

import PageWrapper from '@/components/Wrapper/PageWrapper';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import TopBar from '@/components/TopBar';
import Copilot from '@/components/Copilot';

import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import { TGatewayDevice } from '@/types/api/socket';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  updateEnviroboxQueryData,
  useGetEnviroboxDevicesListQuery,
} from '@/stores/enviroboxStore/enviroboxStoreApi';

import DeviceSummary from './_components/DeviceSummary';
import DeviceLocation from './_components/DeviceLocation';
import DeviceList from './_components/DeviceList';

const EnviroboxPage = () => {
  const htmlId = 'enviroboxId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  const { gatewayId } = useParams<'gatewayId'>();

  const [searchParams, setSearchParams] = useSearchParams();
  const deviceParams = searchParams.get('device');

  const [selectedDevice, setSelectedDevice] = useState<TGatewayDevice>();

  const { data, isLoading } = useGetEnviroboxDevicesListQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

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
  }, [gatewayDevice, gatewayId]);

  // init
  useEffect(() => {
    if (!deviceParams || !data) return;
    setSelectedDevice(data.find((item) => item.id === Number(deviceParams)));
  }, [deviceParams, data]);

  const toggleSelectedDevice = (device: TGatewayDevice) => {
    searchParams.set('device', `${device.id}`);
    setSearchParams(searchParams);
  };

  return (
    <PageWrapper>
      <TopBar title="Envirobox" topBarRef={topBarRef} />
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
            className="flex flex-grow flex-col gap-7 overflow-auto lg:h-full lg:flex-row lg:gap-0 lg:overflow-hidden"
            data-testid="envirobox-page"
          >
            <div className="flex w-full flex-shrink-0 flex-col gap-10 lg:w-[550px] lg:gap-7">
              <DeviceSummary socket={gatewayDevice} />
              {/* <AlertSummary /> */}
              <DeviceLocation
                devices={data ?? []}
                selectedDevice={selectedDevice}
                toggleSelectedDevice={toggleSelectedDevice}
              />
            </div>
            <DeviceList
              devices={data ?? []}
              isLoading={isLoading}
              toggleSelectedDevice={toggleSelectedDevice}
              selectedDevice={selectedDevice}
              gatewayId={gatewayId}
            />
          </div>
        </OverlayScrollbarsComponent>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default EnviroboxPage;
