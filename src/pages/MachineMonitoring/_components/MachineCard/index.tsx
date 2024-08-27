import { FC } from 'react';
import { MdWarning } from 'react-icons/md';

import Card from '@/components/Card';
import { CircularGaugeChart } from '@/components/Chart/CircularGaugeChart';

import { cn } from '@/lib/utils';

import { MachineInformationCard } from '@/pages/MachineMonitoring/_components/MachineInformation';

import { TMachineDevice } from '@/types/api/machineMonitoring';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';


type Props = {
  deviceData: TMachineDevice;
  selected: boolean;
  onClick: () => void;
  isHaveAlert: Boolean;
};

const MachineCard: FC<Props> = ({ selected = false, onClick, deviceData, isHaveAlert }) => {
  const max_value = 100;
  const percent = deviceData?.oee.oee ?? 0;
  const isActive = deviceData?.status === 1
  const receivedOn = deviceData?.sensorlog?.receivedon;
  const lastUpdateTime = useDynamicLastUpdateTime({ receivedOn });
  const getColorChartOee = (value: number): string => {
    if(isActive){
      if (value >= 60) {
        return "#20C997"; 
      } else if (value >= 40 && value < 60) {
        return "#FDAA09"; 
      } else {
        return "#FC5A5A";
      }
    }else {
      return "#354358";
    }
  };

  const dataChart = {
    labels: ['Electricity'],
    datasets: [
      {
        label: '',
        data: [percent, max_value - percent],
        backgroundColor: [getColorChartOee(percent), '#354358', ],
        cutout: '80%',
        borderWidth: 0,
        circumference: 360,
        rotation: 360,
      },
    ],
  };

  return (
    <Card
      className={cn(
        'relative box-border h-fit cursor-pointer bg-rs-v2-slate-blue-60% ',
        !isActive && 'cursor-default opacity-70',
        selected && 'env-selected border border-white',
        isHaveAlert && ' bg-rs-v2-red-bg ',
      )}
      onClick={onClick}
    >
      <div className="flex flex-col justify-between gap-2">
        <div 
         className={cn(
          'flex flex-col justify-between gap-2',
          deviceData?.status
            ? 'bg-rs-v2-deep-indigo p-3'
            : 'bg-rs-v2-slate-blue-60% p-3',
        )}>
          {deviceData?.machineName}
          <div
            className={cn(
              'flex items-center gap-2',
              isActive
                ? 'text-rs-alert-green'
                : 'text-rs-neutral-steel-gray shadow-none',
            )}
          >
            {deviceData?.status? "On": "Off"}
          </div>
        </div>
        {isHaveAlert &&
        <span className="block top-6 right-6 absolute w-4 h-4">
          <MdWarning className="text-2xl text-rs-alert-danger" />
        </span>}
      </div>
      <div className="relative box-border flex justify-center items-center mt-5 overflow-hidden">
      <div className="relative w-[120px] h-[120px]">
        <CircularGaugeChart
          className="relative text-3xl lg:text-3xl xl:text-3xl"
          data={dataChart}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
              datalabels: {
                display: false,
              },
            },
          }}
          percent={percent}
        />
        </div>
      </div>
      <div className="px-3 py-5">
        <MachineInformationCard device={deviceData}/>
      </div>
      <p className="mb-4 font-semibold text-center text-rs-neutral-chromium text-sm italic">
        {lastUpdateTime}
      </p>
    </Card>
  );
};

export default MachineCard;
