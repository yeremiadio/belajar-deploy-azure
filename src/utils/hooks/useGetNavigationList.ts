import { useGetPermissionByJwtQuery } from '@/stores/managementStore/userStore';

import { NavigationList } from '@/types/sidebar';

import {
  getWhitelistDashboard,
  getWhitelistInventory,
  getWhitelistManagement,
  getWhitelistReservation,
} from '@/utils/functions/userPermission';
import {
  assetNavigation,
  dashboardNavigation,
  inventoryNavigation,
  managementNavigation,
  reportNavigation,
  reservationNavigation,
} from '@/utils/configs/navigation';
import { removeAndExtractNavDashboardList } from '@/utils/functions/removeAndExtractNavDashboardList';
import {
  GWThemeEnum,
  MgmtPageEnum,
  ProductionPageEnum,
  environmental,
  smartFactory,
} from '@/utils/constants';

import useUserType from './auth/useUserType';

const useGetNavigationList = () => {
  const { data, isLoading } = useGetPermissionByJwtQuery();
  const currentUserType = useUserType();

  if (isLoading || !data) return { isLoading, navigationList: [] };

  // Get the navigation list of the dashboard filtered by the user's permission
  const dashboardPermission = data?.permissions?.['dashboard'];
  const whitelistDashboard = getWhitelistDashboard()?.filter((item) => {
    return !dashboardPermission?.some(
      (permission) => permission.name === item.name,
    );
  });

  const dashboardList = dashboardPermission
    .concat(whitelistDashboard)
    .sort((a, b) => {
      /**
       *
       * @param s gateway theme
       * @returns sort by custom weight
       */
      const fn = (s: string) => {
        switch (s) {
          case GWThemeEnum.machinemonitoring:
            return 1;
          case GWThemeEnum.energymeter:
            return 2;
          case GWThemeEnum.energymeteradvanced:
            return 3;
          case GWThemeEnum.wastemonitoring:
            return 4;
          case GWThemeEnum.envirobox:
            return 5;
          case GWThemeEnum.aquasense:
            return 6;
          case GWThemeEnum.smartpole:
            return 7;
          case GWThemeEnum.flood:
            return 8;
          case GWThemeEnum.forestfire:
            return 9;
          case GWThemeEnum.employeetracker:
            return 9.5;
          case GWThemeEnum.yard:
            return 10;
          default:
            return 999;
        }
      };
      return fn(a.name) - fn(b.name);
    })
    ?.map((item) => dashboardNavigation(item.name, item.gateway))
    ?.filter((item) => item !== undefined) as NavigationList;

  //This is to remove menu from the dashboard list, and change the place of removed menu
  const {
    updatedDashboardList,
    purchaseOrderNav,
    yardNav,
    employeeTrackerNav,
  } = removeAndExtractNavDashboardList(dashboardList);

  // Get kiddos of the management navigation list filtered by the user's permission
  const managementPermission = data?.permissions?.['management'];
  const whitelistManagement = getWhitelistManagement()?.filter((item) => {
    return !managementPermission?.some(
      (permission) => permission.name === item.name,
    );
  });

  const excludeFromSysadmin: MgmtPageEnum[] = [
    MgmtPageEnum['tag'],
    MgmtPageEnum['alert'],
    MgmtPageEnum['machine'],
    MgmtPageEnum['recipe'],
    MgmtPageEnum['inventory'],
  ];

  const kiddosManagement =
    // if the user is a systemadmin, allow all management navigation except the excluded ones
    currentUserType === 'systemadmin'
      ? managementNavigation[0]?.kiddos?.filter((item) => {
          return !excludeFromSysadmin.includes(
            (item.screentype || item.name) as MgmtPageEnum,
          );
        })
      : // else, filter the management navigation based on the user's permission
        managementPermission
          .concat(whitelistManagement)
          ?.map((item) => {
            return managementNavigation?.[0]?.kiddos?.find(
              (management) => management?.screentype === item?.name,
            );
          })
          .filter((item) => !!item);

  kiddosManagement?.sort((a, b) => {
    const fn = (s?: string) => {
      switch (s) {
        case MgmtPageEnum.account:
          return 0;
        case MgmtPageEnum.location:
          return 0.4;
        case MgmtPageEnum.device:
          return 0.5;
        case MgmtPageEnum.alert:
          return 1;
        case MgmtPageEnum.tag:
          return 2;
        case MgmtPageEnum.reservation:
          return 3;
        case MgmtPageEnum.employee:
          return 4;
        case MgmtPageEnum.machine:
          return 5;
        case MgmtPageEnum.recipe:
          return 6;
        case MgmtPageEnum.inventory:
          return 7;
        default:
          return 999;
      }
    };
    return fn(a?.screentype) - fn(b?.screentype);
  });

  const managementList =
    kiddosManagement && kiddosManagement?.length <= 0
      ? []
      : [
          {
            ...managementNavigation[0],
            kiddos: kiddosManagement,
          },
        ];

  // Get kiddos of the inventory navigation list filtered by the user's permission
  const inventoryPermission = data?.permissions?.['inventory'] ?? [];

  const whitelistInventory = getWhitelistInventory()?.filter((item) => {
    return !inventoryPermission?.some(
      (permission) => permission.name === item.name,
    );
  });

  const kiddosInventory = inventoryPermission
    .concat(whitelistInventory)
    ?.map((item) => {
      return inventoryNavigation?.[0]?.kiddos?.find(
        (inventory) => inventory?.screentype === item?.name,
      );
    })
    .concat(purchaseOrderNav)
    .filter((item) => item !== undefined);

  kiddosInventory?.sort((a, b) => {
    const fn = (s?: string) => {
      switch (s) {
        case ProductionPageEnum.productionplaning:
          return 1;
        case ProductionPageEnum.workorder:
          return 2;
        case ProductionPageEnum.stock:
          return 3;
        default:
          return 999;
      }
    };
    return fn(a?.screentype) - fn(b?.screentype);
  });

  const inventoryList =
    kiddosInventory?.length <= 0
      ? []
      : [
          {
            ...inventoryNavigation[0],
            kiddos: kiddosInventory,
          },
        ];

  // Get kiddos of the reservation navigation list filtered by the user's permission
  const reservationPermission = data?.permissions?.['reservation'] ?? [];
  const whitelistReservation = getWhitelistReservation()?.filter((item) => {
    return !reservationPermission?.some(
      (permission) => permission.name === item.name,
    );
  });

  const kiddosReservation = reservationPermission
    .concat(whitelistReservation)
    ?.map((item) => {
      return reservationNavigation?.[0]?.kiddos?.find(
        (reservation) => reservation?.screentype === item?.name,
      );
    })
    .filter((item) => item !== undefined);

  if (yardNav) {
    kiddosReservation?.unshift(yardNav);
  }

  const reservationList =
    kiddosReservation?.length <= 0
      ? []
      : [
          {
            ...reservationNavigation[0],
            kiddos: kiddosReservation,
          },
        ];

  // Temporary solution to combine the asset and employee tracker navigation list
  const assetList = assetNavigation;
  // add employee tracker to the asset list but not duplicate
  if (employeeTrackerNav) {
    if (
      !assetList[0]?.kiddos?.some(
        (item) => item?.screentype === 'employeetracker',
      )
    ) {
      assetList[0].kiddos?.push(employeeTrackerNav);
    }
  }
  const assetListFiltered = assetList[0]?.kiddos?.length === 0 ? [] : assetList;

  const haveAccessReport = data?.permissions?.['dashboard']?.length > 0;

  const navList = [
    ...updatedDashboardList,
    ...assetListFiltered,
    ...reservationList,
    ...inventoryList,
    ...managementList,
    ...(haveAccessReport ? reportNavigation : []),
  ].filter((obj) => Object.keys(obj).length !== 0) as NavigationList;

  const smartFactoryNav = navList.filter((nav) =>
    smartFactory.includes(nav?.screentype ?? ''),
  );
  const environmentalNav = navList.filter((nav) =>
    environmental.includes(nav?.screentype ?? ''),
  );

  // Combine the dashboard, management,reservation and inventory navigation list
  return {
    isLoading,
    navigationList: navList,
    navigationListByGroup: [
      {
        label: 'Smart Factory',
        shortLabel: 'SF',
        navigation: currentUserType === 'systemadmin' ? [] : smartFactoryNav,
      },
      {
        label: 'Environmental',
        shortLabel: 'ENV',
        navigation: environmentalNav,
      },
      {
        label: '',
        navigation: managementList,
      },
      {
        label: '',
        navigation: haveAccessReport ? reportNavigation : [],
      },
    ],
  };
};

export default useGetNavigationList;
