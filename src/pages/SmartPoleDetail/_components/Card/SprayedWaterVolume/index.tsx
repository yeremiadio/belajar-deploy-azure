import { ScriptableContext } from 'chart.js';
import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BarChart } from '@/components/Chart/BarChart';
import { cn } from '@/lib/utils';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import {
    useGetSprayWaterVolumeDeviceSmartPoleQuery
} from '@/stores/smartPoleStore/smartPoleStoreApi';
import { DateFilterChartEnum } from '@/types/api';
import { TSprayedWaterVolumeSmartPole } from '@/types/api/smartPole';
import { extractColorsFromLinearGradient } from '@/utils/functions/extractColorsFromLinearGradient';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

interface Props {}

export const SprayedWaterVolume: FC<Props> = () => {
  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const language = useAppSelector(selectLanguage);

  const { width } = useWindowDimensions();

  // tabs
  const tabs = useMemo<
    Array<{ label: string; value: DateFilterChartEnum }>
  >(() => {
    return [
      {
        label: 'Today',
        value: DateFilterChartEnum.Today,
      },
      {
        label: 'Month',
        value: DateFilterChartEnum.Month,
      },
      {
        label: 'Year',
        value: DateFilterChartEnum.Year,
      },
    ];
  }, []);
  const [tabActive, setTabActive] = useState<DateFilterChartEnum>(
    DateFilterChartEnum.Today,
  );

  // fetch
  const {
    data: sprayedWaterVolume,
    isLoading,
    isFetching,
  } = useGetSprayWaterVolumeDeviceSmartPoleQuery({
    id: smart_pole_id ?? '',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
    filterData: tabActive ?? undefined,
  });
  const loading = isLoading || isFetching;

  const dataMemo = useMemo<TSprayedWaterVolumeSmartPole | undefined>(() => {
    if (!sprayedWaterVolume) return undefined;

    const data = {
      time: sprayedWaterVolume.time.slice(-5),
      value: sprayedWaterVolume.value.slice(-5),
    };
    return data;
  }, [sprayedWaterVolume]);

  const dataChart = {
    labels: dataMemo?.time ?? [],
    datasets: [
      {
        label: 'SPRAYED WATER VOLUME',
        data: dataMemo?.value ?? [],
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const chart = context.chart;
          const { ctx } = chart;
          const gradientValue =
            'linear-gradient(180deg, #3A7BD5 0%, #00D2FF 100%)';
          const [startColor, endColor] =
            extractColorsFromLinearGradient(gradientValue);
          const gradient = ctx.createLinearGradient(0, 150, 200, 150);
          gradient.addColorStop(1, endColor);
          gradient.addColorStop(0.5, startColor);
          return gradient;
        },
      },
    ],
  };

  return (
    <div className="box-border flex h-[300px] flex-col overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-6 xl:h-auto">
      <div className="mb-2 flex items-start justify-between">
        <h1 className="text-lg font-medium text-rs-neutral-silver-lining md:text-xl 2xl:text-2xl">
          {localization('Sprayed Water Volume', language)}
        </h1>
        <div className="flex items-center gap-2">
          {tabs.map((item, index: number) => (
            <div
              key={index}
              className={cn(
                'cursor-pointer px-2 pb-[7px] pt-[3px] md:px-[10px]',
                tabActive === item.value && 'rounded-md bg-rs-v2-dark-grey',
              )}
              onClick={() => {
                setTabActive(item.value);
              }}
            >
              <span
                className={cn(
                  'whitespace-nowrap text-[10px] font-medium md:text-xs 2xl:text-sm',
                  tabActive === item.value
                    ? 'text-rs-v2-mint'
                    : 'text-rs-v2-light-grey',
                )}
              >
                {localization(item.label, language)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {!loading ? (
        <div className="box-border h-full w-full overflow-hidden">
          {/* content */}
          <BarChart
            data={dataChart}
            options={{
              plugins: {
                title: {
                  display: false,
                },
                legend: {
                  display: false,
                },
                datalabels: {
                  display: false,
                },
                tooltip: {
                  bodyFont: {
                    size:
                      width >= 1440 && width < 1620
                        ? 16
                        : width >= 1620 && width < 1920
                          ? 20
                          : width >= 1920
                            ? 26
                            : 12,
                  },
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.label;
                      const value = tooltipItem.formattedValue;
                      return `${label}: ${value} L`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    font: {
                      size:
                        width >= 1620 && width < 1920
                          ? 14
                          : width >= 1920
                            ? 16
                            : 12,
                    },
                  },
                },
                y: {
                  min: 0,
                  grid: {
                    display: true,
                    tickWidth: 0,
                    color: '#2C394A',
                    lineWidth: 2,
                  },
                  ticks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    callback: (value: any) => {
                      return `${value} L`;
                    },
                    // stepSize: 10,
                    font: {
                      size:
                        width >= 1620 && width < 1920
                          ? 14
                          : width >= 1920
                            ? 16
                            : 12,
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
