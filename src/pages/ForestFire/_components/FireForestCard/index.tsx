import { ChartData, ScriptableContext } from 'chart.js';
import { FC, HTMLAttributes, useMemo, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import DropdownComponent, { IMenuDropdownItem } from '@/components/Dropdown';
import { cn } from '@/lib/utils';
import { useGetForestFireDeviceDetailSensorlogQuery } from '@/stores/ewsStore/ewsForestFireStoreApi';
import {
  ESensorForestFireEnum,
  TChartSensor,
} from '@/types/api/ews/ewsForestFire';
import {
  TGatewayDevice,
  TSensorData,
  TSocketGateway,
} from '@/types/api/socket';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import convertCamelCaseToCapitalLetter from '@/utils/functions/convertCamelCaseToCapitalLetter';
import { getColorChartByThreshold } from '@/utils/functions/getColorByThreshold';

import { TooltipChart } from '../TooltipChart';
import { FireForestInformationCard } from './FireForestInformationCard';
import { ROUTES } from '@/utils/configs/route';

type Props = {
  socket: TSocketGateway | null;
  selectedDevice: TGatewayDevice;
  timeRangeHours: number;
};

export const FireForestCard: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  socket: gatewayDevice,
  selectedDevice,
  className,
  timeRangeHours,
}) => {
  const { gatewayId } = useParams<'gatewayId'>();

  const navigate = useNavigate();

  const [selectedSensor, setSelectedSensor] =
    useState<keyof typeof ESensorForestFireEnum>('Smoke');

  const { data, isLoading } = useGetForestFireDeviceDetailSensorlogQuery(
    {
      gatewayId: Number(gatewayId),
      timeRangeHours,
      id: selectedDevice.id,
    },
    {
      skip: !selectedDevice.id || !gatewayId,
    },
  );

  // options sensor
  const actionsDropdown = useMemo(() => {
    const filteredChartData = Object.keys(ESensorForestFireEnum);
    const mappedDropdown: IMenuDropdownItem[] = filteredChartData.map(
      (item) => {
        return {
          label: convertCamelCaseToCapitalLetter(item),
          onClick: () =>
            setSelectedSensor(item as keyof typeof ESensorForestFireEnum),
        };
      },
    );
    return mappedDropdown;
  }, []);

  // getSensor
  const getSensor = (sensor: string): TSensorData | undefined => {
    if (!selectedDevice) return undefined;
    if (!selectedDevice.sensorlog) return undefined;

    const res = selectedDevice?.sensorlog?.data?.find(
      (item: any) => item.sensorcode === sensor,
    );
    return res;
  };

  const chartData: ChartData<'line', number[], number> = useMemo(() => {
    const selectedDevice = getSensor(ESensorForestFireEnum[selectedSensor]);

    const DEFAULT_COLOR = getColorChartByThreshold(
      selectedDevice?.alert?.threatlevel ?? 0,
    );

    const chartSensor: TChartSensor | undefined = data?.find(
      (item) => item.sensorcode === ESensorForestFireEnum[selectedSensor],
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

  const handleSeeDetail = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    navigate(
      gatewayId
        ? ROUTES.ewsFireForestGatewayDetail(
            gatewayId,
            selectedDevice.id.toString(),
          )
        : ROUTES.ewsFireForestDetail(selectedDevice.id.toString()),
    );
  };

  return (
    <div
      className={cn(
        'z-10 w-[220px] flex-shrink-0 cursor-default rounded-xl bg-rs-dark-card2 p-5 backdrop-blur-[8px] md:min-w-[250px] lg:min-w-[300px]',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between border-b border-rs-v2-thunder-blue pb-2">
        <p className="text-lg font-medium uppercase">{selectedDevice?.name}</p>
        <span
          className="cursor-pointer whitespace-nowrap text-[10px] font-semibold text-rs-v2-mint underline xl:text-xs"
          onClick={(e) => handleSeeDetail(e)}
        >
          See Detail
        </span>
      </div>

      <div className={cn(`flex flex-col gap-y-2 `)}>
        {actionsDropdown ? (
          <DropdownComponent
            menuItems={actionsDropdown}
            placeholder={convertCamelCaseToCapitalLetter(selectedSensor)}
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
              unit={
                getSensor(ESensorForestFireEnum[selectedSensor])?.unit ?? ''
              }
            />
          ) : (
            <p className="flex h-[40px] items-center justify-center">
              {isLoading ? 'Loading your data...' : 'Data not found'}
            </p>
          )}
        </div>
      </div>
      <hr className="border-width-[5px] my-2 border border-rs-v2-thunder-blue" />
      {selectedDevice && (
        <FireForestInformationCard
          device={selectedDevice}
          setSelectedSensor={setSelectedSensor}
          selectedSensor={selectedSensor}
        />
      )}
    </div>
  );
};
