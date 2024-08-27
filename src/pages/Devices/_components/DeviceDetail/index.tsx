import { ChartData, ScriptableContext } from 'chart.js';
import {
  CSSProperties,
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { IconClose } from '@/assets/images/Close';
import DropdownComponent, { IMenuDropdownItem } from '@/components/Dropdown';
import { useGetEnergyMeterDeviceDetailSensorLogQuery } from '@/stores/energyMeterStore/energyMeterStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { ESensorEnergyMeterEnum, TChartSensor } from '@/types/api/energyMeter';
import {
  TGatewayDevice,
  TSensorData,
  TSocketGateway,
} from '@/types/api/socket';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import convertCamelCaseToCapitalLetter from '@/utils/functions/convertCamelCaseToCapitalLetter';
import { getColorChartByThreshold } from '@/utils/functions/getColorByThreshold';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

import { DeviceDetailChart } from '../DeviceDetailChart';
import { DeviceInformation } from '../DeviceInformation';

interface Props {
  style?: CSSProperties | undefined;
  toogle: Dispatch<SetStateAction<boolean>>;
  selectedDevice: TGatewayDevice | undefined;
  socket: TSocketGateway | null;
  timeRangeHours: number;
  handleDeleteParams: () => void;
}

export const DeviceDetail: FC<Props> = ({
  style,
  toogle,
  selectedDevice,
  socket: gatewayDevice,
  timeRangeHours,
  handleDeleteParams,
}) => {
  const language = useAppSelector(selectLanguage);
  const { gatewayId } = useParams<'gatewayId'>();

  const [selectedSensor, setSelectedSensor] =
    useState<keyof typeof ESensorEnergyMeterEnum>('Energy Delivered');

  const { data, isLoading } = useGetEnergyMeterDeviceDetailSensorLogQuery(
    {
      id: selectedDevice?.id,
      gatewayId: Number(gatewayId),
      timeRangeHours,
    },
    {
      skip: !gatewayId || !selectedDevice,
    },
  );

  // options sensor
  const actionsDropdown = useMemo(() => {
    const filteredChartData = Object.keys(ESensorEnergyMeterEnum);
    const mappedDropdown: IMenuDropdownItem[] = filteredChartData.map(
      (item) => {
        return {
          label: convertCamelCaseToCapitalLetter(item),
          onClick: () =>
            setSelectedSensor(item as keyof typeof ESensorEnergyMeterEnum),
        };
      },
    );
    return mappedDropdown;
  }, []);

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

  const chartData: ChartData<'line', number[], number> = useMemo(() => {
    const selectedDevice = getSensor(ESensorEnergyMeterEnum[selectedSensor]);

    const DEFAULT_COLOR = getColorChartByThreshold(
      selectedDevice?.alert?.threatlevel ?? 0,
    );

    const chartSensor: TChartSensor | undefined = data?.find(
      (item) => item.sensorcode === ESensorEnergyMeterEnum[selectedSensor],
    );

    const selectedData = {
      labels: chartSensor?.times ?? [],
      datasets: [
        {
          label: 'chart',
          data: chartSensor?.values ?? [],
          borderColor: DEFAULT_COLOR,
          borderWidth: 1,
          pointRadius: 0,
          fill: true, // Set fill to true to enable the backgroundColor under the line
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
    return selectedData;
  }, [
    selectedSensor,
    data,
    gatewayDevice?.sensorlog.receivedon,
    selectedDevice,
  ]);
  const { datasets } = chartData;

  return (
    <div
      className="absolute left-1/2 top-1/2 box-border flex w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-hidden overflow-y-auto rounded-xl border-[1px] border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-6 md:relative md:left-0 md:top-0 md:ml-6 md:w-[50%] md:translate-x-0 md:translate-y-0 lg:w-[30%] lg:overflow-y-auto xl:w-[40%] "
      style={{ ...style }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex w-full items-start justify-between">
        <div>
          <h1 className="text-lg font-medium md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
            {selectedDevice?.name ?? '-'}
          </h1>
          <h3 className="text-sm font-normal md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
            {localization('Location', language)}:{' '}
            <span className="font-bold">
              {selectedDevice?.location?.name ?? '-'}
            </span>
          </h3>
        </div>
        <IconClose
          className="h-4 w-4 cursor-pointer"
          onClick={() => {
            toogle(false);
            handleDeleteParams();
          }}
        />
      </div>
      <div className="w-full">
        <div className="mb-2 w-fit px-2 pb-[7px] pt-[3px] md:px-[10px] 2xl:mb-6">
          {actionsDropdown ? (
            <DropdownComponent
              menuItems={actionsDropdown}
              placeholder={convertCamelCaseToCapitalLetter(selectedSensor)}
              buttonClassName={'text-rs-v2-mint border-none bg-rs-v2-dark-grey'}
              Icon={() => (
                <MdArrowDropDown size={18} className="ml-2 text-rs-v2-mint" />
              )}
            />
          ) : null}
        </div>
        {datasets[0]?.data && datasets[0]?.data.length > 0 ? (
          <DeviceDetailChart
            chartData={chartData}
            unit={getSensor(ESensorEnergyMeterEnum[selectedSensor])?.unit ?? ''}
          />
        ) : (
          <p className="flex h-[80px] items-center justify-center">
            {isLoading ? 'Loading your data...' : 'Data not found'}
          </p>
        )}
      </div>
      {selectedDevice && <DeviceInformation selectedDevice={selectedDevice} />}
    </div>
  );
};
