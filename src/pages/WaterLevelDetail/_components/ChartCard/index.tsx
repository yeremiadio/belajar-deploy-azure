import { ChartData, ScriptableContext } from 'chart.js';
import { FC, useMemo, useState } from 'react';

import Card from '@/components/Card';
import SelectComponent from '@/components/Select';

import { cn } from '@/lib/utils';

import { useGetDevicesSmartPoleChartV2Query } from '@/stores/smartPoleStore/smartPoleStoreApi';

import { TChartSensor } from '@/types/api/energyMeter';
import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';

import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import { getColorChartByThreshold } from '@/utils/functions/getColorByThreshold';
import { getSensorData } from '@/utils/functions/getSensorData';

import { Chart } from '../Chart';

type Props = {
  deviceData?: IDeviceLocationWaterLevelObj;
  gatewayId?: string;
};

const timeOptions = [
  {
    label: 'Day',
    value: 24,
  },
  {
    label: 'Month',
    value: 720,
  },
  {
    label: 'Year',
    value: 8640,
  },
];

const ChartCard: FC<Props> = ({ deviceData, gatewayId }) => {
  const deviceDataWaterLevel = deviceData?.device_summary;
  const customSelectStyles =
    'relative h-fit [&_.rc-select-selector]:!min-h-0 [&_.rc-select-selector]:!py-[7px] [&_.rc-select-selector]:!ps-[15px] [&_.rc-select-selector]:!bg-rs-v2-dark-grey [&_.rc-select-selector]:!border [&_.rc-select-selector]:text-rs-v2-mint [&_.rc-select-selector]:!border-rs-v2-dark-grey [&_.rc-select-selector]:hover:!border-rs-v2-mint [&_.rc-select-selector]:!pe-[35px] [&_.rc-select-selection-placeholder]:!top-[7.5px] [&_.rc-select-selection-item]:!top-[7.5px] [&_.rc-select-arrow]:py-0 [&_.rc-select-arrow]:pt-[7px] [&_.rc-select-arrow]:px-0 [&_.rc-select-arrow]:pe-[8px] [&_.rc-select-arrow]:text-rs-v2-mint w-fit';

  const [selectedTrend, setSelectedTrend] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<number | null>(
    timeOptions[0]?.value,
  );

  const { data: deviceSmartPoleChartV2, isLoading } =
    useGetDevicesSmartPoleChartV2Query(
      {
        gatewayId: Number(gatewayId),
        timeRangeHours: selectedTime ?? 24,
        id: Number(deviceDataWaterLevel?.id),
      },
      {
        skip: !deviceDataWaterLevel || !deviceData || !gatewayId,
      },
    );

  const dropdownOptions = useMemo(
    () => [{ label: 'Water Level Trend', value: 'wlvl' }],
    [],
  );

  const chartData: ChartData<'line', number[], number> = useMemo(() => {
    const DEFAULT_COLOR = getColorChartByThreshold(
      deviceDataWaterLevel?.alert?.alert.threatlevel ?? 0,
    );

    const chartSensor: TChartSensor | undefined = deviceSmartPoleChartV2?.find(
      (item) => item.sensorcode === selectedTrend,
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
  }, [selectedTrend, deviceSmartPoleChartV2, deviceData]);

  const { datasets } = chartData;

  return (
    <Card className="overflow-hidden px-4 py-5">
      <div className="flex h-full flex-col">
        <div className="mt-3 flex items-center justify-between gap-5">
          <SelectComponent
            popupContainer="body"
            value={selectedTrend}
            onChange={(value) => setSelectedTrend(value)}
            containerClassName={customSelectStyles}
            options={dropdownOptions}
            showSearch={false}
            loading={isLoading}
          />

          <div className="flex gap-1.5">
            {timeOptions.map((timeOption) => {
              const selected = timeOption.value === selectedTime;

              return (
                <button
                  key={timeOption.value}
                  className={cn(
                    'text-sm text-rs-v2-light-grey',
                    selected && 'bg-rs-v2-dark-grey text-rs-v2-mint',
                    'rounded-md px-4 py-2',
                    'hover:text-rs-v2-mint',
                  )}
                  type="button"
                  onClick={() => setSelectedTime(timeOption.value)}
                >
                  {timeOption.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-full w-full">
          {datasets[0]?.data && datasets[0]?.data.length > 0 ? (
            <Chart
              chartData={chartData}
              unit={getSensorData('wlvl').unit}
              timeRange={selectedTime ?? 24}
            />
          ) : (
            <p className="flex h-[40px] items-center justify-center">
              {isLoading ? 'Loading your data...' : 'Data not found'}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChartCard;
