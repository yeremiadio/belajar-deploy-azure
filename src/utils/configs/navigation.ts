import { AiOutlineAppstore } from 'react-icons/ai';
import { IoWater } from 'react-icons/io5';
import {
  MdEnergySavingsLeaf,
  MdOutlineFlood,
  MdOutlineLocalFireDepartment,
  MdOutlineMonitor,
  MdOutlineShareLocation,
  MdSensorOccupied,
  MdOutlineInventory,
  MdOutlineShoppingCart,
  MdOutlineInventory2,
  MdOutlineHub,
  MdOutlineTextSnippet,
} from 'react-icons/md';
import { RiAlertFill, RiBuilding2Line, RiBuilding3Line } from 'react-icons/ri';

import { IconSmartPole } from '@/assets/images/SmartPole';

import { IUserGateway } from '@/types/api/user';
import { NavigationItem, NavigationList } from '@/types/sidebar';

import { ROUTES } from './route';
import { GWThemeEnum } from '@/utils/constants';

/**
 * this function will make:
 * - if there is no gw, no update
 * - if there is exactly one gw, use parent as url
 * - if there are multiple gw, create kiddos
 * @param item navigation item
 * @param fn gateway parent url or kiddo url
 * @returns the updated navigation item.
 */
const updateParentOrKiddo = (
  theme: string,
  item: NavigationItem,
  gw: IUserGateway[],
): NavigationItem => {
  if (!gw.length) return item;
  switch (gw.length) {
    case 1:
      item.url = createGWURLfromGWTheme(theme, gw[0].id.toString());
      // remove kiddos from existence, no dropdown.
      delete item.kiddos;
      break;
    default:
      item.kiddos = gw.map((i) => ({
        name: i.name,
        url: createGWURLfromGWTheme(theme, i.id.toString()),
      }));
      break;
  }
  return item;
};

/**
 *
 * @param theme gateway theme
 * @param gwId gwId in string
 * @returns a proper URL, or empty string
 */
const createGWURLfromGWTheme = (theme: string, gwId: string): string => {
  switch (theme) {
    case GWThemeEnum.energymeter:
      return ROUTES.energyMeterGateway(gwId);
      break;
    case GWThemeEnum.energymeteradvanced:
      return ROUTES.energyMeterAdvancedGateway(gwId);
    case GWThemeEnum.aquasense:
      return ROUTES.waterLevelGateway(gwId);
    case GWThemeEnum.forestfire:
      return ROUTES.ewsFireForestGateway(gwId);
    case GWThemeEnum.flood:
      return ROUTES.ewsFloodGateway(gwId);
    case GWThemeEnum.envirobox:
      return ROUTES.enviroboxGateway(gwId);
    case GWThemeEnum.yard:
      return ROUTES.unitraceGateway(gwId);
    case GWThemeEnum.employeetracker:
      return ROUTES.employeeTrackerGateway(gwId);
    case GWThemeEnum.reservation:
      return ROUTES.reservationGateway(gwId);
    case GWThemeEnum.machinemonitoring:
      return ROUTES.machineMonitoringGateway(gwId);
    case GWThemeEnum.wastemonitoring:
      return ROUTES.wasteMonitoringGateway(gwId);
    default:
      return '';
  }
};

