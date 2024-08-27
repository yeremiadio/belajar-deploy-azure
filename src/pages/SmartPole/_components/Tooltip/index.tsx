import { useNavigate, useParams } from 'react-router-dom';
import { FC, HTMLAttributes, useMemo, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { ChartData, ScriptableContext } from 'chart.js';

import { cn } from '@/lib/utils';

import { ROUTES } from '@/utils/configs/route';

import { getColorChartByThreshold } from '@/utils/functions/getColorByThreshold';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import { getSensorData } from '@/utils/functions/getSensorData';

import { TGatewayDevice, TSensorData } from '@/types/api/socket';
import { TChartSensor } from '@/types/api/smartPole';

import { useGetDevicesSmartPoleChartV2Query } from '@/stores/smartPoleStore/smartPoleStoreApi';

import DropdownComponent, { IMenuDropdownItem } from '@/components/Dropdown';

import SmartPoleInformationCard from './SmartPoleInformationCard';
import { TooltipChart } from '../TooltipChart';

type Props = {
  deviceData: TGatewayDevice;
};

export const Tooltip: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  deviceData,
  className,
}) => {
  const navigate = useNavigate();
  const { gatewayId } = useParams<'gatewayId'>();
  const [selectedSensor, setSelectedSensor] = useState<string>();

  const sensorName = getSensorData(selectedSensor ?? '')?.name;

  const { data: deviceSmartPoleChartV2, isLoading } =
    useGetDevicesSmartPoleChartV2Query({
      gatewayId: Number(gatewayId),
      timeRangeHours: 24,
      id: deviceData?.id,
    });

  const getSensor = (sensor: string): TSensorData | undefined => {
    if (!deviceData) return undefined;
    if (!deviceData?.sensorlog) return undefined;

    const res = deviceData?.sensorlog?.data?.find(
      (item: any) => item?.sensorcode === sensor,
    );
    return res;
  };

  const chartData: ChartData<'line', number[], number> = useMemo(() => {
    const selectedDevice = getSensor(selectedSensor ?? '');

    const DEFAULT_COLOR = getColorChartByThreshold(
      selectedDevice?.alert?.threatlevel ?? 0,
    );

    const chartSensor: TChartSensor | undefined = deviceSmartPoleChartV2?.find(
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
  }, [selectedSensor, deviceSmartPoleChartV2, deviceData]);

  const { datasets } = chartData;

  const actionsDropdown = useMemo(() => {
    const seenSensorCodes = new Set();
    const listSensor = deviceSmartPoleChartV2
      ?.map((item, index) => {
        const { name } = getSensorData(item.sensorcode);
        if (index === 0) {
          setSelectedSensor(item?.sensorcode);
        }

        if (!seenSensorCodes.has(item.sensorcode)) {
          seenSensorCodes.add(item.sensorcode);
          return {
            label: name,
            onClick: () => setSelectedSensor(item.sensorcode),
          };
        }
        return null;
      })
      .filter((item) => !!item);

    return (listSensor ?? []) as IMenuDropdownItem[];
  }, [deviceSmartPoleChartV2]);

  return (
    <div
      className={cn(
        'z-10 min-w-[220px] flex-shrink-0 cursor-default rounded-xl bg-rs-dark-card2 p-5 backdrop-blur-[8px] md:min-w-[250px] lg:min-w-[300px]',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between border-b border-rs-v2-thunder-blue pb-2">
        <p className="text-lg font-medium uppercase">{deviceData?.name}</p>
        <span
          className="cursor-pointer whitespace-nowrap text-[10px] font-semibold text-rs-v2-mint underline xl:text-xs"
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              gatewayId
                ? ROUTES.smartPoleGatewayDetail(
                    gatewayId,
                    deviceData.id.toString(),
                  )
                : ROUTES.smartPoleDetail(deviceData.id.toString()),
            );
          }}
        >
          See Detail
        </span>
      </div>
      <div className={cn(`flex flex-col gap-y-2 `)}>
        {actionsDropdown && actionsDropdown?.length > 0 ? (
          <DropdownComponent
            menuItems={actionsDropdown}
            placeholder={sensorName ? sensorName : 'Select Sensor'}
            buttonClassName={'text-white border-none bg-rs-v2-dark-grey'}
            Icon={() => (
              <MdArrowDropDown size={18} className="ml-2 text-white" />
            )}
          />
        ) : null}
        <div>
          {datasets[0]?.data && datasets[0]?.data.length > 0 ? (
            <TooltipChart
              chartData={chartData}
              unit={getSensor(selectedSensor ?? '')?.unit ?? ''}
            />
          ) : (
            <p className="flex h-[40px] items-center justify-center">
              {isLoading ? 'Loading your data...' : 'Data not found'}
            </p>
          )}
        </div>
      </div>

      <hr className="border-width-[5px] my-2 border border-rs-v2-thunder-blue" />
      {deviceData && (
        <SmartPoleInformationCard
          isOverThreshold={deviceData.alert_status === 'alert'}
          deviceData={deviceData}
          setSelectedSensor={setSelectedSensor}
          selectedSensor={selectedSensor}
        />
      )}
    </div>
  );
};
