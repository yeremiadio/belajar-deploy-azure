import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

import {
  DashboardAssetManagement,
  DashboardEmployeeTracker,
  DashboardEnergyMeter,
  DashboardEnvirobox,
  DashboardFlood,
  DashboardForestFire,
  DashboardOEE,
  DashboardSmartpole,
  DashboardWaterLevel,
  DashboardWaterQuality,
} from '@/assets/images/dashboard';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/utils/configs/route';

const DashboardMenu = [
  {
    title: 'Envirobox',
    bg: DashboardEnvirobox,
    path: ROUTES.envirobox,
  },
  {
    title: 'Energy Meter',
    bg: DashboardEnergyMeter,
    path: ROUTES.energyMeter,
  },
  {
    title: 'Employee Tracker',
    bg: DashboardEmployeeTracker,
    path: ROUTES.employeeTracker,
  },
  {
    title: 'Asset Management',
    bg: DashboardAssetManagement,
    path: ROUTES.managementAccount,
  },
  {
    title: 'Overall Equipment Effectiveness - OEE',
    bg: DashboardOEE,
    path: ROUTES.overallEquipmentEffectiveness,
  },
  {
    title: 'Smartpole',
    bg: DashboardSmartpole,
    path: ROUTES.smartPole,
  },
  {
    title: 'Water Level',
    bg: DashboardWaterLevel,
    path: ROUTES.waterLevel,
  },
  {
    title: 'Water Quality',
    bg: DashboardWaterQuality,
    path: ROUTES.waterQuality,
  },
  {
    title: 'Early Warning System (EWS) - Forest Fire',
    bg: DashboardForestFire,
    path: ROUTES.ewsFireForest,
  },
  {
    title: 'Early Warning System (EWS) - Flood',
    bg: DashboardFlood,
    path: ROUTES.ewsFlood,
  },
];

export const CarouselMenu = () => {
  // Shadcn Carousel API
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleButton = (targetScroll: number) => {
    if (!api) return;

    api.scrollTo(targetScroll);
  };

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        orientation="horizontal"
        className="cursor-grab rounded-xl"
      >
        <CarouselContent className="m-0 w-full rounded-xl">
          {DashboardMenu.map((menu, index) => (
            <CarouselItem
              key={index}
              className={`relative flex h-[220px] w-full items-center justify-end gap-2 rounded-xl bg-cover bg-center p-10 hover:opacity-90`}
              style={{
                backgroundImage: `url(${menu.bg})`,
                filter: `saturate(100%)`,
              }}
            >
              <div className="absolute inset-0 z-0 overflow-hidden rounded-xl bg-gradient-to-bl from-[#194441] to-transparent" />
              <div className="z-10 flex flex-col text-end">
                <span className="text-lg">Rapidsense</span>
                <span className="text-3xl font-bold">{menu.title}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mx-auto mb-4 mt-4 flex justify-center gap-2">
        {DashboardMenu.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-5 cursor-pointer rounded-lg bg-rs-v2-mint transition-all ease-in-out',
              currentSlide !== index + 1 && 'w-2 bg-gray-500',
            )}
            onClick={() => {
              handleButton(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};
