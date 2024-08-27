import { ROUTES } from '../configs/route';
import { GWThemeEnum } from '../constants';

export const getUrlDevice = (
  permission: string,
  gatewayId: number,
  deviceId: number,
) => {
  const _gatewayId = gatewayId.toString();
  let url;

  switch (permission) {
    case GWThemeEnum.aquasense:
      if (gatewayId) {
        url = `${ROUTES.waterLevelGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.waterLevel}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.employeetracker:
      if (gatewayId) {
        url = `${ROUTES.employeeTrackerGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.employeeTracker}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.energymeter:
      if (gatewayId) {
        url = `${ROUTES.energyMeterGatewayDevices(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.energyMeterDevices}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.energymeteradvanced:
      if (gatewayId) {
        url = `${ROUTES.energyMeterAdvancedGatewayDevices(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.energyMeterAdvancedDevices}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.envirobox:
      if (gatewayId) {
        url = `${ROUTES.enviroboxGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.envirobox}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.flood:
      if (gatewayId) {
        url = `${ROUTES.ewsFloodGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.ewsFlood}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.forestfire:
      if (gatewayId) {
        url = `${ROUTES.ewsFireForestGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.ewsFireForest}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.smartpole:
      if (gatewayId) {
        url = `${ROUTES.smartPoleGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.smartPole}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.inventrace:
      if (gatewayId) {
        url = ``;
      } else {
        url = ``;
      }
      break;
    case GWThemeEnum.machinemonitoring:
      if (gatewayId) {
        url = `${ROUTES.machineMonitoringGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.machineMonitoring}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.oee:
      if (gatewayId) {
        url = ``;
      } else {
        url = ``;
      }
      break;
    case GWThemeEnum.purchaseorder:
      if (gatewayId) {
        url = ``;
      } else {
        url = ``;
      }
      break;
    case GWThemeEnum.reservation:
      if (gatewayId) {
        url = ``;
      } else {
        url = ``;
      }
      break;
    case GWThemeEnum.wastemonitoring:
      if (gatewayId) {
        url = `${ROUTES.wasteMonitoringGateway(_gatewayId)}?device=${deviceId}`;
      } else {
        url = `${ROUTES.waste}?device=${deviceId}`;
      }
      break;
    case GWThemeEnum.yard:
      if (gatewayId) {
        url = ``;
      } else {
        url = ``;
      }
      break;
  }

  return { url };
};
