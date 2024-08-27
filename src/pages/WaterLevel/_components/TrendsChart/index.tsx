import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import SelectComponent from '@/components/Select';

import TabSwitch from '@/pages/WaterLevel/_components/TabSwitch';

import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetWaterlevelTrendStatisticQuery } from '@/stores/waterLevelStore/waterLevelStoreApi';

import { TWaterLevelRanges } from '@/types/api/waterLevel';
import { BasicSelectOpt } from '@/types/global';
import { TSocketGateway } from '@/types/api/socket';

import useWaterLevelDeviceOptions from '@/utils/hooks/selectOptions/useWaterLevelDeviceOptions';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

import TrendsLineChart from './TrendsLineChart';
import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';

type Props = {
  socket: TSocketGateway | null;
  deviceLocationList?: IDeviceLocationWaterLevelObj[];
};

const TrendsChartCard: FC<Props> = ({ socket, deviceLocationList }) => {
  const language = useAppSelector(selectLanguage);
  const [searchRanges, setSearchRanges] = useState<TWaterLevelRanges>('DAY');
  const { gatewayId } = useParams<'gatewayId'>();

  const { dataOptions, isLoading: isLoadingWaterLevelOptions } =
    useWaterLevelDeviceOptions({ gatewayId: Number(gatewayId) });
  const filteredOptions = dataOptions?.filter(
    (option) => option.value === 'wlvl',
  );
  const [selectedSensor, setSelectedSensor] = useState<BasicSelectOpt<string>>({
    value: 'wlvl',
    label: 'Water Level',
  });
  const { data: trendData, refetch } = useGetWaterlevelTrendStatisticQuery({
    range: searchRanges,
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
    sensorcode: selectedSensor?.value,
  });

  useEffect(() => {
    if (!socket) return;
    refetch();
  }, [socket, refetch]);

  const handleClickViewParameter = (view: TWaterLevelRanges) => {
    setSearchRanges(view);
  };

  useEffect(() => {
    if (!searchRanges) {
      handleClickViewParameter('DAY');
    }
  }, [searchRanges]);

  useEffect(() => {
    if (dataOptions && dataOptions.length > 0) {
      setSelectedSensor(dataOptions[0]);
    } else {
      setSelectedSensor({ value: 'wlvl', label: 'Water Level' });
    }
  }, [isLoadingWaterLevelOptions]);

  return (
    <Card className="flex h-full w-full flex-col gap-4 p-5">
      <div className="x-1 flex flex-row flex-wrap justify-start gap-2 md:justify-between">
        <div className="flex items-center gap-4 p-0">
          <h1 className="text-xl">{localization('Trends', language)}</h1>
          <SelectComponent
            onChange={(val) => setSelectedSensor(val)}
            value={selectedSensor}
            className="w-[60px]"
            options={filteredOptions}
            loading={isLoadingWaterLevelOptions}
          />
        </div>
        <div className="flex flex-1 flex-wrap justify-end gap-2">
          <TabSwitch
            handleViewChange={(view) => {
              handleClickViewParameter(view);
            }}
            viewParameter={searchRanges}
          />
        </div>
      </div>

      <div className="box-border h-full w-full overflow-x-auto p-2">
        {trendData && (
          <TrendsLineChart
            data={trendData}
            searchRanges={searchRanges}
            devicesList={deviceLocationList}
          />
        )}
      </div>
    </Card>
  );
};

export default TrendsChartCard;
