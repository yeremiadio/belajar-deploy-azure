import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IconAmount } from '@/assets/images/Amount';
import { IconArrow } from '@/assets/images/Arrow';
import { cn } from '@/lib/utils';
import { Card } from '@/pages/EnergyMeter/_components/Card';
import { selectToggleCopilot } from '@/stores/copilotStore/toggleCopilotSlice';
import { useGetEnergyMeterTodaySummaryQuery } from '@/stores/energyMeterStore/energyMeterStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { TTodaySummary } from '@/types/api/energyMeter';
import { localization } from '@/utils/functions/localization';
import { numberWithCommas } from '@/utils/functions/numberWithCommas';
import useAppSelector from '@/utils/hooks/useAppSelector';

interface Props {}

export const Summary: FC<Props> = () => {
  const language = useAppSelector(selectLanguage);
  const toggleCopilot = useAppSelector(selectToggleCopilot);
  const { gatewayId } = useParams<'gatewayId'>();

  const {
    data: todaySummary,
    isLoading,
    isFetching,
  } = useGetEnergyMeterTodaySummaryQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const loading = isLoading || isFetching;

  const dataMemo = useMemo<TTodaySummary | undefined>(() => {
    if (!todaySummary) return undefined;

    const data = { ...todaySummary };
    return data;
  }, [todaySummary]);

  return (
    <Card border={true} title="Today Spending">
      {!loading ? (
        <div className="box-border flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-rs-v2-galaxy-blue p-4">
          <div className="flex flex-col gap-3">
            <div className="w-full">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full bg-gradient-green-1',
                  toggleCopilot
                    ? '2xl:w-15 xl:h-12 xl:w-14 2xl:h-14'
                    : '2xl:w-15 xl:h-12 xl:w-14 2xl:h-14',
                )}
              >
                <IconAmount
                  className={cn(
                    '3-5 w-3',
                    toggleCopilot
                      ? 'xl:h-6 xl:w-6 2xl:h-8 2xl:w-8'
                      : 'xl:h-6 xl:w-6 2xl:h-8 2xl:w-8',
                  )}
                />
              </div>
            </div>
            <div
              className={cn(
                'flex w-full flex-col gap-y-2',
                toggleCopilot
                  ? 'xl:flex-col'
                  : 'xl:flex-row xl:items-end xl:justify-between xl:gap-y-0',
              )}
            >
              <div>
                <h3
                  className={cn(
                    'text-sm font-medium',
                    toggleCopilot
                      ? '2xl:text-md xl:text-sm'
                      : 'xl:text-sm 2xl:text-lg',
                  )}
                >
                  {localization('Spending Amount', language)}
                </h3>
                <h2
                  className={cn(
                    'text-xl font-bold',
                    toggleCopilot
                      ? 'xl:text-2xl 2xl:text-2xl'
                      : 'xl:text-2xl 2xl:text-3xl',
                  )}
                >
                  {numberWithCommas(dataMemo?.spend_amount ?? 0)} IDR
                </h2>
              </div>
              {dataMemo?.amount_percentage && (
                <div
                  className={cn(
                    'mb-1 flex w-fit items-center gap-2 rounded-full px-3 py-1',
                    dataMemo.amount_percentage > 0
                      ? 'bg-rs-v2-red'
                      : dataMemo.amount_percentage === 0
                        ? 'bg-rs-neutral-chromium'
                        : 'bg-rs-alert-green',
                  )}
                >
                  <span
                    className={cn(
                      'text-base font-medium',
                      toggleCopilot
                        ? 'xl:text-xl 2xl:text-xl'
                        : 'xl:text-2xl 2xl:text-2xl',
                    )}
                  >
                    {dataMemo?.amount_percentage}%
                  </span>
                  {dataMemo.amount_percentage !== 0 && (
                    <IconArrow
                      className={cn(
                        'h-2 w-2 xl:h-3 xl:w-3 2xl:h-4 2xl:w-4',
                        dataMemo.amount_percentage > 0 && 'rotate-180',
                      )}
                    />
                  )}
                </div>
              )}
            </div>
            <hr className="w-full border-[1px] border-rs-v2-gunmetal-blue" />
            <div className="w-full">
              <h3
                className={cn(
                  'text-sm font-medium',
                  toggleCopilot
                    ? '2xl:text-md xl:text-base'
                    : 'xl:text-lg 2xl:text-lg',
                )}
              >
                {localization('Total Usage', language)}
              </h3>
              <h2
                className={cn(
                  'text-xl font-bold',
                  toggleCopilot
                    ? 'xl:text-2xl 2xl:text-2xl'
                    : 'xl:text-3xl 2xl:text-3xl',
                )}
              >
                {dataMemo?.total_usage} kWh
              </h2>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};
