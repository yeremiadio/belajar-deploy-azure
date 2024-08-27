import { ROUTES } from '@/utils/configs/route';
// import html2pdf from 'html2pdf.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { MdDownload } from 'react-icons/md';

import Copilot from '@/components/Copilot';
import SelectComponent from '@/components/Select';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

// import MachineMonitoringDetailPDFComponent from '@/pages/MachineMonitoring/_components/PDFReport';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  updateMachineMonitoringQueryData,
  useGetAlertLogActivityQuery,
  useGetmachineMonitoringByIdQuery,
  useGetmachineMonitoringOEEByIdQuery,
  useGetMachineMonitoringSensorlogQuery,
  useGetmachineMonitoringStateListQuery,
} from '@/stores/machineMonitoringStore';

import { TMachineDevice, TValueOEE } from '@/types/api/machineMonitoring';
import { TSocketNotif } from '@/types/api/socket';

import { getSensorData } from '@/utils/functions/getSensorData';
import useMachineMonitoringListOpts, {
  IMachineMonitoringOpt,
} from '@/utils/hooks/selectOptions/useMachineMonitoringOptions';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import AlertActivityLog from './AlertActivity';
import MachineStateCard from './MachineState';
import AvailabilityCard from './OeeCard/AvaibilityCard';
import OEECard from './OeeCard/OEECard';
import PerformanceCard from './OeeCard/PerformanceCard';
import QualityCard from './OeeCard/QualityCard';
import { SensorInformationCard } from './SensorInformationCard';
import TrendsChartCard from './SensorTrendChart';


