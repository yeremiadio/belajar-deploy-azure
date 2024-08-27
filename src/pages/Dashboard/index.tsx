import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

import Datetime from '@/components/TopBar/_components/Datetime';

import { ROUTES } from '@/utils/configs/route';
import useGetNavigationList from '@/utils/hooks/useGetNavigationList';

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

const DashboardPage = () => {
  const navigate = useNavigate();

  const { navigationList } = useGetNavigationList();

  const isMenuAvailable = useCallback(
    (menu: any) =>
      navigationList?.some(
        (nav) =>
          (nav && nav?.url === menu?.path) ||
          nav?.kiddos?.some((kid) => kid && kid?.url === menu?.path),
      ),
    [navigationList],
  );

  const sortedDashboardMenu = useMemo(() => {
    return [...DashboardMenu].sort((a, b) => {
      const isMenuAvailableA = isMenuAvailable(a);
      const isMenuAvailableB = isMenuAvailable(b);

      return Number(isMenuAvailableB) - Number(isMenuAvailableA);
    });
  }, [isMenuAvailable]);

  return (
    <>
      <div className={`flex h-full w-full flex-col `}>
        <Datetime />
        <div className="flex h-full flex-row flex-wrap items-center justify-center gap-10 overflow-hidden xl:gap-14 2xl:gap-20">
          <div className="flex flex-col gap-4 2xl:gap-10">
            <h1 className="text-4xl font-bold leading-[1.25] lg:text-[40px] 2xl:text-[56px]">
              Welcome to <br /> Rapidsense <br /> Dashboard
            </h1>
            <span className="text-lg md:text-xl">
              Empowering Connectivity, Enhancing <br /> Intelligence.
            </span>
          </div>

          <div className="grid max-h-[500px] w-auto grid-cols-[1-2] gap-6 overflow-y-scroll [-ms-overflow-style:none] [scrollbar-width:none] lg:grid-cols-2 2xl:max-h-[680px] [&::-webkit-scrollbar]:hidden">
            {sortedDashboardMenu.map((menu, index) => {
              const navigationItem = navigationList?.find(
                (nav) =>
                  nav?.url === menu?.path ||
                  nav?.kiddos?.some((kid) => kid?.url === menu?.path),
              );

              const isMenuAvailable = Boolean(navigationItem);

              const navigateUrl =
                navigationItem?.kiddos?.[0]?.url || navigationItem?.url || '';

              return (
                <div
                  key={index}
                  className={`relative flex h-[200px] w-full items-center justify-end gap-2 rounded-xl bg-cover bg-center p-10 md:w-[340px] xl:w-[400px] 2xl:w-[430px] ${isMenuAvailable ? 'cursor-pointer hover:opacity-90' : 'cursor-not-allowed'}`}
                  style={{
                    backgroundImage: `url(${menu.bg})`,
                    filter: `saturate(${isMenuAvailable ? '100%' : '0%'})`,
                  }}
                  onClick={() => {
                    if (isMenuAvailable) {
                      navigate(navigateUrl);
                    }
                  }}
                >
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-xl bg-gradient-to-bl from-[#194441] to-transparent" />
                  <div className="z-10 flex flex-col text-end">
                    <span className="text-lg">Rapidsense</span>
                    <span className="text-3xl font-bold">{menu.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
