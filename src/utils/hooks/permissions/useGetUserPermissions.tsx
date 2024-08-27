import React from 'react';

import { useGetMyPermissionQuery } from '@/stores/managementStore/userStore';

import {
  IDashboardPermission,
  IGetPermissionList,
  IInventoryPermission,
  IManagementPermission,
  IOtherPermission,
  IReservationPermission,
} from '@/types/api/permission';
import { IUserData } from '@/types/api/user';

type Props = {
  args: Partial<IUserData>;
  options?: {
    skip?: boolean;
  };
};

const useUserPermissions = ({ args, options }: Props) => {
  const { data, isLoading, isFetching } = useGetMyPermissionQuery(
    args,
    options,
  );
  const loading = isLoading || isFetching;
  const defaultPermissions: IGetPermissionList = {
    dashboard: [],
    management: [],
    other: [],
    inventory: [],
    reservation: [],
  };

  return React.useMemo(() => {
    const userPermissions = data;
    const dashboardSet = new Set<keyof IDashboardPermission>();
    const managementSet = new Set<keyof IManagementPermission>();
    const otherSet = new Set<keyof IOtherPermission>();
    const inventorySet = new Set<keyof IInventoryPermission>();
    const reservationSet = new Set<keyof IReservationPermission>();
    if (!userPermissions)
      return {
        permission: defaultPermissions,
        isLoading: loading,
        dashboardSet,
        managementSet,
        otherSet,
        inventorySet,
        reservationSet,
      };
    const { permissions } = userPermissions;
    permissions.dashboard.forEach((val) => {
      dashboardSet.add(val.name);
    });
    permissions.management.forEach((val) => {
      managementSet.add(val.name);
    });
    permissions.other.forEach((val) => {
      otherSet.add(val.name);
    });
    permissions.inventory.forEach((val) => {
      inventorySet.add(val.name);
    });
    permissions.reservation?.forEach((val) => {
      reservationSet.add(val.name);
    });

    const permission: IGetPermissionList = Object.assign(
      {},
      defaultPermissions,
    );

    dashboardSet.forEach((val1) => {
      permission.dashboard.push(val1) as keyof IDashboardPermission;
    });

    managementSet.forEach((val1) => {
      permission.management.push(val1);
    });

    otherSet.forEach((val1) => {
      permission.other.push(val1);
    });

    inventorySet.forEach((val1) => {
      permission.inventory.push(val1);
    });

    reservationSet?.forEach((val1) => {
      permission.reservation?.push(val1);
    });

    return {
      permission,
      isLoading: loading,
      dashboardSet,
      managementSet,
      otherSet,
      inventorySet,
      reservationSet,
    };
  }, [data, loading]);
};

export default useUserPermissions;
