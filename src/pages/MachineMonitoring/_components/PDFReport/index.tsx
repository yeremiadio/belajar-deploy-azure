import dayjs from 'dayjs';
import { FC, useMemo } from 'react';

import {
  TMachineDevice,
  TMachineStateTime,
  TValueOEE,
} from '@/types/api/machineMonitoring';
import { TChartSensor, TGatewayDevice } from '@/types/api/socket';

import AvailabilityCard from './_components/AvaibilityCard';
import { MachineDetailInformation } from './_components/MachineDetailInformation';
import { MachineStateInformation } from './_components/MachineStateInformation';
import OEECard from './_components/OEECard';
import PerformanceCard from './_components/PerformanceCard';
import QualityCard from './_components/QualityCard';
import TrendsChartCard from './_components/SensorTrendChart';

import Header from './HeaderPDFComponent';

type Props = {
  deviceDataMemo: TMachineDevice | undefined;
  OEEDataMemo: TValueOEE | undefined;
  isActive: Boolean;
  isLoadingDeviceData: Boolean;
  dataSensorChart: TChartSensor[] | undefined;
  gatewayDevice: TGatewayDevice | null;
  dataMachineState: TMachineStateTime[] | undefined;

};

const MachineMonitoringDetailPDFComponent: FC<Props> = ({
  deviceDataMemo,
  OEEDataMemo,
  isActive,
  dataSensorChart,
  gatewayDevice,
  isLoadingDeviceData,
  dataMachineState,
}) => {
  const sensorCodes = useMemo(() => {
    return dataSensorChart?.map((sensor) => sensor.sensorcode) ?? [];
  }, [dataSensorChart]);

  const chartsPerPage = 3;
  const chartGroups = [];

  for (let i = 0; i < sensorCodes.length; i += chartsPerPage) {
    chartGroups.push(sensorCodes.slice(i, i + chartsPerPage));
  }
  return (
    <div className="flex flex-col flex-grow gap-6 bg-rs-fg-white w-full">
      <Header
        machineName={deviceDataMemo?.machineName}
        date={dayjs().format('DD MMMM YYYY')}
      />
      <div className="gap-4 grid grid-cols-4 grid-rows-2 mt-[-30px] p-5">
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Report</p>
          <p className="text-rs-v2-black-text-button">Production</p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">WO Number</p>
          <p className="text-rs-v2-black-text-button">
            {OEEDataMemo?.workorder.name ?? '-'}
          </p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Product</p>
          <p className="text-rs-v2-black-text-button">
            {OEEDataMemo?.recipe.name ?? '-'}
          </p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Total Quantity</p>
          <p className="text-rs-alert-yellow">
            {OEEDataMemo?.workorder.actualoutput ?? '-'}
          </p>
        </div>
      </div>
      <div className="mx-5 mt-[-70px] border-t-[1px] border-t-rs-divider-gray">
        <OEECard deviceData={OEEDataMemo} isActive={isActive} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="gap-4 grid grid-cols-3 mt-[-20px]">
          <AvailabilityCard deviceData={OEEDataMemo} isActive={isActive} />
          <PerformanceCard deviceData={OEEDataMemo} isActive={isActive} />
          <QualityCard deviceData={OEEDataMemo} isActive={isActive} />
        </div>
      </div>
      <h1 className="mt-[-10px] mb-0 pl-5 text-lg text-rs-green-header">
        Detail Machine
      </h1>
      <div className="mb-0 page-break-before">
        <MachineDetailInformation
          device={deviceDataMemo}
          isLoading={isLoadingDeviceData}
        />
      </div>
      <Header
        className="mt-[-50px]"
        machineName={deviceDataMemo?.machineName}
        date={dayjs().format('DD MMMM YYYY')}
      />
      <div className="grid grid-cols-5 grid-rows-2 mt-[-30px] p-5">
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Report</p>
          <p className="text-rs-v2-black-text-button">General Information</p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Running Time</p>
          <p className="text-rs-v2-black-text-button">
            {OEEDataMemo?.workorder.actualrunning ?? '-'}
          </p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Idle Time</p>
          <p className="text-rs-v2-black-text-button">
            {OEEDataMemo?.workorder.stopTime ?? '-'}
          </p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Maintenance</p>
          <p className="text-rs-v2-black-text-button">
            {OEEDataMemo?.workorder.downtime ?? '-'}
          </p>
        </div>
        <div className="flex flex-col items-left">
          <p className="text-rs-neutral-dark-platinum">Off</p>
          <p className="text-rs-alert-yellow">
            {OEEDataMemo?.workorder.stopTime ?? '-'}
          </p>
        </div>
      </div>
      <div className="mt-[-50px] mr-5 ml-5 border-t-[1px] border-t-rs-divider-gray">
        <div className="clear-page-break">
          {chartGroups.length > 0 && chartGroups[0].length > 0 && (
            <div className="page-break-before">
              {chartGroups[0].map((sensorCode) => (
                <div className="mt-4 mb-4 avoid-break" key={sensorCode}>
                  <TrendsChartCard
                    socket={gatewayDevice}
                    data={dataSensorChart?.filter(
                      (sensor) => sensor.sensorcode === sensorCode,
                    )}
                    selectedDevice={deviceDataMemo}
                    isLoading={isLoadingDeviceData}
                    selectedSensor={sensorCode}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Header
        className="mt-[-50px]"
        machineName={deviceDataMemo?.machineName}
        date={dayjs().format('DD MMMM YYYY')}
      />
      <div className="mx-5 mt-[-20px] mb-5">
        {chartGroups.length > 1 &&
          chartGroups.slice(1).map((group, index) => (
            <div key={index}>
              {group.map((sensorCode) => (
                <div className="mt-4 mb-4 avoid-break" key={sensorCode}>
                  <TrendsChartCard
                    socket={gatewayDevice}
                    data={dataSensorChart?.filter(
                      (sensor) => sensor.sensorcode === sensorCode,
                    )}
                    selectedDevice={deviceDataMemo}
                    isLoading={isLoadingDeviceData}
                    selectedSensor={sensorCode}
                  />
                </div>
              ))}
            </div>
          ))}
      </div>
      <h1 className="mt-[-10px] pl-5 text-lg text-rs-green-header">
        Detail Machine State
      </h1>
      <MachineStateInformation
        device={deviceDataMemo}
        isLoading={isLoadingDeviceData}
        dataMachineState={dataMachineState}
      />
    </div>
  );
};

export default MachineMonitoringDetailPDFComponent;
