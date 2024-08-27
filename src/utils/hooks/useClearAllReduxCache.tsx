import { resetAlertApiState } from '@/stores/alertStore/alertStoreApi';
import { resetAuthApiState } from '@/stores/authStore/authStoreApi';
import { resetCopilotApiState } from '@/stores/copilotStore/copilotStoreApi';
import { resetEnergyMeterApiState } from '@/stores/energyMeterStore/energyMeterStoreApi';
import { resetEwsFloodApiState } from '@/stores/ewsStore/ewsFloodStoreApi';
import { resetEwsForestFireApiState } from '@/stores/ewsStore/ewsForestFireStoreApi';
import { resetMachineStoreAPI } from '@/stores/managementStore/machineStore/machineStoreApi';
import { resetModuleStoreAPI } from '@/stores/managementStore/moduleStore/modulesStoreApi';
import { resetSensorApiState } from '@/stores/managementStore/sensorStore/sensorStoreApi';
import { resetSmartPoleApiState } from '@/stores/smartPoleStore/smartPoleStoreApi';
import { resetWaterLevelApiState } from '@/stores/waterLevelStore/waterLevelStoreApi';

import useAppDispatch from './useAppDispatch';
import { resetUserStoreApiState } from '@/stores/managementStore/userStore';

const useClearAllReduxCache = () => {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(resetAuthApiState());
    dispatch(resetAlertApiState());
    dispatch(resetSensorApiState());
    dispatch(resetCopilotApiState());
    dispatch(resetEnergyMeterApiState());
    dispatch(resetWaterLevelApiState());
    dispatch(resetEwsForestFireApiState());
    dispatch(resetEwsFloodApiState());
    dispatch(resetSmartPoleApiState());
    dispatch(resetModuleStoreAPI());
    dispatch(resetMachineStoreAPI());
    dispatch(resetUserStoreApiState());
  };
};

export default useClearAllReduxCache;
