import { FC, useEffect, useMemo, useState } from 'react';
import { ChartData, ScriptableContext } from 'chart.js';

import Card from '@/components/Card';
import SelectComponent from '@/components/Select';

import {
  ESensorMachineMonitoringEnum,
  TMachineDevice,
} from '@/types/api/machineMonitoring';
import { TWaterLevelRanges } from '@/types/api/waterLevel';
import { BasicSelectOpt } from '@/types/global';
import { TChartSensor, TSensorData, TSocketGateway } from '@/types/api/socket';

import { getColorChartByThreshold } from '@/utils/functions/getColorByThreshold';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';

import TabSwitch from './TabSwitch';
import { TrendsLineChart } from './TrendsLineChart';


type Props = {
  socket: TSocketGateway | null;
  sensorOptions: BasicSelectOpt<string>[] | undefined;
  data: TChartSensor[] | undefined;
  selectedDevice: TMachineDevice | undefined;
  isLoading: Boolean;
};

const TrendsChartCard: FC<Props> = ({
  socket: gatewayDevice,
  sensorOptions,
  selectedDevice,
  isLoading,
  data,
}) => {
  const [searchRanges, setSearchRanges] = useState<TWaterLevelRanges>('DAY');

  const [selectedSensor, setSelectedSensor] =
    useState<keyof typeof ESensorMachineMonitoringEnum>('Temperature');

 const handleClickViewParameter = (view: TWaterLevelRanges) => {
    setSearchRanges(view);
  };

  useEffect(() => {
    if (!searchRanges) {
      handleClickViewParameter('DAY');
    }
  }, [searchRanges]);

  const getSensor = (sensor: string | undefined): TSensorData | undefined => {
    if (!selectedDevice) return undefined;
    if (!selectedDevice.sensorlog) return undefined;

    const res = selectedDevice?.sensorlog?.data?.find(
      (item: any) => item.sensorcode === sensor,
    );
    return res;
  };

  const chartData: ChartData<'line', number[], number> = useMemo(() => {
    const selectedDevice = getSensor(
      ESensorMachineMonitoringEnum[selectedSensor],
    );

    const DEFAULT_COLOR = getColorChartByThreshold(
      selectedDevice?.alert?.threatlevel ?? 0,
    );

    const chartSensor: TChartSensor | undefined = data?.find(
      (item) =>
        item.sensorcode === ESensorMachineMonitoringEnum[selectedSensor],
    );

    return {
      labels: chartSensor?.times ?? [],
      datasets: [
        {
          label: 'chart',
          data: chartSensor?.values ?? [],
          borderColor: DEFAULT_COLOR,
          borderWidth: 2,
          fill: true,
          pointRadius(ctx) {
            if (ctx.dataIndex === ctx.dataset.data.length - 1) {
              return 2;
            }
            return 0;
          },
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const chart = context.chart;
            const { ctx, width } = chart;
            const gradient = ctx.createLinearGradient(width * 1.5, 0, 0, 0);
            gradient.addColorStop(
              0.5,
              addAlphatoHexColor(DEFAULT_COLOR, 0.075),
            );
            gradient.addColorStop(1, addAlphatoHexColor(DEFAULT_COLOR, 0.85));
            return gradient;
          },
        },
      ],
    };
  }, [
    selectedSensor,
    data,
    gatewayDevice?.sensorlog.receivedon,
    selectedDevice,
  ]);
  const { datasets } = chartData;

  return (
    <Card className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-1">
          <SelectComponent
            onChange={(val) => setSelectedSensor(val)}
            value={selectedSensor}
            className="w-full"
            options={sensorOptions}
          />
        </div>
        <div className="flex flex-1 justify-end">
          <TabSwitch
            handleViewChange={(view) => {
              handleClickViewParameter(view);
            }}
            viewParameter={searchRanges}
          />
        </div>
      </div>

      <div className="box-border p-2 w-full h-full overflow-x-auto">
        {datasets[0]?.data && datasets[0]?.data.length > 0 ? (
          <TrendsLineChart
            chartData={chartData}
            unit={
              getSensor(ESensorMachineMonitoringEnum[selectedSensor])?.unit ??
              ''
            }
          />
        ) : (
          <p className="flex justify-center items-center h-[40px]">
            {isLoading ? 'Loading your data...' : 'Data not found'}
          </p>
        )}
      </div>
    </Card>
  );
};

export default TrendsChartCard;
