import { TUserPermissionItem } from '@/types/api/permission';
import { random } from 'lodash';

export function getWhitelistDashboard() {
  const whitelist = import.meta.env.VITE_WHITELIST_DASHBOARD ?? '';
  if (whitelist) {
    const formattedWhitelist = whitelist.split(',').map((item: string) => ({
      name: item.replace(/["'\/\\]/g, ''),
      gateway: [],
      id: random(1, 1000),
    }));
    return formattedWhitelist as TUserPermissionItem[];
  } else {
    return [];
  }
}

export function getWhitelistManagement() {
  const whitelist = import.meta.env.VITE_WHITELIST_MANAGEMENT ?? '';
  if (whitelist) {
    const formattedWhitelist = whitelist.split(',').map((item: string) => ({
      name: item.replace(/["'\/\\]/g, ''),
      id: random(1, 1000),
    }));
    return formattedWhitelist as TUserPermissionItem[];
  } else {
    return [];
  }
}

export function getWhitelistInventory() {
  const whitelist = import.meta.env.VITE_WHITELIST_INVENTORY ?? '';
  if (whitelist) {
    const formattedWhitelist = whitelist.split(',').map((item: string) => ({
      name: item.replace(/["'\/\\]/g, ''),
      id: random(1, 1000),
    }));
    return formattedWhitelist as TUserPermissionItem[];
  } else {
    return [];
  }
}

export function getWhitelistReservation() {
  const whitelist = import.meta.env.VITE_WHITELIST_RESERVATION ?? '';
  if (whitelist) {
    const formattedWhitelist = whitelist.split(',').map((item: string) => ({
      name: item.replace(/["'\/\\]/g, ''),
      id: random(1, 1000),
    }));
    return formattedWhitelist as TUserPermissionItem[];
  } else {
    return [];
  }
}
