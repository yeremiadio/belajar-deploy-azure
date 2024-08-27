import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IconCloudRain } from '@/assets/images/CloudRain';
import { Card } from '@/pages/WaterLevel/_components/Card';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetRainGaugeQuery } from '@/stores/waterLevelStore/waterLevelStoreApi';
import { TRainGauge } from '@/types/api/waterLevel';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

interface Props {}

export const RainGauge: FC<Props> = () => {
  const language = useAppSelector(selectLanguage);
  const { gatewayId } = useParams<'gatewayId'>();

  const {
    data: rainGauge,
    isLoading,
    isFetching,
  } = useGetRainGaugeQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const loading = isLoading || isFetching;

  const dataMemo = useMemo<TRainGauge | undefined>(() => {
    if (!rainGauge) return undefined;

    const data = { ...rainGauge };
    return data;
  }, [rainGauge]);

  return (
    <Card border={true} title="Rain Gauge" className="h-fit">
      {!loading ? (
        <div className="box-border flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden">
          {/* content */}
          <div className="flex flex-col items-center">
            <IconCloudRain className="h-fit w-14 xl:w-20" />
            <h1 className="text-xl font-semibold xl:text-2xl">
              {dataMemo?.current_rain_bulk ?? '-'} mm
            </h1>
          </div>
          <div className="flex w-full justify-center gap-8 rounded-xl bg-rs-v2-galaxy-blue p-2 xl:gap-x-16 xl:p-4">
            <div className="flex w-fit flex-col gap-y-2 text-rs-neutral-gray-gull">
              <h4 className="whitespace-nowrap text-sm font-normal xl:text-base">
                {localization('Last Week', language)}
              </h4>
              <h3 className="text-lg font-semibold xl:text-xl">
                {dataMemo?.last_week_rain_bulk ?? '-'} mm
              </h3>
            </div>
            <div className="flex w-fit flex-col gap-y-2">
              <h4 className="whitespace-nowrap text-sm font-normal xl:text-base">
                {localization('This Week', language)}
              </h4>
              <h3 className="text-lg font-semibold xl:text-xl">
                {dataMemo?.this_week_rain_bulk ?? '-'} mm
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};
