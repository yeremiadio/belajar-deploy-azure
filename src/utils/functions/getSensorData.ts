import {
  MdThermostat,
  MdOutlineWaterDrop,
  MdOutlineSpeed,
  MdOutlineCo2,
  MdElectricBolt,
  MdOutlineWaves,
  MdOutlineAir,
  MdOutlineMonitorWeight,
} from 'react-icons/md';
import { PiWaves } from 'react-icons/pi';

import { IconActivePower } from '@/assets/images/IconActivePower';
import { IconCurrent } from '@/assets/images/IconCurrent';
import { IconEnergy } from '@/assets/images/IconEnergy';
import { IconFrequency } from '@/assets/images/IconFrequency';
import { IconPowerFactor } from '@/assets/images/IconPowerFactor';
import { IconVoltage } from '@/assets/images/IconVoltage';
import { IconRainy } from '@/assets/images/IconRainy';

import { TAvailableSensorCode } from '@/types/sensorData';

export const getSensorData = (sensor: string) => {
  const sensorCode = sensor as TAvailableSensorCode;
  let Icon;
  let name;
  let unit;
  switch (sensorCode) {
    case 'temp':
      Icon = MdThermostat;
      name = 'Temperature';
      unit = '°C';
      break;
    case 'hmdt':
      Icon = MdOutlineWaterDrop;
      name = 'Humidity';
      unit = '%';
      break;
    case 'apre':
      Icon = MdOutlineSpeed;
      name = 'Air Pressure';
      unit = 'Psi';
      break;
    case 'acpo':
      Icon = IconActivePower;
      name = 'Active Power';
      unit = 'Watt';
      break;
    case 'appo':
      Icon = MdElectricBolt;
      name = 'Apparent Power';
      unit = 'VA';
      break;
    case 'cnba':
      Icon = null;
      name = 'A';
      unit = '%';
      break;
    case 'cnbb':
      Icon = null;
      name = 'B';
      unit = '%';
      break;
    case 'cnbc':
      Icon = null;
      name = 'C';
      unit = '%';
      break;
    case 'cnbw':
      Icon = IconCurrent;
      name = 'Worst Current Unbalanced';
      unit = '%';
      break;
    case 'cntr':
      Icon = null;
      name = 'Counter';
      unit = 'Unit';
      break;
    case 'co':
      Icon = MdOutlineAir;
      name = 'Carbon Monoxide';
      unit = 'ppm';
      break;
    case 'co2':
      Icon = MdOutlineCo2;
      name = 'CO2';
      unit = 'ppm';
      break;
    case 'dist':
      Icon = null;
      name = 'Distance';
      unit = 'm';
      break;
    case 'edel':
      Icon = IconEnergy;
      name = 'Energy Delivered';
      unit = 'kWh';
      break;
    case 'flwrt':
      Icon = PiWaves;
      name = 'Flow Rate';
      unit = 'l/min';
      break;
    case 'freq':
      Icon = IconFrequency;
      name = 'Frequency';
      unit = 'Hz';
      break;
    case 'iavg':
      Icon = IconCurrent;
      name = 'Current';
      unit = 'A';
      break;
    case 'lpg':
      Icon = MdOutlineAir;
      name = 'LPG';
      unit = 'ppm';
      break;
    case 'mthn':
      Icon = MdOutlineAir;
      name = 'Methane';
      unit = 'ppm';
      break;
    case 'pfac':
      Icon = IconPowerFactor;
      name = 'Power Factor';
      unit = 'kW';
      break;
    case 'prpn':
      Icon = MdOutlineAir;
      name = 'Propane';
      unit = 'ppm';
      break;
    case 'rgauge':
      Icon = IconRainy;
      name = 'Rain Gauge';
      unit = 'mm';
      break;
    case 'rpow':
      Icon = IconActivePower;
      name = 'Reactive Power';
      unit = 'VAR';
      break;
    case 'smke':
      Icon = MdOutlineAir;
      name = 'Smoke';
      unit = 'ppm';
      break;
    case 'stdd':
      Icon = MdElectricBolt;
      name = 'TDD';
      unit = '%';
      break;
    case 'thdc':
      Icon = MdElectricBolt;
      name = 'THD Current (avg)';
      unit = '%';
      break;
    case 'thdv':
      Icon = MdElectricBolt;
      name = 'THD Voltage (avg)';
      unit = '%';
      break;
    case 'vavg':
      Icon = IconVoltage;
      name = 'Voltage';
      unit = 'V';
      break;
    case 'tagn':
      Icon = null;
      name = 'TAG ID Number';
      unit = '';
      break;
    case 'vnba':
      Icon = null;
      name = 'A-N';
      unit = '%';
      break;
    case 'vnbb':
      Icon = null;
      name = 'B-N';
      unit = '%';
      break;
    case 'vnbc':
      Icon = null;
      name = 'C-N';
      unit = '%';
      break;
    case 'vnbw':
      Icon = IconVoltage;
      name = 'Worst Voltage Unbalanced';
      unit = '%';
      break;
    case 'wfwl':
      Icon = PiWaves;
      name = 'Water Flow';
      unit = 'l/min';
      break;
    case 'wlvl':
      Icon = MdOutlineWaves;
      name = 'Water Level';
      unit = 'cm';
      break;
    case 'wusg':
      Icon = MdOutlineWaves;
      name = 'Water Usage';
      unit = 'l';
      break;
    case 'weight':
      Icon = MdOutlineMonitorWeight;
      name = 'Weight';
      unit = 'kg';
      break;
    case 'airq':
      Icon = MdOutlineAir;
      name = 'Air Quality';
      unit = 'AQI';
      break;
    default:
      Icon = null;
      name = 'Sensor';
      unit = '';
      break;
  }

  return {
    Icon,
    name,
    unit,
  };
};