const MachineMonitoringDetail = () => {
  const htmlId = 'machineMonitoringDetailId';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { gatewayId } = useParams<'gatewayId'>();
  const TIME_RANGE_HOURS_FF = 24;

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;
  const match = pathname.match(/\/detail\/(\d+)/);
  const machineId = match ? match[1] : null;
  const {
    arr: MachineDeviceOptions,
    isLoading: isLoadingMachineDeviceOptions,
  } = useMachineMonitoringListOpts(Number(gatewayId), {
    skip: !Number(gatewayId),
  });

  const { data: dataDevice, isLoading: isLoadingDeviceData } =
    useGetmachineMonitoringByIdQuery({
      machineId: Number(machineId),
    });

  const deviceDataMemo = useMemo<TMachineDevice | undefined>(() => {
    if (!dataDevice && isLoadingDeviceData) return undefined;
    return dataDevice;
  }, [dataDevice, isLoadingDeviceData]);

  const [selectedDevice, setSelectedDevice] = useState<IMachineMonitoringOpt>();

  const { data: OEEData, isLoading: isLoadingOEEData } =
    useGetmachineMonitoringOEEByIdQuery({
      machineId: Number(machineId),
    });

  const { data: dataAlert, isLoading: isLoadingAlert } =
  useGetAlertLogActivityQuery({
    machineId: Number(machineId),
    });

  const { data: dataSensorChart } = useGetMachineMonitoringSensorlogQuery(
    {
      machineId: Number(machineId),
      timeRangeHours: TIME_RANGE_HOURS_FF,
    },
    {
      skip: !Number(machineId),
    },
  );

  const { data: dataMachineState } = useGetmachineMonitoringStateListQuery(
    {
      machineId: Number(machineId),
    },
    {
      skip: !Number(machineId),
    },
  );

  const isLoading = isLoadingOEEData || isLoadingDeviceData || isLoadingAlert;

  const OEEDataMemo = useMemo<TValueOEE | undefined>(() => {
    if (!OEEData && isLoading) return undefined;
    return OEEData;
  }, [OEEData, isLoading]);

  const alertDataMemo = useMemo<TSocketNotif[]>(() => {
    if (!dataAlert) return [];
    const alertList = dataAlert.entities.slice();
    return alertList;
  }, [dataAlert]);

  const isActive = deviceDataMemo?.status === 1;

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  useEffect(() => {
    if (!isLoadingDeviceData && dataDevice) {
      setSelectedDevice({
        value: dataDevice?.machineId,
        label: dataDevice?.machineName,
      });
    }
  }, [isLoadingDeviceData, dataDevice]);

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;
    dispatch(
      updateMachineMonitoringQueryData(
        'getMachineMonitoringSensorlog',
        {
          machineId: Number(machineId),
          timeRangeHours: TIME_RANGE_HOURS_FF,
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

  const SensorOptions = useMemo(() => {
    const sensorData = dataDevice?.sensorlog.data;
    return sensorData?.map((sensor) => {
      const { name } = getSensorData(sensor?.sensorcode);
      return {
        label: name ?? '',
        value: name,
      };
    });
  }, [dataDevice]);

  // const contentRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // const element = contentRef.current
    // const options = {
    //   filename: `Machine Monitoring Report.pdf`,
    //   jsPDF: {
    //     format: "a4",
    //     unit: "mm",
    //     orientation: "portrait",
    //   },
    //   html2canvas: {
    //     dpi: 192,
    //     scale: 2,
    //     letterRendering: true,
    //     useCORS: true,
    //     logging: true,
    //   },
    //   margin: 2,
    //   image: { type: "jpeg", quality: 1 },
    //    pagebreak: {
    //   mode: "avoid-all",
    //   after: ".page-break-before",
    //   avoid: ".avoid-break",
    // },
    // };
    // html2pdf().from(element).set(options).toPdf().get("pdf").save();
  };
  

  const { width } = useWindowDimensions();
  const largerScreen = width > 1024; 

  return (
    <PageWrapper>
      <TopBar title="Detail Machine Monitoring" topBarRef={topBarRef} />
      <ContentWrapper
        className="flex flex-col w-full h-screen"
        style={{
          maxHeight: `calc(100vh - ${occupiedHeight}px)`,
          overflowY: 'auto', // Allow vertical scrolling
        }}
      >
        <div className="flex flex-col flex-grow gap-6 w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center">
              <div className="flex items-center">
                <Button
                  className="bg-rs-v2-navy-blue hover:bg-rs-v2-thunder-blue min-h-[40px]"
                  onClick={() =>
                    navigate(
                      gatewayId
                        ? ROUTES.machineMonitoringGateway(gatewayId)
                        : ROUTES.machineMonitoring,
                    )
                  }
                >
                  <BiChevronLeft
                    fontSize={18}
                    size={18}
                    className="mr-2 text-white"
                  />
                </Button>
              </div>
              <div className="inline-flex items-center ml-4">
                <SelectComponent
                  placeholder="Select Machine"
                  value={selectedDevice}
                  options={MachineDeviceOptions}
                  onChange={(val) => {
                    setSelectedDevice(val);
                    navigate(
                      gatewayId
                        ? ROUTES.machineMonitoringGatewayDetail(
                            gatewayId,
                            val.toString(),
                          )
                        : ROUTES.machineMonitoringDetail +
                            `?id=${val.toString()}`,
                    );
                  }}
                  loading={isLoadingMachineDeviceOptions}
                  style={{minWidth: '250px'}}
                />
              </div>
            </div>
            <div className="flex justify-end items-center">
              <Button
                className="bg-rs-alert-green hover:bg-rs-v2-mint min-h-[40px] text-white"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <MdDownload size={15} className="flex-shrink-0 mr-2" />
                <span>Download Report</span>
              </Button>
            </div>
          </div>
          <div
            className="flex flex-col gap-4"
            style={{
              maxHeight: `calc(100vh - ${topBarDimension.height}px - 42px)`,
            }}
          >
            {largerScreen ? (
              <>
                <div className="gap-4 grid grid-cols-[2.5fr_2fr_1fr_1fr_1fr] mb-2">
                  <SensorInformationCard
                    device={deviceDataMemo}
                    isLoading={isLoadingDeviceData}
                  />
                  <OEECard deviceData={OEEDataMemo} isActive={isActive} />
                  <AvailabilityCard
                    deviceData={OEEDataMemo}
                    isActive={isActive}
                  />
                  <PerformanceCard
                    deviceData={OEEDataMemo}
                    isActive={isActive}
                  />
                  <QualityCard deviceData={OEEDataMemo} isActive={isActive} />
                </div>
                <div className="gap-4 grid grid-cols-[2.5fr_3fr_2fr]">
                  <TrendsChartCard
                    socket={gatewayDevice}
                    sensorOptions={SensorOptions}
                    data={dataSensorChart}
                    selectedDevice={deviceDataMemo}
                    isLoading={isLoadingDeviceData}
                  />
                  <MachineStateCard 
                    dataMachineState={dataMachineState ?? []}
                  />
                  <AlertActivityLog  dataAlert={alertDataMemo} isLoading={isLoadingAlert}/>
                </div>
              </>
            ) : (
              <div className="gap-4 grid grid-cols-2 max-680:grid-cols-1">
                 <SensorInformationCard
                    device={deviceDataMemo}
                    isLoading={isLoadingDeviceData}
                  />
                  <OEECard deviceData={OEEDataMemo} isActive={isActive} />
                  <AvailabilityCard
                    deviceData={OEEDataMemo}
                    isActive={isActive}
                  />
                  <PerformanceCard
                    deviceData={OEEDataMemo}
                    isActive={isActive}
                  />
                  <QualityCard deviceData={OEEDataMemo} isActive={isActive} />
                  <TrendsChartCard
                    socket={gatewayDevice}
                    sensorOptions={SensorOptions}
                    data={dataSensorChart}
                    selectedDevice={deviceDataMemo}
                    isLoading={isLoadingDeviceData}
                  />
                   <MachineStateCard 
                    dataMachineState={dataMachineState ?? []}
                  />
                  <AlertActivityLog  dataAlert={alertDataMemo} isLoading={isLoadingAlert}/>
              </div>
            )}
          </div>
        </div>
        {/* Hidden content for PDF generation */}
        {/* <div style={{ 
          position: "absolute",
          left: "-9999px" 
          }}>
        <div ref={contentRef}>
        <MachineMonitoringDetailPDFComponent 
          deviceDataMemo={deviceDataMemo} 
          OEEDataMemo={OEEDataMemo} 
          isActive={isActive} 
          isLoadingDeviceData={isLoadingDeviceData} 
          dataSensorChart={ dataSensorChart} 
          gatewayDevice={gatewayDevice} 
          />
        </div> 
      </div> */}
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MachineMonitoringDetail;
