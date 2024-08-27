import dayjs from 'dayjs';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import { DeviceCard } from '@/components/DeviceCard';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { cn } from '@/lib/utils';
import {
    selectToggleCopilot, toggleCopilot as setToggleCopilot
} from '@/stores/copilotStore/toggleCopilotSlice';
import {
    updateEnergyMeterQueryData, useGetEnergyMeterDevicesQuery
} from '@/stores/energyMeterStore/energyMeterStoreApi';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { EStatusAlertEnum, TGatewayDevice } from '@/types/api/socket';
import { TBreadcrumbItem } from '@/types/topbar';
import { ROUTES } from '@/utils/configs/route';
import { convertAlertStatusToRank } from '@/utils/functions/convertAlertStatusToRank';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useAppSelector from '@/utils/hooks/useAppSelector';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import { DeviceDetail } from './_components/DeviceDetail';

const TIME_RANGE_HOURS_FF = 24;

export default function DevicesPage() {
  const htmlId = 'devicesId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const [heightTopBar, setHeightTopBar] = useState<number>(0);
  const { pathname } = useLocation();
  const toggleCopilot = useAppSelector(selectToggleCopilot);

  const { gatewayId } = useParams<'gatewayId'>();

  useLayoutEffect(() => {
    if (topBarRef.current) {
      setHeightTopBar(topBarRef.current.getBoundingClientRect().height);
    }
  }, [topBarRef]);

  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: `Energy Meter - ${pathname.includes('advanced') ? 'Advanced' : 'Basic'}`,
      path: gatewayId
        ? pathname.includes('advanced')
          ? ROUTES.energyMeterAdvancedGateway(gatewayId)
          : ROUTES.energyMeterGateway(gatewayId)
        : pathname.includes('advanced')
          ? ROUTES.energyMeterAdvanced
          : ROUTES.energyMeter,
      clickable: true,
    },
    {
      label: 'All Devices',
      path: gatewayId
        ? pathname.includes('advanced')
          ? ROUTES.energyMeterAdvancedGatewayDevices(gatewayId)
          : ROUTES.energyMeterGatewayDevices(gatewayId)
        : pathname.includes('advanced')
          ? ROUTES.energyMeterAdvancedDevices
          : ROUTES.energyMeterDevices,
      clickable: true,
    },
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const deviceParams = searchParams.get('device');

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<
    TGatewayDevice | undefined
  >(undefined);

  const { data } = useGetEnergyMeterDevicesQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    // api/energy-meter/devices
    dispatch(
      updateEnergyMeterQueryData(
        'getEnergyMeterDevices',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (dev.id === gatewayDevice.id) {
              Object.assign(arr[idx], gatewayDevice);
            }
          });

          // sort by alert_status
          ret.sort((a, b) => {
            const statusA = convertAlertStatusToRank(
              a.alert_status as EStatusAlertEnum,
            );
            const statusB = convertAlertStatusToRank(
              b.alert_status as EStatusAlertEnum,
            );
            return statusA - statusB;
          });
        },
      ),
    );

    // api/energy-meter/devices/{id}
    dispatch(
      updateEnergyMeterQueryData(
        'getEnergyMeterDeviceDetailSensorLog',
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

  const handleDeleteParams = () => {
    searchParams.delete('device');
    setSearchParams(searchParams);
    setSelectedDevice(undefined);
  };

  // init
  useEffect(() => {
    if (!deviceParams || !data) return;
    setOpenModal(true);
    setSelectedDevice(data.find((item) => item.id === Number(deviceParams)));
  }, [deviceParams, data]);

  // toggleCopilot
  useEffect(() => {
    if (toggleCopilot) {
      setOpenModal(false);
      handleDeleteParams();
    }
  }, [toggleCopilot]);

  const onShowDetail = (device_id: number) => {
    setOpenModal(true);
    searchParams.set('device', `${device_id}`);
    toggleCopilot && dispatch(setToggleCopilot());
  };

  return (
    <PageWrapper>
      <TopBar
        title="All Devices"
        topBarRef={topBarRef}
        breadcrumb={breadcrumb}
      />
      <ContentWrapper id={htmlId}>
        <div
          className={`content relative box-border flex w-full overflow-hidden`}
          onClick={() => {
            setOpenModal(false);
            handleDeleteParams();
          }}
        >
          <div
            className={cn(
              `grid h-fit grid-cols-1 items-stretch gap-y-4 overflow-y-auto md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4`,
              openModal
                ? 'w-full md:w-[50%] md:grid-cols-1 lg:w-[70%] lg:grid-cols-2 xl:w-[60%] xl:grid-cols-3'
                : toggleCopilot
                  ? 'w-full md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                  : 'w-full',
            )}
          >
            {data &&
              data?.map((item, index) => (
                <DeviceCard
                  key={index}
                  data={item}
                  isShownDetail={onShowDetail}
                  selectedDeviceId={selectedDevice?.id ?? 0}
                />
              ))}
          </div>
          {openModal && (
            <DeviceDetail
              style={{
                // dynamic value with calc still error using tailwind arbitrary
                height: `calc(100vh - (${heightTopBar}px + 35px))`, // h = h_screen - (h_topBar + padding/margin)
              }}
              toogle={setOpenModal}
              handleDeleteParams={handleDeleteParams}
              selectedDevice={selectedDevice}
              socket={gatewayDevice}
              timeRangeHours={TIME_RANGE_HOURS_FF}
            />
          )}
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
}
