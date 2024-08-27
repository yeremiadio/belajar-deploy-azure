import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import SwitchComponent from '@/components/Switch';
import { toast } from '@/components/ui/use-toast';

import { useSavePermissionsMutation } from '@/stores/managementStore/userStore';
import { loadCookie } from '@/services/cookie';
import { useGetCompanyByIdQuery } from '@/stores/managementStore/companyStore/companyStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  DashboardPermissionName,
  ManagementPermissionName,
  OtherPermissionName,
  InventoryPermissionName,
  ReservationPermissionName,
} from '@/types/api/module';
import {
  IDashboardPermission,
  IInventoryPermission,
  IManagementPermission,
  IOtherPermission,
  IPermissionReqObj,
  IReservationPermission,
} from '@/types/api/permission';
import { IUserData } from '@/types/api/user';
import { TModalFormProps } from '@/types/modal';

import { constructProperName } from '@/utils/functions/constractProperName';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useGetCompanyPermissions from '@/utils/hooks/permissions/useGetCompanyPermissions';
import { findId } from '@/utils/hooks/permissions/useGetPermissionIds';
import useGetUserPermissions from '@/utils/hooks/permissions/useGetUserPermissions';
import useUsertypeOptions from '@/utils/hooks/selectOptions/useUsertypeOptions';

