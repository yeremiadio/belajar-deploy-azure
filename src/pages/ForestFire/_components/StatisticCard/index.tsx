import { FC, useEffect, useState } from 'react';
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
import { useGetForestFireStatisticQuery } from '@/stores/ewsStore/ewsForestFireStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetSensorlogSummariesQuery } from '@/stores/sensorlogSummariesStore/sensorlogSummariesStoreApi';
import { TSocketGateway } from '@/types/api/socket';
import { localization } from '@/utils/functions/localization';
import {
  filteredWhiskerDataObjects,
  whiskerData,
} from '@/utils/functions/sanitizeDataWhiskerChart';
import useAppSelector from '@/utils/hooks/useAppSelector';
import { useBreakPoint } from '@/utils/hooks/useBreakpoint';

import Co2BoxPlotChart from '../Co2BoxPlotChart';
import Co2DoughnutChart from '../Co2DoughnutChart';

type Props = {
  socket: TSocketGateway | null;
};

export const StatisticCard: FC<Props> = ({ socket }) => {
  const { gatewayId } = useParams<'gatewayId'>();
  const language = useAppSelector(selectLanguage);

  // Shadcn Carousel API
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(1);

  const [hideDeviceSummary, setHideDeviceSummary] = useState(false);
  const [hideSensorSummaries, setHideSensorSummaries] = useState(false);

  const { lowerThanBreakpoint, greaterThanBreakpoint } = useBreakPoint(1024);

  const { data, refetch } = useGetForestFireStatisticQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  const DEFAULT_TYPE = 'WEEK';
  const { data: sensorlogSummariesData, refetch: refetchSensorlogSummaries } =
    useGetSensorlogSummariesQuery({
      type: DEFAULT_TYPE,
      gatewayId: Number(gatewayId),
    });

  // re-assign value websocket to redux
  useEffect(() => {
    if (!socket) return;
    refetch();
    refetchSensorlogSummaries();
  }, [socket, refetch, refetchSensorlogSummaries]);

  const filteredSensorLogSummaries = filteredWhiskerDataObjects(
    sensorlogSummariesData ?? [],
    'smke',
  );
  // console.log({ filteredSensorLogSummaries });

  const whiskerSensorlogSummaries = whiskerData(filteredSensorLogSummaries, {
    type: DEFAULT_TYPE,
  });
  // console.log({ whiskerSensorlogSummaries });

  const handleToggleDeviceSummary = () => {
    if (greaterThanBreakpoint) return;
    setHideDeviceSummary(!hideDeviceSummary);
  };

  const handleToggleCO2Average = () => {
    if (greaterThanBreakpoint) return;
    setHideSensorSummaries(!hideSensorSummaries);
  };

  useEffect(() => {
    if (greaterThanBreakpoint) {
      setHideDeviceSummary(false);
      setHideSensorSummaries(false);
      setCurrentSlide(1);
    }
  }, [greaterThanBreakpoint]);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex h-fit w-full max-w-[220px] flex-col gap-3 lg:max-w-[350px]">
      {/* Device Summary Card*/}
      <Card className="z-10 border-0 bg-rs-dark-card3 backdrop-blur-[2.5px]">
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
                <p className="text-sm">{localization('Active', language)}</p>
                <span className="h-1.5 w-1.5 rounded-full bg-rs-alert-green shadow-[0px_0px_7px_rgba(46,204,113,1)]" />
              </div>
              <p className="text-xl font-bold">
                {data?.device_summary.total_active ?? '-'}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm">{localization('Inactive', language)}</p>
              <p className="text-xl font-bold">
                {data?.device_summary.total_inactive ?? '-'}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-rs-v2-red">
              <p className="text-sm">{localization('Alert', language)}</p>
              <p className="text-xl font-bold">
                {data?.device_summary.total_alert ?? '-'}
              </p>
            </div>
          </Card>
        </div>
      </Card>

      {/* Sensor Summaries Card */}
      <Card className="z-10 border-0 bg-rs-dark-card3 backdrop-blur-[2.5px]">
        <button
          className="flex w-full items-center justify-between bg-rs-v2-deep-indigo px-7 py-3 lg:cursor-default lg:justify-center"
          onClick={handleToggleCO2Average}
        >
          <p className="text-center">
            {localization('Smoke Average', language)}
          </p>
          {lowerThanBreakpoint && <BiChevronDown className="text-3xl" />}
        </button>
        {/* If Lower Than Breakpoint 1024px / lg --> use carousel */}
        {lowerThanBreakpoint ? (
          <>
            <Carousel setApi={setApi} className="cursor-grab">
              <CarouselContent
                className={cn(
                  hideSensorSummaries ? 'h-0 blur-sm' : 'h-[150px]',
                  'transition-[height] ease-in-out',
                )}
              >
                <CarouselItem>
                  <Co2DoughnutChart
                    className="mt-[-8px] h-full translate-y-[1rem] px-10 py-2"
                    averagePPM={
                      filteredSensorLogSummaries[0]?.summary?.avg
                        ? Number(filteredSensorLogSummaries[0]?.summary?.avg)
                        : 0
                    }
                    lastUpdate={filteredSensorLogSummaries[0]?.startDate}
                  />
                </CarouselItem>
                <CarouselItem>
                  <div className="h-full px-5 py-3">
                    <Co2BoxPlotChart whiskerData={whiskerSensorlogSummaries} />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
            <div
              className={cn(
                'mx-auto mb-4 flex h-1.5 justify-center gap-1.5 transition-all ease-in-out',
                hideSensorSummaries && 'm-0 h-0 overflow-hidden blur-sm',
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
          <div
            className={cn(
              'grid grid-rows-[1fr] overflow-hidden transition-all',
              hideSensorSummaries && 'grid-rows-[0fr] blur-sm',
            )}
          >
            <div
              className={cn(
                'grid grid-cols-1 gap-3 overflow-hidden p-4 lg:grid-cols-5',
                hideSensorSummaries && 'py-0',
              )}
            >
              <Co2DoughnutChart
                className="col-span-2"
                averagePPM={
                  filteredSensorLogSummaries[0]?.summary?.avg
                    ? Number(filteredSensorLogSummaries[0]?.summary?.avg)
                    : 0
                }
                lastUpdate={filteredSensorLogSummaries[0]?.startDate}
              />
              <div className="mx-auto w-fit flex-grow lg:col-span-3 lg:w-full">
                <Co2BoxPlotChart whiskerData={whiskerSensorlogSummaries} />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
