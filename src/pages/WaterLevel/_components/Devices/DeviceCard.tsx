import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Link, useParams } from 'react-router-dom';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { WaveLiquid } from '@/components/WaveLiquid';

import { cn } from '@/lib/utils';

import WaterDepthPlotChart from '@/pages/WaterLevel/_components/WaterDepthPlotChart';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { IDeviceLocationEwsFloodObj } from '@/types/api/ews';

import { ROUTES } from '@/utils/configs/route';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';

interface Props {
  data: IDeviceLocationEwsFloodObj;
  selected: boolean;
  onClick: () => void;
}

export const DeviceCard: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  data,
  className,
  selected,
  onClick,
  ...rest
}) => {
  const { gatewayId } = useParams<'gatewayId'>();
  const language = useAppSelector(selectLanguage);
  const { device_summary } = data;
  const lastUpdate = useDynamicLastUpdateTime({
    receivedOn: device_summary?.receivedon,
  });

  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrentSlide] = useState(1);

  useEffect(() => {
    setCurrentSlide(1);
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleNext = () => {
    if (!api) return;
    if (!api.canScrollNext()) return;

    api.scrollNext();
  };

  const handlePrev = () => {
    if (!api) return;
    if (!api.canScrollPrev()) return;

    api.scrollPrev();
  };

  return (
    <div
      className={cn(
        `box-border flex flex-col gap-y-4 overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-4 py-3`,
        selected && 'env-selected border border-white',
        className,
      )}
      {...rest}
      onClick={onClick}
    >
      <div className="relative flex flex-col items-center gap-y-1">
        <h1 className="text-base font-medium">{device_summary?.name ?? ''}</h1>
        <p className="text-rs-gray-10 text-sm font-medium">
          {localization('Water Level', language)}
        </p>
        <BiChevronLeft
          className="text-rs-gray-10 absolute bottom-0 left-0 cursor-pointer text-xl"
          onClick={handlePrev}
        />
        <BiChevronRight
          className="text-rs-gray-10 absolute bottom-0 right-0 cursor-pointer text-xl"
          onClick={handleNext}
        />
      </div>
      <Carousel setApi={setApi} opts={{ loop: true }} className="cursor-grab">
        <CarouselContent className={cn('transition-[height] ease-in-out')}>
          <CarouselItem>
            <div className="flex flex-col items-center gap-y-4">
              <WaveLiquid
                className="mx-auto w-[140px]"
                value={device_summary?.current_water_level ?? 0}
                maxValue={device_summary?.max_water_level ?? 0}
                isOverThreshold={
                  device_summary?.alert?.alert?.threatlevel === 2
                }
                isWarning={device_summary?.alert?.alert?.threatlevel === 1}
              />
              <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between gap-y-2 text-xs font-medium">
                  <p className="text-rs-gray-9">
                    {localization('Average', language)}
                  </p>
                  <div className="flex gap-x-2">
                    <p>
                      {device_summary?.average_current_water_level ?? '-'} cm
                    </p>
                    <p className="text-[10px] text-rs-v2-red">
                      {device_summary?.different_average_current_water_level_persentage ??
                        '-'}
                      %
                    </p>
                  </div>
                </div>
                <div className="flex justify-between gap-y-2 text-xs font-medium">
                  <p className="text-rs-gray-9">
                    {localization('Highest', language)}
                  </p>
                  <div className="flex gap-x-2">
                    <p>
                      {device_summary?.highest_current_water_level ?? '-'} cm
                    </p>
                    <p className="text-[10px] text-rs-alert-green">
                      {device_summary?.different_highest_current_water_level_persentage ??
                        '-'}
                      %
                    </p>
                  </div>
                </div>
                <div className="flex justify-between gap-y-2 text-xs font-medium">
                  <p className="text-rs-gray-9">
                    {localization('Lowest', language)}
                  </p>
                  <div className="flex gap-x-2">
                    <p>
                      {device_summary?.lowest_current_water_level ?? '-'} cm
                    </p>
                    <p className="text-[10px] text-rs-alert-green">
                      {device_summary?.different_lowest_current_water_level_persentage ??
                        '-'}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <WaterDepthPlotChart />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Link
        className="mt-3 w-full rounded-lg bg-rs-v2-midnight-blue p-3 text-center text-white hover:bg-rs-v2-midnight-blue"
        to={
          gatewayId
            ? ROUTES.waterLevelGatewayDetail(
                gatewayId,
                device_summary.id.toString(),
              )
            : ROUTES.waterLevelDetail + `?id=${device_summary.id}`
        }
      >
        {localization('View Detail', language)}
      </Link>
      <p className="text-xs italic text-rs-neutral-chromium first-letter:capitalize text-center">
        {lastUpdate}
      </p>
    </div>
  );
};