export const dashboardNavigation = (
  name: string,
  gateway: Array<IUserGateway>,
): NavigationItem | undefined => {
  switch (name) {
    case 'energymeter': {
      const item: NavigationItem = {
        icon: MdEnergySavingsLeaf,
        name: 'Energy Meter',
        screentype: 'energymeter',
        url: ROUTES.energyMeter,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'energymeteradvanced': {
      const item: NavigationItem = {
        icon: MdEnergySavingsLeaf,
        name: 'Energy Meter',
        screentype: 'energymeteradvanced',
        url: ROUTES.energyMeterAdvanced,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'aquasense': {
      const item: NavigationItem = {
        icon: IoWater,
        name: 'Water Level',
        screentype: 'aquasense',
        url: ROUTES.waterLevel,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'forestfire': {
      const item: NavigationItem = {
        icon: MdOutlineLocalFireDepartment,
        name: 'Forest Fire',
        screentype: 'forestfire',
        url: ROUTES.ewsFireForest,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'flood': {
      const item: NavigationItem = {
        icon: MdOutlineFlood,
        name: 'Flood',
        screentype: 'flood',
        url: ROUTES.ewsFlood,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'employeetracker': {
      const item: NavigationItem = {
        icon: MdSensorOccupied,
        name: 'Employee',
        screentype: 'employeetracker',
        url: ROUTES.employeeTracker,
        allowedUrl: [`${ROUTES.employeeTracker}/detail`],
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'smartpole': {
      const item: NavigationItem = {
        icon: IconSmartPole,
        name: 'Smart Pole',
        screentype: 'smartpole',
        url: ROUTES.smartPole,
      };
      if (!gateway.length) return item;
      switch (gateway.length) {
        case 1:
          const id = gateway[0].id.toString();
          item.url = ROUTES.smartPoleGateway(id);
          item.allowedUrl = [`${ROUTES.smartPoleGateway(id)}/detail`];
          break;
        default:
          item.kiddos = gateway.map((item) => ({
            name: item.name,
            url: ROUTES.smartPoleGateway(item.id.toString()),
            allowedUrl: [
              `${ROUTES.smartPoleGateway(item.id.toString())}/detail`,
            ],
          }));
          break;
      }
      return item;
    }
    case 'envirobox': {
      const item: NavigationItem = {
        icon: MdOutlineMonitor,
        name: 'Envirobox',
        screentype: 'envirobox',
        url: ROUTES.envirobox,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'yard': {
      const item: NavigationItem = {
        icon: MdOutlineShareLocation,
        name: 'Dashboard',
        screentype: 'yard',
        url: ROUTES.unitrace,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    case 'purchaseorder':
      return {
        icon: MdOutlineShoppingCart,
        name: 'Purchase Order',
        screentype: 'purchaseorder',
        url: ROUTES.purchaseOrder,
        allowedUrl: [
          `${ROUTES.purchaseOrder}/create`,
          `${ROUTES.purchaseOrder}/confirm-inventory`,
        ],
        kiddos: undefined,
      };
      case 'wastemonitoring': {
        const item: NavigationItem = {
          icon: MdOutlineHub,
          name: 'Waste',
          screentype: 'wastemonitoring',
          url: ROUTES.waste,
        };
        return updateParentOrKiddo(name, item, gateway);
      }     
    case 'machinemonitoring': {
      const item: NavigationItem = {
        icon: MdOutlineMonitor,
        name: 'Machine',
        screentype: 'machinemonitoring',
        url: ROUTES.machineMonitoring,
      };
      return updateParentOrKiddo(name, item, gateway);
    }
    default:
      return undefined;
  }
};

export const managementNavigation: NavigationList = [
  {
    icon: AiOutlineAppstore,
    name: 'Management',
    url: ROUTES.management,
    kiddos: [
      {
        iconShrink: RiBuilding2Line,
        name: 'Account',
        screentype: 'account',
        url: ROUTES.managementAccount,
      },
      {
        iconShrink: RiBuilding3Line,
        name: 'Company',
        screentype: 'company',
        url: ROUTES.managementCompany,
        userType: ['systemadmin'],
      },
      {
        iconShrink: IoWater,
        name: 'Device',
        screentype: 'device',
        url: ROUTES.managementDevice,
      },
      {
        iconShrink: RiAlertFill,
        name: 'Alert',
        screentype: 'alert',
        url: ROUTES.managementAlert,
      },
      {
        name: 'Location',
        screentype: 'location',
        url: ROUTES.managementLocation,
      },
      {
        name: 'Tag',
        screentype: 'tag',
        url: ROUTES.managementTag,
      },
      {
        name: 'Inventory',
        screentype: 'inventory',
        url: ROUTES.managementInventory,
      },
      {
        name: 'Recipe',
        screentype: 'recipe',
        url: ROUTES.managementRecipe,
      },
      {
        iconShrink: RiBuilding2Line,
        name: 'Gateway',
        screentype: 'gateway',
        url: ROUTES.managementGateway,
        userType: ['systemadmin'],
      },
      {
        name: 'Machine',
        screentype: 'machine',
        url: ROUTES.managementMachine,
        userType: ['superadmin'],
      },
    ],
  },
];

export const inventoryNavigation: NavigationList = [
  {
    icon: MdOutlineInventory,
    name: 'Production',
    screentype: 'inventory',
    url: ROUTES.inventory,
    kiddos: [
      {
        name: 'Work Order',
        screentype: 'workorder',
        url: ROUTES.inventoryWorkOrder,
      },
      {
        name: 'In-Out Stock',
        screentype: 'stock',
        url: ROUTES.inventoryInOutStock,
      },
      {
        name: 'Production Plan',
        screentype: 'productionplaning',
        url: ROUTES.productionPlanning,
      },
    ],
  },
];

export const reservationNavigation: NavigationList = [
  {
    icon: MdOutlineShareLocation,
    name: 'Yard',
    screentype: 'reservation',
    url: ROUTES.yard,
    kiddos: [
      {
        name: 'Reservation',
        screentype: 'list',
        url: ROUTES.reservationList,
      },
      {
        name: 'Vendor',
        screentype: 'vendor',
        url: ROUTES.reservationVendor,
      },
    ],
  },
];

// Temporary until found a better way to handle this
// Need to refactor
export const assetNavigation: NavigationList = [
  {
    icon: MdOutlineInventory2,
    name: 'Asset',
    screentype: 'asset',
    url: '/asset',
    kiddos: [
      // {
      //   // Temporary for presentation
      //   name: 'Inventory',
      //   screentype: 'inventorymanagement',
      //   url: '/asset/inventory-management',
      //   disabled: true,
      // },
    ],
  },
];

export const reportNavigation: NavigationList = [
  {
    icon: MdOutlineTextSnippet,
    name: 'Report',
    screentype: 'report',
    url: ROUTES.report,
  },
];
