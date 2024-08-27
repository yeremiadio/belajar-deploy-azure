import { FC, useEffect, useMemo, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { cn } from '@/lib/utils';

import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetStatisticSmartPoleQuery } from '@/stores/smartPoleStore/smartPoleStoreApi';

import {
  TConcentrationEfficiency,
  TDeviceSummary,
} from '@/types/api/smartPole';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import { useBreakPoint } from '@/utils/hooks/useBreakpoint';

import { MassConcetrationEffeciencyGaugeChart } from '../MassConcetrationEffeciencyGaugeChart';
import { MassConcetrationEffeciencyLineChart } from '../MassConcetrationEffeciencyLineChart';

interface Props {}

export const StatisticCard: FC<Props> = () => {
  const language = useAppSelector(selectLanguage);

  // Shadcn Carousel API
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(1);

  const [hideDeviceSummary, setHideDeviceSummary] = useState(false);
  const [hideMassConcetrationEffeciency, setHideMassConcetrationEffeciency] =
    useState(false);

  const { lowerThanBreakpoint, greaterThanBreakpoint } = useBreakPoint(1024);

  const handleToggleDeviceSummary = () => {
    if (greaterThanBreakpoint) return;
    setHideDeviceSummary(!hideDeviceSummary);
  };

  const handleToggleMassConcetrationEffeciency = () => {
    if (greaterThanBreakpoint) return;
    setHideMassConcetrationEffeciency(!hideMassConcetrationEffeciency);
  };

  useEffect(() => {
    if (greaterThanBreakpoint) {
      setHideDeviceSummary(false);
      setHideMassConcetrationEffeciency(false);
      setCurrentSlide(1);
    }
  }, [greaterThanBreakpoint]);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { gatewayId } = useParams<'gatewayId'>();

  // fetch
  const {
    data: smartPole,
    isLoading,
    isFetching,
  } = useGetStatisticSmartPoleQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const loading = isLoading || isFetching;

  const deviceSummaryMemo = useMemo<TDeviceSummary | undefined>(() => {
    if (!smartPole) return undefined;

    const data = { ...smartPole.device_summary };
    return data;
  }, [smartPole]);

  const concentrationEffeciencyMemo = useMemo<
    TConcentrationEfficiency | undefined
  >(() => {
    if (!smartPole) return undefined;

    const data = { ...smartPole.mass_concentration_effeciency };
    return data;
  }, [smartPole]);

  return (
    <div className="flex h-fit w-full max-w-[220px] flex-col gap-3 lg:max-w-[350px]">
      {/* Device Summary Card*/}
      <Card className="z-10 border-0 bg-rs-dark-card3 backdrop-blur-[2.5px]">
        {!loading ? (
          <>
            <button
              className="flex w-full items-center justify-between bg-rs-v2-deep-indigo px-7 py-3 lg:cursor-default lg:justify-center"
              onClick={handleToggleDeviceSummary}
            >
              <p className="text-center">
                {localization('Device Summary', language)}
              </p>
              {lowerThanBreakpoint && (
                <BiChevronUp
                  className={cn('text-3xl', hideDeviceSummary && 'rotate-180')}
                />
              )}
            </button>
            <div
              className={cn(
                'grid grid-rows-[1fr] overflow-hidden px-3 py-4 transition-all ease-in-out lg:p-4',
                hideDeviceSummary && 'grid-rows-[0fr] py-0 blur-sm',
              )}
            >
              <Card
                className={cn(
                  'grid grid-cols-3 overflow-hidden rounded-md border-0 bg-rs-dark-card2 py-2 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] lg:py-4',
                  hideDeviceSummary && 'py-0',
                )}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm">
                      {localization('Active', language)}
                    </p>
                    <span className="h-1.5 w-1.5 rounded-full bg-rs-alert-green shadow-[0px_0px_7px_rgba(46,204,113,1)]" />
                  </div>
                  <p className="text-xl font-bold">
                    {deviceSummaryMemo?.total_active}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-sm">
                    {localization('Inactive', language)}
                  </p>
                  <p className="text-xl font-bold">
                    {deviceSummaryMemo?.total_inactive}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-rs-v2-red">
                  <p className="text-sm">{localization('Alert', language)}</p>
                  <p className="text-xl font-bold">
                    {deviceSummaryMemo?.total_alert}
                  </p>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <></>
        )}
      </Card>

      {/* CO2 Average Card */}
      <Card className="z-10 border-0 bg-rs-dark-card3 backdrop-blur-[2.5px]">
        {!loading ? (
          <>
            <button
              className="flex w-full items-center justify-between bg-rs-v2-deep-indigo px-7 py-3 lg:cursor-default lg:justify-center"
              onClick={handleToggleMassConcetrationEffeciency}
            >
              <p className="text-center">
                {localization('Mass Concetration Effeciency', language)}
              </p>
              {lowerThanBreakpoint && <BiChevronDown className="text-3xl" />}
            </button>
            {/* If Lower Than Breakpoint 1024px / lg --> use carousel */}
            {lowerThanBreakpoint ? (
              <>
                <Carousel setApi={setApi} className="cursor-grab">
                  <CarouselContent
                    className={cn(
                      hideMassConcetrationEffeciency
                        ? 'h-0 blur-sm'
                        : 'h-[150px]',
                      'transition-[height] ease-in-out',
                    )}
                  >
                    <CarouselItem>
                      <MassConcetrationEffeciencyGaugeChart
                        mass_concentration={
                          !!concentrationEffeciencyMemo?.chart?.value?.slice(-1)
                            ? Number(
                                concentrationEffeciencyMemo?.chart?.value?.slice(
                                  -1,
                                ),
                              )
                            : 0
                        }
                        lastUpdate={
                          concentrationEffeciencyMemo?.chart?.time
                            ?.slice(-1)
                            .toString() ?? ''
                        }
                        className="h-full translate-y-[1rem] px-10 py-2"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <div className="h-full px-5 py-3">
                        <MassConcetrationEffeciencyLineChart
                          chartData={
                            concentrationEffeciencyMemo?.chart ?? undefined
                          }
                        />
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
                <div
                  className={cn(
                    'mx-auto mb-4 flex h-1.5 justify-center gap-1.5 transition-all ease-in-out',
                    hideMassConcetrationEffeciency &&
                      'm-0 h-0 overflow-hidden blur-sm',
                  )}
                >
                  <div
                    className={cn(
                      'h-1.5 w-4 rounded-lg bg-white transition-all ease-in-out',
                      currentSlide !== 1 && 'w-1.5 bg-gray-500',
                    )}
                  />
                  <div
                    className={cn(
                      'h-1.5 w-4 rounded-lg bg-white transition-all ease-in-out',
                      currentSlide !== 2 && 'w-1.5 bg-gray-500',
                    )}
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-hidden p-4">
                <MassConcetrationEffeciencyGaugeChart
                  mass_concentration={
                    !!concentrationEffeciencyMemo?.chart?.value?.slice(-1)
                      ? Number(
                          concentrationEffeciencyMemo?.chart?.value?.slice(-1),
                        )
                      : 0
                  }
                  lastUpdate={
                    concentrationEffeciencyMemo?.chart?.time
                      ?.slice(-1)
                      .toString() ?? ''
                  }
                />
                <div className="w-full">
                  <MassConcetrationEffeciencyLineChart
                    chartData={concentrationEffeciencyMemo?.chart}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
};
