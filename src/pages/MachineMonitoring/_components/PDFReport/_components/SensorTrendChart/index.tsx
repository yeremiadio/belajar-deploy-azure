import { FC, useMemo } from 'react';
import { ChartData, ScriptableContext } from 'chart.js';

import Card from '@/components/Card';

import { TChartSensor, TSensorData, TSocketGateway } from '@/types/api/socket';
import {
  ESensorMachineMonitoringEnum,
  TMachineDevice,
} from '@/types/api/machineMonitoring';

import { getColorChartByThreshold } from '@/utils/functions/getColorByThreshold';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';

import { TrendsLineChart } from './TrendsLineChart';

type Props = {
  socket: TSocketGateway | null;
  data: TChartSensor[] | undefined;
  selectedDevice: TMachineDevice | undefined;
  isLoading: Boolean;
  selectedSensor: string;
};

const TrendsChartCard: FC<Props> = ({
  socket: gatewayDevice,
  selectedSensor,
  selectedDevice,
  isLoading,
  data,
}) => {

  const getSensor = (sensor: string | undefined): TSensorData | undefined => {
    if (!selectedDevice) return undefined;
    if (!selectedDevice.sensorlog) return undefined;

    const res = selectedDevice?.sensorlog?.data?.find(
      (item: TSensorData) => item.sensorcode === sensor,
    );
    return res;
  };

  const chartData: ChartData<'line', number[], number> = useMemo(() => {
    const selectedDevice = getSensor(selectedSensor);
    const DEFAULT_COLOR = getColorChartByThreshold(
      selectedDevice?.alert?.threatlevel ?? 0,
    );

    const chartSensor: TChartSensor | undefined = data?.find(
      (item) => item.sensorcode === selectedSensor,
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
              return 1;
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

  const sensorLabel = (sensorCode: string) => {
    const key = Object.keys(ESensorMachineMonitoringEnum).find(
      (key) => ESensorMachineMonitoringEnum[key as keyof typeof ESensorMachineMonitoringEnum] === sensorCode
    );
    return key || 'Unknown Sensor'; // Return a default value or handle the unknown sensor case
  };

  return (
    <Card className="bg-transparent p-5 border-rs-neutral-gray-gull w-full h-full">
      <h1 className="mt-[-15px] pl-5 text-lg text-rs-green-header">
        {sensorLabel(selectedSensor)}
      </h1>
      <div className="flex justify-center items-center h-full">
        <div className="p-3 w-full max-w-3xl">
          {datasets[0]?.data && datasets[0]?.data.length > 0 ? (
            <TrendsLineChart
              chartData={chartData}
              unit={getSensor(selectedSensor)?.unit ?? ''}
            />
          ) : (
            <p className="flex justify-center items-center h-[40px]">
              {isLoading ? 'Loading your data...' : 'Data not found'}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TrendsChartCard;