const PermissionForm = ({ data, toggle }: TModalFormProps<IUserData>) => {
  const { arr: usertypeOptions } = useUsertypeOptions({});
  const companyId = data?.company.id;
  const userId = data?.id;
  const { data: companyPermissionList } = useGetCompanyByIdQuery(
    { id: companyId ?? 0 },
    { skip: !companyId },
  );
  const {
    permissions: companyPermissions,
    isLoading: isLoadingCompanyPermission,
  } = useGetCompanyPermissions({
    args: {
      id: companyId ?? Number(loadCookie('companyId')),
    },
  });

  const { permission: userPermission, isLoading: isLoadingUserPermission } =
    useGetUserPermissions({
      args: {
        id: userId,
      },
    });
  const [savePermissions] = useSavePermissionsMutation();

  const defaultDashboardPermissions: IDashboardPermission = useMemo(() => {
    const permission = userPermission?.dashboard.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {} as IDashboardPermission);
    return permission;
  }, [userPermission]);
  const defaultManagementPermissions: IManagementPermission = useMemo(() => {
    const permission = userPermission?.management.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {} as IManagementPermission);
    return permission;
  }, [userPermission]);

  const defaultOtherPermissions: IOtherPermission = useMemo(() => {
    const permission = userPermission?.other.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {} as IOtherPermission);
    return permission;
  }, [userPermission]);

  const defaultInventoryPermissions: IInventoryPermission = useMemo(() => {
    const permission = userPermission?.inventory.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {} as IInventoryPermission);
    return permission;
  }, [userPermission]);

  const defaultReservationPermissions: IReservationPermission = useMemo(() => {
    const permission = userPermission?.reservation.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {} as IReservationPermission);
    return permission;
  }, [userPermission]);

  const [dashboardPermissionList, setDashboardPermissionList] =
    useState<IDashboardPermission>(defaultDashboardPermissions);
  const [managementPermissionList, setManagementPermissionList] =
    useState<IManagementPermission>(defaultManagementPermissions);
  const [otherPermissionList, setOtherPermissionList] =
    useState<IOtherPermission>(defaultOtherPermissions);
  const [inventoryPermissionList, setInventoryPermissionList] =
    useState<IInventoryPermission>(defaultInventoryPermissions);
  const [reservationPermissionList, setReservationPermissionList] =
    useState<IReservationPermission>(defaultReservationPermissions);
  useEffect(() => {
    setDashboardPermissionList(defaultDashboardPermissions);
    setManagementPermissionList(defaultManagementPermissions);
    setOtherPermissionList(defaultOtherPermissions);
    setInventoryPermissionList(defaultInventoryPermissions);
    setReservationPermissionList(defaultReservationPermissions);
  }, [
    defaultDashboardPermissions,
    defaultManagementPermissions,
    defaultOtherPermissions,
    defaultInventoryPermissions,
    defaultReservationPermissions,
  ]);

  const companyPermissionData = useMemo(() => {
    if (companyPermissionList) {
      return companyPermissionList.permission;
    }
  }, [companyPermissionList]);

  const handleSwitchDashboardPermissions = <
    K extends keyof IDashboardPermission,
    V extends IDashboardPermission[K],
  >(
    key: K,
    val: V,
  ) => {
    setDashboardPermissionList((prev) => {
      return { ...prev!, [key]: val };
    });
  };
  const handleSwitchManagementPermissions = <
    K extends keyof IManagementPermission,
    V extends IManagementPermission[K],
  >(
    key: K,
    val: V,
  ) => {
    setManagementPermissionList((prev) => {
      return { ...prev!, [key]: val };
    });
  };

  const handleSwitchInventoryPermissions = <
    K extends keyof IInventoryPermission,
    V extends IInventoryPermission[K],
  >(
    key: K,
    val: V,
  ) => {
    setInventoryPermissionList((prev) => {
      return { ...prev!, [key]: val };
    });
  };

  const handleSwitchReservationPermissions = <
    K extends keyof IReservationPermission,
    V extends IReservationPermission[K],
  >(
    key: K,
    val: V,
  ) => {
    setReservationPermissionList((prev) => {
      return { ...prev!, [key]: val };
    });
  };

  const handleSwitchOtherPermissions = <
    K extends keyof IOtherPermission,
    V extends IOtherPermission[K],
  >(
    key: K,
    val: V,
  ) => {
    setOtherPermissionList((prev) => {
      return { ...prev!, [key]: val };
    });
  };

  const handleSubmitPermission = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!data || !companyPermissionData) return;
      const dashboardId = findId(
        companyPermissionData,
        dashboardPermissionList,
      );
      const managementId = findId(
        companyPermissionData,
        managementPermissionList,
      );
      const otherId = findId(companyPermissionData, otherPermissionList);
      const inventoryId = findId(
        companyPermissionData,
        inventoryPermissionList,
      );
      const reservationId = findId(
        companyPermissionData,
        reservationPermissionList,
      );
      const submitData: Partial<IPermissionReqObj> = {
        permissionModuleIds: dashboardId.concat(
          managementId,
          otherId,
          inventoryId,
          reservationId,
        ),
      };
      await savePermissions({ id: data.id, data: submitData })
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Permission saved successfully',
              variant: 'success',
            }),
          );
        })
        .catch((error: ErrorMessageBackendDataShape) => {
          const { title, message } = generateStatusCodesMessage(error.status);
          toast(
            generateDynamicToastMessage({
              title,
              description: `${message} "\n${error?.data?.message ?? ''}"`,
              variant: 'error',
            }),
          );
        });
    },
    [
      dashboardPermissionList,
      managementPermissionList,
      otherPermissionList,
      inventoryPermissionList,
      reservationPermissionList,
      data,
    ],
  );

  return (
    <form id="permissionForm" onSubmit={handleSubmitPermission}>
      <>
        <div className="my-3 grid grid-cols-2 gap-4">
          <InputComponent
            label="Nama"
            placeholder="Nama"
            containerStyle="gap-2 grid w-full"
            style={{ color: 'white' }}
            value={constructProperName(data?.firstname, data?.lastname)}
            disabled
          />
          <SelectComponent
            value={
              data
                ? {
                    label: data.usertype.name,
                    value: data.usertype.id,
                  }
                : null
            }
            label="Role"
            placeholder="Role..."
            options={usertypeOptions}
            disabled
          />
        </div>
        <div className="flex h-[30vh] space-x-4">
          <div className="w-1/3 overflow-y-auto overflow-x-hidden text-sm">
            <p className="mb-2 font-semibold">Dashboard</p>
            <div className="min-h-[30px] text-xs">
              {companyPermissions.dashboard.length ? (
                companyPermissions.dashboard.map((key) => {
                  let label = '';
                  let disabled = false;

                  if (DashboardPermissionName[key] !== undefined) {
                    return (
                      <div
                        key={key}
                        className="mb-2 flex w-[150px]"
                        title={label}
                      >
                        <p className="flex-1" style={{ width: 10 }}>
                          {DashboardPermissionName[key]}
                        </p>
                        <div className="flex items-center">
                          <SwitchComponent
                            id={`switch-${key}`}
                            disabled={disabled}
                            className="data-[state=checked]:bg-rs-v2-mint data-[state=unchecked]:bg-rs-v2-navy-blue-60%"
                            value={dashboardPermissionList[key]}
                            onCheckedChange={() =>
                              handleSwitchDashboardPermissions(
                                key,
                                !dashboardPermissionList[key],
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })
              ) : (
                <p className="min-h-[40px] text-gray-300">
                  Permission Access not found
                </p>
              )}
            </div>
          </div>

          <div className="w-1/3 overflow-y-auto overflow-x-hidden text-sm">
            <p className="mb-2 font-semibold">Management</p>
            <div className="text-xs">
              {companyPermissions.management.length ? (
                companyPermissions.management.map((key) => {
                  let label = '';
                  let disabled = false;

                  if (ManagementPermissionName[key] !== undefined) {
                    return (
                      <div
                        key={key}
                        className="mb-2 flex w-[150px]"
                        title={label}
                      >
                        <p className="w-100 flex-1">
                          {ManagementPermissionName[key]}
                        </p>
                        <div className="flex">
                          <SwitchComponent
                            id={`switch-${key}`}
                            disabled={disabled}
                            className="data-[state=checked]:bg-rs-v2-mint data-[state=unchecked]:bg-rs-v2-navy-blue-60%"
                            value={managementPermissionList[key]}
                            onCheckedChange={() =>
                              handleSwitchManagementPermissions(
                                key,
                                !managementPermissionList[key],
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })
              ) : (
                <p className="min-h-[40px] text-gray-300">
                  Permission Access not found
                </p>
              )}
            </div>
          </div>

          <div className="toverflow-x-hidden w-1/3 overflow-y-auto text-sm">
            <p className="mb-2 font-semibold">Inventory</p>
            <div className="text-xs">
              {companyPermissions.inventory.length ? (
                companyPermissions.inventory.map((key) => {
                  let label = '';
                  let disabled = false;

                  if (InventoryPermissionName[key] !== undefined) {
                    return (
                      <div
                        key={key}
                        className="mb-2 flex w-[150px]"
                        title={label}
                      >
                        <p className="w-100 flex-1">
                          {InventoryPermissionName[key]}
                        </p>
                        <div className="flex">
                          <SwitchComponent
                            id={`switch-${key}`}
                            disabled={disabled}
                            className="data-[state=checked]:bg-rs-v2-mint data-[state=unchecked]:bg-rs-v2-navy-blue-60%"
                            value={inventoryPermissionList[key]}
                            onCheckedChange={() =>
                              handleSwitchInventoryPermissions(
                                key,
                                !inventoryPermissionList[key],
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })
              ) : (
                <p className="min-h-[40px] text-gray-300">
                  Permission Access not found
                </p>
              )}
            </div>
            <p className="mb-2 font-semibold">Reservation</p>
            <div className="text-xs">
              {companyPermissions.reservation.length ? (
                companyPermissions.reservation.map((key) => {
                  let label = '';
                  let disabled = false;

                  if (ReservationPermissionName[key] !== undefined) {
                    return (
                      <div
                        key={key}
                        className="mb-2 flex w-[150px]"
                        title={label}
                      >
                        <p className="w-100 flex-1">
                          {ReservationPermissionName[key]}
                        </p>
                        <div className="flex">
                          <SwitchComponent
                            id={`switch-${key}`}
                            disabled={disabled}
                            className="data-[state=checked]:bg-rs-v2-mint data-[state=unchecked]:bg-rs-v2-navy-blue-60%"
                            value={reservationPermissionList[key]}
                            onCheckedChange={() =>
                              handleSwitchReservationPermissions(
                                key,
                                !reservationPermissionList[key],
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })
              ) : (
                <p className="min-h-[40px] text-gray-300">
                  Permission Access not found
                </p>
              )}
            </div>
            <p className="mb-2 font-semibold">Other</p>
            <div className="text-xs">
              {companyPermissions.other.length ? (
                companyPermissions.other.map((key) => {
                  let label = '';
                  let disabled = false;

                  if (OtherPermissionName[key] !== undefined) {
                    return (
                      <div
                        key={key}
                        className="mb-2 flex w-[150px]"
                        title={label}
                      >
                        <p className="flex-1">{OtherPermissionName[key]}</p>
                        <div className="flex items-center">
                          <SwitchComponent
                            id={`switch-${key}`}
                            disabled={disabled}
                            className="data-[state=checked]:bg-rs-v2-mint data-[state=unchecked]:bg-rs-v2-navy-blue-60%"
                            value={otherPermissionList[key]}
                            onCheckedChange={() =>
                              handleSwitchOtherPermissions(
                                key,
                                !otherPermissionList[key],
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })
              ) : (
                <p className="min-h-[30px] text-gray-300">
                  Permission Access not found
                </p>
              )}
            </div>
          </div>
        </div>
      </>
      <DrawerSubmitAction
        submitText="Save Changes"
        disabled={isLoadingCompanyPermission || isLoadingUserPermission}
        toggle={toggle}
        form="permissionForm"
      />
    </form>
  );
};

export default PermissionForm;
