import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LineChart } from '@/components/Chart/LineChart';

import { cn } from '@/lib/utils';

import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetAirQualityDeviceSmartPoleQuery } from '@/stores/smartPoleStore/smartPoleStoreApi';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

interface Props {}

export const AirQualityIndex: FC<Props> = () => {
  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const language = useAppSelector(selectLanguage);

  const { width } = useWindowDimensions();

  // tabs
  const tabs = useMemo(() => {
    return [
      {
        label: 'Gas',
        value: 'gas',
      },
      {
        label: 'PM',
        value: 'pm',
      },
      {
        label: 'Ozon',
        value: 'ozon',
      },
    ];
  }, []);
  const [tabActive, setTabActive] = useState<string>('pm');

  // redux
  const {
    data: airQualityIndexList,
    isLoading,
    isFetching,
  } = useGetAirQualityDeviceSmartPoleQuery(
    {
      id: smart_pole_id ? Number(smart_pole_id) : undefined,
      gatewayId: gatewayId ? Number(gatewayId) : undefined,
    },
    {
      skip: !smart_pole_id || !gatewayId,
    },
  );
  const loading = isLoading || isFetching;

  const dataMemo = useMemo(() => {
    if (!airQualityIndexList || airQualityIndexList.length === 0) return [];

    const data = airQualityIndexList.slice(-5);
    return data;
  }, [airQualityIndexList]);

  const dataChart = {
    labels: dataMemo?.map((item) => item.time) ?? [],
    datasets: [
      {
        label: 'PM10',
        data: dataMemo?.map((item) => item.air_quality.pm10) ?? [],
        backgroundColor: '#36E2D7',
        borderColor: '#36E2D7',
        borderWidth: 1,
        pointRadius: 4,
      },
      {
        label: 'PM2.5',
        data: dataMemo?.map((item) => item.air_quality.pm2_5) ?? [],
        backgroundColor: '#F98080',
        borderColor: '#F98080',
        borderWidth: 1,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="box-border flex h-[300px] flex-col overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-6 xl:h-auto">
      <div className="mb-2 flex items-start justify-between ">
        <h1 className="text-lg font-medium text-rs-neutral-silver-lining md:text-xl 2xl:text-2xl">
          {localization('Air Quality Index', language)}
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
        <div className="box-border h-full w-full overflow-hidden overflow-x-auto">
          {/* content */}
          <LineChart
            data={dataChart}
            options={{
              plugins: {
                title: {
                  display: false,
                },
                legend: {
                  display: true,
                  position: 'bottom',
                  align: 'center',
                  labels: {
                    font: {
                      family: 'Plus Jakarta Sans',
                      size:
                        width >= 1440 && width < 1620
                          ? 14
                          : width >= 1620 && width < 1920
                            ? 18
                            : width >= 1920
                              ? 24
                              : 12,
                    },
                    boxHeight: 4,
                    boxWidth: 4,
                    pointStyle: 'circle',
                    usePointStyle: true,
                  },
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
                      return `${label}: ${value}`;
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
                      return `${value}`;
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
