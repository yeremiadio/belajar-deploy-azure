import { useMemo } from 'react';

import { useGetCompaniesQuery } from '@/stores/managementStore/companyStore/companyStoreApi';

import { ICompany } from '@/types/api/management/company';

import {
  IDashboardPermission,
  IGetPermissionList,
  IManagementPermission,
  IOtherPermission,
  IInventoryPermission,
  IReservationPermission
} from '@/types/api/permission';

type Props = {
  args: Partial<ICompany>;
  options?: {
    skip?: boolean;
  };
};

const useGetCompanyPermissions = ({ args, options }: Props) => {
  const { data, isLoading, isFetching } = useGetCompaniesQuery(args, options);
  const loading = isLoading || isFetching;
  const defaultPermissions: IGetPermissionList = {
    dashboard: [],
    management: [],
    other: [],
    inventory: [],
    reservation: []
  };

  return useMemo(() => {
    let company = data ? data.entities[0] : undefined;
    const dashboardSet = new Set<keyof IDashboardPermission>();
    const managementSet = new Set<keyof IManagementPermission>();
    const otherSet = new Set<keyof IOtherPermission>();
    const inventorySet = new Set<keyof IInventoryPermission>();
    const reservationSet = new Set<keyof IReservationPermission>();
    if (!company)
      return {
        permissions: defaultPermissions,
        isLoading: loading,
        dashboardSet,
        managementSet,
        reservationSet,
        otherSet,
        inventorySet,
      };

    const { permission } = company;

    permission.dashboard.forEach((val) => {
      dashboardSet.add(val.name);
    });
    permission.management.forEach((val) => {
      managementSet.add(val.name);
    });
    permission.other.forEach((val) => {
      otherSet.add(val.name);
    });

    permission.inventory.forEach((val) => {
      inventorySet.add(val.name);
    });
    permission.reservation?.forEach((val) => {
      reservationSet.add(val.name);
    });
    const permissions: IGetPermissionList = Object.assign(
      {},
      defaultPermissions,
    );

    dashboardSet.forEach((val1) => {
      permissions.dashboard.push(val1);
    });

    managementSet.forEach((val1) => {
      permissions.management.push(val1);
    });

    otherSet.forEach((val1) => {
      permissions.other.push(val1);
    });

    inventorySet.forEach((val1) => {
      permissions.inventory.push(val1);
    });

    reservationSet?.forEach((val1) => {
      permissions.reservation?.push(val1);
    });

    return {
      permissions,
      isLoading: loading,
      dashboardSet,
      managementSet,
      otherSet,
      inventorySet,
      reservationSet
    };
  }, [data, loading]);
};

export default useGetCompanyPermissions;