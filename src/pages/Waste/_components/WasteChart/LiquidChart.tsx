import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import SelectComponent from '@/components/Select';

import TrendsLineChart from '@/pages/Waste/_components/TrendsChart/TrendsLineChart';

import { useGetWasteMonitoringSensorlogQuery } from '@/stores/wasteMonitoringStore';

import { TChartRanges } from '@/types/api';
import { TGatewayDevice } from '@/types/api/socket';
import { ESensorLiquidWasteEnum, TWasteDevice } from '@/types/api/wasteMonitoring';

import { getSensorData } from '@/utils/functions/getSensorData';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import TabSwitch from './TabSwitch';


type Props = {
  deviceIds: number[];
  gatewayDevice: TGatewayDevice | null;
  deviceList: TWasteDevice[];
};

const LiquidChartCard: FC<Props> = ({deviceIds, deviceList}) => {
  const [searchRanges, setSearchRanges] = useState<TChartRanges>('WEEK');
  const { gatewayId } = useParams<'gatewayId'>();
  const [selectedSensor, setSelectedSensor] = useState<string>('wlvl');
  
  const LiquidWasteOptions = Object.keys(ESensorLiquidWasteEnum).map((key) => ({
    label: key,
    value: ESensorLiquidWasteEnum[key as keyof typeof ESensorLiquidWasteEnum],
  }));  

  const customSelectStyles =
    'relative h-fit [&_.rc-select-selection-placeholder]:!text-white [&_.rc-select-selector]:!min-h-0 [&_.rc-select-selector]:!py-[7px] [&_.rc-select-selector]:!text-xs [&_.rc-select-selector]:!text-rs-v2-mint [&_.rc-select-selector]:!ps-[15px] [&_.rc-select-selector]:!bg-rs-v2-dark-grey [&_.rc-select-selector]:!border [&_.rc-select-selector]:hover:!border-rs-v2-dark-grey [&_.rc-select-selector]:!pe-[35px] [&_.rc-select-selection-placeholder]:!top-[5.5px] [&_.rc-select-selection-item]:!top-[7.5px] [&_.rc-select-arrow]:py-0 [&_.rc-select-arrow]:pt-[5px] [&_.rc-select-arrow]:px-0 [&_.rc-select-arrow]:pe-[8px]';

  const handleClickViewParameter = (view: TChartRanges) => {
    setSearchRanges(view);
  };

  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;
  }, [gatewayDevice, gatewayId]);

  const { data: trendData, refetch } = useGetWasteMonitoringSensorlogQuery({
    gatewayId: Number(gatewayId),
    range: searchRanges,
    deviceIds:deviceIds
  });

  const sensorData = trendData?.filter((data) => data.sensorcode === selectedSensor);
  const { unit } = getSensorData(selectedSensor);
  const totalValue = sensorData?.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    if (!gatewayDevice) return;
    refetch();
  }, [gatewayDevice, refetch]);
 

  useEffect(() => {
    if (!searchRanges) {
      handleClickViewParameter('WEEK');
    }
  }, [searchRanges]);

 
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-1">
          <SelectComponent
            onChange={(val) => setSelectedSensor(val)}
            value={selectedSensor}
            popupContainer="parent"
            className="w-full"
            containerClassName={customSelectStyles}
            options={LiquidWasteOptions}
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
      <div className="flex flex-row justify-between items-center">
        <span className="text-rs-neutral-gray-gull text-sm">Current Total</span>
        <span>{totalValue} {unit}</span>
      </div>
      <div className="box-border w-full">
        {trendData ? (
          <TrendsLineChart
            data={sensorData}
            searchRanges={searchRanges}
            devicesList={deviceList}
            unit={unit}
          />
        ) : (
          <p className="flex justify-center items-center h-[40px]">
            {'Data not found'}
          </p>
        )}
      </div>
    </div>
  );
};

export default LiquidChartCard;
