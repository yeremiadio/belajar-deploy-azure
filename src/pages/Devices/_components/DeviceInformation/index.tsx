import { FC } from 'react';

import { ESensorEnergyMeterEnum } from '@/types/api/energyMeter';

import { StatisticCard } from '../StatisticCard';
import { TGatewayDevice, TSensorData } from '@/types/api/socket';

interface Props {
  selectedDevice: TGatewayDevice;
}

export const DeviceInformation: FC<Props> = ({ selectedDevice }) => {
  // getSensor
  const getSensor = (
    sensor: ESensorEnergyMeterEnum,
  ): TSensorData | undefined => {
    if (!selectedDevice) return undefined;
    if (!selectedDevice.sensorlog) return undefined;

    const res = selectedDevice?.sensorlog?.data?.find(
      (item) => item.sensorcode === sensor,
    );
    return res;
  };

  return (
    <div className="flex w-full flex-col gap-4 2xl:mt-2 2xl:gap-6">
      <div className="box-border flex w-full flex-col items-start gap-y-2 overflow-hidden rounded-xl bg-rs-v2-thunder-blue p-4 lg:flex-row lg:items-center lg:gap-y-0">
        <StatisticCard
          title="Energy Delivered"
          sensor={getSensor(ESensorEnergyMeterEnum['Energy Delivered'])}
        />
        <StatisticCard
          title="Frequency"
          sensor={getSensor(ESensorEnergyMeterEnum.Frequency)}
        />
        <StatisticCard
          title="Power Factor"
          sensor={getSensor(ESensorEnergyMeterEnum['Power Factor'])}
        />
      </div>
      <div className="box-border flex w-full flex-col items-start gap-y-2 overflow-hidden rounded-xl bg-rs-v2-thunder-blue p-4 lg:flex-row lg:items-center lg:gap-y-0">
        <StatisticCard
          title="Active Power"
          sensor={getSensor(ESensorEnergyMeterEnum['Active Power'])}
        />
        <StatisticCard
          title="VRMS"
          sensor={getSensor(ESensorEnergyMeterEnum.VRMS)}
        />
        <StatisticCard
          title="IRMS"
          sensor={getSensor(ESensorEnergyMeterEnum.IRMS)}
        />
      </div>
      <div className="box-border flex w-full overflow-hidden rounded-xl bg-rs-v2-thunder-blue p-4 lg:items-center lg:justify-center">
        <StatisticCard
          title="Apparent Power"
          sensor={getSensor(ESensorEnergyMeterEnum['Apparent Power'])}
        />
      </div>
    </div>
  );
};
