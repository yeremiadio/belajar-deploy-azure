import {
  IMenuPermissions,
  IPermissionWithBoolean,
} from '@/types/api/permission';

export const findId = (
  permission: IMenuPermissions,
  permissionToCheck: IPermissionWithBoolean,
) => {
  const ids: number[] = [];
  for (const item of permission.dashboard) {
    if (permissionToCheck[item.name]) {
      ids.push(item.id);
    }
  }
  for (const item of permission.management) {
    if (permissionToCheck[item.name]) {
      ids.push(item.id);
    }
  }
  for (const item of permission.other) {
    if (permissionToCheck[item.name]) {
      ids.push(item.id);
    }
  }
  for (const item of permission.inventory) {
    if (permissionToCheck[item.name]) {
      ids.push(item.id);
    }
  }
  for (const item of permission.reservation) {
    if (permissionToCheck[item.name]) {
      ids.push(item.id);
    }
  }
  return ids;
};
